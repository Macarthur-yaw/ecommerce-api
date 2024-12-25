import {Router,Request,Response} from "express"
import user from "../../Model/UserSchema";
import hashPassword from "../../Config/HashPassword";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import sendEmail from "../../Config/EmailConfig";
import returnOtp from "../../Config/OtpGenerator";
import saveOtp from "../../Config/SaveOtp";
import otpmodel from "../../Model/OtpSchema";
dotenv.config();
const {MY_SECRET_KEY}=process.env
const router=Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registers a new user
 *     description: Registers a new user with email, username, and password. Sends an OTP for verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: 'password123'
 *               username:
 *                 type: string
 *                 description: User's username.
 *                 example: 'johnDoe'
 *     responses:
 *       200:
 *         description: Account created successfully with JWT tokens.
 *       400:
 *         description: Bad request (missing fields or account exists).
 *       500:
 *         description: Internal server error.
 */
router.post("/signup",async (req:Request,res:Response)=>{

    const{email,password,username}=req.body;
console.log(req.body)
    if(!email || !password || !username){
         res.status(400).send({message:"All fields must be filled"})
    }
    else{
   
const findEmail=await user.findOne({email:email});
if(findEmail){
 res.status(400).send({message:"An account with that information already exists"})
}
else{
  
 try {
    const hashedPassword=await hashPassword(password)

    if(!hashedPassword){
throw new Error("Can not hash password");
    }
    const newUser=new user({
        username:username,
        email:email,
        password:hashedPassword
    })
 await newUser.save(); 
if(MY_SECRET_KEY){

    const accessToken=jwt.sign({email},MY_SECRET_KEY,{expiresIn:"24h"})
    const refreshToken=jwt.sign({email},MY_SECRET_KEY,{expiresIn:"30d"})
    const otpNum=returnOtp()

    
    sendEmail(email,otpNum,"verify")
    saveOtp(email,otpNum);

    res.status(200).send({success:true,message:"An account has been created",accessToken:accessToken,refreshToken:refreshToken})
}


 } catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal server error"})
 }
}

    }


})
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     description: Logs in a user by verifying the provided email and password, and returns JWT tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: User logged in successfully with JWT tokens.
 *       400:
 *         description: Bad request (missing fields or invalid credentials).
 *       500:
 *         description: Internal server error.
 */
router.post('/login',async (req:Request,res:Response)=>{

    const {email,password}=req.body;
if(!email || !password){
    res.status(400).send({message:"Bad request"})
}else{

    const findAccount =await user.findOne({email:email});
    if(!findAccount){
     res.status(400).send({message:"No account with this information exists"})
    }
    else{
        const findPassword=findAccount.password
        const comparePasswords=await bcrypt.compare(password,findPassword)
        let accessToken,refreshToken;
        if(MY_SECRET_KEY){
            accessToken=jwt.sign({email},MY_SECRET_KEY,{expiresIn:"24h"})
            refreshToken=jwt.sign({email},MY_SECRET_KEY,{expiresIn:"30d"})
        }
      
        if(comparePasswords){
            res.status(200).send({message:"User logged in successfully",accessToken:accessToken,refreshToken:refreshToken})
        }
        else{
            res.status(400).send({message:"Email or password is wrong"})
        }
    }
}

})


/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh the access token using a valid refresh token.
 *     description: This endpoint allows the user to refresh their access token by providing a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token used to obtain a new access token.
 *                 example: 'your_refresh_token_here'
 *     responses:
 *       200:
 *         description: Successfully generated a new access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The newly generated access token.
 *       400:
 *         description: Refresh token is required.
 *       401:
 *         description: Invalid or expired refresh token.
 */

router.post("/refresh-token",async (req:Request,res:Response)=>{
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).send({ message: "Refresh token is required" });
      return;
    }
  
    try {
      if (MY_SECRET_KEY) {
        const decoded = jwt.verify(refreshToken, MY_SECRET_KEY) as { email: string };
        const newAccessToken = jwt.sign({ email: decoded.email }, MY_SECRET_KEY, { expiresIn: "24h" });
  
        res.status(200).send({ accessToken: newAccessToken });
        return;
      }
    } catch (error) {
      res.status(401).send({ message: "Invalid or expired refresh token", error });
      return;

    }
})

/**
 * @swagger
 * /reset:
 *   post:
 *     summary: Request a password reset.
 *     description: This endpoint allows a user to request a password reset by providing their email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting a password reset.
 *                 example: 'user@example.com'
 *     responses:
 *       200:
 *         description: An OTP has been sent to the provided email address.
 *       400:
 *         description: The email address is missing or invalid.
 *       500:
 *         description: Internal server error while processing the request.
 */
