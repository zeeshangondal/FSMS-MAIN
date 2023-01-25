import React, { useState } from 'react'
import ItemForm from "./ItemForm";
import {
    Paper,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
    InputAdornment,
    FormControlLabel,
    Switch,
    ToggleButton, Typography
} from '@mui/material';
import useTable from "../../components/useTable";
import * as itemService from "../../service/itemService";
import { Search } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import Input from "../../components/controls/Input";
import Button from "../../components/controls/Button";
import ActionButton from "../../components/controls/ActionButton";
import Popup from "../../components/Popup";
import {styled} from "@mui/material/styles";
import Notification from "../../components/Notification";
import DeleteItemForm from "./DeleteItemForm";
import StyledTableRow from "../../components/StyledTableRow";
import AddItemForm from "./AddItemForm";
import Select from "../../components/controls/Select";
import * as service from "../../service/itemService";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import PopOver from "../../components/controls/PopOver";
import BasicPopover from "../../components/controls/PopOver";

const styles = {
    pageContent: {
        margin: (theme)=> theme.spacing(5),
        padding: (theme)=> theme.spacing(3)
    },
    searchInput: {
    },
    toolBar: {
        display: "flex",
        alignItems: "center",
        justifyContent:"space-between",
    },
    searchToggle: {
        display: 'flex' ,
        gap: 10,
        alignItems: "center",
    }
}

const headCells = [
    { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'packaging', label: 'Packaging' },
    { id: 'actions', label: 'Actions', disableSorting: true, align: 'right' }
]

export default function Items() {

    const classes = styles;
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({
        fn: items => {
            return items;
        }
    })
    const [openPopup, setOpenPopup] = useState(false)
    const [openDeletePopup, setOpenDeletePopup] = useState(false)
    const [openAddPopup, setOpenAddPopup] = useState(false)
    const [quantity, setQuantity] = useState(0);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    
    const getItems=()=>{
        itemService.getItems(setRecords)
    }
    
    React.useEffect(()=>{
        getItems()
    },[0])

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.name.toLowerCase().includes(target.value))
            }
        })
    }

    const handleInputChange = e=>{
        let value = e.target.value;
        setQuantity(value);
        setFilterFn({
            fn: items => {
                if (value<=0)
                    return items;
                else if (value > 0)
                    return items.filter(x => x.quantity<value);
            }
        })
    }
    const addOrEdit = (item, resetForm) => {
        if (item.id === 0)
            itemService.addItem(item,valid,invalid)
        else
            itemService.updateItem(item,valid,invalid,true, `Item updated successfully` )
        resetForm()
        setRecordForEdit(null);
        setOpenPopup(false)
//        setRecords([...itemService.getItems()]);
        getItems()
    }

    const invalid = (msg='Plese fill the form correctly!') => {
        setNotify({
            isOpen: true,
            message: msg,
            type: 'error'
        })
    }
    const valid = (msg='Submitted Sucessfully') => {
        setNotify({
            isOpen: true,
            message: msg,
            type: 'success'
        })
    }

        const openInPopup = item => {
            setRecordForEdit(item)
            setOpenPopup(true)
        }

        const onDelete = (quantity) => {
            let difference = recordForEdit.quantity-quantity.quantity
            if(difference>=0) {
                let QTA =recordForEdit.quantity- quantity.quantity;
                let record={
                    ...recordForEdit,
                    quantity:QTA
                }
                const msg=`Stock of ${quantity.quantity} ${record.name} Removed Successfully`
                itemService.updateItem(record,valid,invalid,true,msg,getItems);

            }else {
                setNotify({
                isOpen: true,
                message: 'Insufficient stock of items',
                type: 'error'
            })
            }
            setOpenDeletePopup(false);
            setRecordForEdit(null);
        }

        const onAdd= (quantity)=>{
            let QTA=recordForEdit.quantity
            QTA+= parseInt(quantity.quantity);
            let record={
                ...recordForEdit,
                quantity:QTA
            }
            const msg=`Stock of ${quantity.quantity} ${record.name} Added Successfully`
            itemService.updateItem(record,valid,invalid,true,msg,getItems);
            setOpenAddPopup(false);
            setRecordForEdit(null);
        }

        return (
            <>
                <Paper sx={classes.pageContent}>
                    <div style={classes.toolBar}>
                        <Typography variant="h4" noWrap  component="div">
                            Items
                        </Typography>
                        <div style={classes.searchToggle}>
                            <Input
                                placeholder="Search"
                                size="small"
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>)
                                }}
                                sx={classes.searchInput}
                                onChange={handleSearch}
                            />
                            <Button
                                text="Add Item"
                                variant="outlined"
                                size="medium"
                                startIcon={<AddIcon/>}
                                onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
                            />
                            <BasicPopover>
                                <Input
                                    name="quantity"
                                    label="Quantity"
                                    type= "number"
                                    value={quantity}
                                    onChange={handleInputChange}
                                />
                            </BasicPopover>
                        </div>
                    </div>
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(item =>
                                    (<StyledTableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.packaging}</TableCell>
                                        <TableCell align='right'>
                                            <ActionButton
                                                color="primary"
                                                onClick={() => { openInPopup(item) }}
                                            ><EditOutlinedIcon fontSize="small"/>
                                            </ActionButton>
                                            <ActionButton
                                                color="secondary"
                                                onClick={() => {
                                                    setOpenDeletePopup(true);
                                                    setRecordForEdit(item);
                                                }}>
                                                <RemoveIcon fontSize="small"/>
                                            </ActionButton>
                                            <ActionButton
                                                color="success"
                                                onClick={() => {
                                                    setOpenAddPopup(true);
                                                    setRecordForEdit(item);
                                                }}>
                                                <AddIcon fontSize="small"/>
                                            </ActionButton>
                                        </TableCell>
                                    </StyledTableRow>)
                                )
                            }
                        </TableBody>
                    </TblContainer>
                    <TblPagination/>
                </Paper>
                <Popup
                    title="Items Form"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <ItemForm
                        recordForEdit={recordForEdit}
                        addItem={addOrEdit}
                    />
                </Popup>
                <Popup
                    title="Delete Form"
                    openPopup={openDeletePopup}
                    setOpenPopup={setOpenDeletePopup}
                >
                    <DeleteItemForm
                        deleteItem={onDelete}
                        cancelForm={()=>setOpenDeletePopup(false)}
                    />
                </Popup>
                <Popup
                    title="Add Form"
                    openPopup={openAddPopup}
                    setOpenPopup={setOpenAddPopup}
                >
                    <AddItemForm
                        addItem={onAdd}
                        cancelForm={()=>setOpenAddPopup(false)}
                    />
                </Popup>
                <Notification
                    notify={notify}
                    setNotify={setNotify}
                />
            </>
        )
}
