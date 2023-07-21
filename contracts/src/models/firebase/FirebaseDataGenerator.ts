import { PrivateKey, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from './FirebaseBackingStore.js';

export class FirebaseDataGenerator {
  backingStore: FirebaseBackingStore;
  constructor(backingStore: FirebaseBackingStore) {
    this.backingStore = backingStore;
  }

  async generateData(
    disciple: string,
    numStudents: number,
    numInstructors: number
  ) {
    let ranks = [
      'White Belt',
      'Blue Belt',
      'Purple Belt',
      'Brown Belt',
      'Black Belt',
    ];
    // generate random tree stucture with students and instructors
    console.log(
      `Generating ${numStudents} students and ${numInstructors} instructors for ${disciple}`
    );
    let root = await this.backingStore.getMartialArtistFromDocSnap({
      id: 1,
      publicKey: PublicKey.fromPrivateKey(PrivateKey.random()).toBase58(),
      rank: 'Red Belt',
      verified: false,
      instructor: PublicKey.empty().toBase58(),
      createdDate: '',
      modifiedDate: '',
      discipline: disciple,
    });
    console.log('added root');
    let index = 2;
    let instructors: any[] = [];

    for (let i = 0; i < numInstructors; i++) {
      let instructor = {
        id: index++,
        publicKey: PublicKey.fromPrivateKey(PrivateKey.random()).toBase58(),
        rank: ranks[Math.floor(Math.random() * ranks.length)],
        verified: true,
        instructor: root.publicKey.toBase58(),
        createdDate: '',
        modifiedDate: '',
        discipline: disciple,
      };
      instructors.push(instructor);
      let ma = await this.backingStore.getMartialArtistFromDocSnap(instructor);
      await this.backingStore.upsert(ma);
    }

    let students: any[] = [];
    for (let i = 0; i < numStudents; i++) {
      let student = {
        id: index++,
        publicKey: PublicKey.fromPrivateKey(PrivateKey.random()).toBase58(),
        rank: ranks[Math.floor(Math.random() * ranks.length)],
        verified: Math.random() < 0.5,
        instructor:
          instructors[Math.floor(Math.random() * instructors.length)].publicKey,
        createdDate: '',
        modifiedDate: '',
        discipline: disciple,
      };
      students.push(student);
      let ma = await this.backingStore.getMartialArtistFromDocSnap(student);
      await this.backingStore.upsert(ma);
    }

    let studentsOfStudents: any[] = [];

    for (let i = 0; i < numStudents * 2; i++) {
      let onlyVerifiedStudents = students.filter(
        (student) =>
          student.verified &&
          (student.rank == 'Black Belt' ||
            student.rank == 'Brown Belt' ||
            student.rank == 'Purple Belt')
      );
      let student = {
        id: index++,
        publicKey: PublicKey.fromPrivateKey(PrivateKey.random()).toBase58(),
        rank: 'Black Belt',
        verified: true,
        instructor:
          onlyVerifiedStudents[
            Math.floor(Math.random() * onlyVerifiedStudents.length)
          ].publicKey,
        createdDate: '',
        modifiedDate: '',
        discipline: disciple,
      };
      studentsOfStudents.push(student);
      let ma = await this.backingStore.getMartialArtistFromDocSnap(student);
      await this.backingStore.upsert(ma);
    }
  }
}
