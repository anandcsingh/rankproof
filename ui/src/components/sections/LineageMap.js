import React from 'react';
import { useEffect, useState } from "react";

import { OrgChartComponent } from './OrgChart';
import * as d3 from 'd3';
import { state } from 'snarkyjs';


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
    // d3.csv(
    //   'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
    // ).then((data) => {
    //   setData(data);
    //   setShow(true);
    // });
    let arr = [
        {
          "name": "Ian Devling",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CTO office",
          "tags": "Ceo,tag1,manager,cto",
          "isLoggedUser": false,
          "positionName": "Chief Executive Officer",
          "id": "O-6066",
          "parentId": "",
          "size": ""
        },
        {
          "name": "Davolio Nancy",
          "imageUrl": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg",
          "area": "Corporate",
          "profileUrl": "http://example.com/employee/profile",
          "office": "CEO office",
          "tags": "Ceo,tag1, tag2",
          "isLoggedUser": false,
          "positionName": "CTO",
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
    setData(arr);
    setShow(true);
    
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
