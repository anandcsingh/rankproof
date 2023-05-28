// zk vendor credentialing demo
// This demo shows how to use a Merkle Tree to store off-chain data, and use a smart contract to verify the data.
// https://github.com/csalvador58/zk-vendor-credentialing/blob/main/contracts/src/merkle.ts
// https://zkappsformina.com/zkapp/ethtokyo2023-zk-vendor-credentialing/

import {
  SmartContract,
  isReady,
  Poseidon,
  Field,
  Permissions,
  State,
  state,
  CircuitValue,
  prop,
  Mina,
  method,
  PrivateKey,
  AccountUpdate,
  MerkleTree,
  MerkleWitness,
  shutdown,
  CircuitString,
  Circuit,
} from 'snarkyjs';

export class MyMerkleWitness extends MerkleWitness(8) {}

export class MerkleRank extends SmartContract {
  // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
  @state(Field) commitment = State<Field>();

  init() {
    super.init();
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
    this.commitment.set(Field(0));
  }

  @method
  verifyCredential(credentialData: CircuitString, path: MyMerkleWitness) {
    // get the current root of the tree
    let commitment = this.commitment.get();
    this.commitment.assertEquals(commitment);

    // calculates the root of the witness
    let credentialDataHash = credentialData.hash();
    const calculatedRoot = path.calculateRoot(credentialDataHash);

    // Confirm the credential is committed to the Merkle Tree
    calculatedRoot.assertEquals(commitment);
  }

  @method
  updateRecord(newData: CircuitString, oldHash: Field, path: MyMerkleWitness) {
    // we fetch the on-chain commitment
    let commitment = this.commitment.get();
    this.commitment.assertEquals(commitment);

    // we check that the account is within the committed Merkle Tree
    path.calculateRoot(oldHash).assertEquals(commitment);

    // Calculate the new Merkle Root, based on the record changes
    let newCommitment = path.calculateRoot(newData.hash());

    this.commitment.set(newCommitment);
  }
}
