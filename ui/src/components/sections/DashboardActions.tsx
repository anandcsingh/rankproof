import Authentication from '@/modules/Authentication';
import React, { Component } from 'react';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '@/components/layout/AuthPage';
interface DashboardActionsProps {
  // Define any props you want to pass to the component here
  authenticatedState: boolean;
}
const DashboardActions = () => {
  const authState = useContext(AuthContext);
  console.log(authState.userAuthenticated );
  return (
    <div className='pt-24'>
      {authState.userAuthenticated && ( <h2>Address: {authState.userAddress}</h2> ) }
      {!authState.userAuthenticated  && ( <h2>Address: Not set up</h2> )}
    </div>
  );
};

export default DashboardActions;