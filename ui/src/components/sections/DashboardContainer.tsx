import Authentication from '@/modules/Authentication';
import React, { Component } from 'react';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '@/components/layout/AuthPage';
import { UserMartialArts, UserMartialArt } from '@/modules/UserMartialArts';
import DashboardProfile from './DashboardProfile';
import DashboardActions from './DashboardActions/DashboardActions';
import InstructorMartialArts from './InstructorMartialArts';
import LineagePage from './LineagePage';
import DashboardLineageHero from './DashboardLineageHero';
import DashboardStats from './DashboardStats';
import { get } from 'http';
import NotificationBox from './NotificationBox';
import DashboardContainerDataLoader from './DashboardContainerDataLoader';

export interface DashboardContainerProps {
    // Define any props you want to pass to the component here
    showDummyData: boolean;
    dummyDataIsInstructor: boolean;
  }
const DashboardContainer: React.FC<DashboardContainerProps> = ({ showDummyData, dummyDataIsInstructor }) => {

    const [authState, _]  = useContext(AuthContext);
    
    return (
        <>
        { authState.userAuthenticated && <DashboardContainerDataLoader showDummyData={showDummyData} dummyDataIsInstructor={dummyDataIsInstructor} /> }
        </>

    );
};

export default DashboardContainer;


