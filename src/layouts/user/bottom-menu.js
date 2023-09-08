import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useSettingsContext } from 'src/components/settings'
import styled from 'styled-components'
const Container = styled.aside`
    background: #fff;
    border-top: 0.1rem solid #e6e6e6;
    position: fixed;
    right: 0;
    bottom: -1px;
    left: 0;
    z-index: 5;
    display:flex;
    width:100%;
    max-width:800px;
    margin: 0 auto;
`
const MenuContainer = styled.nav`
width: 100%;
max-width: 76.8rem;
height: 5rem;
display: -webkit-flex;
display: flex;
margin: 0 auto;
`
const OneMenuContainer = styled.div`
    color: inherit;
    text-decoration: none;
    width: 16%;
    min-width: 16%;
    display: flex;
    flex-direction:column;
    padding: 0.3rem 0 0.2rem;
    position: relative;
    text-align: center;
    cursor:pointer;
    align-items:center;
    margin: auto;
    row-gap: 0.5rem;
`
const OneMenuName = styled.span`
font-size:0.8rem;
font-weight:400;
@media screen and (max-width:350px) { 
    font-size:0.7rem;
  }
`

const BottomMenu = () => {
    const { themeDnsData } = useSettingsContext();

    const router = useRouter();

    const [modal, setModal] = useState("none");

    const [beforeCount, setBeforeCount] = useState(0)
    const [colorList, setColorList] = useState([])
    const [display, setDisplay] = useState('flex');
    const [isPost, setIsPost] = useState(false);

    const zBottomMenu = [
        { name: `홈`, link: '/user/home', icon: <img src={themeDnsData.favicon_img} alt="#" style={{ height: '24px' }} />, className: 'master-dropdown-btn', allowLink: '/user/home' },
        { name: '미용실', link: '/user/shop/list', icon: <Icon icon='mdi:map-marker-check-outline' style={{ fontSize: '24px' }} />, className: '', allowLink: '/user/shop' },
        { name: '예약내역', link: '/user/my-page/?type=2', icon: <Icon icon='mdi:comment-question-outline' style={{ fontSize: '24px' }} />, className: '', allowLink: '/user/my-page' },
        { name: '커뮤니티', link: '/user/post/list/1', icon: <Icon icon='clarity:chat-bubble-line' style={{ fontSize: '24px' }} />, className: '', allowLink: '/user/post' },
    ];

    return (
        <>
            {display == 'flex' ?
                <>
                    {isPost ?
                        <>
                        </>
                        :
                        <>
                            <Container className='menu-container' style={{ background: `${localStorage.getItem('dark_mode') ? '#222' : '#fff'}` }}>
                                <MenuContainer>
                                    {zBottomMenu.map((item, index) => (
                                        <>
                                            <OneMenuContainer onClick={() => { router.push(item.link) }} style={{ color: `${router.asPath.includes(item.allowLink) ? themeDnsData.theme_css.main_color : '#ababab'}` }} key={index}>
                                                {item.icon}
                                                <OneMenuName>
                                                    {item.name}
                                                </OneMenuName>
                                            </OneMenuContainer>
                                        </>
                                    ))}

                                </MenuContainer>
                            </Container>
                        </>
                    }
                </>
                :
                <>
                </>
            }



        </>
    )
}

export default BottomMenu
