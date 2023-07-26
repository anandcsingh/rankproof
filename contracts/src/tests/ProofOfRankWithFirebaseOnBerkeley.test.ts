import { ProofOfRank } from '../ProofOfRank.js';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  fetchAccount,
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
import { Add } from '../contracts/Add.js';
import { AddBjjRank } from '../AddBjjRank.js';
import { PromoteBjjStudent } from '../PromoteBjjStudent.js';

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
console.log('compiling AddBjjRank', new Date().toLocaleTimeString());
if (proofsEnabled) await AddBjjRank.compile();
console.log('AddBjjRank compiled', new Date().toLocaleTimeString());

// const zkAppAddresses = new Map<string, PublicKey>([
//   [
//     Disciplines.BJJ,
//     PublicKey.fromBase58(
//       'B62qqdeMFTd2WrS2WF75eBjFJsboTGJ4GmQZu7gPRHjwLqdKHiUDH7Q'
//     ),
//   ],
//   [
//     Disciplines.Judo,
//     PublicKey.fromBase58(
//       'B62qqr4u86qAkX3fqozshTf5FyCnYVQcRDNU9BfRc9oxMvoUME62CEv'
//     ),
//   ],
//   [
//     Disciplines.Karate,
//     PublicKey.fromBase58(
//       'B62qrXFZvymSuAMLfUiv31SV5Whj4FaGG6ozykhBg8zZbVp3dVWgCQf'
//     ),
//   ],
// ]);

studentAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
  ),
};
const Berkeley = Mina.Network(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
console.log('Berkeley Instance Created');
Mina.setActiveInstance(Berkeley);

let addbjjKey = PublicKey.fromBase58(
  'B62qnQpnwWNr7b9sbEtdQVdf8Ckprm9WGmHfk7Cum2ZLL69HaiM9R5B'
);
let zk = new AddBjjRank(addbjjKey);
console.log('zkApp created');
console.log('getting root');
await fetchAccount({ publicKey: addbjjKey });
let contractRoot = zk.mapRoot.get().toString();
console.log('contract root: ', contractRoot);

const transactionFee = 100_000_000;

let map = new MerkleMap();
let studentPublicKey = studentAccount.publicKey;
let studentHash = Field(
  '18085327542818512083285490966340387291776421371867606274687363710255283755364'
);
map.set(Field(1), studentHash);

let witness = map.getWitness(Field(1));
console.log('witness: ', witness.toString());
const txn = await Mina.transaction(
  { sender: studentAccount.publicKey, fee: transactionFee },
  () => {
    zk!.addPractitioner(
      studentHash,
      studentPublicKey,
      witness,
      Field(contractRoot)
    );
  }
);
await txn.prove();
let result = await txn.sign([studentAccount.privateKey]).send();
console.log('transaction sent');
console.log(result.hash());
console.log(result.isSuccess);

// update transaction
// const txn = await Mina.transaction(
//   { sender: studentAccount.publicKey, fee: transactionFee },
//   () => {
//   zk.setMapRoot(Field(12));

// });
// await txn.prove();
// let result = await txn.sign([studentAccount.privateKey]).send();
// console.log('transaction sent');
// console.log(result.hash());
// console.log(result.isSuccess);

// await fetchAccount({ publicKey: addbjjKey });
// contractRoot = zk.mapRoot.get().toString();
// console.log('new contract root: ', contractRoot);

// collectionName = Disciplines.Karate;
// console.log('creating proofOfRank');
// zkApp = new ProofOfKarateRankNoParent(zkAppAddresses.get(collectionName)!);
// console.log('zkApp created');
// console.log('creating backingStore');
// backingStore = new FirebaseBackingStore(collectionName);
// console.log('backingStore created');
// console.log('clearing store');
// await backingStore.clearStore();
// console.log('store cleared');
// let zkClient = new SingleContractZkClient(zkApp, studentAccount);
// zkClient.setStorageRoot(Field(new MerkleMap().getRoot()), collectionName);
// zkClient.proveUpdateTransaction();
// let response = await zkClient.sendTransaction();
// console.log('setStorageRoot: ', response.isSuccessful);
// console.log(
//   'See transaction at https://berkeley.minaexplorer.com/transaction/' +
//     response.hash
// );

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
