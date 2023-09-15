const nodemailer = require('nodemailer');
let mailer = {};

mailer.sendEmail = async (mailOptions) => {
    return new Promise((resolve, reject) => {
        try{
            let transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_USER_PASSWORD
                }
            });
            let result = transporter.sendMail(mailOptions);
            return resolve(true);
        }
        catch {
            return reject(false)
        }
    });
}

module.exports = mailer;