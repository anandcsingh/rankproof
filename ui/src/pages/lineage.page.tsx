import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import DynamicLineageMap from '../components/sections/DynamicLineageMap'


export default function Lineage() {

  return (
    <Master>
      <AuthPage validate={false}>
        <div>
          <h1>Lineage</h1>
          <DynamicLineageMap />
        </div>
      </AuthPage>
    </Master>

  );
}