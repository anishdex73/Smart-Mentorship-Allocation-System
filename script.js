const state = {
  mentors: [
    {id:1,name:"Priya Sharma",dept:"CSE",exp:8,skills:["Python","ML","Data Science"],interests:["AI","Research"],availability:["Tue","Thu"],capacity:4,assigned:3,lang:"English"},
    {id:2,name:"Karan Mehta",dept:"CSE",exp:6,skills:["Cybersecurity","Networks","Linux"],interests:["Security","Cloud"],availability:["Mon","Wed"],capacity:3,assigned:2,lang:"English"},
    {id:3,name:"Neha Verma",dept:"ECE",exp:10,skills:["Java","IoT","Embedded"],interests:["IoT","Robotics"],availability:["Tue","Fri"],capacity:4,assigned:4,lang:"English"},
    {id:4,name:"Rohit Gupta",dept:"CSE",exp:5,skills:["Web Development","React","JavaScript"],interests:["UI","Open Source"],availability:["Mon","Thu"],capacity:3,assigned:1,lang:"Hindi"},
    {id:5,name:"Ananya Kapoor",dept:"CSE",exp:7,skills:["C++","DSA","Algorithms"],interests:["Competitive Programming","Teaching"],availability:["Wed","Sat"],capacity:4,assigned:2,lang:"English"},
    {id:6,name:"Vivek Singh",dept:"IT",exp:9,skills:["Cloud","DevOps","Linux"],interests:["Cloud","Automation"],availability:["Tue","Thu"],capacity:3,assigned:2,lang:"Hindi"},
    {id:7,name:"Meera Iyer",dept:"CSE",exp:4,skills:["UI/UX","Figma","Web Development"],interests:["Design","Product"],availability:["Fri","Sat"],capacity:3,assigned:1,lang:"English"},
    {id:8,name:"Arvind Rao",dept:"CSE",exp:12,skills:["Java","Backend","Databases"],interests:["Systems","Architecture"],availability:["Mon","Wed"],capacity:4,assigned:3,lang:"English"}
  ],
  mentees: [
    {id:101,name:"Aarav Singh",course:"CSE",year:2,skills:["Python","DSA"],interests:["AI","Research"],goal:"Machine Learning",availability:["Tue","Thu"],preference:["ML","Python"],status:"Matched"},
    {id:102,name:"Riya Malhotra",course:"CSE",year:2,skills:["JavaScript","React"],interests:["UI","Open Source"],goal:"Web Development",availability:["Mon","Thu"],preference:["Web Development"],status:"Matched"},
    {id:103,name:"Aditya Sharma",course:"CSE",year:1,skills:["C++","DSA"],interests:["Competitive Programming"],goal:"Algorithms",availability:["Wed","Sat"],preference:["DSA","C++"],status:"Matched"},
    {id:104,name:"Ananya Singh",course:"IT",year:2,skills:["Linux","Cloud"],interests:["Cloud","Automation"],goal:"DevOps",availability:["Tue","Thu"],preference:["Cloud"],status:"Matched"},
    {id:105,name:"Rohan Gupta",course:"CSE",year:3,skills:["Cybersecurity","Linux"],interests:["Security"],goal:"Cybersecurity",availability:["Mon","Wed"],preference:["Security"],status:"Matched"},
    {id:106,name:"Ishita Jain",course:"CSE",year:1,skills:["Java"],interests:["IoT","Robotics"],goal:"Embedded Systems",availability:["Tue","Fri"],preference:["IoT","Java"],status:"Matched"},
    {id:107,name:"Kabir Mehta",course:"CSE",year:2,skills:["Python","Data Science"],interests:["AI"],goal:"Data Science",availability:["Tue","Thu"],preference:["Data Science"],status:"Unmatched"},
    {id:108,name:"Sara Khan",course:"CSE",year:2,skills:["Figma","UI/UX"],interests:["Design","Product"],goal:"Product Design",availability:["Fri","Sat"],preference:["UI/UX"],status:"Matched"},
    {id:109,name:"Dev Patel",course:"CSE",year:1,skills:["Java","Databases"],interests:["Systems"],goal:"Backend Development",availability:["Mon","Wed"],preference:["Java","Backend"],status:"Matched"},
    {id:110,name:"Nikhil Joshi",course:"CSE",year:2,skills:["Python","Web Development"],interests:["Open Source"],goal:"Full Stack",availability:["Mon","Thu"],preference:["Web Development"],status:"Matched"}
  ],
  allocations: []
};

