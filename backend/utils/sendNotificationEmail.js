const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (
  email,
  username,
  message
) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "ScholarHub Notification",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Hello ${username},</h2>

        <p>You have received a new notification from ScholarHub.</p>

        <div style="
          background:#f4f4f4;
          padding:15px;
          border-radius:8px;
          margin:15px 0;
        ">
          ${message}
        </div>

        <p>
          Login to ScholarHub to view more details.
        </p>

        <br>

        <p>
          Regards,<br>
          ScholarHub Team
        </p>
      </div>
    `,
  });

};

module.exports = sendNotificationEmail;