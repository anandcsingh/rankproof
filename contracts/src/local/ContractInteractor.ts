import { AccountUpdate, Mina, PrivateKey } from 'snarkyjs';
import { ProofOfRank } from '../index.js';
import { Sender } from '../models/Sender.js';

export class LocalContractDeployer {
  zkAppAccount: Sender;
  deployer: Sender;
  zkAppAddress: any;

  constructor(deployer: Sender) {
    this.deployer = deployer;

    const zkAppPrivateKey = PrivateKey.random();
    this.zkAppAddress = zkAppPrivateKey.toPublicKey();
    this.zkAppAccount = {
      privateKey: zkAppPrivateKey,
      publicKey: this.zkAppAddress,
    };
  }

  async deployProofofRank(): Promise<ProofOfRank> {
    // create an instance of Square
    const zkApp = new ProofOfRank(this.zkAppAddress);
    const txn = await this.deployContract(zkApp);
    console.log('\nmain: transaction create deployTxn=', txn.isSuccess);
    return zkApp;
  }

  async deployContract(contract: any): Promise<Mina.TransactionId> {
    const deployTxn = await Mina.transaction(this.deployer.publicKey, () => {
      AccountUpdate.fundNewAccount(this.deployer.publicKey);
      contract.deploy();
    });
    const txnResult = await deployTxn
      .sign([this.deployer.privateKey, this.zkAppAccount.privateKey])
      .send();
    return txnResult;
  }
}

export class ContractInteractor {
  sender: Sender;

  constructor(sender: Sender) {
    this.sender = sender;
  }

  async sendTransaction(
    sender: Sender,
    func: (...args: any[]) => any,
    ...args: any[]
  ): Promise<Mina.TransactionId> {
    const txn = await Mina.transaction(this.sender.publicKey, () => {
      func(...args);
    });
    const txnProved = await txn.prove();
    const txnSigned = await txn.sign([this.sender.privateKey]).send();
    return txnSigned;
  }
}
