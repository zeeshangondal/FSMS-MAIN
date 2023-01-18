const {getAllUserTypes} = require("../controllers/userTypesCollection")
const app=require("express")

const router=app.Router()

router.route("/").get(getAllUserTypes)


module.exports=router;