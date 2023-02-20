import React, {useEffect, useState} from 'react'
import {Paper, TableBody, TableCell, Toolbar, InputAdornment, LinearProgress, Typography} from '@mui/material';
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
import Input from "../../../components/controls/Input";
import Button from "../../../components/controls/Button";
import Select from "../../../components/controls/Select";

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
  const [searchDate, setSearchDate] = useState(new Date());
  const [searchDep, setSearchDep] = useState(0);
  const [departments,setDepartments] = React.useState([])
  const navigate = useNavigate();

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

  const handleDepSearch = newValue => {
    if(newValue!==-1)
      setSearchDep(newValue.target.value)
    else
      setSearchDep(0);
    setFilterFn({
      fn: items => {
        if (newValue === -1)
          return items;
        else {
          return items.filter(x => x.department===(departments.find(dep=>dep.id===newValue.target.value)).title)
        }
      }
    })
  }

  const headCells = [
    { id: 'sr', label: 'Sr.' },
    { id: 'name', label: 'Name' },
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
    { id: 'department', label: 'Department', disableSorting: true, search:
      <div>
          <Controls.Select
              name="departmentId"
              sx={{width:'300px'}}
              label="Department"
              value={searchDep}
              onChange={handleDepSearch}
              options={departments}
          />
          <Button sx={{display:'block'}} text="Reset" onClick={()=>handleDepSearch(-1)}/>
      </div>
    },
    { id: 'reportingOfficer', label: 'Reporting Officer', disableSorting: true },

    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions', disableSorting: true , align: 'right'},

  ]

  let sr=1;
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn)


  useEffect(()=>{
    employeeService.getDepartmentCollectionU(setDepartments)
    props.update(setRecords);
  },[0])

  console.log(records)
  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value === "")
          return items;
        else
          return items.filter(x => x.username.toLowerCase().includes(target.value))
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
            </div>
          </div>

            <TblContainer>
              <TblHead />
              <TableBody>
                {
                  recordsAfterPagingAndSorting().map(requisitionForm => (
                    <StyledTableRow key={requisitionForm.id}>
                      <TableCell>{sr++}</TableCell>
                      <TableCell>{requisitionForm.username}</TableCell>

                      <TableCell>{(new Date(requisitionForm.requestedDate)).toLocaleDateString()}</TableCell>
                      <TableCell>{(new Date(requisitionForm.requestedDate)).toLocaleTimeString()}</TableCell>
                      <TableCell>{requisitionForm.department}</TableCell>
                      <TableCell>{requisitionForm.reportingOfficer}</TableCell>
                      <TableCell>
                        <LinearProgress variant="determinate" value={requisitionForm.status} />
                      </TableCell>
                      <TableCell align='right'>
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
