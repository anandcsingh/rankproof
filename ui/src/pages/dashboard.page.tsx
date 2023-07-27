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
      <AuthPage validate={false}>
        <div className="bg-white lg:py-10 min-h-screen">
          <section className="bg-white place-self-center lg:col-span-7 space-y-8">
            <div className="m-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
              <div
                className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16"
              >
                <div
                  className="mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left rtl:lg:text-right"
                >
                  <h2 className="text-3xl font-bold sm:text-4xl">Find your Linage</h2>

                  <p className="mt-4 text-gray-600">
                    All Martial Artists can view their lineage going as far back as we have data for practitioners. All powered by the Mina blockchain and Zero-Knowledge Proofs.
                  </p>

                  <a
                    href="/lineage"
                    className="mt-8 inline-block rounded btn-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
                  >
                    View Lineage
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
                  >
                    <span className="inline-block rounded-lg bg-gray-50 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                    </span>

                    <h2 className="mt-2 font-bold">Add</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Add a Student.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
                  >
                    <span className="inline-block rounded-lg bg-gray-50 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                    </span>

                    <h2 className="mt-2 font-bold">Instructors</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      View Instructors.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
                  >
                    <span className="inline-block rounded-lg bg-gray-50 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                    </span>

                    <h2 className="mt-2 font-bold">Lineage</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      View Lineage.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
                  >
                    <span className="inline-block rounded-lg bg-gray-50 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                    </span>

                    <h2 className="mt-2 font-bold">Accountant</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
                  >
                    <span className="inline-block rounded-lg bg-gray-50 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                    </span>

                    <h2 className="mt-2 font-bold">Accountant</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
                  >
                    <span className="inline-block rounded-lg bg-gray-50 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                    </span>

                    <h2 className="mt-2 font-bold">Accountant</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white place-self-center lg:col-span-7 space-y-8">
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
              <header className="text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Martial Arts Stats</h2>
              </header>
              <div className="m-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="bg-white stats w-full shadow">
                  <div className="card w-100 bg-gray-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">More Stats!</h2>
                      <p>Would You like to see more interesting martial arts stats?</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">More Stats</button>
                      </div>
                    </div>
                  </div>
                  <div className="stat bg-gray-100 rounded-l-lg">

                    <div className="stat-figure text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Total Black belts</div>
                    <div className="stat-value text-primary">25.6K</div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>

                  <div className="stat bg-gray-100" >
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="stat-title">Total Martial Artists</div>
                    <div className="stat-value text-secondary">2.6M</div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>
                  <div className="stat bg-gray-100">
                    <div className="stat-figure text-secondary">
                      <div className="avatar online">
                        <div className="w-16 rounded-full">
                          <img src="/assets/images/jutsu.png" />
                        </div>
                      </div>
                    </div>
                    <div className="stat-value">86%</div>
                    <div className="stat-title">Progression</div>
                    <div className="stat-desc text-secondary">31 did not rank up</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* <div className="mr-auto place-self-center lg:col-span-7  space-y-4">
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
        </div> */}
      </AuthPage>
    </Master>
  );
}