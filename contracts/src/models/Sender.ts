import { PrivateKey, PublicKey } from 'snarkyjs';

export interface Sender {
  privateKey: PrivateKey;
  publicKey: PublicKey;
}
