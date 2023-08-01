// import { ProofOfRank } from '../ProofOfRank';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  Bool,
} from 'snarkyjs';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';
import { tr } from '@faker-js/faker';
let collectionName = 'BJJ';
let backingStore = new FirebaseBackingStore(collectionName);
await backingStore.clearStore();
let map = (await backingStore.getMerkleMap()).map;
let expectedRoot = Field(new MerkleMap().getRoot()).toString();
let actualRoot = map.getRoot().toString();
console.log('Empty root: ', actualRoot);

let rootNode = {
  id: 1,
  publicKey: 'B62qikdZJTeh7toNWtckkRtDBnnCNT4EPjhy6stYuND2uGjLgueRvT3',
  firstName: 'Helio',
  lastName: 'Gracie',
  rank: 'Red Belt',
  verified: true,
  instructor: '',
  createdDate: '',
  modifiedDate: '',
  discipline: collectionName,
};
let root = await backingStore.getMartialArtistFromDocSnap(rootNode);
await backingStore.upsert(root);
map = (await backingStore.getMerkleMap()).map;
actualRoot = map.getRoot().toString();
console.log('Root with Helio: ', actualRoot);

const minalocal = new MinaLocalBlockchain(false);
const [deployerAccount, studentAccount, instructorAccount] = minalocal.accounts;
let data = new ProofOfRankData();
let instructor = data.getInstructor(instructorAccount);
instructor.instructor = root.publicKey;
instructor.id = Field(2);
await backingStore.upsert(instructor);
map = (await backingStore.getMerkleMap()).map;
actualRoot = map.getRoot().toString();
console.log(
  'Root with Verified Black Belt: ',
  actualRoot,
  'public key: ',
  instructor.publicKey.toBase58()
);

let student = data.getStudent(studentAccount);
// student.verified = Bool(true);
// student.instructor = instructorAccount.publicKey;
student.id = Field(3);
await backingStore.upsert(student);
map = (await backingStore.getMerkleMap()).map;
actualRoot = map.getRoot().toString();
console.log(
  'Root with Unverified Rank: ',
  actualRoot,
  'public key: ',
  student.publicKey.toBase58()
);

let newStudent = data.getStudent(minalocal.newStudent);

newStudent.verified = Bool(true);
newStudent.instructor = instructorAccount.publicKey;
newStudent.id = Field(4);
await backingStore.upsert(newStudent);
map = (await backingStore.getMerkleMap()).map;
actualRoot = map.getRoot().toString();
console.log(
  'Root with verified rank and instructor: ',
  actualRoot,
  'public key: ',
  newStudent.publicKey.toBase58()
);
