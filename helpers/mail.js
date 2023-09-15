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

module.exports = mail;
