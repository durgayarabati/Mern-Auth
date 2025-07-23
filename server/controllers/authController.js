import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { response, text } from 'express';
import transporter from '../config/nodemailer.js';


const { JsonWebTokenError } = jwt;
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "missing Deatils" })
    }
    try {
        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "user already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000

        });
        //const sending welcome email
        const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: "🎉 Welcome to the Developer Community",
  text: `Hi ${name}, Welcome Buddy! 🎉 Your account has been created successfully.`, // fallback for text-only clients
  html: `
    <div style="font-family:Arial, sans-serif; color:#333;">
      <h2>Hi ${name}, 👋</h2>
      <p>Welcome Buddy!🎉</p>
      <p>Your account has been <strong>created successfully</strong>.</p>
      <p>We're excited to have you join the <b>Developer Community</b>!</p>
      <br/>
      <p style="color:gray;">– Team DevConnect</p>
    </div>
  `
};


        await transporter.sendMail(mailOptions);


        return res.json({ success: true })

    }
    catch (error) {
        console.error("Email error:", error);
        res.json({ success: false, message: error.message })

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "email and password are required" })
    }
    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "invalid email" })
        }
        const IsMatch = await bcrypt.compare(password, user.password)

        if (!IsMatch) {
            return res.json({ success: false })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true })


    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    // 🔥 RESPONSE FIRST — this will immediately end the request
    res.status(200).json({ success: true, message: "OTP is being sent to your email." });

    // 🔧 BACKGROUND EMAIL LOGIC — 100% decoupled
    setTimeout(async () => {
      try {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Account Verification",
          text: `Your OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ OTP email sent to", user.email);
      } catch (err) {
        console.error("❌ Failed to send OTP email:", err.message);
      }
    }, 0); // 0ms => runs after response is sent

  } catch (error) {
    console.error("❌ sendVerifyOtp error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Something went wrong." });
    }
  }
};




export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "missing details" })
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })

        }

        user.isAccountVerified=true;
        user.verifyOtp="";
        user.verifyOtpExpireAt=0;
        
        await user.save();
        return res.json({success:true,message:"Email verified successfully"})
    }
    catch (error) {
        return res.json({ success: false, message: error.message });

    }
}

export const isAuthenticated = async (req,res)=>{
    try{
        return res.json({success:true})

    }
    catch(error){
        res.json({success:false,message:error.message})

    }
}

export const sendResetOtp = async(req,res)=>{
    const{email}=req.body;
    if(!email){
        return res.json({success:false,message:"email is required"})

    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false,message:"user not found"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Account Verification",
          text: `Your OTP is: ${otp} Use this otp to proceed with resetting your password`
        };
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message:'OTP sent to your email'})
    }
    catch(error){
        return res.json({success: false, message:"hello"});
    }
}

// Reset password

export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword}=req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"email , otp and new password are required"})
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not Found"})

        }
        if(user.resetOtp ==="" || user.resetOtp !== otp){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"})

        }

        const hashedpassword = await bcrypt.hash(newPassword,10);

        user.password = hashedpassword;
        user.resetOtp ="";
        user.resetOtpExpireAt =0;

        await user.save();

        return res.json({success:true,message:"Password has been reset successfully"})

    }
    catch(error){
        return res.json({success:false,message:error.message});

    }
}