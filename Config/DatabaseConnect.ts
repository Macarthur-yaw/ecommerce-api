import {connect} from "mongoose"
import dotenv from "dotenv"
dotenv.config();
const {CONNECTION_STRING}=process.env
if(!CONNECTION_STRING){
    throw new Error("Connection string is missing")
}
connect(CONNECTION_STRING)

const connection=async()=>{
try {
  await connect(CONNECTION_STRING);
console.log("connected ")
} catch (error) {
    console.log()
}
}
connection();


