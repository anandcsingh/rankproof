import QRCode from "react-qr-code";

const QRCodeCreator = ({ address }) => {
  return (
    <div className="">
      <div className="w-1/2 p-4 mx-auto text-center">
        <QRCode
          value={address}
          width={200}
        />
      </div>
    </div>
  );
};

export default QRCodeCreator;