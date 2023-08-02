import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  fetchAccount,
  Bool,
} from 'snarkyjs';
import { MinaLocalBlockchain } from '../local/MinaLocalBlockchain.js';
import { Sender } from '../models/Sender.js';
import {
  MartialArtistRepository,
  BackingStore,
} from '../models/MartialArtistRepository.js';
import { ProofOfRankData } from './ProofOfRankData.js';
import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';
import { AllMartialArts } from '../AllMartialArts.js';
import { FirebaseDataGenerator } from '../models/firebase/FirebaseDataGenerator.js';
import { tr } from '@faker-js/faker';
import PromptSync from 'prompt-sync';
import { AllMartialArtsEvents } from '../AllMartialArtsEvents.js';

let prompt = PromptSync();

const contractAddress = PublicKey.fromBase58(
  'B62qkDQqHBkiL6bXWh2RU81C1fBLQqQVK3CMVmW7DAq1yiAg2QPRtdC'
);
console.log('compiling AllMartialArtsEvents', new Date().toLocaleTimeString());
await AllMartialArtsEvents.compile();
console.log('AllMartialArtsEvents compiled', new Date().toLocaleTimeString());
const Berkeley = Mina.Network(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
Mina.setActiveInstance(Berkeley);
console.log('fetching account');
await fetchAccount({ publicKey: contractAddress });
console.log('account fetched');
let studentAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qjBcYihfVGHyQGuxgG5m4QbPrq6jEEMys5p4fe4Pt33CmWy7Bvuq'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFUES7YfgYm38njcBHzxyU6RPZQdZnfThcMzLrHL9LjyxJKfXzY'
  ),
};
let instructorAccount = {
  publicKey: PublicKey.fromBase58(
    'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
  ),
  privateKey: PrivateKey.fromBase58(
    'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
  ),
};
const transactionFee = 100_000_000;

let zkApp = new AllMartialArtsEvents(contractAddress);
let collectionName = 'Judo';

// deploy zkApp
let backingStore = new FirebaseBackingStore(collectionName);

let root = zkApp.judoMapRoot.get();
let backingStoreRoot = (await backingStore.getMerkleMap()).map
  .getRoot()
  .toString();
let contractRoot = root.toString();
let emptyAssertion = contractRoot == backingStoreRoot;

if (!emptyAssertion) {
  console.log('contract root: ', contractRoot);
  console.log('backingStore root: ', backingStoreRoot);
  console.log(`${emptyAssertion}: Sync zkApp with backingStore`);
  // sync zkApp with backingStore
  let backingStoreMap = await backingStore.getMerkleMap();

  console.log('starting transaction');
  let txn = await Mina.transaction(
    { sender: studentAccount.publicKey, fee: transactionFee },
    () => {
      zkApp.setJudoMapRoot(backingStoreMap.map.getRoot());
    }
  );
  console.log('proving transaction');
  await txn.prove();
  let result = await txn.sign([studentAccount.privateKey]).send();
  console.log('transaction sent: ', result.isSuccess);
  console.log('hash: ', result.hash());
  console.log(`https://berkeley.minaexplorer.com/transaction/${result.hash()}`);
}

let question = prompt('Transaction completed? ');
backingStore = new FirebaseBackingStore(collectionName);
contractRoot = zkApp.judoMapRoot.get().toString();
backingStoreRoot = (await backingStore.getMerkleMap()).map.getRoot().toString();
console.log('contract root: ', contractRoot);
console.log(`${emptyAssertion}: Synced zkApp with backingStore`);
