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

await deferredPrompt.userChoice;

deferredPrompt = null;

installBtn.style.display =
"none";

}
);

}