const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'joserenatofelix@gmail.com',
        pass: 'ienz vnqs mnjc arkb'
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'joserenatofelix@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = {
    sendEmail
};