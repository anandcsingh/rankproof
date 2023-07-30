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
  provablePure,
} from 'snarkyjs';

export class AllMartialArtsEvents extends SmartContract {
  @state(Field) bjjMapRoot = State<Field>();
  @state(Field) judoMapRoot = State<Field>();
  @state(Field) karateMapRoot = State<Field>();

  init() {
    super.init();
    this.bjjMapRoot.set(Field(new MerkleMap().getRoot()));
    this.judoMapRoot.set(Field(new MerkleMap().getRoot()));
    this.karateMapRoot.set(Field(new MerkleMap().getRoot()));
  }

  events = {
    prove: provablePure({
      validProver: PublicKey,
      inquirer: PublicKey,
    }),
    promoted: PublicKey,
    revoked: PublicKey,
    added: PublicKey,
  };

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
    studentHash: Field,
    studentPublicKey: PublicKey,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.bjjMapRoot.getAndAssertEquals();
    this.bjjMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(studentPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // verified == false
    const [newRoot, _] = witness.computeRootAndKey(studentHash);
    this.bjjMapRoot.set(newRoot);
    this.emitEvent('added', studentPublicKey);
  }

  @method addJudoka(
    studentHash: Field,
    studentPublicKey: PublicKey,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.judoMapRoot.getAndAssertEquals();
    this.judoMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(studentPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // verified == false
    const [newRoot, _] = witness.computeRootAndKey(studentHash);
    this.judoMapRoot.set(newRoot);
    this.emitEvent('added', studentPublicKey);
  }

  @method addKarateka(
    studentHash: Field,
    studentPublicKey: PublicKey,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.karateMapRoot.getAndAssertEquals();
    this.karateMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(studentPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // verified == false
    const [newRoot, _] = witness.computeRootAndKey(studentHash);
    this.karateMapRoot.set(newRoot);
    this.emitEvent('added', studentPublicKey);
  }

  @method promoteJuijiteiro(
    studentHash: Field,
    studentPublicKey: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.bjjMapRoot.getAndAssertEquals();
    this.bjjMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == true
    // set rank == newRank
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.bjjMapRoot.set(newRoot);
    this.emitEvent('promoted', studentPublicKey);
  }

  @method promoteJudoka(
    studentHash: Field,
    studentPublicKey: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.judoMapRoot.getAndAssertEquals();
    this.judoMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == true
    // set rank == newRank
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.judoMapRoot.set(newRoot);
    this.emitEvent('promoted', studentPublicKey);
  }

  @method promoteKarateka(
    studentHash: Field,
    studentPublicKey: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.karateMapRoot.getAndAssertEquals();
    this.karateMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == true
    // set rank == newRank
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.karateMapRoot.set(newRoot);
    this.emitEvent('promoted', studentPublicKey);
  }

  @method proveJuijiteiro(
    prover: PublicKey,
    studentHash: Field,
    inquirer: PublicKey,
    studentWitness: MerkleMapWitness
  ) {
    this.bjjMapRoot.getAndAssertEquals();
    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.bjjMapRoot.assertEquals(newRoot);
    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // assert prover rank
    // assert prover verified

    // emitting prover rank as event casues too much data error

    this.emitEvent('prove', {
      validProver: prover,
      inquirer: inquirer,
    });
  }

  @method proveJudoka(
    prover: PublicKey,
    studentHash: Field,
    inquirer: PublicKey,
    studentWitness: MerkleMapWitness
  ) {
    this.judoMapRoot.getAndAssertEquals();
    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.judoMapRoot.assertEquals(newRoot);
    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // assert prover rank
    // assert prover verified

    // emitting prover rank as event casues too much data error

    this.emitEvent('prove', {
      validProver: prover,
      inquirer: inquirer,
    });
  }

  @method proveKarateka(
    prover: PublicKey,
    studentHash: Field,
    inquirer: PublicKey,
    studentWitness: MerkleMapWitness
  ) {
    this.karateMapRoot.getAndAssertEquals();
    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.karateMapRoot.assertEquals(newRoot);
    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // assert prover rank
    // assert prover verified

    // emitting prover rank as event casues too much data error

    this.emitEvent('prove', {
      validProver: prover,
      inquirer: inquirer,
    });
  }

  @method revokeJuijiteiro(
    studentHash: Field,
    studentPublicKey: PublicKey,
    studentInstructor: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.bjjMapRoot.getAndAssertEquals();
    this.bjjMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == false
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));
    instructorPublicKey.assertEquals(studentInstructor);

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.bjjMapRoot.set(newRoot);
    this.emitEvent('revoked', studentPublicKey);
  }

  @method revokeJudoka(
    studentHash: Field,
    studentPublicKey: PublicKey,
    studentInstructor: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.judoMapRoot.getAndAssertEquals();
    this.judoMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == false
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));
    instructorPublicKey.assertEquals(studentInstructor);

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.judoMapRoot.set(newRoot);
    this.emitEvent('revoked', studentPublicKey);
  }

  @method revokeKarateka(
    studentHash: Field,
    studentPublicKey: PublicKey,
    studentInstructor: PublicKey,
    instructorPublicKey: PublicKey,
    instructorRank: CircuitString,
    studentWitness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.karateMapRoot.getAndAssertEquals();
    this.karateMapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(instructorPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // set verified == false
    // update root from witness

    instructorRank.assertEquals(CircuitString.fromString('Black Belt'));
    instructorPublicKey.assertEquals(studentInstructor);

    const [newRoot, _] = studentWitness.computeRootAndKey(studentHash);
    this.karateMapRoot.set(newRoot);
    this.emitEvent('revoked', studentPublicKey);
  }
}
