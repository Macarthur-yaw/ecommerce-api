import {Schema,model} from "mongoose"
import { userRoles,userSchema } from "../types/UserSchemaTypes"

const userSchema=new Schema<userSchema>(
    {
username:{
    type:String,
    required:true,
   
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    minlength:6,

    
}
,role:{
    type:String,
    enum:userRoles,
    default:userRoles.user

},
verified:{
    type:Boolean,
    default:false
}
    }
)

const user=model("user",userSchema)

export default user;
