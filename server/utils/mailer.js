const Mailer = require('nodemailer');

const Emailer = Mailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_SECURE_KEY
    }
});
module.exports = Emailer