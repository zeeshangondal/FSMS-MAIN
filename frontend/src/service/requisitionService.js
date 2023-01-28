import { getLoggedInUser } from "./employeeService";
import Axios from "axios"
import getAuthorization from "./headers";



const initialRequisitionValues = {
    id: 0,
    name: '', designation: '', departmentId: '', email: '',
    requestedDate: new Date(),
    approvedByReportingOfficerDate: '',
    status: 0,
    reportingOfficerRemarks: 'Good to go',
    storeKeeperRemarks: 'Good to go'
}


const BaseURL = "http://localhost:3001/api/v1/"

export const getInitialRequisitionValues = () => initialRequisitionValues


export const insertRequisitionU = async (requisitionData, valid, invalid) => {
    try {
        const response = await Axios.post(BaseURL + "requisitions", {requisitionData},
        {
            headers: getAuthorization()
        }
        );
        if (response.status == 201) {
            valid("Requisition added successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        console.log(e)
        invalid("Unexpected Error occured!")
    }
}



export const updateRequisitionU = async (updatedData, valid, invalid) => {
    try {
        let data = { id: updatedData.id, items: updatedData.items }
        data.query = "updateRequisition"
        const response = await Axios.patch(BaseURL + "requisitions/" + data.id, {data},
        {
            headers: getAuthorization()
        });
        if (response.status == 201) {
            valid("Requisition Updated Successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be updated for now!");
    }
}

export const deleteRequisitionU = async (requisitionId, valid, invalid, setRecords) => {
    try {
        const response = await Axios.delete(BaseURL + "requisitions/" + requisitionId,
        {
            headers: getAuthorization()
        });
        if (response.status == 200) {
            valid("Requisition Deleted Successfully")
            setRecords(prevRecords => {
                const afterDeletion = prevRecords.filter(req => req.id != requisitionId)
                return afterDeletion
            })
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be deleted for now!");
    }
}



export const getAllRequisitionsU = async (setRequisitions) => {
    const response = await Axios.get(BaseURL + "");
    const data = response.data.data
    console.log(data)
    setRequisitions(data)
}

export const getAllCompletedRequisitionsU = async (setRequisitions) => {
    console.log('hello')
    setRequisitions(
        (await getAllRequisitionsOfLoggedInU(setRequisitions)).filter(
            requisition => requisition.status === 100
        )
    )
}

export const getAllUnCompletedRequisitionsU = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsOfLoggedInU(setRequisitions)).filter(
            requisition => requisition.status < 100
        )
    )
}

export const getAllRequisitionsOfLoggedInU = async (setRequisitions) => {
    
    const response = await Axios.get(BaseURL + "requisitions/" + 'loggedInUser', { headers: getAuthorization() })
    const data = response.data.data
    console.log("Logged in requisitions: ", data)
    setRequisitions(data)
    return data;
}

export const getAllApprovedRequisitionsD = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsOfDepartmentU(setRequisitions)).filter(
            requisition => requisition.status > 32 && requisition.status<66
        )
    )
}

export const getAllCompletedRequisitionsD = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsOfDepartmentU(setRequisitions)).filter(
            requisition => requisition.status > 65
        )
    )
}

export const getAllUnCompletedRequisitionsD = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsOfDepartmentU(setRequisitions)).filter(
            requisition => requisition.status < 32
        )
    )
}

export const getAllRequisitionsOfDepartmentU = async (setRequisitions) => {
    const { id, email, departmentId } = getLoggedInUser();
    const response = await Axios.get(BaseURL + "requisitions/" + "department", {
        params: {
            departmentId
        },
        headers: getAuthorization()
    })
    const data = response.data.data
    setRequisitions(data)
    return data;
}
export const sendReportingOfficerApproval = async (approvalData, valid, invalid) => {
    try {
        let data=approvalData
        data.query = "reportingOfficerApproval"
        const response = await Axios.patch(BaseURL + "requisitions/" + data.id, {data},
        {
            headers: getAuthorization(),
        });
        if (response.status == 201) {
            valid("Requisition Approved Successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be approved for now!");
    }
}

export const sendStoreKeeperDeliveryApproval = async (id, valid, invalid) => {
    try {
        let data = { id: id }
        data.query = "storeKeeperDeliveryApproval"
        const response = await Axios.patch(BaseURL + "requisitions/" + id, {data},
        {
            headers: getAuthorization(),
        });
        if (response.status == 201) {
            valid("Requisition Delivered Successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be delivered for now!");
    }
}


export const sendStoreKeeperApprovalWithIssuedQTA = async (data, valid, invalid) => {
    try {
        data.query = "storeKeeperApproval"
        const response = await Axios.patch(BaseURL + "requisitions/" + data.id, {data},
        {
            headers: getAuthorization(),
        });
        if (response.status == 201) {
            valid("Requisition Approved Successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be approved for now!");
    }
}


export const getAllRequisitionsNotApprovedByStoreKeeperU = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsApprovedByReportingOfficerU(setRequisitions)).filter(
            requisition => requisition.status < 66
        )
    )
}

export const getAllRequisitionsApprovedByStoreKeeperU = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsApprovedByReportingOfficerU(setRequisitions)).filter(
            requisition => requisition.status === 66
        )
    )
}

export const getAllRequisitionsDeliveredByStoreKeeperU = async (setRequisitions) => {
    setRequisitions(
        (await getAllRequisitionsApprovedByReportingOfficerU(setRequisitions)).filter(
            requisition => requisition.status === 100
        )
    )
}
export const getAllRequisitionsApprovedByReportingOfficerU = async (setRequisitions) => {
    const response = await Axios.get(BaseURL + "requisitions/" + "approvedByReportingOfficer" , 
    {
        headers: getAuthorization(),
    })
    const data = response.data.data
    setRequisitions(data)
    return data;
}
