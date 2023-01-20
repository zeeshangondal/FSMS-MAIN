const DB = require("../database/db")
const asyncWrapper = require("../middlewares/asyncWrapper")
const { createCustomAPIError } = require('../errors/CustomAPIError')



const SQL = {
    getAllRequisitions: "SELECT Req.id,Req.reportingOfficerRemarks ,storeKeeperRemarks,Dep.title AS department, Req.departmentId,Req.status,Req.requestedDate,Req.approvedByReportingOfficerDate,Req.approvedByStoreKeeperDate,Req.completionDate,Us.username,Us.email,Us.phoneNumber,Us.designation FROM Requisition AS Req INNER JOIN Users AS Us ON Req.userId=Us.id INNER JOIN Department AS Dep ON Dep.id=Req.departmentId",
}

const getAllRequisitionItems = async (requisition) => {
    const sql = "SELECT It.id,It.name,requestedQuantity,issuedQuantity,requisitionId,Cat.title AS category FROM RequisitionItems INNER JOIN Items AS It ON itemId=It.id INNER JOIN Category AS Cat ON It.categoryId=Cat.id WHERE RequisitionId=" + requisition.id
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
        //console.log(result)
        res.status(200).json({ status: "success", data: result.reverse() })
    }, 1000);
})

const getSpecificRequisitions = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (id == "loggedInUser") {
        const { id, email } = req.query
        const sql = SQL.getAllRequisitions + " WHERE userId=" + id
        result = await DB.execQuery(sql)
        result.forEach((requisition) => {
            getAllRequisitionItems(requisition)
        })
        setTimeout(() => {
            //console.log(result)
            res.status(200).json({ status: "success", data: result.reverse() })
        }, 1000);
    }
    else if (id == "department") {
        const { departmentId } = req.query
        //console.log("IN department: ",departmentId)
        const sql = SQL.getAllRequisitions + " WHERE Req.departmentId=" + departmentId
        result = await DB.execQuery(sql)
        result.forEach((requisition) => {
            getAllRequisitionItems(requisition)
        })
        setTimeout(() => {
            //console.log(result)
            res.status(200).json({ status: "success", data: result.reverse() })
        }, 1000);
    }
    else if (id == "approvedByReportingOfficer") {
        const sql = SQL.getAllRequisitions + " WHERE Req.status>=33"
        result = await DB.execQuery(sql)
        result.forEach((requisition) => {
            getAllRequisitionItems(requisition)
        })
        setTimeout(() => {
            //console.log(result)
            res.status(200).json({ status: "success", data: result.reverse() })
        }, 1000);
    }

    //    res.send("DONE")
})

const insertRequisitionItems = (requisitionId, items) => {
    items.forEach(async (item) => {
        let { id, requestedQuantity, issuedQuantity = -1 } = item
        const sql = `INSERT INTO RequisitionItems(itemId ,requestedQuantity ,issuedQuantity ,requisitionId) VALUES(${id},'${requestedQuantity}', ${issuedQuantity}, ${requisitionId})`
        await DB.execQuery(sql)
    });
}

const createNewRequisition = asyncWrapper(async (req, res, next) => {
    let { department = "TBD", departmentId, userId, items } = req.body

    let sql = `INSERT INTO Requisition(requestedDate , department ,departmentId ,userId )  VALUES(now(),'${department}', ${departmentId},${userId} )`
    await DB.execQuery(sql)

    sql = "SELECT * FROM Requisition ORDER BY id DESC LIMIT 1";
    let response = await DB.execQuery(sql)
    //console.log(response)
    insertRequisitionItems(response[0].id, items)
    const result = { ...response[0], items }
    //console.log("Result: ", result)
    res.status(201).json({ status: "success", data: result })
    //res.status(201).json({ status: "success", data: [] })
})



const updateRequisition = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const { query } = req.body
    if (query == "reportingOfficerApproval") {
        const { reportingOfficerRemarks } = req.body
        console.log(reportingOfficerRemarks)
        const sql = `UPDATE Requisition SET approvedByReportingOfficerDate = now() , status = 33, reportingOfficerRemarks='${reportingOfficerRemarks}'  WHERE id=${id}`
        await DB.execQuery(sql)
        console.log("DONE")
        res.status(201).json({ status: "success", msg: "Rqeuisition updated sucessfully. Given remarks: " + reportingOfficerRemarks })
    }
    else if (query == "storeKeeperApproval") {
        console.log(req.body)
        const { storeKeeperRemarks, items } = req.body
        await updateRequisitionItemsForIssuedQTA(items)
        setTimeout(async () => {
            const sql = `UPDATE Requisition SET approvedByStoreKeeperDate  = now(), storeKeeperRemarks='${storeKeeperRemarks}' , status = 66  WHERE id=${id}`
            await DB.execQuery(sql)
            res.status(201).json({ status: "success", msg: "Requisition updated sucessfully" })
        }, 100)
    }
    else if (query == "updateRequisition") {
        console.log(req.body)
        const { items,id } = req.body
        await updateRequisitionItems(id,items)
        res.status(201).json({ status: "success", msg: "Requisition updated sucessfully" })
    }
})
const updateRequisitionItems= async (requisitionId,items) => {
    let sql = `DELETE FROM RequisitionItems WHERE requisitionId=${requisitionId}`
    await DB.execQuery(sql)
    setTimeout(async () => {
        items.forEach(async (item) => {
            let { id, requestedQuantity, issuedQuantity = -1 } = item
            sql = `INSERT INTO RequisitionItems(itemId ,requestedQuantity ,issuedQuantity ,requisitionId) VALUES(${id},'${requestedQuantity}', ${issuedQuantity}, ${requisitionId})`
            await DB.execQuery(sql)
        });
    }, 300)   
}
const deleteRequisitionItems= async (requisitionId) => {
    let sql = `DELETE FROM RequisitionItems WHERE requisitionId=${requisitionId}`
    await DB.execQuery(sql)   
}
const updateRequisitionItemsForIssuedQTA = async (items) => {
    items.forEach(async (item) => {
        const sql = `UPDATE requisitionItems SET issuedQuantity = ${item.issuedQuantity} WHERE itemId=${item.id} AND requisitionId = ${item.requisitionId}`
        await DB.execQuery(sql)
    })
}


const deleteRequisition = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    console.log("Requisition Id: ",id)
    deleteRequisitionItems(id)
    const sql = `DELETE FROM Requisition WHERE id=${id}`
    await DB.execQuery(sql)
    res.status(200).json({ status: "success" , message:"Requisition Deleted Successfully"})
})


module.exports = {
    getAllRequisitions,
    createNewRequisition,
    getSpecificRequisitions,
    deleteRequisition,
    updateRequisition
}
