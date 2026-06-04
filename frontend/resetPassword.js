const resetForm = document.getElementById("reset-form");

resetForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    const otp = document.getElementById("otp").value;

   const password =
document.getElementById(
  "new-password"
).value;

const confirmPassword =
document.getElementById(
  "confirm-password"
).value;

if(password !== confirmPassword){

  alert(
    "Passwords do not match"
  );

  return;
}

    const response = await fetch(
      "http://https://scholarhub-backend-w94c.onrender.com/api/auth/reset-password",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,

          otp,

          password,
        }),
      },
    );

    const data = await response.json();

    alert(data.message);

    if (data.message === "Password Reset Successful") {
      window.location.href = "login.html";
    }
  },
);

// =========================
// SHOW HIDE PASSWORD
// =========================

const newPasswordInput =
document.getElementById(
  "new-password"
);

const confirmPasswordInput =
document.getElementById(
  "confirm-password"
);

document
.getElementById(
  "toggle-new-password"
)
.addEventListener(
  "click",
  () => {

    newPasswordInput.type =
    newPasswordInput.type ===
    "password"
    ? "text"
    : "password";

  }
);

document
.getElementById(
  "toggle-confirm-password"
)
.addEventListener(
  "click",
  () => {

    confirmPasswordInput.type =
    confirmPasswordInput.type ===
    "password"
    ? "text"
    : "password";

  }
);
