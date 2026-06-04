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
      "login.html";

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
        "login.html";

      }

      catch (error) {

        console.log(error);

      }

    }

  );

}