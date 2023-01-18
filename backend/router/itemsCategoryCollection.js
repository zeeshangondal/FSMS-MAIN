const {getAllCategories} = require("../controllers/itemsCategoryCollection")
const app=require("express")

const router=app.Router()

router.route("/").get(getAllCategories)


module.exports=router;