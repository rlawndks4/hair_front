import { Stack, TextField, InputAdornment, IconButton, Card, CardContent, Link, Typography, Button } from '@mui/material';
import LoginLayout from 'src/layouts/login/LoginLayout';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify/Iconify';
import $ from 'jquery';
import { useRouter } from 'next/router';
import { logoSrc } from 'src/data/data';
import { useSettingsContext } from 'src/components/settings';
import NextLink from 'next/link';
import { StyledContent, StyledSection, StyledSectionBg } from 'src/layouts/login/styles';
import Image from 'src/components/image/Image';
import dynamic from 'next/dynamic';
import { PATH_MANAGER } from 'src/routes/paths';
import { Row } from 'src/components/elements/styled-components';
import styled from 'styled-components';
const Tour = dynamic(
    () => import('reactour'),
    { ssr: false },
);
const WaveContainer = styled.div`
position: absolute;
width: 100%;
height: 50vh;
bottom: 0;
left: 0;
z-index: 0;
overflow: hidden;
`
const WaveContent1 = styled.div`
z-index: 5;
opacity: .6;
position: absolute;
width: 100%;
overflow: hidden;
height: 100%;
bottom: -1px;
`
const WaveContent2 = styled.div`
z-index: 15;
opacity: .75;
position: absolute;
width: 100%;
overflow: hidden;
height: 100%;
bottom: -1px;
`
const WaveContent3 = styled.div`
z-index: 10;
opacity: .5;
position: absolute;
width: 100%;
overflow: hidden;
height: 100%;
bottom: -1px;
`
const Wave = styled.div`
background-size: ${props => props.backgroundSize};
-webkit-animation: move_wave 8s linear infinite;
animation: move_wave 8s linear infinite;
position: absolute;
left: 0;
width: 200%;
height: 100%;
background-repeat: repeat-x;
background-position: 0 bottom;
-webkit-transform-origin: center bottom;
transform-origin: center bottom;
@keyframes move_wave {
    0% {
        -webkit-transform: translateX(0) translateZ(0) scaleY(1);
        transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
        -webkit-transform: translateX(-25%) translateZ(0) scaleY(.45);
        transform: translateX(-25%) translateZ(0) scaleY(.45);
    }
    100% {
        -webkit-transform: translateX(-50%) translateZ(0) scaleY(1);
        transform: translateX(-50%) translateZ(0) scaleY(1);
    }
  } 
  @media (max-width: 600px) {
    background-size: 50% 100px;
  }
`
const Login = () => {
    const { login, user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (user?.level >= 0) {
            router.push('/user/home');
        }
        setLoading(false);
    }, [user])
    const LoginSchema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        password: Yup.string().required('Password is required'),
    });

    const onSubmit = async () => {
        let user = await login(username, password);
        if (user) {
            router.push('/user/home')
        }
    };
    const [tourOpen, setTourOpen] = useState(false);
    const [tourSteps, setTourSteps] = useState([]);

    const openTour = (class_name, text,) => {
        setTourSteps([
            {
                selector: `.${class_name}`,
                content: text,
            },
        ])
        setTourOpen(true);
    }
    const closeTour = () => {
        setTourOpen(false);
        setTourSteps([]);
    };
    if (!themeDnsData?.id) {
        return (
            <>
            </>
        )
    }
    return (
        <>

            <Row style={{ height: '100vh' }}>
                <StyledContent style={{ margin: 'auto', zIndex: '20' }}>
                    <Stack sx={{ width: 1 }}>
                        <img src={logoSrc()} style={{ maxWidth: '200px', margin: '1rem auto' }} />
                        <Stack spacing={3}>
                            <TextField
                                name="username"
                                label="아이디를 입력해 주세요."
                                autoComplete='new-password'
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                onKeyPress={(e) => {
                                    if (e.key == 'Enter') {
                                        $('#id').focus();
                                    }
                                }}
                            />
                            <TextField
                                name="password"
                                id="password"
                                label="패스워드를 입력해 주세요."
                                type={showPassword ? 'text' : 'password'}
                                autoComplete='new-password'
                                onKeyPress={(e) => {
                                    if (e.key == 'Enter') {
                                        onSubmit();
                                    }
                                }}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            sx={{
                                marginTop: '24px'
                            }}
                            onClick={onSubmit}
                        >
                            로그인
                        </Button>
                    </Stack>
                </StyledContent>
            </Row>
            <WaveContainer>
                <WaveContent1>
                    <Wave
                        backgroundSize='50% 160px'
                        style={{
                            backgroundImage: `url('/wave/1.svg')`,
                            animation: 'move_wave 8s linear infinite'
                        }}
                    />
                </WaveContent1>
                <WaveContent2>
                    <Wave
                        backgroundSize='50% 140px'
                        style={{
                            backgroundImage: `url('/wave/2.svg')`,
                            animation: 'move_wave 10s linear infinite'
                        }}
                    />
                </WaveContent2>
                <WaveContent3>
                    <Wave
                        backgroundSize='50% 150px'
                        style={{
                            backgroundImage: `url('/wave/3.svg')`,
                            animation: 'move_wave 15s linear infinite'
                        }}
                    />
                </WaveContent3>
            </WaveContainer>
        </>
    );
}
export default Login;
