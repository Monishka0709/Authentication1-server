import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_KEY
    },
    tls: {
    rejectUnauthorized: false // only if you’re stuck with self-signed certs
  }
});

export default transporter;