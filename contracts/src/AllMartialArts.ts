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

export class AllMartialArts extends SmartContract {
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
  }
}
