import { AuthContext, AuthPage } from "@/components/layout/AuthPage";
import Master from "@/components/layout/Master";
import DashboardContainer from "@/components/sections/DashboardContainer";
import { useContext } from "react";

export default function DashboardSkeleton() {
    const authState = useContext(AuthContext);

    return (
        <Master>
            <AuthPage validate={true}>
                {/* <DashboardContainer /> */}
                
            </AuthPage>
        </Master>
    );
}
