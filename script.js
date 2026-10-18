const API="https://cyber-security-awareness-zran.vercel.app";
const IC={phishing:"🎣",password_security:"🔑",social_media:"📱",safe_browsing:"🌐",data_privacy:"🗂️"};
// Demo fallback data (used only when the API cannot be reached from this page)
const T=[
{id:"phishing",title:"Phishing Awareness",description:"Spot suspicious emails, messages, fake links and scams.",tips:["Check the sender’s address carefully.","Never share passwords or OTP codes."]},
{id:"password_security",title:"Password Security",description:"Create and protect strong passwords.",tips:["Use a long, unique password per account.","Enable multi-factor authentication."]},
{id:"social_media",title:"Social Media Safety",description:"Protect your privacy and identity online.",tips:["Review your privacy settings.","Report and block fraudulent accounts."]},
{id:"safe_browsing",title:"Safe Internet Browsing",description:"Safer habits for websites and downloads.",tips:["Check website addresses first.","Keep your browser and OS updated."]},
{id:"data_privacy",title:"Data Privacy",description:"Protect personal and sensitive data.",tips:["Review app permissions.","Lock devices and back up files securely."]}];
const Q={
phishing:[["A suspicious email asks for your password. What do you do?",["Reply with it","Click every link","Avoid links and verify the sender","Forward it to a friend"],2],["What is phishing?",["A cleaning method","A trick to steal information","A keyboard type","A backup method"],1],["A message urgently asks for your OTP. Safest move?",["Share it","Post it online","Ignore warnings","Never share it; verify the request"],3]],
password_security:[["Which password practice is safest?",["Use your name everywhere","A unique, long password per account","Share with friends","Post it publicly"],1],["What does multi-factor authentication do?",["Adds another verification step","Removes passwords","Makes Wi-Fi private","Deletes your account"],0],["Should you reuse one password everywhere?",["Yes, always","Only on public PCs","No, use unique passwords","Only for banking"],2]],
social_media:[["Before accepting a suspicious friend request?",["Send your address","Verify the account","Share your password","Send a code"],1],["Which should you avoid posting publicly?",["A hobby","A news article","Your private address and details","An event notice"],2],["An account is sending scams. What now?",["Send it money","Share its links","Give it your OTP","Report and block it"],3]],
safe_browsing:[["Before downloading an unknown file?",["Check the source is trustworthy","Disable security tools","Share your password","Download everything"],0],["A website address looks suspicious.",["Enter banking details","Avoid it and verify the address","Download its files","Ignore warnings"],1],["Why update software?",["It deletes files","It shares passwords","It fixes security vulnerabilities","It stops all scams"],2]],
data_privacy:[["Safest approach to app permissions?",["Allow all","Share all contacts","Ignore requests","Allow only what’s necessary"],3],["Leaving your computer unattended?",["Lock the screen","Leave files open","Share your login","Disable the password"],0],["How do you protect important files?",["Publish online","Keep secure backups","Share with strangers","Use one public link"],1]]};

