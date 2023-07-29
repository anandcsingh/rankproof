import Master from '../components/layout/Master'
import { AuthPage } from '../components/layout/AuthPage'
import Link from 'next/link'
import Add from './add.page';
import InstructorsDen from './instructorsden.page';
import QRCodeCreator from '@/components/QRCodeCreator';
import React, { useState } from 'react';
import Authentication from '@/modules/Authentication';
import DashboardActions from '@/components/sections/DashboardActions/DashboardActions';
import LineagePage from '@/components/sections/LineagePage';
import DashboardContainer from '@/components/sections/DashboardContainer';
export default function Dashboard() {

  const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const showAddressModalRef = React.useRef<HTMLDivElement>(null);
  const showAddressModal = async () => {
    let tempAddress = Authentication.address ? Authentication.address : 'No address loaded';// Authentication.address;
    setAddress(tempAddress);
    setShowAddress(true);
    try {
      (window as any).share_address_modal.showModal();
    } catch (error) {
      console.log(error);
    }
  }


  return (
      <AuthPage validate={false}>
                <DashboardContainer showDummyData={true} dummyDataIsInstructor={true} />
       </AuthPage>
  );
}