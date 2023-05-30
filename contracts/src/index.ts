import { Add } from './Add.js';
import { RankProof } from './RankProof.js';

export { Add };
export { RankProof };
import { PrivateKey, PublicKey } from 'snarkyjs';
import { HasMerkleMapContract } from './MerkleMapRank.js';
interface Sender {
  privateKey: PrivateKey;
  publicKey: PublicKey;
}

export { HasMerkleMapContract, Sender };
