const DB = require("../database/db")
const asyncWrapper = require("../middlewares/asyncWrapper")
const { createCustomAPIError } = require('../errors/CustomAPIError')
const StatusCodes=require("http-status-codes");
const jwt=require("jsonwebtoken");



const getAllUsers = asyncWrapper(async (req, res, next) => {
    const sql = "SELECT Users.id,username,designation,email,phoneNumber,departmentId, Dep.title AS department, userTypeId, UserT.title AS usertype FROM Users INNER JOIN Department AS Dep ON departmentId=Dep.id  INNER JOIN Usertype AS UserT ON usertypeId=UserT.id"
    result = await DB.execQuery(sql)
    res.status(200).json({ status: "success", data: result })
})



//serve as login
const getSingleUser = asyncWrapper(async (req, res, next) => {
    console.log("Got ",req.query)
    const { email,password,userTypeId } = req.query
    let sql=""
    if(userTypeId==2)
        sql=`SELECT Users.id,username,designation,email,phoneNumber,userTypeId, UserT.title AS usertype FROM Users INNER JOIN Usertype AS UserT ON usertypeId=UserT.id WHERE email='${email}' AND password='${password}' AND userTypeId='${userTypeId}'`
    else
        sql = `SELECT Users.id,username,designation,email,phoneNumber,departmentId,userTypeId, Dep.title AS department, UserT.title AS usertype FROM Users INNER JOIN Department AS Dep ON departmentId=Dep.id  INNER JOIN Usertype AS UserT ON usertypeId=UserT.id WHERE email='${email}' AND password='${password}' AND userTypeId='${userTypeId}'`
    result = await DB.execQuery(sql)
    if (result.length == 0) {
        return next(createCustomAPIError("Invalid Credentials: ", StatusCodes.UNAUTHORIZED))
    }
    let user=result[0]
    user.token=generateJWT(user)
    return res.status(200).json({ status: "success", data: user })
})
const generateJWT=(user)=>{
    const {id,username, designation, email , phoneNumber, departmentId,userTypeId, department, usertype}= user;
    const date=new Date()
    const token=jwt.sign({date, id,username, designation, email , phoneNumber, departmentId,userTypeId, department, usertype},process.env.JWT_SECRET,{expiresIn:'1d'})
    return token
}

const registerNewUser = asyncWrapper(async (req, res, next) => {
    console.log(req.body)
    let { username, designation, phoneNumber, email, password, departmentId, userTypeId } = req.body
    let sql = `INSERT INTO Users(username,designation,phoneNumber,email,password,departmentId,userTypeId) VALUES('${username}','${designation}', '${phoneNumber}', '${email}', '${password}',${departmentId}, ${userTypeId})`
    try {
        await DB.execQuery(sql)
    }catch(e){
        return next(createCustomAPIError("Invalid inputs!. OR User Already exists with given email: " + email,StatusCodes.BAD_REQUEST))
    }
    result = await DB.execQuery(`SELECT Users.id,username,designation,email,phoneNumber,departmentId, Dep.title AS department, userTypeId, UserT.title AS usertype FROM Users INNER JOIN Department AS Dep ON departmentId=Dep.id  INNER JOIN Usertype AS UserT ON usertypeId=UserT.id WHERE email='${email}'`)
    if(userTypeId==1){
        //reporting officer
        sql=`UPDATE Department SET reportingOfficerId=${result[0].id} WHERE id=${departmentId}`
        await DB.execQuery(sql)
    }
    res.status(201).json({ status: "success", data: result[0] })
})

const updateItem = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const { name, price, quantity, packaging_type, category_id } = req.body
    sql = `UPDATE items SET name='${name}' , price=${price}, quantity =${quantity}, packaging_type='${packaging_type}', category_id=${category_id} WHERE id=${id}`
    await DB.execQuery(sql)
    result = await DB.execQuery(`SELECT * FROM Items where id='${id}'`)
    res.status(201).json({ status: "success", data: result[0] })
})


const deleteItem = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    result = await DB.execQuery(`SELECT * FROM Items where id=${id}`)
    if (result.length == 0) {
        return next(createCustomError("No Item exist with ID: " + id, 404))
    }
    sql = `DELETE FROM Items WHERE id=${id}`
    await DB.execQuery(sql)
    res.status(200).json({ status: "success", data: result[0] })
})


module.exports = {
    getAllUsers,
    getSingleUser,
    registerNewUser,
    deleteItem,
    updateItem
}
