const token =
localStorage.getItem(
"token"
);

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

jobs.forEach(job=>{

let description =
"Recommended based on your current resume profile and ATS analysis.";

let readiness =
score >= 85
? "Highly Recommended"

: score >= 70
? "Recommended"

: "Learning Path";

grid.innerHTML += `

<div class="recommend-card">

<h3>
${job}
</h3>

<p>
${description}
</p>

<div class="role-tag">

Career Opportunity

</div>

<br><br>

<div class="readiness">

${readiness}

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