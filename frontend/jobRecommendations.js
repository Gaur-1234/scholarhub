const token =
localStorage.getItem(
"token"
);

let allRoles = [];

async function loadRecommendations(){

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
data.user.recommendedJobs || [];

allRoles = jobs;

const score =
data.user.resumeScore || 0;

document.getElementById(
"recommended-count"
).innerText =
jobs.length;

document.getElementById(
"resume-score"
).innerText =
`${score}%`;

document.getElementById(
"career-potential"
).innerText =

score >= 85
? "High"

: score >= 70
? "Medium"

: "Growing";

const grid =
document.getElementById(
"recommendation-grid"
);

grid.innerHTML = "";

jobs.forEach((job,index)=>{

grid.innerHTML += `

<div class="recommend-card">

<h3>
${job.role}
</h3>

<p class="short-description">

${job.description.substring(0,100)}...

</p>

<div class="action-buttons">

<button
class="view-more-btn"
onclick="openRoleModal(${index})"
>
View More
</button>

<button
class="apply-now-btn"
onclick="searchJobs('${job.role}')"
>
Apply Now
</button>

</div>

</div>

`;

});

}
catch(error){

console.log(error);

}

}

loadRecommendations();

function openRoleModal(index){

const role =
allRoles[index];

document.getElementById(
"modal-role"
).innerText =
role.role;

document.getElementById(
"modal-description"
).innerText =
role.description;

document.getElementById(
"modal-salary"
).innerText =
role.salaryRange;

document.getElementById(
"modal-growth"
).innerText =
role.growth;

const skills =
document.getElementById(
"modal-skills"
);

skills.innerHTML = "";

(role.requiredSkills || [])
.forEach(skill=>{

skills.innerHTML +=
`<li>${skill}</li>`;

});

document
.getElementById(
"role-modal"
)
.classList.add(
"show"
);

}

document
.getElementById(
"close-modal"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"role-modal"
)
.classList.remove(
"show"
);

});


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

function searchJobs(role){

if(!role){

alert(
"No role selected"
);

return;

}

localStorage.setItem(
"selectedRole",
role
);

window.location.href =
"jobListings.html";

}