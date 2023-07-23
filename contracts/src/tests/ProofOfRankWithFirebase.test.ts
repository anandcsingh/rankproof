import { ProofOfRank } from '../ProofOfRank.js';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
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
let backingStoreRoot = new MerkleMap().getRoot().toString();
let contractRoot = root.toString();
let emptyAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log(`${emptyAssertion}: Can create deploy contract`);

let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);
let student = new ProofOfRankData().getStudent(studentAccount);
student.discipline = CircuitString.fromString(collectionName);
let transaction = await repo.add(student);
backingStoreRoot = (await repo.backingStore.getMerkleMap()).map
  .getRoot()
  .toString();
contractRoot = zkApp.mapRoot.get().toString();
let addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Can add a new Martial Artist to a merkle tree`);

let instructor = new ProofOfRankData().getInstructor(instructorAccount);
repo.sender = instructorAccount;
instructor.discipline = CircuitString.fromString(collectionName);
let transaction1 = await repo.add(instructor);
backingStoreRoot = (await repo.backingStore.getMerkleMap()).map
  .getRoot()
  .toString();
contractRoot = zkApp.mapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log(
  `${addedAssertion}: Can add a multiple Martial Artist to a merkle tree`
);

let transaction2 = await repo.promoteStudent(
  student.publicKey,
  instructor.publicKey,
  'Purple Belt'
);
backingStoreRoot = (await repo.backingStore.getMerkleMap()).map
  .getRoot()
  .toString();
contractRoot = zkApp.mapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log(
  `${addedAssertion}: Can promote Martial Artists with a Black Belt instructor`
);
//backingStore.clearStore();

// tests with existing data
let backingStore1 = new FirebaseBackingStore(collectionName);
let repo1 = new MartialArtistRepository(studentAccount, zkApp, backingStore1);
let zkAppRoot = zkApp.mapRoot.get().toString();
backingStoreRoot = (await repo1.backingStore.getMerkleMap()).map
  .getRoot()
  .toString();
let rootAssertion = zkAppRoot == backingStoreRoot;
console.log('zkAppRoot: ', zkAppRoot);
console.log('backingStoreRoot: ', backingStoreRoot);
console.log(
  `${rootAssertion} : Can get the same root from zkApp and backingStore`
);
