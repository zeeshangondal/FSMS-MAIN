const {getAllPackagings} = require("../controllers/itemsPackagingCollection")
const app=require("express")

const router=app.Router()

router.route("/").get(getAllPackagings)


module.exports=router;