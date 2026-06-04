const forgotForm = document.getElementById("forgot-form");

forgotForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      },
    );

    const data = await response.json();

    alert(data.message);

    if (data.message === "OTP Sent") {
      localStorage.setItem(
        "resetEmail",

        email,
      );

      window.location.href = "resetPassword.html";
    }
  },
);
