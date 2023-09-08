import { Icon } from "@iconify/react";
import { IconButton, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ContentTable from "src/components/elements/content-table";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";


const PostList = () => {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState(undefined);
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
        ...(currentTab != 1 ? [
            {
                id: 'shop_name',
                label: '미용실명',
                action: (row) => {
                    return row['shop_name'] ?? "---"
                }
            },
        ] : []),
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
    useEffect(() => {
        setCurrentTab(parseInt(router.query?.type));
        onChangePage({
            ...searchObj,
            page: 1,
            type: router.query?.type,
        })
    }, [router.query])
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
                    router.push(`/user/post/list/${newValue}`)
                }}
            >
                <Tab value={1} label={'공지사항'} sx={{ width: '28%' }} />
                <Tab value={2} label={'업장소개'} sx={{ width: '28%' }} />
                <Tab value={0} label={'후기'} sx={{ width: '28%' }} />
            </Tabs>
            <ContentTable
                data={data}
                onChangePage={onChangePage}
                searchObj={searchObj}
                columns={defaultColumns}
            />
        </>
    )
}
PostList.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default PostList;