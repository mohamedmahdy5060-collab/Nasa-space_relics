/* Land the Eagle v2: load AFTER script.js. It replaces the old game safely. */
(()=>{const old=document.getElementById("lg");if(!old)return;
const $=s=>document.querySelector(s),c=old.cloneNode();old.replaceWith(c);c.style.touchAction="auto";
["gl","gt","gr","gx"].forEach(i=>{const b=$("#"+i);b.replaceWith(b.cloneNode(true))});
const og=$("#gs");og.id="gs_old";og.style.display="none";
const hud=document.createElement("p"),gm=document.createElement("p");hud.id="ghud";hud.style.cssText="font:700 1.05rem/1.5 monospace;margin:10px 0 0";gm.className="lead";gm.style.marginTop="6px";og.after(hud,gm);
const g=c.getContext("2d"),W=c.width=720,H=c.height=420,K={},msg=t=>gm.textContent=t;
const LV=[{n:"🌕 Moon",a:"🌕 القمر",g:.022,pw:80,col:"#8d97ad",w:0},{n:"🔴 Mars",a:"🔴 المريخ",g:.032,pw:70,col:"#b5532f",w:0},{n:"🌪️ Dust storm",a:"🌪️ عاصفة غبار",g:.032,pw:60,col:"#a2482a",w:.012}];
const ST=Array.from({length:70},()=>[Math.random()*W,Math.random()*H*.75,Math.random()*1.4+.3]);
let s,pts,pad,lv=0,un=0,T=0,last=performance.now();try{un=+localStorage.sr_lv||0}catch(e){}
const ty=px=>{const i=Math.min(pts.length-2,Math.max(0,Math.floor(px/20))),a=pts[i],b=pts[i+1];return a+(b-a)*((px-i*20)/20)};
function bar(){const e=$("#lv");e.innerHTML="";LV.forEach((l,i)=>{const b=document.createElement("button");b.className="nb";b.style.margin="0";b.textContent=(i>un?"🔒 ":"")+L(l.n,l.a);b.disabled=i>un;if(i===lv)b.style.borderColor="var(--cy)";b.onclick=()=>{lv=i;init()};e.appendChild(b)})}
window.gbar=bar;
function init(){const P=LV[lv].pw;pad=60+Math.floor(Math.random()*(W-120-P));pad-=pad%20;pts=[];let y=H-80;for(let i=0;i<=W/20+1;i++){const px=i*20;if(px>=pad&&px<=pad+P)pts.push(H-70);else{y=Math.max(H-170,Math.min(H-40,y+(Math.random()-.5)*44));pts.push(y)}}
s={x:W/2,y:50,vx:(Math.random()-.5)*1,vy:0,a:0,f:100,st:"idle"};T=0;bar();
msg(L("Press 🔥 THRUST or Space to start. ◀ ▶ tilt the ship, and thrust pushes the way it points. Land slowly and upright on the glowing pad.","اضغط 🔥 أو المسافة للبدء. ◀ ▶ تميل المركبة، والدفع يتجه حسب الميل. اهبط ببطء وبشكل مستقيم على المنصة المضيئة."))}
const start=()=>{if(s.st==="idle")s.st="play"};
function step(f){if(s.st!=="play")return;T+=f;const V=LV[lv];if(K.l)s.a-=.04*f;if(K.r)s.a+=.04*f;
if(K.t&&s.f>0){s.vx+=Math.sin(s.a)*.055*f;s.vy-=Math.cos(s.a)*.055*f;s.f-=.3*f}
s.vy+=V.g*f;s.vx+=Math.sin(T/60)*V.w*f;s.x+=s.vx*f;s.y+=s.vy*f;
if(s.x<0||s.x>W){s.vx*=-.5;s.x=Math.max(0,Math.min(W,s.x))}
if(s.y+12>=ty(s.x)){const on=s.x>pad+8&&s.x<pad+V.pw-8,ok=on&&Math.abs(s.vy)<1.1&&Math.abs(s.vx)<.8&&Math.abs(s.a)<.3;s.st=ok?"win":"crash";s.y=ty(s.x)-12;
if(ok){let x=L("🎉 Touchdown! Your descent stage stays here forever, a new relic.","🎉 هبوط ناجح! مرحلة هبوطك ستبقى هنا للأبد، أثر جديد.");if(lv<2&&un<lv+1){un=lv+1;try{localStorage.sr_lv=un}catch(e){}x+=L(" Next level unlocked!"," فُتح المستوى التالي!");bar()}msg(x)}
else{const r=[];if(!on)r.push(L("you missed the pad","أخطأت المنصة"));if(Math.abs(s.vy)>=1.1)r.push(L("falling too fast","السقوط سريع"));if(Math.abs(s.vx)>=.8)r.push(L("drifting sideways","انجراف جانبي"));if(Math.abs(s.a)>=.3)r.push(L("tilted too much","ميلان كبير"));msg("💥 "+r.join(" · ")+L(". Press R or ↻.","، اضغط R أو ↻."))}}}
function draw(){const V=LV[lv];g.clearRect(0,0,W,H);g.fillStyle="#cfe3ff";ST.forEach(p=>g.fillRect(p[0],p[1],p[2],p[2]));
g.fillStyle=V.col;g.beginPath();g.moveTo(0,H);pts.forEach((y,i)=>g.lineTo(i*20,y));g.lineTo(W+20,H);g.fill();
g.shadowColor="#5ee7ff";g.shadowBlur=18;g.fillStyle="#5ee7ff";g.fillRect(pad,H-72,V.pw,4);g.shadowBlur=0;
g.save();g.translate(s.x,s.y);g.rotate(s.a);if(K.t&&s.f>0&&s.st==="play"){g.fillStyle="#ff9a4d";g.beginPath();g.moveTo(-5,10);g.lineTo(0,24+Math.random()*10);g.lineTo(5,10);g.fill()}
g.fillStyle=s.st==="crash"?"#ff4d6d":"#f1f5ff";g.fillRect(-9,-8,18,14);g.fillStyle="#5ee7ff";g.fillRect(-4,-5,8,5);g.strokeStyle="#f1f5ff";g.lineWidth=2;g.beginPath();g.moveTo(-9,6);g.lineTo(-14,12);g.moveTo(9,6);g.lineTo(14,12);g.stroke();g.restore();
if(s.st==="idle"){g.fillStyle="#f1f5ff";g.font="700 34px sans-serif";g.textAlign="center";g.fillText(L("PRESS THRUST TO START","اضغط للبدء"),W/2,H/2);g.textAlign="left"}
const a=(v,m)=>Math.abs(v)<m?"🟢":"🔴";
hud.textContent=`⛽ ${Math.max(0,s.f|0)}%   ${a(s.vy,1.1)} ${L("Speed","السرعة")} ${Math.abs(s.vy).toFixed(1)}/1.1   ${a(s.vx,.8)} ${L("Drift","انجراف")} ${Math.abs(s.vx).toFixed(1)}/0.8   ${a(s.a,.3)} ${L("Tilt","ميل")} ${Math.abs(s.a*57.3|0)}°/17°`+(V.w?"   💨 "+(Math.sin(T/60)>0?"→":"←"):"")}
const vis=()=>{const b=c.getBoundingClientRect();return b.top<innerHeight-60&&b.bottom>60},M={arrowleft:"l",a:"l",arrowright:"r",d:"r",arrowup:"t"," ":"t",w:"t"};
addEventListener("keydown",e=>{if(!vis())return;const k=M[e.key.toLowerCase()];if(k){K[k]=1;start();e.preventDefault()}if(e.key.toLowerCase()==="r")init()});
addEventListener("keyup",e=>{const k=M[e.key.toLowerCase()];if(k)K[k]=0});
[["gl","l"],["gt","t"],["gr","r"]].forEach(([id,k])=>{const b=$("#"+id);b.onpointerdown=e=>{e.preventDefault();K[k]=1;start()};["pointerup","pointerleave","pointercancel"].forEach(ev=>b["on"+ev]=()=>K[k]=0)});
$("#gx").onclick=init;
const rd=$(".radio"),sec=$("#game");if(rd&&sec)new IntersectionObserver(es=>{rd.style.opacity=es[0].isIntersecting?0:1;rd.style.pointerEvents=es[0].isIntersecting?"none":"auto"},{threshold:.3}).observe(sec);
init();(function Lp(n){const f=Math.min(2.5,(n-last)/16.667);last=n;step(f);draw();requestAnimationFrame(Lp)})(last)})();
