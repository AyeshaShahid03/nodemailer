const nodemailer = require('nodemailer');
require('dotenv').config();

console.log(process.env.ahmad_email)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ahmad_email,
        pass: process.env.email_app_pass
    }
});

const message = {
    from: process.env.ahmad_email,
    to: process.env.receipent_email,
    subject: process.env.email_subject,
    text: process.env.email_body
};


transporter.sendMail(message, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});

