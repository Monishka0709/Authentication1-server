import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';

import authRouter from './views/authRoutes.js';
import userRouter from './views/userRoutes.js';

const app = express();

const port  = process.env.PORT || 4000;
connectDB();

const allowedOrigins = [process.env.FRONTEND_URL];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://authentication1-mern.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// API endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});