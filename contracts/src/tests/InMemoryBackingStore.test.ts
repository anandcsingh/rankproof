import { ProofOfRank } from '../ProofOfRank';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
} from 'snarkyjs';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore';
import { MartialArtist } from '../models/MartialArtist';
import { ProofOfRankData } from './ProofOfRankData';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain';
/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

describe('InMemoryBackingStore', () => {
  it('can create empty MerkleMap', async () => {
    let backingStore = new InMemoryBackingStore(
      new Map<bigint, MartialArtist>()
    );
    let map = backingStore.getMerkleMap();
    expect(map.getRoot()).toEqual(Field(new MerkleMap().getRoot()));
  });

  it('can create MerkleMap with one Martial Artists', async () => {
    const [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(false).accounts;
    let data = new ProofOfRankData();
    let backingMap = new Map<bigint, MartialArtist>();
    backingMap.set(1n, data.getStudent(studentAccount));
    let backingStore = new InMemoryBackingStore(backingMap);
    let map = backingStore.getMerkleMap();
    expect(map.getRoot().toString()).toEqual(
      '12420879771597565761189105023823009907798980995921324458028056095204197401584'
    );
  });

  it('can create MerkleMap with multiple Martial Artists', async () => {
    const [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(false).accounts;
    let data = new ProofOfRankData();
    let backingMap = new Map<bigint, MartialArtist>();
    backingMap.set(1n, data.getStudent(studentAccount));
    backingMap.set(2n, data.getInstructor(instructorAccount));
    let backingStore = new InMemoryBackingStore(backingMap);
    let map = backingStore.getMerkleMap();
    expect(map.getRoot().toString()).toEqual(
      '11133063107583020209552293931405715226715919965786140883172790515749876692009'
    );
  });

  it('can change Martial Artist and generate valid MerkleMap', async () => {
    const [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(false).accounts;
    let data = new ProofOfRankData();
    let backingMap = new Map<bigint, MartialArtist>();
    backingMap.set(1n, data.getStudent(studentAccount));
    backingMap.set(2n, data.getInstructor(instructorAccount));
    let backingStore = new InMemoryBackingStore(backingMap);
    let map = backingStore.getMerkleMap();
    expect(map.getRoot().toString()).toEqual(
      '11133063107583020209552293931405715226715919965786140883172790515749876692009'
    );
  });
});
