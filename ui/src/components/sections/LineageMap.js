import React from 'react';
import { useEffect, useState } from "react";


const LineageMap = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {studentList.map((student) => (
                <StudentTile student={student} />
            ))}
        </div>
    );
}

export default StudentList;
