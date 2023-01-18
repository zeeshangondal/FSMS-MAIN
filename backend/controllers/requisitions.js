const DB = require("../database/db")
const asyncWrapper = require("../middlewares/asyncWrapper")
const { createCustomAPIError } = require('../errors/CustomAPIError')



const SQL = {
    getAllRequisitions: "SELECT Req.id,Req.department,Req.departmentId,Req.status,Req.requestedDate,Req.approvedByReportingOfficerDate,Req.approvedByStoreKeeperDate,Req.completionDate,Us.username,Us.email,Us.phoneNumber,Us.designation FROM Requisition AS Req INNER JOIN Users AS Us ON Req.userId=Us.id",
}

const getAllRequisitionItems = async (requisition) => {
    const sql = "SELECT * FROM RequisitionItems WHERE RequisitionId=" + requisition.id
    const result = await DB.execQuery(sql)
    requisition.items = result
}


const getAllRequisitions = asyncWrapper(async (req, res, next) => {
    const sql = SQL.getAllRequisitions
    result = await DB.execQuery(sql)
    result.forEach((requisition) => {
        getAllRequisitionItems(requisition)
    })
    setTimeout(() => {
        console.log(result)
        res.status(200).json({ status: "success", data: result.reverse() })
    }, 1000);
})

const getSpecificRequisitions = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (id == "loggedInUser") {
        const { id, email } = req.query
        const sql = SQL.getAllRequisitions +" WHERE userId="+id
        result = await DB.execQuery(sql)
        result.forEach((requisition) => {
            getAllRequisitionItems(requisition)
        })
        setTimeout(() => {
            console.log(result)
            res.status(200).json({ status: "success", data: result.reverse() })
        }, 1000);
    }
    else if (id == "department") {
        const { departmentId } = req.query
        console.log("department: ", departmentId)
        res.send("NO MATCH")
    }
//    res.send("DONE")
})

const insertRequisitionItems = (requisitionId, items) => {
    items.forEach(async (item) => {
        let { id, requestedQuantity, issuedQuantity } = item
        const sql = `INSERT INTO RequisitionItems(itemId ,requestedQuantity ,issuedQuantity ,requisitionId) VALUES(${id},'${requestedQuantity}', ${issuedQuantity}, ${requisitionId})`
        await DB.execQuery(sql)
    });
}

const createNewRequisition = asyncWrapper(async (req, res, next) => {
    let { department, departmentId, userId, itemsData } = req.body
    let sql = `INSERT INTO Requisition(department ,departmentId ,userId )  VALUES('${department}', ${departmentId},${userId} )`
    await DB.execQuery(sql)
    //sleep(100)
    sql = "SELECT * FROM Requisition ORDER BY id DESC LIMIT 1";
    let response = await DB.execQuery(sql)
    console.log(response)
    insertRequisitionItems(response[0].id, itemsData.items)
    const result = { ...response[0], items: itemsData.items }
    console.log("Result: ", result)
    res.status(201).json({ status: "success", data: result })
})

const updateItem = asyncWrapper(async (req, res, next) => {
    console.log(req.body)
    const { id } = req.params
    const { name, quantity, packagingId, categoryId } = req.body
    sql = `UPDATE items SET name='${name}', quantity =${quantity}, packagingId='${packagingId}', categoryId=${categoryId} WHERE id=${id}`
    await DB.execQuery(sql)

    sql = SQL.getAllItems + " WHERE It.id=" + `${id}`;
    result = await DB.execQuery(sql)
    res.status(201).json({ status: "success", data: result[0] })
})


const deleteItem = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    result = await DB.execQuery(`SELECT * FROM Items where id=${id}`)
    if (result.length == 0) {
        return next(createCustomAPIError("No Item exist with ID: " + id, 404))
    }
    sql = `DELETE FROM Items WHERE id=${id}`
    await DB.execQuery(sql)
    res.status(200).json({ status: "success", data: result[0] })
})


module.exports = {
    getAllRequisitions,
    createNewRequisition,
    getSpecificRequisitions,
    deleteItem,
    updateItem
}
