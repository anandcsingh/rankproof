import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  Bool,
  fetchAccount,
} from 'snarkyjs';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';
import { Sender } from '../models/Sender.js';
import {
  MartialArtistRepository,
  BackingStore,
} from '../models/MartialArtistRepository.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { AllMartialArts } from '../AllMartialArts.js';
import { FirebaseDataGenerator } from '../models/firebase/FirebaseDataGenerator.js';
import { AllMartialArtsEvents } from '../AllMartialArtsEvents.js';

const runOnBerekley = true;
const contractAddress =
  'B62qkDQqHBkiL6bXWh2RU81C1fBLQqQVK3CMVmW7DAq1yiAg2QPRtdC';

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: AllMartialArtsEvents,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;

[deployerAccount, studentAccount, instructorAccount] = new MinaLocalBlockchain(
  runOnBerekley
).accounts;
zkAppPrivateKey = PrivateKey.random();
zkAppAddress = zkAppPrivateKey.toPublicKey();

if (runOnBerekley) {
  const Berkeley = Mina.Network(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  console.log('Berkeley Instance Created');
  Mina.setActiveInstance(Berkeley);
  zkAppAddress = PublicKey.fromBase58(contractAddress);
  await fetchAccount({ publicKey: zkAppAddress });
  studentAccount = {
    publicKey: PublicKey.fromBase58(
      'B62qjBcYihfVGHyQGuxgG5m4QbPrq6jEEMys5p4fe4Pt33CmWy7Bvuq'
    ),
    privateKey: PrivateKey.fromBase58(
      'EKFUES7YfgYm38njcBHzxyU6RPZQdZnfThcMzLrHL9LjyxJKfXzY'
    ),
  };
  instructorAccount = {
    publicKey: PublicKey.fromBase58(
      'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
    ),
    privateKey: PrivateKey.fromBase58(
      'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
    ),
  };
}

if (runOnBerekley) {
  console.log(
    'compiling AllMartialArtsEvents',
    new Date().toLocaleTimeString()
  );
  await AllMartialArtsEvents.compile();
  console.log('AllMartialArtsEvents compiled', new Date().toLocaleTimeString());
}

zkApp = new AllMartialArtsEvents(zkAppAddress);
collectionName = 'BJJ';

// async function localDeploy() {
//   const txn = await Mina.transaction(deployerAccount.publicKey, () => {
//     AccountUpdate.fundNewAccount(deployerAccount.publicKey);
//     zkApp.deploy();
//   });
//   await txn.prove();
//   // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
//   await txn.sign([deployerAccount.privateKey, zkAppPrivateKey]).send();
// }

// if (!runOnBerekley) {
//   await localDeploy();
// }

// Deploy empty contract
const transactionFee = 100_000_000;

backingStore = new FirebaseBackingStore(collectionName);
await backingStore.clearStore();
let root = zkApp.bjjMapRoot.get();
let backingStoreRoot = new MerkleMap().getRoot().toString();
let contractRoot = root.toString();
let emptyAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
if (!runOnBerekley) {
  console.log(`${emptyAssertion}: Can create deploy contract`);
}
// Add a student
let student = new ProofOfRankData().getStudent(studentAccount);
student.discipline = CircuitString.fromString(collectionName);

let merkleStore = await backingStore.getMerkleMap();
let currentRoot = merkleStore.map.getRoot();
student.id = Field(merkleStore.nextID);
console.log('student.id: ', student.id.toString());
console.log('student.rank: ', student.rank.toString());
console.log('student.instructor: ', student.instructor.toBase58());
let hash = student.hash();
console.log('hash: ', hash.toString());

merkleStore.map.set(student.id, hash);
let witness = merkleStore.map.getWitness(student.id);
console.log('student public key: ', student.publicKey.toBase58());
console.log('student private key: ', studentAccount.privateKey.toBase58());
let txn = await Mina.transaction(
  { sender: studentAccount.publicKey, fee: transactionFee },
  () => {
    zkApp.addJuijiteiro(hash, student.publicKey, witness, currentRoot);
  }
);
await txn.prove();
let result = await txn.sign([studentAccount.privateKey]).send();

await backingStore.upsert(student);
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
let addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Can add a new Martial Artist to a merkle tree`);

// // Add an instructor
// let instructor = new ProofOfRankData().getInstructor(instructorAccount);
// instructor.discipline = CircuitString.fromString(collectionName);

// merkleStore = await backingStore.getMerkleMap();
// currentRoot = merkleStore.map.getRoot();
// instructor.id = Field(merkleStore.nextID);
// console.log('student.id: ', instructor.id.toString());
// hash = instructor.hash();
// console.log('hash: ', hash.toString());

// merkleStore.map.set(instructor.id, hash);
// witness = merkleStore.map.getWitness(instructor.id);

// txn = await Mina.transaction({ sender: instructorAccount.publicKey }, () => {
//   zkApp.addJuijiteiro(hash, instructor.publicKey, witness, currentRoot);
// });
// await txn.prove();
// result = await txn.sign([instructorAccount.privateKey]).send();

// await backingStore.upsert(instructor);
// backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
// contractRoot = zkApp.bjjMapRoot.get().toString();
// addedAssertion = contractRoot == backingStoreRoot;
// console.log('contract root: ', contractRoot);
// console.log('backing store root: ', backingStoreRoot);
// console.log(
//   `${addedAssertion}: Can add a multiple Martial Artists to a merkle tree`
// );

// // Promote a student
// merkleStore = await backingStore.getMerkleMap();
// currentRoot = merkleStore.map.getRoot();

// witness = merkleStore.map.getWitness(student.id);

// student.rank = CircuitString.fromString("Purple Belt");
// student.instructor = instructor.publicKey;
// student.verified = Bool(true);

// hash = student.hash();

// txn = await Mina.transaction({ sender: instructorAccount.publicKey }, () => {
//   zkApp!.promoteJuijiteiro(hash, student.publicKey, instructor.publicKey, instructor.rank, witness, currentRoot);
// });
// await txn.prove();
// result = await txn.sign([instructorAccount.privateKey]).send();

// await backingStore.upsert(student);
// backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
// contractRoot = zkApp.bjjMapRoot.get().toString();
// addedAssertion = contractRoot == backingStoreRoot;
// console.log('contract root: ', contractRoot);
// console.log('backing store root: ', backingStoreRoot);
// console.log(
//   `${addedAssertion}: Can promote a student`
// );

// // Revoke a student
// merkleStore = await backingStore.getMerkleMap();
// currentRoot = merkleStore.map.getRoot();

// witness = merkleStore.map.getWitness(student.id);

// student.verified = Bool(false);

// hash = student.hash();

// txn = await Mina.transaction({ sender: instructorAccount.publicKey }, () => {
//   zkApp!.revokeJuijiteiro(hash, student.publicKey, student.instructor, instructor.publicKey, instructor.rank, witness, currentRoot);
// });
// await txn.prove();
// result = await txn.sign([instructorAccount.privateKey]).send();

// await backingStore.upsert(student);
// backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
// contractRoot = zkApp.bjjMapRoot.get().toString();
// addedAssertion = contractRoot == backingStoreRoot;
// console.log('contract root: ', contractRoot);
// console.log('backing store root: ', backingStoreRoot);
// console.log(
//   `${addedAssertion}: Can revoke a student`
// );

// // prove student rank
// merkleStore = await backingStore.getMerkleMap();
// currentRoot = merkleStore.map.getRoot();

// witness = merkleStore.map.getWitness(student.id);

// hash = student.hash();

// txn = await Mina.transaction({ sender: instructorAccount.publicKey }, () => {
//   zkApp!.proveJuijiteiro(student.publicKey, hash, student.instructor, witness);
// });
// await txn.prove();
// result = await txn.sign([instructorAccount.privateKey]).send();

// console.log(
//   `${addedAssertion}: Can prove a student`
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
