import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

dotenv.config();


const app=express();
const port =process.env.PORT || 4000

connectDB();

const allowedOrigins =['http://localhost:5173',]

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}))

app.get('/',(req,res)=>res.send("API is working"))

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port,()=>console.log(`server started on port:${port}`));

