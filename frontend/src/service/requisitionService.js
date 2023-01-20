import { getAllEmployees, getAllReportingOfficers, getLoggedInUser } from "./employeeService";
import Axios from "axios"

const KEYS = {
    requisitions: 'requisitions',
    requisitionId: 'requisitionId'
}

export const getDepartmentCollection = () => ([
    { id: '0', title: 'CS' },
    { id: '1', title: 'SE' },
    { id: '2', title: 'Cyber' },
    { id: '3', title: 'EE' },
    { id: '4', title: 'FSM' }    
])

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

export function insertRequisition(data) {
    let requisitions= getAllRequisitions();
    data.id = generateRequisitionId()    
    requisitions.push(data)
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions))
}

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



export function updateRequisition(data) {
    let requisitions = getAllRequisitions();
    let recordIndex = requisitions.findIndex(x => x.id == data.id);
    requisitions[recordIndex] = { ...data }
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions));
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


export function generateRequisitionId() {
    if (localStorage.getItem(KEYS.requisitionId) == null)
        localStorage.setItem(KEYS.requisitionId, '0')
    var id = parseInt(localStorage.getItem(KEYS.requisitionId))
    localStorage.setItem(KEYS.requisitionId, (++id).toString())
    return id;
}

export function getAllRequisitions() {
    if (localStorage.getItem(KEYS.requisitions) == null)
        localStorage.setItem(KEYS.requisitions, JSON.stringify([]))
    let requisitionForms = JSON.parse(localStorage.getItem(KEYS.requisitions));
    //map departmentID to department title
    let departments = getDepartmentCollection();
    return requisitionForms.map(x => ({
        ...x,
        department: departments[x.departmentId].title
    }))
}

export const getAllRequisitionsU=async(setRequisitions)=> {
    const response = await Axios.get(BaseURL + "");
    const data = response.data.data
    console.log(data)
    setRequisitions(data)
}


export function getAllRequisitionsOfLoggedIn() {
    if (localStorage.getItem(KEYS.requisitions) == null)
        localStorage.setItem(KEYS.requisitions, JSON.stringify([]))
    let requisitionForms = JSON.parse(localStorage.getItem(KEYS.requisitions));
    let requisitions=requisitionForms.filter( x=> x.email == getLoggedInUser().email)
    //map departmentID to department title
    let departments = getDepartmentCollection();
    return requisitions.map(x => ({
        ...x,
        department: departments[x.departmentId].title
    }))
}
export const getAllRequisitionsOfLoggedInU=async(setRequisitions)=> {
    const {id,email}=getLoggedInUser();
    const response = await Axios.get(BaseURL + "requisitions/" + 'loggedInUser', { params: { id, email } })
    const data=response.data.data
    console.log("Logged in requisitions: ",data)
    setRequisitions(data)
}



export function getAllRequisitionsOfDepartment() {
    if (localStorage.getItem(KEYS.requisitions) == null)
        localStorage.setItem(KEYS.requisitions, JSON.stringify([]))
    let requisitionForms = JSON.parse(localStorage.getItem(KEYS.requisitions));

    let requisitions=requisitionForms.filter( x=> x.departmentId == getLoggedInUser().departmentId)
    //map departmentID to department title
    let departments = getDepartmentCollection();
    return requisitions.map(x => ({
        ...x,
        department: departments[x.departmentId].title
    }))
}

export const getAllRequisitionsOfDepartmentU=async(setRequisitions)=> {
    const {id,email,departmentId}=getLoggedInUser();
    const response = await Axios.get(BaseURL + "requisitions/" + "department", { params: { departmentId } })
    const data=response.data.data
    console.log(data)
    setRequisitions(data)
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

export function getAllRequisitionsApprovedByReportingOfficer() {
    if (localStorage.getItem(KEYS.requisitions) == null)
        localStorage.setItem(KEYS.requisitions, JSON.stringify([]))
    let requisitionForms = JSON.parse(localStorage.getItem(KEYS.requisitions));

    let requisitions=requisitionForms.filter( x=> x.status >=20)
    //map departmentID to department title
    let departments = getDepartmentCollection();
    const reportingOfficers=getAllReportingOfficers()

    return requisitions.map(x => {
        const reportingOfficer=reportingOfficers.filter(ro=> ro.departmentId == x.departmentId)
        const requisition={
            ...x,
            department: departments[x.departmentId].title,
            reportingOfficer: reportingOfficer[0]
        }
        return requisition
    })
}

export const getAllRequisitionsApprovedByReportingOfficerU=async(setRequisitions)=> {
    const response = await Axios.get(BaseURL + "requisitions/" + "approvedByReportingOfficer")
    const data=response.data.data
    console.log(data)
    setRequisitions(data)
}
