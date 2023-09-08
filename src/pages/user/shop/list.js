import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ContentTable from "src/components/elements/content-table";
import { themeObj } from "src/components/elements/styled-components";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";

const ShopList = () => {
    const router = useRouter();
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
            id: 'shop_img',
            label: '대표이미지',
            action: (row) => {
                return <LazyLoadImage src={row['shop_img']} style={{ height: '56px' }} />
            }
        },
        {
            id: 'name',
            label: '미용실명',
            action: (row) => {
                return row['name'] ?? "---"
            }
        },
        {
            id: 'addr',
            label: '주소',
            action: (row) => {
                return row['addr'] ?? "---"
            }
        },
        {
            id: 'edit',
            label: '자세히보기',
            action: (row) => {
                return (
                    <>
                        <IconButton onClick={() => {
                            router.push(`/user/shop/${row?.id}`)
                        }}>
                            <Icon icon='tabler:reserved-line' />
                        </IconButton>
                    </>
                )
            }
        },
    ]
    useEffect(() => {
        onChangePage(searchObj);
    }, []);
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('shops', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    return (
        <>
            <ContentTable
                data={data}
                onChangePage={onChangePage}
                searchObj={searchObj}
                columns={defaultColumns}
            />
        </>
    )
}
ShopList.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default ShopList;