const signupForm = document.getElementById("signup-form");

const passwordInput = document.getElementById("password");

const confirmPasswordInput = document.getElementById("confirm-password");

const toggleSignupPassword = document.getElementById("toggle-signup-password");

const toggleConfirmPassword = document.getElementById(
  "toggle-confirm-password",
);

// =========================
// PASSWORD RULES
// =========================

const ruleLength = document.getElementById("rule-length");

const ruleUppercase = document.getElementById("rule-uppercase");

const ruleLowercase = document.getElementById("rule-lowercase");

const ruleNumber = document.getElementById("rule-number");

const ruleSpecial = document.getElementById("rule-special");

// =========================
// STRENGTH BAR
// =========================

const strengthBar = document.getElementById("strength-bar");

const strengthText = document.getElementById("strength-text");

// =========================
// SHOW/HIDE PASSWORD
// =========================

toggleSignupPassword.addEventListener(
  "click",

  () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  },
);

toggleConfirmPassword.addEventListener(
  "click",

  () => {
    if (confirmPasswordInput.type === "password") {
      confirmPasswordInput.type = "text";
    } else {
      confirmPasswordInput.type = "password";
    }
  },
);

// =========================
// LIVE PASSWORD VALIDATION
// =========================

passwordInput.addEventListener(
  "input",

  () => {
    const password = passwordInput.value;

    let strength = 0;

    // LENGTH
    if (password.length >= 8) {
      ruleLength.innerHTML = "✅ 8+ characters";

      ruleLength.style.color = "#22c55e";

      strength++;
    } else {
      ruleLength.innerHTML = "❌ 8+ characters";

      ruleLength.style.color = "#64748b";
    }

    // UPPERCASE
    if (/[A-Z]/.test(password)) {
      ruleUppercase.innerHTML = "✅ Uppercase letter";

      ruleUppercase.style.color = "#22c55e";

      strength++;
    } else {
      ruleUppercase.innerHTML = "❌ Uppercase letter";

      ruleUppercase.style.color = "white";
    }

    // LOWERCASE
    if (/[a-z]/.test(password)) {
      ruleLowercase.innerHTML = "✅ Lowercase letter";

      ruleLowercase.style.color = "#22c55e";

      strength++;
    } else {
      ruleLowercase.innerHTML = "❌ Lowercase letter";

      ruleLowercase.style.color = "white";
    }

    // NUMBER
    if (/\d/.test(password)) {
      ruleNumber.innerHTML = "✅ Number";

      ruleNumber.style.color = "#22c55e";

      strength++;
    } else {
      ruleNumber.innerHTML = "❌ Number";

      ruleNumber.style.color = "white";
    }

    // SPECIAL CHARACTER
    if (/[@$!%*?&]/.test(password)) {
      ruleSpecial.innerHTML = "✅ Special character";

      ruleSpecial.style.color = "#22c55e";

      strength++;
    } else {
      ruleSpecial.innerHTML = "❌ Special character";

      ruleSpecial.style.color = "white";
    }

    // =========================
    // STRENGTH BAR
    // =========================

    if (strength <= 2) {
      strengthBar.style.width = "33%";

      strengthBar.style.background = "red";

      strengthText.innerHTML = "Weak Password";
    } else if (strength <= 4) {
      strengthBar.style.width = "66%";

      strengthBar.style.background = "orange";

      strengthText.innerHTML = "Medium Password";
    } else {
      strengthBar.style.width = "100%";

      strengthBar.style.background = "limegreen";

      strengthText.innerHTML = "Strong Password";
    }
  },
);

// =========================
// SIGNUP
// =========================

signupForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirm-password").value;

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    // STRONG PASSWORD
    if (!strongPassword.test(password)) {
      return alert(
        "Password must contain uppercase, lowercase, number, special character and 8+ characters",
      );
    }

    // CAPTCHA
    const captcha = grecaptcha.getResponse();

    if (!captcha) {
      return alert("Please complete captcha");
    }

    try {
      const response = await fetch(
        "https://scholarhub-backend-w94c.onrender.com/api/auth/signup",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,

            email,

            password,

            captcha,
          }),
        },
      );

      const data = await response.json();

      alert(data.message);

      // OTP PAGE
      if (data.message === "OTP Sent To Email") {
        window.location.href = "verifyOtp.html";
      }
    } catch (error) {
      console.log(error);
    }
  },
);
