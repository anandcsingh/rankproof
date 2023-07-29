import Authentication from '@/modules/Authentication';
import React, { Component } from 'react';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '@/components/layout/AuthPage';
import { UserMartialArts, UserMartialArt } from '@/modules/UserMartialArts';

interface DashboardProfileProps {
    // Define any props you want to pass to the component here
    disciplines: Array<UserMartialArt>;
}
const DashboardProfile: React.FC<DashboardProfileProps> = ({ disciplines }) => {

    const verifiedClass = "card w-96 bg-yellow-300 text-primary-content";
    const unVerifiedClass = "card w-96 bg-zinc-300 text-primary-content";

    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                {disciplines.map((discipline, index) => (
                    <div className="card w-32 bg-gradient-to-r from-yellow-100 to-amber-200 shadow-xl">
                    <figure className="bg-gray-100"></figure>
                    <div className="card-body">
                        <h2 className="card-title">{discipline.discipline}</h2>
                        <p className="text-primary">{discipline.rank}</p>
                    </div>
                    </div>
                    
                ))}
                <div className="card w-96 bg-zinc-300">
                        <div className="card-body">
                            <h2 className="card-title">ADD new Martial Art</h2>
                            <p>Start your journey in a new Martial Art</p>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default DashboardProfile;