import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material';
import { useForm, Form } from '../../../components/useForm';
import * as itemService from "../../../service/itemService";
import useTable from '../../../components/useTable';
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@mui/material';
import Controls from "../../../components/controls/Controls";
import { Search } from "@mui/icons-material";
import {default as SendOutlinedIcon} from '@mui/icons-material/SendOutlined';
import Popup from '../../../components/Popup';
import StyledTableRow from "../../../components/StyledTableRow";




const styles = {
    searchInput: {
        width: '100%'
    },
}

const allItemsHeadCells = [
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'quantity', label: 'Available Quantity', disableSorting: true },
    { id: 'actions', label: 'Actions', disableSorting: true }
]


export default function Items(props) {
    // const classes = useStyles()
    const classes = styles;
    const [allItems, setAllItems] = React.useState(itemService.getItems())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        temp.requestedQuantity = parseInt(fieldValues.requestedQuantity) >= 1 ? "" : "Requested Quantity must b greater than 0."
        setErrors({
            ...temp
        })
      
        return Object.values(temp).every(x => x === "")
    }
    const {
        values,
        setValues,
        handleInputChange,
        errors,
        setErrors,
        resetForm
    } = useForm({ requestedQuantity: 1 }, true, validate);


    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(allItems, allItemsHeadCells, filterFn)


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


    const handleItemSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setOpenItemPopup(false)
            props.addItemToRequisition(values)
        }
    }

    const [openItemPopup, setOpenItemPopup] = useState(false)


    

    return (
        <>

            <Popup
                openPopup={openItemPopup}
                title="Add Item to Requisition"
                setOpenPopup={setOpenItemPopup}
            >
                <Form onSubmit={handleItemSubmit}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Controls.Input
                                label='Item'
                                value={values.name}
                            />
                            <Controls.Input
                                label='Category'
                                value={values.category}
                            />
                            <Controls.Input
                                label='Request Quantity'
                                name='requestedQuantity'
                                type='number'
                                value={values.requestedQuantity}
                                onChange={handleInputChange}
                                error={errors.requestedQuantity}
                            />
                            <br/>
                            <Controls.Button
                                type="submit"
                                text="Submit"
                                onClick={handleItemSubmit}
                            />
                        </Grid>
                    </Grid>

                </Form>

            </Popup>
                <Toolbar>
                    <Controls.Input
                        sx={classes.searchInput}
                        label="Search"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                </Toolbar>

                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item => (
                                <StyledTableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton color='primary' onClick={() => { setValues({ ...item ,requestedQuantity:1}); setOpenItemPopup(true) }}>
                                            <SendOutlinedIcon />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
        </>
    )
}

