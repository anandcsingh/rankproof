import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class QRCodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "No result",
    };

    this.handleScan = this.handleScan.bind(this);
  }

  handleScan(data) {
    if (data) {
      if (data.text) {
        this.setState({
          result: data.text, // Assuming the QR code data has a "text" property
        });
      }
    }
  }

  handleError(err) {
    console.error(err);
  }

  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    };

    return (
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

export default QRCodeScanner;
