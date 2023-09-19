let mailer = require("../lib/mailer");

var mail = {};
mail.sendWelcomeMail = async (objMail) => {
    try {
        return new Promise(async (resolve, reject) => {
            let mailOptions = {
                from: process.env.MAIL_FROM,
                to: objMail.email,
                subject: 'WELCOME MAIL FROM RentQube',
                text: 'RentQube welcomes you',
                html: '<h1>Welcome to RentQube<h1><br/> Here is your credentials for login: <br/><b>Username: ' + objMail.userName + '<b/><br/><b>Password: ' + objMail.password + '<b/>'
            }
            let response = await mailer.sendEmail(mailOptions);
            resolve(response);
        })
    } catch (error) {
        reject(error);
    }
}

mail.sendEmailVerificationOtpEmail = async (objMail) => {
    try {
        return new Promise(async (resolve, reject) => {
            let mailOptions = {
                from: process.env.MAIL_FROM,
                to: objMail.email,
                subject: `OTP for email verification: ${objMail.username}`,
                text: 'RentQube welcomes you',
                html: `Hi, ${objMail.username}! <br>

                Your registration is almost complete. do not share this otp with anyone.<br>
                
                If this is not you, please ignore this email.<br>
                
                The OTP code is: ${objMail.otp}`
            }
            let response = await mailer.sendEmail(mailOptions);
            resolve(response);
        })
    } catch (error) {
        reject(error);
    }
}

module.exports = mail;
