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
import { Sender } from './Sender.js';
import { MartialArtist } from '../models/MartialArtist.js';

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

export class MartialArtistRepository {
  sender: Sender;
  contract: ProofOfRank;
  backingStore: BackingStore;
  merkleTree: MerkleTree;

  constructor(
    sender: Sender,
    contract: ProofOfRank,
    backingStore: BackingStore
  ) {
    this.sender = sender;
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
      console.log('witness: ', currentRoot.toString());
      if (this.contract.mapRoot.get().toString() == currentRoot.toString()) {
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
    console.log('martialArtist.id: ', martialArtist.id.toString());
    console.log(
      'martialArtist.publicKey: ',
      martialArtist.publicKey.toBase58()
    );
    merkleStore.map.set(martialArtist.id, martialArtist.hash());
    const witness = merkleStore.map.getWitness(martialArtist.id);

    //let transaction = await this.interactor.sendTransaction(this.interactor.sender, this.contract.addMartialArtist, martialArtist, witness, currentRoot, this.interactor.sender);
    const txn1 = await Mina.transaction(this.sender.publicKey, () => {
      this.contract.addPractitioner(martialArtist, witness, currentRoot);
    });

    const txnProved = await txn1.prove();

    const txnSigned = await txn1.sign([this.sender.privateKey]).send();
    this.backingStore.upsert(martialArtist);
    return txnSigned.isSuccess;
  }

  async promoteStudent(
    studentID: PublicKey,
    instructorID: PublicKey,
    newRank: string
  ): Promise<boolean> {
    console.log(
      `promoteStudent: ${studentID.toBase58()}, ${instructorID.toBase58()}, ${newRank}`
    );
    const student = await this.get(studentID);
    const instructor = await this.get(instructorID);
    console.log('student from get: ', student?.publicKey.toBase58());
    console.log('instructor from get: ', instructor?.publicKey.toBase58());
    const merkleMapDB = await this.backingStore.getMerkleMap();

    if (student != null && instructor != null) {
      const witness = merkleMapDB.map.getWitness(student.id);
      const txn1 = await Mina.transaction(this.sender.publicKey, () => {
        this.contract.promoteStudent(
          student,
          instructor,
          CircuitString.fromString(newRank),
          witness
        );
      });

      const txnProved = await txn1.prove();

      const txnSigned = await txn1.sign([this.sender.privateKey]).send();
      student.rank = CircuitString.fromString(newRank);
      this.backingStore.upsert(student);

      return txnSigned.isSuccess;
    } else {
      return false;
    }
  }
  verifyRank(martialArtist: MartialArtist, rank: string): boolean {
    throw new Error('Method not implemented.');
  }
}
