const {getAllRequisitions,createNewRequisition,getSpecificRequisitions,deleteRequisition,updateRequisition} = require("../controllers/requisitions")

const app=require("express")

const router=app.Router()

router.route("/").get(getAllRequisitions).post(createNewRequisition)
router.route("/:id").get(getSpecificRequisitions).delete(deleteRequisition).patch(updateRequisition)


module.exports=router;