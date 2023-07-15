import { Bool, CircuitString, Field } from 'snarkyjs';
import { MartialArtist } from '../models/MartialArtist.js';
import { Sender } from '../models/Sender.js';

export class ProofOfRankData {
  getStudent(studentAccount: Sender): MartialArtist {
    let studentData = {
      id: Field(1),
      publicKey: studentAccount.publicKey,
      rank: CircuitString.fromString('Blue Belt'),
      verified: Bool(false),
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
    };
    let instructor = new MartialArtist(instructorData);
    return instructor;
  }
}
