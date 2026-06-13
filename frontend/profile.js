// ==========================
// PROFILE PAGE
// ==========================



document.addEventListener("DOMContentLoaded", async () => {


const downloadResumeBtn =
  document.getElementById(
    "download-resume-btn"
  );

  const missingSkillsElement =
  document.getElementById(
    "missing-skills"
  );

let currentResume = "";



  const uploadInput =
    document.getElementById("profile-upload");

  const profileImage =
    document.getElementById("profile-image");
  


//---------------------
// DOWNLOAD RESUME
//----------------------

downloadResumeBtn.addEventListener(
  "click",
  () => {

    if (!currentResume) {
      alert("No Resume Uploaded");
      return;
    }

    window.open(
      `https://scholarhub-backend-w94c.onrender.com/uploads/${currentResume}`,
      "_blank"
    );

  }
);
 // ==========================
// LOAD PROFILE DATA
// ==========================

try {

  const token =
    localStorage.getItem("token");

  if (!token) {

    window.location.href =
      "index.html";

    return;
  }

  const response =
    await fetch(
      "https://scholarhub-backend-w94c.onrender.com/api/auth/profile",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  const data =
    await response.json();

  if (data.user) {

    document.getElementById(
      "profile-name"
    ).textContent =
      data.user.username;

    document.getElementById(
      "profile-role"
    ).textContent =
      data.user.role;

    document.getElementById(
      "username"
    ).value =
      data.user.username;

    document.getElementById(
      "email"
    ).value =
      data.user.email;

    document.getElementById(
      "role"
    ).value =
      data.user.role;

    document.getElementById(
      "join-date"
    ).value =
      new Date(
        data.user.joinDate
      ).toLocaleString();

    document.getElementById(
      "last-login"
    ).value =
    data.user.lastLogin
      ? new Date(
          data.user.lastLogin
        ).toLocaleString()
      : "No Login";

    document.getElementById(
      "resume-score"
    ).textContent =
    `${data.user.resumeScore}/100`;

    document.getElementById(
      "resume-name"
    ).textContent =
    data.user.resumeUrl ||
    "No Resume";

    document.getElementById(
      "login-count"
    ).textContent =
    `Login Count : ${
      data.user.loginHistory?.length || 0
    }`;

    document.getElementById(
      "profile-count"
    ).textContent =
    `Profile Updates : ${
      data.user.activityLogs?.filter(
        log =>
        log.action ===
        "Profile Updated"
      ).length || 0
    }`;

    document.getElementById(
      "password-count"
    ).textContent =
    `Password Changes : ${
      data.user.passwordChangeCount || 0
    }`;
  
// ==========================
// MISSING SKILLS
// ==========================

missingSkillsElement.textContent =
"Missing Skills: " +
(
  data.user.resumeMissingSkills?.join(", ")
  || "None"
);

const strengthsList =
document.getElementById(
"strengths-list"
);

if(strengthsList){

strengthsList.innerHTML = "";

(
data.user.resumeStrengths || []
).forEach(item => {


strengthsList.innerHTML +=
`<li>${item}</li>`;


});

}

const weaknessesList =
document.getElementById(
"weaknesses-list"
);

if(weaknessesList){

weaknessesList.innerHTML = "";

(
data.user.resumeWeaknesses || []
).forEach(item => {


weaknessesList.innerHTML +=
`<li>${item}</li>`;


});

}

const summaryElement =
document.getElementById(
"resume-summary"
);

if(summaryElement){

summaryElement.textContent =
data.user.resumeSummary ||
"No Analysis Available";

}

const verdictElement =
document.getElementById(
"resume-verdict"
);

if(verdictElement){

verdictElement.textContent =
data.user.resumeVerdict ||
"Not Available";

}

// ==========================
// GEMINI SUGGESTIONS
// ==========================

const suggestionList =
document.getElementById(
"suggestions-list"
);

if(suggestionList){

suggestionList.innerHTML = "";

(
data.user.resumeSuggestions || []
).forEach(item => {


suggestionList.innerHTML +=
`<li>${item}</li>`;


});

}

// ==========================
// SKILL PROGRESS
// ==========================

const skillContainer =
document.getElementById(
"skill-progress-list"
);

if(skillContainer){

skillContainer.innerHTML = "";

const allSkills = [
"html",
"css",
"javascript",
"node",
"express",
"mongodb",
"react",
"git",
"github"
];

const missingSkills =
data.user.resumeMissingSkills || [];

allSkills.forEach((skill)=>{


let value = 90;

const foundMissing =
missingSkills.some(
  s =>
  s.toLowerCase() ===
  skill.toLowerCase()
);

if(foundMissing){

  value = 25;

}

skillContainer.innerHTML += `

<div class="skill-item">

  <div class="skill-top">

    <span>${skill.toUpperCase()}</span>

    <span>${value}%</span>

  </div>

  <div class="skill-bar">

    <div
    class="skill-fill"
    style="width:${value}%"
    >
    </div>

  </div>

</div>

`;


});

}

// ==========================
// IMAGE UPLOAD
// ==========================

if (uploadInput) {

  uploadInput.addEventListener(
    "change",
    (event) => {

      const file =
        event.target.files[0];

      if (!file) return;

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Please select a valid image file."
        );

        return;

      }

      const reader =
        new FileReader();

      reader.onload =
      function (e) {

        const imageData =
        e.target.result;

        profileImage.src =
        imageData;

      };

      reader.readAsDataURL(
        file
      );

    }
  );

}

} // if(data.user)

} // try

catch (error) {

  console.log(
    "PROFILE ERROR:",
    error
  );

}

}); // DOMContentLoaded ends here
// ==========================
// SAVE PROFILE
// ==========================

