import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';

let backingStore = new FirebaseBackingStore('BJJ');
await backingStore.clearStore();
backingStore = new FirebaseBackingStore('Judo');
await backingStore.clearStore();
backingStore = new FirebaseBackingStore('Karate');
await backingStore.clearStore();
