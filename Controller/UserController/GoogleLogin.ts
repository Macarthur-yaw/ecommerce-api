import passport from "passport";
import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import  user  from "../../Model/UserSchema"; 

dotenv.config();

const { MY_SECRET_KEY, FRONTEND_URL } = process.env;

if (!MY_SECRET_KEY || !FRONTEND_URL) {
  throw new Error("MY_SECRET_KEY or FRONTEND_URL is not set in the environment variables");
}

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  async (req: Request, res: Response) => {
    try {
     
      if (!req.user) {
         res.status(401).send({ message: "User authentication failed" });
         return;
      }

     
      const userProfile = req.user as any; 
      const username = userProfile.displayName;
      const email = userProfile.emails[0]?.value;

      if (!email || !username) {
        res.status(400).send({ message: "Incomplete user data from Google" });
        return;

      }

    
      const existingUser = await user.findOne({ Email: email });
      if (existingUser) {
         res.redirect(
          `${FRONTEND_URL}?message=User already exists&accessToken=null&refreshToken=null`
        );
        return;
      }

     
      const newUser = new user({
        Username: username,
        Email: email,
        Password: null, 
      });
      await newUser.save();

     
      const accessToken = jwt.sign({ username }, MY_SECRET_KEY, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ username }, MY_SECRET_KEY, { expiresIn: "24h" });

    
      res.redirect(
        `${FRONTEND_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      console.error("Error during Google authentication callback:", error);
       res.status(500).send({ message: "Internal server error" });
       return;
    }
  }
);

export default router;
