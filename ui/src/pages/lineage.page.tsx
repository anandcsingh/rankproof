import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Lineage() {

  return (
    <Master>
      <AuthPage validate={false}>
        <h1>Lineage</h1>
      </AuthPage>
    </Master>
  );
}