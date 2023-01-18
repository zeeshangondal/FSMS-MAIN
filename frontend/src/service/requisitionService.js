import { getAllEmployees, getAllReportingOfficers, getLoggedInUser } from "./employeeService";

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
    
}
export const getInitialRequisitionValues = ()=> initialRequisitionValues

// const attachUserDataToRequisition=(requisitionItems)=>{
//     const user=getLoggedInUser()
//     const data={
//         ...initialRequisitionValues,
//         name:user.username,
//         requestedDate: new Date(),
//         departmentId:user.departmentId
//     }
//     const requisitionData={
//         items:requisitionItems.items,
//         ...data
//     }
//     return requisitionData
//}

export function     insertRequisition(data) {
    let requisitions= getAllRequisitions();
    data.id = generateRequisitionId()    
    requisitions.push(data)
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions))
}


export function updateRequisition(data) {
    let requisitions = getAllRequisitions();
    let recordIndex = requisitions.findIndex(x => x.id == data.id);
    requisitions[recordIndex] = { ...data }
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions));
}

export function deleteRequisition(id) {
    let requisitions= getAllRequisitions();
    requisitions= requisitions.filter(x => x.id != id)
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions));
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
