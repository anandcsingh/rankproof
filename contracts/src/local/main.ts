import { Field, Bool, CircuitString, PublicKey } from 'snarkyjs';
import {
  MartialArtistRepository,
  BackingStore,
} from '../models/MartialArtistRepository.js';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore.js';
import { LocalContractDeployer } from './ContractInteractor.js';
import { MartialArtist } from '../models/MartialArtist.js';
import { MinaLocalBlockchain } from './MinaLocalBlockchain.js';

// deploy localy bruv
const useProof = false;
const [deployerAccount, studentAccount, instructorAccount] =
  new MinaLocalBlockchain(useProof).accounts;
const zkApp = await new LocalContractDeployer(
  deployerAccount
).deployProofofRank();

// get the initial state of Contract after deployment
const mapRoot0 = zkApp.mapRoot.get();
console.log('\nmain: state after init:', mapRoot0.toString());
let backingStore = new InMemoryBackingStore(
  new Map<PublicKey, MartialArtist>()
);
let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);

let studentData = {
  id: Field(1),
  publicKey: studentAccount.publicKey,
  rank: CircuitString.fromString('Blue Belt'),
  verified: Bool(false),
  instructor: PublicKey.empty(),
  createdDate: CircuitString.fromString('2020-01-01'),
  modifiedDate: CircuitString.fromString('2020-01-01'),
};
let student = new MartialArtist(studentData);

let transaction = await repo.add(student);
console.log(
  'Student first rank:',
  (await repo.get(student.publicKey))?.rank.toString()
);

// get the final changed value
const mapRoot = zkApp.mapRoot.get();
console.log('\nmain: state after txn:', mapRoot.toString());

// change rank
repo.sender = instructorAccount;

let instructorData = {
  id: Field(2),
  publicKey: instructorAccount.publicKey,
  rank: CircuitString.fromString('Black Belt'),
  verified: Bool(true),
  instructor: PublicKey.fromBase58(
    'B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR'
  ),
  createdDate: CircuitString.fromString('2020-01-01'),
  modifiedDate: CircuitString.fromString('2020-01-01'),
};
let instructor = new MartialArtist(instructorData);

let transaction1 = await repo.add(instructor);
console.log(
  'Instructor rank:',
  (await repo.get(instructor.publicKey))?.rank.toString()
);

const mapRoot1 = zkApp.mapRoot.get();
console.log('\nmain: state after txn 1:', mapRoot1.toString());

// promote student
let transaction2 = await repo.promoteStudent(
  student.publicKey,
  instructor.publicKey,
  'Purple Belt'
);

const mapRoot2 = zkApp.mapRoot.get();
console.log('\nmain: state after txn 2:', mapRoot2.toString());
console.log(
  'Student rank:',
  (await repo.get(student.publicKey))?.rank.toString()
);
