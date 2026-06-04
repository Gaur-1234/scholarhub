// ==========================
// SECURITY STATUS
// ==========================

document.addEventListener(
  "DOMContentLoaded",

  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        "https://scholarhub-backend-w94c.onrender.com/api/auth/profile",
        {

          headers: {

            Authorization:
            `Bearer ${token}`

          }

        }
      );

    const data =
      await response.json();

    if (!data.user) return;

    document.getElementById(
      "email-status"
    ).textContent =
      data.user.isVerified
      ? "✅ Email Verified"
      : "❌ Email Not Verified";

    document.getElementById(
      "password-status"
    ).textContent =
      data.user.passwordChangeCount > 0
      ? "✅ Strong Password"
      : "⚠️ Change Password Recommended";

    document.getElementById(
      "account-status"
    ).textContent =
      "✅ Account Active";

// ==========================
// LOGIN HISTORY
// ==========================

const historyList =
  document.getElementById(
    "login-history-list"
  );

historyList.innerHTML = "";

data.user.loginHistory.forEach(
  login => {

    const li =
      document.createElement(
        "li"
      );
let browserName = "Unknown Browser";

if (
  login.browser.includes(
    "Chrome"
  )
) {

  browserName =
    "Chrome Browser";

}

else if (
  login.browser.includes(
    "Edge"
  )
) {

  browserName =
    "Edge Browser";

}

else if (
  login.browser.includes(
    "Firefox"
  )
) {

  browserName =
    "Firefox Browser";

}

li.textContent =
`${browserName} - ${new Date(
  login.date
).toLocaleString()}`;

    historyList.appendChild(
      li
    );

  }
);

  }
);


const updatePasswordBtn =
document.getElementById(
  "update-password-btn"
);

updatePasswordBtn.addEventListener(
  "click",

  async () => {

    const currentPassword =
      document.getElementById(
        "current-password"
      ).value;

    const newPassword =
      document.getElementById(
        "new-password"
      ).value;

    const confirmPassword =
      document.getElementById(
        "confirm-password"
      ).value;

    if (
      newPassword !==
      confirmPassword
    ) {

      alert(
        "Passwords do not match"
      );

      return;

    }

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        "https://scholarhub-backend-w94c.onrender.com/api/auth/change-password",
        {

          method: "PUT",

          headers: {

            "Content-Type":
            "application/json",

            Authorization:
            `Bearer ${token}`

          },

          body: JSON.stringify({

            currentPassword,
            newPassword

          })

        }
      );

    const data =
      await response.json();

    alert(
      data.message
    );

  }
);

// ==========================
// DELETE ACCOUNT
// ==========================

const deleteBtn =
document.getElementById(
  "delete-account-btn"
);

deleteBtn.addEventListener(
  "click",

  async () => {

    const confirmDelete =
      confirm(
        "Are you sure you want to delete your account?"
      );

    if (!confirmDelete)
      return;

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        "https://scholarhub-backend-w94c.onrender.com/api/auth/delete-account",
        {

          method: "DELETE",

          headers: {

            Authorization:
            `Bearer ${token}`

          }

        }
      );

    const data =
      await response.json();

    alert(
      data.message
    );

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "index.html";

  }
);

// =========================
// HAMBURGER MENU SYSTEM
// =========================

const menuToggle =
document.getElementById(
"menu-toggle"
);

const sidebar =
document.querySelector(
".sidebar"
);

if(menuToggle && sidebar){

  // Open / Close Sidebar

  menuToggle.addEventListener(
    "click",
    (e)=>{

      e.stopPropagation();

      sidebar.classList.toggle(
        "active"
      );

      if(
        sidebar.classList.contains(
          "active"
        )
      ){

        menuToggle.innerHTML =
        "✕";

      }

      else{

        menuToggle.innerHTML =
        "☰";

      }

    }
  );

  // Click Outside = Close

  document.addEventListener(
    "click",
    (e)=>{

      if(
        window.innerWidth <= 768 &&
        sidebar.classList.contains(
          "active"
        ) &&
        !sidebar.contains(
          e.target
        )
      ){

        sidebar.classList.remove(
          "active"
        );

        menuToggle.innerHTML =
        "☰";

      }

    }
  );

  // Sidebar Links Close Menu

  const sidebarLinks =
  document.querySelectorAll(
    ".sidebar a"
  );

  sidebarLinks.forEach(
    (link)=>{

      link.addEventListener(
        "click",
        ()=>{

          if(
            window.innerWidth <= 768
          ){

            sidebar.classList.remove(
              "active"
            );

            menuToggle.innerHTML =
            "☰";

          }

        }
      );

    }
  );

  // Resize Reset

  window.addEventListener(
    "resize",
    ()=>{

      if(
        window.innerWidth > 768
      ){

        sidebar.classList.remove(
          "active"
        );

        menuToggle.innerHTML =
        "☰";

      }

    }
  );

}