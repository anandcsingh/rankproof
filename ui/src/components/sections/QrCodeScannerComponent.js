import { useRef, useState } from "react";
import {QrReader} from "react-qr-scanner";

const QRCodeCreator = (props) => {

    const addressRef = useRef(null);
    const [visibility, setVisibility] = useState('');
    const startScan = async (event) => {
        setVisibility('visible');

    }
    const handleScan = async (event) => {
        if (event) {
            console.log(event);
            (addressRef.current! as any).value = event.text;
            setVisibility('hidden');
        }
    }

    return (
        <div>

            <div className="join">
                <input ref={addressRef} className="input input-bordered join-item bg-white" />
                <button onClick={startScan} className="btn join-item ">Scan</button>
            </div>

            <div className={visibility}>
                <QrReader
                    onScan={handleScan}
                />
            </div>


        </div>
    );
}

export default QrCodeScannerComponent;