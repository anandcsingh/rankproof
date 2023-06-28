import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { InstructorArtViewModel } from '../../view-models/InstructorArtViewModel';
import { Tabs } from 'flowbite-react';
import StudentList from './StudentList';

const InstructorMartialArts = () => {
    let [state, setState] = useState({
        show: false,
        items: [],
      });

      useEffect(() => {
        let arts = [
        { martialArt: "BJJ", rank: "Black Belt", promotedDate: "2021-01-01", 
        students: [
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          { name: "Singh", rank: "Blue",promotedDate: "2022-01-02"}, 
          {name: "Anand", rank:"White",promotedDate: "2022-01-02"}] 
        },
        { martialArt: "Judo", rank: "Black Belt", promotedDate: "2022-04-03", students: [] }];
        setState({ ...state, items: arts, show: true });
      }, []);

    return (
      
        <div>
        {state.show &&
            <div>
              <Tabs.Group aria-label="Default tabs" style="default">
                {state.items.map((i, index) => (
                  <Tabs.Item active={index == 0} title={i.martialArt} key={index}>
                    <StudentList studentList={i.students} />
                  </Tabs.Item>
                ))}
              </Tabs.Group>
  
            </div>
          }
          </div>
    );
}

export default InstructorMartialArts;
