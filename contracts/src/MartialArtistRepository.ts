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
import { ContractInteractor } from './ContractInteractor';
import { MartialArtist, ProofOfRank } from './ProofOfRank';
import { Sender } from '.';

export interface MartialArtistRepository {
  sender: Sender;
  add(martialArtist: MartialArtist): Promise<boolean>;
  promote(martialArtist: MartialArtist, newRank: string): boolean;
  verifyRank(martialArtist: MartialArtist, rank: string): boolean;
}

export class InMemoryMaRepository implements MartialArtistRepository {
  sender: Sender;
  contract: ProofOfRank;
  merkleMap: MerkleMap;
  backingStore: Map<string, MartialArtist>;
  merkleTree: MerkleTree;

  constructor(sender: Sender, contract: ProofOfRank);
  constructor(
    sender: Sender,
    contract: ProofOfRank,
    merkleMap?: MerkleMap,
    backingStore?: Map<string, MartialArtist>
  ) {
    this.sender = sender;
    this.contract = contract;
    this.merkleMap = merkleMap ? merkleMap : new MerkleMap();
    this.backingStore = backingStore
      ? backingStore
      : new Map<string, MartialArtist>();
  }

  async add(martialArtist: MartialArtist): Promise<boolean> {
    const currentRoot = this.merkleMap.getRoot();
    this.merkleMap.set(martialArtist.id, martialArtist.hash());
    const witness = this.merkleMap.getWitness(martialArtist.id);

    //let transaction = await this.interactor.sendTransaction(this.interactor.sender, this.contract.addMartialArtist, martialArtist, witness, currentRoot, this.interactor.sender);
    const txn1 = await Mina.transaction(this.sender.publicKey, () => {
      this.contract.addMartialArtist(martialArtist, witness, currentRoot);
    });

    const txnProved = await txn1.prove();

    const txnSigned = await txn1.sign([this.sender.privateKey]).send();
    this.backingStore.set(martialArtist.id.toString(), martialArtist);
    return txnSigned.isSuccess;
  }
  promote(): boolean {
    throw new Error('Method not implemented.');
  }
  verifyRank(martialArtist: MartialArtist, rank: string): boolean {
    throw new Error('Method not implemented.');
  }
}
