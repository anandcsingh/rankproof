import { PrivateKey, PublicKey } from 'snarkyjs';
import { FirebaseBackingStore } from './FirebaseBackingStore.js';
import { faker } from '@faker-js/faker';

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
    let rootNode = {
      id: 1,
      publicKey: 'B62qikdZJTeh7toNWtckkRtDBnnCNT4EPjhy6stYuND2uGjLgueRvT3',
      firstName: 'Helio',
      lastName: 'Gracie',
      rank: 'Red Belt',
      verified: true,
      instructor: '',
      createdDate: '',
      modifiedDate: '',
      discipline: disciple,
    };
    let root = await this.backingStore.getMartialArtistFromDocSnap(rootNode);
    await this.backingStore.upsert(root);
    console.log('root key', root.publicKey.toBase58());
    let index = 2;
    let instructors: any[] = [];

    let staticInstructor = {
      id: index++,
      publicKey: 'B62qqzMHkbogU9gnQ3LjrKomimsXYt4qHcXc8Cw4aX7tok8DjuDsAzx',
      firstName: 'John',
      lastName: 'Danaher',
      rank: 'Black Belt',
      verified: true,
      instructor: root.publicKey.toBase58(),
      createdDate: '',
      modifiedDate: '',
      discipline: disciple,
    };
    instructors.push(staticInstructor);
    let ma = await this.backingStore.getMartialArtistFromDocSnap(
      staticInstructor
    );
    await this.backingStore.upsert(ma);
    console.log(
      'static instructor',
      ma.firstName.toString(),
      ' ',
      ma.lastName.toString()
    );

    for (let i = 0; i < numInstructors - 1; i++) {
      let instructor = {
        id: index++,
        publicKey: PublicKey.fromPrivateKey(PrivateKey.random()).toBase58(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
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

    let lowerRanks = ranks.filter((rank) => rank != 'Black Belt');
    let students: any[] = [];
    let staticStudent = {
      id: index++,
      publicKey: 'B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR',
      firstName: 'Gordon',
      lastName: 'Ryan',
      rank: Math.random() < 0.5 ? 'Purple Belt' : 'Brown Belt',
      verified: Math.random() < 0.5,
      instructor: staticInstructor.publicKey,
      createdDate: '',
      modifiedDate: '',
      discipline: disciple,
    };
    students.push(staticStudent);
    ma = await this.backingStore.getMartialArtistFromDocSnap(staticStudent);
    await this.backingStore.upsert(ma);
    console.log(
      'static student',
      ma.firstName.toString(),
      ' ',
      ma.lastName.toString()
    );
    let staticInstructorStudents = Math.floor(numStudents / 2);
    let countOfStatic = 0;
    for (let i = 0; i < numStudents - 1; i++) {
      let student = {
        id: index++,
        publicKey: PublicKey.fromPrivateKey(PrivateKey.random()).toBase58(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        rank: lowerRanks[Math.floor(Math.random() * lowerRanks.length)],
        verified: Math.random() < 0.5,
        instructor:
          countOfStatic < staticInstructorStudents
            ? staticInstructor.publicKey
            : instructors[Math.floor(Math.random() * instructors.length)]
                .publicKey,
        createdDate: '',
        modifiedDate: '',
        discipline: disciple,
      };
      countOfStatic++;
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
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        rank: lowerRanks[Math.floor(Math.random() * lowerRanks.length)],
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
