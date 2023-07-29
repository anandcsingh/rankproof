import { useState } from "react";
import { DashboardActionsProps } from "./DashboardActions";
import React from "react";
import Authentication from "@/modules/Authentication";
import QRCodeCreator from "@/components/QRCodeCreator";

    const InstructorsAction: React.FC<DashboardActionsProps> = ({ isInstructor }) => {
        
        const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const showAddressModalRef = React.useRef<HTMLDivElement>(null);
  const showAddressModal = async () => {
    let tempAddress = Authentication.address ? Authentication.address : 'No address loaded';// Authentication.address;
    setAddress(tempAddress);
    setShowAddress(true);
    try {
      (window as any).share_address_modal.showModal();
    } catch (error) {
      console.log(error);
    }
  }

        return (
            <div>
<a
        className="cursor-pointer block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
        onClick={showAddressModal}
      >

        <span className="inline-block rounded-lg bg-gray-50 p-3">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
            <path
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            ></path>
          </svg>
        </span>

        <h2 className="mt-2 font-bold">My Address</h2>

        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          View or share my MINA address.
        </p>
      </a>
      <dialog className="modal" id="share_address_modal">
                    <form method="dialog" className="modal-box bg-white w-1/2 max-w-5xl">

                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                      {showAddress && <QRCodeCreator address={address} />}

                    </form>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
      </div>
        );
    }
    export default InstructorsAction;