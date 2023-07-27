import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  MerkleMapWitness,
  CircuitString,
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { AllMartialArts } from '../../../../contracts/src/AllMartialArts';
import { MartialArtistRepository } from '../../../../contracts/src/models/MartialArtistRepository';
import { FirebaseBackingStore } from '../../../../contracts/build/src/models/firebase/FirebaseBackingStore';

const state = {
  zkapp: null as null | AllMartialArts,
  transaction: null as null | Transaction,
  AllMartialArts: null as null | typeof AllMartialArts
}

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {

    const { AllMartialArts } = await import('../../../../contracts/build/src/AllMartialArts.js');
    state.AllMartialArts = AllMartialArts;
    console.log("contract AllMartialArts loaded");
  },
  compileContract: async (args: {}) => {
    console.log("compiling AllMartialArts contract");
    state.AllMartialArts!.compile();
    console.log("contract AllMartialArts compiled");
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.AllMartialArts!(publicKey);
  },
  getBjjStorageRoot: async (args: {}) => {
    const currentNum = await state.zkapp!.bjjMapRoot.get();
    return JSON.stringify(currentNum.toJSON());
  },
  setBjjStorageRoot: async (args: { root: string }) => {
    console.log("setting storage root from worker");
    let storage = Field(args.root);
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setbBjjMapRoot(storage);
    }
    );
    state.transaction = transaction;
    console.log("storage root set from worker");
  },
  addBjj: async (args: { address: string, rank: string }) => {
    let backingStore = new FirebaseBackingStore("BJJ");
    const merkleStore = await backingStore.getMerkleMap();
    const currentRoot = merkleStore.map.getRoot();
    let martialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: "BJJ",
    });
    martialArtist.id = Field(merkleStore.nextID);
    let hash = martialArtist.hash();
    merkleStore.map.set(martialArtist.id, hash);
    const witness = merkleStore.map.getWitness(martialArtist.id);
    console.log("creating worker transaction");
    console.log("address: ", args.address);
    const transaction = await Mina.transaction(
      { sender: martialArtist.publicKey },
      () => {
      state.zkapp!.addJuijiteiro(hash, martialArtist.publicKey, witness, currentRoot);
    }
    );

    state.transaction = transaction;
  },
  updateBjjBackingStore: async (args: { address: string, rank: string }) => {
    let backingStore = new FirebaseBackingStore("BJJ");
    const merkleStore = await backingStore.getMerkleMap();
    let martialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: "BJJ",
    });
    martialArtist.id = Field(merkleStore.nextID);
    backingStore.upsert(martialArtist);
  },
  getJudoStorageRoot: async (args: {}) => {
    const currentNum = await state.zkapp!.judoMapRoot.get();
    return JSON.stringify(currentNum.toJSON());
  },
  setJudoStorageRoot: async (args: { root: string }) => {
    console.log("setting storage root from worker");
    let storage = Field(args.root);
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setJudoMapRoot(storage);
    }
    );
    state.transaction = transaction;
    console.log("storage root set from worker");
  },
  addJudo: async (args: { address: string, rank: string }) => {
    let backingStore = new FirebaseBackingStore("Judo");
    const merkleStore = await backingStore.getMerkleMap();
    const currentRoot = merkleStore.map.getRoot();
    let martialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: "BJJ",
    });
    martialArtist.id = Field(merkleStore.nextID);
    let hash = martialArtist.hash();
    merkleStore.map.set(martialArtist.id, hash);
    const witness = merkleStore.map.getWitness(martialArtist.id);
    console.log("creating worker transaction");
    console.log("address: ", args.address);
    const transaction = await Mina.transaction(
      { sender: martialArtist.publicKey },
      () => {
      state.zkapp!.addJudoka(hash, martialArtist.publicKey, witness, currentRoot);
    }
    );

    state.transaction = transaction;
  },
  updateJudoBackingStore: async (args: { address: string, rank: string }) => {
    let backingStore = new FirebaseBackingStore("Judo");
    const merkleStore = await backingStore.getMerkleMap();
    let martialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: "BJJ",
    });
    martialArtist.id = Field(merkleStore.nextID);
    backingStore.upsert(martialArtist);
  },
  getKarateStorageRoot: async (args: {}) => {
    const currentNum = await state.zkapp!.karateMapRoot.get();
    return JSON.stringify(currentNum.toJSON());
  },
  setKarateStorageRoot: async (args: { root: string }) => {
    console.log("setting storage root from worker");
    let storage = Field(args.root);
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setKarateMapRoot(storage);
    }
    );
    state.transaction = transaction;
    console.log("storage root set from worker");
  },
  addKarate: async (args: { address: string, rank: string }) => {
    let backingStore = new FirebaseBackingStore("Judo");
    const merkleStore = await backingStore.getMerkleMap();
    const currentRoot = merkleStore.map.getRoot();
    let martialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: "BJJ",
    });
    martialArtist.id = Field(merkleStore.nextID);
    let hash = martialArtist.hash();
    merkleStore.map.set(martialArtist.id, hash);
    const witness = merkleStore.map.getWitness(martialArtist.id);
    console.log("creating worker transaction");
    console.log("address: ", args.address);
    const transaction = await Mina.transaction(
      { sender: martialArtist.publicKey },
      () => {
      state.zkapp!.addKarateka(hash, martialArtist.publicKey, witness, currentRoot);
    }
    );

    state.transaction = transaction;
  },
  updateKarateBackingStore: async (args: { address: string, rank: string }) => {
    let backingStore = new FirebaseBackingStore("Karate");
    const merkleStore = await backingStore.getMerkleMap();
    let martialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: "BJJ",
    });
    martialArtist.id = Field(merkleStore.nextID);
    backingStore.upsert(martialArtist);
  },
  promoteBjjStudent: async (args: { studentPublicKey: string, rank: string, instructorPublicKey: string }) => { 
    let discipline = "BJJ";
    let backingStore = new FirebaseBackingStore(discipline);
    let studentKey = PublicKey.fromBase58(args.studentPublicKey);
    let instructorKey = PublicKey.fromBase58(args.instructorPublicKey);
    const student = await functions.get( {publicKey: studentKey, backingStore: backingStore });
    const instructor = await functions.get({publicKey: instructorKey, backingStore: backingStore });
    const merkleMapDB = await backingStore.getMerkleMap();
    const currentRoot = merkleMapDB.map.getRoot();

    if (student != null && instructor != null) {
      const witness = merkleMapDB.map.getWitness(student.id);

      student.rank = CircuitString.fromString(args.rank);
      student.instructor = instructor.publicKey;

      const transaction = await Mina.transaction(
        { sender: instructorKey },
        () => {
        state.zkapp!.promoteJuijiteiro(student.hash(), studentKey, instructorKey, instructor.rank, witness, currentRoot);
      }
      );
  
      state.transaction = transaction;
    }
  },
  promoteJudoStudent: async (args: { studentPublicKey: string, rank: string, instructorPublicKey: string }) => { 
    let discipline = "Judo";
    let backingStore = new FirebaseBackingStore(discipline);
    let studentKey = PublicKey.fromBase58(args.studentPublicKey);
    let instructorKey = PublicKey.fromBase58(args.instructorPublicKey);
    const student = await functions.get( {publicKey: studentKey, backingStore: backingStore });
    const instructor = await functions.get({publicKey: instructorKey, backingStore: backingStore });
    const merkleMapDB = await backingStore.getMerkleMap();
    const currentRoot = merkleMapDB.map.getRoot();

    if (student != null && instructor != null) {
      const witness = merkleMapDB.map.getWitness(student.id);

      student.rank = CircuitString.fromString(args.rank);
      student.instructor = instructor.publicKey;

      const transaction = await Mina.transaction(
        { sender: instructorKey },
        () => {
        state.zkapp!.promoteJuijiteiro(student.hash(), studentKey, instructorKey, instructor.rank, witness, currentRoot);
      }
      );
  
      state.transaction = transaction;
    }
  },
  promoteKarateStudent: async (args: { studentPublicKey: string, rank: string, instructorPublicKey: string }) => { 
    let discipline = "Karate";
    let backingStore = new FirebaseBackingStore(discipline);
    let studentKey = PublicKey.fromBase58(args.studentPublicKey);
    let instructorKey = PublicKey.fromBase58(args.instructorPublicKey);
    const student = await functions.get( {publicKey: studentKey, backingStore: backingStore });
    const instructor = await functions.get({publicKey: instructorKey, backingStore: backingStore });
    const merkleMapDB = await backingStore.getMerkleMap();
    const currentRoot = merkleMapDB.map.getRoot();

    if (student != null && instructor != null) {
      const witness = merkleMapDB.map.getWitness(student.id);

      student.rank = CircuitString.fromString(args.rank);
      student.instructor = instructor.publicKey;

      const transaction = await Mina.transaction(
        { sender: instructorKey },
        () => {
        state.zkapp!.promoteJuijiteiro(student.hash(), studentKey, instructorKey, instructor.rank, witness, currentRoot);
      }
      );
  
      state.transaction = transaction;
    }
  },
  get: async (args: {publicKey: PublicKey, backingStore: FirebaseBackingStore }) => {
    const ma = await args.backingStore.get(args.publicKey);
    if (ma) {
        return ma;
      } else {
        return undefined;
      }
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number,
  fn: WorkerFunctions,
  args: any
}

export type ZkappWorkerReponse = {
  id: number,
  data: any
}
if (process.browser) {
  addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    }
    postMessage(message)
  });
}
