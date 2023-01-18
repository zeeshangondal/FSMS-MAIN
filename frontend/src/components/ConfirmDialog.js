import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from '@mui/material'
import Controls from "./controls/Controls";

const styles = {
    dialog: {
        padding: (theme) => theme.spacing(2),
        position: 'absolute',
        top: (theme) => theme.spacing(5)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
}

export default function ConfirmDialog(props) {

    const { confirmDialog, setConfirmDialog, color="secondary" } = props;
    const classes = styles;

    return (
        <Dialog open={confirmDialog.isOpen} sx={ classes.dialog }>
            <DialogContent sx={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions sx={classes.dialogAction}>
                <Controls.Button
                    text="No"
                    color="default"
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
                <Controls.Button
                    text="Yes"
                    color={color}
                    onClick={confirmDialog.onConfirm} />
            </DialogActions>
        </Dialog>
    )
}