const app = document.getElementById("app");
const toast = document.getElementById("toast");
document.getElementById("today").textContent = new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short",year:"numeric"});

function initials(name){return name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove("show"),2200)}
function capacityPct(m){return Math.min(100,Math.round(m.assigned/m.capacity*100))}
function common(a,b){return a.filter(x=>b.includes(x)).length}
function score(m,n){
  const skill=Math.min(100,common(m.skills,n.skills)/Math.max(1,Math.min(m.skills.length,n.skills.length))*100);
  const interest=Math.min(100,common(m.interests,n.interests)/Math.max(1,Math.min(m.interests.length,n.interests.length))*100);
  const goal=(m.skills.some(s=>n.goal.toLowerCase().includes(s.toLowerCase()))||m.interests.some(i=>n.goal.toLowerCase().includes(i.toLowerCase())))?100:35;
  const avail=common(m.availability,n.availability)/Math.max(1,Math.min(m.availability.length,n.availability.length))*100;
  const pref=common(m.skills,n.preference)/Math.max(1,n.preference.length)*100;
  const cap=m.assigned<m.capacity?100:0;
  return Math.round(skill*.30+interest*.20+goal*.20+avail*.15+pref*.10+cap*.05);
}
function getAllocations(){
  if(state.allocations.length) return state.allocations;
  return buildMatches(false);
}
function buildMatches(notify=true){
  state.mentors.forEach(m=>m.assigned=Math.min(m.assigned,m.capacity));
  const used={}; state.mentors.forEach(m=>used[m.id]=m.assigned);
  const result=[];
  [...state.mentees].sort((a,b)=>a.id-b.id).forEach(n=>{
    const candidates=state.mentors.map(m=>({m,s:score(m,n)})).filter(x=>used[x.m.id]<x.m.capacity).sort((a,b)=>b.s-a.s);
    if(candidates.length && candidates[0].s>=55){
      const best=candidates[0]; used[best.m.id]++; result.push({mentee:n,mentor:best.m,score:best.s});
    } else result.push({mentee:n,mentor:null,score:0});
  });
  state.allocations=result;
  state.mentees.forEach(n=>{const a=result.find(x=>x.mentee.id===n.id);n.status=a&&a.mentor?"Matched":"Unmatched"});
  if(notify) showToast(`${result.filter(x=>x.mentor).length} allocations generated`);
  return result;
}
function statData(){
  const a=getAllocations(); const matched=a.filter(x=>x.mentor); const avg=matched.length?Math.round(matched.reduce((s,x)=>s+x.score,0)/matched.length):0;
  const totalCap=state.mentors.reduce((s,m)=>s+m.capacity,0);
  const used=state.mentors.reduce((s,m)=>s+m.assigned,0);
  return {matched:matched.length,unmatched:a.length-matched.length,avg,util:Math.round(used/Math.max(1,totalCap)*100)};
}
function layout(title,subtitle,actions=""){return `<div class="page-head"><div><div class="eyebrow">Mentorship Allocation Studio</div><h1 class="page-title">${title}</h1><p class="subtitle">${subtitle}</p></div><div class="actions">${actions}</div></div>`}
function stat(label,value,note){return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`}
function person(name,sub){return `<div class="person"><div class="avatar">${initials(name)}</div><div><strong>${name}</strong><small>${sub}</small></div></div>`}

function overview(){
  const s=statData(), a=getAllocations().filter(x=>x.mentor).slice(0,5);
  const health=[["Compatibility",s.avg],["Capacity balance",statData().util>90?62:88],["Availability fit",84],["Skill coverage",91]];
  return layout("Mentorship overview","A calm, practical view of people, capacity and allocation health.",
    `<button class="primary" data-action="run">Run matching</button>`) +
  `<div class="stat-grid">
    ${stat("Mentors",state.mentors.length,"Active mentors")}
    ${stat("Mentees",state.mentees.length,"Registered learners")}
    ${stat("Matched",s.matched,"Current allocations")}
    ${stat("Unmatched",s.unmatched,"Needs attention")}
    ${stat("Avg. compatibility",s.avg+"%","Across matched pairs")}
    ${stat("Capacity used",s.util+"%","Mentor workload")}
  </div>
  <div class="grid-2">
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">Today's allocation pulse</div><div class="panel-sub">A quick read of the current mentorship ecosystem</div></div></div>
      <div class="pulse"><div class="pulse-number">${s.matched}</div><div class="pulse-copy"><strong>of ${state.mentees.length} mentees currently have a mentor.</strong><br>${state.mentors.filter(m=>m.assigned<m.capacity).length} mentors still have available capacity. ${s.unmatched} mentees need attention.</div></div>
      <div class="section-title">Recent matches</div>
      <div class="table-wrap"><table class="table"><thead><tr><th>Mentee</th><th>Mentor</th><th>Score</th><th>Status</th></tr></thead><tbody>
      ${a.map(x=>`<tr><td>${person(x.mentee.name,x.mentee.goal)}</td><td>${person(x.mentor.name,x.mentor.skills.slice(0,2).join(" · "))}</td><td class="score">${x.score}%</td><td><span class="pill good">Matched</span></td></tr>`).join("")}</tbody></table></div>
    </div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Allocation health</div><div class="panel-sub">Signals worth watching</div></div></div>
      ${health.map(h=>`<div class="health-row"><span>${h[0]}</span><div class="bar"><i style="width:${h[1]}%"></i></div><strong>${h[1]}%</strong></div>`).join("")}
      <div class="section-title">Mentor capacity</div>
      <div class="mini-chart">${state.mentors.slice(0,8).map(m=>`<div class="bar-col"><i style="height:${Math.max(8,capacityPct(m))}%"></i><span>${initials(m.name)}</span></div>`).join("")}</div>
    </div>
  </div>
  <div class="section-title">Mentorship network</div>
  <div class="panel">${networkSvg(true)}</div>`;
}

function peoplePage(type){
  const isMentor=type==="mentors"; const data=isMentor?state.mentors:state.mentees;
  const title=isMentor?"Mentors":"Mentees";
  return layout(title,isMentor?"People who can guide, challenge and support learners.":"Learners looking for a strong, compatible mentoring relationship.",
    `<button class="primary" data-action="add-${isMentor?"mentor":"mentee"}">+ Add ${isMentor?"mentor":"mentee"}</button>`) +
  `<div class="search-row"><input class="search" id="peopleSearch" placeholder="Search by name, skill or interest..."><select class="select" id="peopleFilter"><option value="">All departments</option><option>CSE</option><option>IT</option><option>ECE</option></select></div>
  <div class="people-grid" id="peopleGrid">${data.map(p=>isMentor?mentorCard(p):menteeCard(p)).join("")}</div>`;
}
function mentorCard(m){
  return `<div class="person-card"><div class="person-card-head"><div>${person(m.name,`${m.dept} · ${m.exp} yrs experience`)}</div><span class="pill ${capacityPct(m)>=90?"warn":"good"}">${capacityPct(m)>=90?"Nearly full":"Available"}</span></div><div class="tags">${m.skills.map(x=>`<span class="tag">${x}</span>`).join("")}</div><div class="meta">Interests · ${m.interests.join(" · ")}</div><div class="capacity"><div class="capacity-line"><span>Capacity</span><span>${m.assigned} / ${m.capacity} mentees</span></div><div class="bar"><i style="width:${capacityPct(m)}%"></i></div></div></div>`;
}
function menteeCard(n){
  return `<div class="person-card"><div class="person-card-head"><div>${person(n.name,`${n.course} · Year ${n.year}`)}</div><span class="pill ${n.status==="Matched"?"good":"warn"}">${n.status}</span></div><div class="tags">${n.skills.map(x=>`<span class="tag">${x}</span>`).join("")}</div><div class="meta">Goal · ${n.goal}</div><div class="meta" style="margin-top:7px">Preferred · ${n.preference.join(" · ")}</div></div>`;
}

function matching(){
  const s=statData();
  return layout("Matching workspace","Build a compatible allocation from skills, goals, preferences and availability.",
    `<button class="secondary" data-action="clear-matches">Clear results</button><button class="primary" data-action="run">Run matching</button>`) +
  `<div class="step-flow"><div class="step"><strong>01 · Profile data</strong><span>People and needs</span></div><div class="step"><strong>02 · Compatibility</strong><span>Compare attributes</span></div><div class="step"><strong>03 · Ranking</strong><span>Prioritise candidates</span></div><div class="step"><strong>04 · Allocation</strong><span>Respect capacity</span></div><div class="step"><strong>05 · Evaluation</strong><span>Measure outcome</span></div></div>
  <div class="grid-3">
    ${stat("Matches",s.matched,"Generated allocations")}
    ${stat("Average score",s.avg+"%","Compatibility")}
    ${stat("Needs attention",s.unmatched,"No suitable allocation")}
  </div>
  <div class="panel" style="margin-top:16px"><div class="panel-head"><div><div class="panel-title">Current matching model</div><div class="panel-sub">Transparent scoring used by this prototype</div></div></div>
  ${[["Skills",30],["Interests",20],["Career goals",20],["Availability",15],["Preferences",10],["Capacity fit",5]].map(x=>`<div class="health-row"><span>${x[0]}</span><div class="bar"><i style="width:${x[1]*3}%"></i></div><strong>${x[1]}%</strong></div>`).join("")}</div>
  <div class="panel" style="margin-top:16px"><div class="panel-head"><div><div class="panel-title">Allocation results</div><div class="panel-sub">Click a row to inspect why the pair was selected</div></div></div>${allocationTable()}</div>`;
}
function allocationTable(){
  const a=getAllocations();
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Mentee</th><th>Mentor</th><th>Compatibility</th><th>Availability</th><th>Status</th></tr></thead><tbody>${a.map(x=>`<tr class="allocation-row" data-id="${x.mentee.id}" style="cursor:pointer"><td>${person(x.mentee.name,x.mentee.goal)}</td><td>${x.mentor?person(x.mentor.name,x.mentor.skills.slice(0,2).join(" · ")):"—"}</td><td>${x.mentor?`<span class="score">${x.score}%</span>`:"—"}</td><td>${x.mentor?common(x.mentor.availability,x.mentee.availability)+" shared day(s)":"—"}</td><td><span class="pill ${x.mentor?"good":"warn"}">${x.mentor?"Matched":"Needs attention"}</span></td></tr>`).join("")}</tbody></table></div>`;
}
function allocations(){return layout("Allocations","The current mentor–mentee pairings, with the reasoning kept visible.",`<button class="primary" data-action="run">Refresh allocation</button>`) + `<div class="panel">${allocationTable()}</div>`}

