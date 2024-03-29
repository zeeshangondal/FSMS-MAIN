import React, { useState } from 'react'
import * as employeeService from "../../service/employeeService";
import SimpleUserRequisition from './User/SimpleUserRequisitions'
import ReportingOfficerRequisition from './ReportingOfficer/ReportingOfficerRequisitions'

import StoreKeeperRequisition from './StoreKeeper/StoreKeeperRequisitions'
import RequisitionTabs from "./User/SimpleUserRequisitionTabs";
import SimpleUserRequisitionTabs from "./User/SimpleUserRequisitionTabs";
import ReportingOfficerRequisitionTabs from "./ReportingOfficer/ReportingOfficerRequisitionTabs";
import StoreKeeperRequisitionTabs from "./StoreKeeper/StoreKeeperRequisitionTabs";
import { getURL } from '../../service/headers';

export default function Requisitions() {
  const [loggedInUser, setLoggedInUser] = React.useState({})
  const getLoggedInUser = () => {
    const loggedInUserInLocalStorage = employeeService.getLoggedInUser();
    setLoggedInUser(loggedInUserInLocalStorage)
  }

  React.useEffect(() => {
    getLoggedInUser()
  }, [0])


  const getUserRequisition = () => {
    if(loggedInUser==null){
      window.location.href=getURL()+"login"
      return
    }
    switch (loggedInUser.userTypeId) {
      case 0: {
        return <SimpleUserRequisitionTabs />
      }
      case 1: {
        return <ReportingOfficerRequisitionTabs />
      }
      case 2: {
        return <StoreKeeperRequisitionTabs />
      }
    }
  }
  return (
    <div>
      {
        getUserRequisition()
      }
    </div>
  )
}
