const CACHE_NAME =
"scholarhub-v3";

const STATIC_ASSETS = [

"/",
"/index.html",

"/dashboard.html",
"/profile.html",
"/notifications.html",

"/resumeReport.html",
"/jobMatcher.html",
"/jobRecommendations.html",

"/jobListings.html",
"/savedJobs.html",
"/applicationTracker.html",

"/security.html",

"/admin.html",
"/users.html",

"/theme.css",
"/dashboard.css",
"/style.css",

"/theme.js",
"/sidebar.js",

"/icon-192.png",
"/icon-512.png",

"/manifest.json",
"/offline.html"

];

// ======================
// INSTALL
// ======================

self.addEventListener(
"install",
(event)=>{

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>{

return cache.addAll(
STATIC_ASSETS
);

})

);

self.skipWaiting();

}
);

// ======================
// ACTIVATE
// ======================

self.addEventListener(
"activate",
(event)=>{

event.waitUntil(

caches.keys()

.then(keys=>{

return Promise.all(

keys.map(key=>{

if(
key !== CACHE_NAME
){

return caches.delete(
key
);

}

})

);

})

);

self.clients.claim();

}
);

// ======================
// FETCH
// ======================

self.addEventListener(
"fetch",
(event)=>{

if(
event.request.method !==
"GET"
){
return;
}

if(
!event.request.url.startsWith(
"http"
)
){
return;
}

if(
event.request.url.startsWith(
"chrome-extension://"
)
){
return;
}

event.respondWith(

fetch(event.request)

.then(response=>{

const responseClone =
response.clone();

caches.open(
CACHE_NAME
)

.then(cache=>{

cache.put(
event.request,
responseClone
);

});

return response;

})

.catch(async()=>{

const cached =
await caches.match(
event.request
);

if(cached){
return cached;
}

return caches.match(
"/offline.html"
);

})

);

});

self.addEventListener(
"message",
(event)=>{

if(
event.data &&
event.data.type ===
"SKIP_WAITING"
){

self.skipWaiting();

}

});