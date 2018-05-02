// email to user
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: 'smtp.outlook.com',
    port: 587,
    secure: false, // use SSL
    debug: true,
    auth: {
        user: 'educrafters.org@outlook.in',
        pass: 'password'
    }
});

module.exports = transport;