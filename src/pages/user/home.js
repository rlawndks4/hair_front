import { Avatar, Box, Button, Card, Grid, Stack, TextField } from "@mui/material";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/auth/useAuthContext";
import { Col } from "src/components/elements/styled-components";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";
import { commarNumber } from "src/utils/function";


const Home = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const [point, setPoint] = useState(0);
    useEffect(() => {
        getPoint();
    }, [])
    const getPoint = async () => {
        let data_ = await apiManager('points', 'list', {});
        console.log(data_)
        setPoint(_.sum((data_?.content??[]).map(itm=>{return itm.price})))
    }
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ py: 6, px: 3, textAlign: 'center', display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                            sx={{
                                width: '84px',
                                height: '84px',
                                margin: 'auto 2rem auto auto'
                            }}
                        />
                        <Col style={{ alignItems: 'flex-start', margin: 'auto auto auto 0', rowGap: '1rem' }}>
                        <div>{user?.nickname}</div>
                        <div>포인트: {commarNumber(point)} P</div>
                            <Button type="submit" variant="contained" style={{ width: '100%' }} onClick={() => {
                                router.push(`/user/my-page?type=0`)
                            }}>
                                프로필편집
                            </Button>
                        </Col>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card sx={{ py: 3, px: 3, textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                        <Button style={{ margin: 'auto', width: '48%' }} onClick={() => {
                            router.push(`/user/my-page?type=1`)
                        }}>나의 후기</Button>
                        <div>|</div>
                        <Button style={{ margin: 'auto', width: '48%' }} onClick={() => {
                            router.push(`/user/my-page?type=2`)
                        }}>예약내역</Button>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card sx={{ py: 3, px: 3, textAlign: 'center', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button style={{ margin: 'auto', width: '48%' }} onClick={() => {
                            router.push(`/user/post/list/1`)
                        }}>공지사항 {'>'}</Button>
                        <div>|</div>
                        <Button style={{ margin: 'auto', width: '48%' }} onClick={() => {
                            router.push(`/user/post/list/2`)
                        }}>업장소개 {'>'}</Button>
                        <Button style={{ margin: 'auto', width: '100%', marginTop: '1rem' }} onClick={() => {
                            router.push(`/user/post/list/0`)
                        }}>후기 {'>'}</Button>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}
Home.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default Home;