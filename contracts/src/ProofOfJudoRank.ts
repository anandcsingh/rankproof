import { CircuitString, MerkleMapWitness } from 'snarkyjs';
import { MartialArtist } from './models/MartialArtist.js';
import { ProofOfRank } from './ProofOfRank.js';

export class ProofOfJudoRank extends ProofOfRank {
  validatePromotion(
    _student: MartialArtist,
    instructor: MartialArtist,
    _newRank: CircuitString,
    _studentWitness: MerkleMapWitness
  ): void {
    instructor.rank.assertEquals(CircuitString.fromString('Black Belt'));
  }
}
