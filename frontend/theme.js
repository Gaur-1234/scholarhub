const savedTheme =
localStorage.getItem(
"theme"
);

if(savedTheme === "dark"){

document.body.classList.add(
"dark-mode"
);

}

const themeToggle =
document.getElementById(
"theme-toggle"
);

if(themeToggle){

themeToggle.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"dark-mode"
);

if(
document.body.classList.contains(
"dark-mode"
)
){

localStorage.setItem(
"theme",
"dark"
);

themeToggle.innerHTML =
"☀️";

}
else{

localStorage.setItem(
"theme",
"light"
);

themeToggle.innerHTML =
"🌙";

}

}
);

}

if(
"serviceWorker"
in navigator
){

window.addEventListener(
"load",
()=>{

navigator.serviceWorker
.register(
"./service-worker.js"
)

.then(()=>{

console.log(
"ScholarHub PWA Ready"
);

})

.catch(err=>{

console.log(err);

});

}
);

}