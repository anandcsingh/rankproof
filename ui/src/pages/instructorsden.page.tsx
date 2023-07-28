import Master from '../components/layout/Master'

import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import InstructorMartialArts from '../components/sections/InstructorMartialArts';

const InstructorsDen = () => {

  return (
    <div>
      <div className="mr-auto pt-24 place-self-center lg:col-span-7 space-y-4">
        <InstructorMartialArts />
      </div>

    </div>
  );
}

export default InstructorsDen;