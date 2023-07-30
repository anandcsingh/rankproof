import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  Bool,
  fetchAccount,
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
import { AllMartialArtsEvents } from '../AllMartialArtsEvents.js';

const runOnBerekley = true;
const contractAddress =
  'B62qkDQqHBkiL6bXWh2RU81C1fBLQqQVK3CMVmW7DAq1yiAg2QPRtdC';

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: AllMartialArtsEvents,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;

if (runOnBerekley) {
  console.log(
    'compiling AllMartialArtsEvents',
    new Date().toLocaleTimeString()
  );
  await AllMartialArtsEvents.compile();
  console.log('AllMartialArtsEvents compiled', new Date().toLocaleTimeString());
}
[deployerAccount, studentAccount, instructorAccount] = new MinaLocalBlockchain(
  runOnBerekley
).accounts;
zkAppPrivateKey = PrivateKey.random();
zkAppAddress = zkAppPrivateKey.toPublicKey();

if (runOnBerekley) {
  const Berkeley = Mina.Network(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  console.log('Berkeley Instance Created');
  Mina.setActiveInstance(Berkeley);
  zkAppAddress = PublicKey.fromBase58(contractAddress);
  await fetchAccount({ publicKey: zkAppAddress });
  studentAccount = {
    publicKey: PublicKey.fromBase58(
      'B62qjBcYihfVGHyQGuxgG5m4QbPrq6jEEMys5p4fe4Pt33CmWy7Bvuq'
    ),
    privateKey: PrivateKey.fromBase58(
      'EKFUES7YfgYm38njcBHzxyU6RPZQdZnfThcMzLrHL9LjyxJKfXzY'
    ),
  };
  instructorAccount = {
    publicKey: PublicKey.fromBase58(
      'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx'
    ),
    privateKey: PrivateKey.fromBase58(
      'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
    ),
  };
}
const transactionFee = 100_000_000;

zkApp = new AllMartialArtsEvents(zkAppAddress);
collectionName = 'BJJ';
let student = new ProofOfRankData().getStudent(studentAccount);
backingStore = new FirebaseBackingStore(collectionName);
let merkleStore = await backingStore.getMerkleMap();
let witness = merkleStore.map.getWitness(student.id);
let hash = student.hash();
for (let i = 0; i < 1; i++) {
  console.log('Proving student', i + 1);
  let txn = await Mina.transaction(
    { sender: studentAccount.publicKey, fee: transactionFee },
    () => {
      zkApp!.proveJuijiteiro(
        student.publicKey,
        hash,
        student.instructor,
        witness
      );
    }
  );
  await txn.prove();
  let result = await txn.sign([studentAccount.privateKey]).send();
  console.log('Proved student', i + 1);

  console.log(`Transaction hash: ${result.hash()}`);
}