const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ls={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let live=null;
async function api(p,o){
  try{
    const r=await fetch(API+p,{headers:{"Content-Type":"application/json"},...o});
    const d=await r.json();
    if(!r.ok){const e=new Error(Array.isArray(d.detail)?d.detail.map(x=>x.msg).join("; "):d.detail||"Request failed");e.http=1;throw e}
    live=true;mode();return d;
  }catch(e){ if(e.http)throw e; live=false;mode();return null }
}
function mode(){$("#mode").textContent=live?"🟢 live API":"🟡 demo mode (API not reachable here)"}
const user=()=>ls.get("user",null);
const fb=p=>p>=80?"Excellent work!":p>=50?"Good effort! Keep learning.":"Keep practising your cybersecurity skills.";
const stk=(e,r)=>`<span class="sticker sm" style="--r:${r||-6}deg">${e}</span>`;

function navbar(route){
  const u=user();
  const L=[["#/","Home","home"],["#/topics","Lessons","topics"],["#/quiz","Take Quiz","quiz"],["#/results","My Results","results"],u?["#/login","Logout ("+esc(u)+")","login"]:["#/login","Login","login"]];
  $("#nav").innerHTML=L.map(l=>`<a href="${l[0]}" class="${route===l[2]?"on":""}">${l[1]}</a>`).join("");
}

async function home(){
  let s=await api("/stats");
  if(!s){const h=ls.get("history",[]);s={total_attempts:h.length,unique_users:new Set(h.map(x=>x.username)).size,average_percentage:h.length?Math.round(h.reduce((a,x)=>a+x.percentage,0)/h.length*100)/100:0}}
  return `<section class="hero"><div>
<span class="tag">● SECURE LEARNING PORTAL</span>
<h1>Be smart. Be safe. Be <span>CyberAware</span>.</h1>
<p>Learn how to spot scams, protect your passwords and guard your privacy — then test yourself with short quizzes and track your progress.</p>
<div class="row"><a class="btn" href="#/topics">Start learning</a><a class="btn alt" href="#/quiz">Take a quiz</a></div></div>
<div class="stick"><span class="sticker" style="--r:-8deg">🛡️</span><span class="sticker" style="--r:5deg">🔒</span><span class="sticker" style="--r:-3deg">🎣</span><span class="sticker" style="--r:6deg">🔑</span><span class="sticker" style="--r:-6deg">🕵️</span><span class="sticker" style="--r:4deg">👨‍💻</span></div></section>
<div class="stats"><div class="card center"><b>${s.total_attempts}</b><span>Quiz attempts</span></div><div class="card center"><b>${s.unique_users}</b><span>Learners</span></div><div class="card center"><b>${s.average_percentage}%</b><span>Average score</span></div></div>
<h2 class="sec">Five skills that keep you safe</h2>
<div class="grid">${T.map(t=>`<div class="card">${stk(IC[t.id])}<h3>${t.title}</h3><p>${t.description}</p><div class="row"><a href="#/learn/${t.id}" class="btn">Read lesson</a><a href="#/quiz/${t.id}" class="btn alt">Quiz</a></div></div>`).join("")}</div>`;
}

async function topics(){
  const list=(await api("/topics"))||T;
  return `<h1>Learning hub</h1><p class="note">Pick a lesson, then test yourself with a quiz.</p>
<div class="grid">${list.map(t=>`<div class="card">${stk(IC[t.id]||"🛡️")}<h3>${esc(t.title)}</h3><p>${esc(t.description)}</p><ul>${(t.tips||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="row"><a class="btn" href="#/learn/${esc(t.id)}">Read lesson</a><a class="btn alt" href="#/quiz/${esc(t.id)}">Take quiz</a></div></div>`).join("")}</div>`;
}

const L={
phishing:{intro:"Phishing is when attackers pose as a trusted person or company to trick you into handing over passwords, OTP codes or money.",facts:["Most attacks arrive by email, SMS or social message.","Urgency (“act now!”) is the attacker’s favourite tool.","A friendly link can hide a very different web address."],dos:["Check the sender’s real address","Hover over links before clicking","Verify through the official app or website","Report and delete suspicious messages"],donts:["Share passwords or OTP codes","Open unexpected attachments","Trust messages that create panic"],ex:"“Your account will be locked in 1 hour! Verify now.” It is urgent, generic and the link does not match the real company — classic phishing."},
password_security:{intro:"A strong password is your first lock. Length and uniqueness matter far more than clever symbols.",facts:["Long passphrases beat short complex passwords.","One reused password can open many accounts after a single breach.","Multi-factor authentication blocks most account takeovers."],dos:["Use a unique passphrase of 14+ characters","Turn on multi-factor authentication","Store passwords in a reputable manager"],donts:["Reuse a password across accounts","Share passwords or send them in chats","Use names, birthdays or “123456”"],ex:"Weak: Ali2005!  —  Strong: coffee-river-lantern-42-sunrise. The second is longer, random and easy to remember."},
social_media:{intro:"Social platforms make it easy to connect — and just as easy for strangers to learn about you.",facts:["Public posts can reveal your routine and location.","Fake accounts impersonate friends to scam you.","Old posts can be searched and screenshotted for years."],dos:["Review privacy settings regularly","Verify friend requests first","Report and block scam accounts"],donts:["Post your address, ID or travel plans","Accept requests from strangers","Click links in unexpected messages"],ex:"A “friend” writes from a new account asking for an urgent loan. Call your real friend first — their account may be cloned."},
safe_browsing:{intro:"Every website you visit and file you download is a small trust decision. Make it a careful one.",facts:["The HTTPS padlock means encrypted, not automatically trustworthy.","Lookalike addresses copy real brands.","Updates patch holes attackers actively exploit."],dos:["Check the address before entering data","Download only from official sources","Keep your browser and device updated"],donts:["Ignore browser security warnings","Install cracked software or random files","Enter card details on unknown sites"],ex:"paypa1-secure.com looks like PayPal but uses the number 1 instead of the letter l. Always read the address."},
data_privacy:{intro:"Your personal data is valuable. Protect it the way you would protect cash.",facts:["Apps often request more permissions than they need.","An unlocked device gives instant access to everything.","Backups are your safety net against loss and ransomware."],dos:["Grant only necessary app permissions","Lock devices with a PIN or biometrics","Keep secure, up-to-date backups"],donts:["Share personal data unless needed","Use public Wi-Fi for sensitive logins","Leave devices unlocked and unattended"],ex:"A flashlight app asks for your contacts and location. Deny it — a flashlight does not need either."}};
function learn(id){
  const i=T.findIndex(x=>x.id===id),l=L[id];
  if(i<0)return `<h1>Lesson not found</h1><a class="btn" href="#/topics">All lessons</a>`;
  const t=T[i],nx=T[(i+1)%T.length],li=a=>a.map(x=>`<li>${x}</li>`).join("");
  return `<div class="tabs">${T.map(x=>`<a href="#/learn/${x.id}" class="${x.id===id?"on":""}">${IC[x.id]} ${x.title}</a>`).join("")}</div>
<div class="lh">${stk(IC[id],-5)}<div><span class="tag">LESSON ${i+1} OF ${T.length}</span><h1>${t.title}</h1></div></div>
<p class="lead">${l.intro}</p>
<h2 class="sec">Key facts</h2><div class="grid">${l.facts.map((f,n)=>`<div class="card"><span class="num">0${n+1}</span><p>${f}</p></div>`).join("")}</div>
<div class="two"><div class="card ok"><h3>✅ Do</h3><ul>${li(l.dos)}</ul></div><div class="card no"><h3>⛔ Don’t</h3><ul>${li(l.donts)}</ul></div></div>
<div class="card callout"><h3>🔍 Real-world example</h3><p>${l.ex}</p></div>
<div class="row"><a class="btn" href="#/quiz/${id}">Test yourself →</a><a class="btn alt" href="#/learn/${nx.id}">Next: ${nx.title}</a></div>`;
}
let cur=null;
async function quiz(id){
  if(!id){const list=(await api("/topics"))||T;return `<h1>Choose a quiz</h1><div class="grid">${list.map(t=>`<a class="card" style="text-decoration:none;color:inherit" href="#/quiz/${esc(t.id)}">${stk(IC[t.id]||"🛡️")}<h3>${esc(t.title)}</h3><p>3 questions</p></a>`).join("")}</div>`}
  if(!user())return `<div class="card narrow center">${stk("🔐")}<h2>Please log in first</h2><p class="note">Your name is used to save your quiz results.</p><a class="btn" href="#/login">Go to login</a></div>`;
  let d=await api("/quiz/"+encodeURIComponent(id)).catch(e=>({error:e.message}));
  if(d&&d.error)return `<p class="err">${esc(d.error)}</p><a class="btn alt" href="#/quiz">Back</a>`;
  if(!d){if(!Q[id])return `<p class="err">Quiz not found.</p>`;d={topic:id,questions:Q[id].map(q=>({question:q[0],options:q[1]}))}}
  cur=d;const t=T.find(x=>x.id===id);
  return `<h1>${stk(IC[id]||"🛡️")} ${t?esc(t.title):esc(id)} quiz</h1><p class="note">Answer all ${d.questions.length} questions, then submit.</p>
<div id="qs">${d.questions.map((q,i)=>`<div class="card q"><p>${i+1}. ${esc(q.question)}</p>${q.options.map((o,j)=>`<label class="opt"><input type="radio" name="q${i}" value="${j}">${esc(o)}</label>`).join("")}</div>`).join("")}</div>
<p class="err" id="qe"></p><button class="btn" onclick="submitQuiz('${esc(id)}')">Submit answers</button>`;
}

async function submitQuiz(id){
  const n=cur.questions.length,a=[];
  for(let i=0;i<n;i++){const c=document.querySelector(`input[name=q${i}]:checked`);if(!c){$("#qe").textContent="Please answer every question.";return}a.push(+c.value)}
  let r,saved="server";
  try{r=await api("/quiz/submit",{method:"POST",body:JSON.stringify({username:user(),topic:id,answers:a})})}
  catch(e){$("#qe").textContent=e.message;return}
  if(!r){
    const sc=Q[id].reduce((s,q,i)=>s+(q[2]===a[i]?1:0),0),p=Math.round(sc/n*10000)/100;
    r={username:user(),topic:id,score:sc,total_questions:n,percentage:p,feedback:fb(p),submitted_at:new Date().toISOString()};saved="device";
  }
  const h=ls.get("history",[]);h.push(r);ls.set("history",h);
  $("#app").innerHTML=`<div class="card narrow center"><span class="sticker" style="--r:-5deg;margin:auto">${r.percentage>=80?"🏆":r.percentage>=50?"👍":"📚"}</span><div class="big">${r.percentage}%</div><h2>${r.score} / ${r.total_questions} correct</h2><p>${esc(r.feedback)}</p><p class="note">${saved==="server"?"✅ Saved to the server (result #"+r.result_id+").":"💾 Saved on this device (demo mode)."}</p><div class="row" style="justify-content:center"><a class="btn" href="#/results">View my results</a><a class="btn alt" href="#/quiz">Another quiz</a></div></div>`;
}

async function results(){
  const u=user();
  if(!u)return `<div class="card narrow center">${stk("🔐")}<h2>Log in to see your results</h2><a class="btn" href="#/login">Login</a></div>`;
  let rows=await api("/results/user/"+encodeURIComponent(u));
  if(!rows)rows=ls.get("history",[]).filter(x=>x.username===u).reverse();
  const nm=id=>(T.find(t=>t.id===id)||{title:id}).title;
  return `<h1>My results</h1><p class="note">Signed in as <b>${esc(u)}</b></p>`+(rows.length?`<div class="card wrap"><table><tr><th>Topic</th><th>Score</th><th>%</th><th>Date</th></tr>${rows.map(r=>`<tr><td>${IC[r.topic]||""} ${esc(nm(r.topic))}</td><td>${r.score}/${r.total_questions}</td><td>${r.percentage}%</td><td>${esc(String(r.submitted_at).slice(0,10))}</td></tr>`).join("")}</table></div>`:`<div class="card center"><p>No quiz results yet.</p><a class="btn" href="#/quiz">Take your first quiz</a></div>`);
}

function login(){
  const u=user();
  if(u)return `<div class="card narrow center">${stk("✅")}<h2>Signed in as ${esc(u)}</h2><div class="row" style="justify-content:center"><a class="btn" href="#/quiz">Take a quiz</a><button class="btn alt" onclick="logout()">Log out</button></div></div>`;
  return `<div class="card narrow">${stk("🔐")}<h2>Welcome back</h2><p class="note">Log in to take quizzes and save your results.</p>
<label class="l" for="lu">Username</label><input class="t" id="lu" maxlength="80" autocomplete="username">
<label class="l" for="lp">Password</label><input class="t" id="lp" type="password" autocomplete="current-password">
<p class="err" id="le"></p><button class="btn" style="width:100%" onclick="doLogin()">Log in</button>
<p class="note" style="margin-top:14px">Demo login: your name is stored only in this browser and used to label your results. The backend has no password system yet, so never reuse a real password here.</p></div>`;
}
function doLogin(){
  const u=$("#lu").value.trim(),p=$("#lp").value;
  if(!u||p.length<4){$("#le").textContent="Enter a username and a password of at least 4 characters.";return}
  ls.set("user",u);location.hash="#/topics";
}
function logout(){ls.set("user",null);location.hash="#/";route()}

async function route(){
  const h=(location.hash||"#/").slice(2).split("/"),r=h[0]||"home";
  navbar(r==="learn"?"topics":r);const app=$("#app");app.innerHTML=`<p class="note">Loading…</p>`;
  let html="";
  try{
    html=r==="home"?await home():r==="topics"?await topics():r==="learn"?learn(h[1]||"phishing"):r==="quiz"?await quiz(h[1]):r==="results"?await results():r==="login"?login():`<h1>Page not found</h1><a class="btn" href="#/">Home</a>`;
  }catch(e){html=`<p class="err">Something went wrong: ${esc(e.message)}</p>`}
  app.innerHTML=html;window.scrollTo(0,0);
}
// CyberBot: answers only from this website’s own content
const KB=[
{k:["phish","scam","otp","suspicious email","fake link","fake website","spam","smishing"],t:"phishing"},
{k:["password","passphrase","mfa","2fa","multi-factor"],t:"password_security"},
{k:["social media","friend request","privacy settings","instagram","facebook","whatsapp"],t:"social_media"},
{k:["safe browsing","safe internet","browsing","https","software update","unknown file","malware","lookalike"],t:"safe_browsing"},
{k:["data privacy","privacy","permission","backup","personal data","lock screen","public wi-fi"],t:"data_privacy"},
{k:["quiz","submit","quiz question"],a:"Log in, open Take Quiz (or press Quiz on a lesson), choose a topic, answer all 3 questions and press Submit. You’ll see your score, percentage and feedback straight away."},
{k:["score","percentage","feedback","grading","my result","results page","quiz result","quiz history"],a:"Score = number of correct answers; percentage = score ÷ total × 100. 80% or more shows “Excellent work!”, 50–79% shows “Good effort! Keep learning.”, and below 50% shows “Keep practising your cybersecurity skills.” Past attempts are listed under My Results."},
{k:["login","log in","logout","log out","sign in","sign up","username","my account"],a:"Use Login in the top bar: enter a username and a password of at least 4 characters. Your username labels your quiz results. It’s a demo login stored in this browser, so don’t reuse a real password."},
{k:["lesson","topics","educational","learn","pages"],a:"CyberAware has five lessons: Phishing Awareness, Password Security, Social Media Safety, Safe Internet Browsing and Data Privacy. Open Lessons in the top bar. Each lesson has key facts, do’s and don’ts, a real-world example and a quiz."},
{k:["statistics","stats","learners","quiz attempt","average score"],a:"The Home page shows total quiz attempts, the number of learners and the average score."},
{k:["demo mode","live api","backend","saved to","footer badge"],a:"The badge in the footer shows whether the site is using the live API (green) or built-in demo data (yellow). In demo mode, results are saved only in this browser."},
{k:["navigate","navigation","menu bar","top bar"],a:"Use the top bar: Home, Lessons, Take Quiz, My Results and Login. Lesson pages also have tabs to jump between the five topics."},
{k:["cyberaware","this website","the website","this site","the portal","cybersecurity"],a:"CyberAware is a cybersecurity awareness portal where students learn essential online-safety skills through five lessons and short quizzes."}];
const CH=["What is phishing?","Where are the lessons?","How do I take a quiz?","How are scores calculated?"];
function say(t,c){const d=document.createElement("div");d.className="m "+c;d.textContent=t;const m=$("#msgs");m.appendChild(d);m.scrollTop=m.scrollHeight}
function tog(){const c=$("#chat");c.hidden=!c.hidden;if(!c.hidden&&!$("#msgs").children.length){say("Hi! I’m CyberBot 🛡️ I only answer questions about CyberAware: lessons, quizzes, login and results. What would you like to know?","b");$("#chips").innerHTML=CH.map(x=>`<button onclick="ask(this.textContent)">${x}</button>`).join("")}}
const NO="I can’t help you with that. Ask me about CyberAware — its lessons, quizzes, login or results.";
function ans(id){const l=L[id],t=T.find(x=>x.id===id);return `${t.title}: ${l.intro} Top tips: ${l.dos.join("; ")}. Read the full page under Lessons → ${t.title}.`}
function reply(q){q=q.toLowerCase().trim();const w=q.split(/\W+/).filter(Boolean);
if(/^(hi|hello|hey|salam|good (morning|afternoon|evening))\b/.test(q)&&w.length<=3)return "Hello! I’m CyberBot. Ask me about CyberAware’s lessons, quizzes, login or results.";
if(/^(help|what can you do\??)$/.test(q))return "I can explain the five lessons, how quizzes and scores work, login, results and stats on CyberAware.";
if(/^(thanks|thank you|ok|okay)\b/.test(q)&&w.length<=3)return "You’re welcome! Ask me anything else about CyberAware.";
let best=null,n=0;for(const e of KB){const h=e.k.filter(k=>k.length<=3?w.includes(k):q.includes(k)).length;if(h>n){n=h;best=e}}
return best?(best.a||ans(best.t)):NO}
function ask(t){say(t,"u");setTimeout(()=>say(reply(t),"b"),350)}
function send(){const i=$("#ci"),t=i.value.trim();if(!t)return;i.value="";ask(t)}
addEventListener("hashchange",route);route();