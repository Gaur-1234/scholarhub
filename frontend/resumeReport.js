const token =
localStorage.getItem(
"token"
);

async function loadReport(){

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

const user =
data.user;

// SCORE

document.getElementById(
"report-score"
).innerText =
`${user.resumeScore || 0}/100`;

// VERDICT

document.getElementById(
"report-verdict"
).innerText =
user.resumeVerdict ||
"Not Available";

// SUMMARY

document.getElementById(
"report-summary"
).innerText =
user.resumeSummary ||
"No Summary";

// STRENGTHS

const strengths =
document.getElementById(
"strengths-list"
);

strengths.innerHTML = "";

(
user.resumeStrengths || []
).forEach(item=>{

strengths.innerHTML +=
`<li>${item}</li>`;

});

// WEAKNESSES

const weaknesses =
document.getElementById(
"weaknesses-list"
);

weaknesses.innerHTML = "";

(
user.resumeWeaknesses || []
).forEach(item=>{

weaknesses.innerHTML +=
`<li>${item}</li>`;

});

// MISSING SKILLS

const skills =
document.getElementById(
"missing-skills-list"
);

skills.innerHTML = "";

(
user.resumeMissingSkills || []
).forEach(item=>{

skills.innerHTML +=
`<li>${item}</li>`;

});

// SUGGESTIONS

const suggestions =
document.getElementById(
"suggestions-list"
);

suggestions.innerHTML = "";

(
user.resumeSuggestions || []
).forEach(item=>{

suggestions.innerHTML +=
`<li>${item}</li>`;

});

}
catch(error){

console.log(error);

}

}

const downloadBtn =
document.getElementById(
"download-report-btn"
);

if(downloadBtn){

downloadBtn.addEventListener(
"click",

async ()=>{

const element =
document.getElementById(
"report-content"
);

downloadBtn.disabled = true;

downloadBtn.innerHTML =
"Downloading...";

const options = {

margin:[5,5],

filename:
"ScholarHub-Resume-Report.pdf",

image:{
type:"jpeg",
quality:0.98
},

html2canvas:{
scale:1.5,
useCORS:true,
scrollY:0
},

pagebreak:{
mode:[
"avoid-all",
"css",
"legacy"
]
},

jsPDF:{
unit:"mm",
format:"a4",
orientation:"portrait"
}

};

try{

await html2pdf()
.set(options)
.from(element)
.save();

}
catch(error){

console.log(
"PDF ERROR:",
error
);

}
finally{

downloadBtn.disabled = false;

downloadBtn.innerHTML =
"📄 Download Report";

}

}

);

}

const menuToggle =
document.getElementById(
"menu-toggle"
);

const sidebar =
document.querySelector(
".sidebar"
);

if(menuToggle && sidebar){

menuToggle.addEventListener(
"click",
(e)=>{

e.stopPropagation();

sidebar.classList.toggle(
"active"
);

menuToggle.innerHTML =
sidebar.classList.contains(
"active"
)
? "✕"
: "☰";

}
);

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

loadReport();