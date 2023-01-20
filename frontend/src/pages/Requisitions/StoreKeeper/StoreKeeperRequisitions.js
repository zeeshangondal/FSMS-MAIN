import React, {useEffect, useState} from 'react'
import { Paper, TableBody, TableCell, Toolbar, InputAdornment, LinearProgress } from '@mui/material';
import useTable from "../../../components/useTable";
import * as requisitionService from "../../../service/requisitionService";
import * as employeeService from "../../../service/employeeService";
import Controls from "../../../components/controls/Controls";
import {  Search } from "@mui/icons-material";
import Notification from '../../../components/Notification';
import ConfirmDialog from '../../../components/ConfirmDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StyledTableRow from "../../../components/StyledTableRow";
import {useNavigate} from "react-router";


const headCells = [
  { id: 'sr', label: 'Sr.' },
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
  { id: 'department', label: 'Department', disableSorting: true },
  { id: 'reportingOfficer', label: 'Reporting Officer', disableSorting: true },
  
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', disableSorting: true },

]

const styles = {
  pageContent: {
    margin: (theme) => theme.spacing(5),
    padding: (theme) => theme.spacing(3)
  },
  searchInput: {
    width: '75%'
  },
  toolBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }
}

export default function Requisitions() {
  const classes = styles;
  const [records, setRecords] = React.useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const navigate = useNavigate();

  let sr=1;
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn)


  useEffect(()=>{
    requisitionService.getAllRequisitionsApprovedByReportingOfficerU(setRecords)
  },[0])

  console.log(records)
  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value === "")
          return items;
        else{
          return items.filter(x => x.name.toLowerCase().includes(target.value))
        }
      }
    })
  }


  const openInViewRequisitionPage = (requisitionForm) => {
    gotoViewRequisitionPage(requisitionForm)
  }
  const gotoViewRequisitionPage = (requisitionForm) => {
    navigate('/requisition/handle',{
      state: {
        recordForEdit: requisitionForm,
      }
    })
  }

  return (
    <div>
      <h2>StoreKeeper</h2>
      <h4>{employeeService.getLoggedInUser().username}</h4>
        <>
          <Paper sx={classes.pageContent}>
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
                  recordsAfterPagingAndSorting().map(requisitionForm => (
                    <StyledTableRow key={requisitionForm.id}>
                      <TableCell>{sr++}</TableCell>
                      <TableCell>{requisitionForm.username}</TableCell>
                      <TableCell>{requisitionForm.requestedDate}</TableCell>
                      <TableCell>{requisitionForm.department}</TableCell>
                      <TableCell>{requisitionForm.reportingOfficer}</TableCell>
                      <TableCell>
                        <LinearProgress variant="determinate" value={requisitionForm.status} />
                      </TableCell>
                      <TableCell>
                        <Controls.ActionButton color='primary' onClick={() => openInViewRequisitionPage(requisitionForm)}>
                          <VisibilityIcon />
                        </Controls.ActionButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </TblContainer>
            <TblPagination />
          </Paper>
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
