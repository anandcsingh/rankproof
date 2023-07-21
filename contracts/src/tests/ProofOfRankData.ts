import { Bool, CircuitString, Field, PublicKey } from 'snarkyjs';
import { MartialArtist } from '../models/MartialArtist.js';
import { Sender } from '../models/Sender.js';

export class ProofOfRankData {
  getStudent(studentAccount: Sender): MartialArtist {
    let studentData = {
      id: Field(1),
      publicKey: studentAccount.publicKey,
      rank: CircuitString.fromString('Blue Belt'),
      verified: Bool(false),
      instructor: PublicKey.empty(),
      createdDate: CircuitString.fromString(''),
      modifiedDate: CircuitString.fromString(''),
      discipline: CircuitString.fromString('BJJ'),
    };
    let student = new MartialArtist(studentData);
    return student;
  }

  getInstructor(instructorAccount: Sender): MartialArtist {
    let instructorData = {
      id: Field(2),
      publicKey: instructorAccount.publicKey,
      rank: CircuitString.fromString('Black Belt'),
      verified: Bool(true),
      instructor: PublicKey.fromBase58(
        'B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR'
      ),
      createdDate: CircuitString.fromString('2020-01-01'),
      modifiedDate: CircuitString.fromString('2020-01-01'),
      discipline: CircuitString.fromString('BJJ'),
    };
    let instructor = new MartialArtist(instructorData);
    return instructor;
  }
}
