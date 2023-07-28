import Master from '../components/layout/Master'
import { AuthPage } from '../components/layout/AuthPage'
import Link from 'next/link'
import Add from './add.page';
import InstructorsDen from './instructorsden.page';
import QRCodeCreator from '@/components/QRCodeCreator';
import React, { useState } from 'react';
import Authentication from '@/modules/Authentication';
import DashboardActions from '@/components/sections/DashboardActions';

export default function Dashboard() {

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
    <Master>
      <AuthPage validate={true}>
        <DashboardActions />
        <div className="bg-white lg:py-10 min-h-screen">
          <section className="bg-white place-self-center lg:col-span-7 space-y-8">
            <div className="m-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
              <div
                className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16"
              >
                <div
                  className="mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left rtl:lg:text-right"
                >
                  <h2 className="text-3xl font-bold sm:text-4xl">Find your Lineage</h2>

                  <p className="mt-4 text-gray-600">
                    All Martial Artists can view their lineage going as far back as we have data for practitioners. All powered by the Mina blockchain and Zero-Knowledge Proofs.
                  </p>
                  <Link href="/lineage" className="mt-8 inline-block rounded btn-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
                  >
                    View Lineage</Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {/* Open the modal using ID.showModal() method */}
                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="#my_modal_8"
                  >
                  <div className="modal" id="my_modal_8">
                    <div className="modal-box bg-white">
                      <Add />
                      <div className="modal-action">
                      <a href="#" className="btn btn-primary">Close</a>
                      </div>
                    </div>
                </div>
                  
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

                    <h2 className="mt-2 font-bold">Add</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Add a Student.
                    </p>
                  </a>
                  <dialog id="my_modal_2" className="modal">
                    <form method="dialog" className="modal-box w-11/12 max-w-5xl bg-white">
                      <header className="text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl">Martial Arts Stats</h2>
                      </header>
                      <InstructorsDen/>
                      <div className="modal-action">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-primary">Close</button>
                      </div>
                    </form>
                  </dialog>
                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="#"
                    onClick={()=>window.my_modal_2.showModal()}
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

                    <h2 className="mt-2 font-bold">Instructors</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      View Instructors.
                    </p>
                  </a>

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
                  <dialog  className="modal" id="share_address_modal">
                  <form method="dialog" className="modal-box bg-white w-1/2 max-w-5xl">

                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                     {showAddress && <QRCodeCreator address={address}  /> }
                      
                    </form>
                    <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/lineage"
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

                    <h2 className="mt-2 font-bold">Promote</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
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

                    <h2 className="mt-2 font-bold">Revoke</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </a>

                  <a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="/accountant"
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

                    <h2 className="mt-2 font-bold">Prove</h2>

                    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white place-self-center lg:col-span-7 space-y-8">
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
              <header className="text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Martial Arts Stats</h2>
              </header>
              <div className="m-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="bg-white stats w-full shadow">
                  <div className="card w-100 bg-gray-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">More Stats!</h2>
                      <p>Would You like to see more interesting martial arts stats?</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">More Stats</button>
                      </div>
                    </div>
                  </div>
                  <div className="stat bg-gray-100 rounded-l-lg">

                    <div className="stat-figure text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Total Black belts</div>
                    <div className="stat-value text-primary">25.6K</div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>

                  <div className="stat bg-gray-100" >
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="stat-title">Total Martial Artists</div>
                    <div className="stat-value text-secondary">2.6M</div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>
                  <div className="stat bg-gray-100">
                    <div className="stat-figure text-secondary">
                      <div className="avatar online">
                        <div className="w-16 rounded-full">
                          <img src="/assets/images/jutsu.png" />
                        </div>
                      </div>
                    </div>
                    <div className="stat-value">86%</div>
                    <div className="stat-title">Progression</div>
                    <div className="stat-desc text-secondary">31 did not rank up</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </AuthPage>
    </Master>
  );
}