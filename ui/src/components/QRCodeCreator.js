import QRCode from "react-qr-code";

const QRCodeCreator = ({ address }) => {
  return (
    <div className="rankproof-page">
      <div className="rankproof-content-wrap">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "10%", width: "10%" }}
          value={address}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  );
};

export default QRCodeCreator;
