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
import { AddBjjRank } from '../AddBjjRank.js';

let proofsEnabled = true;

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: AddBjjRank,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;

let newKey: any = null;
console.log('compiling AddBjjRank', new Date().toLocaleTimeString());
if (proofsEnabled) {
  const { verificationKey: newVerificationKey } = await AddBjjRank.compile();
  newKey = newVerificationKey;
}
console.log('AddBjjRank compiled', new Date().toLocaleTimeString());
console.log('verificationHash: ', newKey.hash.toString());
let fundingAccount = {
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
  'B62qm8DvhEupBjyV7HR4ppJ2QojvLLcdHRiUejpuGL25kDHNnAaETR3'
);

const liveVerificationKey = Mina.getAccount(addbjjKey).zkapp?.verificationKey;
console.log('current verification key', liveVerificationKey);
const transactionFee = 100_000_000;

const tx2 = await Mina.transaction(
  { sender: fundingAccount.publicKey, fee: transactionFee },
  () => {
    zkApp.replaceVerificationKey(newKey);
  }
);
await tx2.prove();
let result = await tx2.sign([fundingAccount.privateKey]).send();
const transactionLink = `https://berkeley.minaexplorer.com/transaction/${result.hash()}`;
console.log(`View transaction at ${transactionLink}`);
console.log(`Transaction success: ${result.isSuccess}`);
