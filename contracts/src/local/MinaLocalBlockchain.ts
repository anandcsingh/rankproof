import { Mina, PrivateKey } from 'snarkyjs';
import { Sender } from '../models/Sender.js';

export class MinaLocalBlockchain {
  initialized: boolean;
  accounts: [Sender, Sender, Sender];
  local: any;
  newStudent: any;

  constructor(useProof: boolean) {
    this.local = Mina.LocalBlockchain({ proofsEnabled: useProof });
    Mina.setActiveInstance(this.local);
    this.setupAccounts();
  }
  setupAccounts() {
    const deployerAccount = ({
      privateKey: this.local.testAccounts[0].privateKey,
      publicKey: this.local.testAccounts[0].publicKey,
    } = this.local.testAccounts[0]);

    let senderPrivate = PrivateKey.fromBase58(
      // public key B62qjBcYihfVGHyQGuxgG5m4QbPrq6jEEMys5p4fe4Pt33CmWy7Bvuq
      'EKFUES7YfgYm38njcBHzxyU6RPZQdZnfThcMzLrHL9LjyxJKfXzY'
      //'EKEUf9qCfAj4d9tVFQ7RpUHzny3e4xmed5MZRCSnQNJkEYsDVYPU'
    );
    let senderPublic = senderPrivate.toPublicKey();
    const sender = {
      privateKey: senderPrivate,
      publicKey: senderPublic,
    };

    let instructorPrivate = PrivateKey.fromBase58(
      // public key B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx
      'EKFZWMtRmcQELaJvqcEyEEJqh874B3PndA8kpxSst6AiHtErn7Xw'
      // 'EKEx9KsVNBXumarh3Xs5KmTtFZpCaAVMAEpg974vEkG3xzB962aD'
    );
    let instructorPublic = instructorPrivate.toPublicKey();
    const instructorAccount = {
      privateKey: instructorPrivate,
      publicKey: instructorPublic,
    };

    let newStudent = PrivateKey.fromBase58(
      'EKDzuEofrhNa2iSHS7Zq19fy6p7cX3FYrQ2pQ99uab1JjM4zLwA4'
    ); // B62qk5mbK8NfRVXEw2ubyD2QbuU7WWhevE42yHz9rxgwjt21BtEa6Jg
    let newStudentPublic = newStudent.toPublicKey();
    this.newStudent = { sender: newStudent, publicKey: newStudentPublic };
    this.local.addAccount(sender.publicKey, '10_000_000_000');
    this.local.addAccount(instructorAccount.publicKey, '10_000_000_000');
    this.local.addAccount(newStudentPublic, '10_000_000_000');

    this.accounts = [deployerAccount, sender, instructorAccount];
  }
}
