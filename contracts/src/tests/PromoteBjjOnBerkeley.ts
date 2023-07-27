import { ProofOfRank } from '../ProofOfRank.js';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  fetchAccount,
} from 'snarkyjs';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';
import { Sender } from '../models/Sender.js';
import {
  MartialArtistRepository,
  BackingStore,
  Disciplines,
} from '../models/MartialArtistRepository.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { InMemoryBackingStore } from '../models/InMemoryBackingStore.js';
import { MartialArtist } from '../models/MartialArtist.js';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { ProofOfBjjRank } from '../ProofOfBjjRank.js';
import { ProofOfJudoRank } from '../ProofOfJudoRank.js';
import { ProofOfKarateRankNoParent } from '../ProofOfKarateRankNoParent.js';
import { SingleContractZkClient } from '../models/ZkClient.js';
import { FirebaseDataGenerator } from '../models/firebase/FirebaseDataGenerator.js';
import { Add } from '../contracts/Add.js';
import { PromoteBjjStudent } from '../PromoteBjjStudent.js';

let proofsEnabled = false;

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: ProofOfKarateRankNoParent,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender;

console.log('compiling AddBjjRank', new Date().toLocaleTimeString());
if (proofsEnabled) await PromoteBjjStudent.compile();
console.log('AddBjjRank compiled', new Date().toLocaleTimeString());

studentAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
  ),
};
const Berkeley = Mina.Network(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
console.log('Berkeley Instance Created');
Mina.setActiveInstance(Berkeley);

let addbjjKey = PublicKey.fromBase58(
  'B62qrrwFn6GbeVJats2Qk86xRS3JBDhdfEyM1zmMP4hc8bwrfgrDPmT'
);
let zk = new PromoteBjjStudent(addbjjKey);
console.log('zkApp created');
console.log('getting root');
await fetchAccount({ publicKey: addbjjKey });
let contractRoot = zk.mapRoot.get().toString();
console.log('contract root: ', contractRoot);

let collectionName = 'BJJ';
let backingStore = new FirebaseBackingStore(collectionName);
let backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot();
console.log('baking store root: ', backingStoreRoot.toString());
const transactionFee = 100_000_000;

// // update transaction
// const txn = await Mina.transaction(
//   { sender: studentAccount.publicKey, fee: transactionFee },
//   () => {
//     zk.setMapRoot(backingStoreRoot);
//   }
// );
// await txn.prove();
// let result = await txn.sign([studentAccount.privateKey]).send();
// console.log('transaction sent');
// console.log(result.hash());
// console.log(result.isSuccess);

// await fetchAccount({ publicKey: addbjjKey });
// contractRoot = zk.mapRoot.get().toString();
// console.log('new contract root: ', contractRoot);
