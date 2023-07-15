import { PublicKey, MerkleMap, Field, CircuitString, Bool } from 'snarkyjs';
import { MartialArtist } from '../MartialArtist.js';
import { BackingStore, MerkleMapDatabase } from '../MartialArtistRepository.js';
import { app, database } from './firebaseConfig.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';

export class FirebaseBackingStore extends BackingStore {
  async getAll(): Promise<Map<PublicKey, MartialArtist>> {
    let all = new Map<PublicKey, MartialArtist>();
    let stringMap = new Map<string, MartialArtist>();
    //const maQuery = query(collection(database, "MartialArtists"), orderBy("created-date"));
    const maQuery = query(collection(database, 'MartialArtists'));

    const querySnapshot = await getDocs(maQuery);
    querySnapshot.forEach((doc) => {
      console.log('getAll() => ', doc.id);
      let ma = this.getMartialArtistFromDocSnap(doc.data());
      console.log('getMartialArtistFromDocSnap() => ', ma.publicKey.toBase58());
      all.set(ma.publicKey, ma);
      console.log('from all map: ', all.get(ma.publicKey)?.rank.toString());
    });
    return all;
  }
  async get(publicKey: PublicKey): Promise<MartialArtist | null | undefined> {
    const docRef = doc(database, 'MartialArtists', publicKey.toBase58());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return this.getMartialArtistFromDocSnap(docSnap.data());
    } else {
      return undefined;
    }
  }
  async add(martialArtist: MartialArtist): Promise<void> {
    const docRef = doc(
      database,
      'MartialArtists',
      martialArtist.publicKey.toBase58()
    );
    const data = {
      id: martialArtist.id.toString(),
      publicKey: martialArtist.publicKey.toBase58(),
      rank: martialArtist.rank.toString(),
      verified: martialArtist.verified.toBoolean(),
    };
    await setDoc(docRef, data);
  }
  async update(martialArtist: MartialArtist): Promise<void> {
    const docRef = doc(
      database,
      'MartialArtists',
      martialArtist.publicKey.toBase58()
    );
    await setDoc(docRef, martialArtist);
  }

  private getMartialArtistFromDocSnap(data: any): MartialArtist {
    let param = {
      id: Field(data.id),
      publicKey: PublicKey.fromBase58(data.publicKey),
      rank: CircuitString.fromString(data.rank),
      verified: Bool(data.verified),
    };
    return new MartialArtist(param);
  }
}
