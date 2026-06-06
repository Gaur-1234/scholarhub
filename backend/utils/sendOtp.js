const nodemailer = require("nodemailer");

const sendOtp = async (email, otp) => {
  try {
   const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,

  },

  tls: {

    rejectUnauthorized: false

  }

});
    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: email,

      subject: "ScholarHub Security Verification Code",

      html: `

  <div
    style="
      font-family: Arial;
      padding: 20px;
    "
  >

    <h1
      style="
        color:#2563eb;
      "
    >
      ScholarHub
    </h1>


    <p>
      Your verification code is:
    </p>


    <h2
      style="
        letter-spacing:4px;
      "
    >
      ${otp}
    </h2>


    <p>
      This OTP expires in
      5 minutes.
    </p>


    <p>
      If you did not request
      this code, please ignore
      this email.
    </p>

  </div>

`,
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP Email Sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendOtp;
