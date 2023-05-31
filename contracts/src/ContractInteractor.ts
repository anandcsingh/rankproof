import { AccountUpdate, Mina } from 'snarkyjs';
import { Sender } from '.';

export class LocalContractDeployer {
  zkAppAccount: Sender;
  deployer: Sender;

  constructor(deployer: Sender, zkAppAccount: Sender) {
    this.deployer = deployer;
    this.zkAppAccount = zkAppAccount;
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
