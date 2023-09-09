import { Stack } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import UserLayout from "src/layouts/user/UserLayout";

const ReservationAdd = () => {
    return (
        <>
            <Stack spacing={3}>
                <DateCalendar 
                
                />
            </Stack>
        </>
    )
}
ReservationAdd.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default ReservationAdd;