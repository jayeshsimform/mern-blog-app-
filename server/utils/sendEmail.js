const nodemailer = require("nodemailer");

module.exports = async (email, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_SECURE_KEY
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_ID,
            to: email,
            subject: subject,
            text: text,
            html: html
        });
        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent!");
        console.log(error);
        return error;
    }
};