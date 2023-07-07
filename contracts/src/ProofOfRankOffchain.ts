import {
  Bool,
  Circuit,
  CircuitString,
  DeployArgs,
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

export class ProofOfRankOffchain extends SmartContract {
  @state(PublicKey) storageServerPublicKey = State<PublicKey>();
  @state(Field) storageNumber = State<Field>();
  @state(Field) storageTreeRoot = State<Field>();

  events = {
    promoted: Field,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method initState(storageServerPublicKey: PublicKey) {
    this.storageServerPublicKey.set(storageServerPublicKey);
    this.storageNumber.set(Field(0));

    this.storageTreeRoot.set(new MerkleMap().getRoot());
  }

  @method setMapRoot(newRoot: Field) {
    this.storageTreeRoot.getAndAssertEquals();
    this.storageTreeRoot.set(newRoot);
  }

  @method addPractitioner(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.storageTreeRoot.getAndAssertEquals();
    this.storageTreeRoot.assertEquals(currentRoot);
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
    this.emitEvent('promoted', student.id);
  }
}
