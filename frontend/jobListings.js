const token =
localStorage.getItem(
"token"
);

const selectedRole =
localStorage.getItem(
"selectedRole"
);

document.getElementById(
"selected-role"
).innerText =
selectedRole || "Not Selected";

async function loadJobs(){

try{

const grid =
document.getElementById(
"jobs-grid"
);

grid.innerHTML =

`<div class="loading">
Loading Jobs...
</div>`;

const response =
await fetch(

`https://scholarhub-backend-w94c.onrender.com/api/auth/jobs?role=${selectedRole}`,

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

const jobs =
await response.json();
console.log(jobs);
document.getElementById(
"jobs-count"
).innerText =
jobs.length || 0;

grid.innerHTML = "";

if(!jobs.length){

grid.innerHTML =

`<div class="loading">
No Jobs Found
</div>`;

return;

}

jobs.forEach(job=>{

grid.innerHTML += `

<div class="job-card">

<h3>

${job.job_title || "Job Title"}

</h3>

<p class="company">

${job.employer_name || "Company Not Available"}

</p>

<p class="location">

📍 ${job.job_city || "Remote"}

</p>

<div class="salary">

${
job.job_min_salary &&
job.job_max_salary

? `₹${job.job_min_salary} - ₹${job.job_max_salary}`

: "Salary Not Disclosed"
}

</div>

<p class="job-description">

${
job.job_description

? job.job_description.substring(0,200)

: "No description available"
}

...

</p>

<div class="job-actions">
<button
class="apply-btn"
onclick='applyJob(${JSON.stringify(job)})'
>
Apply Now
</button>

<button
class="save-btn"
onclick='saveJob(${JSON.stringify(job)})'
>
Save
</button>

</div>

</div>

`;

});

}

catch(error){

console.log(error);

document.getElementById(
"jobs-grid"
).innerHTML =

`<div class="loading">
Failed To Load Jobs
</div>`;

}

}

async function applyJob(job){

try{

await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/apply-job",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`

},

body:JSON.stringify(job)

}

);

if(job.job_apply_link){

window.open(
job.job_apply_link,
"_blank"
);

}

}
catch(error){

console.log(error);

}

}

async function saveJob(job){

try{

const response =
await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/save-job",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`

},

body:JSON.stringify(job)

}

);

const data =
await response.json();

alert(
data.message
);

}
catch(error){

console.log(error);

}

}

loadJobs();



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