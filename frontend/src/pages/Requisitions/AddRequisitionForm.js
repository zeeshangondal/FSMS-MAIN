import React, {useState} from 'react'
import {Autocomplete, Grid, InputAdornment, TableBody, TableCell, TableRow} from '@mui/material';
import {Form} from '../../components/useForm';
import * as requisitionService from "../../service/requisitionService";
import * as employeeService from "../../service/employeeService";
import useTable from '../../components/useTable';
import Controls from "../../components/controls/Controls";
import {Search} from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Items from './User/Items';
import Notification from '../../components/Notification';
import Popup from '../../components/Popup';
import ConfirmDialog from '../../components/ConfirmDialog';
import ActionButton from "../../components/controls/ActionButton";
import {useLocation, useNavigate} from "react-router";
import TextField from "@mui/material/TextField";
import Input from "../../components/controls/Input";
import * as itemService from "../../service/itemService";
import SaveIcon from '@mui/icons-material/Save';
import {getCategoryOptionsU, getItems, getPackagingOptionsU} from "../../service/itemService";


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


export default function AddRequisitionForm(props) {

    const location = useLocation();


    const {recordForEdit, viewOnly = false, isHod = true} = location.state;


    const addedItemsHeadCells = [
        {id: 'name', label: 'Name'},
        {id: 'category', label: 'Category'},
        {id: 'requestedQuantity', label: 'Requested Quantity', disableSorting: true}
    ]

    const classes = styles;

    if(!recordForEdit){
        addedItemsHeadCells.splice(1, 0, {id: 'totalQuantity', label: 'Total Quantity'});

    }
    if (!viewOnly) {
        addedItemsHeadCells.push({id: 'actions', label: 'Actions', disableSorting: true})
    }
    const [values, setValues] = React.useState(requisitionService.getInitialRequisitionValues())

    if (values.status >= 66) {
        addedItemsHeadCells.push({id: 'issuedQuantity', label: 'Issued Quantity', disableSorting: true})
    }


    const loggedInUser = employeeService.getLoggedInUser();

    const [addedItems, setAddedItems] = React.useState([])
    const [filterFn, setFilterFn] = useState({
        fn: items => {
            return items;
        }
    })
    const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title: '', subTitle: ''})
    const [items,setItems] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [packagingOptions, setPackagingOptions] = useState([]);
    const [currentItems, setcurrentItems] = useState([]);
    const [added,setAdded] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log('record for edit test start');
        console.log('record for edit test end');
        if (recordForEdit != null) {
            setAddedItems([
                ...recordForEdit.items
            ])
            setValues({
                ...recordForEdit
            })
        } else {
            setValues({
                ...values,
                userId: loggedInUser.id,
                departmentId: loggedInUser.departmentId,
                email: loggedInUser.email
            })
        }
    }, [recordForEdit])

    React.useEffect( () => {
        getItems(setItems);
        getPackagingOptionsU(setPackagingOptions);
        getCategoryOptionsU(setCategoryOptions);
    },[0])


    const validate = () => {
        if (addedItems.length > 0)
            return true;
        else {
            setNotify({
                isOpen: true,
                message: `No item added `,
                type: 'error'
            })
            return false;
        }
    }

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(addedItems, addedItemsHeadCells, filterFn)

    const addItemToRequisition = (item) => {
        if (addedItems.find((it) => it.id === item.id)) {
            setNotify({
                isOpen: true,
                message: `${item.name} already been added `,
                type: 'error'
            })
            return
        }

        setAddedItems([
            ...addedItems,
            item
        ])
        setNotify({
            isOpen: true,
            message: `${item.requestedQuantity} ${item.name} Added Successfully`,
            type: 'success'
        })
    }

    const onRemoveCurrentItem = () => {
        setcurrentItems([])
        setAdded(true);
    }

    const onRemoveItemFromRequisition = item => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        setAddedItems(addedItems.filter(x => x.id != item.id))

        setNotify({
            isOpen: true,
            message: `${item.quantity || item.requestedQuantity} ${item.name} Removed Successfully`,
            type: 'success'
        })
    }

    const invalid = (msg = 'Plese fill the form correctly!') => {
        setNotify({
            isOpen: true,
            message: msg,
            type: 'error'
        })
    }
    const valid = (msg = 'Submitted Sucessfully') => {
        setNotify({
            isOpen: true,
            message: msg,
            type: 'success'
        })
    }

    const addOrEdit = (requisitionData) => {
        if (requisitionData.id === 0) {
            requisitionService.insertRequisitionU(requisitionData, valid, invalid)
        } else {
            requisitionService.updateRequisitionU(requisitionData, valid, invalid)
        }
        setNotify({
            isOpen: true,
            message: 'Submitted successfully',
            type: 'success'
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            const requisitionData = {...values, items: addedItems}
            addOrEdit(requisitionData)
            navigate(-1);
        }

    }

    const resetRequisistionForm = () => {
        setAddedItems([])
    }
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
        const approvalData = {id: values.id, reportingOfficerRemarks: values.reportingOfficerRemarks}
        requisitionService.sendReportingOfficerApproval(approvalData, valid, invalid)
        navigate(-1);
    }

    const handleInputChange = e => {
        const {name, value} = e.target
        //console.log("Remarks: ",name,value)
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleItemQuantityChange = (e, item) => {
        const reqQTA = e.target.value
        if (reqQTA < 0) {
            setNotify({
                isOpen: true,
                message: `Issued items cannot be a negative number `,
                type: 'error'
            })
        }
            else if (reqQTA > currentItems[0].quantity) {
                setNotify({
                    isOpen: true,
                    message: `Issued items cannot be a more than requested items `,
                    type: 'error'
                })
        }
        else
            currentItems[0].requestedQuantity = reqQTA
    }


    const handlecurrentItemsChange = e => {
        setcurrentItems([items.filter(item=>item.name===e)[0]]);
    }

    const addEditableRow = () => {
        console.log(items[0]);
        setcurrentItems([...currentItems,items[0]]);
        console.log(currentItems);
        setAdded(false);
    }

    return (
        <>
            <Form>
                <Popup
                    openPopup={openPopup}
                    title="Add Items to Requisition"
                    setOpenPopup={setOpenPopup}
                >
                    <Items
                        addItemToRequisition={addItemToRequisition}
                    />
                </Popup>
                {
                    values.status < 100
                        ?
                        <div style={classes.toolBar}>
                            <Controls.Input
                                style={classes.searchInput}
                                label="Search"
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>)
                                }}
                                onChange={handleSearch}
                            />
                            {
                                viewOnly === true ?
                                    ''
                                    :
                                    <Controls.Button
                                        text="Add Items"
                                        variant="outlined"
                                        disabled={!added}
                                        startIcon={<AddIcon/>}
                                        onClick={() => {
                                            // setOpenPopup(true)
                                            addEditableRow();
                                        }}
                                    />
                            }
                        </div>
                        : ""
                }
                {addedItems.length === 0 && currentItems.length === 0 ? <h3 style={{margin: '2%'}}>No Item added</h3> :
                    <>
                        <TblContainer>
                            <TblHead/>
                            <TableBody>
                                {
                                    recordsAfterPagingAndSorting().map( (item) => {
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                {!recordForEdit?<TableCell>{item.quantity}</TableCell>:<></>}
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>{item.requestedQuantity}</TableCell>
                                                {
                                                    values.status >= 66 ?
                                                        <>
                                                            <TableCell>{item.issuedQuantity}</TableCell>
                                                        </>
                                                        : ''
                                                }
                                                {
                                                    viewOnly === true ? ''
                                                        :
                                                        <>
                                                            <TableCell>
                                                                <ActionButton
                                                                    color="success"
                                                                    onClick={() => {
                                                                    }}>
                                                                    <AddIcon />
                                                                </ActionButton>

                                                                <Controls.ActionButton color='secondary'
                                                                                       onClick={() => {
                                                                                           console.log("clicked")
                                                                                           setConfirmDialog({
                                                                                               isOpen: true,
                                                                                               title: 'Are you sure to delete this item?',
                                                                                               subTitle: "You can't undo this operation",
                                                                                               onConfirm: () => { onRemoveItemFromRequisition(item) }
                                                                                           })
                                                                                       }}
                                                                >
                                                                    <CloseIcon />
                                                                </Controls.ActionButton>
                                                            </TableCell>
                                                        </>
                                                }
                                            </TableRow>
                                        )
                                    })
                                }
                                {
                                    currentItems.map(item=>{
                                        return (
                                            <TableRow key={item.id}>
                                                {/*<TableCell>{item.name}</TableCell>*/}
                                                <TableCell>
                                                    <Autocomplete
                                                        disablePortal
                                                        value={selectedValue}
                                                        options={items.map(item=>item.name)}
                                                        sx={{width: 300}}
                                                        onChange={(event, newValue) => {
                                                            setSelectedValue(newValue);
                                                            handlecurrentItemsChange(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} label="Name"/>}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    {item.category}
                                                </TableCell>
                                                <TableCell>
                                                    <Input type='number' style={{ width: '55px', border: 'none' }} onChange={(e) => handleItemQuantityChange(e)} />
                                                </TableCell>
                                                {
                                                    values.status >= 66 ?
                                                        <>
                                                            <TableCell>{item.issuedQuantity}</TableCell>
                                                        </>
                                                        : ''
                                                }
                                                {
                                                    viewOnly === true ? ''
                                                        :
                                                        <>
                                                            <TableCell>
                                                                <ActionButton
                                                                    color="success"
                                                                    onClick={() => {
                                                                        setAddedItems([...addedItems,item])
                                                                        setcurrentItems([]);
                                                                        setAdded(true);
                                                                    }}>
                                                                    <SaveIcon/>
                                                                </ActionButton>

                                                                <Controls.ActionButton color='secondary'
                                                                                       onClick={onRemoveCurrentItem}
                                                                >
                                                                    <CloseIcon/>
                                                                </Controls.ActionButton>
                                                            </TableCell>
                                                        </>
                                                }
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </TblContainer>
                        <TblPagination/>
                    </>
                }
                <Notification
                    notify={notify}
                    setNotify={setNotify}
                />
                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
                <Grid container>
                    <Grid item xs={12}>
                        {values.status >= 33 || isHod ?
                            <>
                                <h6>{values.status >= 33 ? `Approved by ${isHod ? "you" : `Reporting Officer(${values.reportingOfficer})`} on: ` + (new Date(values.approvedByReportingOfficerDate)).toLocaleDateString() : ""}</h6>
                                <h6>{isHod ? "Your " : "Reporting Officer's "} Remarks: {values.status>=33 ? values.reportingOfficerRemarks:''}</h6>
                                {values.status>=33?<></>:<Input
                                    placeholder="Reporting Officer Remarks "
                                    name="reportingOfficerRemarks"
                                    value={values.reportingOfficerRemarks}
                                    onChange={handleInputChange}
                                    multiline
                                    fullWidth
                                    rows={2}
                                    maxRows={4}
                                />}
                            </> : ""
                        }
                        {
                            values.status >= 66 ?
                                <>
                                    <h6>{values.status >= 66 ? "Approved by Store Keeper on: " + values.approvedByStoreKeeperDate : ""}</h6>
                                    <h6>Store Keeper's Remarks</h6>
                                    <Input
                                        placeholder="Store Keeper Remarks "
                                        name="storeKeeperRemarks"
                                        value={values.storeKeeperRemarks}
                                        disabled={true}
                                        multiline
                                        fullWidth
                                        rows={2}
                                        maxRows={4}
                                    /></>
                                : ""
                        }
                        <h4>{values.status == 100 ? `Requisition Completed. Completion Date: ${values.completionDate}` : ""}</h4>


                    </Grid>
                    <Grid item xs={12}>
                        {
                            viewOnly === true ?
                                values.status >= 33 ? '' :
                                    <Controls.Button
                                        text="Approve"
                                        variant="contained"
                                        sx={{display: isHod ? 'inline' : 'none'}}
                                        onClick={handleApproval}
                                    />
                                :
                                <>
                                    <Controls.Button
                                        text="Submit"
                                        variant="contained"
                                        onClick={handleSubmit}
                                    />
                                    <Controls.Button
                                        text="Reset"
                                        variant="contained"
                                        color="secondary"
                                        onClick={resetRequisistionForm}
                                    />
                                </>
                        }
                        <Controls.Button
                            text="Back"
                            variant="contained"
                            color="default"
                            onClick={() => navigate(-1)}
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




