import express from 'express';
import { login, register, logout, sendVerifyOtp, verifyAccount, isAuthenticated, resetPassword, sendResetPasswordOtp } from '../controllers/authController.js';
import  userAuth  from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/sendVerifyOtp', userAuth, sendVerifyOtp);
authRouter.post('/verifyAccount', userAuth, verifyAccount);
authRouter.get('/isAuthenticated', userAuth, isAuthenticated);
authRouter.post('/sendResetPasswordOtp',  sendResetPasswordOtp);
authRouter.post('/resetPassword', resetPassword);

export default authRouter;