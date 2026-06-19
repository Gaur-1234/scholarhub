const token =
localStorage.getItem("token");

async function loadJobs(){

try{

const response =
await fetch(
"https://scholarhub-backend-w94c.onrender.com/api/auth/profile",
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

const jobs =
data.user.jobMatches || [];

document.getElementById(
"total-matches"
).innerText =
jobs.length;

if(jobs.length > 0){

document.getElementById(
"best-match"
).innerText =
`${jobs[0].match}%`;

document.getElementById(
"career-readiness"
).innerText =

jobs[0].match >= 85
? "Excellent"

: jobs[0].match >= 70
? "Good"

: "Developing";

}

const container =
document.getElementById(
"job-matches"
);

container.innerHTML = "";

jobs.forEach(job=>{

let badge = "";

if(job.match >= 90){

badge =
"Excellent Match";

}
else if(job.match >= 75){

badge =
"Strong Match";

}
else if(job.match >= 60){

badge =
"Moderate Match";

}
else{

badge =
"Needs Improvement";

}

container.innerHTML += `

<div class="job-card">

<div class="job-header">

<div class="job-title">
${job.title}
</div>

<div class="job-score">
${job.match}%
</div>

</div>

<div class="progress">

<div
class="progress-fill"
style="
width:${job.match}%">
</div>

</div>

<div class="match-badge">
${badge}
</div>

</div>

`;

});

}
catch(error){

console.log(error);

}

}


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
loadJobs();