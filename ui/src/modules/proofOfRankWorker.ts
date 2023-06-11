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

import type { ProofOfRank } from '../../../contracts/src/contracts/ProofOfRank';
import { MartialArtist } from '../../../contracts/src/models/MartialArtist';

const state = {
  proofOfRank: null as null | typeof ProofOfRank,
  zkapp: null as null | ProofOfRank,
  transaction: null as null | Transaction,
}

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { ProofOfRank } = await import('../../../contracts/build/src/contracts/ProofOfRank') //await import('../../../contracts/build/src/contracts/ProofOfRank.js');
    state.proofOfRank = ProofOfRank;
  },
  compileContract: async (args: {}) => {
    await state.proofOfRank!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.proofOfRank!(publicKey);
  },
  getStorageRoot: async (args: {}) => {
    const root = await state.zkapp!.mapRoot.get();
    return JSON.stringify(root.toJSON());
  },
  addPractitioner: async (args: { martialArtist: MartialArtist, witness: MerkleMapWitness, currentRoot: Field }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.addPractitioner(args.martialArtist, args.witness, args.currentRoot);
    }
    );
    state.transaction = transaction;
  },
  promoteStudent: async (args: { student: MartialArtist, instructor: MartialArtist, newRank: CircuitString, studentWitness: MerkleMapWitness }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.promoteStudent(args.student, args.instructor, args.newRank, args.studentWitness);
    }
    );
    state.transaction = transaction;
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
