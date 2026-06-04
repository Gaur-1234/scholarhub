document.addEventListener(
"DOMContentLoaded",

async ()=>{

try{

const token =
localStorage.getItem(
"token"
);

if(!token){

window.location.href =
"login.html";

return;

}

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

const container =
document.getElementById(
"notification-list"
);

container.innerHTML = "";

const notifications =
data.user.notifications || [];

if(
notifications.length === 0
){

container.innerHTML =
"<p>No Notifications</p>";

return;

}

notifications
.reverse()
.forEach(notification=>{

container.innerHTML += `

<div
class="notification-item"
data-id="${notification._id}"
data-message="${notification.message}"
>

<h4>

${notification.read
? "📩 Notification"
: "🔔 New Notification"}

</h4>

<p>

${notification.message}

</p>

<small>

${new Date(
notification.date
).toLocaleString()}

</small>

</div>

`;

});

const modal =
document.getElementById(
"notification-modal"
);

const modalMessage =
document.getElementById(
"modal-message"
);

const closeBtn =
document.getElementById(
"close-modal"
);

document
.querySelectorAll(
".notification-item"
)
.forEach(item=>{

item.addEventListener(
"click",

async ()=>{

const id =
item.dataset.id;

const message =
item.dataset.message;

modalMessage.textContent =
message;

modal.style.display =
"flex";

try{

await fetch(

`https://scholarhub-backend-w94c.onrender.com/api/auth/notification/${id}/read`,

{
method:"PUT",

headers:{
Authorization:
`Bearer ${token}`
}
}

);

item.querySelector(
"h4"
).innerText =
"📩 Notification";

}

catch(error){

console.log(error);

}

}
);

});

closeBtn.addEventListener(
"click",
()=>{

modal.style.display =
"none";

}
);

window.addEventListener(
"click",
(e)=>{

if(
e.target === modal
){

modal.style.display =
"none";

}

}
);

}

catch(error){

console.log(error);

}

});

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