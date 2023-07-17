import { ProofOfRank } from '../ProofOfRank';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
} from 'snarkyjs';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore.js';
import { MartialArtist } from '../models/MartialArtist.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';

describe('InMemoryBackingStore', () => {
  it('can create empty MerkleMap', async () => {
    let backingStore = new InMemoryBackingStore(
      new Map<PublicKey, MartialArtist>()
    );
    let map = (await backingStore.getMerkleMap()).map;
    expect(map.getRoot()).toEqual(Field(new MerkleMap().getRoot()));
  });

  it('can create MerkleMap with one Martial Artists', async () => {
    const [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(false).accounts;
    let data = new ProofOfRankData();
    let backingMap = new Map<PublicKey, MartialArtist>();
    let student = data.getStudent(studentAccount);
    backingMap.set(student.publicKey, student);
    let backingStore = new InMemoryBackingStore(backingMap);
    let map = (await backingStore.getMerkleMap()).map;
    expect(map.getRoot().toString()).toEqual(
      '27774440201273603605801685225434590242451666559312031204682405351601519267520'
    );
  });

  it('can create MerkleMap with multiple Martial Artists', async () => {
    const [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(false).accounts;
    let data = new ProofOfRankData();
    let backingMap = new Map<PublicKey, MartialArtist>();
    let student = data.getStudent(studentAccount);
    let instructor = data.getInstructor(instructorAccount);
    backingMap.set(student.publicKey, student);
    backingMap.set(instructor.publicKey, instructor);
    let backingStore = new InMemoryBackingStore(backingMap);
    let map = (await backingStore.getMerkleMap()).map;
    expect(map.getRoot().toString()).toEqual(
      '8175502539973333070380368020793805199800622151469851803008556695806100081430'
    );
  });

  it('can change Martial Artist and generate valid MerkleMap', async () => {
    const [deployerAccount, studentAccount, instructorAccount] =
      new MinaLocalBlockchain(false).accounts;
    let data = new ProofOfRankData();
    let backingMap = new Map<PublicKey, MartialArtist>();
    let student = data.getStudent(studentAccount);
    let instructor = data.getInstructor(instructorAccount);
    backingMap.set(student.publicKey, student);
    backingMap.set(student.publicKey, instructor);
    let backingStore = new InMemoryBackingStore(backingMap);
    let map = (await backingStore.getMerkleMap()).map;
    expect(map.getRoot().toString()).toEqual(
      '8175502539973333070380368020793805199800622151469851803008556695806100081430'
    );

    student.rank = CircuitString.fromString('Purple Belt');
    backingStore.update(student);
    map = (await backingStore.getMerkleMap()).map;
    expect(map.getRoot().toString()).toEqual(
      '16359713713858811351375160383056711006572681991489302925328156427944453526525'
    );
  });
});
