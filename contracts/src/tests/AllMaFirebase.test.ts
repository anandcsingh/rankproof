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
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { AllMartialArts } from '../AllMartialArts.js';
import { FirebaseDataGenerator } from '../models/firebase/FirebaseDataGenerator.js';

let proofsEnabled = false;

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: AllMartialArts,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;

if (proofsEnabled) await AllMartialArts.compile();

const useProof = false;
[deployerAccount, studentAccount, instructorAccount] = new MinaLocalBlockchain(
  useProof
).accounts;
zkAppPrivateKey = PrivateKey.random();
zkAppAddress = zkAppPrivateKey.toPublicKey();

zkApp = new AllMartialArts(zkAppAddress);
collectionName = 'BJJ';

async function localDeploy() {
  const txn = await Mina.transaction(deployerAccount.publicKey, () => {
    AccountUpdate.fundNewAccount(deployerAccount.publicKey);
    zkApp.deploy();
  });
  await txn.prove();
  // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
  await txn.sign([deployerAccount.privateKey, zkAppPrivateKey]).send();
}

// deploy zkApp
backingStore = new FirebaseBackingStore(collectionName);
await backingStore.clearStore();
await localDeploy();
let root = zkApp.bjjMapRoot.get();
let backingStoreRoot = new MerkleMap().getRoot().toString();
let contractRoot = root.toString();
let emptyAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log(`${emptyAssertion}: Can create deploy contract`);

// Add single student
console.log('adding student');
let student = new ProofOfRankData().getStudent(studentAccount);
student.discipline = CircuitString.fromString(collectionName);

let merkleStore = await backingStore.getMerkleMap();
let currentRoot = merkleStore.map.getRoot();
student.id = Field(merkleStore.nextID);
console.log('student.id: ', student.id.toString());
let hash = student.hash();
console.log('hash: ', hash.toString());

merkleStore.map.set(student.id, hash);
let witness = merkleStore.map.getWitness(student.id);

let txn = await Mina.transaction({ sender: studentAccount.publicKey }, () => {
  zkApp.addJuijiteiro(hash, student.publicKey, witness, currentRoot);
});
await txn.prove();
let result = await txn.sign([studentAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);

await backingStore.upsert(student);
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
let addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Can add a new Martial Artist to a merkle tree`);

// Add single instructor
console.log('adding instructor');
let instructor = new ProofOfRankData().getInstructor(instructorAccount);
instructor.discipline = CircuitString.fromString(collectionName);

merkleStore = await backingStore.getMerkleMap();
currentRoot = merkleStore.map.getRoot();
instructor.id = Field(merkleStore.nextID);
console.log('student.id: ', instructor.id.toString());
hash = instructor.hash();
console.log('hash: ', hash.toString());

merkleStore.map.set(instructor.id, hash);
witness = merkleStore.map.getWitness(instructor.id);

txn = await Mina.transaction({ sender: instructorAccount.publicKey }, () => {
  zkApp.addJuijiteiro(hash, instructor.publicKey, witness, currentRoot);
});
await txn.prove();
result = await txn.sign([instructorAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);

await backingStore.upsert(instructor);
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(
  `${addedAssertion}: Can add a multiple Martial Artists to a merkle tree`
);

// Promote student
console.log('promoting student');
merkleStore = await backingStore.getMerkleMap();
currentRoot = merkleStore.map.getRoot();
student.instructor = instructor.publicKey;
student.rank = CircuitString.fromString('Purple Belt');
hash = student.hash();
console.log('hash: ', hash.toString());

merkleStore.map.set(student.id, hash);
witness = merkleStore.map.getWitness(student.id);
// console.log('witness: ', Field(witness.toString()).toString());
// console.log('currentRoot: ', currentRoot.toString());
// console.log('hash: ', hash.toString());
// console.log("student key: ", student.publicKey.toString());
// console.log("instructor key: ", instructor.publicKey.toString());
// console.log("instructor rank: ", instructor.rank.toString());
txn = await Mina.transaction({ sender: instructor.publicKey }, () => {
  zkApp.promoteJuijiteiro(
    hash,
    student.publicKey,
    instructor.publicKey,
    instructor.rank,
    witness,
    currentRoot
  );
});
await txn.prove();
result = await txn.sign([instructorAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);

await backingStore.upsert(student);
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Promote Martial Artist`);

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
