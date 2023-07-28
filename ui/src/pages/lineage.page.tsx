import Master from '../components/layout/Master'
import {AuthPage} from '../components/layout/AuthPage'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import DynamicLineageMap from '../components/sections/DynamicLineageMap'
import { useState } from 'react';


export default function Lineage() {
  const [tabs, setTabs] = useState([ 'BJJ', 'Judo', 'Karate']);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index:number) => {
    setActiveTabIndex(index);
  };


  return (
    <Master>
      <AuthPage validate={false}>
      <div className="lg:py-10 min-h-screen">
          <section className="place-self-center lg:col-span-7 space-y-8">
      <div className="tabs flex pt-20">
      {tabs.map((tab, index) => (
        <a
          key={index}
          className={`tab tab-lg flex-auto tab-bordered ${activeTabIndex === index ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </a>
      ))}
    </div>

        {activeTabIndex === 0 && (
          <div className="mr-auto pt-16 place-self-center lg:col-span-7 space-y-4">
          <DynamicLineageMap parentDiscipline={tabs[0]} />
        </div>
          )}
            {activeTabIndex === 1 && (
          <div className="mr-auto pt-16 place-self-center lg:col-span-7 space-y-4">
          <DynamicLineageMap parentDiscipline={tabs[1]} />
        </div>
          )}
            {activeTabIndex === 2 && (
          <div className="mr-auto pt-16 place-self-center lg:col-span-7 space-y-4">
          <DynamicLineageMap parentDiscipline={tabs[2]} />
        </div>
          )}
        
        </section>
        </div>
      </AuthPage>
    </Master>

  );
}