const { getLoggedInUser } = require("./employeeService")

const getHeaders=()=>{
    return {
        headers:{
            authorization: "Bearer "+getLoggedInUser().token
        }
    }
}
module.exports=getHeaders