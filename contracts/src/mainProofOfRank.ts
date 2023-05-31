// import { HasMerkleMapContract } from './merkle-map-contract.js';
import {
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  MerkleMap,
  Bool,
  CircuitString,
} from 'snarkyjs';
import { InMemoryMaRepository } from './MartialArtistRepository.js';
import { ProofOfRank } from './index.js';
import {
  ContractInteractor,
  LocalContractDeployer,
} from './ContractInteractor.js';
import { MartialArtist } from './ProofOfRank.js';

/*******************************************************************************
 * 1) Setup initial enviro and test accounts
 ******************************************************************************/

//await isReady; // deprecated in 0.10
console.log('\n\nmain: SnarkyJS loaded');

const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const deployerAccount = ({
  privateKey: Local.testAccounts[0].privateKey,
  publicKey: Local.testAccounts[0].publicKey,
} = Local.testAccounts[0]);
const sender = ({
  privateKey: Local.testAccounts[0].privateKey,
  publicKey: Local.testAccounts[0].publicKey,
} = Local.testAccounts[1]);

/*******************************************************************************
 * 2) Deploy the zkApp
 ******************************************************************************/

// Create a public/private key pair.
// The public key is your address and where you deploy the zkApp to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppAccount = { privateKey: zkAppPrivateKey, publicKey: zkAppAddress };
// create an instance of Square
const zkApp = new ProofOfRank(zkAppAddress);

const deployer = new LocalContractDeployer(deployerAccount, zkAppAccount);
const txn = await deployer.deployContract(zkApp);
console.log('\nmain: transaction create deployTxn=', txn.isSuccess);

// get the initial state of Contract after deployment
const mapRoot0 = zkApp.mapRoot.get();
console.log('\nmain: state after init:', mapRoot0.toString());

let interactor = new ContractInteractor(sender);
let repo = new InMemoryMaRepository(sender, zkApp);

let studentData = {
  id: Field(1),
  publicKey: sender.publicKey,
  rank: CircuitString.fromString('Blue Belt'),
  verified: Bool(false),
};
let student = new MartialArtist(studentData);

let transaction = await repo.add(student);
console.log(`\nmain: transaction repo.add=`, JSON.stringify(transaction));

// get the final changed value
const mapRoot = zkApp.mapRoot.get();
console.log('\nmain: state after txn:', mapRoot.toString());
