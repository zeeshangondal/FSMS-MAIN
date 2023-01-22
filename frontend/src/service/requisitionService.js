import {  getLoggedInUser } from "./employeeService";
import Axios from "axios"

const KEYS = {
    requisitions: 'requisitions',
    requisitionId: 'requisitionId'
}


const initialRequisitionValues = {
    id: 0,
    name: '', designation: '', departmentId: '', email: '',
    requestedDate: new Date(),
    approvedByReportingOfficerDate:'',
    status: 0,
    reportingOfficerRemarks:'Good to go',
    storeKeeperRemarks:'Good to go'
}


const BaseURL = "http://localhost:3001/api/v1/"

export const getInitialRequisitionValues = ()=> initialRequisitionValues


export const insertRequisitionU=async(requisitionData,valid,invalid)=> {
    console.log("Inserting Requisition: ",requisitionData)
    try {
        const response = await Axios.post(BaseURL + "requisitions",requisitionData );
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



export const updateRequisitionU=async(updatedData,valid,invalid)=>{
    try {
        let requisitionData={id: updatedData.id, items:updatedData.items}
        requisitionData.query= "updateRequisition"        
        const response = await Axios.patch(BaseURL + "requisitions/"+requisitionData.id, requisitionData);
        if (response.status == 201) {
                valid("Requisition Updated Successfully")
        }
        else
                invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be updated for now!");
    }
}

export const deleteRequisitionU=async(requisitionId,valid,invalid,setRecords)=>{
    try {
        const response = await Axios.delete(BaseURL + "requisitions/"+requisitionId);
        if (response.status == 200) {
                valid("Requisition Deleted Successfully")
                setRecords(prevRecords=>{
                    const afterDeletion= prevRecords.filter(req=> req.id != requisitionId)
                    return afterDeletion
                })
        }
        else
                invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be deleted for now!");
    }
}



export const getAllRequisitionsU=async(setRequisitions)=> {
    const response = await Axios.get(BaseURL + "");
    const data = response.data.data
    console.log(data)
    setRequisitions(data)
}

export const getAllCompletedRequisitionsU=async(setRequisitions)=>{
    console.log('hello')
    setRequisitions(
        (await getAllRequisitionsOfLoggedInU(setRequisitions)).filter(
            requisition => requisition.status===100
        )
    )
}

export const getAllUnCompletedRequisitionsU=async(setRequisitions)=>{
    setRequisitions(
        (await getAllRequisitionsOfLoggedInU(setRequisitions)).filter(
            requisition => requisition.status<100
        )
    )
}

export const getAllRequisitionsOfLoggedInU=async(setRequisitions)=> {
    const {id,email}=getLoggedInUser();
    const response = await Axios.get(BaseURL + "requisitions/" + 'loggedInUser', { params: { id, email } })
    const data=response.data.data
    console.log("Logged in requisitions: ",data)
    setRequisitions(data)
    return data;
}

export const getAllCompletedRequisitionsD=async(setRequisitions)=>{
    console.log('hello')
    setRequisitions(
        (await getAllRequisitionsOfDepartmentU(setRequisitions)).filter(
            requisition => requisition.status>=33
        )
    )
}

export const getAllUnCompletedRequisitionsD=async(setRequisitions)=>{
    setRequisitions(
        (await getAllRequisitionsOfDepartmentU(setRequisitions)).filter(
            requisition => requisition.status<33
        )
    )
}

export const getAllRequisitionsOfDepartmentU=async(setRequisitions)=> {
    const {id,email,departmentId}=getLoggedInUser();
    const response = await Axios.get(BaseURL + "requisitions/" + "department", { params: { departmentId } })
    const data=response.data.data
    console.log(data)
    setRequisitions(data)
    return data;
}
export const sendReportingOfficerApproval=async(approvalData,valid,invalid)=>{
    try {
        approvalData.query= "reportingOfficerApproval"        
        const response = await Axios.patch(BaseURL + "requisitions/"+approvalData.id, approvalData);
        if (response.status == 201) {
                valid("Requisition Approved Successfully")
        }
        else
                invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be approved for now!");
    }
}

export const sendStoreKeeperDeliveryApproval=async(id,valid,invalid)=>{
    try {
        let approvalData={id:id}
        approvalData.query= "storeKeeperDeliveryApproval"        
        const response = await Axios.patch(BaseURL + "requisitions/"+id,approvalData);
        if (response.status == 201) {
                valid("Requisition Delivered Successfully")
        }
        else
                invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be delivered for now!");
    }
}


export const sendStoreKeeperApprovalWithIssuedQTA=async(approvalData,valid,invalid)=>{
    try {
        approvalData.query= "storeKeeperApproval"        
        const response = await Axios.patch(BaseURL + "requisitions/"+approvalData.id, approvalData);
        if (response.status == 201) {
                valid("Requisition Approved Successfully")
        }
        else
                invalid(response.data.msg);
    } catch (e) {
        invalid("Requisition cannot be approved for now!");
    }
}

export const getAllRequisitionsApprovedByReportingOfficerU=async(setRequisitions)=> {
    const response = await Axios.get(BaseURL + "requisitions/" + "approvedByReportingOfficer")
    const data=response.data.data
    console.log(data)
    setRequisitions(data)
}
