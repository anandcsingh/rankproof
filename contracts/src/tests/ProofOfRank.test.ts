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
import { InMemoryMaRepository } from '../models/MartialArtistRepository';
import { ProofOfRankData } from './ProofOfRankData';

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
    zkApp = new ProofOfRank(zkAppAddress);
    console.log(studentAccount.publicKey.toString());
    console.log(instructorAccount.publicKey.toString());
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
    let repo = new InMemoryMaRepository(studentAccount, zkApp);
    let student = new ProofOfRankData().getStudent(studentAccount);
    let transaction = await repo.add(student);

    const updatedRoot = zkApp.mapRoot.get();
    expect(updatedRoot).toEqual(
      Field(
        '12420879771597565761189105023823009907798980995921324458028056095204197401584'
      )
    );
  });

  it('can add multiple Martial Artists to a merkle tree', async () => {
    await localDeploy();
    let repo = new InMemoryMaRepository(studentAccount, zkApp);
    let student = new ProofOfRankData().getStudent(studentAccount);
    let transaction = await repo.add(student);
    let instructor = new ProofOfRankData().getInstructor(instructorAccount);
    let transaction1 = await repo.add(instructor);

    const updatedRoot = zkApp.mapRoot.get();
    expect(updatedRoot).toEqual(
      Field(
        '11133063107583020209552293931405715226715919965786140883172790515749876692009'
      )
    );
  });

  it('can promote Martial Artists with a Black Belt instructor', async () => {
    await localDeploy();
    let repo = new InMemoryMaRepository(studentAccount, zkApp);
    let student = new ProofOfRankData().getStudent(studentAccount);
    let transaction = await repo.add(student);
    repo.sender = instructorAccount;

    let instructor = new ProofOfRankData().getInstructor(instructorAccount);
    let transaction1 = await repo.add(instructor);
    let transaction2 = await repo.promoteStudent(1n, 2n, 'Purple Belt');

    const updatedRoot = zkApp.mapRoot.get();
    expect(updatedRoot).toEqual(
      Field(
        '8168333436050571479796841824125054328875596551216603913002069387056318891460'
      )
    );
  });

  it('can NOT promote Martial Artist without Black Belt instructor', async () => {
    expect('nothing').not.toBe('TODO');
  });

  it('can NOT promote Martial Artist without Black Belt instructor', async () => {
    expect('nothing').not.toBe('TODO');
  });

  it('can NOT promote Martial Artist when instructor and sender do not match', async () => {
    expect('nothing').not.toBe('TODO');
  });
});

expect.extend({
  alwaysFail(received, failureMessage) {
    return {
      pass: false,
      message: () =>
        failureMessage +
        (received ? '\n\nDetails:\n' + this.utils.printReceived(received) : ''),
    };
  },
});
