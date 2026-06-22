let refreshing = false;

if ("serviceWorker" in navigator) {

navigator.serviceWorker.register(
"./service-worker.js"
)

.then((registration)=>{

registration.addEventListener(
"updatefound",
()=>{

const newWorker =
registration.installing;

newWorker.addEventListener(
"statechange",
()=>{

if(
newWorker.state === "installed" &&
navigator.serviceWorker.controller
){

showUpdatePopup(
registration
);

}

});

});

});

}

function showUpdatePopup(
registration
){

const popup =
document.createElement(
"div"
);

popup.id =
"update-popup";

popup.innerHTML = `

<div class="update-box">

<h3>
🚀 New Version Available
</h3>

<p>
ScholarHub has been updated.
</p>

<button id="update-btn">
Update Now
</button>

</div>

`;

document.body.appendChild(
popup
);

document
.getElementById(
"update-btn"
)
.addEventListener(
"click",
()=>{

if(
registration.waiting
){

registration.waiting.postMessage(
{
type:"SKIP_WAITING"
}
);

}

}
);

}

navigator.serviceWorker.addEventListener(
"controllerchange",
()=>{

if(refreshing)
return;

refreshing = true;

window.location.reload();

});