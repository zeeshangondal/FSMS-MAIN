require('dotenv').config();
require('express-async-errors');
const mysql = require('mysql');
const DB=require("./database/db")
const express=require("express")
const itemsRouter=require("./router/items")
const usersRouter=require("./router/users")
const requisitionsRouter=require("./router/requisitions")
const departmentsCollectionRouter=require("./router/departmentsCollection")
const userTypesCollectionRouter=require("./router/userTypesCollection")
const itemsCategoryCollectionRouter=require("./router/itemsCategoryCollection")
const itemsPackagingCollectionRouter=require("./router/itemsPackagingCollection")


const notFound = require('./middlewares/not-found');
const authenticateUser = require('./middlewares/authentication');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const cors = require("cors")



const app=express()

const PORT=3001



app.use(cors())
app.use(express.json())
app.use("/api/v1/items",itemsRouter)
app.use("/api/v1/users",usersRouter)
app.use("/api/v1/requisitions",authenticateUser,requisitionsRouter)
app.use("/api/v1/departments",departmentsCollectionRouter)
app.use("/api/v1/userTypes",userTypesCollectionRouter)
app.use("/api/v1/itemsCategories",itemsCategoryCollectionRouter)
app.use("/api/v1/itemsPackagings",itemsPackagingCollectionRouter)





app.use(notFound)
app.use(errorHandlerMiddleware);



const start = () => {
    try {
        DB.connectToDB()
        app.listen(PORT, () => {
            console.log(`listening at PORT ${PORT}`)
        })
    } catch (error) {
        console.log("DB couldnt be connected")
    }
}
start();