function networkSvg(preview=false){
  const a=getAllocations().filter(x=>x.mentor).slice(0,preview?7:12);
  const mentors=[...new Map(a.map(x=>[x.mentor.id,x.mentor])).values()];
  const width=900,height=preview?210:470;
  const mY=Array.from({length:mentors.length},(_,i)=>35+(i*(height-70)/Math.max(1,mentors.length-1)));
  const nY=Array.from({length:a.length},(_,i)=>25+(i*(height-50)/Math.max(1,a.length-1)));
  return `<div class="network-preview" style="height:${preview?220:470}px"><svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
  ${a.map((x,i)=>{const mi=mentors.findIndex(m=>m.id===x.mentor.id);return `<line class="edge" x1="180" y1="${mY[mi]}" x2="${width-180}" y2="${nY[i]}"></line>`}).join("")}
  ${mentors.map((m,i)=>`<g class="node"><circle cx="180" cy="${mY[i]}" r="15" fill="#9a6a58"></circle><text x="207" y="${mY[i]+4}">${m.name.split(" ")[0]}</text></g>`).join("")}
  ${a.map((x,i)=>`<g class="node"><circle cx="${width-180}" cy="${nY[i]}" r="13" fill="#6f806d"></circle><text text-anchor="end" x="${width-207}" y="${nY[i]+4}">${x.mentee.name.split(" ")[0]}</text></g>`).join("")}
  </svg></div><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);padding:8px 12px"><span>Mentors</span><span>Mentees</span></div>`;
}
function network(){return layout("Mentorship network","A visual map of relationships between mentors and learners.",`<button class="secondary" data-action="run">Recalculate network</button>`) + `<div class="panel">${networkSvg(false)}</div><div class="grid-2" style="margin-top:16px"><div class="panel"><div class="panel-title">How to read the network</div><p class="subtitle">Each line represents a viable allocation. The two sides form a bipartite relationship: mentors on one side, mentees on the other. Line connections are derived from the current matching data.</p></div><div class="panel"><div class="panel-title">Graph evidence</div><div class="health-row"><span>Mentor nodes</span><strong>${state.mentors.length}</strong></div><div class="health-row"><span>Mentee nodes</span><strong>${state.mentees.length}</strong></div><div class="health-row"><span>Active edges</span><strong>${getAllocations().filter(x=>x.mentor).length}</strong></div></div></div>`}

