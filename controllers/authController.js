import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async(req,res) =>{
    const {name,email,password} = req.body;

    if(!name || !email|| !password){
        return res.status(400).json({message:'Please fill all the fields'});
    }

    try{

        const existingUser  = await userModel.findOne({email});

        if(existingUser){
            return res.status(400).json({success: false, message:'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);  


        const user = new userModel({
            name,
            email,  
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        //Sending welcome email to the user
        

        // transporter.sendMail(mailOptions, (err, info) => {
        //     if (err) {
        //         console.error(err);
        //         return res.status(500).json({ success: false, message: 'Email failed to send' });
        //     }
        //     console.log("Welcome email sent successfully");
        //     res.status(201).json({ success: true, message: 'User registered successfully', token });
        // });

        try {
            const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to our platform',
            text: `Hello ${user.name},\n\nThank you for registering on our platform. We're excited to have you on board!\n\nBest regards,\nThe Team`
        });

            console.log("MAIL SENT:", info);
            return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token
});

        } catch (error) {
            console.log("MAIL ERROR:", error);
        }



    }
    catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const logout = async(req,res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' :'strict',
        });
        return res.json({success: true, message:'Logout successful'});
    }   
    catch(error){
        return res.json({success: false, message: error.message});
    }
}


export const sendVerifyOtp = async(req,res) => {
    try{
        const userId = req.userId;


        const  user = await userModel.findById(userId);
        
        if(user.isVerified){
            return res.json({success: false, message:'User is already verified'});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your OTP for account verification',
            html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp)
        }

        try {
            const info = await transporter.sendMail(mailOptions);

            console.log("MAIL SENT:", info);
            return res.json({
    success: true,
    message: 'OTP sent successfully'
});

        } catch (error) {
            console.log("MAIL ERROR:", error);
        }



    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const verifyAccount = async(req,res) =>{
    try{
        const userId = req.userId;
        const {otp} = req.body;
        
        if(!userId || !otp){
            return res.status(400).json({success: false, message:'User ID and OTP are required'});
        }

        const user = await userModel.findById(userId);

        if(!user){
            return res.status(400).json({success: false, message:'User not found'});
        }

        if(user.isVerified){
            return res.json({success: false, message:'User is already verified'});
        }

        if(user.verifyOtpExpiry < Date.now()){
            return res.status(400).json({success: false, message:'OTP has expired'});
        }
        if(user.verifyOtp !== otp){
            return res.status(400).json({success: false, message:'Invalid OTP'});
        }

        user.isVerified = true;
        user.verifyOtp = undefined;
        user.verifyOtpExpiry = undefined;
        await user.save();

        return res.json({success: true, message:'Account verified successfully'});
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const isAuthenticated = async(req,res) => {
    try{
        return res.json({success: true, message:'User is authenticated'});
    }
    catch(error) {
        return res.json({success: false, message: error.message});
    }
}

export const sendResetPasswordOtp = async(req,res) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({success: false, message:'Email is required'});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message:'User not found'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;  
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your OTP for password reset',
            html: PASSWORD_RESET_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp)
        }
        try {
            const info = await transporter.sendMail(mailOptions);

            console.log("MAIL SENT:", info);

        } catch (error) {
            console.log("MAIL ERROR:", error);
        }
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}   

export const resetPassword = async(req,res) => {
    try{
        const {email, otp, newPassword} = req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({success: false, message:'Email, OTP and new password are required'});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message:'User not found'});
        }   
        if(user.resetOtpExpiry < Date.now()){
            return res.status(400).json({success: false, message:'OTP has expired'});
        }
        if(user.resetOtp !== otp){
            return res.status(400).json({success: false, message:'Invalid OTP'});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();
        return res.json({success: true, message:'Password reset successful'});
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }   
}