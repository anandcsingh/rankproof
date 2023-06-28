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
    d3.csv(
      'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
    ).then((data) => {
      setData(data);
      setShow(true);
    });
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
