import { Avatar, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ManagerTable from "src/sections/manager/table/ManagerTable";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { Row } from "src/components/elements/styled-components";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { apiManager } from "src/utils/api-manager";
import { LazyLoadImage } from "react-lazy-load-image-component";
const ShopList = () => {
  const { setModal } = useModal()
  const defaultColumns = [
    {
      id: 'shop_img',
      label: '미용실프로필',
      action: (row) => {
        return <LazyLoadImage src={row['shop_img']} style={{ height: '56px' }} />
      }
    },
    {
      id: 'name',
      label: '미용실이름',
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
      id: 'created_at',
      label: '생성일',
      action: (row) => {
        return row['created_at'] ?? "---"
      }
    },
    {
      id: 'edit',
      label: '수정/삭제',
      action: (row) => {
        return (
          <>
            <IconButton>
              <Icon icon='material-symbols:edit-outline' onClick={() => {
                router.push(`edit/${row?.id}`)
              }} />
            </IconButton>
            <IconButton onClick={() => {
              setModal({
                func: () => { deleteItem(row?.id) },
                icon: 'material-symbols:delete-outline',
                title: '정말 삭제하시겠습니까?'
              })
            }}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </>
        )
      }
    },
  ]
  const router = useRouter();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState({});
  const [searchObj, setSearchObj] = useState({
    page: 1,
    page_size: 10,
    s_dt: '',
    e_dt: '',
    search: '',
  })
  const [dialogObj, setDialogObj] = useState({
    changePassword: false,
  })
  const [changePasswordObj, setChangePasswordObj] = useState({
    id: '',
    user_pw: ''
  })
  useEffect(() => {
    pageSetting();
  }, [])
  const pageSetting = () => {
    let cols = defaultColumns;
    setColumns(cols)
    onChangePage({ ...searchObj, page: 1, });
  }
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
  const deleteItem = async (id) => {
    let data = await apiManager('shops', 'delete', { id });
    if (data) {
      onChangePage(searchObj);
    }
  }
  const onChangeUserPassword = async () => {
    let result = await changePasswordUserByManager(changePasswordObj);
    if (result) {
      setDialogObj({
        ...dialogObj,
        changePassword: false
      })
      toast.success("성공적으로 변경 되었습니다.");
    }
  }
  return (
    <>
      <Dialog
        open={dialogObj.changePassword}
      >
        <DialogTitle>{`비밀번호 변경`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            새 비밀번호를 입력 후 확인을 눌러주세요.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={changePasswordObj.user_pw}
            type="password"
            margin="dense"
            label="새 비밀번호"
            onChange={(e) => {
              setChangePasswordObj({
                ...changePasswordObj,
                user_pw: e.target.value
              })
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onChangeUserPassword}>
            변경
          </Button>
          <Button color="inherit" onClick={() => {
            setDialogObj({
              ...dialogObj,
              changePassword: false
            })
          }}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={3}>
        <Card>
          <ManagerTable
            data={data}
            columns={columns}
            searchObj={searchObj}
            onChangePage={onChangePage}
            add_button_text={'미용실 추가'}
          />
        </Card>
      </Stack>
    </>
  )
}
ShopList.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ShopList
