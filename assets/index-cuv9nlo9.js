(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const u=[{name:"Egg",stage:"stage 0",minXP:0,desc:"Still dormant. Log your first session or habits to hatch!",color:"#555"},{name:"Byteling",stage:"stage 1",minXP:50,desc:"A tiny creature awakens. It blinks curiously at your editor.",color:"#7c6cff"},{name:"Codeling",stage:"stage 2",minXP:200,desc:"Growing fast! It reads your commits and purrs approvingly.",color:"#4ecdc4"},{name:"Debugmon",stage:"stage 3",minXP:500,desc:"Battle-hardened from a thousand stack traces. Eyes like a linter.",color:"#ff6cab"},{name:"Archimander",stage:"stage 4",minXP:1200,desc:"A legendary being. It dreams in design patterns.",color:"#f0b429"},{name:"Syntaxlord",stage:"stage 5",minXP:2500,desc:"10x coder incarnate. The compiler fears it.",color:"#ff6cab"}],m=[{id:"commit",text:"Made at least one commit",xp:15},{id:"review",text:"Reviewed someone's code / PR",xp:20},{id:"docs",text:"Wrote or updated documentation",xp:10},{id:"tests",text:"Wrote tests",xp:20},{id:"newlang",text:"Tried something new today",xp:25},{id:"nobreak",text:"Coded for 2+ focused hours",xp:10}],E=["Python","JavaScript","TypeScript","Rust","Go","Java","C++","C#","Swift","Kotlin","Ruby","PHP","SQL","HTML/CSS","Bash","Other"],w={flow:1.3,learn:1.2,grind:1,debug:1,chill:.9},T=30,b=25;function g(e){return Math.round(50*Math.pow(e,1.4))}const y="codepet_v1";function h(){return{xp:0,totalXP:0,level:1,streak:0,totalHours:0,languages:[],sessions:[],lastDay:null,habitsToday:[],habitsClaimed:!1}}function L(){try{const e=localStorage.getItem(y);return e?{...h(),...JSON.parse(e)}:h()}catch{return h()}}function f(e){localStorage.setItem(y,JSON.stringify(e))}function k(e){for(let t=u.length-1;t>=0;t--)if(e>=u[t].minXP)return u[t];return u[0]}function P(e,t){const a={...e,xp:e.xp+t,totalXP:e.totalXP+t};let l=0;for(;a.xp>=g(a.level);)a.xp-=g(a.level),a.level++,l++;return{newState:a,levelsGained:l}}function B(e){const t=new Date().toDateString();if(e.lastDay===t)return e;const a=new Date(Date.now()-864e5).toDateString(),l=e.lastDay===a?e.streak+1:1;return{...e,streak:l,lastDay:t,habitsClaimed:!1,habitsToday:[]}}function C({project:e,lang:t,hours:a,vibe:l,streakMultiplier:i,vibeMultiplier:s,isNewLang:o,newLangBonus:r,baseXpPerHour:M}){let v=Math.round(a*M*s*i);return o&&(v+=r),{project:e,lang:t,hours:a,vibe:l,xp:v,date:new Date().toLocaleDateString()}}let c=null;function X(e,t){$(),I(e,t)}function $(){c&&(cancelAnimationFrame(c),c=null)}function I(e,t){c=requestAnimationFrame(()=>{A(e,t),I(e,t)})}function A(e,t){const a=e.getContext("2d"),l=e.width,i=e.height;a.clearRect(0,0,l,i);const s=Date.now()/1e3,o=Math.sin(s*1.8)*3,r=u.indexOf(t);switch(a.save(),a.translate(l/2,i/2+o),r){case 0:H(a);break;case 1:D(a,t.color);break;case 2:N(a,t.color,s);break;case 3:O(a,t.color);break;case 4:_(a,t.color,s);break;default:j(a,t.color,s);break}a.restore()}function H(e){e.fillStyle="#2a2a38",e.strokeStyle="#555",e.lineWidth=2,e.beginPath(),e.ellipse(0,5,22,28,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#4a4a60",e.beginPath(),e.ellipse(-8,-6,5,7,-.3,0,Math.PI*2),e.fill()}function D(e,t){e.fillStyle=t,e.beginPath(),e.ellipse(0,4,18,20,0,0,Math.PI*2),e.fill(),e.fillStyle="#fff",e.beginPath(),e.ellipse(-6,-2,5,6,0,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(6,-2,5,6,0,0,Math.PI*2),e.fill(),e.fillStyle="#000",e.beginPath(),e.arc(-6,-1,2.5,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(6,-1,2.5,0,Math.PI*2),e.fill(),e.fillStyle=t,e.beginPath(),e.ellipse(0,18,8,5,0,0,Math.PI*2),e.fill()}function N(e,t,a){e.fillStyle=t,e.beginPath(),e.ellipse(0,2,20,22,0,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255,255,255,0.12)",e.beginPath(),e.ellipse(-5,-5,12,14,-.2,0,Math.PI),e.fill(),e.fillStyle="#fff",e.beginPath(),e.ellipse(-7,-4,5,6,0,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(7,-4,5,6,0,0,Math.PI*2),e.fill(),e.fillStyle="#1a1a2e",e.beginPath(),e.arc(-7,-3,3,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(7,-3,3,0,Math.PI*2),e.fill(),e.strokeStyle=t,e.lineWidth=2.5,e.lineCap="round";const l=Math.sin(a*2)*3;e.beginPath(),e.moveTo(-14,4),e.quadraticCurveTo(-26+l,-4,-20,-14),e.stroke(),e.beginPath(),e.moveTo(14,4),e.quadraticCurveTo(26-l,-4,20,-14),e.stroke()}function O(e,t){e.fillStyle="#1e1e28",e.beginPath(),e.moveTo(0,-28),e.lineTo(20,-10),e.lineTo(20,20),e.lineTo(-20,20),e.lineTo(-20,-10),e.closePath(),e.fill(),e.fillStyle=t,e.beginPath(),e.moveTo(0,-28),e.lineTo(20,-10),e.lineTo(14,-10),e.lineTo(0,-22),e.lineTo(-14,-10),e.lineTo(-20,-10),e.closePath(),e.fill(),e.fillStyle=t,e.beginPath(),e.ellipse(-8,2,6,7,0,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(8,2,6,7,0,0,Math.PI*2),e.fill(),e.fillStyle="#fff",e.beginPath(),e.arc(-8,1,3,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(8,1,3,0,Math.PI*2),e.fill(),e.fillStyle="#000",e.beginPath(),e.arc(-8,1,1.5,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(8,1,1.5,0,Math.PI*2),e.fill()}function _(e,t,a){for(let l=0;l<6;l++){const i=l/6*Math.PI*2+a*.8,s=Math.cos(i)*32,o=Math.sin(i)*18,r=.3+.4*Math.abs(Math.sin(i));e.fillStyle=t+Math.round(r*255).toString(16).padStart(2,"0"),e.beginPath(),e.arc(s,o,3,0,Math.PI*2),e.fill()}e.fillStyle=t,e.beginPath(),e.ellipse(0,0,20,24,0,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255,255,255,0.2)",e.lineWidth=2,e.beginPath(),e.ellipse(0,0,14,17,0,0,Math.PI*2),e.stroke(),e.fillStyle="#fff",e.beginPath(),e.ellipse(-6,-3,4.5,5.5,0,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(6,-3,4.5,5.5,0,0,Math.PI*2),e.fill(),e.fillStyle=t,e.beginPath(),e.arc(-6,-2,2.5,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(6,-2,2.5,0,Math.PI*2),e.fill()}function j(e,t,a){for(let i=0;i<8;i++)e.save(),e.rotate(i/8*Math.PI*2+a*.25),e.beginPath(),e.moveTo(0,0),e.lineTo(10,-26),e.lineTo(0,-22),e.lineTo(-10,-26),e.closePath(),e.fillStyle=i%2===0?t:"#1e1e28",e.fill(),e.restore();e.fillStyle=t,e.beginPath(),e.arc(0,0,14,0,Math.PI*2),e.fill();const l=.5+.5*Math.sin(a*3);e.strokeStyle=`rgba(255,255,255,${.1+l*.3})`,e.lineWidth=2,e.beginPath(),e.arc(0,0,9,0,Math.PI*2),e.stroke(),e.fillStyle="#fff",e.beginPath(),e.ellipse(-4.5,-1.5,3.5,4.5,0,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(4.5,-1.5,3.5,4.5,0,0,Math.PI*2),e.fill(),e.fillStyle="#000",e.beginPath(),e.arc(-4.5,-1,1.8,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(4.5,-1,1.8,0,Math.PI*2),e.fill()}function p(e){G(e),R(e),S(e),q(e)}function G(e){const t=k(e.totalXP),a=g(e.level),l=Math.min(100,Math.round(e.xp/a*100));document.getElementById("pet-evo-name").textContent=t.name,document.getElementById("pet-evo-stage").textContent=t.stage,document.getElementById("pet-evo-desc").textContent=t.desc,document.getElementById("pet-header-name").textContent=t.name,document.getElementById("level-display").textContent=e.level,document.getElementById("xp-label").textContent=`${e.xp} / ${a}`,document.getElementById("xp-fill").style.width=`${l}%`;const i=document.getElementById("pet-canvas");X(i,t)}function R(e){document.getElementById("stat-streak").textContent=e.streak,document.getElementById("stat-hours").textContent=+e.totalHours.toFixed(1),document.getElementById("stat-langs").textContent=e.languages.length}function S(e){const t=document.getElementById("habits-list");t.innerHTML="",m.forEach(a=>{const l=e.habitsToday.includes(a.id),i=document.createElement("div");i.className=`habit-item${l?" checked":""}`,i.dataset.habitId=a.id,i.innerHTML=`
      <div class="habit-check">${l?"✓":""}</div>
      <span class="habit-text">${a.text}</span>
      <span class="habit-xp">+${a.xp} XP</span>
    `,t.appendChild(i)})}function q(e){const t=document.getElementById("log-list");if(!e.sessions.length){t.innerHTML='<div class="empty-state">No sessions yet. Start coding!</div>';return}t.innerHTML="",[...e.sessions].reverse().slice(0,30).forEach(a=>{const l=document.createElement("div");l.className="log-entry",l.innerHTML=`
      <div>
        <div class="log-project">${a.project||"Session"}</div>
        <div class="log-meta">${a.lang} · ${a.hours}h · ${a.vibe} · ${a.date}</div>
      </div>
      <div class="log-xp">+${a.xp} XP</div>
    `,t.appendChild(l)})}function F(){return`
    <div class="header">
      <div class="title-block">
        <p class="eyebrow">CodePet</p>
        <h1 id="pet-header-name">Egg</h1>
      </div>
      <div class="level-badge">
        <div class="lv">LEVEL</div>
        <div class="ln" id="level-display">1</div>
      </div>
    </div>

    <div class="pet-stage">
      <canvas class="pet-canvas" id="pet-canvas" width="96" height="96"></canvas>
      <div class="pet-info">
        <div class="pet-name-row">
          <span class="pet-name" id="pet-evo-name">Egg</span>
          <span class="pet-evo-badge" id="pet-evo-stage">stage 0</span>
        </div>
        <p class="pet-desc" id="pet-evo-desc">Still dormant. Log your first session or habits to hatch!</p>
        <div>
          <div class="xp-label">
            <span>XP</span>
            <span id="xp-label">0 / 50</span>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" id="xp-fill" style="width: 0%"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Streak</div>
        <div class="stat-value" id="stat-streak" style="color: var(--accent2)">0</div>
        <div class="stat-sub">days in a row</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Hours coded</div>
        <div class="stat-value" id="stat-hours" style="color: var(--accent3)">0</div>
        <div class="stat-sub">total</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Languages</div>
        <div class="stat-value" id="stat-langs" style="color: var(--accent)">0</div>
        <div class="stat-sub">unique</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-tab="session">Log session</button>
      <button class="tab-btn" data-tab="habits">Daily habits</button>
      <button class="tab-btn" data-tab="history">History</button>
    </div>

    <div class="panel active" id="panel-session">
      <div class="form-row">
        <div class="form-group">
          <label for="proj-input">Project / task</label>
          <input type="text" id="proj-input" placeholder="e.g. Built auth flow" />
        </div>
        <div class="form-group">
          <label for="lang-select">Language</label>
          <select id="lang-select">
            <option value="">-- pick one --</option>
            ${E.map(t=>`<option>${t}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="duration-input">Duration (hrs)</label>
          <input type="number" id="duration-input" min="0.25" max="24" step="0.25" placeholder="e.g. 1.5" />
        </div>
        <div class="form-group">
          <label for="vibe-select">Vibe</label>
          <select id="vibe-select">
            <option value="flow">In the flow</option>
            <option value="grind">Hard grind</option>
            <option value="learn">Learning mode</option>
            <option value="debug">Debugging hell</option>
            <option value="chill">Chill session</option>
          </select>
        </div>
      </div>
      <button class="btn-primary" id="log-session-btn">+ Log session &amp; earn XP</button>
    </div>

    <div class="panel" id="panel-habits">
      <div class="habits-list" id="habits-list"></div>
      <button class="btn-primary" id="claim-habits-btn">Claim daily habit XP</button>
    </div>

    <div class="panel" id="panel-history">
      <div class="log-list" id="log-list">
        <div class="empty-state">No sessions yet. Start coding!</div>
      </div>
    </div>

    <div class="toast" id="toast"></div>
  `}let n=L();document.getElementById("app").innerHTML=F();p(n);W();function W(){document.querySelectorAll(".tab-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;document.querySelectorAll(".tab-btn").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".panel").forEach(a=>a.classList.remove("active")),e.classList.add("active"),document.getElementById(`panel-${t}`).classList.add("active")})}),document.getElementById("log-session-btn").addEventListener("click",J),document.getElementById("habits-list").addEventListener("click",e=>{const t=e.target.closest(".habit-item");if(!t)return;if(n.habitsClaimed){d("Already claimed today!");return}const a=t.dataset.habitId;n.habitsToday.includes(a)?n.habitsToday=n.habitsToday.filter(l=>l!==a):n.habitsToday=[...n.habitsToday,a],f(n),S(n)}),document.getElementById("claim-habits-btn").addEventListener("click",U)}function J(){const e=document.getElementById("proj-input").value.trim()||"Coding session",t=document.getElementById("lang-select").value,a=parseFloat(document.getElementById("duration-input").value),l=document.getElementById("vibe-select").value;if(!t){d("Pick a language!");return}if(!a||a<=0){d("Enter a valid duration!");return}n=B(n);const i=!n.languages.includes(t);i&&(n={...n,languages:[...n.languages,t]});const s=C({project:e,lang:t,hours:a,vibe:l,streakMultiplier:1+Math.min(n.streak*.05,.5),vibeMultiplier:w[l]??1,isNewLang:i,newLangBonus:b,baseXpPerHour:T});n={...n,totalHours:n.totalHours+a,sessions:[...n.sessions,s]};const{newState:o,levelsGained:r}=P(n,s.xp);n=o,f(n),document.getElementById("proj-input").value="",document.getElementById("duration-input").value="",p(n),d(`+${s.xp} XP earned!`),r>0&&setTimeout(()=>d(`Level up! Now level ${n.level} 🎉`),800),i&&setTimeout(()=>d(`New language bonus! +${b} XP`),400)}function U(){if(n.habitsClaimed){d("Already claimed today!");return}if(!n.habitsToday.length){d("Check at least one habit!");return}const e=n.habitsToday.reduce((l,i)=>{const s=m.find(o=>o.id===i);return l+((s==null?void 0:s.xp)??0)},0);n={...n,habitsClaimed:!0};const{newState:t,levelsGained:a}=P(n,e);n=t,f(n),p(n),d(`+${e} XP from habits!`),a>0&&setTimeout(()=>d(`Level up! Now level ${n.level} 🎉`),800)}function d(e){const t=document.getElementById("toast");t.textContent=e,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),2300)}
