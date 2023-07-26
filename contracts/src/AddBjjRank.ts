import {
  Field,
  MerkleMap,
  MerkleMapWitness,
  PublicKey,
  SmartContract,
  State,
  method,
  state,
} from 'snarkyjs';
import { MartialArtist } from './models/MartialArtist.js';

export class AddBjjRank extends SmartContract {
  @state(Field) mapRoot = State<Field>();

  events = {
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
    studentHash: Field,
    studentPublicKey: PublicKey,
    witness: MerkleMapWitness,
    currentRoot: Field
  ) {
    this.mapRoot.getAndAssertEquals();
    this.mapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(studentPublicKey);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // verified == false
    const [newRoot, _] = witness.computeRootAndKey(studentHash);
    this.mapRoot.set(newRoot);
    this.emitEvent('added', studentPublicKey);
  }
}
