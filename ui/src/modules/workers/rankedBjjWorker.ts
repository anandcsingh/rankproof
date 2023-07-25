import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

//import type { RankProof } from '../../contracts/src/RankProof';
import type { RankProof } from '../../../../contracts/src/contracts/RankProof';
import type { ProofOfBjjRankNoParent } from '../../../../contracts/src/ProofOfBjjRankNoParent';
import { MartialArtistRepository } from '../../../../contracts/src/models/MartialArtistRepository';

const state = {
  Ranked: null as null | typeof RankProof,
  ProofOfBjjRank: null as null | typeof ProofOfBjjRankNoParent,
  zkapp: null as null | ProofOfBjjRankNoParent,
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
   
    const { ProofOfBjjRankNoParent } = await import('../../../../contracts/build/src/ProofOfBjjRankNoParent.js');  
    state.ProofOfBjjRank = ProofOfBjjRankNoParent;
  },
  compileContract: async (args: {}) => {
    console.log("compiling ranked bjj contract");
    await state.ProofOfBjjRank!.compile();
    console.log("contract ranked bjj compiled");
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.ProofOfBjjRank!(publicKey);
  },
  getStorageRoot: async (args: {}) => {
    const mapRoot = await state.zkapp!.mapRoot.get();
    return mapRoot.toString();
  },
  setStorageRoot: async (args: { root: Field }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setMapRoot(args.root);
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
