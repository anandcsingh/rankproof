import Add from "@/pages/add.page";
import { DashboardActionsProps } from "./DashboardActions";

const ProveAction: React.FC<DashboardActionsProps> = ({ isInstructor }) => {

    return (
        <div>
<a
                    className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                    href="#prove_modal"
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
                      Prove my rank to another practitioner.
                    </p>
                  </a>

                  
            <div className="modal" id="prove_modal">
            <div className="modal-action">
                <a href="#" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</a>
            </div>
            <div className="modal-box bg-white">
                <h2>Prove</h2>
                <Add />

            </div>
        </div>
    </div>
    );
}
export default ProveAction;