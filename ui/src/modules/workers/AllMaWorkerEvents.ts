import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  MerkleMapWitness,
  CircuitString,
  Bool,
} from 'snarkyjs'
import { BackingStore, MerkleMapDatabase } from '../../../../contracts/build/src/models/MartialArtistRepository.js';


type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { AllMartialArtsEvents } from '../../../../contracts/src/AllMartialArtsEvents.js';
import { MartialArtistRepository } from '../../../../contracts/src/models/MartialArtistRepository.js';
import { FirebaseBackingStore } from '../../../../contracts/build/src/models/firebase/FirebaseBackingStore.js';
import { MartialArtist } from '../../../../contracts/build/src/models/MartialArtist.js';


export default class ActionResult {
  success: boolean;
  message: string;
  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}

const state = {
  zkapp: null as null | AllMartialArtsEvents,
  transaction: null as null | Transaction,
  AllMartialArtsEvents: null as null | typeof AllMartialArtsEvents,
  pendingMartialArtist: null as null | undefined | MartialArtist,
  addMap: null as null | any,
  promoteMap: null as null | any,
  proveMap: null as null | any,
  revokeMap: null as null | any,
  getRootMap: null as null | any,
  setRootMap: null as null | any,
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

    const { AllMartialArtsEvents } = await import('../../../../contracts/build/src/AllMartialArtsEvents.js');
    state.AllMartialArtsEvents = AllMartialArtsEvents;
    console.log("contract AllMartialArts loaded");
  },
  compileContract: async (args: {}) => {
    console.log("compiling AllMartialArts contract");
    state.AllMartialArtsEvents!.compile();
    console.log("contract AllMartialArts compiled");
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    console.log("fetching account:", args.publicKey58);
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.AllMartialArtsEvents!(publicKey);
    console.log("zkapp instance initialized");
    console.log("zkapp address: ", args.publicKey58);

    state.addMap.BJJ = state.zkapp.addJuijiteiro;
    state.addMap.Judo = state.zkapp.addJudoka;
    state.addMap.Karate = state.zkapp.addKarateka;

    state.promoteMap.BJJ = state.zkapp.promoteJuijiteiro;
    state.promoteMap.Judo = state.zkapp.promoteJudoka;
    state.promoteMap.Karate = state.zkapp.promoteKarateka;

    state.proveMap.BJJ = state.zkapp.proveJuijiteiro;
    state.proveMap.Judo = state.zkapp.proveJudoka;
    state.proveMap.Karate = state.zkapp.proveKarateka;

    state.revokeMap.BJJ = state.zkapp.revokeJuijiteiro;
    state.revokeMap.Judo = state.zkapp.revokeJudoka;
    state.revokeMap.Karate = state.zkapp.revokeKarateka;

    state.getRootMap.BJJ = state.zkapp.bjjMapRoot;
    state.getRootMap.Judo = state.zkapp.judoMapRoot;
    state.getRootMap.Karate = state.zkapp.karateMapRoot;
  },
  getStorageRoot: async (args: { discipline: string }) => {
    const currentNum = await state.getRootMap[args.discipline].get();
    return JSON.stringify(currentNum.toJSON());
  },
  setStorageRoot: async (args: { root: string, discipline: string }) => {
    let storage = Field(args.root);

    // create storage root transaction for a discipline
    const transaction = await Mina.transaction(() => {
      state.setRootMap[args.discipline](storage);
    });

    // set pending transaction to state
    state.transaction = transaction;
  },
  rootsVerified: async (args: { merkleStore: MerkleMapDatabase, contractRoot: string, discipline: string } ): Promise<ActionResult> => {
    const backingStoreRoot = args.merkleStore.map.getRoot();

  // verify roots match
  if (backingStoreRoot.toString() != args.contractRoot) {
    console.log("backing store root: ", backingStoreRoot.toString());
    console.log("contract root: ", args.contractRoot);
    console.log("Roots do not match");

    return {
      success: false,
      message: "Roots do not match",
    };
  }

  return {
    success: true,
    message: "Roots match",
  };
  },
  add: async (args: { address: string, rank: string, discipline: string }): Promise<ActionResult> => {
    
    let backingStore = new FirebaseBackingStore(args.discipline);
    const merkleStore = await backingStore.getMerkleMap();
    const backingStoreRoot = merkleStore.map.getRoot();
    const contractRoot = await state.getRootMap[args.discipline].get();

    // verify roots match
    const rootsVerified = await functions.rootsVerified( { merkleStore:merkleStore, contractRoot:contractRoot, discipline: args.discipline });
    if(!rootsVerified.success) return rootsVerified;

    // get student new martial artist from object in backing store
    state.pendingMartialArtist = backingStore.getMartialArtistFromDocSnap({
      id: 0,
      publicKey: args.address,
      firstName: '',
      lastName: '',
      rank: args.rank,
      verified: false,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: args.discipline,
    });

    // set student id to next id in merkle map
    state.pendingMartialArtist.id = Field(merkleStore.nextID);
    let hash = state.pendingMartialArtist.hash();

    // add student to merkle map and get witness
    merkleStore.map.set(state.pendingMartialArtist.id, hash);
    const witness = merkleStore.map.getWitness(state.pendingMartialArtist.id);

    // create discipline specific transaction
    const transaction = await Mina.transaction(
      { sender: state.pendingMartialArtist.publicKey },
      () => {
      state.addMap[args.discipline](hash, state.pendingMartialArtist!.publicKey, witness, contractRoot);
    }
    );

    // add pending transaction to state
    state.transaction = transaction;
    return {
      success: true,
      message: "Transaction created",
    }
  },
  updateBackingStore: async (args: { discipline: string }): Promise<ActionResult> => {
    
    let backingStore = new FirebaseBackingStore(args.discipline);
    const merkleStore = await backingStore.getMerkleMap();
    const backingStoreRoot = merkleStore.map.getRoot();
    const contractRoot = await state.getRootMap[args.discipline].get();

    // verify roots match
    const rootsVerified = await functions.rootsVerified( { merkleStore:merkleStore, contractRoot:contractRoot, discipline: args.discipline });
    if(!rootsVerified.success) return rootsVerified;

    // update student in backing store
    backingStore.upsert(state.pendingMartialArtist!);

    return {
      success: true,
      message: "Backing store updated",
    };
  },
  
  promoteStudent: async (args: { studentPublicKey: string, rank: string, instructorPublicKey: string, discipline: string }) => { 
    let backingStore = new FirebaseBackingStore(args.discipline);
    const merkleStore = await backingStore.getMerkleMap();
    const backingStoreRoot = merkleStore.map.getRoot();
    const contractRoot = await state.getRootMap[args.discipline].get();

    // verify roots match
    const rootsVerified = await functions.rootsVerified( { merkleStore:merkleStore, contractRoot:contractRoot, discipline: args.discipline });
    if(!rootsVerified.success) return rootsVerified;

    // find student and instructor in backing store
    let studentKey = PublicKey.fromBase58(args.studentPublicKey);
    let instructorKey = PublicKey.fromBase58(args.instructorPublicKey);
    state.pendingMartialArtist = await backingStore.get(studentKey); 
    const instructor = await backingStore.get(instructorKey);
    const merkleMapDB = await backingStore.getMerkleMap();

    if (state.pendingMartialArtist != null && instructor != null) {

      // update student rank and instructor and verified status
      state.pendingMartialArtist.rank = CircuitString.fromString(args.rank);
      state.pendingMartialArtist.instructor = instructor.publicKey;
      state.pendingMartialArtist.verified = Bool(true);

      // update merkle map with new student hash
      merkleMapDB.map.set(state.pendingMartialArtist.id, state.pendingMartialArtist.hash());

      // get witness for student
      const witness = merkleMapDB.map.getWitness(state.pendingMartialArtist.id);

      // create discipline specific transaction
      const transaction = await Mina.transaction({ sender: instructorKey },
        () => {
        state.promoteMap[args.discipline](state.pendingMartialArtist!.hash(), studentKey, instructorKey, instructor.rank, witness, contractRoot);
      });

      // add pending transaction to state
      state.transaction = transaction;

      return {
        success: true,
        message: "Transaction created",
      }
    } else {
      return {
        success: false,
      }
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
