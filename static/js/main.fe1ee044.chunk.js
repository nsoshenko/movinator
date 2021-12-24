(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{39:function(e,t,n){},70:function(e,t,n){"use strict";n.r(t);var c=n(1),a=n.n(c),r=n(30),s=n.n(r),o=(n(39),n(13)),i=n(2),l=n(7),d=n.n(l),u=n(10),j=n(4),b=n(11),h=n.n(b),p=n(15),m=function(e,t,n){var c={value:t,expiration:Date.now()+n};localStorage.setItem(e,JSON.stringify(c))},f=function(e){var t=localStorage.getItem(e);if(t){var n=JSON.parse(t);if(!(Date.now()>n.expiration))return n.value;localStorage.removeItem(e)}},v=n(0),x=function(e){var t=e.closeInstallationHintHandler,n=Object(c.useState)(window.matchMedia("(orientation: landscape)").matches),a=Object(j.a)(n,2),r=a[0],s=a[1],o=Object(c.useState)(!1),i=Object(j.a)(o,2),l=i[0],d=i[1],u=Object(v.jsx)("img",{src:"/install.png",alt:"install"}),b=[Object(v.jsx)("li",{children:"Add this app to your home screen for easy access"},"0"),Object(v.jsx)("li",{children:"The download button is on the right side of the address bar"},"1"),Object(v.jsxs)("li",{children:["Click ",u,', then "Install"']},"2"),Object(v.jsx)("li",{children:"An app shortcut will be created on the home screen"},"3")],h=Object(v.jsx)("img",{src:"/installMobile.png",alt:"install"}),f=[Object(v.jsx)("li",{children:"Add this app to your home screen for easy access"},"0"),Object(v.jsxs)("li",{children:["Click ",h,', then "Add to home screen"']},"1"),Object(v.jsx)("li",{children:'Enter the name for the shortcut and tap "Add"'},"2"),Object(v.jsx)("li",{children:"An app shortcut will be created on the home screen"},"3")],x=function(){var e=window.matchMedia("(orientation: landscape)").matches;s(!e)};Object(c.useEffect)((function(){return window.addEventListener("orientationchange",x),function(){return window.removeEventListener("orientationchange",x)}}),[]);return Object(v.jsxs)("div",{className:"installationHint unselectable",children:[r&&Object(v.jsx)("img",{className:"closeButton",src:"/close.png",alt:"close",onClick:t}),Object(v.jsxs)("div",{className:"contentWrapper",children:[Object(v.jsxs)("ol",{children:[Object(v.jsx)(p.BrowserView,{children:b}),Object(v.jsx)(p.MobileView,{children:f})]}),Object(v.jsxs)("form",{onSubmit:function(e){return function(e){e.preventDefault(),l&&m("neverShowInstallationHint","true",7776e6),t()}(e)},children:[Object(v.jsxs)("label",{htmlFor:"remember",children:[Object(v.jsx)("input",{type:"checkbox",name:"remember",id:"remember",checked:l,onChange:function(){return d(!l)}})," ","I want to always use the app in browser"]}),Object(v.jsx)("button",{type:"submit",className:"circleButton",children:"OK"})]})]})]})},O=function(e){var t=e.modalText,n=e.buttons;return Object(v.jsx)("div",{className:"sessionModal unselectable",children:Object(v.jsxs)("div",{className:"sessionModalContent",children:[Object(v.jsx)("img",{src:"/clapperboard.png",alt:"clapperboardIcon"}),"string"===typeof t?Object(v.jsx)("p",{children:t}):t.map((function(e,t){return Object(v.jsx)("p",{style:{marginTop:t>0?0:void 0},children:e},t)})),Object(v.jsx)("div",{className:"buttonsWrapper",children:n.map((function(e,t){return Object(v.jsx)("button",{id:"".concat(e.text,"ButtonSessionModal"),onClick:e.onClickHandler,children:e.text},t)}))})]})})},g="http://192.168.0.105:3002/api",w=function(){var e=Object(i.f)(),t=Object(c.useState)(!1),n=Object(j.a)(t,2),a=n[0],r=n[1],s=Object(c.useState)(!1),o=Object(j.a)(s,2),l=o[0],b=o[1],m=Object(c.useState)(!1),w=Object(j.a)(m,2),k=w[0],N=w[1];Object(c.useEffect)((function(){(function(){var e=Object(u.a)(d.a.mark((function e(){var t,n,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t=f("sessionId"))){e.next=14;break}return e.prev=2,e.next=5,h.a.post(g+"/check",{sessionId:t});case 5:200===(n=e.sent).status&&(r(!0),(c=n.data)&&c.finished&&b(!0)),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(2),console.error(e.t0),console.log("Removing session cookie as expired"),localStorage.removeItem("sessionId");case 14:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(){return e.apply(this,arguments)}})()();var e=f("neverShowInstallationHint");p.isIOS?window.matchMedia("(display-mode: standalone)").matches||e||N(!0):window.addEventListener("beforeinstallprompt",(function(){f("neverShowInstallationHint")||N(!0)}))}),[]);var I=function(t){e.push(t)};return Object(v.jsxs)(v.Fragment,{children:[a&&Object(v.jsx)(O,{modalText:"Want to continue your last session?",buttons:[{text:"Yes",onClickHandler:function(){return I(l?"/result":"/question")}},{text:"No",onClickHandler:function(){localStorage.removeItem("sessionId"),r(!1)}}]}),k&&Object(v.jsx)(x,{closeInstallationHintHandler:function(){N(!1)}}),Object(v.jsxs)("div",{className:"container flex-column with-image-background unselectable",style:{backgroundImage:"linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/home_background_2.jpg')"},children:[Object(v.jsx)("div",{className:"title-wrapper",children:"Movinator"}),Object(v.jsx)("div",{className:"description-wrapper",children:Object(v.jsx)("div",{className:"size-description-wrapper",children:"Movinator is an application that will help you choose a movie to watch, based on your preferences"})}),Object(v.jsx)("div",{className:"start-button-wrapper",children:Object(v.jsx)("button",{type:"button",id:"start-button",onClick:function(){return I("/question")},children:"Start"})})]}),Object(v.jsx)("div",{className:"footer"})]})},k=n(33),N=n(34),I=function(e){var t=e.children,n=e.onClickHandler;return Object(v.jsx)("div",{className:"divider",children:Object(v.jsx)("button",{className:"circleButton",id:"other-button",onClick:function(){n(t)},children:t})})},S=function(){var e=Object(i.f)();return Object(v.jsxs)("header",{children:[Object(v.jsx)("img",{className:"home-button",src:"/home.png",alt:"home",onClick:function(){localStorage.removeItem("sessionId"),e.push("/")}}),"Movinator"]})},y=function(e){var t=e.backgroundUrl,n=e.onClickHandler,c=e.children,a=e.id;return Object(v.jsx)("div",{className:"option-box",style:{backgroundImage:"url(".concat(t,")")},onClick:function(){n(c)},id:a,children:Object(v.jsx)("div",{className:"text-container unselectable",children:c})})},C=function(e){return void 0!==e.result},H=function(){var e=g+"/question",t=Object(i.f)(),n=Object(c.useState)(),a=Object(j.a)(n,2),r=a[0],s=a[1],o=Object(c.useState)(),l=Object(j.a)(o,2),b=l[0],p=l[1],x=Object(c.useState)(["",""]),w=Object(j.a)(x,2),H=w[0],M=w[1],_=Object(c.useState)(!1),q=Object(j.a)(_,2),T=q[0],W=q[1],E=Object(c.useCallback)(function(){var n=Object(u.a)(d.a.mark((function n(c,a){var r,o,i,l,u;return d.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(r=function(e){m("sessionId",e.sessionId,6e5);var t=e.question;s(e),p(t.options.map((function(e){return e.name}))),M(t.options.map((function(e){return e.imageUrl?"https://image.tmdb.org/t/p/w780"+e.imageUrl:"/placeholders/".concat("cast"===(n=t.type)?"".concat(n,"_00").concat(Math.ceil(4*Math.random()),".jpg"):"".concat(n,".jpg"));var n})))},n.prev=1,c){n.next=10;break}return n.next=5,h.a.get(e);case 5:o=n.sent,i=o.data,r(i),n.next=16;break;case 10:return console.log(a),n.next=13,h.a.post(e,{sessionId:c,question:null===a||void 0===a?void 0:a.question});case 13:l=n.sent,u=l.data,C(u)?t.push("result"):r(u);case 16:n.next=22;break;case 18:n.prev=18,n.t0=n.catch(1),console.log(n.t0),W(!0);case 22:case"end":return n.stop()}}),n,null,[[1,18]])})));return function(e,t){return n.apply(this,arguments)}}(),[t,e]);Object(c.useEffect)((function(){var e=f("sessionId");E(e)}),[E]);var A=function(){var e=Object(u.a)(d.a.mark((function e(n){var c,a,s,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c=Object(N.a)({},r),f("sessionId")!==c.sessionId&&(localStorage.removeItem("sessionId"),t.push("/")),c){a=Object(k.a)(c.question.options);try{for(a.s();!(s=a.n()).done;)(o=s.value).name===n&&(o.selected=!0)}catch(i){a.e(i)}finally{a.f()}}return e.next=6,E(c.sessionId,c);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(v.jsxs)(v.Fragment,{children:[T&&Object(v.jsx)(O,{modalText:["Something went wrong","You will be redirected to the homepage"],buttons:[{text:"OK",onClickHandler:function(){return t.push("/")}}]}),Object(v.jsx)(S,{}),Object(v.jsx)("div",{className:"container after-header",children:b&&3===b.length?Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(y,{backgroundUrl:H[0],onClickHandler:A,children:b[0]}),Object(v.jsx)(I,{onClickHandler:A,children:b[2]}),Object(v.jsx)(y,{backgroundUrl:H[1],onClickHandler:A,id:"ob2",children:b[1]})]}):Object(v.jsx)("div",{children:"No question was fetched"})})]})},M=function(){var e=Object(i.f)(),t=Object(c.useState)(),n=Object(j.a)(t,2),a=n[0],r=n[1],s=Object(c.useState)(!1),o=Object(j.a)(s,2),l=o[0],b=o[1],p=Object(c.useState)(!1),x=Object(j.a)(p,2),w=x[0],k=x[1],N=Object(c.useCallback)(function(){var t=Object(u.a)(d.a.mark((function t(n){var c,a;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,h.a.post(g+"/question",{sessionId:n});case 3:c=t.sent,a=c.data,m("sessionId",a.sessionId,6e5),a.question&&e.push("/question"),r(a.result),t.next=14;break;case 10:t.prev=10,t.t0=t.catch(0),console.log(t.t0),k(!0);case 14:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(e){return t.apply(this,arguments)}}(),[e]),I=Object(c.useCallback)(function(){var e=Object(u.a)(d.a.mark((function e(t){var n,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h.a.post(g+"/similar",{sessionId:t});case 3:n=e.sent,c=n.data,m("sessionId",c.sessionId,6e5),r(c.result),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),b(!0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}(),[]),y=function(e){return e.length<=10?"7.5vmax":e.length<=30?"3.5vmax":"2vmax"};return Object(c.useEffect)((function(){var t=f("sessionId");t?N(t):e.push("/")}),[N,e]),Object(v.jsxs)(v.Fragment,{children:[l&&Object(v.jsx)(O,{modalText:["No similar movies left","Would you like to start a new session?"],buttons:[{text:"Yes",onClickHandler:function(){localStorage.removeItem("sessionId"),e.push("/question")}},{text:"No",onClickHandler:function(){return b(!1)}}]}),w&&Object(v.jsx)(O,{modalText:["Something went wrong","You will be redirected to the homepage"],buttons:[{text:"OK",onClickHandler:function(){return e.push("/")}}]}),a&&Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(S,{}),Object(v.jsxs)("div",{className:"container flex-column-reverse after-header",children:[Object(v.jsx)("div",{className:"image-container",style:a.backdrop_path?{backgroundImage:"url(".concat("https://image.tmdb.org/t/p/w1280"+a.backdrop_path,")")}:{backgroundImage:"linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('".concat("/placeholders/movies_00".concat(Math.ceil(4*Math.random()),".jpg"),"')")},children:Object(v.jsxs)("div",{className:"image-title-info-wrapper",children:[Object(v.jsx)("span",{style:{fontSize:"".concat(y(a.title))},className:"title",children:a.title})," ",Object(v.jsxs)("h2",{className:"text-margin-top",children:[new Date(a.release_date).getFullYear()," |",Math.floor(a.runtime/60),"h ",a.runtime%60,"m |"," ",a.tagline]}),a.vote_count>0&&Object(v.jsxs)("h2",{className:"text-margin-top",children:["TMDB: ",a.vote_average," (",a.vote_count,")"]})]})}),Object(v.jsxs)("div",{className:"bottom-box",children:[Object(v.jsxs)("div",{className:"info-container",children:[Object(v.jsxs)("div",{className:"bottom-title-info-wrapper",children:[Object(v.jsx)("span",{style:{fontSize:"".concat(y(a.title))},className:"title",onClick:function(){return navigator.clipboard.writeText(a.title)},children:a.title}),Object(v.jsxs)("h2",{className:"text-margin-top",children:[new Date(a.release_date).getFullYear()," |",Math.floor(a.runtime/60),"h ",a.runtime%60,"m",a.tagline.length>0&&"|"," ",a.tagline]}),a.vote_count>0&&Object(v.jsxs)("h2",{className:"text-margin-top",children:["TMDB: ",a.vote_average," (",a.vote_count,")"]})]}),Object(v.jsxs)("div",{className:"cast-wrapper",children:[a.director&&Object(v.jsxs)("p",{className:"text-margin-top",children:["Director: ",a.director]}),a.cast.length>0&&Object(v.jsxs)("p",{className:"text-margin-top",children:["Cast of actors:"," ",a.cast.slice(0,10).map((function(e,t,n){return t!==n.length-1?"".concat(e,", "):"".concat(e)}))]})]})]}),Object(v.jsxs)("div",{className:"description-container",children:[Object(v.jsx)("div",{className:"description-text-wrapper",children:Object(v.jsx)("p",{children:a.overview})}),Object(v.jsxs)("div",{className:"button-container",children:[Object(v.jsx)("div",{className:"button-label",children:"Similar movie"}),Object(v.jsx)("button",{id:"similar-button",onClick:function(){var e=f("sessionId");e?I(e):k(!0)}})]})]})]})]})," "]})]})};var _=function(){return Object(v.jsx)(v.Fragment,{children:Object(v.jsx)(o.a,{children:Object(v.jsxs)(i.c,{children:[Object(v.jsx)(i.a,{path:"/question",children:Object(v.jsx)(H,{})}),Object(v.jsx)(i.a,{path:"/result",children:Object(v.jsx)(M,{})}),Object(v.jsx)(i.a,{path:"/",children:Object(v.jsx)(w,{})})]})})})},q=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function T(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}s.a.render(Object(v.jsx)(a.a.StrictMode,{children:Object(v.jsx)(_,{})}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/movinator",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/movinator","/service-worker.js");q?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var c=n.headers.get("content-type");404===n.status||null!=c&&-1===c.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):T(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):T(t,e)}))}}()}},[[70,1,2]]]);
//# sourceMappingURL=main.fe1ee044.chunk.js.map