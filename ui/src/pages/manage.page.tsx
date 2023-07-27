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
import AllMaWorkerClient from '@/modules/workers/AllMaWorkerClient';
import QRCodeScanner from "../components/QRCodeScanner";

import QRCodeCreator from '@/components/QRCodeCreator';
import { rank } from 'd3';
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
  const [disciplineValue, setDisciplineValue] = useState('');
  const handleDiscipleineChange = async (event: any) => {
    setDisciplineValue(event.target.value);
  };
  const [rankValue, setRankValue] = useState('');
  const handleRankChange = async (event: any) => {
    setRankValue(event.target.value);
  };
  const [instructorValue, setInstructorValue] = useState('');
  const handleInstructorChange = async (event: any) => {
    setInstructorValue(event.target.value);
  };

  const getBackingStoreRoot = async () => {
    let backingStore = new FirebaseBackingStore("BJJ");
    let merkleStore = await backingStore.getMerkleMap();
    let currentRoot = merkleStore.map.getRoot().toString();
    console.log(`bjj backing store root: ${currentRoot}`);

    backingStore = new FirebaseBackingStore("Judo");
    merkleStore = await backingStore.getMerkleMap();
    currentRoot = merkleStore.map.getRoot().toString();
    console.log(`judo backing store root: ${currentRoot}`);

    backingStore = new FirebaseBackingStore("Karate");
    merkleStore = await backingStore.getMerkleMap();
    currentRoot = merkleStore.map.getRoot().toString();
    console.log(`karate backing store root: ${currentRoot}`);

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
    let client = Authentication.zkClient! as AllMaWorkerClient;
    console.log('fetching account...');
    await client.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.contractAddress) });
    console.log(`fetching account done ${Authentication.contractAddress}`);
    let currentNum = await client.getBjjStorageRoot();
    console.log(`bjj root: ${currentNum.toString()}`);

    let currentNum2 = await client.getJudoStorageRoot();
    console.log(`judo root: ${currentNum2.toString()}`);

  }

  const setBjjRoot = async () => {
    console.log('setting bjj root...');
    let client = Authentication.zkClient! as AllMaWorkerClient;
    let newRoot = Field(new MerkleMap().getRoot()).toString();
    if (textboxValue) {
      newRoot = textboxValue;
    }
    console.log(`new bjj root: ${newRoot}`);
    await client.setBjjStorageRoot(newRoot);
    console.log('root bjj set');
    console.log('creating bjj proof...');
    await client.proveUpdateTransaction();
    console.log('proof bjj created');

    console.log('getting bjj Transaction JSON...');
    const transactionJSON = await client!.getTransactionJSON()

    console.log('requesting bjj send transaction...');
    let transactionFee = 0.1;

    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    console.log(
      'See bjj transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );

  }

  const setJudoRoot = async () => {
    console.log('setting Judo root...');
    let client = Authentication.zkClient! as AllMaWorkerClient;
    let newRoot = Field(new MerkleMap().getRoot()).toString();
    if (textboxValue) {
      newRoot = textboxValue;
    }
    console.log(`new Judo root: ${newRoot}`);
    await client.setJudoStorageRoot(newRoot);
    console.log('root Judo set');
    console.log('creating Judo proof...');
    await client.proveUpdateTransaction();
    console.log('proof Judo created');

    console.log('getting Judo Transaction JSON...');
    const transactionJSON = await client!.getTransactionJSON()

    console.log('requesting Judo send transaction...');
    let transactionFee = 0.1;

    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    console.log(
      'See Judo transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );

  }

  const addMartialArt = async (event: any) => {
    
    //let studentID = PublicKey.fromBase58("B62qiaZAHzmpwg2CxK9MFhvJLh2A8TJPqYMAmKmy2D8puRWZJHf5Dq4");
    let studentID = Authentication.address;
    let client = Authentication.zkClient! as AllMaWorkerClient;
    console.log('fetching account...');
    await client.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.contractAddress) });
    console.log(`fetching account done ${Authentication.contractAddress}`);
    console.log('adding martial art...', disciplineValue, rankValue);
    if(disciplineValue == "BJJ") {
      await client.addBjj(studentID, rankValue);
    } else if(disciplineValue == "Judo") {
      await client.addJudo(studentID, rankValue);
    } else if(disciplineValue == "Karate") {
      await client.addKarate(studentID, rankValue);
    }
    console.log("proving update transaction...");
    await client.proveUpdateTransaction();
    console.log("sending transaction...");
    await client.sendTransaction();
    console.log("transaction sent");

    if(disciplineValue == "BJJ") {
    await client.updateBjjBackingStore(studentID, rankValue);
    } else if (disciplineValue == "Judo") {
      await client.updateJudoBackingStore(studentID, rankValue);
    } else if (disciplineValue == "Karate") {
      await client.updateKarateBackingStore(studentID, rankValue);
    }
  }

  const promoteMartialArt = async (event: any) => {
    
    //let studentID = PublicKey.fromBase58("B62qiaZAHzmpwg2CxK9MFhvJLh2A8TJPqYMAmKmy2D8puRWZJHf5Dq4");
    let studentID = Authentication.address;
    let client = Authentication.zkClient! as AllMaWorkerClient;
    console.log('fetching account...');
    await client.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.contractAddress) });
    console.log(`fetching account done ${Authentication.contractAddress}`);
    console.log('adding martial art...', disciplineValue, rankValue);
    if(disciplineValue == "BJJ") {
      await client.promoteBjjStudent(studentID, rankValue, instructorValue);
    } else if(disciplineValue == "Judo") {
      await client.promoteJudoStudent(studentID, rankValue, instructorValue);
    } else if(disciplineValue == "Karate") {
      await client.promoteKarateStudent(studentID, rankValue, instructorValue);
    }
    console.log("proving update transaction...");
    await client.proveUpdateTransaction();
    console.log("sending transaction...");
    await client.sendTransaction();
    console.log("transaction sent");

    if(disciplineValue == "BJJ") {
    await client.updateBjjBackingStore(studentID, rankValue);
    } else if (disciplineValue == "Judo") {
      await client.updateJudoBackingStore(studentID, rankValue);
    } else if (disciplineValue == "Karate") {
      await client.updateKarateBackingStore(studentID, rankValue);
    }
  }

  const addressScanned = async (event: any) => {
    setInstructorValue(event);
    console.log("address scanned", event);
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
      <div className="bg-white lg:py-10 min-h-screen">
        <section className="bg-white place-self-center lg:col-span-7 space-y-8">
          <div className="m-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className=" grid gap-y-24">
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <button className='btn btn-primary' onClick={setBjjRoot}>Set BJJ Contract Root</button>
                  </div>
                  <div>
                    <button className='btn btn-primary' onClick={setJudoRoot}>Set Judo Contract Root</button>
                  </div>
                  <div>
                    <button className='btn btn-secondary' onClick={getRoot}>Get Contract Root</button>
                  </div>
                  <div>
                    <button className='btn btn-secondary' onClick={getBackingStoreRoot}>Get Backing Store Root</button>
                  </div>
                </div>
              </div>
              <div>
                <input onChange={handleTextboxChange} type="text" placeholder="Enter new contract root" className="input input-bordered w-full max-w-xs" />
              </div>
            </div>
            <div className="divider"></div>
                <QRCodeCreator address={"B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx"}></QRCodeCreator>
            <div className="divider"></div>
            <div>
              <div>
                <div>

                  <div className="border-b border-gray-900/10 pb-12">
                    <p className="mt-1 text-sm leading-6 text-gray-600">Select your martial art and rank to begin your journey.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                      <div className="sm:col-span-3">
                        <label htmlFor="martialArt" className="block text-sm font-medium leading-6 text-gray-900">Martial Art</label>
                        <div className="mt-2">
                          <select id="martialArtt" onChange={handleDiscipleineChange} name="martialArt" autoComplete="Martial Art" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                            <option>Select a Martial Art</option>
                            <option>BJJ</option>
                            <option>Judo</option>
                            <option>Karate</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="rank" className="block text-sm font-medium leading-6 text-gray-900">Rank</label>
                        <div className="mt-2">
                          <select id="rank" name="rank" onChange={handleRankChange} autoComplete="Rank" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                            <option>Select a Rank</option>
                            <option>White</option>
                            <option>Blue</option>
                            <option>Pruple</option>
                            <option>Brown</option>
                            <option>Black</option>
                          </select>
                        </div>
                      </div>


                    </div>
                  </div>

                  <div className="border-b border-gray-900/10 pb-12">

                    <div className="mt-10 space-y-10">
                      <fieldset>
                        <div className="mt-6 space-y-6">
                          <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                              <input id="notify" name="notify" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                            </div>
                            <div className="text-sm leading-6">
                              <label htmlFor="notify" className="font-medium text-gray-900">Notify instructor?</label>
                              <p className="text-gray-500">Send a notfication to your instructor so that you can get verified.</p>
                            </div>
                          </div>

                        </div>
                        <div className="sm:col-span-4">
                          <label htmlFor="instructorAddress" className="block text-sm font-medium leading-6 text-gray-900">Instructor address</label>
                          <div className="mt-2">
                            <QRCodeScanner onScan={addressScanned}></QRCodeScanner>
                            <input id="instructorAddress" onChange={handleInstructorChange} value={instructorValue}  name="instructorAddress" type="text" autoComplete="instructor-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          </div>
                        </div>
                      </fieldset>

                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button type="button" onClick={addMartialArt} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
                  <button type="button" onClick={promoteMartialArt} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Promote</button>
                </div>

              </div>
              <div className="divider"></div>
              <div className="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
            </div>
            <div>
              <h1>Add or Promote</h1>

            </div>
          </div>


        </section>

      </div>

      </AuthPage>
    </Master>
  );
}