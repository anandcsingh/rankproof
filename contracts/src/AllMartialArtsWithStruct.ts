import {
  Field,
  MerkleMap,
  MerkleMapWitness,
  PublicKey,
  SmartContract,
  State,
  method,
  state,
  Permissions,
  VerificationKey,
  CircuitString,
} from 'snarkyjs';

import { MartialArtist } from './models/MartialArtist.js';

export class AllMartialArtsWithStruct extends SmartContract {
  @state(Field) bjjMapRoot = State<Field>();
  @state(Field) judoMapRoot = State<Field>();
  @state(Field) karateMapRoot = State<Field>();

  init() {
    super.init();
    this.bjjMapRoot.set(Field(new MerkleMap().getRoot()));
    this.judoMapRoot.set(Field(new MerkleMap().getRoot()));
    this.karateMapRoot.set(Field(new MerkleMap().getRoot()));
  }

  @method setbBjjMapRoot(newRoot: Field) {
    // TODO: add a check that the sender is the owner
    this.bjjMapRoot.getAndAssertEquals();
    this.bjjMapRoot.set(newRoot);
  }

  @method setJudoMapRoot(newRoot: Field) {
    // TODO: add a check that the sender is the owner
    this.judoMapRoot.getAndAssertEquals();
    this.judoMapRoot.set(newRoot);
  }

  @method setKarateMapRoot(newRoot: Field) {
    // TODO: add a check that the sender is the owner
    this.karateMapRoot.getAndAssertEquals();
    this.karateMapRoot.set(newRoot);
  }

  @method addJuijiteiro(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.bjjMapRoot.getAndAssertEquals();
    this.bjjMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(martialArtist.publicKey);
    const [newRoot, _] = witness.computeRootAndKey(martialArtist.hash());
    this.bjjMapRoot.set(newRoot);
  }

  @method addJudoka(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.judoMapRoot.getAndAssertEquals();
    this.judoMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(martialArtist.publicKey);
    const [newRoot, _] = witness.computeRootAndKey(martialArtist.hash());
    this.judoMapRoot.set(newRoot);
  }

  @method addKarateka(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.karateMapRoot.getAndAssertEquals();
    this.karateMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(martialArtist.publicKey);
    const [newRoot, _] = witness.computeRootAndKey(martialArtist.hash());
    this.karateMapRoot.set(newRoot);
  }

  @method promoteJuijiteiro(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: CircuitString,
    studentWitness: MerkleMapWitness
  ) {
    const currentRoot = this.bjjMapRoot.get();
    this.bjjMapRoot.assertEquals(currentRoot);
    let [confirmStudentRoot, confirmKey] = studentWitness.computeRootAndKey(
      student.hash()
    );
    this.bjjMapRoot.assertEquals(confirmStudentRoot);

    this.sender.assertEquals(instructor.publicKey);
    instructor.rank.assertEquals(CircuitString.fromString('Black Belt'));

    student.rank = newRank;
    student.instructor = instructor.publicKey;
    const [newRoot, _] = studentWitness.computeRootAndKey(student.hash());
    this.bjjMapRoot.set(newRoot);
  }

  @method promoteJudoka(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: CircuitString,
    studentWitness: MerkleMapWitness
  ) {
    const currentRoot = this.judoMapRoot.get();
    this.judoMapRoot.assertEquals(currentRoot);
    let [confirmStudentRoot, confirmKey] = studentWitness.computeRootAndKey(
      student.hash()
    );
    this.judoMapRoot.assertEquals(confirmStudentRoot);

    this.sender.assertEquals(instructor.publicKey);
    instructor.rank.assertEquals(CircuitString.fromString('Black Belt'));

    student.rank = newRank;
    student.instructor = instructor.publicKey;
    const [newRoot, _] = studentWitness.computeRootAndKey(student.hash());
    this.judoMapRoot.set(newRoot);
  }

  @method promoteKarateka(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: CircuitString,
    studentWitness: MerkleMapWitness
  ) {
    const currentRoot = this.karateMapRoot.get();
    this.karateMapRoot.assertEquals(currentRoot);
    let [confirmStudentRoot, confirmKey] = studentWitness.computeRootAndKey(
      student.hash()
    );
    this.karateMapRoot.assertEquals(confirmStudentRoot);

    this.sender.assertEquals(instructor.publicKey);
    instructor.rank.assertEquals(CircuitString.fromString('Black Belt'));

    student.rank = newRank;
    student.instructor = instructor.publicKey;
    const [newRoot, _] = studentWitness.computeRootAndKey(student.hash());
    this.karateMapRoot.set(newRoot);
  }
}