router.post('/reset',async(req,res)=>{

    
    
    
    
    const {emailAddress}=req.body;
    if(!emailAddress){
         res.status(400).send({message:"Email should be provided"})
         return;
    }

    try {

       const foundEmail= await user.findOne({email:emailAddress})
if(!foundEmail){
     res.status(400).send({message:"Invalid email"})
     return;

}

const {email}=foundEmail
const otpNum=returnOtp()
sendEmail(email,otpNum,"reset");
saveOtp(email,otpNum);

        
    } catch (error) {
        res.status(500).send({message:"Internal server error"})
    }
})


/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify the OTP sent for password reset.
 *     description: This endpoint verifies the OTP sent to the user's email for resetting the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: 'user@example.com'
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user's email for verification.
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: OTP verified successfully. User can now reset their password.
 *       400:
 *         description: Invalid OTP or missing email/OTP.
 *       500:
 *         description: Internal server error during verification process.
 */
router.post('/verify-otp',async(req,res)=>{
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).send({ message: "Email and OTP must be provided" });
      return;
    }
  
    try {
   console.log(req.body)
      const validOtp = await otpmodel.findOne({Email:email,otp:otp})
  console.log(validOtp)
      if (!validOtp) {
         res.status(400).send({ message: "Invalid OTP" });
         return;
      }
  
    const data=  await user.findOneAndUpdate({email:email},{verified:true},{new:true})
      console.log(data)
  

      res.status(200).send({ message: "OTP verified successfully" });
    } catch (error) {
      console.error(error);
     res.status(500).send({ message: "Internal server error" });
    }


    


})

/**
 * @swagger
 * /verify-password-otp:
 *   post:
 *     summary: Verify the OTP for password reset.
 *     description: This endpoint verifies the OTP sent to the user's email for password reset verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting the OTP verification.
 *                 example: 'user@example.com'
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user's email for verification.
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: OTP verified successfully. The user can now proceed to reset their password.
 *       400:
 *         description: Invalid OTP or missing email/OTP in the request body.
 *       500:
 *         description: Internal server error during OTP verification process.
 */

router.post('/verify-password-otp',async(req,res)=>{
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).send({ message: "Email and OTP must be provided" });
      return;
    }
  
    try {
   console.log(req.body)
      const validOtp = await otpmodel.findOne({Email:email,otp:otp})
  console.log(validOtp)
      if (!validOtp) {
         res.status(400).send({ message: "Invalid OTP" });
         return;
      }
  
    
  

      res.status(200).send({ message: "OTP verified successfully" });
    } catch (error) {
      console.error(error);
     res.status(500).send({ message: "Internal server error" });
    }


    


})

/**
 * @swagger
 * /new-password:
 *   post:
 *     summary: Reset the user's password.
 *     description: This endpoint allows the user to reset their password by providing a new password and confirming it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user who wants to reset their password.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: The new password the user wants to set.
 *                 example: 'newPassword123'
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the new password to ensure they match.
 *                 example: 'newPassword123'
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Bad request. Passwords are either missing or do not match.
 *       500:
 *         description: Internal server error while updating the password.
 */

router.post('/new-password',async (req,res)=>{

    const {email,password,confirmPassword}=req.body;
    if(!password || !confirmPassword){
         res.status(400).send({message:"passwords must be provided"})
         return;
    }

    //checking if passwords match 
    //send an email 
   

    if(password !==confirmPassword){
         res.status(400).send({message:"passwords do not match"})
         return;
    }
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
     
    const userFind = await user.findOneAndUpdate({ email: email }, { Password: hashedPassword });

    if(userFind){
         res.status(200).send({message:"Password updated"})
         return;
    }
    else{
         res.status(500).send({message:"Internal server error"})
         return;
    }



})
/**
 * @swagger
 * /request-new:
 *   post:
 *     summary: Request a new OTP.
 *     description: This endpoint sends a new OTP to the user's email address for verification purposes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to which the OTP will be sent.
 *                 example: 'user@example.com'
 *     responses:
 *       200:
 *         description: A new OTP has been successfully sent to the user's email.
 *       400:
 *         description: Bad request. Email address is missing.
 *       500:
 *         description: Internal server error while sending the OTP.
 */

router.post("/request-new",async(req,res)=>{
    const otpNum=returnOtp()

    const {email}=req.body
    if(!email){
        res.status(400).send({message:"email is missing"})
        return;
    }

   await sendEmail(email,otpNum,"verify")
   await saveOtp(email,otpNum)

   res.status(200).send({message:"A new otp has been sent to your email"})
    //check if the time is passed 7 mins 
    //if it is 
})

export default router;
