const sidebarToken =
localStorage.getItem("token");


// LOGOUT

const logoutBtn =
document.getElementById("logout-btn");


if (logoutBtn) {

  logoutBtn.addEventListener(

    "click",

    () => {

      localStorage.clear();

      window.location.href =
      "index.html";

    }

  );

}


// LOGOUT ALL DEVICES

const logoutAllBtn =
document.getElementById("logout-all-btn");


if (logoutAllBtn) {

  logoutAllBtn.addEventListener(

    "click",

    async () => {

      try {

        const response =
        await fetch(

          "https://scholarhub-backend-w94c.onrender.com/api/auth/logout-all",

          {

            method: "POST",

            headers: {

             authorization: sidebarToken

            }

          }

        );


        const data =
        await response.json();

        alert(data.message);

        localStorage.clear();

        window.location.href =
        "index.html";

      }

      catch (error) {

        console.log(error);

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
