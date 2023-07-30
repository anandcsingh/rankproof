// https://stackoverflow.com/questions/73479439/how-to-trigger-an-custom-alert-component-in-a-different-component
//https://stackblitz.com/edit/react-ts-nv3cv2?file=ToggleAlert.tsx
import { useContext } from "react";
import { AuthContext } from "../layout/AuthPage";

export default function NotificationBox() {
    const [authState, setAuthState] = useContext(AuthContext);

    const clearAlert = async (event: any) => {
        setAuthState({ ...authState, alertAvailable: false, alertMessage: "", alertNeedsSpinner: false });
    }

    return (

        <>
        {authState.alertAvailable &&
        <div>
            <div className="alert alert-info relative">
                {authState.alertNeedsSpinner && <span className="loading loading-dots loading-xs"></span>}
                <span dangerouslySetInnerHTML={{__html: authState.alertMessage}}></span>
                <a href="#" onClick={clearAlert} className="btn btn-sm btn-circle btn-ghost absolute right-0">X</a>
            </div>
            <div className='divider'></div>
            </div>
        }
        </>
    );
  }