// import { ProofOfRank } from '../ProofOfRank';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
} from 'snarkyjs';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';
let collectionName = 'BJJ';
let backingStore = new FirebaseBackingStore(collectionName);
backingStore.clearStore();
let map = (await backingStore.getMerkleMap()).map;
let expectedRoot = Field(new MerkleMap().getRoot()).toString();
let actualRoot = map.getRoot().toString();
let emptyAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`${emptyAssertion}: Can create empty MerkleMap`);

const [deployerAccount, studentAccount, instructorAccount] =
  new MinaLocalBlockchain(false).accounts;
let data = new ProofOfRankData();
let student = data.getStudent(studentAccount);
student.id = Field(1);
await backingStore.upsert(student);
map = (await backingStore.getMerkleMap()).map;
expectedRoot =
  '27774440201273603605801685225434590242451666559312031204682405351601519267520';
actualRoot = map.getRoot().toString();
let addedAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`${addedAssertion}: Can create MerkleMap with one Martial Artists`);

let instructor = data.getInstructor(instructorAccount);
await backingStore.upsert(instructor);
map = (await backingStore.getMerkleMap()).map;
expectedRoot =
  '8175502539973333070380368020793805199800622151469851803008556695806100081430';
actualRoot = map.getRoot().toString();
addedAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(
  `${addedAssertion}: Can create MerkleMap with multiple Martial Artists`
);

let studentRetrieved = await backingStore.get(student.publicKey);
if (studentRetrieved) {
  studentRetrieved.rank = CircuitString.fromString('Purple Belt');
  await backingStore.update(studentRetrieved);
  map = (await backingStore.getMerkleMap()).map;
  expectedRoot =
    '16359713713858811351375160383056711006572681991489302925328156427944453526525';
  actualRoot = map.getRoot().toString();
  addedAssertion = actualRoot == expectedRoot;
  console.log(`actualRoot: ${actualRoot}`);
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

backingStore.clearStore();
