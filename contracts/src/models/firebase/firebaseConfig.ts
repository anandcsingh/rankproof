import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDKlw-XbRKLRTjFZ05TjfMWceZ2GTtBxQw',
  authDomain: 'rankproof.firebaseapp.com',
  projectId: 'rankproof',
  storageBucket: 'rankproof.appspot.com',
  messagingSenderId: '479616737454',
  appId: '1:479616737454:web:c29937cc4132262b63cd3f',
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
