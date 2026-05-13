import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_KEY
    },
    tls: {
    rejectUnauthorized: false // only if you’re stuck with self-signed certs
  }
});

export default transporter;