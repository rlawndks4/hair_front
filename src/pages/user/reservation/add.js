import { Button, Stack } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "src/auth/useAuthContext";
import { useModal } from "src/components/dialog/ModalProvider";
import { Row } from "src/components/elements/styled-components";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";
import { returnMoment } from "src/utils/function";
let time_list = [
    '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
]
const ReservationAdd = () => {
    const router = useRouter();
    const { setModal } = useModal()
    const {user} = useAuthContext();
    const [reservationList, setReservationList] = useState([]);
    const [checkTime, setCheckTime] = useState(undefined);
    const [item, setItem] = useState({
        time: undefined,
        date: new Date()
    })
    useEffect(() => {
        getReservationTime();
    }, [item])
    const getReservationTime = async () => {
        let data_ = await apiManager('reservations', 'list', {
            page: 1,
            page_size: 10000,
            date: returnMoment(false, item.date).substring(0, 10).replaceAll('-', '')
        });
        setCheckTime(undefined)
        setReservationList(data_?.content);
    }
    const onReservation = async () => {
        let result = undefined
        result = await apiManager('reservations', 'create', {...item, 
            date: returnMoment(false, item.date).substring(0, 10).replaceAll('-', ''),
            time:checkTime,
            user_name:user?.user_name,
            shop_id:router.query?.shop_id
        });
        if(result){
            toast.success('성공적으로 예약되었습니다.');
            router.push(`/user/my-page/?type=2`)
        }
    }
    return (
        <>
            <Stack>
                <DateCalendar
                    value={item.date}
                    onChange={(value) => {
                        console.log(value)
                        setItem({
                            ...item,
                            time: undefined,
                            date: value
                        })
                    }}
                />
                {time_list.map((time, idx) => (
                    <>
                        <Row style={{ border: `1px solid #ccc` }}>
                            <div style={{ width: '100px', textAlign: 'center', padding: '0.25rem', borderRight: '1px solid #ccc' }}>{time}시</div>
                            <div
                                onClick={() => {
                                    if (!reservationList.map(itm => { return itm.time }).includes(`${time}:00`)) {
                                        setCheckTime(`${time}:00`)
                                    }
                                }}
                                style={{ width: '100%', cursor: 'pointer', background: `${reservationList.map(itm => { return itm.time }).includes(`${time}:00`) ? 'red' : `${checkTime == `${time}:00` ? 'blue' : ''}`}` }}>
                            </div>
                        </Row>
                    </>
                ))}
                <Button variant="contained" style={{
                    height: '48px', width: '120px', margin: '1rem 0 1rem auto'
                }} onClick={() => {
                    if(!checkTime){
                        return;
                    }
                    setModal({
                        func: () => { onReservation() },
                        icon: 'material-symbols:edit-outline',
                        title: '예약 하시겠습니까?'
                    })
                }}>
                    예약
                </Button>
            </Stack>
        </>
    )
}
ReservationAdd.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default ReservationAdd;