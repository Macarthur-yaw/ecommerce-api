const otpGenerator=require("otp-generator")
const otpNumber=otpGenerator.generate(6,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})


const returnOtp=()=>{
    return otpNumber;

}

export default returnOtp;
