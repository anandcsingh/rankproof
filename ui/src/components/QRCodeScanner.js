import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class QRCodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "",
      camUse: false,
    };
  }

  handleScan = (data) => {
    if (data) {
      if (data.text) {
        this.setState({
          result: data.text, // Assuming the QR code data has a "text" property
        });
        this.closeModal();
      }
    }
  };

  handleError = (err) => {
    console.error(err);
  };

  openModal = () => {
    window.my_modal_1.showModal();
    this.setState({
      camUse: true,
      result: "",
    });
  };

  closeModal = () => {
    window.my_modal_1.close();
    this.setState({
      camUse: false,
    });
  };

  render() {
    const { camUse, result } = this.state;

    const previewStyle = {
      height: 240,
      width: 320,
    };

    return (
      <div className="rankproof-page">
        <div className="rankproof-content-wrap">
          <fieldset>
            <div className="mt-6 flex items-center justify-start gap-x-6">
              {/* Open the modal using ID.showModal() method */}
              <button
                className="btn rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={this.openModal}
              >
                Scan
              </button>
              <dialog id="my_modal_1" className={`modal`}>
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">Hello!</h3>
                  {camUse && (
                    <React.Fragment>
                      <QrReader
                        delay={this.state.delay}
                        style={previewStyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                      />
                      <p className="py-4">
                        Press ESC key or click the button below to close
                      </p>
                      <div className="modal-action">
                        {/* if there is a button in form, it will close the modal */}
                        <button
                          className="btn rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                          onClick={this.closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </form>
              </dialog>

              <div className="flex">
                <input
                  id="walletAddr"
                  name="walletAddr"
                  type="text"
                  autoComplete="wallet-address"
                  style={{ width: "50vw" }}
                  value={result}
                  onChange={() => {}}
                  className="block flex-grow w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }
}

export default QRCodeScanner;
