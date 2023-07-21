import { Bool, CircuitString, Field, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from './FirebaseBackingStore.js';
import { FirebaseDataGenerator } from './FirebaseDataGenerator.js';

let backingStore = new FirebaseBackingStore('Judo');
backingStore.clearStore();
let dataGen = new FirebaseDataGenerator(backingStore);
dataGen.generateData('Judo', 10, 5);
