if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,o)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const l=e=>n(e,c),r={module:{uri:c},exports:t,require:l};s[c]=Promise.all(i.map((e=>r[e]||l(e)))).then((e=>(o(...e),t)))}}define(["./workbox-1504e367"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DnbsvQS7.js",revision:null},{url:"assets/index-DvXhOBhf.css",revision:null},{url:"assets/lessons-8kNPVJM-.js",revision:null},{url:"assets/lessons.old-Bh74MdUW.js",revision:null},{url:"assets/test-B76i72df.js",revision:null},{url:"assets/uk-constitution-Dikpkvmv.js",revision:null},{url:"index.html",revision:"6d0287c5aa632337cbce4ac7fc5b7e2c"},{url:"registerSW.js",revision:"2c800fcb4b2264d3fad45380ff23c4f7"},{url:"manifest.webmanifest",revision:"0eab90b5fb6bc23c79945051c2a8cfcd"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({url:e})=>e.origin===location.origin&&e.pathname.endsWith(".html")),new e.NetworkFirst({cacheName:"html-cache",networkTimeoutSeconds:10,plugins:[]}),"GET"),e.registerRoute((({url:e})=>e.origin===location.origin&&e.pathname.endsWith(".css")),new e.NetworkFirst({cacheName:"css-cache",networkTimeoutSeconds:10,plugins:[]}),"GET"),e.registerRoute((({url:e})=>e.origin===location.origin&&e.pathname.endsWith(".js")),new e.NetworkFirst({cacheName:"js-cache",networkTimeoutSeconds:10,plugins:[]}),"GET"),e.registerRoute((({url:e})=>e.origin===location.origin&&e.pathname.endsWith(".json")),new e.NetworkFirst({cacheName:"json-cache",networkTimeoutSeconds:10,plugins:[]}),"GET"),e.registerRoute((({url:e})=>e.origin===location.origin&&e.pathname.endsWith(".tff")),new e.NetworkFirst({cacheName:"tff-cache",networkTimeoutSeconds:10,plugins:[]}),"GET")}));
