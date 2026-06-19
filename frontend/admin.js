let analyticsData = null;

const token =
localStorage.getItem("token");

if (!token) {

  window.location.href =
  "index.html";

}

fetch(

  "https://scholarhub-backend-w94c.onrender.com/api/auth/profile",

  {

    headers: {

      authorization:
      token

    }

  }

)

.then((res) => res.json())

.then((data) => {

  const welcome =
  document.getElementById(
    "welcome-text"
  );

  if (welcome) {

    welcome.innerText =
    `Welcome Admin ${data.user.username}`;

  }

})

.catch((err) => {

  console.log(err);

});

async function loadUsers(){

try{

const response =
await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/admin/users",

{

headers:{

authorization:
token

}

}

);

const data =
await response.json();

const dropdown =
document.getElementById(
"notification-user"
);

const normalUsers =
data.users.filter(
user => user.role !== "admin"
);

normalUsers.forEach(user=>{

dropdown.innerHTML += `

<option value="${user._id}">
${user.username}
(${user.email})
</option>

`;

});

}

catch(error){

console.log(error);

}

}

loadUsers();


const sendBtn =
document.getElementById(
"send-notification-btn"
);

if(sendBtn){

sendBtn.addEventListener(

"click",

async()=>{

try{

const userId =
document.getElementById(
"notification-user"
).value;

const broadcast =
document.getElementById(
"broadcast-all"
).checked;

const message =
document.getElementById(
"notification-message"
).value;

const response =
await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/admin/send-notification",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

authorization:
token

},

body:JSON.stringify({

userId,
message,
broadcast

})

}

);

const data =
await response.json();

alert(
data.message
);

document.getElementById(
"notification-message"
).value = "";

document.getElementById(
"notification-user"
).selectedIndex = 0;

document.getElementById(
"broadcast-all"
).checked = false;

}

catch(error){

console.log(error);

}

}

);

}

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

  // Sidebar Link Click = Close

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


async function loadAnalytics(){

try{

const response =
await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/admin/analytics",

{

headers:{

authorization:
token

}

}

);

const data =
await response.json();

analyticsData = data;


document.getElementById(
"total-users"
).innerText =
data.totalUsers || 0;

document.getElementById(
"resumes-analyzed"
).innerText =
data.resumesAnalyzed || 0;

document.getElementById(
"avg-score"
).innerText =
`${data.averageScore || 0}%`;

document.getElementById(
"highest-score"
).innerText =
`${data.highestScore || 0}%`;

document.getElementById(
"lowest-score"
).innerText =
`${data.lowestScore || 0}%`;

document.getElementById(
"top-role"
).innerText =
data.topRole || "-";
renderCharts();

}

catch(error){

console.log(
"Analytics Error:",
error
);

}

}

function renderCharts(){

if(!analyticsData) return;

/* ATS CHART */

new Chart(

document.getElementById(
"atsChart"
),

{

type:"doughnut",

data:{

labels:

Object.keys(
analyticsData.atsDistribution
),

datasets:[{

data:

Object.values(
analyticsData.atsDistribution
)

}]

},

options:{

responsive:true

}

}

);

/* TOP ROLES */

new Chart(

document.getElementById(
"rolesChart"
),

{

type:"bar",

data:{

labels:

analyticsData.topRoles
.map(r=>r.role),

datasets:[{

label:"Users",

data:

analyticsData.topRoles
.map(r=>r.count)

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

}

);

/* MISSING SKILLS */

new Chart(

document.getElementById(
"skillsChart"
),

{

type:"bar",

data:{

labels:

analyticsData.topMissingSkills
.map(s=>s.skill),

datasets:[{

label:"Count",

data:

analyticsData.topMissingSkills
.map(s=>s.count)

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

}

);

}

loadAnalytics();