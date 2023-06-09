import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { FirebaseProofRepository } from '../modules/FirebaseProofRepository';
import { AlertRepository } from '../modules/AlertRepository';
//import { MartialArtist } from '../../../contracts/build/src/models/MartialArtist';
import { useEffect, useState } from "react";

import { Bool, CircuitString, Field, PublicKey, Struct } from 'snarkyjs';
import { MartialArtist } from '../../../contracts/build/src/models/MartialArtist';
export default function Add() {

  let [state, setState] = useState({  
    show: false,
  });

  useEffect(() => {
    setState({ show: true });
  }, []);

  const addMartialArt = async (event: any) => {
    event.preventDefault();
    const { martialArt, rank, notfiy, instructorAddress } = event.target.elements;
    let repo = new FirebaseProofRepository();

    let studentData = {
      id: Field(1),
      publicKey: PublicKey.fromBase58("B62qpXhnspHhPEknMdr8Sr2wUBgDzUozW4eMPAfPdNAdPN6TW7erN37"),
      rank: CircuitString.fromString('Blue Belt'),
      verified: Bool(false),
    };
    let student = new MartialArtist(studentData);
    repo.add(student);
    let alertRepo = new AlertRepository();
    alertRepo.alertInstructor(student.id.toBigInt().toString(), student.publicKey.toBase58(), instructorAddress.value, student.rank.toString());
  }

  return (
    <Master>
      <AuthPage validate={false}>
        <p className={styles.tagline}>
          Add your Martial Art
        </p>

        <form onSubmit={addMartialArt}>
          <div className="space-y-12">

            <div className="border-b border-gray-900/10 pb-12">
              <p className="mt-1 text-sm leading-6 text-gray-600">Select your martial art and rank to begin your journey.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                <div className="sm:col-span-3">
                  <label htmlFor="martialArt" className="block text-sm font-medium leading-6 text-gray-900">Martial Art</label>
                  <div className="mt-2">
                    <select id="martialArtt" name="martialArt" autoComplete="Martial Art" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                      <option>Select a Martial Art</option>
                      <option>Brazilian jiu-jitsu</option>
                      <option>Judo</option>
                      <option>Karate</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="rank" className="block text-sm font-medium leading-6 text-gray-900">Rank</label>
                  <div className="mt-2">
                    <select id="rank" name="rank" autoComplete="Rank" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
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
                      <input id="instructorAddress" name="instructorAddress" type="text" autoComplete="instructor-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                </fieldset>

              </div>
            </div>
          </div>
          { state.show ? 
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
          </div>
          :
          <div className="alert">Loading...</div>
}
        </form>

      </AuthPage>
    </Master>
  );
}