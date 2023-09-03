
import { Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
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
import DialogAddress from "src/components/dialog/DialogAddress";
import { Icon } from "@iconify/react";
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const ShopEdit = () => {
  const { setModal } = useModal()
  const { themeMode } = useSettingsContext();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    shop_file: undefined,
    name: '',
    addr: '',
    addr_detail: '',
    note: '',
  })

  useEffect(() => {
    settingPage();
  }, [router.asPath])
  const settingPage = async () => {
    if (router.query?.edit_category == 'edit') {
      let data = await apiManager('shops', 'get', {
        id: router.query.id
      })
      setItem(data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    if (item?.id) {//수정
      result = await apiManager('shops', 'update', item);
    } else {//추가
      result = await apiManager('shops', 'create', item);
    }
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      router.push('/manager/shop');
    }
  }
  const [selectAddressOpen, setSelectAddressOpen] = useState(false);
  const onSelectAddressOpen = () => {
    setSelectAddressOpen(true);
  }
  const handletSelectAddressClose = () => setSelectAddressOpen(false);
  const onSelectAddress = (data) => {
    handletSelectAddressClose();
    setItem({ ...item, ['addr']: data?.address })
  }
  return (
    <>
     <DialogAddress
        open={selectAddressOpen}
        handleClose={handletSelectAddressClose}
        onKeepGoing={onSelectAddress}
        text={'주소 선택'}
        subText={'삭제하시면 복구할 수 없습니다.'}
        saveText={'삭제'}
        headIcon={<Icon icon='tabler:trash' style={{ fontSize: '40px' }} />}
      />
      {!loading &&
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      미용실대표이미지
                    </Typography>
                    <Upload file={item.shop_file || item.shop_img} onDrop={(acceptedFiles) => {
                      const newFile = acceptedFiles[0];
                      if (newFile) {
                        setItem(
                          {
                            ...item,
                            ['shop_file']: Object.assign(newFile, {
                              preview: URL.createObjectURL(newFile),
                            })
                          }
                        );
                      }
                    }} onDelete={() => {
                      setItem(
                        {
                          ...item,
                          ['shop_img']: '',
                          ['shop_file']: undefined,
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
                  <TextField
                    label='미용실명'
                    value={item.name}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['name']: e.target.value
                        }
                      )
                    }} />
                  <TextField
                    label='주소'
                    value={item.addr}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['addr']: e.target.value
                        }
                      )
                    }}
                    onClick={onSelectAddressOpen}
                    inputProps={{
                      readOnly: true,
                    }}
                    />
                  <TextField
                    label='상세주소'
                    value={item.addr_detail}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['addr_detail']: e.target.value
                        }
                      )
                    }} />
                  <Stack spacing={1}>
                    <TextField
                      fullWidth
                      label="메모"
                      multiline
                      rows={4}
                      value={item.note}
                      onChange={(e) => {
                        setItem({
                          ...item,
                          ['note']: e.target.value
                        })
                      }}
                    />
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
ShopEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ShopEdit
