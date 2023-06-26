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
import { Tabs } from 'flowbite-react';
import StudentList from '../components/sections/StudentList';

export class Student {
  name: string;
  rank: string;
  promotedDate: string;
}

export class InstructorArt {
  martialArt: string;
  rank: string;
  promotedDate: string;
  students: Array<Student>;
}


export default function InstructorsDen() {

  let [state, setState] = useState({
    show: false,
    items: Array<InstructorArt>(),
  });



  useEffect(() => {
    let arts = [
    { martialArt: "BJJ", rank: "Black Belt", promotedDate: "2021-01-01", 
    students: [
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
      {name: "Anand", rank:"White",promotedDate: "2022-01-02"}] 
    },
    { martialArt: "Judo", rank: "Black Belt", promotedDate: "2022-04-03", students: [] }];
    setState({ ...state, items: arts, show: true });
  }, []);



  return (
    <Master>
      <AuthPage validate={false}>

        {state.show &&
          <div>
            <Tabs.Group aria-label="Default tabs" style="underline">
              {state.items.map((i, index) => (
                <Tabs.Item active={index == 0} title={i.martialArt} key={index}>
                  <StudentList studentList={i.students} />
                </Tabs.Item>
              ))}
            </Tabs.Group>

          </div>
        }

      </AuthPage>
    </Master>
  );
}