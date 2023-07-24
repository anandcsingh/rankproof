import { Field, MerkleMap, PublicKey } from 'snarkyjs';
import { MartialArtist } from '../models/MartialArtist.js';
import { BackingStore, MerkleMapDatabase } from './MartialArtistRepository.js';

export class InMemoryBackingStore extends BackingStore {
  async getAllHashes(): Promise<Map<PublicKey, Field>> {
    let all = await this.getAll();
    let allHashes = new Map<PublicKey, Field>();
    all.forEach((value, key) => {
      allHashes.set(key, value.hash());
    });
    return allHashes;
  }
  async clearStore(): Promise<void> {
    this.backingStore.clear();
  }
  backingStore: Map<PublicKey, MartialArtist>;
  constructor(backingStore: Map<PublicKey, MartialArtist>) {
    super();
    this.backingStore = backingStore;
  }

  async getAll(): Promise<Map<PublicKey, MartialArtist>> {
    return this.backingStore;
  }
  async get(publicKey: PublicKey): Promise<MartialArtist | undefined | null> {
    return this.backingStore.get(publicKey);
  }
  async upsert(martialArtist: MartialArtist): Promise<void> {
    this.backingStore.set(martialArtist.publicKey, martialArtist);
  }
  async update(martialArtist: MartialArtist): Promise<void> {
    let ma = await this.get(martialArtist.publicKey);
    if (ma) {
      ma.id = martialArtist.id;
      ma.rank = martialArtist.rank;
      ma.publicKey = martialArtist.publicKey;
      ma.verified = martialArtist.verified;
    }
  }
}
