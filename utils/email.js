import nodemailer, { createTransport } from "nodemailer";

const sendEmail = async (options) => {
  //Create transport
  const transporter = createTransport({
    service: "Gmail",
    auth: {
      user: "tungarazakennedy@gmail.com",
      pass: "jkri jbkf vfuu rlxa",
    },
  });

  //Define email options
  const mailOptions = {
    from: "Kennedy <tungarazakennedy@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
