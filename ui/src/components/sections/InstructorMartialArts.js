import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { InstructorArtViewModel } from '../../view-models/InstructorArtViewModel';
import { Tabs } from 'flowbite-react';
import StudentList from './StudentList';
import { Disciplines } from '../../../../contracts/build/src/models/MartialArtistRepository';
import { curveBasisClosed } from 'd3';
import { Field, MerkleMap, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from '../../../../contracts/build/src/models/firebase/FirebaseBackingStore';

const InstructorMartialArts = () => {
  let [state, setState] = useState({
    show: false,
    items: [],
  });
  const getMartialArt = async (discipline) => {
    let instructorAddress = PublicKey.fromBase58("B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx");
    //let studentAddress = PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR");

    let backingStore = new FirebaseBackingStore(discipline);

    //let martialArt = await backingStore.get(instructorAddress);
    let martialArt = await backingStore.get(instructorAddress);
    return backingStore.getObjectFromStruct(martialArt);
  }

  useEffect(() => {

    (async () => {
      let arts = [];
      let disciplines = Disciplines;
      for (let discipline in disciplines) {
        let ma = await getMartialArt(discipline);
        if (ma) {
          arts.push(ma);
          let backingStore = new FirebaseBackingStore(discipline);
          let students = await backingStore.getAllStudents(ma.publicKey);
          ma.students = students;
        }
      }

      // let arts = [
      // { martialArt: "BJJ", rank: "Black Belt", promotedDate: "2021-01-01", 
      // students: [
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      //   {name: "Anand", rank:"White",promotedDate: "2022-01-02"}] 
      // },
      // { martialArt: "Judo", rank: "Black Belt", promotedDate: "2022-04-03", students: [] }];
      setState({ ...state, items: arts, show: true });
    })();

  }, []);

  return (

    <div>
      {state.show && state.items.map((i, index) => (
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
  );
}

export default InstructorMartialArts;
