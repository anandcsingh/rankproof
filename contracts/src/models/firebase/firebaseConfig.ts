import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Config from './config';

// Initialize Firebase
export const app = initializeApp(Config);
export const database = getFirestore(app);
