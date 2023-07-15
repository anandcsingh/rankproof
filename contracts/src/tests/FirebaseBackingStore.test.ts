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

let backingStore = new FirebaseBackingStore();
let map = (await backingStore.getMerkleMap()).map;
let expectedRoot =
  '22731122946631793544306773678309960639073656601863129978322145324846701682624';
let actualRoot = map.getRoot().toString();
let emptyAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`${emptyAssertion}: Can create empty MerkleMap`);

const [deployerAccount, studentAccount, instructorAccount] =
  new MinaLocalBlockchain(false).accounts;
let data = new ProofOfRankData();
let student = data.getStudent(studentAccount);
student.id = Field(1);
await backingStore.add(student);
map = (await backingStore.getMerkleMap()).map;
expectedRoot =
  '22731122946631793544306773678309960639073656601863129978322145324846701682624';
actualRoot = map.getRoot().toString();
let addedAssertion = actualRoot == expectedRoot;
console.log(`actualRoot: ${actualRoot}`);
console.log(`${addedAssertion}: Can create MerkleMap with one Martial Artists`);

// it('can create MerkleMap with multiple Martial Artists', async () => {
//   const [deployerAccount, studentAccount, instructorAccount] =
//     new MinaLocalBlockchain(false).accounts;
//   let data = new ProofOfRankData();
//   let backingMap = new Map<PublicKey, MartialArtist>();
//   let student = data.getStudent(studentAccount);
//   let instructor = data.getInstructor(instructorAccount);
//   backingMap.set(student.publicKey, student);
//   backingMap.set(instructor.publicKey, instructor);
//   let backingStore = new InMemoryBackingStore(backingMap);
//   let map = (await backingStore.getMerkleMap()).map;
//   expect(map.getRoot().toString()).toEqual(
//     '8175502539973333070380368020793805199800622151469851803008556695806100081430'
//   );
// });

// it('can change Martial Artist and generate valid MerkleMap', async () => {
//   const [deployerAccount, studentAccount, instructorAccount] =
//     new MinaLocalBlockchain(false).accounts;
//   let data = new ProofOfRankData();
//   let backingMap = new Map<PublicKey, MartialArtist>();
//   let student = data.getStudent(studentAccount);
//   let instructor = data.getInstructor(instructorAccount);
//   backingMap.set(student.publicKey, student);
//   backingMap.set(student.publicKey, instructor);
//   let backingStore = new InMemoryBackingStore(backingMap);
//   let map = (await backingStore.getMerkleMap()).map;
//   expect(map.getRoot().toString()).toEqual(
//     '8175502539973333070380368020793805199800622151469851803008556695806100081430'
//   );

//   student.rank = CircuitString.fromString('Purple Belt');
//   backingStore.update(student);
//   map = (await backingStore.getMerkleMap()).map;
//   expect(map.getRoot().toString()).toEqual(
//     '16359713713858811351375160383056711006572681991489302925328156427944453526525'
//   );
// });
