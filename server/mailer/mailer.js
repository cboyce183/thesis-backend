'use strict';

// --------------------
// GENERATE ACCOUNT HERE https://ethereal.email/
// --------------------
const nodemailer = require('nodemailer');

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
module.exports = function sendEmail (userData, id, ) {
  console.log('userdata received in the mailer', userData);
  nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'yhiwrx5wkxtwdbiy@ethereal.email', // generated ethereal user
          pass: 'GCREBDFhAfaeKS5Bsa'  // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Zendama 👻" <no-reply@zendama.com>', // sender address
      to: `${userData.email}`, // list of receivers
      subject: 'NAMEOFTHECOMPANY added you ✔', // Subject line
      text: `
        Hello ${userData.name},
        You received an invitation to join Zendama
        `,
      html: ` Click here to join
        <a href='http://localhost:4200/signup-user?user-id=${id._id}'>http://localhost:4200/signup-user?user-id=${id._id}</a>
      `
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
}
