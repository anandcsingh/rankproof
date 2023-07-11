import { PublicKey, MerkleMap } from 'snarkyjs';
import { MartialArtist } from '../models/MartialArtist.js';

import { BackingStore } from './MartialArtistRepository.js';

export class FirebaseBackingStore implements BackingStore {
  getMerkleMapIdFrom(publicKey: PublicKey): bigint | null | undefined {
    throw new Error('Method not implemented.');
  }
  getMerkleMap(): MerkleMap {
    throw new Error('Method not implemented.');
  }
  getAll(): Map<bigint, MartialArtist> {
    throw new Error('Method not implemented.');
  }
  get(id: bigint): MartialArtist | null | undefined {
    throw new Error('Method not implemented.');
  }
  set(id: bigint, martialArtist: MartialArtist): void {
    throw new Error('Method not implemented.');
  }
}
