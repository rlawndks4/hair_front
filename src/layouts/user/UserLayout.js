import { useEffect } from "react";
import { useState } from "react";
import { useAuthContext } from "src/auth/useAuthContext";
import { useSettingsContext } from "src/components/settings";

const UserLayout = ({ children }) => {
    const { themeDnsData } = useSettingsContext();
    const { user } = useAuthContext();
    const [isShowPage, setIsShowPage] = useState(false);
    useEffect(() => {
        if (themeDnsData?.id > 0 && user) {
            setIsShowPage(true);
        }
    }, [themeDnsData, user])
    return (
        <>
            {isShowPage &&
                <>
                    {children}
                </>}
        </>
    )
}
export default UserLayout;