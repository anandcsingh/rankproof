import {
  Bool,
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
}) {
  hash(): Field {
    return Poseidon.hash(
      this.id
        .toFields()
        .concat(this.publicKey.toFields())
        .concat(this.rank.toFields())
        .concat(this.verified.toFields())
    );
  }
}
export class ProofOfRank extends SmartContract {
  @state(Field) mapRoot = State<Field>();

  init() {
    super.init();
    this.mapRoot.set(Field(new MerkleMap().getRoot()));
  }

  @method addMartialArtist(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    Field(1).assertEquals(Field(1));
    // this.mapRoot.getAndAssertEquals();
    // this.mapRoot.assertEquals(currentRoot);
    // this.sender.assertEquals(martialArtist.publicKey);
    // const [newRoot, _] = witness.computeRootAndKey(martialArtist.hash());
    // this.mapRoot.set(newRoot);
  }
}
