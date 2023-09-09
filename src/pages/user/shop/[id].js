import { Icon } from "@iconify/react";
import { Avatar, Button, IconButton, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ContentTable from "src/components/elements/content-table";
import { Col, Row } from "src/components/elements/styled-components";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})
const Shop = () => {
    const router = useRouter();
    const [shop, setShop] = useState({});
    const [currentTab, setCurrentTab] = useState(1);
    const [data, setData] = useState({});
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 10,
        s_dt: '',
        e_dt: '',
        search: '',
    })
    const defaultColumns = [
        {
            id: 'post_img',
            label: '메인이미지',
            action: (row) => {
                return <LazyLoadImage src={row['post_img']} style={{ height: '56px' }} />
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
            id: 'nickname',
            label: '작성자닉네임',
            action: (row) => {
                return row['nickname'] ?? "---"
            }
        },
        {
            id: 'created_at',
            label: '생성일',
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
    const defaultTeacherColumns = [
        {
            id: 'profile_img',
            label: '유저프로필',
            action: (row) => {
                return <Avatar src={row['profile_img'] ?? "---"} style={{ margin: 'auto' }} />
            }
        },
        {
            id: 'nickname',
            label: '미용사명',
            action: (row) => {
                return row['nickname'] ?? "---"
            }
        },
        {
            id: 'phone_num',
            label: '휴대폰번호',
            action: (row) => {
                return row['phone_num'] ?? "---"
            }
        },
    ]
    useEffect(() => {
        setCurrentTab(parseInt(router.query?.type ?? 1));
        if (router.query?.type == 2 || router.query?.type == 0) {
            onChangePage({
                ...searchObj,
                page: 1,
                type: router.query?.type,
                shop_id: router.query?.id
            })
        } else if (router.query?.type == 3) {
            onChangeTeacherPage({
                ...searchObj,
                page: 1,
                shop_id: router.query?.id,
                level: 10,
            })
        } else {
            getShopInfo();
        }
    }, [router.query])
    const getShopInfo = async () => {
        let data_ = await apiManager('shops', 'get', {
            id: router.query?.id
        });
        setShop(data_);
    }
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('posts', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    const onChangeTeacherPage = async (obj) => {
        setData({
            ...data,
            content: undefined,
        })
        let data_ = await apiManager('users', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
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
                    router.push(`/user/shop/${router.query?.id}?type=${newValue}`)
                }}
            >
                <Tab value={1} label={'정보'} sx={{ width: '19.5%' }} />
                <Tab value={3} label={'미용사'} sx={{ width: '19.5%' }} />
                <Tab value={2} label={'업장소개'} sx={{ width: '19.5%' }} />
                <Tab value={0} label={'후기'} sx={{ width: '19.5%' }} />
            </Tabs>
            {currentTab == 1 &&
                <>
                    <div style={{ width: '100%', padding: '6rem 0', background: '#ccc', textAlign: 'center' }} >
                        지도
                    </div>
                    <Col style={{ rowGap: '0.5rem' }}>
                        <Row style={{ marginTop: '1rem', columnGap: '0.5rem', alignItems: 'center' }}>
                            <LazyLoadImage src={shop?.shop_img} style={{ height: '48px' }} />
                            <div>미용실명:</div>
                            <div>{shop?.name}</div>
                            <Button variant="contained" style={{ marginLeft: 'auto' }} onClick={()=>{
                                router.push(`/user/reservation/add?shop_id=${router.query?.id}`)
                            }}>
                                예약하기
                            </Button>
                        </Row>
                        <Row style={{ columnGap: '0.5rem' }}>
                            <div>주소:</div>
                            <div>{shop?.addr}</div>
                        </Row>
                        <Row style={{ columnGap: '0.5rem' }}>
                            <div>주소:</div>
                            <div>{shop?.addr_detail}</div>
                        </Row>
                        <ReactQuill
                            className='none-padding'
                            value={shop?.note ?? `<body></body>`}
                            readOnly={true}
                            theme={"bubble"}
                            bounds={'.app'}
                        />
                    </Col>
                </>}
            {currentTab == 3 &&
                <>
                    <ContentTable
                        data={data}
                        onChangePage={onChangeTeacherPage}
                        searchObj={searchObj}
                        columns={defaultTeacherColumns}
                    />
                </>}
            {currentTab == 2 &&
                <>
                    <ContentTable
                        data={data}
                        onChangePage={onChangePage}
                        searchObj={searchObj}
                        columns={defaultColumns}
                    />
                </>}
            {currentTab == 0 &&
                <>
                    <ContentTable
                        data={data}
                        onChangePage={onChangePage}
                        searchObj={searchObj}
                        columns={defaultColumns}
                    />
                    <Row>
                        <Button variant="contained" style={{ marginLeft: 'auto' }} onClick={() => {
                            router.push(`/user/post/add?type=0&shop_id=${router.query?.id}`)
                        }}>
                            후기 작성
                        </Button>
                    </Row>
                </>}
        </>
    )
}
Shop.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default Shop;