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

document.getElementById(
"report-name"
).innerText =
user.username || "Unknown User";

document.getElementById(
"report-email"
).innerText =
user.email || "No Email";
document.getElementById(
"report-date"
).innerText =

new Date().toLocaleDateString(
"en-GB",
{
day:"2-digit",
month:"long",
year:"numeric"
}
);
const reportId =
"SH-" +
new Date().getFullYear() +
"-" +
Math.floor(
10000 + Math.random() * 90000
);

document.getElementById(
"report-id"
).innerText =
reportId;
const reportImage =
document.getElementById(
"report-profile-image"
);

if(reportImage){

reportImage.src =
user.profileImage &&
user.profileImage !== ""
? user.profileImage
: "./images/default-avatar.png";

}

// SCORE

const score =
user.resumeScore || 0;

document.getElementById(
"report-score"
).innerText =
`${score}%`;

animateRing(score);
updateGrade(score);
generateAssessment(score);
generateExecutiveSummary(
score,
user
);

generateRoles(
score
);

generateRoadmap(
user.resumeMissingSkills || []
);

generateRecruiterVerdict(
score,
user
);

generateSkillBreakdown(
score,
user
);


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

// ANALYTICS COUNTS

document.getElementById(
"strength-count"
).innerText =
(user.resumeStrengths || []).length;

document.getElementById(
"weakness-count"
).innerText =
(user.resumeWeaknesses || []).length;

document.getElementById(
"skill-count"
).innerText =
(user.resumeMissingSkills || []).length;

createResumeChart(

(user.resumeStrengths || []).length,

(user.resumeWeaknesses || []).length,

(user.resumeMissingSkills || []).length

);

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

