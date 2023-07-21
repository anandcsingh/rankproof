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
import { MartialArtist } from './MartialArtist.js';

export interface IZkClient {
  getStorageRoot(): Promise<Field>;
  addPractitioner(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ): Promise<void>;
  promoteStudent(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: CircuitString,
    studentWitness: MerkleMapWitness
  ): Promise<void>;
}
