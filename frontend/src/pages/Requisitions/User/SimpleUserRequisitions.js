import React, {useEffect, useState} from 'react'
import {
    TableBody,
    TableCell,
    InputAdornment,
    LinearProgress,
    Typography
} from '@mui/material';
import useTable from "../../../components/useTable";
import * as requisitionService from "../../../service/requisitionService";
import * as employeeService from "../../../service/employeeService";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Controls from "../../../components/controls/Controls";
import { EditOutlined, Search } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Notification from '../../../components/Notification';
import ConfirmDialog from '../../../components/ConfirmDialog';
import StyledTableRow from "../../../components/StyledTableRow";
import HoverPopover from "../../../components/controls/HoverPopover";
import {useNavigate} from "react-router";
import {useTheme} from "@mui/material/styles";
import Input from "../../../components/controls/Input";
import Button from "../../../components/controls/Button";

const styles = {
  pageContent: {
    margin: (theme)=> theme.spacing(5),
    padding: (theme)=> theme.spacing(3)
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

export default function Requisitions(props) {
  const classes = styles;
  const [records, setRecords] = React.useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const [viewOnly,setViewOnly] = useState(false);
  const navigate = useNavigate();
  const [searchDate, setSearchDate] = useState(new Date());

  let sr=1

    const handleDateSearch = newValue => {
      let target="";
      if(newValue!=="") {
          setSearchDate(newValue);
          target = (new Date(newValue.target.value)).toLocaleDateString()
      }
        setFilterFn({
            fn: items => {
                if (target === "")
                    return items;
                else {
                    return items.filter(x => (new Date(x.requestedDate)).toLocaleDateString() === (target))
                }
            }
        })
    }

    const headCells = [
        { id: 'sr', label: 'Sr.' },
        { id: 'date', label: 'Date' , search:
            <div>
                <Controls.DatePicker
                name="verifiedDate"
                label="Date"
                value={searchDate}
                onChange={handleDateSearch}
                />
                <Button sx={{display:'block'}} text="Reset" onClick={()=>handleDateSearch("")}/>
            </div>
        },
        { id: 'time', label: 'Time' },
        { id: 'status', label: 'Status' },
        { id: 'actions', label: 'Actions', disableSorting: true, align: 'right' }
    ]

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn)

    useEffect(()=>{
    // requisitionService.getAllRequisitionsOfLoggedInU(setRecords)
      props.update(setRecords);
  },[0])

  const getStatusText = (status)=>{
    if(status===0) return 'Pending for approval of Reporting Officer'
    else if(status===33) return 'Pending for approval of Store Keeper'
    else if(status===66) return 'Pending for delivery'
    else return ''
  }
    const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value === "")
          return items;
        else {
            console.log(items)
            return items;
            // return items.filter(x => x.fullName.toLowerCase().includes(target.value))
        }
      }
    })
  }
  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    requisitionService.deleteRequisitionU(id,valid,invalid,setRecords)

  }

    const invalid = (msg = 'Invalid!') => {
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

  const openInAddRequisitionPage = (requisitionForm) => {
    setViewOnly(false)
    gotoAddNewRequisitionPage(requisitionForm,false)
  }

  const openInPreviewRequisitionPage = (requisitionForm) => {
    setViewOnly(true)
    gotoAddNewRequisitionPage(requisitionForm,true)
  }
  const gotoAddNewRequisitionPage = (requisitionForm,viewOnlyStatus) => {
      let isHod = false;
      navigate('/requisition/view', {
          state: {
              isHod: isHod,
              viewOnly: viewOnlyStatus,
              recordForEdit: requisitionForm,
          }
      })
  }

  return (
    <div>
      {/*<h2>Simple User</h2>*/}
      {/*<h4>{employeeService.getLoggedInUser().department } , {employeeService.getLoggedInUser().username}</h4>*/}
      <>
          <div style={classes.toolBar}>
              <Typography variant="h4" noWrap  component="div">
                  Requisitions
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
                  <Controls.Button
                      text="Add New"
                      variant="outlined"
                      size="medium"
                      startIcon={<AddIcon />}
                      onClick={() => { gotoAddNewRequisitionPage();}}
                  />
              </div>
          </div>

            <TblContainer>
              <TblHead />
              <TableBody>
                {
                  recordsAfterPagingAndSorting().map(requisitionForm => (
                    <StyledTableRow key={requisitionForm.id}>
                      <TableCell>{sr++}</TableCell>

                        <TableCell>{(new Date(requisitionForm.requestedDate)).toLocaleDateString()}</TableCell>
                        <TableCell>{(new Date(requisitionForm.requestedDate)).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <HoverPopover  text={getStatusText(requisitionForm.status)} >
                          <LinearProgress variant="determinate" value={requisitionForm.status}/>
                        </HoverPopover>
                      </TableCell>
                      <TableCell  align='right'>
                        {
                          requisitionForm.status===0 ?
                              <Controls.ActionButton color='primary' onClick={() => openInAddRequisitionPage(requisitionForm)}>
                                <EditOutlined />
                              </Controls.ActionButton> :
                              <Controls.ActionButton color='primary' onClick={() => openInPreviewRequisitionPage(requisitionForm)}>
                                <VisibilityIcon/>
                              </Controls.ActionButton>
                        }

                        <Controls.ActionButton color='secondary' disabled={requisitionForm.status !== 0}
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure to delete this record?',
                              subTitle: "You can't undo this operation",
                              onConfirm: () => { onDelete(requisitionForm.id) }
                            })
                          }}
                        >
                          <CloseIcon />
                        </Controls.ActionButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </TblContainer>
            <TblPagination />
      </>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  )
}
