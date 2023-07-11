import { Field, Bool, CircuitString } from 'snarkyjs';
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
let backingStore = new InMemoryBackingStore(new Map());
let repo = new MartialArtistRepository(studentAccount, zkApp, backingStore);

let studentData = {
  id: Field(1),
  publicKey: studentAccount.publicKey,
  rank: CircuitString.fromString('Blue Belt'),
  verified: Bool(false),
};
let student = new MartialArtist(studentData);

let transaction = await repo.add(student);
console.log('Student first rank:', repo.get(1n)?.rank.toString());

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
};
let instructor = new MartialArtist(instructorData);

let transaction1 = await repo.add(instructor);
console.log('Instructor rank:', repo.get(2n)?.rank.toString());

const mapRoot1 = zkApp.mapRoot.get();
console.log('\nmain: state after txn 1:', mapRoot1.toString());

// promote student
let transaction2 = await repo.promoteStudent(1n, 2n, 'Purple Belt');

const mapRoot2 = zkApp.mapRoot.get();
console.log('\nmain: state after txn 2:', mapRoot2.toString());
console.log('Student rank:', repo.get(1n)?.rank.toString());
