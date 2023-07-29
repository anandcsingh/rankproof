import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from "react";
import { InstructorArtViewModel } from '../../view-models/InstructorArtViewModel';
import { Tabs } from 'flowbite-react';
import StudentList from './StudentList';
import { Disciplines } from '../../../../contracts/build/src/models/MartialArtistRepository';
import { curveBasisClosed } from 'd3';
import { Field, MerkleMap, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from '../../../../contracts/build/src/models/firebase/FirebaseBackingStore';
import { AuthContext } from '@/components/layout/AuthPage';

const InstructorMartialArts = ({martialArts}) => {
  let [showStudents, setShowStudents] = useState(false);
  const authState = useContext(AuthContext);

  const getMartialArt = async (discipline) => {
    let instructorAddress = PublicKey.fromBase58("B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx");
    //let studentAddress = PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR");
    console.log("authState", authState);
    let address = authState.userAddress == '' ? 
      instructorAddress : PublicKey.fromBase58(authState.userAddress);
    let backingStore = new FirebaseBackingStore(discipline);

    //let martialArt = await backingStore.get(instructorAddress);
    let martialArt = await backingStore.get(address);
    return backingStore.getObjectFromStruct(martialArt);
  }

  useEffect(() => {

    (async () => {
      if(authState.userAuthenticated) {
        console.log("InstructorMartialArts martialArts", martialArts);
        setShowStudents(true);
      }
        })();

  }, []);

  return (
<>

    <div>
      {showStudents && martialArts.map((i, index) => (
        <div key={index} className="collapse collapse-plus bg-gray-100 mb-5">
          <input type="radio" name="my-accordion-3" className="w-full" />
          <div className="collapse-title text-xl font-medium text-primary">
            {i.discipline}
          </div>
          <div className="collapse-content">
            <StudentList studentList={i.students} />
          </div>
        </div>
      ))}
    </div>

</>
  );
}

export default InstructorMartialArts;
