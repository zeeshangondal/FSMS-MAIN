import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import ActionButton from "./controls/ActionButton";
import CloseIcon from '@mui/icons-material/Close';
import {styled} from "@mui/material/styles";

const styles = {
    dialogTitle: {
        padding: 5,
    }
}
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup } = props;
    const classes = styles;

    return (
        <StyledDialog open={openPopup} maxWidth="sm">
            <DialogTitle style={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1, paddingTop: 5, paddingLeft:5 }}>
                        {title}
                    </Typography>
                    <ActionButton
                        color="secondary"
                        onClick={()=>{setOpenPopup(false)}}>
                        <CloseIcon />
                    </ActionButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </StyledDialog>
    )
}
