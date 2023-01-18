import Axios from "axios"

const KEYS = {
    employees: 'employees',
    employeeId: 'employeeId',
    loggedIn: 'loggedInEmployee'
}
const storeKeeper = {
    username: 'zeeshan',
    password: 'a',
    userType: 'storeKeeper'
}

const getStoreKeeper = () => {
    return storeKeeper
}

export const getDepartmentCollection = () => ([
    { id: '0', title: 'CS' },
    { id: '1', title: 'SE' },
    { id: '2', title: 'Cyber' },
    { id: '3', title: 'EE' },
    { id: '4', title: 'FSM' }
])

const BaseURL = "http://localhost:3001/api/v1/"
export const getDepartmentCollectionU = async (setDepartments) => {
    const response = await Axios.get(BaseURL + "departments");
    const data = response.data.data
    setDepartments(data)
}


const userTypes = [
    { id: '0', title: 'Simple User' },
    { id: '1', title: 'ReportingOfficer' },
    { id: '2', title: 'Admin' },
]

export const getUserTypesCollectionU = async (setUserTypes) => {
    const response = await Axios.get(BaseURL + "userTypes");
    const data = response.data.data
    setUserTypes(data)
}

export const getUserTypes = () => userTypes;

export const getLoggedInUser = () => {
    return JSON.parse(localStorage.getItem(KEYS.loggedIn))
};


// export function insertEmployee(data, valid, invalid) {
//     let employees = getAllEmployees();
//     let record = employees.find(x => x.email == data.email && x.userTypeId == data.userTypeId);
//     console.log("Record : ", record);
//     if (record==null) {
//         data['id'] = generateEmployeeId()
//         employees.push(data)
//         localStorage.setItem(KEYS.employees, JSON.stringify(employees))
//        valid()
//     }
//     else
//         invalid("Account already exist");
// }

