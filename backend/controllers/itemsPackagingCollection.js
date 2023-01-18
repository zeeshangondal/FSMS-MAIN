const DB = require("../database/db")
const asyncWrapper = require("../middlewares/asyncWrapper")


const getAllPackagings = asyncWrapper(async (req, res, next) => {
    const sql="SELECT id, title FROM Packaging"
    result = await DB.execQuery(sql)
    res.status(200).json({ status: "success", data: result })
})


module.exports = {
    getAllPackagings,
}
