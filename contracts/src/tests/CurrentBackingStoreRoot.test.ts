import { FirebaseBackingStore } from '../models/firebase/FirebaseBackingStore.js';

let collectionName = 'BJJ';

// deploy zkApp
let backingStore = new FirebaseBackingStore(collectionName);
let backingStoreRoot = (await backingStore.getMerkleMap()).map
  .getRoot()
  .toString();
console.log('backingStore root: ', backingStoreRoot);
