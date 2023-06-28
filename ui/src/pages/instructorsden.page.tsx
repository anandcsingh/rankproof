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
        <InstructorMartialArts />
      </AuthPage>
    </Master>
  );
}