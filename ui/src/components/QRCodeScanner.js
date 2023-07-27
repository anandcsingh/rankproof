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
      <div className="">
        <div className="">
          <fieldset>
            <div className="mt-6 flex items-center justify-start gap-x-6">
              {/* Open the modal using ID.showModal() method */}
              <button
                className="btn rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={this.openModal}
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
</svg> Scan
              </button>
              <dialog id="my_modal_1" className={`modal`}>
                <div method="dialog" className="modal-box">
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
                </div>
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
