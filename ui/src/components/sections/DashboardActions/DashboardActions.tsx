import Authentication from '@/modules/Authentication';
import React, { Component } from 'react';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '@/components/layout/AuthPage';
import { UserMartialArts, UserMartialArt } from '@/modules/UserMartialArts';
import Add from '@/pages/add.page';
import AddAction from './AddAction';
import InstructorsAction from './InstructorsAction';
import ShareAction from './ShareAction';
import PromoteAction from './PromoteAction';
import RevokeAction from './RevokeAction';
import ProveAction from './ProveAction';

export interface DashboardActionsProps {
  // Define any props you want to pass to the component here
  isInstructor: boolean;
}
const DashboardActions: React.FC<DashboardActionsProps> = ({ isInstructor }) => {
  const authState = useContext(AuthContext);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <AddAction isInstructor={isInstructor} />
      <InstructorsAction isInstructor={isInstructor} />
      <ShareAction isInstructor={isInstructor} />
      <PromoteAction isInstructor={isInstructor} />
      <RevokeAction isInstructor={isInstructor} />
      <ProveAction isInstructor={isInstructor} />
    </div>
  );
};

export default DashboardActions;