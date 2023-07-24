import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { Disciplines } from '../../../contracts/build/src/models/MartialArtistRepository';
import { FirebaseBackingStore } from '../../../contracts/build/src/models/firebase/FirebaseBackingStore';
import { get } from 'http';
import { PublicKey } from 'snarkyjs';
import { MartialArtist } from '../../../contracts/build/src/models/MartialArtist';

type DashboardState = {
  martialArtsLoaded: boolean,
  martialArts: Array<any>,
}
export default function Dashboard() {

  let [state, setState] = useState<DashboardState>({  
    martialArtsLoaded: false,
    martialArts: [],
  });

  const getMartialArt = async (discipline: string) => {
    let instructorAddress = PublicKey.fromBase58("B62qmdQVgKWmWWxtNpfjdx9wUp6fm1eUsBrK4V3PXjm4bFBvDTK5U3U");
    let studentAddress = PublicKey.fromBase58("B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR");

    let backingStore = new FirebaseBackingStore(discipline);

    //let martialArt = await backingStore.get(instructorAddress);
    let martialArt = await backingStore.get(studentAddress);
    return martialArt;
  }

  useEffect(() => {
    (async () => {
    let martialArts: Array<any> = new Array<any>();
    let disciplines = Disciplines;
    for (let discipline in disciplines) {
      let ma = await getMartialArt(discipline);
      if(ma) {
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
            <p className={styles.tagline}>
                Dashboard    
            </p>
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
            </AuthPage>
        </Master>
  );
}