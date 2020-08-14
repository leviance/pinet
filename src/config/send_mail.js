const nodemailer = require("nodemailer");

async function send_mail(email_address,subject,html) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    to: email_address, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });

  return info
}

module.exports = send_mail