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
import { MartialArtist } from './models/MartialArtist.js';

export class ProofOfKarateRankNoParent extends SmartContract {
  @state(Field) mapRoot = State<Field>();

  events = {
    promoted: PublicKey,
    added: PublicKey,
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

  @method addPractitioner(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.mapRoot.getAndAssertEquals();
    this.mapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(martialArtist.publicKey);
    const [newRoot, _] = witness.computeRootAndKey(martialArtist.hash());
    this.mapRoot.set(newRoot);
    this.emitEvent('added', martialArtist.publicKey);
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
    this.validatePromotion(student, instructor, newRank, studentWitness);

    student.rank = newRank;
    student.instructor = instructor.publicKey;
    const [newRoot, _] = studentWitness.computeRootAndKey(student.hash());
    this.mapRoot.set(newRoot);
    this.emitEvent('promoted', student.publicKey);
  }

  validatePromotion(
    _student: MartialArtist,
    instructor: MartialArtist,
    _newRank: CircuitString,
    _studentWitness: MerkleMapWitness
  ): void {
    instructor.rank.assertEquals(CircuitString.fromString('Black Belt'));
  }
}
