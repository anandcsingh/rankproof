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
import type { RankProof } from '../../../contracts/src/contracts/RankProof';
import type { ProofOfBjjRankNoParent } from '../../../contracts/src/ProofOfBjjRankNoParent';

const state = {
  Ranked: null as null | typeof RankProof,
  ProofOfRannk: null as null | typeof ProofOfBjjRankNoParent,
  zkapp: null as null | RankProof,
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
    const { RankProof } = await import('../../../contracts/build/src/contracts/RankProof.js');
    state.Ranked = RankProof;
    const { ProofOfBjjRankNoParent } = await import('../../../contracts/build/src/ProofOfBjjRankNoParent.js');  
    state.ProofOfRannk = ProofOfBjjRankNoParent;
  },
  compileContract: async (args: {}) => {
    console.log("compiling proof contract");
    await state.ProofOfRannk!.compile();
    console.log("contract proof compiled");
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Ranked!(publicKey);
  },
  getInstructor: async (args: {}) => {
    const instructor = await state.zkapp!.blackBelt.get();
    return JSON.stringify(instructor.toJSON());
  },
  getIbjjf: async (args: {}) => {
    const ibjjf = await state.zkapp!.ibjjf.get();
    return JSON.stringify(ibjjf.toJSON());
  },
  getItf: async (args: {}) => {
    const itf = await state.zkapp!.itf.get();
    return JSON.stringify(itf.toJSON());
  },
  getWkf: async (args: {}) => {
    const wkf = await state.zkapp!.wkf.get();
    return JSON.stringify(wkf.toJSON());
  },
  getRank: async (args: {martialArt: string}) => {
    let field = null;
    if (args.martialArt == "ibjjf") {
      field = await state.zkapp!.ibjjf.get();
    } else if (args.martialArt == "itf") {
      field = await state.zkapp!.itf.get();
    } else if (args.martialArt == "wkf") {
      field = await state.zkapp!.wkf.get();
    }
    return JSON.stringify(field!.toJSON());
  },
  createUpdateBlackBeltTransaction: async (args: { newBlackBelt: PublicKey }) => {
    const transaction = await Mina.transaction(() => {
        state.zkapp!.changeBlackBelt(args.newBlackBelt);
      }
      );
    state.transaction = transaction;
    },
  createCertifyTransaction: async (args: { martialArt: string, certifier: PublicKey, userOldData: Field, userNewData: Field }) => {
    const transaction = await Mina.transaction(() => {
      console.log("checking what to certify");
      if (args.martialArt == "ibjjf") {
        console.log("calling certify ibjjf");
        //console.log("certifier: ", args.certifier.toBase58());return;
        //console.log("userOldData: ", args.userOldData.toString());
        //console.log("userNewData: ", args.userNewData.toString());
        state.zkapp!.certifyIbjjf(args.certifier, args.userOldData, args.userNewData);
      } else if (args.martialArt == "itf") {
        state.zkapp!.certifyItf(args.certifier, args.userOldData, args.userNewData);
      } else if (args.martialArt == "wkf") {
        state.zkapp!.certifyWkf(args.certifier, args.userOldData, args.userNewData);
      }
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
