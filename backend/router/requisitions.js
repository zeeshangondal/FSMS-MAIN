const {getAllRequisitions,createNewRequisition,getSpecificRequisitions,deleteItem,updateItem} = require("../controllers/requisitions")

const app=require("express")

const router=app.Router()

router.route("/").get(getAllRequisitions).post(createNewRequisition)
router.route("/:id").get(getSpecificRequisitions).delete(deleteItem).patch(updateItem)


module.exports=router;