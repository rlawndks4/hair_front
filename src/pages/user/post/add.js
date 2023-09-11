import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import UserLayout from "src/layouts/user/UserLayout";
import dynamic from 'next/dynamic';
import { react_quill_data } from "src/data/manager-data";
import { Title } from "src/components/elements/styled-components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { apiManager } from "src/utils/api-manager";
import { useModal } from "src/components/dialog/ModalProvider";
import toast from "react-hot-toast";
import { base64toFile } from "src/utils/function";
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})


const PostAdd = () => {
    const { setModal } = useModal()
    const router = useRouter();
    const [shop, setShop] = useState({});
    const [item, setItem] = useState({
        title: '',
        note: '',
    })
    useEffect(() => {
        getShopInfo();
    }, [])
    const getShopInfo = async () => {
        let data_ = await apiManager('shops', 'get', {
            id: router.query?.shop_id
        });
        setShop(data_);
    }
    const onSave = async () => {
        let result = undefined
        result = await apiManager('posts', 'create', { ...item, shop_id: router.query?.shop_id });
        if (result) {
            toast.success("성공적으로 저장 되었습니다.");
            router.push('/user/my-page/?type=1');
        }
    }
    return (
        <>
            <Title style={{ marginTop: '1rem' }}>{shop?.name} 후기작성</Title>
            <Stack spacing={3}>
                <TextField
                    label='제목'
                    value={item.title}
                    onChange={(e) => {
                        setItem(
                            {
                                ...item,
                                ['title']: e.target.value
                            }
                        )
                    }} />
                 <ReactQuill
                      className="max-height-editor"
                      theme={'snow'}
                      id={'content'}
                      placeholder={''}
                      value={item.note}
                      modules={react_quill_data.modules}
                      formats={react_quill_data.formats}
                      onChange={async (e) => {
                        let note = e;
                        if (e.includes('<img src="') && e.includes('base64,')) {
                          let base64_list = e.split('<img src="');
                          for (var i = 0; i < base64_list.length; i++) {
                            if (base64_list[i].includes('base64,')) {
                              let img_src = base64_list[i];
                              img_src = await img_src.split(`"></p>`);
                              let base64 = img_src[0];
                              img_src = await base64toFile(img_src[0], 'note.png');
                              const response = await apiManager('upload/single', 'create', {
                                post_file: img_src,
                              })
                              note = await note.replace(base64, response?.url)
                            }
                          }
                        }
                        setItem({
                          ...item,
                          ['note']: note
                        });
                      }} />
                <Button variant="contained" style={{
                    height: '48px', width: '120px', margin: '1rem 0 1rem auto'
                }} onClick={() => {
                    setModal({
                        func: () => { onSave() },
                        icon: 'material-symbols:edit-outline',
                        title: '저장 하시겠습니까?'
                    })
                }}>
                    저장
                </Button>
            </Stack>
        </>
    )
}
PostAdd.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default PostAdd;