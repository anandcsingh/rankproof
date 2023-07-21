import { ProofOfRank } from '../ProofOfRank.js';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
} from 'snarkyjs';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';
import { Sender } from '../models/Sender.js';
import {
  MartialArtistRepository,
  BackingStore,
} from '../models/MartialArtistRepository.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore.js';
import { MartialArtist } from '../models/MartialArtist.js';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { ProofOfBjjRank } from '../ProofOfBjjRank.js';
import { ProofOfJudoRank } from '../ProofOfJudoRank.js';
import { ProofOfKarateRank } from '../ProofOfKarateRank.js';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: ProofOfRank,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;

if (proofsEnabled) await ProofOfRank.compile();

const useProof = false;
[deployerAccount, studentAccount, instructorAccount] = new MinaLocalBlockchain(
  useProof
).accounts;
zkAppPrivateKey = PrivateKey.random();
zkAppAddress = zkAppPrivateKey.toPublicKey();
zkApp = new ProofOfJudoRank(zkAppAddress);
collectionName = 'Judo';
zkApp = new ProofOfKarateRank(zkAppAddress);
collectionName = 'Karate';
//zkApp = new ProofOfBjjRank(zkAppAddress);collectionName = 'BJJ';

backingStore = new FirebaseBackingStore(collectionName);
await backingStore.clearStore();

async function localDeploy() {
  const txn = await Mina.transaction(deployerAccount.publicKey, () => {
    AccountUpdate.fundNewAccount(deployerAccount.publicKey);
    zkApp.deploy();
  });
  await txn.prove();
  // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
  await txn.sign([deployerAccount.privateKey, zkAppPrivateKey]).send();
}
await localDeploy();
let root = zkApp.mapRoot.get();
let expectedRoot = new MerkleMap().getRoot().toString();
let actualRoot = root.toString();
let emptyAssertion = actualRoot == expectedRoot;
console.log('actualRoot: ', actualRoot);
console.log(`${emptyAssertion}: Can create deploy contract`);

let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);
let student = new ProofOfRankData().getStudent(studentAccount);
let transaction = await repo.add(student);
expectedRoot =
  '27774440201273603605801685225434590242451666559312031204682405351601519267520';
actualRoot = zkApp.mapRoot.get().toString();
let addedAssertion = actualRoot == expectedRoot;
console.log('actualRoot: ', actualRoot);
console.log(`${addedAssertion}: Can add a new Martial Artist to a merkle tree`);

let instructor = new ProofOfRankData().getInstructor(instructorAccount);
repo.sender = instructorAccount;

let transaction1 = await repo.add(instructor);
expectedRoot =
  '8175502539973333070380368020793805199800622151469851803008556695806100081430';
actualRoot = zkApp.mapRoot.get().toString();
addedAssertion = actualRoot == expectedRoot;
console.log('actualRoot: ', actualRoot);
console.log(
  `${addedAssertion}: Can add a multiple Martial Artist to a merkle tree`
);

let transaction2 = await repo.promoteStudent(
  student.publicKey,
  instructor.publicKey,
  'Purple Belt'
);
expectedRoot =
  '16359713713858811351375160383056711006572681991489302925328156427944453526525';
actualRoot = zkApp.mapRoot.get().toString();
addedAssertion = actualRoot == expectedRoot;
console.log('actualRoot: ', actualRoot);
console.log(
  `${addedAssertion}: Can promote Martial Artists with a Black Belt instructor`
);
//backingStore.clearStore();
