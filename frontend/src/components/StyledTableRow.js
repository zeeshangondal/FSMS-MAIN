import {styled} from "@mui/material/styles";
import {TableRow} from "@mui/material";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: "#F4F5FD",
        cursor: 'pointer',
    },
}));

export default StyledTableRow;