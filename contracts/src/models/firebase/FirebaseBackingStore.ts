import { PublicKey, MerkleMap, Field, CircuitString, Bool } from 'snarkyjs';
import { MartialArtist } from '../MartialArtist.js';
import { BackingStore, MerkleMapDatabase } from '../MartialArtistRepository.js';
import { app, database } from './firebaseConfig.js';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

export class FirebaseBackingStore extends BackingStore {
  collectionName: string;
  constructor(collectionName: string) {
    super();
    this.collectionName = collectionName;
  }

  async getMerkleMap(): Promise<MerkleMapDatabase> {
    let map = new MerkleMap();
    let index = 0;

    const all = await this.getAllHashes();
    for (let [key, value] of all) {
      map.set(Field(++index), value);
    }
    return {
      map: map,
      nextID: BigInt(index + 1),
      length: all.size,
    };
  }

  async clearStore(): Promise<void> {
    const maQuery = query(collection(database, this.collectionName));
    const querySnapshot = await getDocs(maQuery);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
  async getAll(): Promise<Map<PublicKey, MartialArtist>> {
    let all = new Map<PublicKey, MartialArtist>();
    let stringMap = new Map<string, MartialArtist>();

    // DO NOT DELETE THIS COMMENTED OUT CODE
    const maQuery = query(
      collection(database, this.collectionName),
      orderBy('id')
    );
    //const maQuery = query(collection(database, this.collectionName));

    const querySnapshot = await getDocs(maQuery);
    querySnapshot.forEach((doc) => {
      let ma = this.getMartialArtistFromDocSnap(doc.data());
      all.set(ma.publicKey, ma);
    });
    return all;
  }

  async getAllVerified(): Promise<Map<PublicKey, MartialArtist>> {
    let all = new Map<PublicKey, MartialArtist>();
    let stringMap = new Map<string, MartialArtist>();
    const maQuery = query(
      collection(database, this.collectionName),
      where('verified', '==', true),
      orderBy('id')
    );
    //const maQuery = query(collection(database, this.collectionName));

    const querySnapshot = await getDocs(maQuery);
    querySnapshot.forEach((doc) => {
      let ma = this.getMartialArtistFromDocSnap(doc.data());

      console.log(
        this.collectionName,
        ma.verified.toBoolean(),
        'instructor: ',
        ma.instructor.toBase58(),
        'publicKey: ',
        ma.publicKey.toBase58()
      );
      all.set(ma.publicKey, ma);
    });
    return all;
  }
  async getAllStudents(publicKey: string): Promise<Array<any>> {
    let all = new Array<any>();
    let stringMap = new Map<string, any>();
    const maQuery = query(
      collection(database, this.collectionName),
      where('instructor', '==', publicKey),
      orderBy('id')
    );
    //const maQuery = query(collection(database, this.collectionName));

    const querySnapshot = await getDocs(maQuery);
    querySnapshot.forEach((doc) => {
      let ma = doc.data();
      all.push(ma);
    });
    return all;
  }

  async getAllHashes(): Promise<Map<PublicKey, Field>> {
    let all = new Map<PublicKey, Field>();
    const maQuery = query(
      collection(database, this.collectionName),
      orderBy('id')
    );
    const querySnapshot = await getDocs(maQuery);
    querySnapshot.forEach((doc) => {
      all.set(
        PublicKey.fromBase58(doc.data().publicKey),
        Field(doc.data().hash)
      );
      //console.log(doc.data().id, 'hash: ', doc.data().hash);
    });
    return all;
  }
  async get(publicKey: PublicKey): Promise<MartialArtist | null | undefined> {
    const docRef = doc(database, this.collectionName, publicKey.toBase58());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return this.getMartialArtistFromDocSnap(docSnap.data());
    } else {
      return undefined;
    }
  }
  async upsert(martialArtist: MartialArtist): Promise<void> {
    const docRef = doc(
      database,
      this.collectionName,
      martialArtist.publicKey.toBase58()
    );
    const data = this.getObjectFromStruct(martialArtist);
    await setDoc(docRef, data);
  }
  getObjectFromStruct(martialArtist: MartialArtist) {
    return {
      id: Number(martialArtist.id.toBigInt()),
      publicKey: martialArtist.publicKey.toBase58(),
      firstName: martialArtist.firstName.toString(),
      lastName: martialArtist.lastName.toString(),
      rank: martialArtist.rank.toString(),
      verified: martialArtist.verified.toBoolean(),
      instructor: martialArtist.getInstructorString(),
      createdDate: martialArtist.createdDate.toString(),
      modifiedDate: martialArtist.modifiedDate.toString(),
      discipline: martialArtist.discipline.toString(),
      hash: martialArtist.hash().toString(),
    };
  }

  getMartialArtistFromDocSnap(data: any): MartialArtist {
    let param = {
      id: Field(data.id),
      publicKey: PublicKey.fromBase58(data.publicKey),
      firstName: CircuitString.fromString(data.firstName),
      lastName: CircuitString.fromString(data.lastName),
      rank: CircuitString.fromString(data.rank),
      verified: Bool(data.verified),
      instructor: data.instructor
        ? PublicKey.fromBase58(data.instructor)
        : PublicKey.empty(),
      createdDate: CircuitString.fromString(data.createdDate),
      modifiedDate: CircuitString.fromString(data.modifiedDate),
      discipline: CircuitString.fromString(data.discipline),
    };
    return new MartialArtist(param);
  }
}
