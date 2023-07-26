import {
  CircuitString,
  Field,
  MerkleMap,
  MerkleMapWitness,
  PublicKey,
  SmartContract,
  State,
  method,
  provablePure,
  state,
} from 'snarkyjs';
import { MartialArtist } from './models/MartialArtist.js';

export class ProveBjjRank extends SmartContract {
  @state(Field) mapRoot = State<Field>();

  events = {
    prove: provablePure({
      prover: PublicKey,
      inquirer: PublicKey,
      rank: CircuitString,
    }),
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

  @method proveRank(
    prover: PublicKey,
    inquirer: PublicKey,
    rank: CircuitString,
    currentRoot: Field
  ) {
    this.mapRoot.getAndAssertEquals();
    this.mapRoot.assertEquals(currentRoot);
    this.sender.assertEquals(prover);

    // TODO: contracts were taking too long to compile while passing in MartialArtist struct
    // review at later date
    // validate Martial Artist witness against root
    // if verified emit rank

    this.emitEvent('prove', { prover: prover, inquirer: inquirer, rank: rank });
  }
}
