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
  Disciplines,
} from '../models/MartialArtistRepository.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore.js';
import { MartialArtist } from '../models/MartialArtist.js';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { ProofOfBjjRank } from '../ProofOfBjjRank.js';
import { ProofOfJudoRank } from '../ProofOfJudoRank.js';
import { ProofOfKarateRankNoParent } from '../ProofOfKarateRankNoParent.js';
import { SingleContractZkClient } from '../models/ZkClient.js';
import { FirebaseDataGenerator } from '../models/firebase/FirebaseDataGenerator.js';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = true;

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: ProofOfKarateRankNoParent,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;
console.log('compiling zkApp');
if (proofsEnabled) await ProofOfKarateRankNoParent.compile();
console.log('zkApp compiled');

const zkAppAddresses = new Map<string, PublicKey>([
  [
    Disciplines.BJJ,
    PublicKey.fromBase58(
      'B62qqdeMFTd2WrS2WF75eBjFJsboTGJ4GmQZu7gPRHjwLqdKHiUDH7Q'
    ),
  ],
  [
    Disciplines.Judo,
    PublicKey.fromBase58(
      'B62qqr4u86qAkX3fqozshTf5FyCnYVQcRDNU9BfRc9oxMvoUME62CEv'
    ),
  ],
  [
    Disciplines.Karate,
    PublicKey.fromBase58(
      'B62qrXFZvymSuAMLfUiv31SV5Whj4FaGG6ozykhBg8zZbVp3dVWgCQf'
    ),
  ],
]);

studentAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
  ),
};

collectionName = Disciplines.Karate;
console.log('creating proofOfRank');
zkApp = new ProofOfKarateRankNoParent(zkAppAddresses.get(collectionName)!);
console.log('zkApp created');
console.log('creating backingStore');
backingStore = new FirebaseBackingStore(collectionName);
console.log('backingStore created');
console.log('clearing store');
await backingStore.clearStore();
console.log('store cleared');
let zkClient = new SingleContractZkClient(zkApp, studentAccount);
zkClient.setStorageRoot(Field(new MerkleMap().getRoot()), collectionName);
zkClient.proveUpdateTransaction();
let response = await zkClient.sendTransaction();
console.log('setStprageRoot: ', response.isSuccessful);
console.log(
  'See transaction at https://berkeley.minaexplorer.com/transaction/' +
    response.hash
);

// let repo = new MartialArtistRepository(zkClient, backingStore);
// let student = new ProofOfRankData().getStudent(studentAccount);
// student.discipline = CircuitString.fromString(collectionName);
// await repo.add(student);
// let backingStoreRoot = (await repo.backingStore.getMerkleMap()).map
//   .getRoot()
//   .toString();
// let contractRoot = zkApp.mapRoot.get().toString();
// let addedAssertion = contractRoot == backingStoreRoot;
// console.log('contract root: ', contractRoot);
// console.log('backing store root: ', backingStoreRoot);
// console.log(`${addedAssertion}: Can add a new Martial Artist to a merkle tree`);

// let instructor = new ProofOfRankData().getInstructor(instructorAccount);
// zkClient.sender = instructorAccount;
// instructor.discipline = CircuitString.fromString(collectionName);
// let transaction1 = await repo.add(instructor);
// backingStoreRoot = (await repo.backingStore.getMerkleMap()).map
//   .getRoot()
//   .toString();
// contractRoot = zkApp.mapRoot.get().toString();
// addedAssertion = contractRoot == backingStoreRoot;
// console.log('contract root: ', contractRoot);
// console.log(
//   `${addedAssertion}: Can add a multiple Martial Artist to a merkle tree`
// );

// let transaction2 = await repo.promoteStudent(
//   student.publicKey,
//   instructor.publicKey,
//   'Purple Belt'
// );
// backingStoreRoot = (await repo.backingStore.getMerkleMap()).map
//   .getRoot()
//   .toString();
// contractRoot = zkApp.mapRoot.get().toString();
// addedAssertion = contractRoot == backingStoreRoot;
// console.log('contract root: ', contractRoot);
// console.log(
//   `${addedAssertion}: Can promote Martial Artists with a Black Belt instructor`
// );
// //backingStore.clearStore();

// // tests with existing data
// let backingStore1 = new FirebaseBackingStore(collectionName);

// let zkClient2 = new SingleContractZkClient(zkApp, studentAccount);
// let repo1 = new MartialArtistRepository(zkClient, backingStore1);
// let zkAppRoot = zkApp.mapRoot.get().toString();
// backingStoreRoot = (await repo1.backingStore.getMerkleMap()).map
//   .getRoot()
//   .toString();
// let rootAssertion = zkAppRoot == backingStoreRoot;
// console.log('zkAppRoot: ', zkAppRoot);
// console.log('backingStoreRoot: ', backingStoreRoot);
// console.log(
//   `${rootAssertion} : Can get the same root from zkApp and backingStore`
// );

// // test setStorageRoot

// let backingStore2 = new FirebaseBackingStore(collectionName);
// await backingStore2.clearStore();
// let dataGen = new FirebaseDataGenerator(backingStore2);
// await dataGen.generateData(collectionName, 2, 2);

// let zkClient3 = new SingleContractZkClient(zkApp, studentAccount);
// let repo2 = new MartialArtistRepository(zkClient3, backingStore2);

// let exisingBackingStoreRootField = (
//   await repo2.backingStore.getMerkleMap()
// ).map.getRoot();
// let existingBackingStoreRoot = exisingBackingStoreRootField.toString();
// console.log('existingBackingStoreRoot: ', existingBackingStoreRoot);

// let newContractRoot = zkApp.mapRoot.get().toString();
// console.log('newContractRoot: ', newContractRoot);
// let rootAssertion2 = newContractRoot != existingBackingStoreRoot;
// console.log(
//   `${rootAssertion2}: New contract root is different from existing backing store root `
// );
// console.log('newContractRoot: ', newContractRoot);
// console.log('existingBackingStoreRoot: ', existingBackingStoreRoot);

// await zkClient3.setStorageRoot(exisingBackingStoreRootField, collectionName);
// await zkClient3.proveUpdateTransaction();
// let response = await zkClient3.sendTransaction();
// let changedContractRoot = zkApp.mapRoot.get().toString();
// let rootAssertion3 = changedContractRoot == existingBackingStoreRoot;
// console.log(`${rootAssertion3} : Can set the storage root of a contract`);
// console.log(
//   `${rootAssertion3} : Can get the same root from zkApp and backingStore after deploying a new contract`
// );
