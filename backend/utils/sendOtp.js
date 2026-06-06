const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendOtp = async (
  email,
  otp
) => {

  try {

    const response =
    await resend.emails.send({

      from:
      "ScholarHub <noreply@gaurautomation.com>",

      to: email,

      subject:
      "ScholarHub Security Verification Code",

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

      `

    });

    console.log(
      "OTP EMAIL SENT:",
      response
    );

    return true;

  }

  catch (error) {

    console.error(
      "OTP MAIL ERROR:",
      error
    );

    throw error;

  }

};

module.exports = sendOtp;