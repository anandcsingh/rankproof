import { ProofOfRank } from '../ProofOfRank';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
} from 'snarkyjs';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain';
import { Sender } from '../models/Sender';
import {
  MartialArtistRepository,
  BackingStore,
} from '../models/MartialArtistRepository';
import { ProofOfRankData } from './ProofOfRankData';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore';
import { MartialArtist } from '../models/MartialArtist';
import { ProofOfBjjRank } from '../ProofOfBjjRank';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('ProofOfRank', () => {
  let senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: ProofOfRank,
    deployerAccount: Sender,
    studentAccount: Sender,
    instructorAccount: Sender;

  beforeAll(async () => {
    if (proofsEnabled) await ProofOfRank.compile();
  });

  beforeEach(() => {
    const useProof = false;
    [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(useProof).accounts;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ProofOfBjjRank(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount.publicKey, () => {
      AccountUpdate.fundNewAccount(deployerAccount.publicKey);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerAccount.privateKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `ProofOfRank` smart contract', async () => {
    await localDeploy();
    const root = zkApp.mapRoot.get();
    expect(root).toEqual(Field(new MerkleMap().getRoot()));
  });

  it('can add a new Martial Artist to a merkle tree', async () => {
    await localDeploy();

    let backingStore = new InMemoryBackingStore(
      new Map<PublicKey, MartialArtist>()
    );
    let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);
    let student = new ProofOfRankData().getStudent(studentAccount);
    let transaction = await repo.add(student);

    const updatedRoot = zkApp.mapRoot.get();
    expect(updatedRoot).toEqual(
      Field(
        '27774440201273603605801685225434590242451666559312031204682405351601519267520'
      )
    );
  });

  it('can add multiple Martial Artists to a merkle tree', async () => {
    await localDeploy();
    let backingStore = new InMemoryBackingStore(
      new Map<PublicKey, MartialArtist>()
    );
    let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);
    let student = new ProofOfRankData().getStudent(studentAccount);
    let transaction = await repo.add(student);
    let instructor = new ProofOfRankData().getInstructor(instructorAccount);
    repo.sender = instructorAccount;

    let transaction1 = await repo.add(instructor);

    const updatedRoot = zkApp.mapRoot.get();
    expect(updatedRoot).toEqual(
      Field(
        '8175502539973333070380368020793805199800622151469851803008556695806100081430'
      )
    );
  });

  it('can promote Martial Artists with a Black Belt instructor', async () => {
    await localDeploy();
    let backingStore = new InMemoryBackingStore(
      new Map<PublicKey, MartialArtist>()
    );
    let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);
    let student = new ProofOfRankData().getStudent(studentAccount);
    let transaction = await repo.add(student);

    let instructor = new ProofOfRankData().getInstructor(instructorAccount);
    repo.sender = instructorAccount;
    let transaction1 = await repo.add(instructor);
    let transaction2 = await repo.promoteStudent(
      student.publicKey,
      instructor.publicKey,
      'Purple Belt'
    );

    const updatedRoot = zkApp.mapRoot.get();
    expect(updatedRoot).toEqual(
      Field(
        '16359713713858811351375160383056711006572681991489302925328156427944453526525'
      )
    );
  });

  //   it('can NOT promote Martial Artist without Black Belt instructor', async () => {
  //     expect('nothing').not.toBe('TODO');
  //   });

  //   it('can NOT promote Martial Artist without Black Belt instructor', async () => {
  //     expect('nothing').not.toBe('TODO');
  //   });

  //   it('can NOT promote Martial Artist when instructor and sender do not match', async () => {
  //     expect('nothing').not.toBe('TODO');
  //   });
});
