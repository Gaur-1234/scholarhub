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

loadReport();