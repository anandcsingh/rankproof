import {
  Bool,
  Circuit,
  CircuitString,
  Field,
  MerkleMap,
  MerkleMapWitness,
  Poseidon,
  PublicKey,
  SmartContract,
  State,
  Struct,
  method,
  state,
} from 'snarkyjs';

export class MartialArtist extends Struct({
  id: Field,
  publicKey: PublicKey,
  rank: CircuitString,
  verified: Bool,
  instructor: PublicKey,
  createdDate: CircuitString,
  modifiedDate: CircuitString,
}) {
  hash(): Field {
    return Poseidon.hash(
      this.publicKey
        .toFields()
        .concat(this.rank.toFields())
        .concat(this.verified.toFields())
        .concat(this.instructor.toFields())
        .concat(this.createdDate.toFields())
        .concat(this.modifiedDate.toFields())
    );
  }
}
