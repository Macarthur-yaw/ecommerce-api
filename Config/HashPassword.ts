import bcrypt from "bcrypt";

const hashPassword=async(password:string)=>{

    try {
        const hashedPassword=await bcrypt.hash(password,10)
        return hashedPassword;

    } catch (error) {
        console.log(error);

    }
}
export default hashPassword;
