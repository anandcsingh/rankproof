import { Field, MerkleMap, PublicKey } from 'snarkyjs';
import { MartialArtist } from '../models/MartialArtist.js';
import { BackingStore } from './MartialArtistRepository.js';

export class InMemoryBackingStore implements BackingStore {
  backingStore: Map<bigint, MartialArtist>;
  constructor(backingStore: Map<bigint, MartialArtist>) {
    this.backingStore = backingStore;
  }
  getMerkleMap(): MerkleMap {
    let map = new MerkleMap();
    for (let [key, value] of this.getAll()) {
      map.set(Field(key), value.hash());
    }
    return map;
  }
  getMerkleMapIdFrom(publicKey: PublicKey): bigint | undefined | null {
    for (let [key, value] of this.getAll()) {
      if (value.publicKey.toString() == publicKey.toString()) {
        return key;
      }
    }
  }
  getAll(): Map<bigint, MartialArtist> {
    return this.backingStore;
  }
  get(id: bigint): MartialArtist | undefined | null {
    return this.backingStore.get(id);
  }
  set(id: bigint, martialArtist: MartialArtist): void {
    this.backingStore.set(id, martialArtist);
  }
}
