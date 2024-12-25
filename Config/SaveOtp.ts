import otpmodel from "../Model/OtpSchema";

const saveOtp=async(email:string,otp:Number)=>{
 try {
      

        const otpUser=new otpmodel(
            {
                Email:email,
                otp:otp
            }
        )

     const response= await   otpUser.save();
return response;
    } catch (error) {
        console.log(error)
    }
}

export default saveOtp;

