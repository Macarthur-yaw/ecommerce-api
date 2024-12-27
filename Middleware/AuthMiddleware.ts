import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { MY_SECRET_KEY } = process.env;

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send({ message: "Unauthorized: No Authorization Header" });
        return; 
    }

    const token = authorization.split(" ")[1];
    if (!token) {
        res.status(401).send({ message: "Unauthorized: No Token Provided" });
        return;
    }

    try {
        if (!MY_SECRET_KEY) {
            throw new Error("Missing Secret Key");
        }

        const decoded = jwt.verify(token, MY_SECRET_KEY) as { email?: string };

        if (decoded?.email) {
            req.body.email = decoded.email; 
        }

        next(); 
    } catch (error) {
        res.status(401).send({ message: "Unauthorized: Invalid Token" });
    }
};

export default AuthMiddleware;
