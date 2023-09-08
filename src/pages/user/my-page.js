import { Icon } from "@iconify/react";
import { Avatar, Box, Button, Card, Grid, IconButton, Stack, Tab, Tabs, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "src/auth/useAuthContext";
import { useModal } from "src/components/dialog/ModalProvider";
import ContentTable from "src/components/elements/content-table";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";


const MyPage = () => {
    const { user } = useAuthContext();
    const { setModal } = useModal()
    const router = useRouter();
    const [reviewData, setReviewData] = useState({});
    const [reviewSearchObj, setReviewSearchObj] = useState({
        page: 1,
        page_size: 10,
        s_dt: '',
        e_dt: '',
        search: '',
        is_mine: true,
        type: 0,
    })
    const [reservationData, setReservationData] = useState({});
    const [reservationSearchObj, setReservationSearchObj] = useState({
        page: 1,
        page_size: 10,
        s_dt: '',
        e_dt: '',
        search: '',
        is_mine: true,
    })
    const [currentTab, setCurrentTab] = useState(undefined);
    const [userObj, setUserObj] = useState({})
    const defaultReviewColumns = [
        {
            id: 'shop_name',
            label: '미용실명',
            action: (row) => {
                return row['shop_name'] ?? "---"
            }
        },
        {
            id: 'title',
            label: '제목',
            action: (row) => {
                return row['title'] ?? "---"
            }
        },
        {
            id: 'created_at',
            label: '작성일',
            action: (row) => {
                return row['created_at'] ?? "---"
            }
        },
        {
            id: 'edit',
            label: '자세히보기',
            action: (row) => {
                return (
                    <>
                        <IconButton onClick={() => {
                            router.push(`/user/post/${row?.id}`)
                        }}>
                            <Icon icon='tabler:reserved-line' />
                        </IconButton>
                    </>
                )
            }
        },
    ]
    const defaultReservationColumns = [
        {
            id: 'shop_name',
            label: '미용실명',
            action: (row) => {
                return row['shop_name'] ?? "---"
            }
        },
        {
            id: 'date',
            label: '예약날짜',
            action: (row) => {
              row['date'] = row?.date.toString();
              return `${row['date'].substring(0,4)}-${row['date'].substring(4,6)}-${row['date'].substring(6,8)}`
            }
          },
          {
            id: 'time',
            label: '예약시간',
            action: (row) => {
              return row['time'] ?? "---"
            }
          },
        {
            id: 'addr',
            label: '상태',
            action: (row) => {
                return row['addr'] ?? "---"
            }
        },
        {
            id: 'edit',
            label: '예약취소',
            action: (row) => {
                return (
                    <>
                        <IconButton onClick={() => {
                        }}>
                            <Icon icon='material-symbols:cancel-outline' />
                        </IconButton>
                    </>
                )
            }
        },
    ]
    useEffect(() => {
        setCurrentTab(parseInt(router.query?.type));
        settingPage(router.query?.type);
    }, [router.query])

    const settingPage = (type) => {
        if (type == 0) {
            setUserObj(user);
        } else if (type == 1) {
            onChangeReviewPage(reviewSearchObj);
        } else if (type == 2) {
            onChangeReservationPage(reservationSearchObj);
        }
    }
    const onChangeMy = async () => {
        let result = undefined
        result = await apiManager('auth/update', 'create', userObj);
        if (result) {
            toast.success('성공적으로 저장되었습니다.');
            setTimeout(() => {
                window.location.reload();
            }, 1000)
        }
    }
    const onChangeReviewPage = async (obj) => {
        setReviewData({
            ...reviewData,
            content: undefined
        })
        let data_ = await apiManager('posts', 'list', obj);
        if (data_) {
            setReviewData(data_);
        }
        setReviewSearchObj(obj);
    }
    const onChangeReservationPage = async (obj) => {
        setReservationData({
            ...reservationData,
            content: undefined
        })
        let data_ = await apiManager('reservations', 'list', obj);
        if (data_) {
            setReservationData(data_);
        }
        setReservationSearchObj(obj);
    }
    return (
        <>
            <Tabs
                indicatorColor='primary'
                textColor='primary'
                scrollButtons='false'
                value={currentTab}
                sx={{
                    width: '100%',
                    marginBottom: '1rem'
                }}
                onChange={(event, newValue) => {
                    router.push(`/user/my-page/?type=${newValue}`)
                }}
            >
                <Tab value={0} label={'프로필편집'} sx={{ width: '28%' }} />
                <Tab value={1} label={'나의 후기'} sx={{ width: '28%' }} />
                <Tab value={2} label={'예약내역'} sx={{ width: '28%' }} />
            </Tabs>
            {currentTab == 0 &&
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ py: 10, px: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    sx={{
                                        width: '84px',
                                        height: '84px',
                                        marginBottom: '1rem'
                                    }}
                                />
                                <div>{userObj.nickname}</div>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 3 }}>
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)',
                                    }}
                                >
                                    <TextField name="displayName" label="아이디" defaultValue={userObj?.user_name} value={userObj?.user_name} disabled={true} />

                                    <TextField name="nickname" label="닉네임" defaultValue={userObj?.nickname} value={userObj?.nickname} onChange={(e) => { setUserObj({ ...userObj, nickname: e.target.value }) }} />

                                    <TextField name="phone_num" label="전화번호" defaultValue={userObj?.phone_num} value={userObj?.phone_num} onChange={(e) => { setUserObj({ ...userObj, phone_num: e.target.value }) }} />

                                </Box>
                                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                                    <Button type="submit" variant="contained" onClick={() => {
                                        setModal({
                                            func: () => { onChangeMy() },
                                            icon: 'material-symbols:edit-outline',
                                            title: '저장 하시겠습니까?'
                                        })
                                    }}>
                                        변경사항 저장
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </>}
            {currentTab == 1 &&
                <>
                    <ContentTable
                        data={reviewData}
                        onChangePage={onChangeReviewPage}
                        searchObj={reviewSearchObj}
                        columns={defaultReviewColumns}
                    />
                </>}
            {currentTab == 2 &&
                <>
                    <ContentTable
                        data={reservationData}
                        onChangePage={onChangeReservationPage}
                        searchObj={reservationSearchObj}
                        columns={defaultReservationColumns}
                    />
                </>}
        </>
    )
}
MyPage.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default MyPage;