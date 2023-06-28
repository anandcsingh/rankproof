import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { Card } from 'flowbite-react';
// const propTypes = {
//     name: PropTypes.string,
//     rank: PropTypes.string,
//     martialArt: PropTypes.string,
//     certified: PropTypes.bool,
//     promotedDate: PropTypes.string,
// }

// const defaultProps = {
//     name: 'John Doe',
//     rank: 'White Belt',
//     martialArt: 'Jiu Jitsu',
//     certified: 'false',
//     promotedDate: '01/01/2021',
// }

const StudentTile = ({
    student,
    ...props
}) => {

  
    return (
        <Card className="max-w-sm" href="#">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <p>
          {student.name}
          </p>
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          <p>
          {student.rank}
          </p>
        </p>
      </Card>
       
    );
}

export default StudentTile;
