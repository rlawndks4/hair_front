
import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { themeObj } from "src/components/elements/styled-components";
import { useSettingsContext } from "src/components/settings";
import { Upload } from "src/components/upload";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { base64toFile, getAllIdsWithParents, returnMoment } from "src/utils/function";
import styled from "styled-components";
import { react_quill_data } from "src/data/manager-data";
import { axiosIns } from "src/utils/axios";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import dynamic from "next/dynamic";
import { apiManager } from "src/utils/api-manager";
import {
  DatePicker,
  StaticDatePicker,
  MobileDatePicker,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const ReservationEdit = () => {
  const { setModal } = useModal()
  const { themeMode } = useSettingsContext();

  const router = useRouter();
  const [shopList, setShopList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    user_name: '',
    note: '',
    shop_id: undefined,
    date: returnMoment(false, new Date()).slice(0, 10),
    time: '00:00'
  })

  useEffect(() => {
    settingPage();
  }, [router.asPath])
  const settingPage = async () => {
    let shop_list = await apiManager('shops', 'list', {})
    setShopList(shop_list?.content);
    if (router.query?.edit_category == 'edit') {
      let data = await apiManager('reservations', 'get', {
        id: router.query.id
      })
      data['date'] = data['date'].toString();
      data['date'] = `${data['date'].substring(0,4)}-${data['date'].substring(4,6)}-${data['date'].substring(6,8)}`
      setItem(data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    if (!(item.shop_id > 0)) {
      return toast.error('미용실을 선택해 주세요.')
    }
    if (!item.user_name) {
      return toast.error('유저아이디를 입력해 주세요.')
    }
    if (!item.date) {
      return toast.error('날짜를 선택해 주세요.')
    }
    if (!item.time) {
      return toast.error('시간을 선택해 주세요.')
    }
    if (item?.id) {//수정
      result = await apiManager('reservations', 'update', item);
    } else {//추가
      result = await apiManager('reservations', 'create', item);
    }
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      router.push('/manager/reservation');
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
                  <FormControl>
                    <InputLabel>미용실선택</InputLabel>
                    <Select label='미용실선택' 
                    value={item.shop_id} 
                    defaultValue={item.shop_id} 
                    onChange={(e) => {
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
                  <TextField
                    label='예약일'
                    value={item.date}
                    type="date"
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['date']: e.target.value
                        }
                      )
                    }} />
                  <TextField
                    label='예약시간'
                    value={item.time}
                    type="time"
                    step="300"
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['time']: e.target.value
                        }
                      )
                    }} />
                  <Stack spacing={1}>
                    <TextField
                      fullWidth
                      label="예약메모"
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
ReservationEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ReservationEdit
