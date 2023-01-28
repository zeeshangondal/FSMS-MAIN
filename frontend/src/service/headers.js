const { getLoggedInUser } = require("./employeeService")

export const getAuthorization = () => {
    return {
        authorization: "Bearer " + getLoggedInUser().token
    }
}
export const getURL = () => {
    return("http://localhost:3000/")
}
