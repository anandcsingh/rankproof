import QRCode from "react-qr-code";

import { useEffect, useState, useContext } from "react";
import {AuthContext} from '@/components/layout/AuthPage'


const QRCodeCreator = ({ address }) => {
  const { state, setState } = useContext(AuthContext);
  
  return (
    <div className="">
      <div className="w-1/2 p-4 mx-auto text-center">
        <QRCode
          value={state.userAddress}
          width={200}
        />
      </div>
    </div>
  );
};

export default QRCodeCreator;