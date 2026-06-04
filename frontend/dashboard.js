const token = localStorage.getItem("token");

// =========================
// TOKEN CHECK
// =========================

if (!token) {
  window.location.href = "login.html";
}

// =========================
// PROFILE FETCH
// =========================

fetch(
  "http://https://scholarhub-backend-w94c.onrender.com/api/auth/profile",

  {
    headers: {
      authorization: token,
    },
  },
)
  .then((res) => {
    if (res.status === 401) {
      localStorage.clear();

      window.location.href = "login.html";
    }

    return res.json();
  })

  .then((data) => {
    console.log(data);

    // WELCOME
 const hour =
new Date().getHours();

let greeting = "";

if(hour < 12){

  greeting =
  "Good Morning ☀️";

}

else if(hour < 17){

  greeting =
  "Good Afternoon 🌤️";

}

else{

  greeting =
  "Good Evening 🌙";

}

document.getElementById(
  "welcome-text"
).innerText =

`${greeting}, ${data.user.username}`;

    // =========================
// PROFILE COMPLETION
// =========================
const user = data.user;

// =========================
// ACCOUNT HEALTH SCORE
// =========================

let healthScore = 0;

if(user.isVerified)
healthScore += 25;

if(user.profileImage)
healthScore += 25;

if(user.resumeUrl)
healthScore += 25;

if(
  user.passwordChangeCount > 0
)
healthScore += 25;

document.getElementById(
  "account-health"
).innerText =
`${healthScore}%`;

console.log(user);
let completion = 0;

if(user.username) completion += 25;

if(user.email) completion += 25;

if(user.profileImage) completion += 25;

if(user.resumeUrl) completion += 25;

document.getElementById(
  "profile-completion"
).innerText =
`${completion}%`;


// =========================
// RESUME SCORE
// =========================

document.getElementById(
  "resume-score"
).innerText =
`${user.resumeScore || 0}/100`;


// =========================
// ACTIVITY COUNT
// =========================

document.getElementById(
  "activity-count"
).innerText =
user.activityLogs
? user.activityLogs.length
: 0;


// =========================
// NOTIFICATION COUNT
// =========================

const unreadNotifications =
data.user.notifications?.filter(
notification =>
!notification.read
).length || 0;

document.getElementById(
"notification-count"
).textContent =
unreadNotifications;

// =========================
// LAST LOGIN
// =========================

document.getElementById(
  "last-login-card"
).innerText =

user.lastLogin

? new Date(
    user.lastLogin
  ).toLocaleDateString()

: "No Login";

// =========================
// RECENT ACTIVITY
// =========================

const activityList =
document.getElementById(
  "activity-list"
);

activityList.innerHTML = "";

if(
  user.activityLogs &&
  user.activityLogs.length > 0
){

  user.activityLogs
  .slice(0,5)
  .forEach((log)=>{

   activityList.innerHTML += `
<li class="activity-item">

<div class="activity-action">
${log.action}
</div>

<div class="activity-date">
${new Date(
  log.date
).toLocaleString()}
</div>

</li>
`;
  });

}
else{

  activityList.innerHTML =
  "<li>No Activity Found</li>";

}

  // VERIFY STATUS & ROLE

const verifyStatus =
document.getElementById(
"verify-status"
);

if(verifyStatus){

verifyStatus.innerHTML =
user.isVerified
? "Email Verified ✅"
: "Email Not Verified ❌";

}

const roleStatus =
document.getElementById(
"role-status"
);

if(roleStatus){

roleStatus.innerHTML =
`Role: ${user.role}`;

}
// =========================
// NORMAL LOGOUT
// =========================

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener(
  "click",

  () => {
    localStorage.clear();

    window.location.href = "login.html";
  },
);

// =========================
// LOGOUT ALL DEVICES
// =========================

const logoutAllBtn = document.getElementById("logout-all-btn");

logoutAllBtn.addEventListener(
  "click",

  async () => {
    try {
      const response = await fetch(
        "http://https://scholarhub-backend-w94c.onrender.com/api/auth/logout-all",

        {
          method: "POST",

          headers: {
            authorization: token,
          },
        },
      );

      const data = await response.json();

      alert(data.message);

      localStorage.clear();

      window.location.href = "login.html";
    } catch (error) {
      console.log(error);
    }
  },
);
  })

  document
.getElementById(
"edit-profile-btn"
)
.addEventListener(
"click",
()=>{
window.location.href =
"profile.html";
}
);

document
.getElementById(
"upload-resume-btn"
)
.addEventListener(
"click",
()=>{
window.location.href =
"profile.html";
}
);

document
.getElementById(
"security-btn"
)
.addEventListener(
"click",
()=>{
window.location.href =
"security.html";
}
);

// =========================
// MOBILE HAMBURGER MENU
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

// Open / Close Menu

menuToggle.addEventListener(
"click",
(e)=>{

e.stopPropagation();

sidebar.classList.toggle(
"active"
);

// Change Icon

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

// Click Outside -> Close Menu

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

// Click Sidebar Link -> Close Menu

const sidebarLinks =
document.querySelectorAll(
".sidebar a"
);

sidebarLinks.forEach(link=>{

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

});

// Window Resize

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