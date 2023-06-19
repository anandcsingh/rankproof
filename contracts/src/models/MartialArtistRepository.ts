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

export interface MartialArtistRepository {
  sender: Sender;
  add(martialArtist: MartialArtist): Promise<boolean>;
  promoteStudent(
    studentID: bigint,
    instructorID: bigint,
    newRank: string
  ): Promise<boolean>;
  verifyRank(martialArtist: MartialArtist, rank: string): boolean;
}

export class InMemoryMaRepository implements MartialArtistRepository {
  sender: Sender;
  contract: ProofOfRank;
  merkleMap: MerkleMap;
  backingStore: Map<bigint, MartialArtist>;
  merkleTree: MerkleTree;

  constructor(sender: Sender, contract: ProofOfRank);
  constructor(
    sender: Sender,
    contract: ProofOfRank,
    merkleMap?: MerkleMap,
    backingStore?: Map<bigint, MartialArtist>
  ) {
    this.sender = sender;
    this.contract = contract;
    this.merkleMap = merkleMap ? merkleMap : new MerkleMap();
    this.backingStore = backingStore
      ? backingStore
      : new Map<bigint, MartialArtist>();
  }

  get(id: bigint): any {
    const ma = this.backingStore.get(id);
    if (ma) {
      const witness = this.merkleMap.getWitness(ma?.id ?? Field(0));
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
    const currentRoot = this.merkleMap.getRoot();
    this.merkleMap.set(martialArtist.id, martialArtist.hash());
    const witness = this.merkleMap.getWitness(martialArtist.id);

    //let transaction = await this.interactor.sendTransaction(this.interactor.sender, this.contract.addMartialArtist, martialArtist, witness, currentRoot, this.interactor.sender);
    const txn1 = await Mina.transaction(this.sender.publicKey, () => {
      this.contract.addPractitioner(martialArtist, witness, currentRoot);
    });

    const txnProved = await txn1.prove();

    const txnSigned = await txn1.sign([this.sender.privateKey]).send();
    this.backingStore.set(martialArtist.id.toBigInt(), martialArtist);
    return txnSigned.isSuccess;
  }

  async promoteStudent(
    studentID: bigint,
    instructorID: bigint,
    newRank: string
  ): Promise<boolean> {
    const student = this.get(studentID);
    const instructor = this.get(instructorID);
    if (student != null && instructor != null) {
      const witness = this.merkleMap.getWitness(student?.id ?? Field(0));
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
      this.backingStore.set(studentID, student);
      this.merkleMap.set(Field(studentID), student.hash());

      return txnSigned.isSuccess;
    } else {
      return false;
    }
  }
  verifyRank(martialArtist: MartialArtist, rank: string): boolean {
    throw new Error('Method not implemented.');
  }
}
