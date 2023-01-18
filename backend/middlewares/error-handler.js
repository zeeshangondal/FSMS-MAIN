const { CustomAPIError } = require('../errors/CustomAPIError')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({status:"failed", msg: err.message })
  }
  if(err.sqlMessage){
    return res.status(400).json({status:"failed", msg:err.sqlMessage  })
  }
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware
