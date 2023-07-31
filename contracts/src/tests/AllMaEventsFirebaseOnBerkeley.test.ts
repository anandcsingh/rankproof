import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  fetchAccount,
  Bool,
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
import { tr } from '@faker-js/faker';
import PromptSync from 'prompt-sync';
import { AllMartialArtsEvents } from '../AllMartialArtsEvents.js';

let prompt = PromptSync();

const contractAddress = PublicKey.fromBase58(
  'B62qkDQqHBkiL6bXWh2RU81C1fBLQqQVK3CMVmW7DAq1yiAg2QPRtdC'
);
console.log('compiling AllMartialArtsEvents', new Date().toLocaleTimeString());
await AllMartialArtsEvents.compile();
console.log('AllMartialArtsEvents compiled', new Date().toLocaleTimeString());
const Berkeley = Mina.Network(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
Mina.setActiveInstance(Berkeley);
console.log('fetching account');
await fetchAccount({ publicKey: contractAddress });
console.log('account fetched');
let studentAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qjBcYihfVGHyQGuxgG5m4QbPrq6jEEMys5p4fe4Pt33CmWy7Bvuq'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFUES7YfgYm38njcBHzxyU6RPZQdZnfThcMzLrHL9LjyxJKfXzY'
  ),
};
let instructorAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
  ),
};
const transactionFee = 100_000_000;

let zkApp = new AllMartialArtsEvents(contractAddress);
let collectionName = 'BJJ';

// deploy zkApp
let backingStore = new FirebaseBackingStore(collectionName);
await backingStore.clearStore();

let root = zkApp.bjjMapRoot.get();
let backingStoreRoot = new MerkleMap().getRoot().toString();
let contractRoot = root.toString();
let emptyAssertion = contractRoot == backingStoreRoot;

if (!emptyAssertion) {
  // sync zkApp with backingStore
  let backingStoreMap = await backingStore.getMerkleMap();

  let txn = await Mina.transaction(
    { sender: studentAccount.publicKey, fee: transactionFee },
    () => {
      zkApp.setbBjjMapRoot(backingStoreMap.map.getRoot());
    }
  );
  await txn.prove();
  let result = await txn.sign([studentAccount.privateKey]).send();
  console.log('transaction sent: ', result.isSuccess);
  console.log('hash: ', result.hash());
  console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);
}

let question = prompt('Transaction completed? ');

contractRoot = zkApp.bjjMapRoot.get().toString();
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
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

let txn = await Mina.transaction(
  { sender: studentAccount.publicKey, fee: transactionFee },
  () => {
    zkApp.addJuijiteiro(hash, student.publicKey, witness, currentRoot);
  }
);
await txn.prove();
let result = await txn.sign([studentAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);
console.log('hash: ', result.hash());
console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);

await backingStore.upsert(student);
question = prompt('Transaction completed? ');

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

txn = await Mina.transaction(
  { sender: instructor.publicKey, fee: transactionFee },
  () => {
    zkApp.addJuijiteiro(hash, instructor.publicKey, witness, currentRoot);
  }
);
await txn.prove();
result = await txn.sign([instructorAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);
console.log('hash: ', result.hash());
console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);

await backingStore.upsert(instructor);

question = prompt('Transaction completed? ');
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
txn = await Mina.transaction(
  { sender: instructor.publicKey, fee: transactionFee },
  () => {
    zkApp.promoteJuijiteiro(
      hash,
      student.publicKey,
      instructor.publicKey,
      instructor.rank,
      witness,
      currentRoot
    );
  }
);
await txn.prove();
result = await txn.sign([instructorAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);
console.log('hash: ', result.hash());
console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);

await backingStore.upsert(student);

question = prompt('Transaction completed? ');
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Promote Martial Artist`);
question = prompt('Transaction completed? ');

// Prove Martial Artist rank

console.log('Prove student rank');
merkleStore = await backingStore.getMerkleMap();
currentRoot = merkleStore.map.getRoot();
witness = merkleStore.map.getWitness(student.id);

let inquirer = PublicKey.fromBase58(
  'B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR'
);
txn = await Mina.transaction(
  { sender: student.publicKey, fee: transactionFee },
  () => {
    zkApp.proveJuijiteiro(student.publicKey, hash, inquirer, witness);
  }
);
await txn.prove();
result = await txn.sign([studentAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);
console.log('hash: ', result.hash());
console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);

await backingStore.upsert(student);

question = prompt('Transaction completed? ');
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Prove Martial Artist rank`);
question = prompt('Transaction completed? ');

// Revoke student
console.log('promoting student');
merkleStore = await backingStore.getMerkleMap();
currentRoot = merkleStore.map.getRoot();
student.instructor = instructor.publicKey;
student.verified = Bool(false);
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
txn = await Mina.transaction(
  { sender: instructor.publicKey, fee: transactionFee },
  () => {
    zkApp.revokeJuijiteiro(
      hash,
      student.publicKey,
      student.instructor,
      instructor.publicKey,
      instructor.rank,
      witness,
      currentRoot
    );
  }
);
await txn.prove();
result = await txn.sign([instructorAccount.privateKey]).send();
console.log('transaction sent: ', result.isSuccess);
console.log('hash: ', result.hash());
console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);

await backingStore.upsert(student);

question = prompt('Transaction completed? ');
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
contractRoot = zkApp.bjjMapRoot.get().toString();
addedAssertion = contractRoot == backingStoreRoot;
console.log('contract root: ', contractRoot);
console.log('backing store root: ', backingStoreRoot);
console.log(`${addedAssertion}: Revoke Martial Artist`);
question = prompt('Transaction completed? ');
