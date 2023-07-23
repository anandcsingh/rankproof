import { Bool, CircuitString, Field, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from './FirebaseBackingStore.js';
import { FirebaseDataGenerator } from './FirebaseDataGenerator.js';
import { Disciplines } from '../MartialArtistRepository.js';

let disciple = Disciplines.Karate;
let backingStore = new FirebaseBackingStore(disciple);
backingStore.clearStore();
let dataGen = new FirebaseDataGenerator(backingStore);
dataGen.generateData(disciple, 10, 5);
