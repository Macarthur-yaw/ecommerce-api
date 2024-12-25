import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import router from "./Controller/UserController/User"
dotenv.config()
const {PORT_NUMBER}=process.env
const app=express();
import  "./Config/DatabaseConnect"
import swaggerUi from "swagger-ui-express"
import swaggerDocs from "./Config/SwaggerConfig"
app.use(cors());
app.use(express.json())

app.use("/api",router)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));


app.listen(PORT_NUMBER && PORT_NUMBER,()=>{
    console.log(`listening to Port ${PORT_NUMBER}`)
})