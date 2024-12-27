import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';

import dotenv from "dotenv"
dotenv.config()
const app = express();

const {PORT_NUMBER}=process.env
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'This API handles user registration, login, password reset, and OTP verification.',
    },
    servers: [
      {
        url: `http://localhost:${PORT_NUMBER}/api`, 
      },
    ],
  },
  apis: ['./Controller/*/*.ts'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;