const saveBtn =
  document.getElementById(
    "save-profile-btn"
  );

saveBtn.addEventListener(
  "click",

  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const username =
        document.getElementById(
          "username"
        ).value;
      const email =
        document.getElementById(
          "email"
        ).value;

     const profileImage =
document.getElementById(
  "profile-image"
).src;
      const response =
        await fetch(
          "https://scholarhub-backend-w94c.onrender.com/api/auth/profile",
          {
            method: "PUT",

            headers: {

              "Content-Type":
              "application/json",

              Authorization:
              `Bearer ${token}`

            },

            body: JSON.stringify({

              username,
              email,
              profileImage

            })

          }
        );

      const data =
        await response.json();

      alert(data.message);

    }

    catch (error) {

      console.log(error);

    }

  }
);

const removePhotoBtn =
document.getElementById(
  "remove-photo-btn"
);

removePhotoBtn.addEventListener(
  "click",

  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "https://scholarhub-backend-w94c.onrender.com/api/auth/remove-profile-photo",
          {
            method: "PUT",

            headers: {
              "Content-Type":
              "application/json",

              Authorization:
              `Bearer ${token}`
            },

            body: JSON.stringify({

              profileImage: ""

            })

          }
        );

      const data =
        await response.json();

      alert(data.message);

      document.getElementById(
"profile-image"
).src =
"./images/default-avatar.png";

      localStorage.removeItem(
        "profileImage"
      );

    }

    catch(error){

      console.log(error);

    }

  }
);

  


// ==========================
// RESUME ANALYZER
// ==========================

const analyzeResumeBtn =
document.getElementById(
  "analyze-resume-btn"
);

const resumeScoreElement =
document.getElementById(
  "resume-score"
);

const resumeNameElement =
document.getElementById(
  "resume-name"
);

analyzeResumeBtn.addEventListener(
  "click",

  async () => {

    try {

      const fileInput =
      document.getElementById(
        "resume-upload"
      );

      if(
        !fileInput ||
        !fileInput.files ||
        fileInput.files.length === 0
      ){

        alert(
          "Select Resume First"
        );

        return;

      }

      const file =
      fileInput.files[0];

      // =========================
// MOBILE PDF NOTE
// =========================

if (
  file.type !== "application/pdf"
) {

  alert(
    "Please select a PDF from your Downloads folder. Google Drive files may not upload correctly on some mobile devices."
  );

  return;

}

      const token =
      localStorage.getItem(
        "token"
      );

      if(!token){

        alert(
          "Please Login Again"
        );

        window.location.href =
        "index.html";

        return;

      }

      analyzeResumeBtn.disabled =
      true;

      analyzeResumeBtn.innerText =
      "Analyzing...";

      const formData =
      new FormData();

      formData.append(
        "resume",
        file
      );


const response =
await fetch(
  "https://scholarhub-backend-w94c.onrender.com/api/auth/resume",
  {
    method: "POST",

  headers: {

  "Authorization":
  `Bearer ${token}`,

  "Accept":
  "application/json"

},

    body: formData
  }
);

console.log(
  "STATUS:",
  response.status
);

      const data =
      await response.json();

      if(!response.ok){

        throw new Error(
          data.message ||
          "Resume Analysis Failed"
        );

      }

      resumeScoreElement.textContent =
      `${data.resumeScore}/100`;

      resumeNameElement.textContent =
      data.resumeName ||
      file.name;

      // =========================
      // MISSING SKILLS
      // =========================

      const missingSkillsElement =
      document.getElementById(
        "missing-skills"
      );

      if(missingSkillsElement){

        missingSkillsElement.textContent =
        "Missing Skills: " +
        (
          data.missingSkills &&
          data.missingSkills.length > 0
          ? data.missingSkills.join(", ")
          : "None"
        );

      }

      // =========================
      // SUGGESTIONS
      // =========================

      const suggestionList =
      document.getElementById(
        "suggestions-list"
      );

      if(suggestionList){

        suggestionList.innerHTML = "";

        const suggestions = [];

        if(
          data.missingSkills &&
          data.missingSkills.length > 0
        ){

          suggestions.push(
            "Include missing ATS keywords: " +
            data.missingSkills.join(", ")
          );

        }

        if(
          data.resumeScore >= 80
        ){

          suggestions.push(
            "Resume is ATS friendly."
          );

          suggestions.push(
            "Add measurable achievements in projects."
          );

          suggestions.push(
            "Use action verbs like Developed, Built, Designed."
          );

        }

        if(
          data.resumeScore < 60
        ){

          suggestions.push(
            "Add more technical skills and projects."
          );

          suggestions.push(
            "Improve ATS keyword coverage."
          );

        }

        suggestions.forEach(
          (item)=>{

            suggestionList.innerHTML +=
            `<li>${item}</li>`;

          }
        );

      }

      if(
        typeof currentResume !==
        "undefined"
      ){

        currentResume =
        data.resumeUrl || "";

      }

   alert(
  data.message ||
  "Resume Analyzed Successfully"
);

setTimeout(() => {

  window.location.reload();

}, 1000);

    }

catch(error){

  console.error(
    "RESUME ERROR:",
    error
  );

  alert(
    `${error.name}\n${error.message}`
  );

}

    finally{

      analyzeResumeBtn.disabled =
      false;

      analyzeResumeBtn.innerText =
      "Analyze Resume";

    }

  }

);
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