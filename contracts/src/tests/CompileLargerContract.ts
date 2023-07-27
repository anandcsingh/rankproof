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

let proofsEnabled = true;

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
console.log(
  'compiling AllMartialArtsWithStruct',
  new Date().toLocaleTimeString()
);
if (proofsEnabled) {
  const { verificationKey: newVerificationKey } =
    await AllMartialArtsWithStruct.compile();
  newKey = newVerificationKey;
}
console.log(
  'AllMartialArtsWithStruct compiled',
  new Date().toLocaleTimeString()
);
