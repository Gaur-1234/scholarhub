const token =
localStorage.getItem(
"token"
);

async function loadSavedJobs(){

try{

const response =
await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/saved-jobs",

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

const jobs =
await response.json();

const grid =
document.getElementById(
"saved-jobs-grid"
);

grid.innerHTML = "";

if(!jobs.length){

grid.innerHTML =

`
<div class="empty-state">

<h2>
No Saved Jobs
</h2>

<p>
Save jobs from Job Listings page.
</p>

</div>
`;

return;

}

jobs.forEach(job=>{

grid.innerHTML += `

<div class="saved-job-card">

<h3>

${job.job_title || job.title}

</h3>

<p class="company">

${job.employer_name || job.company}

</p>

<p class="location">

📍 ${job.job_city || job.location || "Remote"}

</p>

<div class="salary">

${
job.job_min_salary &&
job.job_max_salary

? `₹${job.job_min_salary} - ${job.job_max_salary}`

: "Salary Not Disclosed"
}

</div>

<p class="job-description">

${
job.job_description

? job.job_description.substring(0,180)

: "No description available"
}

...

</p>

<div class="job-actions">

<button
class="apply-btn"
onclick="applySavedJob(
'${job.job_apply_link}'
)"
>

Apply Now

</button>

<button
class="remove-btn"
onclick="removeSavedJob(
'${job.job_id}'
)"
>

Remove

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

function applySavedJob(link){

if(!link){

alert(
"No application link available"
);

return;

}

window.open(
link,
"_blank"
);

}

async function removeSavedJob(jobId){

alert(
"Remove API next phase"
);

}

loadSavedJobs();

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