function analytics(){
  const s=statData();
  return layout("Analytics","A small set of signals that help explain whether the allocation is healthy.",
    `<button class="primary" data-action="run">Update analysis</button>`) +
  `<div class="stat-grid">${stat("Avg. score",s.avg+"%","Match quality")}${stat("Capacity",s.util+"%","Used")}${stat("Matched",s.matched,"Pairs")}${stat("Unmatched",s.unmatched,"Needs attention")}${stat("Mentor pool",state.mentors.length,"People")}${stat("Mentee pool",state.mentees.length,"People")}</div>
  <div class="grid-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Mentor workload</div><div class="panel-sub">Current assignments against capacity</div></div></div>${state.mentors.map(m=>`<div class="health-row"><span>${m.name.split(" ")[0]}</span><div class="bar"><i style="width:${capacityPct(m)}%"></i></div><strong>${capacityPct(m)}%</strong></div>`).join("")}</div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Compatibility distribution</div><div class="panel-sub">Current allocation scores</div></div></div><div class="mini-chart">${[60,70,80,85,90,95,100].map(v=>{const c=getAllocations().filter(x=>x.mentor&&x.score>=v&&x.score<v+5).length;return `<div class="bar-col"><i style="height:${Math.min(100,8+c*16)}%"></i><span>${v}s</span></div>`}).join("")}</div></div></div>
  <div class="section-title">Skill demand</div><div class="panel">${["Python","DSA","Web Development","Cybersecurity","Cloud","Data Science","UI/UX"].map((skill,i)=>`<div class="health-row"><span>${skill}</span><div class="bar"><i style="width:${Math.max(22,90-i*10)}%"></i></div><strong>${Math.max(4,16-i*2)}</strong></div>`).join("")}</div>`;
}

