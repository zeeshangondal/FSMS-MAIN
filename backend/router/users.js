const {getAllUsers,getSingleUser,registerNewUser,deleteItem,updateItem} = require("../controllers/users")
const app=require("express")

const router=app.Router()

router.route("/").get(getAllUsers).post(registerNewUser)
router.route("/:email").get(getSingleUser).delete(deleteItem).patch(updateItem)



module.exports=router;