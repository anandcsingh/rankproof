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
let emptyAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`expectedRoot: ${expectedRoot}`);
console.log(`${emptyAssertion}: Can create empty MerkleMap`);

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
console.log('root key', root.publicKey.toBase58());
const minalocal = new MinaLocalBlockchain(false);
const [deployerAccount, studentAccount, instructorAccount] = minalocal.accounts;
let data = new ProofOfRankData();
let student = data.getStudent(studentAccount);
student.verified = Bool(true);
student.instructor = instructorAccount.publicKey;
student.id = Field(2);
await backingStore.upsert(student);
map = (await backingStore.getMerkleMap()).map;
expectedRoot =
  '27774440201273603605801685225434590242451666559312031204682405351601519267520';
actualRoot = map.getRoot().toString();
let addedAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`expectedRoot: ${expectedRoot}`);
console.log(`${addedAssertion}: Can create MerkleMap with one Martial Artists`);

let newStudent = data.getStudent(minalocal.newStudent);

newStudent.verified = Bool(true);
newStudent.instructor = instructorAccount.publicKey;
newStudent.id = Field(2);
await backingStore.upsert(newStudent);

let instructor = data.getInstructor(instructorAccount);
instructor.instructor = root.publicKey;
instructor.id = Field(3);
await backingStore.upsert(instructor);
map = (await backingStore.getMerkleMap()).map;
expectedRoot =
  '8175502539973333070380368020793805199800622151469851803008556695806100081430';
actualRoot = map.getRoot().toString();
addedAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`expectedRoot: ${expectedRoot}`);
console.log(
  `${addedAssertion}: Can create MerkleMap with multiple Martial Artists`
);

let studentRetrieved = await backingStore.get(student.publicKey);
if (studentRetrieved) {
  studentRetrieved.rank = CircuitString.fromString('Purple Belt');
  await backingStore.upsert(studentRetrieved);
  map = (await backingStore.getMerkleMap()).map;
  expectedRoot =
    '16359713713858811351375160383056711006572681991489302925328156427944453526525';
  actualRoot = map.getRoot().toString();
  addedAssertion = actualRoot == expectedRoot;
  console.log(`actualRoot: ${actualRoot}`);
  console.log(`expectedRoot: ${expectedRoot}`);
  console.log(
    `${addedAssertion}: Can change Martial Artist and generate valid MerkleMap`
  );
}

let all = await backingStore.getAll();
let expectedSize = 2;
let actualSize = all.size;
let sizeAssertion = actualSize == expectedSize;
console.log(
  `${sizeAssertion}: Can get all Martial Artists from FirebaseBackingStore`
);

//await backingStore.clearStore();
