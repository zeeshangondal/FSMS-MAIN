import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material';
import {  Form } from '../../../components/useForm';
import * as requisitionService from "../../../service/requisitionService";
import useTable from '../../../components/useTable';
import {  TableBody, TableRow, TableCell,  InputAdornment } from '@mui/material';
import Controls from "../../../components/controls/Controls";
import {  Search } from "@mui/icons-material";
import Notification from '../../../components/Notification';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {useLocation, useNavigate} from "react-router";


const styles = {
    pageContent: {
        margin: (theme) => theme.spacing(5),
        padding: (theme) => theme.spacing(3)
    },
    searchInput: {
        width: '80%'
    },
    toolBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    }
}

export default function StoreKeeperRequisitionForm(props) {

    const addedItemsHeadCells = [
        { id: 'name', label: 'Name' },
        { id: 'category', label: 'Category' },
        { id: 'requestedQuantity', label: 'Requested Quantity', disableSorting: true },
        { id: 'issuedQuantity', label: 'Issued Quantity', disableSorting: true }
    ]
    const classes = styles;
    const location = useLocation();

    const {  recordForEdit } = location.state;

    // if (!viewOnly) {
    //     addedItemsHeadCells.push({ id: 'actions', label: 'Actions', disableSorting: true })
    // }

    const [values, setValues] = React.useState(requisitionService.getInitialRequisitionValues())
    const [addedItems, setAddedItems] = React.useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const navigate = useNavigate();

    React.useEffect(() => {
        setAddedItems([
            ...recordForEdit.items
        ])
        setValues({
            ...recordForEdit
        })
    }, [0])


    const validate = () => {
        const tbdItems= addedItems.find(item =>item.issuedQuantity ==null)
        return tbdItems == null
    }

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(addedItems, addedItemsHeadCells, filterFn)



    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.name.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }
    const handleApproval = () => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        if(validate()){
            const requisitionData = { ...values, status: 66, items: addedItems }
            addOrEdit(requisitionData)
            navigate(-1);    
        }else{
            setNotify({
                isOpen: true,
                message: `All items must have an issued quantity! `,
                type: 'error'
            })
        }
        
    }

    const addOrEdit = (requisitionForm, resetForm) => {
        if (requisitionForm.id === '0')
            requisitionService.insertRequisition(requisitionForm)
        else
            requisitionService.updateRequisition(requisitionForm)
        setNotify({
            isOpen: true,
            message: 'Approved successfully',
            type: 'success'
        })
    }


    const handleItemQuantityChange = (e, item) => {
        const issuedQTA = e.target.value
        if (issuedQTA < 0) {
            setNotify({
                isOpen: true,
                message: `Issued items cannot be a negative number `,
                type: 'error'
            })
        }
        // else if (issuedQTA > item.requestedQuantity) {
        //     setNotify({
        //         isOpen: true,
        //         message: `Issued items cannot be a more than requested items `,
        //         type: 'error'
        //     })
        // }
        else
            item.issuedQuantity = issuedQTA
    }

    return (
        <>
            <Form>
                <div style={classes.toolBar}>
                    <Controls.Input
                        style={classes.searchInput}
                        label="Search"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                </div>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((item) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.requestedQuantity}</TableCell>
                                        <TableCell>
                                            <input type='number' placeholder={!item.issuedQuantity ? 'TBD' : item.issuedQuantity} style={{ width: '55px', border: 'none' }} disabled={values.status>=40} onChange={(e) => handleItemQuantityChange(e, item)} />
                                        </TableCell>

                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
                <Notification
                    notify={notify}
                    setNotify={setNotify}
                />
                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                    color="primary"
                />
                <Grid container>
                    <Grid item xs={12}>
                        <Controls.Button
                            disabled={values.status >=40}
                            text="Approve"
                            variant="contained"
                            onClick={() => {
                                setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure to approve this requisition?',
                                    subTitle: "You can't undo this operation",
                                    onConfirm: () => { handleApproval() }
                                })
                            }}
                        />
                        <Controls.Button
                            text="Back"
                            variant="contained"
                            color="default"
                            onClick={()=>navigate(-1)}
                        />
                    </Grid>
                </Grid>
            </Form>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}




