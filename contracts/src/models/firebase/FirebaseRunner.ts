import { Bool, CircuitString, Field, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from './FirebaseBackingStore.js';
import { FirebaseDataGenerator } from './FirebaseDataGenerator.js';
import { Disciplines } from '../MartialArtistRepository.js';

// let disciple = Disciplines.BJJ;
// let backingStore = new FirebaseBackingStore(disciple);
// await backingStore.clearStore();
// let dataGen = new FirebaseDataGenerator(backingStore);
// await dataGen.generateData(disciple, 10, 5);

let disciple = Disciplines.Judo;
let backingStore = new FirebaseBackingStore(disciple);
await backingStore.clearStore();
let dataGen = new FirebaseDataGenerator(backingStore);
await dataGen.generateData(disciple, 20, 15);

disciple = Disciplines.Karate;
backingStore = new FirebaseBackingStore(disciple);
await backingStore.clearStore();
dataGen = new FirebaseDataGenerator(backingStore);
await dataGen.generateData(disciple, 10, 5);

console.log('done');