export const registerEmployee = async (employeeData, valid, invalid) => {
    console.log("Privded Record : ", employeeData);
    try {
        const response = await Axios.post(BaseURL + "users", employeeData);
        console.log("Received Response: ", response)
        if (response.status == 201) {
            valid()
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Email is already in use!");
    }
}



// export function logInEmployee(data, valid, invalid) {
//     let employees = getAllEmployees();
//     let record = employees.find(x => x.email == data.email && x.userTypeId == data.userTypeId && x.password == data.password);
//     console.log("Logged in Record : ", record);
//     if (record) {
//         valid()
//         if(localStorage.getItem(KEYS.loggedIn) == null)
//             localStorage.setItem(KEYS.loggedIn, JSON.stringify([]))  

//         localStorage.setItem(KEYS.loggedIn, JSON.stringify(record))  
//     }
//     else
//         invalid("Invalid Credentials");
// }

export const logInEmployee = async (employeeData, valid, invalid) => {
    const { email, password, userTypeId } = employeeData
    try {
        const response = await Axios.get(BaseURL + "users/" + email, { params: { email, password, userTypeId } })
        console.log("Response data: ", response.data.data)
        if (response.status == 200) {
            if (localStorage.getItem(KEYS.loggedIn) == null)
                localStorage.setItem(KEYS.loggedIn, JSON.stringify([]))
            localStorage.setItem(KEYS.loggedIn, JSON.stringify(response.data.data))
            valid()
        }
        else
            invalid("Invalid Credentials");
    } catch (e) {
        invalid("Invalid Credentials");
    }
}

export function logInStoreKeeper(data, valid, invalid) {
    let storeKeeper = getStoreKeeper();
    const { username, password } = data
    if (storeKeeper.username == username && storeKeeper.password == password) {
        valid()
        if (localStorage.getItem(KEYS.loggedIn) == null)
            localStorage.setItem(KEYS.loggedIn, JSON.stringify([]))

        localStorage.setItem(KEYS.loggedIn, JSON.stringify(storeKeeper))
    }
    else
        invalid("Invalid Credentials");
}



export function updateEmployee(data) {
    let employees = getAllEmployees();
    let recordIndex = employees.findIndex(x => x.id == data.id);
    employees[recordIndex] = { ...data }
    localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function deleteEmployee(id) {
    let employees = getAllEmployees();
    employees = employees.filter(x => x.id != id)
    localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function generateEmployeeId() {
    if (localStorage.getItem(KEYS.employeeId) == null)
        localStorage.setItem(KEYS.employeeId, '0')
    var id = parseInt(localStorage.getItem(KEYS.employeeId))
    localStorage.setItem(KEYS.employeeId, (++id).toString())
    return id;
}

export function getAllEmployees() {
    if (localStorage.getItem(KEYS.employees) == null)
        localStorage.setItem(KEYS.employees, JSON.stringify([]))
    let employees = JSON.parse(localStorage.getItem(KEYS.employees));
    //map departmentID to department title
    let departments = getDepartmentCollection();
    //console.log(employees)
    return employees.map(x => ({
        ...x,
        department: departments[x.departmentId].title,
        userType: userTypes[x.userTypeId].title
    }))
}

export function getAllReportingOfficers() {
    if (localStorage.getItem(KEYS.employees) == null)
        localStorage.setItem(KEYS.employees, JSON.stringify([]))
    let employees = JSON.parse(localStorage.getItem(KEYS.employees));
    //map departmentID to department title
    let departments = getDepartmentCollection();
    //console.log(employees)
    let reportingOfficers = employees.filter(x => x.userTypeId == 1)
    return reportingOfficers.map(x => ({
        ...x,
        department: departments[x.departmentId].title,
        userType: userTypes[x.userTypeId].title
    }))
}































































































// const KEYS = {
//     employees: 'employees',
//     employeeId: 'employeeId',
//     loggedIn: 'loggedInEmployee'
// }
// const storeKeeper={
//     username:'zeeshan',
//     password:'a',
//     userType:'storeKeeper'
// }

// const getStoreKeeper=()=>{
//     return storeKeeper
// }

// export const getDepartmentCollection = () => ([
//     { id: '0', title: 'CS' },
//     { id: '1', title: 'SE' },
//     { id: '2', title: 'Cyber' },
//     { id: '3', title: 'EE' },
//     { id: '4', title: 'FSM' }
// ])


// const userTypes=[
//     { id: '0', title: 'Simple User' },
//     { id: '1', title: 'ReportingOfficer' },
//     { id: '2', title: 'Admin' },
// ]

// export const getUserTypes = () => userTypes;

// export const getLoggedInUser = () => {
//     return JSON.parse(localStorage.getItem(KEYS.loggedIn))
// };


// export function insertEmployee(data, valid, invalid) {
//     let employees = getAllEmployees();
//     let record = employees.find(x => x.email == data.email && x.userTypeId == data.userTypeId);
//     console.log("Record : ", record);
//     if (record==null) {
//         data['id'] = generateEmployeeId()
//         employees.push(data)
//         localStorage.setItem(KEYS.employees, JSON.stringify(employees))
//        valid()
//     }
//     else
//         invalid("Account already exist");
// }


// export function logInEmployee(data, valid, invalid) {
//     let employees = getAllEmployees();
//     let record = employees.find(x => x.email == data.email && x.userTypeId == data.userTypeId && x.password == data.password);
//     console.log("Logged in Record : ", record);
//     if (record) {
//         valid()
//         if(localStorage.getItem(KEYS.loggedIn) == null)
//             localStorage.setItem(KEYS.loggedIn, JSON.stringify([]))  
        
//         localStorage.setItem(KEYS.loggedIn, JSON.stringify(record))  
//     }
//     else
//         invalid("Invalid Credentials");
// }

// export function logInStoreKeeper(data, valid, invalid) {
//     let storeKeeper = getStoreKeeper();
//     const {username,password} = data
//     if(storeKeeper.username == username && storeKeeper.password==password){
//         valid()
//         if(localStorage.getItem(KEYS.loggedIn) == null)
//             localStorage.setItem(KEYS.loggedIn, JSON.stringify([]))  
        
//         localStorage.setItem(KEYS.loggedIn, JSON.stringify(storeKeeper))  
//     }
//     else
//         invalid("Invalid Credentials");
// }



// export function updateEmployee(data) {
//     let employees = getAllEmployees();
//     let recordIndex = employees.findIndex(x => x.id == data.id);
//     employees[recordIndex] = { ...data }
//     localStorage.setItem(KEYS.employees, JSON.stringify(employees));
// }

// export function deleteEmployee(id) {
//     let employees = getAllEmployees();
//     employees = employees.filter(x => x.id != id)
//     localStorage.setItem(KEYS.employees, JSON.stringify(employees));
// }

// export function generateEmployeeId() {
//     if (localStorage.getItem(KEYS.employeeId) == null)
//         localStorage.setItem(KEYS.employeeId, '0')
//     var id = parseInt(localStorage.getItem(KEYS.employeeId))
//     localStorage.setItem(KEYS.employeeId, (++id).toString())
//     return id;
// }

// export function getAllEmployees() {
//     if (localStorage.getItem(KEYS.employees) == null)
//         localStorage.setItem(KEYS.employees, JSON.stringify([]))
//     let employees = JSON.parse(localStorage.getItem(KEYS.employees));
//     //map departmentID to department title
//     let departments = getDepartmentCollection();
//     //console.log(employees)
//     return employees.map(x => ({
//         ...x,
//         department: departments[x.departmentId].title,
//         userType:  userTypes[x.userTypeId].title
//     }))
// }

// export function getAllReportingOfficers() {
//     if (localStorage.getItem(KEYS.employees) == null)
//         localStorage.setItem(KEYS.employees, JSON.stringify([]))
//     let employees = JSON.parse(localStorage.getItem(KEYS.employees));
//     //map departmentID to department title
//     let departments = getDepartmentCollection();
//     //console.log(employees)
//     let reportingOfficers=employees.filter(x=> x.userTypeId == 1)
//     return reportingOfficers.map(x => ({
//         ...x,
//         department: departments[x.departmentId].title,
//         userType:  userTypes[x.userTypeId].title
//     }))
// }
