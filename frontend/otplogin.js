const otpLoginForm = document.getElementById("otp-login-form");

const resendBtn = document.getElementById("resend-btn");

const timerText = document.getElementById("timer-text");

// =========================
// VERIFY LOGIN OTP
// =========================

otpLoginForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("loginEmail");

    const otp = document.getElementById("otp").value;

    const response = await fetch(
      "https://scholarhub-backend-w94c.onrender.com/api/auth/verify-login-otp",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
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
  },
);

// =========================
// TIMER
// =========================

let timeLeft = 30;

const startTimer = () => {
  resendBtn.disabled = true;

  const timer = setInterval(() => {
    timeLeft--;

    timerText.innerText = `Resend OTP in ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);

      resendBtn.disabled = false;

      timerText.innerText = "";
    }
  }, 1000);
};

startTimer();

// =========================
// RESEND LOGIN OTP
// =========================

resendBtn.addEventListener(
  "click",

  async () => {
    const email = localStorage.getItem("loginEmail");

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

    // RESET TIMER
    timeLeft = 30;

    startTimer();
  },
);