element.classList.add(
"pdf-mode"
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

const worker =
html2pdf()
.set(options)
.from(element);

const pdf =
await worker.toPdf().get("pdf");

const totalPages =
pdf.internal.getNumberOfPages();

for(
let i = 1;
i <= totalPages;
i++
){

pdf.setPage(i);

pdf.setFontSize(10);

pdf.setTextColor(
120
);

pdf.text(

`ScholarHub AI Resume Analyzer | Report ID: ${document.getElementById("report-id").innerText} | Page ${i}/${totalPages}`,

105,

290,

{
align:"center"
}

);

}

pdf.save(
"ScholarHub-Resume-Report.pdf"
);

}
catch(error){

console.log(
"PDF ERROR:",
error
);

}
finally{

element.classList.remove(
"pdf-mode"
);

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


function updateGrade(score){

let grade;
let readiness;

if(score >= 95){

grade = "A+";
readiness = "Excellent";

}
else if(score >= 85){

grade = "A";
readiness = "Job Ready";

}
else if(score >= 75){

grade = "B+";
readiness = "Good";

}
else if(score >= 65){

grade = "B";
readiness = "Needs Work";

}
else{

grade = "C";
readiness = "Weak";

}

document.getElementById(
"ats-grade"
).innerText = grade;

document.getElementById(
"job-readiness"
).innerText = readiness;

document.getElementById(
"candidate-grade"
).innerText =
grade;

document.getElementById(
"candidate-readiness"
).innerText =
readiness;

const badge =
document.getElementById(
"ats-badge"
);

if(score >= 85){

badge.innerText =
"Excellent";

}
else if(score >= 70){

badge.innerText =
"Good";

}
else{

badge.innerText =
"Needs Improvement";

}

}

function animateRing(score){

const circle =
document.getElementById(
"progress-ring"
);

if(!circle) return;

const radius = 90;

const circumference =
2 * Math.PI * radius;

const offset =
circumference -
(score / 100) *
circumference;

circle.style.strokeDasharray =
circumference;

circle.style.strokeDashoffset =
offset;

}


function createResumeChart(
strengths,
weaknesses,
skills
){

const canvas =
document.getElementById(
"resumeChart"
);

if(!canvas) return;

new Chart(canvas,{

type:"doughnut",

data:{

labels:[
"Strengths",
"Weaknesses",
"Missing Skills"
],

datasets:[{

data:[
strengths,
weaknesses,
skills
],

backgroundColor:[

"#22c55e",
"#ef4444",
"#f59e0b"

],

borderWidth:0

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:"bottom"

}

}

}

});

}

function generateSkillBreakdown(
score,
user
){

const weaknesses =
(user.resumeWeaknesses || []).length;

const missing =
(user.resumeMissingSkills || []).length;

const tech =
Math.min(
100,
score + 5
);

const projects =
score;

const keywords =
Math.max(
50,
score - missing * 2
);

const structure =
Math.max(
60,
score - weaknesses
);

document.getElementById(
"tech-score"
).innerText =
tech + "%";

document.getElementById(
"project-score"
).innerText =
projects + "%";

document.getElementById(
"keyword-score"
).innerText =
keywords + "%";

document.getElementById(
"structure-score"
).innerText =
structure + "%";

document.getElementById(
"tech-bar"
).style.width =
tech + "%";

document.getElementById(
"project-bar"
).style.width =
projects + "%";

document.getElementById(
"keyword-bar"
).style.width =
keywords + "%";

document.getElementById(
"structure-bar"
).style.width =
structure + "%";

}

function generateExecutiveSummary(
score,
user
){

const strengths =
(user.resumeStrengths || []).length;

const missing =
(user.resumeMissingSkills || []).length;

document.getElementById(
"executive-summary"
).innerText =

`This resume achieved an ATS score of ${score}% with ${strengths} identified strengths and ${missing} missing skills. The profile demonstrates good technical capability and can be improved further by addressing the highlighted skill gaps and ATS optimization recommendations.`;

}

function generateRoles(score){

const roles =
document.getElementById(
"roles-list"
);

roles.innerHTML = "";

let list = [];

if(score >= 85){

list = [
"MERN Stack Developer",
"Frontend Developer",
"Full Stack Developer",
"Software Developer Intern"
];

}
else if(score >= 70){

list = [
"Frontend Intern",
"Web Developer Intern",
"Junior MERN Developer"
];

}
else{

list = [
"Web Development Trainee",
"Frontend Trainee"
];

}

list.forEach(role=>{

roles.innerHTML +=
`<li>${role}</li>`;

});

}

function generateRoadmap(
skills
){

const high =
document.getElementById(
"high-priority"
);

const medium =
document.getElementById(
"medium-priority"
);

const low =
document.getElementById(
"low-priority"
);

high.innerHTML = "";
medium.innerHTML = "";
low.innerHTML = "";

skills.forEach(
(skill,index)=>{

if(index < 3){

high.innerHTML +=
`<li>${skill}</li>`;

}
else if(index < 6){

medium.innerHTML +=
`<li>${skill}</li>`;

}
else{

low.innerHTML +=
`<li>${skill}</li>`;

}

});

}

function generateAssessment(score){

let stars = "";
let text = "";

if(score >= 90){

stars = "★★★★★";

text =
"Excellent resume quality with strong ATS compatibility.";

}
else if(score >= 80){

stars = "★★★★☆";

text =
"Strong resume with minor improvements required.";

}
else if(score >= 70){

stars = "★★★☆☆";

text =
"Good resume but several improvements are recommended.";

}
else if(score >= 60){

stars = "★★☆☆☆";

text =
"Resume needs significant ATS and skill optimization.";

}
else{

stars = "★☆☆☆☆";

text =
"Major improvements required before applying to jobs.";

}

document.getElementById(
"star-rating"
).innerText = stars;

document.getElementById(
"assessment-score"
).innerText =
`${score}/100`;

document.getElementById(
"assessment-text"
).innerText = text;

}


function generateRecruiterVerdict(
score,
user
){

const strengths =
(user.resumeStrengths || []).length;

const missing =
(user.resumeMissingSkills || []).length;

let verdict = "";

if(score >= 85){

verdict =
`This resume demonstrates strong technical competency, good project exposure and excellent ATS readiness. The candidate appears suitable for Full Stack Development, MERN Stack Development and Software Engineering roles. Minor improvements in advanced tools and industry-specific technologies can further strengthen the profile.`;

}
else if(score >= 70){

verdict =
`This resume reflects a solid technical foundation and relevant project experience. The candidate is suitable for internship and entry-level software development opportunities. Addressing the identified skill gaps and ATS optimization recommendations will significantly improve competitiveness in the job market.`;

}
else{

verdict =
`The resume contains foundational skills but requires substantial improvement before being considered highly competitive. Focus should be placed on strengthening projects, adding missing technical skills and improving ATS optimization. A structured improvement plan is strongly recommended.`;

}

document.getElementById(
"recruiter-verdict"
).innerText =
verdict;

}

loadReport();