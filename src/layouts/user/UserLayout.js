import { useEffect } from "react";
import { useState } from "react";
import { useAuthContext } from "src/auth/useAuthContext";
import { useSettingsContext } from "src/components/settings";
import Header from "./header";
import BottomMenu from "./bottom-menu";
import styled from "styled-components";

const Wrappers = styled.div`
max-width:800px;
margin:0 auto;
padding-bottom:8rem;
width:90%;

`
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
                    <Header />
                    <Wrappers>
                        {children}
                    </Wrappers>
                    <BottomMenu />
                </>}
        </>
    )
}
export default UserLayout;