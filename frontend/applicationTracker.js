const token =
localStorage.getItem(
"token"
);

async function loadApplications(){

try{

const response =
await fetch(

"https://scholarhub-backend-w94c.onrender.com/api/auth/applied-jobs",

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
"application-grid"
);

grid.innerHTML = "";

if(!jobs.length){

grid.innerHTML =

`
<div class="empty-state">

<h2>
No Applications Yet
</h2>

<p>
Apply to jobs and track them here.
</p>

</div>
`;

return;

}

jobs.forEach(job=>{

grid.innerHTML += `

<div class="application-card">

<h3>

${job.job_title || job.title}

</h3>

<p class="company">

${job.employer_name || job.company}

</p>

<p class="location">

📍 ${job.job_city || job.location || "Remote"}

</p>

<div class="status">

${job.status || "Applied"}

</div>

<p class="date">

Applied On:

${new Date(
job.appliedDate
).toLocaleDateString()}

</p>

<a

href="${job.job_apply_link}"

target="_blank"

class="apply-link"

>

View Job

</a>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

loadApplications();

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