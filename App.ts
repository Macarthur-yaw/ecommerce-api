import express, { Router } from "express"
import dotenv from "dotenv"
import cors from "cors"
import router from "./Controller/UserController/User"
dotenv.config()
const {PORT_NUMBER}=process.env
const app=express();
import  "./Config/DatabaseConnect"
import swaggerUi from "swagger-ui-express"
import swaggerDocs from "./Config/SwaggerConfig"

import { productRouter } from "./Controller/ProductController/Product"
import fileRouter from "./Controller/ProductController/Upload"

app.use(cors());


app.use("/api",fileRouter)
app.use("/api/products",productRouter)

app.use("/api",router)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));


app.listen(PORT_NUMBER && PORT_NUMBER,()=>{
    console.log(`listening to Port ${PORT_NUMBER}`)
})
