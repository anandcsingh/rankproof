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
    this.mapRoot.getAndAssertEquals();
    this.mapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(martialArtist.publicKey);
    const [newRoot, _] = witness.computeRootAndKey(martialArtist.hash());
    this.mapRoot.set(newRoot);
  }

  @method promoteStudent(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: CircuitString,
    studentWitness: MerkleMapWitness
  ) {
    const currentRoot = this.mapRoot.get();
    this.mapRoot.assertEquals(currentRoot);

    let [confirmStudentRoot, confirmKey] = studentWitness.computeRootAndKey(
      student.hash()
    );
    this.mapRoot.assertEquals(confirmStudentRoot);

    this.sender.assertEquals(instructor.publicKey);
    instructor.rank.assertEquals(CircuitString.fromString('Black Belt'));

    student.rank = newRank;
    const [newRoot, _] = studentWitness.computeRootAndKey(student.hash());
    this.mapRoot.set(newRoot);
  }
}
