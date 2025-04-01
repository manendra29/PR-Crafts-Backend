import nodeMailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const options = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP for Logging to MyPROJECT",
    text: `use this OTP ${otp} for registeration!`,
  };
  console.log("Hua ke nahi?");
  await transporter.sendMail(options);
  console.log("Ho gaya!");
};
