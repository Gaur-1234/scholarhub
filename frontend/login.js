const loginForm = document.getElementById("login-form");

const otpLoginBtn = document.getElementById("otp-login-btn");

const togglePassword = document.getElementById("toggle-password");

const passwordInput = document.getElementById("password");

// =========================
// SHOW/HIDE PASSWORD
// =========================

togglePassword.addEventListener(
  "click",

  () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  },
);

// =========================
// PASSWORD LOGIN
// =========================

loginForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://scholarhub-backend-w94c.onrender.com/api/auth/login",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      alert(data.message);

      if (data.token) {
        localStorage.setItem(
          "token",

          data.token,
        );

        const payload = JSON.parse(atob(data.token.split(".")[1]));

        if (payload.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
);

// =========================
// LOGIN WITH OTP
// =========================

otpLoginBtn.addEventListener(
  "click",

  async () => {
    try {
      const email = document.getElementById("email").value;

      if (!email) {
        return alert("Enter Email First");
      }

      const response = await fetch(
        "https://scholarhub-backend-w94c.onrender.com/api/auth/send-login-otp",

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

      if (data.message === "Login OTP Sent") {
        localStorage.setItem(
          "loginEmail",

          email,
        );

        window.location.href = "otpindex.html";
      }
    } catch (error) {
      console.log(error);
    }
  },
);
