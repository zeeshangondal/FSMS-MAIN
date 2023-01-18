import React, { useState } from 'react'
import * as employeeService from "../../service/employeeService";
import SimpleUserRequisition from './User/SimpleUserRequisitions'
import ReportingOfficerRequisition from './ReportingOfficer/ReportingOfficerRequisitions'

import StoreKeeperRequisition from './StoreKeeper/StoreKeeperRequisitions'

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
    console.log(loggedInUser)
    if (loggedInUser.userType == 'storeKeeper')
      return <StoreKeeperRequisition />
    else
      switch (loggedInUser.userTypeId) {
        case '0': {
          return <SimpleUserRequisition />
        }
        case '1': {
          return <ReportingOfficerRequisition />
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
