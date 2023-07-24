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
import { MartialArtist } from '../models/MartialArtist.js';
import { ZkClient } from './ZkClient.js';

export class MerkleMapDatabase {
  map: MerkleMap;
  nextID: bigint;
  length: number;
}

export abstract class BackingStore {
  async getMerkleMap(): Promise<MerkleMapDatabase> {
    let map = new MerkleMap();
    let index = 0;
    const all = await this.getAll();
    for (let [key, value] of all) {
      map.set(Field(++index), value.hash());
    }
    return {
      map: map,
      nextID: BigInt(index + 1),
      length: all.size,
    };
  }
  abstract getAll(): Promise<Map<PublicKey, MartialArtist>>;
  abstract get(publicKey: PublicKey): Promise<MartialArtist | undefined | null>;
  abstract upsert(martialArtist: MartialArtist): Promise<void>;
  abstract clearStore(): Promise<void>;
}

export type DisciplineAlias = 'BJJ' | 'Judo' | 'Karate';

export const Disciplines = {
  Karate: 'Karate',
  BJJ: 'BJJ',
  Judo: 'Judo',
};

export class MartialArtistRepository {
  contract: ZkClient;
  backingStore: BackingStore;
  merkleTree: MerkleTree;

  constructor(contract: ZkClient, backingStore: BackingStore) {
    this.contract = contract;
    this.backingStore = backingStore;
  }

  async get(publicKey: PublicKey): Promise<MartialArtist | undefined | null> {
    const ma = await this.backingStore.get(publicKey);
    const merkleStore = await this.backingStore.getMerkleMap();
    if (ma) {
      const witness = merkleStore.map.getWitness(Field(ma.id));
      const [currentRoot, _] = witness.computeRootAndKey(
        ma?.hash() ?? Field(0)
      );
      if (
        (await this.contract.getStorageRoot().toString()) ==
        currentRoot.toString()
      ) {
        return ma;
      } else {
        return undefined;
      }
    }
  }

  async add(martialArtist: MartialArtist): Promise<boolean> {
    const merkleStore = await this.backingStore.getMerkleMap();
    const currentRoot = merkleStore.map.getRoot();
    martialArtist.id = Field(merkleStore.nextID);
    merkleStore.map.set(martialArtist.id, martialArtist.hash());
    const witness = merkleStore.map.getWitness(martialArtist.id);

    await this.contract.addPractitioner(martialArtist, witness, currentRoot);
    await this.contract.proveUpdateTransaction();
    let response = await this.contract.sendTransaction();
    if (response.isSuccessful) {
      await this.backingStore.upsert(martialArtist);
    }
    return response.isSuccessful;
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

      await this.contract.promoteStudent(student, instructor, newRank, witness);
      await this.contract.proveUpdateTransaction();
      let response = await this.contract.sendTransaction();
      if (response.isSuccessful) {
        student.rank = CircuitString.fromString(newRank);
        student.instructor = instructor.publicKey;
        await this.backingStore.upsert(student);
      }
      return response.isSuccessful;
    } else {
      return false;
    }
  }
  verifyRank(martialArtist: MartialArtist, rank: string): boolean {
    throw new Error('Method not implemented.');
  }
}
