import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { Row } from "src/components/elements/styled-components";
import Logo from "src/components/logo/Logo";
import { useSettingsContext } from "src/components/settings";
import styled from "styled-components";

const Wrappers = styled.header`
position:fixed;
display:flex;
width:100%;
padding:0.5rem 0;
top:0;
left:0;
z-index:10;
background:#fff;
`

const PaddingTop = styled.div`
padding-top: 56px;
`
const Header = (props) => {
    const { logout } = useAuthContext();
    const { themeDnsData } = useSettingsContext();

    return (
        <>
            <Wrappers>
                <Row style={{ margin: '0 auto', width: '95%', maxWidth: '800px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src={themeDnsData?.logo_img} style={{ height: '24px', width: 'auto' }} onClick={() => {
                        window.location.href = '/'
                    }} />
                    <IconButton onClick={async () => {
                        let result = await logout();
                        window.location.href = '/'
                    }}>
                        <Icon icon={'ant-design:logout-outlined'} style={{ color: themeDnsData.theme_css.main_color }} />
                    </IconButton>
                </Row>

            </Wrappers>
            <PaddingTop />
        </>
    )
}
export default Header;