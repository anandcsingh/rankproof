import Authentication from '@/modules/Authentication';
import React, { Component } from 'react';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '@/components/layout/AuthPage';
import { UserMartialArts, UserMartialArt } from '@/modules/UserMartialArts';

interface DashboardActionsProps {
  // Define any props you want to pass to the component here
  authenticatedState: boolean;
}
const DashboardActions = () => {

  const [disciplinesLoaded, setDisciplinesLoaded] = useState(false);
  const [disciplines, setDisciplines] = useState(Array<UserMartialArt>()); 
  const authState = useContext(AuthContext);
  const [isInstructorInAnyDiscipline, setIsInstructorInAnyDiscipline] = useState(false);
  const verifiedClass = "card w-96 bg-yellow-300 text-primary-content";
  const unVerifiedClass = "card w-96 bg-zinc-300 text-primary-content";
  
  console.log("DashboardActions starting", authState);
  useEffect(() => {

    (async () => {
  console.log("DashboardActions before Authenticated", authState);

      if (authState.userAuthenticated) {
  console.log("DashboardActions before authenticated", authState);
        
        const disciplines = new UserMartialArts();
        const userDisciplines = await disciplines.getMartialArts(authState.userAddress);
        console.log("DashboardActions userDisciplines", userDisciplines);
        setDisciplines(userDisciplines);
        setDisciplinesLoaded(true);
        console.log("DashboardActions disciplinesLoaded", disciplinesLoaded);
      }

    })();

  }, []);

  return (
    <div className='pt-24'>
      
      <div className="grid grid-cols-3 gap-4">
        {disciplines.map((discipline, index) => (
          
          <div className={discipline.verified ? verifiedClass : unVerifiedClass}>
          <div className="card-body">
            <h2 className="card-title">{discipline.discipline}</h2>
            <p>{discipline.rank}</p>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardActions;