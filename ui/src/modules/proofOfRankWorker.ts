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
  MerkleWitness,
  MerkleMap,
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { ProofOfRank } from '../../../contracts/src/ProofOfRank';
import type { ProofOfBjjRank } from '../../../contracts/src/ProofOfBjjRank';
import type { ProofOfJudoRank } from '../../../contracts/src/ProofOfJudoRank';
import type { ProofOfKarateRank } from '../../../contracts/src/ProofOfKarateRank';
import { MartialArtist } from '../../../contracts/src/models/MartialArtist';
import { stat } from 'fs';
import { DisciplineAlias, Disciplines } from '../../../contracts/src/models/MartialArtistRepository';

const state = {
  proofOfRank: null as null | typeof ProofOfRank,
  zkapp: null as null | ProofOfRank,
  transaction: null as null | Transaction,
  zkapps: null as null | Map<string, ProofOfRank>,
  proofOfRanks: null as null | Map<string, typeof ProofOfRank>,
}

const zkAppAddresses = new Map<string, PublicKey>([
  [Disciplines.BJJ, PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR")],
  [Disciplines.Judo, PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR")],
  [Disciplines.Karate, PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR")]
]);

const getZkApp = (disciple: string) => {
  return state.zkapps!.get(disciple)!;
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
    const { ProofOfRank } = await import('../../../contracts/build/src/ProofOfRank') //await import('../../../contracts/build/src/contracts/ProofOfRank.js');
    const { ProofOfBjjRank } = await import('../../../contracts/build/src/ProofOfBjjRank');
    const { ProofOfJudoRank } = await import('../../../contracts/build/src/ProofOfJudoRank');
    const { ProofOfKarateRank } = await import('../../../contracts/build/src/ProofOfKarateRank'); 
    state.proofOfRank = ProofOfRank;
    state.proofOfRanks = new Map<string, typeof ProofOfRank>();
    state.proofOfRanks.set(Disciplines.BJJ, ProofOfBjjRank);
    state.proofOfRanks.set(Disciplines.Judo, ProofOfJudoRank);
    state.proofOfRanks.set(Disciplines.Karate, ProofOfKarateRank);
  },
  compileContract: async (args: {}) => {
    await state.proofOfRank!.compile();
    state.proofOfRanks!.forEach(async (contract) => {
      await contract.compile();
    });
  },
  fetchAccount: async (args: { discipline: string }) => {
    const publicKey = zkAppAddresses.get(args.discipline)!;
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { }) => {

    state.zkapps = new Map<string, ProofOfRank>();
    state.zkapps.set(Disciplines.BJJ, new (state.proofOfRanks!.get(Disciplines.BJJ)! as typeof ProofOfBjjRank)(zkAppAddresses.get(Disciplines.BJJ)!));
    state.zkapps.set(Disciplines.Judo, new (state.proofOfRanks!.get(Disciplines.Judo)! as typeof ProofOfJudoRank)(zkAppAddresses.get(Disciplines.Judo)!));
    state.zkapps.set(Disciplines.Karate, new (state.proofOfRanks!.get(Disciplines.Karate)! as typeof ProofOfKarateRank)(zkAppAddresses.get(Disciplines.Karate)!));
  },
  getStorageRoot: async (args: {discipline: string}) => {
    const root = await getZkApp(args.discipline)!.mapRoot.get();
    return JSON.stringify(root.toJSON());
  },
  addPractitionerTransaction: async (args: { martialArtist: MartialArtist, witness: MerkleMapWitness, currentRoot: Field }) => {
    const transaction = await Mina.transaction(() => {
      getZkApp(args.martialArtist.discipline)!.addPractitioner(args.martialArtist, args.witness, args.currentRoot);
    }
    );
    state.transaction = transaction;
  },
  promoteStudentTransaction: async (args: { student: MartialArtist, instructor: MartialArtist, newRank: CircuitString, studentWitness: MerkleMapWitness }) => {
    const transaction = await Mina.transaction(() => {
      getZkApp(args.student.discipline)!.promoteStudent(args.student, args.instructor, args.newRank, args.studentWitness);
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
