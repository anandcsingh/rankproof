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

export class PromoteBjjStudent extends SmartContract {
  @state(Field) mapRoot = State<Field>();

  events = {
    promoted: PublicKey,
  };

  init() {
    super.init();
    this.mapRoot.set(Field(new MerkleMap().getRoot()));
  }

  @method setMapRoot(newRoot: Field) {
    // TODO: add a check that the sender is the owner
    this.mapRoot.getAndAssertEquals();
    this.mapRoot.set(newRoot);
  }

  @method promoteStudent(
    studentHash: Field,
    studentPublicKey: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.mapRoot.getAndAssertEquals();
    this.mapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == true
    // set rank == newRank
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.mapRoot.set(newRoot);
    this.emitEvent('promoted', studentPublicKey);
  }
}
