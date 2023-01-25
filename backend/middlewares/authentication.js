const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
require('dotenv').config();


const authenticateUser = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication failed');
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id,username, designation, email , phoneNumber, departmentId,userTypeId, department, usertype} = decoded
    req.user = { id,username, designation, email , phoneNumber, departmentId,userTypeId, department, usertype}
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication failed');
  }
};

module.exports = authenticateUser;
