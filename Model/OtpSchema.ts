import  {Schema,model} from "mongoose"

const otpSchema=new Schema(
    {
        Email:{
            type:String,
            required:true 
        }
        ,
        otp:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now(),
            
            expires: 60 * 10
        }
    }
)
const otpmodel=model("Otp",otpSchema)

export default otpmodel;
