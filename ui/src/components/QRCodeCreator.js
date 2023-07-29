import QRCode from "react-qr-code";

import { useEffect, useState, useContext } from "react";
import {AuthContext} from '@/components/layout/AuthPage'
import { prop } from "snarkyjs";


const QRCodeCreator = (props) => {
  console.log("QRCodeCreator address: ", props.address);
  const authState = useContext(AuthContext);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(props.address);
  };
  return (
    <div className="">
      <div className="grid gap-y-24 grid-cols-1 text-center">
      <div className="m-auto">
      <h2 className="text-3xl font-bold sm:text-4xl">Share your address</h2>
      <p className="mt-4 text-gray-600">Allow others to scan your address or click the QR code to copy.</p>
        </div>
        <div className="m-auto">
      
          <a onClick={copyAddressToClipboard} className="cursor-pointer">
        <QRCode
          value={authState.userAddress}
        />
        </a>
        </div>
        {/* <div className="alert m-auto">
            <span className="text-center">{props.address}</span>
          </div> */}
      </div>
    </div>
  );
};

export default QRCodeCreator;