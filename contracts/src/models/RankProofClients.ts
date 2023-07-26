import { CircuitString, Field, MerkleMapWitness, PublicKey } from 'snarkyjs';

export class ZkClientResponse {
  hash: string | undefined;
  isSuccess: boolean;
}

export abstract class ProofOfRankZkClient {
  abstract getStorageRoot(): Promise<Field>;

  abstract setStorageRoot(root: string): Promise<void>;

  abstract proveUpdateTransaction(): Promise<void>;
  abstract sendTransaction(): Promise<ZkClientResponse>;
}
export abstract class AddZkClient extends ProofOfRankZkClient {
  abstract add(address: string, rank: string): Promise<void>;
  abstract updateBackingStore(
    studentPublicKey: string,
    instructorPublicKey: string
  ): Promise<void>;
}

export abstract class PromoteZkClient extends ProofOfRankZkClient {
  abstract promoteStudent(
    studentPublicKey: string,
    rank: string,
    instructorPublicKey: string
  ): Promise<void>;
  abstract updateBackingStore(
    studentPublicKey: string,
    rank: string,
    instructorPublicKey: string
  ): Promise<void>;
}

export abstract class ProveZkClient extends ProofOfRankZkClient {
  abstract proveRank(
    prover: string,
    inquirer: string,
    rank: string
  ): Promise<void>;
  abstract updateBackingStore(
    prover: string,
    inquirer: string,
    rank: string
  ): Promise<void>;
}

export abstract class RevokeZkClient extends ProofOfRankZkClient {
  abstract revokeStudent(
    studentPublicKey: string,
    instructorPublicKey: string
  ): Promise<void>;

  abstract updateBackingStore(
    studentPublicKey: string,
    instructorPublicKey: string
  ): Promise<void>;
}
