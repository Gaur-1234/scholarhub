const userToken = localStorage.getItem("token");
console.log("users.js loaded");
let currentPage = 1;

let totalPages = 1;

let currentSearch = "";

async function loadStats() {
try {
const response = await fetch(
"https://scholarhub-backend-w94c.onrender.com/api/auth/admin/stats",
{
headers: {
authorization: userToken,
},
}
);


const data = await response.json();

document.getElementById("total-users").innerText =
  data.totalUsers;

document.getElementById("verified-users").innerText =
  data.verifiedUsers;

document.getElementById("admin-users").innerText =
  data.adminUsers;


} catch (error) {
console.log(error);
}
}

async function loadUsers() {
try {
const response = await fetch(
`https://scholarhub-backend-w94c.onrender.com/api/auth/admin/users?page=${currentPage}&search=${currentSearch}`,
{
headers: {
authorization: userToken,
},
}
);


const data = await response.json();

const users = data.users;

totalPages = data.totalPages;

document.getElementById(
  "page-number"
).innerText =
`Page ${data.currentPage} of ${data.totalPages}`;

const tableBody =
  document.getElementById(
    "users-table-body"
  );

tableBody.innerHTML = "";

users.forEach((user) => {
  let adminButton = "";

 if (user.role === "admin") {

  adminButton = `
    <button
      class="delete-btn"
      onclick="removeAdmin('${user._id}')"
    >
      Remove Admin
    </button>
  `;

} else {

  adminButton = `
    <button
      class="admin-btn"
      onclick="makeAdmin('${user._id}')"
    >
      Make Admin
    </button>
  `;

}
tableBody.innerHTML += `

<tr>

  <td>

    <input
      type="checkbox"
      class="user-checkbox"
      value="${user._id}"
    >

  </td>

  <td>${user.username}</td>

  <td>${user.email}</td>

  <td>${user.role}</td>

  <td>

    ${user.isVerified ? "✅" : "❌"}

  </td>

  <td>

    ${adminButton}

    <button
      class="delete-btn"
      onclick="deleteUser('${user._id}')"
    >
      Delete
    </button>

  </td>

</tr>

`;

});

} catch (error) {

  console.log(error);

}

}

async function deleteUser(id) {
const confirmDelete = confirm(
"Delete this user?"
);

if (!confirmDelete) {
return;
}

try {
const response = await fetch(
`https://scholarhub-backend-w94c.onrender.com/api/auth/admin/user/${id}`,
{
method: "DELETE",
headers: {
authorization: userToken,
},
}
);


const data = await response.json();

alert(data.message);

loadUsers();
loadStats();

} catch (error) {
console.log(error);
}
}

async function makeAdmin(id) {
try {
const response = await fetch(
`https://scholarhub-backend-w94c.onrender.com/api/auth/admin/make-admin/${id}`,
{
method: "PUT",
headers: {
authorization: userToken,
},
}
);

const data = await response.json();

alert(data.message);

loadUsers();
loadStats();


} catch (error) {
console.log(error);
}
}
async function removeAdmin(id) {

  try {

    const response = await fetch(

      `https://scholarhub-backend-w94c.onrender.com/api/auth/admin/remove-admin/${id}`,

      {

        method: "PUT",

        headers: {

          authorization: userToken

        }

      }

    );

    const data = await response.json();

    alert(data.message);

    loadUsers();

    loadStats();

  }

  catch (error) {

    console.log(error);

  }

}

loadStats();
loadUsers();

const searchInput =
document.getElementById(
  "search-user"
);

searchInput.addEventListener(

  "keyup",

  () => {

    currentSearch =
    searchInput.value;

    currentPage = 1;

    loadUsers();

  }

);

const modal =
document.getElementById(
  "user-modal"
);

const addUserBtn =
document.getElementById(
  "add-user-btn"
);

const closeModalBtn =
document.getElementById(
  "close-modal-btn"
);

addUserBtn.addEventListener(

  "click",

  () => {

    modal.style.display =
    "flex";

  }

);

closeModalBtn.addEventListener(

  "click",

  () => {

    modal.style.display =
    "none";

  }

);


document.getElementById("save-user-btn")
.addEventListener(
  "click",
  async () => {

    const username =
      document.getElementById(
        "new-username"
      ).value;

    const email =
      document.getElementById(
        "new-email"
      ).value;

    const password =
  document.getElementById(
    "new-password"
  ).value;

const role =
  document.getElementById(
    "new-role"
  ).value;

if (
  !username ||
  !email ||
  !password
) {

  alert(
    "Please fill all fields"
  );

  return;

}

console.log(
  username,
  email,
  role
);
    try {

  const response = await fetch(

    "https://scholarhub-backend-w94c.onrender.com/api/auth/admin/add-user",

    {

      method: "POST",

      headers: {

        "Content-Type":
        "application/json",

        authorization:
        userToken

      },

      body: JSON.stringify({

        username,

        email,

        password,

        role

      })

    }

  );
const data =
await response.json();

alert(data.message);

document.getElementById(
  "new-username"
).value = "";

document.getElementById(
  "new-email"
).value = "";

document.getElementById(
  "new-password"
).value = "";

document.getElementById(
  "new-role"
).value = "user";

modal.style.display =
"none";

loadUsers();

loadStats();
}

catch (error) {

  console.log(error);

}

  }
);

document.getElementById(
  "prev-btn"
).addEventListener(

  "click",

  () => {

    if (currentPage > 1) {

      currentPage--;

      loadUsers();

    }

  }

);

document.getElementById(
  "next-btn"
).addEventListener(

  "click",

  () => {

    if (
      currentPage <
      totalPages
    ) {

      currentPage++;

      loadUsers();

    }

  }

);

document
.getElementById("select-all")
.addEventListener(

  "change",

  function () {

    const checkboxes =

      document.querySelectorAll(
        ".user-checkbox"
      );

    checkboxes.forEach(

      (checkbox) => {

        checkbox.checked =
        this.checked;

      }

    );

  }

);

document
.getElementById("bulk-delete-btn")
.addEventListener(

  "click",

  async () => {

    const selectedUsers =

      Array.from(

        document.querySelectorAll(
          ".user-checkbox:checked"
        )

      ).map(

        (checkbox) =>

          checkbox.value

      );

    console.log(selectedUsers);

    if (
      selectedUsers.length === 0
    ) {

      alert(
        "Select users first"
      );

      return;

    }

   try {

  const response =
  await fetch(

    "https://scholarhub-backend-w94c.onrender.com/api/auth/admin/bulk-delete",

    {

      method: "DELETE",

      headers: {

        "Content-Type":
        "application/json",

        authorization:
        userToken

      },

      body: JSON.stringify({

        userIds:
        selectedUsers

      })

    }

  );

  const data =
  await response.json();

  alert(
    data.message
  );

  loadUsers();

  loadStats();

}

catch (error) {

  console.log(error);

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