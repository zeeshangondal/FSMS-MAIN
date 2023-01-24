const DB = require("../database/db")
const asyncWrapper = require("../middlewares/asyncWrapper")
const { createCustomAPIError } = require('../errors/CustomAPIError')



const SQL={
    getAllItems: "SELECT It.id, It.name, It.quantity, It.packagingId , It.categoryId, Pack.title AS packaging, Cat.title as category FROM Items AS It INNER JOIN Packaging as Pack ON It.packagingId=Pack.id INNER JOIN Category as Cat ON It.categoryId=Cat.id",
}

const getAllItems = asyncWrapper(async (req, res, next) => {
    const sql=SQL.getAllItems
    result = await DB.execQuery(sql)
    res.status(200).json({ status: "success", data: result.reverse() })
})

const getSingleItem = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const sql=SQL.getAllItems+" WHERE It.id="+id
    result = await DB.execQuery(sql)
    if(result.length==0){
        return next(createCustomAPIError("No Item exist with ID: "+id,404))
    }
    res.status(200).json({ status: "success", data: result })
})

const createNewItem = asyncWrapper(async (req, res, next) => {
    if(req.user.userTypeId!=2){
        throw new UnauthenticatedError("Unauthorized add item. Only Store keeper is authorized to add new item");
    }
    let { name,quantity,packagingId,categoryId } = req.body.itemData    
    let sql = `INSERT INTO items(name,quantity,packagingId,categoryId ) VALUES('${name}',${quantity}, ${packagingId}, ${categoryId})`
    await DB.execQuery(sql)
    sql=SQL.getAllItems+" WHERE It.name="+`'${name}'`;
    result = await DB.execQuery(sql)
    res.status(201).json({ status: "success", data: result[0] })
})

const updateItem = asyncWrapper(async (req, res, next) => {
    if(req.user.userTypeId!=2){
        throw new UnauthenticatedError("Unauthorized removal of item. Only Store keeper is authorized");
    }
    const { id } = req.params
    const { name,quantity,packagingId,categoryId } = req.body.itemData
    let sql = `UPDATE items SET name='${name}', quantity =${quantity}, packagingId='${packagingId}', categoryId=${categoryId} WHERE id=${id}`
    await DB.execQuery(sql)
    sql=SQL.getAllItems+" WHERE It.id="+`${id}`;
    result = await DB.execQuery(sql)
    res.status(201).json({ status: "success", data: result[0] })
})


const deleteItem = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    result = await DB.execQuery(`SELECT * FROM Items where id=${id}`)
    if(result.length==0){
        return next(createCustomAPIError("No Item exist with ID: "+id,404))
    }
    sql = `DELETE FROM Items WHERE id=${id}`
    await DB.execQuery(sql)
    res.status(200).json({ status: "success", data: result[0] })
})


module.exports = {
    getAllItems,
    getSingleItem,
    createNewItem,
    deleteItem,
    updateItem
}
