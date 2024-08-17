const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        service: 'outlook',
        auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error(err)
        };
        console.info(info);
    });
};

module.exports = sendEmail;