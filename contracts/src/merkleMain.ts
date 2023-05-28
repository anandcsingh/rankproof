import { MerkleRank, MyMerkleWitness } from './MerkleRank.js';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  CircuitString,
  MerkleTree,
  Poseidon,
} from 'snarkyjs';

await isReady;

console.log('SnarkyJS loaded');

const doProofs = false;

let Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
let initialBalance = 10_000_000_000;

let feePayerKey = Local.testAccounts[0].privateKey;
let feePayer = Local.testAccounts[0].publicKey;

// ----------------------------------------------------
console.log('\nGenerating a public key to deploy smart contract...');
let zkappKey = PrivateKey.random();
console.log('\nzkappKey:');
console.log(zkappKey.toBase58());
let zkappAddress = zkappKey.toPublicKey();

// Deploy smart contract
console.log('\nDeploying Vendor Credential smart contract..');

let VendorCredentialZkApp = new MerkleRank(zkappAddress);
if (doProofs) {
  await MerkleRank.compile();
}
let tx = await Mina.transaction(feePayer, () => {
  AccountUpdate.fundNewAccount(feePayer).send({
    to: zkappAddress,
    amount: initialBalance,
  });
  VendorCredentialZkApp.deploy();
});
await tx.sign([feePayerKey, zkappKey]).send();

console.log('\nCommitment check via VendorCredentialZkApp.commitment.get()');
console.log(VendorCredentialZkApp.commitment.get().toString());

// get the initial state of Square after deployment
const commitment = VendorCredentialZkApp.commitment.get();
console.log('commitment after init:', commitment.toString());

// ----------------------------------------------------

// The following Map serves as an off-chain in-memory storage
let Records: Map<string, CircuitString> = new Map<string, CircuitString>();

// Create example credential records
let rank1 = CircuitString.fromString("{addr:'123',rank:'blue'}");
let rank2 = CircuitString.fromString("{addr:'321',rank:'purple'}");

Records.set('123', rank1);
Records.set('321', rank2);

// "wrap" the Merkle tree around our off-chain storage
// initialize a new Merkle Tree with height 8
const Tree = new MerkleTree(8);

Tree.setLeaf(0n, rank1.hash());
Tree.setLeaf(1n, rank2.hash());

let newRoot = Tree.getRoot();
console.log(newRoot.toString());

// Set first rank
await updateRequest(rank1, Field(0), 0n);

async function verifierRequest(index: bigint, credentialData: CircuitString) {
  // Generate witness for leaf at an index
  let w = Tree.getWitness(index);
  // Create a circuit-compatible witness
  let witness = new MyMerkleWitness(w);

  console.log('Verifier request in progress...');
  try {
    // Create transaction to
    let tx = await Mina.transaction(feePayer, () => {
      VendorCredentialZkApp.verifyCredential(credentialData, witness);
    });
    await tx.prove();
    await tx.sign([feePayerKey, zkappKey]).send();

    console.log('Credentials verified!');
  } catch (ex: any) {
    console.log(
      'Vendor credential does not match. Credentials are not verified'
    );
  }
}

async function updateRequest(
  newData: CircuitString,
  oldData: Field,
  index: bigint
) {
  let record = newData;
  // Generate witness for leaf at an index
  let w = Tree.getWitness(index);
  // Create a circuit-compatible witness
  let witness = new MyMerkleWitness(w);
  let oldHash = Poseidon.hash(oldData.toFields());
  console.log('Record update request in progress...');
  try {
    let tx = await Mina.transaction(feePayer, () => {
      VendorCredentialZkApp.updateRecord(record, oldHash, witness);
    });
    await tx.prove();
    await tx.sign([feePayerKey, zkappKey]).send();

    console.log('Update to record completed.');

    // if the transaction was successful, we can update our off-chain storage
    Tree.setLeaf(index, newData.hash());
    VendorCredentialZkApp.commitment.get().assertEquals(Tree.getRoot());
  } catch (ex: any) {
    // console.log('error: ');
    // console.log(ex);
    console.log('Update to record failed.');
  }
}

console.log('Shutting down');
await shutdown();
