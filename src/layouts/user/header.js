import { Icon } from "@iconify/react";
import { Badge, Box, Divider, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/auth/useAuthContext";
import { Col, Row } from "src/components/elements/styled-components";
import Logo from "src/components/logo/Logo";
import MenuPopover from "src/components/menu-popover";
import { useSettingsContext } from "src/components/settings";
import useInterval from "src/hooks/useInterval";
import { apiManager } from "src/utils/api-manager";
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
    const { logout, user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
    const [bellContent, setBellContent] = useState({
        content: []
    });
    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };
    useEffect(() => {
        if (user) {
            getBellContent();
        }
    }, [user])
    useInterval(async () => {
        if (user) {
            getBellContent();
        }
    }, 5 * 1000);
    const getBellContent = async () => {
        const response = await apiManager('alarms', 'list');
        setBellContent(response);
    }
    return (
        <>
            <Wrappers>
                <Row style={{ margin: '0 auto', width: '95%', maxWidth: '800px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src={themeDnsData?.logo_img} style={{ height: '24px', width: 'auto' }} onClick={() => {
                        window.location.href = '/'
                    }} />
                    <Row style={{ columnGap: '0.5rem' }}>
                        <IconButton onClick={handleOpenPopover}>
                            <Badge badgeContent={bellContent.content?.length} color="error">
                                <Icon icon={'mdi:bell-outline'} style={{ color: themeDnsData.theme_css.main_color }} />
                            </Badge>

                        </IconButton>
                        <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
                            {bellContent?.content && bellContent.content.map((content, idx) => (
                                <>
                                    <Box sx={{ my: 1.5, px: 2.5, cursor: 'pointer' }}
                                        onClick={() => {
                                            window.location.href = content?.link
                                        }}
                                    >
                                        <Typography variant="subtitle2" noWrap>
                                            {content?.title}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {content?.content}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ borderStyle: 'dashed' }} />
                                </>
                            ))}

                        </MenuPopover>
                        <IconButton onClick={async () => {
                            let result = await logout();
                            window.location.href = '/'
                        }}>
                            <Icon icon={'ant-design:logout-outlined'} style={{ color: themeDnsData.theme_css.main_color }} />
                        </IconButton>
                    </Row>
                </Row>

            </Wrappers>
            <PaddingTop />
        </>
    )
}
export default Header;