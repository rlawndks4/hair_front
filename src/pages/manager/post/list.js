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
import _ from "lodash";
import { post_category_list } from "src/data/data";
const PostList = () => {
  const { setModal } = useModal()
  const defaultColumns = [
    {
      id: 'type',
      label: '카테고리',
      action: (row) => {
        return post_category_list[row['type']]
      }
    },
    {
      id: 'post_img',
      label: '메인이미지',
      action: (row) => {
        return <LazyLoadImage src={row['post_img']} style={{ height: '56px' }} />
      }
    },
    {
      id: 'shop_name',
      label: '미용실명',
      action: (row) => {
        return row['shop_name'] ?? "---"
      }
    },
    {
      id: 'teacher_nickname',
      label: '미용사',
      action: (row) => {
        return row['teacher_nickname'] ?? "---"
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
      id: 'user_name',
      label: '작성자아이디',
      action: (row) => {
        return row['user_name'] ?? "---"
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
    let data_ = await apiManager('posts', 'list', obj);
    if (data_) {
      setData(data_);
    }
    setSearchObj(obj);
  }
  const deleteItem = async (id) => {
    let data = await apiManager('posts', 'delete', { id });
    if (data) {
      onChangePage(searchObj);
    }
  }

  return (
    <>

      <Stack spacing={3}>
        <Card>
          <ManagerTable
            data={data}
            columns={columns}
            searchObj={searchObj}
            onChangePage={onChangePage}
            add_button_text={'게시물 추가'}
          />
        </Card>
      </Stack>
    </>
  )
}
PostList.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default PostList
