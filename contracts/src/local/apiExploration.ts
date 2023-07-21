import { Bool, CircuitString, Field, PublicKey } from 'snarkyjs';

// let emptyKey = PublicKey.empty();
// let emptyKeyString = emptyKey.toBase58();
// console.log(`emptyKeyString: ${emptyKeyString}`);

let internal = { x: Field(0), isOdd: Bool(false) };
let emptyKey = PublicKey.from(internal);
emptyKey.x = Field(0);
emptyKey.isOdd = Bool(false);
let emptyKeyString = emptyKey.toBase58();
console.log(`emptyKeyString 2: ${emptyKeyString}`);
// emptyKeyString = PublicKey.toBase58(emptyKey);
// console.log(`emptyKeyString 3: ${emptyKeyString}`);

// let emptyString = CircuitString.fromString("");
// console.log(`emptyString: ${emptyString.toString()}`);
// let str = "";
// emptyString = CircuitString.fromString(str);
// console.log(`emptyString 2: ${emptyString.toString()}`);
