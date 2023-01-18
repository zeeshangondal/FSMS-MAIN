const StatusCodes=require("http-status-codes");
const { CustomAPIError } = require("./CustomAPIError");


class UnauthenticatedRequestError extends CustomAPIError{
    constructor(message){
        super(message,StatusCodes.UNAUTHORIZED);
    }
}

module.exports=UnauthenticatedRequestError;