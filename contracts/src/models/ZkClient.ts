import {
  Bool,
  Circuit,
  CircuitString,
  Empty,
  Field,
  MerkleMap,
  MerkleMapWitness,
  Mina,
  Poseidon,
  Proof,
  PublicKey,
  SmartContract,
  State,
  Struct,
  ZkappPublicInput,
  method,
  state,
} from 'snarkyjs';
import { MartialArtist } from './MartialArtist.js';
import { Sender } from './Sender.js';
import { ProofOfRank } from '../ProofOfRank.js';

export class ZkClientResponse {
  hash: string | undefined;
  isSuccessful: boolean;
}

export abstract class ZkClient {
  abstract getStorageRoot(): Promise<Field>;
  abstract addPractitioner(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ): Promise<void>;
  abstract promoteStudent(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: string,
    studentWitness: MerkleMapWitness
  ): Promise<void>;

  abstract proveUpdateTransaction(): Promise<void>;
  abstract sendTransaction(): Promise<ZkClientResponse>;
}

export class SingleContractZkClient extends ZkClient {
  contract: ProofOfRank;
  sender: Sender;
  currentTransaction: Mina.Transaction | undefined;

  constructor(contract: ProofOfRank, sender: Sender) {
    super();
    this.contract = contract;
    this.sender = sender;
  }
  async getStorageRoot(): Promise<Field> {
    return await this.contract.mapRoot.get();
  }
  async addPractitioner(
    martialArtist: MartialArtist,
    witness: MerkleMapWitness,
    currentRoot: Field
  ): Promise<void> {
    const transaction = await Mina.transaction(this.sender.publicKey, () => {
      this.contract.addPractitioner(martialArtist, witness, currentRoot);
    });
    this.currentTransaction = transaction;
  }

  async promoteStudent(
    student: MartialArtist,
    instructor: MartialArtist,
    newRank: string,
    studentWitness: MerkleMapWitness
  ): Promise<void> {
    const transaction = await Mina.transaction(this.sender.publicKey, () => {
      this.contract.promoteStudent(
        student,
        instructor,
        CircuitString.fromString(newRank),
        studentWitness
      );
    });
    this.currentTransaction = transaction;
  }
  async proveUpdateTransaction(): Promise<void> {
    const txnProved = await this.currentTransaction?.prove();
  }

  async sendTransaction(): Promise<ZkClientResponse> {
    const txnSigned = await this.currentTransaction
      ?.sign([this.sender.privateKey])
      .send();
    let response = new ZkClientResponse();
    return {
      hash: txnSigned?.hash(),
      isSuccessful: txnSigned?.isSuccess ?? false,
    };
  }
}
