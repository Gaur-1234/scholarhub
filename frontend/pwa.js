let deferredPrompt;

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt = e;

const installBtn =
document.getElementById(
"install-app-btn"
);

if(installBtn){

installBtn.style.display =
"block";

}

});

const installBtn =
document.getElementById(
"install-app-btn"
);

if(installBtn){

installBtn.addEventListener(
"click",
async()=>{

if(!deferredPrompt)
return;

deferredPrompt.prompt();

const choiceResult =
await deferredPrompt.userChoice;

if(
choiceResult.outcome ===
"accepted"
){

alert(
"ScholarHub installed successfully 🚀"
);

}

deferredPrompt = null;

installBtn.style.display =
"none";

}
);

}