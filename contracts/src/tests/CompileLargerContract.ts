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
import { AllMartialArtsWithStruct } from '../AllMartialArtsWithStruct.js';
import { ProofOfRankData } from './ProofOfRankData.js';

let proofsEnabled = false;

let senderAccount: PublicKey,
  senderKey: PrivateKey,
  zkAppAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  zkApp: AllMartialArtsWithStruct,
  deployerAccount: Sender,
  studentAccount: Sender,
  instructorAccount: Sender,
  collectionName: string,
  backingStore: BackingStore;

let newKey: any = null;

if (proofsEnabled) {
  console.log(
    'compiling AllMartialArtsWithStruct',
    new Date().toLocaleTimeString()
  );
  const { verificationKey: newVerificationKey } =
    await AllMartialArtsWithStruct.compile();
  newKey = newVerificationKey;

  console.log(
    'AllMartialArtsWithStruct compiled',
    new Date().toLocaleTimeString()
  );
}

const useProof = false;
[deployerAccount, studentAccount, instructorAccount] = new MinaLocalBlockchain(
  useProof
).accounts;
zkAppPrivateKey = PrivateKey.random();
zkAppAddress = zkAppPrivateKey.toPublicKey();

async function localDeploy() {
  const txn = await Mina.transaction(deployerAccount.publicKey, () => {
    AccountUpdate.fundNewAccount(deployerAccount.publicKey);
    zkApp.deploy();
  });
  await txn.prove();
  // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
  await txn.sign([deployerAccount.privateKey, zkAppPrivateKey]).send();
}
zkApp = new AllMartialArtsWithStruct(zkAppAddress);

await localDeploy();
let student = new ProofOfRankData().getStudent(studentAccount);

// update transaction
const txn = await Mina.transaction(studentAccount.publicKey, () => {
  zkApp.proveBjjRank(student, instructorAccount.publicKey);
});
await txn.prove();
await txn.sign([studentAccount.privateKey]).send();
