import {
  fetchAccount,
  PublicKey,
  PrivateKey,
  Field,
} from 'snarkyjs'

import type { ZkappWorkerRequest, ZkappWorkerReponse, WorkerFunctions } from './rankedWorker';

export default class RankedWorkerClient {

  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call('loadSnarkyJS', {});
  }

  setActiveInstanceToBerkeley() {
    return this._call('setActiveInstanceToBerkeley', {});
  }

  loadContract() {
    return this._call('loadContract', {});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

  fetchAccount({ publicKey }: { publicKey: PublicKey }): ReturnType<typeof fetchAccount> {
    //console.log('fetchAccount from ranked worker client: ', publicKey.toBase58());
    const result = this._call('fetchAccount', { publicKey58: publicKey.toBase58() });
    return (result as ReturnType<typeof fetchAccount>);
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call('initZkappInstance', { publicKey58: publicKey.toBase58() });
  }
  async getInstructor(): Promise<PublicKey> {
    const result = await this._call('getInstructor', {});
    return PublicKey.fromJSON(JSON.parse(result as string));
  }
  async getIbjjf(): Promise<Field> {
    const result = await this._call('getIbjjf', {});
    return Field.fromJSON(JSON.parse(result as string));
  }
  async getItf(): Promise<Field> {
    const result = await this._call('getIbjjf', {});
    return Field.fromJSON(JSON.parse(result as string));
  }
  async getWkf(): Promise<Field> {
    const result = await this._call('getIbjjf', {});
    return Field.fromJSON(JSON.parse(result as string));
  }
  async getRank(martialArt: string): Promise<Field> {
    const result = await this._call('getRank', {
      martialArt
    });
    return Field.fromJSON(JSON.parse(result as string));
  }
  createUpdateBlackBeltTransaction(newBlackBelt: PublicKey) {
    return this._call('createUpdateBlackBeltTransaction', {
      newBlackBelt
    });
  }
  createCertifyTransaction(martialArt: string, certifier: PublicKey, userOldData: Field, userNewData: Field) {
    return this._call('createCertifyTransaction', {
      martialArt, certifier, userOldData, userNewData
    });
  }

  proveUpdateTransaction() {
    return this._call('proveUpdateTransaction', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: { [id: number]: { resolve: (res: any) => void, reject: (err: any) => void } };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./rankedWorker.ts', import.meta.url))
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject }

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}

