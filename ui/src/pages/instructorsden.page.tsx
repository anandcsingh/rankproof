import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import InstructorMartialArts from '../components/sections/InstructorMartialArts';

export default function InstructorsDen() {

  return (
    <Master>
      <AuthPage validate={false}>
      <div className="mr-auto pt-24 place-self-center lg:col-span-7 space-y-4">
        <InstructorMartialArts />
      </div>
      </AuthPage>
    </Master>
  );
}