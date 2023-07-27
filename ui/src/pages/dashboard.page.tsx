import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { Disciplines } from '../../../contracts/build/src/models/MartialArtistRepository';
import { FirebaseBackingStore } from '../../../contracts/build/src/models/firebase/FirebaseBackingStore';
import { get } from 'http';
import { Field, MerkleMap, PublicKey } from 'snarkyjs';
import Authentication from '@/modules/Authentication';
import AddBjjRankWorkerClient from '@/modules/workers/bjj/AddBjjRankWorkerClient';
import PromoteBjjStudentWorkerClient from '@/modules/workers/bjj/PromoteBjjStudentWorkerClient';
import QRCodeCreator from '@/components/QRCodeCreator';
type DashboardState = {
  martialArtsLoaded: boolean,
  martialArts: Array<any>,
}
export default function Dashboard() {

  let [state, setState] = useState<DashboardState>({
    martialArtsLoaded: false,
    martialArts: [],
  });
  const [textboxValue, setTextboxValue] = useState('');
  const handleTextboxChange = async (event: any) => {
    setTextboxValue(event.target.value);
  };
  const getBackingStoreRoot = async () => {
    let backingStore = new FirebaseBackingStore("BJJ");
    const merkleStore = await backingStore.getMerkleMap();
    const currentRoot = merkleStore.map.getRoot().toString();
    console.log(`Current backing store root: ${currentRoot}`);

  }
  const getMartialArt = async (discipline: string) => {
    let instructorAddress = PublicKey.fromBase58("B62qmdQVgKWmWWxtNpfjdx9wUp6fm1eUsBrK4V3PXjm4bFBvDTK5U3U");
    let studentAddress = PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR");

    let backingStore = new FirebaseBackingStore(discipline);

    //let martialArt = await backingStore.get(instructorAddress);
    let martialArt = await backingStore.get(studentAddress);
    return martialArt;
  }

  const getRoot = async () => {
    console.log('getting root...');
    // let client = Authentication.zkClient! as AddBjjRankWorkerClient;
    // await client.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.contractAddress) });
    // console.log(`fetching account done ${Authentication.contractAddress}`);
    // let currentNum = await client.getStorageRoot();
    // console.log(`old way: Current number in zkApp root: ${currentNum.toString()}`);

    //let client = Authentication.getContractsFromLoader()["BJJ"]["add"] as AddBjjRankWorkerClient;
    let client = Authentication.bjjAddClient! as AddBjjRankWorkerClient;
    await client.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.bjjAddAddress) });
    console.log('add bjj: fetching account done');
    let currentNum = await client.getStorageRoot();
    console.log(`add bjj: Current number in zkApp root: ${currentNum.toString()}`);

    // let client2 = Authentication.bjjPromoteClient! as PromoteBjjStudentWorkerClient;
    // await client2.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.bjjPromoteAddress) });
    // console.log('promote: fetching account done');
    // let currentNum2 = await client2.getStorageRoot();
    // console.log(`promote: Current number in zkApp root: ${currentNum2.toString()}`);

  }
  const setRoot = async () => {
    console.log('setting root...');
    let client = Authentication.bjjAddClient! as AddBjjRankWorkerClient;
    let newRoot = Field(new MerkleMap().getRoot()).toString();
    if (textboxValue) {
      newRoot = textboxValue;
    }
    console.log(`new root: ${newRoot}`);
    await client.setStorageRoot(newRoot);
    console.log('root set');
    console.log('creating proof...');
    await client.proveUpdateTransaction();
    console.log('proof created');

    console.log('getting Transaction JSON...');
    const transactionJSON = await client!.getTransactionJSON()

    console.log('requesting send transaction...');
    let transactionFee = 0.1;

    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    console.log(
      'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );

  }

  useEffect(() => {
    (async () => {
      let martialArts: Array<any> = new Array<any>();
      let disciplines = Disciplines;
      for (let discipline in disciplines) {
        let ma = await getMartialArt(discipline);
        if (ma) {
          martialArts.push(ma);
        }
      }

      console.log(martialArts);
      setState({ martialArtsLoaded: true, martialArts: martialArts });
    })();
  }, []);

  return (
    <Master>
      <AuthPage validate={true}>
        <div className="mr-auto pt-24 place-self-center lg:col-span-7  space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
            <button className='btn btn-primary' onClick={setRoot}>Set Contract Root</button>
            </div>
            <div>
            <button className='btn btn-secondary' onClick={getRoot}>Get Contract Root</button>
            </div>
            <div>
              <button className='btn btn-secondary' onClick={getBackingStoreRoot}>Get Backing Store Root</button>
            </div>
            <div>
<button className="btn" onClick={()=>window.my_modal_3.showModal()}>Show Address</button>
<dialog id="my_modal_3" className="modal">
  <form method="dialog" className="modal-box">
    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    <QRCodeCreator address="B62qmdQVgKWmWWxtNpfjdx9wUp6fm1eUsBrK4V3PXjm4bFBvDTK5U3U" />
    <p className="py-4">Press ESC key or click on ✕ button to close</p>
  </form>
</dialog>
            </div>
          </div>
          <div>
            <input onChange={handleTextboxChange} type="text" placeholder="Enter new contract root" className="input input-bordered w-full max-w-xs" />
          </div>
          <div className={styles.grid}>
            {state.martialArtsLoaded && state.martialArts.length > 0 && state.martialArts.map((martialArt, index) => (
              <div className={styles.card} key={index}>
                <h2>
                  <span>{martialArt.discipline.toString()}</span>
                  <div>
                    <Image
                      src="/assets/arrow-right-small.svg"
                      alt="Mina Logo"
                      width={16}
                      height={16}
                      priority
                    />
                  </div>
                </h2>
                <p>{martialArt.rank.toString()}: {martialArt.verified.toBoolean() ?
                  <span className='badge badge-warning'><strong>verified</strong></span>
                  : <span className='badge badge-ghost'><strong>not verified</strong></span>
                }</p>
              </div>
            ))}

          </div>
        </div>
      </AuthPage>
    </Master>
  );
}