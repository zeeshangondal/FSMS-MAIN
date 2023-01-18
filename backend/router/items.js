const {getAllItems,getSingleItem,createNewItem,deleteItem,updateItem} = require("../controllers/items")

const app=require("express")

const router=app.Router()

router.route("/").get(getAllItems).post(createNewItem)
router.route("/:id").get(getSingleItem).delete(deleteItem).patch(updateItem)


module.exports=router;