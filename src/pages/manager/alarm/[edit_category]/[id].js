
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
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const AlarmEdit = () => {
  const { setModal } = useModal()
  const { themeMode } = useSettingsContext();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    user_name: '',
    title: '',
    content: '',
    link: '',
  })

  useEffect(() => {
    settingPage();
  }, [router.asPath])
  const settingPage = async () => {
    if (router.query?.edit_category == 'edit') {
      let data = await apiManager('alarms', 'get', {
        id: router.query.id
      })
      setItem(data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    if (item?.id) {//수정
      result = await apiManager('alarms', 'update', item);
    } else {//추가
      result = await apiManager('alarms', 'create', item);
    }
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      router.push('/manager/alarm');
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
                  <TextField
                    label='유저아이디'
                    value={item.user_name}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['user_name']: e.target.value
                        }
                      )
                    }} />
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Stack spacing={3}>
                  <TextField
                    label='알림제목'
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
                    <TextField
                      fullWidth
                      label="알림내용"
                      multiline
                      rows={4}
                      value={item.content}
                      onChange={(e) => {
                        setItem({
                          ...item,
                          ['content']: e.target.value
                        })
                      }}
                    />
                  </Stack>
                  <TextField
                    label='이동할링크'
                    value={item.link}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['link']: e.target.value
                        }
                      )
                    }} />
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
AlarmEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default AlarmEdit
