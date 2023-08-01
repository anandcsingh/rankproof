import InstructorsDen from "@/pages/instructorsden.page";
import { DashboardActionsProps } from "./DashboardActions";
import InstructorMartialArts from "../InstructorMartialArts";

const InstructorsAction: React.FC<DashboardActionsProps> = ({ isInstructor, disciplines }) => {

    return (
        <>
            {isInstructor &&
                <div>
                    <a className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                        href="#instructors_action_modal">

                        <span className="inline-block rounded-lg bg-gray-50 p-3">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#652dc5" viewBox="0 0 14 18">
                                <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                            </svg>
                        </span>

                        <h2 className="mt-2 font-bold">My Students</h2>

                        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                            Manage my students across disciplines.
                        </p>
                    </a>

                    <div className='modals-area'>
                        <dialog className="modal" id="instructors_action_modal">
                            <form method="dialog" className="modal-box bg-white w-11/12 max-w-5xl">
                                <div className="modal-action">
                                    <a href="#" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</a>
                                </div>
                                {/* <InstructorsDen /> */}
                                <InstructorMartialArts martialArts={disciplines} />
                            </form>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                    </div>

                </div>
            }
        </>
    );

}

export default InstructorsAction;