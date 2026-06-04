const otpForm = document.getElementById("otp-form");

const resendBtn = document.getElementById("resend-btn");

const timerText = document.getElementById("timer-text");

// =========================
// VERIFY OTP
// =========================

otpForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const otp = document.getElementById("otp").value;

    const response = await fetch(
      "https://scholarhub-backend-w94c.onrender.com/api/auth/verify-otp",

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

    if (data.message === "OTP Verified") {
      window.location.href = "index.html";
    }
  },
);

// =========================
// TIMER
// =========================

let timeLeft = 30;

const timer = setInterval(() => {
  timeLeft--;

  timerText.innerText = `Resend OTP in ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(timer);

    resendBtn.disabled = false;

    timerText.innerText = "";
  }
}, 1000);

// =========================
// RESEND SIGNUP OTP
// =========================

resendBtn.addEventListener(
  "click",

  async () => {
    const email = document.getElementById("email").value;

    const response = await fetch(
      "https://scholarhub-backend-w94c.onrender.com/api/auth/resend-signup-otp",

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

    resendBtn.disabled = true;
  },
);
