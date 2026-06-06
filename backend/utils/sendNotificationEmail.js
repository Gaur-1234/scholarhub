const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendNotificationEmail = async (
  email,
  username,
  message
) => {

  try {

    const response =
    await resend.emails.send({

      from:
      "ScholarHub <onboarding@resend.dev>",

      to: email,

      subject:
      "ScholarHub Notification",

      html: `

      <div
        style="
          font-family:Arial,sans-serif
        "
      >

        <h2>
          Hello ${username},
        </h2>

        <p>
          You have received a
          new notification from
          ScholarHub.
        </p>

        <div
          style="
            background:#f4f4f4;
            padding:15px;
            border-radius:8px;
            margin:15px 0;
          "
        >
          ${message}
        </div>

        <p>
          Login to ScholarHub
          to view more details.
        </p>

        <br>

        <p>
          Regards,
          <br>
          ScholarHub Team
        </p>

      </div>

      `

    });

    console.log(
      "NOTIFICATION EMAIL SENT:",
      response
    );

    return true;

  }

  catch (error) {

    console.error(
      "NOTIFICATION EMAIL ERROR:",
      error
    );

    throw error;

  }

};

module.exports =
sendNotificationEmail;