const { getLoggedInUser } = require("./employeeService")

const getAuthorization = () => {
    return {
        authorization: "Bearer " + getLoggedInUser().token
    }
}
module.exports = getAuthorization