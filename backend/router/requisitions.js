const {getAllRequisitions,createNewRequisition,getSpecificRequisitions,deleteItem,updateRequisition} = require("../controllers/requisitions")

const app=require("express")

const router=app.Router()

router.route("/").get(getAllRequisitions).post(createNewRequisition)
router.route("/:id").get(getSpecificRequisitions).delete(deleteItem).patch(updateRequisition)


module.exports=router;