const {getAllDepartments} = require("../controllers/departmentsCollection")
const app=require("express")

const router=app.Router()

router.route("/").get(getAllDepartments)


module.exports=router;