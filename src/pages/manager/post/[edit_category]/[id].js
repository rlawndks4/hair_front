
import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { themeObj } from "src/components/elements/styled-components";
import { useSettingsContext } from "src/components/settings";
import { Upload } from "src/components/upload";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { base64toFile, getAllIdsWithParents } from "src/utils/function";
import styled from "styled-components";
import { react_quill_data } from "src/data/manager-data";
import { axiosIns } from "src/utils/axios";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import dynamic from "next/dynamic";
import { apiManager } from "src/utils/api-manager";
import { post_category_list } from "src/data/data";
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const PostEdit = () => {
  const { setModal } = useModal()
  const { themeMode } = useSettingsContext();

  const router = useRouter();
  const [shopList, setShopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    post_file: undefined,
    title: '',
    shop_id: '',
    note: '',
    type: undefined
  })
  useEffect(() => {
    settingPage();
  }, [router.asPath])
  const settingPage = async () => {
    let shop_list = await apiManager('shops', 'list', {})
    setShopList(shop_list?.content);
    if (router.query?.edit_category == 'edit') {
      let data = await apiManager('posts', 'get', {
        id: router.query.id
      })
      setItem(data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    if (item?.id) {//수정
      result = await apiManager('posts', 'update', item);
    } else {//추가
      result = await apiManager('posts', 'create', item);
    }
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      router.push('/manager/post');
    }
  }

  return (
    <>
      {!loading &&
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      메인이미지
                    </Typography>
                    <Upload file={item.post_file || item.post_img} onDrop={(acceptedFiles) => {
                      const newFile = acceptedFiles[0];
                      if (newFile) {
                        setItem(
                          {
                            ...item,
                            ['post_file']: Object.assign(newFile, {
                              preview: URL.createObjectURL(newFile),
                            })
                          }
                        );
                      }
                    }} onDelete={() => {
                      setItem(
                        {
                          ...item,
                          ['post_img']: '',
                          ['post_file']: undefined,
                        }
                      )
                    }}
                    />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Stack spacing={3}>
                  <FormControl>
                    <InputLabel>카테고리</InputLabel>
                    <Select label='카테고리' value={item.type} onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['type']: e.target.value.toString()
                        }
                      )
                    }}>
                      {post_category_list && post_category_list.map((cate, idx) => {
                        return <MenuItem value={idx}>{cate}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                  {(item.type == 0 || item.type == 2) &&
                    <>
                      <FormControl>
                        <InputLabel>미용실선택</InputLabel>
                        <Select label='미용실선택' value={item.shop_id} onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['shop_id']: e.target.value
                            }
                          )
                        }}>
                          {shopList && shopList.map((shop, idx) => {
                            return <MenuItem value={shop?.id}>{shop.name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                    </>}
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
                  <Stack spacing={1}>
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
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={1} style={{ display: 'flex' }}>
                  <Button variant="contained" style={{
                    height: '48px', width: '120px', marginLeft: 'auto'
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
              </Card>
            </Grid>
          </Grid>
        </>}
    </>
  )
}
PostEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default PostEdit
