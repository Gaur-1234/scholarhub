const token =
localStorage.getItem("token");

if (!token) {

  window.location.href =
  "login.html";

}

fetch(

  "http://localhost:5000/api/auth/profile",

  {

    headers: {

      authorization:
      token

    }

  }

)

.then((res) => res.json())

.then((data) => {

  const welcome =
  document.getElementById(
    "welcome-text"
  );

  if (welcome) {

    welcome.innerText =
    `Welcome Admin ${data.user.username}`;

  }

})

.catch((err) => {

  console.log(err);

});

async function loadUsers(){

try{

const response =
await fetch(

"http://localhost:5000/api/auth/admin/users",

{

headers:{

authorization:
token

}

}

);

const data =
await response.json();

const dropdown =
document.getElementById(
"notification-user"
);

const normalUsers =
data.users.filter(
user => user.role !== "admin"
);

normalUsers.forEach(user=>{

dropdown.innerHTML += `

<option value="${user._id}">
${user.username}
(${user.email})
</option>

`;

});

}

catch(error){

console.log(error);

}

}

loadUsers();


const sendBtn =
document.getElementById(
"send-notification-btn"
);

if(sendBtn){

sendBtn.addEventListener(

"click",

async()=>{

try{

const userId =
document.getElementById(
"notification-user"
).value;

const broadcast =
document.getElementById(
"broadcast-all"
).checked;

const message =
document.getElementById(
"notification-message"
).value;

const response =
await fetch(

"http://localhost:5000/api/auth/admin/send-notification",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

authorization:
token

},

body:JSON.stringify({

userId,
message,
broadcast

})

}

);

const data =
await response.json();

alert(
data.message
);

document.getElementById(
"notification-message"
).value = "";

document.getElementById(
"notification-user"
).selectedIndex = 0;

document.getElementById(
"broadcast-all"
).checked = false;

}

catch(error){

console.log(error);

}

}

);

}

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

  // Sidebar Link Click = Close

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