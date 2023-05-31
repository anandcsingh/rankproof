import { Add } from './Add.js';
import { RankProof } from './RankProof.js';
import { ProofOfRank } from './ProofOfRank.js';
export { Add };
export { RankProof };
export { ProofOfRank };
import { PrivateKey, PublicKey } from 'snarkyjs';
import { HasMerkleMapContract } from './MerkleMapRank.js';
interface Sender {
  privateKey: PrivateKey;
  publicKey: PublicKey;
}

export { HasMerkleMapContract, Sender };
