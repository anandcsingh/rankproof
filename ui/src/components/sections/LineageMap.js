import React from 'react';
import { useEffect, useState } from "react";

import { OrgChartComponent } from './OrgChart';
import * as d3 from 'd3';
import { PublicKey, state } from 'snarkyjs';
import { Disciplines } from '../../../../contracts/build/src/models/MartialArtistRepository';
import { FirebaseBackingStore } from '../../../../contracts/build/src/models/firebase/FirebaseBackingStore';


const LineageMap = () => {

    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);
  let addNodeChildFunc = null;

  function addNode() {
    const node = {
      nodeId: 'new Node',
      parentNodeId: 'O-6066',
    };

    addNodeChildFunc(node);
  }

  function onNodeClick(nodeId) {
    // console.log('d3', d3.event);
    alert('clicked ' + nodeId);
  }

  useEffect(() => {
    (async () => {
    let discipline = Disciplines.BJJ;
    let backingStore = new FirebaseBackingStore(discipline);
    let data = [];
    let idMap = {};
    
    (await backingStore.getAll())
      .forEach((value, key) => {
        data.push( {
          "name": `${value.firstName} ${value.lastName}`,
          "positionName": value.rank.toString(),
          "publicKey": value.publicKey.toBase58(),
          "Instructor": value.instructor.toBase58(),
          "id": value.id.toString(),
        });
        idMap[value.publicKey.toBase58()] = value.id.toString();
      });

      for (let i = 0; i < data.length; i++) {
        let value = data[i];
        if (value.Instructor) {
          value.parentId = idMap[value.Instructor];
        }
      }
    setData(data);
    setShow(true);

  })();
    let arr = [
        {
          "name": "Helio Gracie",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CTO office",
          "tags": "Ceo,tag1,manager,cto",
          "isLoggedUser": false,
          "positionName": "Grand Master",
          "id": "O-6066",
          "parentId": "",
          "size": ""
        },
        {
          "name": "Pedro Sauer",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "Master",
          "id": "O-6067",
          "parentId": "O-6066",
          "size": ""
        },
        {
          "name": "Leverling Janet",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/female.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "CTO",
          "id": "O-6068",
          "parentId": "O-6066",
          "size": ""
        },
        {
          "name": "Leverling Janet",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/female.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "CTO",
          "id": "O-6069",
          "parentId": "O-6066",
          "size": ""
        },
        {
          "name": "Leverling Janet",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/female.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "CTO",
          "id": "O-6070",
          "parentId": "O-6066",
          "size": ""
        },
        {
          "name": "Leverling Janet",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/female.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "CTO",
          "id": "O-6071",
          "parentId": "O-6067",
          "size": ""
        },
        {
          "name": "Fuller Andrew",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "Linear Manager",
          "id": "O-6072",
          "parentId": "O-6067",
          "size": ""
        }
      ];
    //setData(arr);
    //setShow(true);
    
  }, [true]);

    return (
        <div>
            {show &&
            <OrgChartComponent
        setClick={(click) => (addNodeChildFunc = click)}
        onNodeClick={onNodeClick}
        data={data}
      /> }
        </div>
    );
}

export default LineageMap;
