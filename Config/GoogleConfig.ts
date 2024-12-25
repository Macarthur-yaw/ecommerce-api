import passport from "passport"
import {Strategy} from "passport-google-oauth2"
import dotenv from "dotenv"
dotenv.config(
)

const {CLIENT_ID,CLIENT_SECRET}=process.env
if(CLIENT_ID && CLIENT_SECRET){
    passport.use(new Strategy({
        clientID: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          callbackURL: "http://localhost:8086/api/auth/google/callback",
      },
          (accessToken:string, refreshToken:string, profile: any, done: (arg0: null, arg1: { Profile: any; Accesstoken: string }) => any) => {
  
              const user = { Profile: profile, Accesstoken: accessToken }
              return done(null, user)
          }))
}


passport.serializeUser((user, done) => {
    done(null, user); 
  });
  
  passport.deserializeUser((user:any, done) => {
     done(null, user) 
  });