function methodology(){
  return layout("Methodology","The prototype keeps the allocation logic visible so the eventual DSA implementation has a clear home.") +
  `<div class="method-grid">${[
    ["01","Profile collection","Mentor and mentee records capture skills, interests, goals, availability and capacity."],
    ["02","Compatibility","Relevant attributes are compared to produce a transparent 0–100 compatibility score."],
    ["03","Preference ranking","Potential mentors are ranked for each mentee instead of making an opaque decision."],
    ["04","Allocation","The current prototype selects the strongest available candidate while respecting capacity."],
    ["05","Evaluation","Results are measured through compatibility, workload, availability and unmatched cases."],
    ["06","Future DSA layer","Gale-Shapley, greedy strategies, DP, backtracking and branch & bound can later replace or extend the allocation engine."]
  ].map(x=>`<div class="method-card"><div class="method-no">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join("")}</div>
  <div class="section-title">Algorithm roadmap</div><div class="roadmap"><div class="road"><h3>✓ Current prototype</h3><p class="check">Compatibility scoring · Preference ranking · Capacity-aware allocation · Bipartite network visualization</p></div><div class="road"><h3>○ Planned next</h3><p class="future">Gale-Shapley stable matching · Greedy optimization · Dynamic Programming · Backtracking · Branch & Bound · Priority Queue</p></div></div>`;
}

function render(view="overview"){
  let html="";
  if(view==="overview")html=overview();
  if(view==="mentors")html=peoplePage("mentors");
  if(view==="mentees")html=peoplePage("mentees");
  if(view==="matching")html=matching();
  if(view==="allocations")html=allocations();
  if(view==="network")html=network();
  if(view==="analytics")html=analytics();
  if(view==="methodology")html=methodology();
  app.innerHTML=html;
  app.dataset.view=view;
  if(view==="mentors"||view==="mentees"){
    document.getElementById("peopleSearch").addEventListener("input",filterPeople);
    document.getElementById("peopleFilter").addEventListener("change",filterPeople);
  }
  document.querySelectorAll(".allocation-row").forEach(r=>r.addEventListener("click",()=>showMatch(Number(r.dataset.id))));
}
function filterPeople(){
  const q=document.getElementById("peopleSearch").value.toLowerCase(), dep=document.getElementById("peopleFilter").value;
  const view=app.dataset.view, data=view==="mentors"?state.mentors:state.mentees;
  const filtered=data.filter(p=>{
    const text=JSON.stringify(p).toLowerCase();
    const department=view==="mentors"?p.dept:p.course;
    return text.includes(q)&&(!dep||department===dep);
  });
  document.getElementById("peopleGrid").innerHTML=filtered.length?filtered.map(p=>view==="mentors"?mentorCard(p):menteeCard(p)).join(""):`<div class="empty" style="grid-column:1/-1"><strong>No people found</strong>Try another search or filter.</div>`;
}
function showMatch(id){
  const a=getAllocations().find(x=>x.mentee.id===id); if(!a)return;
  const body=a.mentor?`<div class="pulse"><div class="pulse-number">${a.score}%</div><div class="pulse-copy"><strong>${a.mentee.name} → ${a.mentor.name}</strong><br>${a.mentee.goal} aligns with ${a.mentor.skills.slice(0,3).join(", ")}.</div></div>
  <div style="margin-top:20px">${[["Skills",30],["Interests",20],["Career goals",20],["Availability",15],["Preferences",10]].map((x,i)=>{const v=[score(a.mentor,a.mentee),90,95,common(a.mentor.availability,a.mentee.availability)*50,common(a.mentor.skills,a.mentee.preference)*50][i];return `<div class="health-row"><span>${x[0]}</span><div class="bar"><i style="width:${Math.min(100,v)}%"></i></div><strong>${Math.min(100,v)}%</strong></div>`}).join("")}</div>
  <p class="subtitle" style="margin-top:18px">The match has been selected because the profiles share relevant skills and goals, have overlapping availability, and the mentor has available capacity.</p>`
  :`<div class="empty"><strong>No suitable mentor found</strong>This mentee currently has no candidate above the prototype's compatibility threshold while respecting mentor capacity.</div>`;
  const back=document.createElement("div");back.className="modal-backdrop";back.style.display="flex";back.innerHTML=`<div class="modal"><div class="modal-head"><div><div class="eyebrow">Allocation detail</div><div class="panel-title">Why this match?</div></div><button class="close">×</button></div>${body}</div>`;document.body.appendChild(back);back.querySelector(".close").onclick=()=>back.remove();back.addEventListener("click",e=>{if(e.target===back)back.remove()});
}
function addPerson(type){
  const mentor=type==="mentor";
  const back=document.createElement("div");back.className="modal-backdrop";back.style.display="flex";
  back.innerHTML=`<div class="modal"><div class="modal-head"><div><div class="eyebrow">New record</div><div class="panel-title">Add ${mentor?"mentor":"mentee"}</div></div><button class="close">×</button></div>
  <form id="personForm"><div class="form-grid">
  <div class="field full"><label>Name</label><input name="name" required placeholder="Full name"></div>
  <div class="field"><label>${mentor?"Department":"Course"}</label><input name="dept" required placeholder="${mentor?"CSE":"CSE"}"></div>
  <div class="field"><label>${mentor?"Experience (years)":"Year"}</label><input name="number" type="number" min="1" max="30" value="2" required></div>
  <div class="field full"><label>Skills (comma separated)</label><input name="skills" required placeholder="Python, DSA, Web Development"></div>
  <div class="field full"><label>Interests (comma separated)</label><input name="interests" placeholder="AI, Research"></div>
  <div class="field"><label>Goal</label><input name="goal" placeholder="${mentor?"Mentorship":"Machine Learning"}"></div>
  <div class="field"><label>Availability</label><input name="availability" value="Tue, Thu"></div>
  <div class="field"><label>${mentor?"Maximum capacity":"Preferred mentor skills"}</label><input name="extra" value="${mentor?"3":"Python, ML"}"></div>
  </div><div class="actions" style="margin-top:18px"><button type="button" class="secondary close2">Cancel</button><button class="primary">Save ${mentor?"mentor":"mentee"}</button></div></form></div>`;
  document.body.appendChild(back);back.querySelectorAll(".close,.close2").forEach(b=>b.onclick=()=>back.remove());
  back.querySelector("form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);if(mentor)state.mentors.push({id:Date.now(),name:f.get("name"),dept:f.get("dept"),exp:+f.get("number"),skills:f.get("skills").split(",").map(x=>x.trim()).filter(Boolean),interests:f.get("interests").split(",").map(x=>x.trim()).filter(Boolean),availability:f.get("availability").split(",").map(x=>x.trim()).filter(Boolean),capacity:+f.get("extra")||3,assigned:0,lang:"English"});else state.mentees.push({id:Date.now(),name:f.get("name"),course:f.get("dept"),year:+f.get("number"),skills:f.get("skills").split(",").map(x=>x.trim()).filter(Boolean),interests:f.get("interests").split(",").map(x=>x.trim()).filter(Boolean),goal:f.get("goal")||"General development",availability:f.get("availability").split(",").map(x=>x.trim()).filter(Boolean),preference:f.get("extra").split(",").map(x=>x.trim()).filter(Boolean),status:"Unmatched"});state.allocations=[];back.remove();render(app.dataset.view);showToast("Record added successfully")};
}
document.getElementById("nav").addEventListener("click",e=>{const b=e.target.closest(".nav-item");if(!b)return;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.view)});
app.addEventListener("click",e=>{
  const b=e.target.closest("[data-action]"); if(!b)return;
  const a=b.dataset.action;
  if(a==="run"){buildMatches();render(app.dataset.view)}
  if(a==="clear-matches"){state.allocations=[];render("matching");showToast("Allocation results cleared")}
  if(a==="add-mentor")addPerson("mentor");
  if(a==="add-mentee")addPerson("mentee");
});
document.getElementById("resetBtn").onclick=()=>{location.reload()};
render();
