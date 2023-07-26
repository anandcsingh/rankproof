import {
  Bool,
  CircuitString,
  Field,
  MerkleMap,
  MerkleTree,
  Mina,
  Poseidon,
  Proof,
  PublicKey,
  Struct,
} from 'snarkyjs';
import { ProofOfRank } from '../ProofOfRank.js';
import { MartialArtist } from './MartialArtist.js';
import { ZkClient } from './ZkClient.js';
import { AddZkClient, PromoteZkClient } from './RankProofClients.js';
import { BackingStore } from './MartialArtistRepository.js';

export class RankProofRepository {
  addClient: AddZkClient | null;
  promoteClient: PromoteZkClient | null;
  backingStore: BackingStore;
  merkleTree: MerkleTree;

  constructor(
    addClient: AddZkClient | null,
    promoteClient: PromoteZkClient | null,
    backingStore: BackingStore
  ) {
    this.addClient = addClient;
    this.promoteClient = promoteClient;
    this.backingStore = backingStore;
  }

  async get(publicKey: PublicKey): Promise<MartialArtist | undefined | null> {
    const ma = await this.backingStore.get(publicKey);
    if (ma) {
      return ma;
    } else {
      return undefined;
    }
  }

  async add(martialArtist: MartialArtist): Promise<boolean> {
    const merkleStore = await this.backingStore.getMerkleMap();
    const currentRoot = merkleStore.map.getRoot();
    console.log('current root from repo: ', currentRoot.toString());
    martialArtist.id = Field(merkleStore.nextID);
    console.log('martialArtist.id: ', martialArtist.id.toString());
    let hash = martialArtist.hash();
    console.log('hash: ', hash.toString());
    merkleStore.map.set(martialArtist.id, hash);
    console.log('merkleStore set');
    const witness = merkleStore.map.getWitness(martialArtist.id);
    console.log('witness: ', witness.toString());
    console.log('adding martial artist');
    //await this.addClient!.addPractitioner(hash, martialArtist.publicKey, witness);
    console.log('proving update transaction');
    await this.addClient!.proveUpdateTransaction();
    console.log('sending transaction');
    let response = await this.addClient!.sendTransaction();
    if (response.isSuccess) {
      await this.backingStore.upsert(martialArtist);
    }
    return response.isSuccess;
  }

  async promoteStudent(
    studentID: PublicKey,
    instructorID: PublicKey,
    newRank: string
  ): Promise<boolean> {
    const student = await this.get(studentID);
    const instructor = await this.get(instructorID);
    const merkleMapDB = await this.backingStore.getMerkleMap();

    if (student != null && instructor != null) {
      const witness = merkleMapDB.map.getWitness(student.id);

      student.rank = CircuitString.fromString(newRank);
      student.instructor = instructor.publicKey;

      //await this.promoteClient!.promoteStudent(student.hash(), student.publicKey, instructor.publicKey, instructor.rank, witness);
      await this.promoteClient!.proveUpdateTransaction();
      let response = await this.promoteClient!.sendTransaction();
      if (response.isSuccess) {
        await this.backingStore.upsert(student);
      }
      return response.isSuccess;
    } else {
      return false;
    }
  }
  verifyRank(martialArtist: MartialArtist, rank: string): boolean {
    throw new Error('Method not implemented.');
  }
}

export class MerkleMapDatabase {
  map: MerkleMap;
  nextID: bigint;
  length: number;
}
