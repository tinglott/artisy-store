(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function l(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=l(t);fetch(t.href,n)}})();const I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],D="brw-companion-v1",Y=["I would not sell if my portfolio dropped 20% in a month","My income is stable and unlikely to be disrupted by a recession","I will not need this specific money for at least 10 years","I have a fully funded emergency fund separate from this money","I have experienced a real market downturn before without selling"],T=["Complete the Net Worth and Cash Flow worksheets. Confirm your emergency fund and high-interest debt status.","Capture the full employer 401(k) match if you aren't already. Complete your account inventory.","Choose Traditional vs. Roth IRA and set up or confirm automatic contributions.","Complete your risk assessment and set a target allocation.","Audit current fund expense ratios; replace any high-cost funds if appropriate.","Review asset location across accounts against your tax strategy.","Mid-year rebalancing check — compare current allocation to target.","Evaluate whether a backdoor Roth or mega backdoor Roth applies to you.","If self-employed, compare SEP-IRA vs. Solo 401(k) before year-end deadlines.","Complete or update your Investment Policy Statement.","Run the advisor-vetting checklist if you're considering professional help.","Beneficiary audit. Recalculate net worth and compare it to month 1."],F=[["checking","Checking / savings"],["emergency","Emergency fund"],["retirement","401(k)/403(b)"],["ira","IRA(s)"],["taxable","Taxable brokerage"],["hsa","HSA"],["realestate","Real estate (market value)"],["business","Business equity"],["other","Other assets"]],q=[["creditcard","Credit card balances"],["auto","Auto loans"],["student","Student loans"],["personal","Personal loans"],["mortgage","Mortgage balance"],["otherdebt","Other debt"]],A={us:"U.S. stocks",intl:"International stocks",bonds:"Bonds",alt:"Alternatives (REITs, etc.)",cash:"Cash / equivalents"},O={us:"#1B2E52",intl:"#2E4576",bonds:"#B68A35",alt:"#8A6423",cash:"#C9BFA0"},_={networth:{snapshots:[]},cashflow:{year:new Date().getFullYear(),months:{}},allocation:{target:{us:42,intl:18,bonds:15,alt:10,cash:15},current:{us:0,intl:0,bonds:0,alt:0,cash:0},risk:{answers:[null,null,null,null,null]},quarters:{}},contributions:{year:2026,accounts:{k401:{label:"401(k) / 403(b)",limit:24500,months:Array(12).fill(0)},ira:{label:"IRA (Trad. + Roth)",limit:7500,months:Array(12).fill(0)},hsa:{label:"HSA",limit:4400,months:Array(12).fill(0)}}},goals:{retirement:{targetAge:"",incomeNeeded:"",yearsLeft:"",currentBalance:"",currentMonthly:"",targetMonthly:""},items:[]},actionPlan:{done:{}}};function R(e,a){if(Array.isArray(e))return a!==void 0?a:e;if(typeof e=="object"&&e!==null){const l={...e};return a&&typeof a=="object"&&Object.keys(a).forEach(s=>{l[s]=s in e?R(e[s],a[s]):a[s]}),l}return a!==void 0?a:e}const P={async get(e){try{const a=localStorage.getItem(e);return a!==null?{value:a}:null}catch{return null}},async set(e,a){try{localStorage.setItem(e,a)}catch(l){console.warn("storage.set failed",l)}}};let j=null;async function V(){try{const e=await P.get(D);if(e&&e.value){const a=JSON.parse(e.value);return R(_,a)}}catch(e){console.warn("loadData failed, using defaults",e)}return JSON.parse(JSON.stringify(_))}function f(e){clearTimeout(j),j=setTimeout(()=>{P.set(D,JSON.stringify(e)).catch(a=>console.warn("save failed",a))},350)}function Q(e){e=Number(e)||0;const a=e<0;e=Math.abs(e);const l="$"+e.toLocaleString("en-US",{maximumFractionDigits:0});return a?"-"+l:l}function g(e){e=Number(e)||0;const a=e<0;e=Math.abs(e);let l;return e>=1e6?l="$"+(e/1e6).toFixed(1).replace(/\\.0$/,"")+"M":e>=1e3?l="$"+(e/1e3).toFixed(1).replace(/\\.0$/,"")+"k":l="$"+e.toFixed(0),a?"-"+l:l}function m(e){return Object.values(e).reduce((a,l)=>a+(Number(l)||0),0)}function H(e){return Object.values(e).reduce((a,l)=>a+(Number(l)||0),0)}function $(e){const a=document.getElementById("toast");a&&(a.textContent=e,a.classList.add("show"),clearTimeout(a._timer),a._timer=setTimeout(()=>a.classList.remove("show"),1800))}function G(e,a={}){const l=a.w||300,s=a.h||140,t={t:14,r:10,b:22,l:10};if(e.length===0)return'<div class="empty">No data yet</div>';const n=e.map(p=>p.y);let o=Math.min(0,...n),c=Math.max(...n);c===o&&(c=o+1);const v=l-t.l-t.r,r=s-t.t-t.b,d=e.length>1?v/(e.length-1):0,u=p=>t.t+r-(p-o)/(c-o)*r,h=e.map((p,w)=>({x:t.l+w*d,y:u(p.y)})),b=h.map((p,w)=>(w===0?"M":"L")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" "),B=b+` L${h[h.length-1].x.toFixed(1)},${t.t+r} L${h[0].x.toFixed(1)},${t.t+r} Z`,S=u(0),L=h.map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="${a.color}"/>`).join(""),M=e.map((p,w)=>{if(!(w===0||w===e.length-1||e.length<=4))return"";const U=w===0?"start":w===e.length-1?"end":"middle";return`<text x="${h[w].x.toFixed(1)}" y="${s-6}" font-size="9.5" fill="#6B6553" text-anchor="${U}" font-family="DM Sans">${p.x}</text>`}).join("");return`<svg class="chart-wrap" viewBox="0 0 ${l} ${s}" width="100%" height="${s}">

    <line x1="${t.l}" y1="${S.toFixed(1)}" x2="${l-t.r}" y2="${S.toFixed(1)}" stroke="#DFD3B4" stroke-width="1" stroke-dasharray="2,3"/>

    <path d="${B}" fill="${a.color}" opacity="0.12"/>

    <path d="${b}" fill="none" stroke="${a.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>

    ${L}

    ${M}

  </svg>`}function K(e,a={}){const l=a.w||300,s=a.h||140,t={t:10,r:6,b:20,l:6};if(e.length===0)return'<div class="empty">No data yet</div>';const n=e.map(b=>b.value),o=Math.max(1,...n.map(b=>Math.abs(b))),c=l-t.l-t.r,v=s-t.t-t.b,r=4,d=(c-r*(e.length-1))/e.length,u=e.map((b,B)=>{const S=Math.max(2,Math.abs(b.value)/o*v),L=t.l+B*(d+r),M=t.t+v-S;return`<rect x="${L.toFixed(1)}" y="${M.toFixed(1)}" width="${d.toFixed(1)}" height="${S.toFixed(1)}" rx="2.5" fill="${a.color}"/>`}).join(""),h=e.map((b,B)=>{const S=t.l+B*(d+r)+d/2;return e.length>6&&B%3!==0&&B!==e.length-1?"":`<text x="${S.toFixed(1)}" y="${s-6}" font-size="8.5" fill="#6B6553" text-anchor="middle" font-family="DM Sans">${b.label}</text>`}).join("");return`<svg class="chart-wrap" viewBox="0 0 ${l} ${s}" width="100%" height="${s}">${u}${h}</svg>`}function X(e,a={}){const l=a.size||150,s=a.stroke||20,t=e.reduce((d,u)=>d+u.value,0)||1,n=(l-s)/2,o=l/2,c=2*Math.PI*n;let v=0;const r=e.map(d=>{const h=d.value/t*c,b=`<circle cx="${o}" cy="${o}" r="${n}" fill="none" stroke="${d.color}" stroke-width="${s}"

        stroke-dasharray="${h.toFixed(2)} ${(c-h).toFixed(2)}" stroke-dashoffset="${(-v).toFixed(2)}" transform="rotate(-90 ${o} ${o})"/>`;return v+=h,b}).join("");return`<svg width="${l}" height="${l}" viewBox="0 0 ${l} ${l}">${r}</svg>`}let i=JSON.parse(JSON.stringify(_)),y="home",C={},E="contrib",N=new Date().getMonth();function Z(){const e=i.cashflow.months,a=Object.keys(e);if(a.length===0)return null;const l=a.sort((o,c)=>c-o)[0],s=e[l],t=Number(s.income)||0;if(t<=0)return null;const n=t-(Number(s.fixed)||0)-(Number(s.variable)||0)-(Number(s.discretionary)||0);return{rate:Math.round(n/t*100),avail:n,month:l}}function ee(){const e=i.allocation.target,a=i.allocation.current,l=H(a);if(l===0)return null;let s=0;return Object.keys(e).forEach(t=>{const n=(Number(a[t])||0)/l*100;s=Math.max(s,Math.abs(n-e[t]))}),Math.round(s)}function z(e){return e===null?null:e>=20?{label:"Aggressive capacity",desc:"Likely fits an equity-heavy allocation.",preset:{us:54,intl:24,bonds:8,alt:9,cash:5}}:e>=13?{label:"Balanced / moderate",desc:"A balanced, moderate allocation likely fits better.",preset:{us:40,intl:18,bonds:25,alt:8,cash:9}}:{label:"Conservative",desc:"A more conservative allocation — or more time before adding equity exposure — is worth considering.",preset:{us:24,intl:10,bonds:45,alt:5,cash:16}}}function te(){const e=i.networth.snapshots,a=Z(),l=ee(),s=Object.values(i.actionPlan.done).filter(Boolean).length,t=T.findIndex((o,c)=>!i.actionPlan.done[c]);let n=`<div class="empty">

      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B68A35" stroke-width="1.6"><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M20 19V3"/></svg>

      <p>Log your first snapshot on the Net Worth tab to start your trend line.</p>

    </div>`;if(e.length>0){const o=e.slice(-8).map(c=>({x:new Date(c.date).toLocaleDateString("en-US",{month:"short",year:"2-digit"}),y:m(c.assets)-m(c.liabilities)}));n=G(o,{w:300,h:130,color:"#8A6423"})}return`

  <div class="section-title"><h2>This month</h2></div>

  <div class="stat-grid">

    <div class="stat">

      <div class="k">Savings rate</div>

      <div class="v">${a?a.rate+"%":"—"}</div>

    </div>

    <div class="stat">

      <div class="k">Allocation drift</div>

      <div class="v">${l!==null?l+" pts":"—"}</div>

    </div>

    <div class="stat">

      <div class="k">Net worth check-ins</div>

      <div class="v">${e.length}</div>

    </div>

    <div class="stat">

      <div class="k">12-month plan</div>

      <div class="v">${s}/12</div>

    </div>

  </div>

  <div class="section-title"><h2>Net worth trend</h2></div>

  <div class="card">${n}</div>

  <div class="section-title"><h2>Where to focus next</h2></div>

  <div class="card">

    ${t===-1?`<p style="font-size:14px;">You've marked every step of the 12-month action plan complete. Time to recalculate your net worth and start the next cycle.</p>`:`<p class="small-note" style="margin-top:0;color:var(--ink-soft);">Step ${t+1} of your 12-month plan</p>

         <p style="font-size:14.5px;">${T[t]}</p>

         <div style="margin-top:12px;"><button class="btn ghost small" data-goto="plan">Open the plan →</button></div>`}

  </div>

  <div class="section-title"><h2>Reminders</h2></div>

  <div class="card">

    <div class="list-row"><span class="l">Emergency fund (3–6 mo. expenses)</span><span class="r">Check gatekeeper</span></div>

    <div class="list-row"><span class="l">High-interest debt</span><span class="r">Pay before investing more</span></div>

    <div class="list-row"><span class="l">This is educational, not advice</span><span class="r">See a fiduciary/CPA</span></div>

  </div>

  `}function ae(){const e=i.networth.snapshots,a=e.map(s=>({x:new Date(s.date).toLocaleDateString("en-US",{month:"short",year:"2-digit"}),y:m(s.assets)-m(s.liabilities)})),l=e.slice().reverse().map((s,t)=>{const n=e.length-1-t,o=m(s.assets),c=m(s.liabilities),v=o-c,r=e[n-1];let d="—";if(r){const u=v-(m(r.assets)-m(r.liabilities));d=(u>=0?"+":"")+g(u)}return`<div class="list-row">

      <span class="l">${new Date(s.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>

      <span class="r">${g(v)} <span style="color:var(--ink-soft);font-weight:500;font-size:12px;">(${d})</span></span>

    </div>`}).join("")||'<div class="empty">No snapshots yet.</div>';return`

  <div class="section-title"><h2>Net worth history</h2><span class="section-sub">Appendix E</span></div>

  <div class="card">

    ${a.length>0?G(a,{w:300,h:140,color:"#8A6423"}):'<div class="empty">Add a snapshot below to begin your 5-year tracker.</div>'}

  </div>

  <div class="card" style="padding:8px 16px;">

    ${l}

  </div>

  <div class="section-title"><h2>New snapshot</h2><span class="section-sub">Worksheet 1.1</span></div>

  <div class="card">

    <div class="field">

      <label>Date</label>

      <input type="date" id="nwDate" value="${new Date().toISOString().slice(0,10)}">

    </div>

    <h3 style="margin:12px 0 8px;color:var(--navy);">Assets</h3>

    ${F.map(([s,t])=>`<div class="field"><label>${t}</label><input type="number" inputmode="decimal" id="asset_${s}" placeholder="0"></div>`).join("")}

    <h3 style="margin:16px 0 8px;color:var(--navy);">Liabilities</h3>

    ${q.map(([s,t])=>`<div class="field"><label>${t}</label><input type="number" inputmode="decimal" id="liab_${s}" placeholder="0"></div>`).join("")}

    <button class="btn gold" id="saveSnapshotBtn">Save snapshot</button>

    <p class="small-note">Repeat this every 6–12 months. The trend line matters more than any single number.</p>

  </div>

  `}function ne(){var e;(e=document.getElementById("saveSnapshotBtn"))==null||e.addEventListener("click",()=>{const a=document.getElementById("nwDate").value||new Date().toISOString().slice(0,10),l={},s={};if(F.forEach(([t])=>l[t]=Number(document.getElementById("asset_"+t).value)||0),q.forEach(([t])=>s[t]=Number(document.getElementById("liab_"+t).value)||0),m(l)===0&&m(s)===0){$("Enter at least one amount first");return}i.networth.snapshots.push({date:a,assets:l,liabilities:s}),i.networth.snapshots.sort((t,n)=>new Date(t.date)-new Date(n.date)),f(i),$("Snapshot saved"),x()})}function se(){const e=i.cashflow.months,a=Object.keys(e).map(Number).sort((n,o)=>n-o),l=a.map(n=>{const o=e[n],c=(Number(o.income)||0)-(Number(o.fixed)||0)-(Number(o.variable)||0)-(Number(o.discretionary)||0);return{label:I[n],value:c}}),s=e[N]||{income:"",fixed:"",variable:"",discretionary:""},t=a.slice().reverse().map(n=>{const o=e[n],c=(Number(o.income)||0)-(Number(o.fixed)||0)-(Number(o.variable)||0)-(Number(o.discretionary)||0),v=o.income?Math.round(c/Number(o.income)*100):0;return`<div class="list-row"><span class="l">${I[n]} ${i.cashflow.year}</span><span class="r">${g(c)} <span style="color:var(--ink-soft);font-weight:500;font-size:12px;">(${v}%)</span></span></div>`}).join("")||'<div class="empty">No months logged yet.</div>';return`

  <div class="section-title"><h2>Available to invest</h2><span class="section-sub">Appendix M</span></div>

  <div class="card">

    ${l.length>0?K(l,{w:300,h:130,color:"#2E4576"}):'<div class="empty">Log a month below to see your trend.</div>'}

  </div>

  <div class="card" style="padding:8px 16px;">${t}</div>

  <div class="section-title"><h2>Log a month</h2><span class="section-sub">Worksheet 1.2</span></div>

  <div class="card">

    <div class="field">

      <label>Month</label>

      <select id="cfMonth">${I.map((n,o)=>`<option value="${o}" ${o===N?"selected":""}>${n} ${i.cashflow.year}</option>`).join("")}</select>

    </div>

    <div class="field"><label>Take-home income (all sources)</label><input type="number" inputmode="decimal" id="cfIncome" value="${s.income||""}" placeholder="0"></div>

    <div class="field"><label>Fixed expenses (housing, insurance, min. debt)</label><input type="number" inputmode="decimal" id="cfFixed" value="${s.fixed||""}" placeholder="0"></div>

    <div class="field"><label>Variable expenses (food, transport, utilities)</label><input type="number" inputmode="decimal" id="cfVariable" value="${s.variable||""}" placeholder="0"></div>

    <div class="field"><label>Discretionary spending</label><input type="number" inputmode="decimal" id="cfDiscretionary" value="${s.discretionary||""}" placeholder="0"></div>

    <button class="btn gold" id="saveCashflowBtn">Save month</button>

    <p class="small-note">A common target for intermediate investors is saving 15–25% of gross income across all accounts — the right number depends on your goals, timeline, and debt load.</p>

  </div>

  `}function le(){var e,a;(e=document.getElementById("cfMonth"))==null||e.addEventListener("change",l=>{N=Number(l.target.value),x()}),(a=document.getElementById("saveCashflowBtn"))==null||a.addEventListener("click",()=>{const l=document.getElementById("cfMonth").value;i.cashflow.months[l]={income:Number(document.getElementById("cfIncome").value)||0,fixed:Number(document.getElementById("cfFixed").value)||0,variable:Number(document.getElementById("cfVariable").value)||0,discretionary:Number(document.getElementById("cfDiscretionary").value)||0},N=Number(l),f(i),$("Month saved"),x()})}function oe(){const e=i.allocation.target,a=i.allocation.current,l=H(a),s=Object.keys(e).map(r=>({label:A[r],value:e[r],color:O[r]})),t=i.allocation.risk.answers,n=t.every(r=>r!==null)?t.reduce((r,d)=>r+d,0):null,o=z(n),v=["Q1","Q2","Q3","Q4"].map(r=>{const d=i.allocation.quarters[r]||{};return`

    <div class="accordion ${C["q"+r]?"open":""}" data-acc="q${r}">

      <div class="accordion-head">

        <h3>${r} Review${d.date?` — ${d.date}`:""}</h3>

        <svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A6423" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>

      </div>

      <div class="accordion-body">

        <div class="field"><label>Date</label><input type="date" id="q${r}_date" value="${d.date||""}"></div>

        <div class="field"><label>On target or drifted? By how much (%)</label><input type="number" id="q${r}_drift" value="${d.drift||""}" placeholder="0"></div>

        <div class="field"><label>Contribution this quarter</label><input type="number" id="q${r}_contrib" value="${d.contrib||""}" placeholder="0"></div>

        <div class="field"><label>Did I stick to my plan?</label>

          <select id="q${r}_stuck">

            <option value="yes" ${d.stuck==="yes"?"selected":""}>Yes</option>

            <option value="no" ${d.stuck==="no"?"selected":""}>No</option>

          </select>

        </div>

        <div class="field"><label>Notes — fund/account changes, what tested the plan</label><input type="text" id="q${r}_notes" value="${d.notes||""}" placeholder="Optional"></div>

        <button class="btn ghost small" data-save-q="${r}">Save ${r}</button>

      </div>

    </div>`}).join("");return`

  <div class="section-title"><h2>Risk self-assessment</h2><span class="section-sub">Worksheet 4.1</span></div>

  <div class="card">

    ${Y.map((r,d)=>`

      <div class="quiz-q">

        <p>${r}</p>

        <div class="scale" data-q="${d}">

          ${[1,2,3,4,5].map(u=>`<button class="${t[d]===u?"active":""}" data-val="${u}">${u}</button>`).join("")}

        </div>

      </div>

    `).join("")}

    ${o?`

      <div class="divider"></div>

      <div class="tag ${n>=20?"green":n>=13?"amber":"red"}">${o.label} · score ${n}/25</div>

      <p style="font-size:13.5px;margin-top:10px;">${o.desc}</p>

      <button class="btn ghost small" id="applyPresetBtn" style="margin-top:10px;">Use as target allocation</button>

    `:'<p class="small-note">Score each statement 1–5 to see a suggested starting allocation.</p>'}

  </div>

  <div class="section-title"><h2>Target vs. current allocation</h2><span class="section-sub">Worksheet 4.2</span></div>

  <div class="card">

    <div style="display:flex;align-items:center;gap:16px;">

      <div>${X(s,{size:110,stroke:16})}</div>

      <div style="flex:1;">

        ${Object.keys(e).map(r=>`<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:4px;"><span class="badge-dot" style="background:${O[r]}"></span>${A[r]} · ${e[r]}%</div>`).join("")}

      </div>

    </div>

    <div class="divider"></div>

    <h3 style="color:var(--navy);margin-bottom:8px;">Set target %</h3>

    ${Object.keys(e).map(r=>`<div class="field"><label>${A[r]}</label><input type="number" id="target_${r}" value="${e[r]}"></div>`).join("")}

    <p class="small-note" id="targetSumNote"></p>

    <div class="divider"></div>

    <h3 style="color:var(--navy);margin-bottom:8px;">Current holdings ($ per bucket)</h3>

    ${Object.keys(a).map(r=>`<div class="field"><label>${A[r]}</label><input type="number" id="current_${r}" value="${a[r]||""}" placeholder="0"></div>`).join("")}

    <button class="btn gold" id="saveAllocBtn">Save allocation</button>

    ${l>0?`

      <div class="divider"></div>

      <h3 style="color:var(--navy);margin-bottom:8px;">Rebalancing gap</h3>

      ${Object.keys(e).map(r=>{const d=Math.round(a[r]/l*100),u=e[r]-d;return`<div class="list-row"><span class="l">${A[r]}</span><span class="r" style="color:${u===0?"var(--ink)":u>0?"var(--green)":"var(--red)"}">${d}% → ${e[r]}% (${u>0?"+":""}${u} pts)</span></div>`}).join("")}

    `:""}

  </div>

  <div class="section-title"><h2>Quarterly portfolio review</h2><span class="section-sub">Appendix F</span></div>

  ${v}

  <p class="small-note" style="margin:4px 0 0;">Allocation drives the large majority of a portfolio's long-term return variance — far more than picking individual winners.</p>

  `}function ie(){var s;document.querySelectorAll(".scale").forEach(t=>{t.addEventListener("click",n=>{const o=n.target.closest("button");if(!o)return;const c=Number(t.dataset.q);i.allocation.risk.answers[c]=Number(o.dataset.val),f(i),x()})});const e=document.getElementById("applyPresetBtn");e&&e.addEventListener("click",()=>{const n=i.allocation.risk.answers.reduce((c,v)=>c+v,0),o=z(n);i.allocation.target={...o.preset},f(i),$("Target allocation updated"),x()}),(s=document.getElementById("saveAllocBtn"))==null||s.addEventListener("click",()=>{const t={};Object.keys(i.allocation.target).forEach(o=>t[o]=Number(document.getElementById("target_"+o).value)||0);const n={};Object.keys(i.allocation.current).forEach(o=>n[o]=Number(document.getElementById("current_"+o).value)||0),i.allocation.target=t,i.allocation.current=n,f(i),$("Allocation saved"),x()}),document.querySelectorAll("[data-acc]").forEach(t=>{var n;(n=t.querySelector(".accordion-head"))==null||n.addEventListener("click",()=>{const o=t.dataset.acc;C[o]=!C[o],t.classList.toggle("open")})}),document.querySelectorAll("[data-save-q]").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.saveQ;i.allocation.quarters[n]={date:document.getElementById(`q${n}_date`).value,drift:document.getElementById(`q${n}_drift`).value,contrib:document.getElementById(`q${n}_contrib`).value,stuck:document.getElementById(`q${n}_stuck`).value,notes:document.getElementById(`q${n}_notes`).value},f(i),$(n+" review saved"),x()})});const a=document.getElementById("targetSumNote");function l(){const t=Object.keys(i.allocation.target).reduce((n,o)=>{var c;return n+(Number((c=document.getElementById("target_"+o))==null?void 0:c.value)||0)},0);a&&(a.textContent=`Target total: ${t}%`+(t!==100?" — adjust so it sums to 100%":" ✓"),a.style.color=t===100?"var(--green)":"var(--red)")}Object.keys(i.allocation.target).forEach(t=>{const n=document.getElementById("target_"+t);n&&n.addEventListener("input",l)}),l()}function re(){return`

  <div class="seg">

    <button data-sub="contrib" class="${E==="contrib"?"active":""}">Contributions</button>

    <button data-sub="goals" class="${E==="goals"?"active":""}">Goals</button>

    <button data-sub="action" class="${E==="action"?"active":""}">12-Month Plan</button>

  </div>

  <div id="planSubContent"></div>

  `}function ce(){const e=i.contributions.accounts,a=Object.keys(e).map(l=>{const s=e[l],t=s.months.reduce((o,c)=>o+(Number(c)||0),0),n=Math.min(100,Math.round(t/s.limit*100));return`

    <div class="card">

      <div class="card-title">

        <h3>${s.label}</h3>

        <span class="tag ${n>=100?"green":n>=60?"amber":""}">${g(t)} / ${g(s.limit)}</span>

      </div>

      <div class="progress-track"><div class="progress-fill ${n>=100?"over":""}" style="width:${n}%"></div></div>

      <div class="small-note">${n}% of the ${i.contributions.year} limit</div>

      <div class="divider"></div>

      <table class="mini-tbl">

        <tr>${I.map(o=>`<th>${o}</th>`).join("")}</tr>

        <tr>${I.map((o,c)=>`<td><input type="number" data-acc="${l}" data-mi="${c}" value="${s.months[c]||""}" placeholder="0"></td>`).join("")}</tr>

      </table>

    </div>`}).join("");return`

  <div class="section-title"><h2>12-month contribution tracker</h2><span class="section-sub">Appendix H</span></div>

  <p class="small-note" style="margin-bottom:12px;">Compared against Appendix C's ${i.contributions.year} IRS limits. These figures change most years — verify current limits at irs.gov.</p>

  ${a}

  `}function de(){const e=i.goals.retirement,l=i.goals.items.map((s,t)=>{const n=(Number(s.targetAmount)||0)-(Number(s.currentSaved)||0);return`

    <div class="card">

      <div class="card-title"><h3>${s.title||"Goal"}</h3>

      <button class="btn danger-ghost small" data-del-goal="${t}">Remove</button></div>

      <div class="list-row"><span class="l">Target amount</span><span class="r">${g(s.targetAmount)}</span></div>

      <div class="list-row"><span class="l">Target date</span><span class="r">${s.targetDate||"—"}</span></div>

      <div class="list-row"><span class="l">Currently saved</span><span class="r">${g(s.currentSaved)}</span></div>

      <div class="list-row"><span class="l">Still needed</span><span class="r">${g(Math.max(0,n))}</span></div>

      <div class="list-row"><span class="l">Monthly contribution</span><span class="r">${g(s.monthlyContribution)}</span></div>

    </div>`}).join("");return`

  <div class="section-title"><h2>Retirement goal</h2><span class="section-sub">Appendix G</span></div>

  <div class="card">

    <div class="field"><label>Target retirement age</label><input type="number" id="ret_age" value="${e.targetAge}"></div>

    <div class="field"><label>Annual income needed in retirement (today's $)</label><input type="number" id="ret_income" value="${e.incomeNeeded}"></div>

    <div class="field"><label>Years until retirement</label><input type="number" id="ret_years" value="${e.yearsLeft}"></div>

    <div class="field"><label>Current retirement balances (401k + IRA + other)</label><input type="number" id="ret_balance" value="${e.currentBalance}"></div>

    <div class="field"><label>Current monthly contribution (all retirement accounts)</label><input type="number" id="ret_currentmonthly" value="${e.currentMonthly}"></div>

    <div class="field"><label>Target monthly contribution</label><input type="number" id="ret_targetmonthly" value="${e.targetMonthly}"></div>

    <button class="btn gold" id="saveRetirementBtn">Save retirement goal</button>

  </div>

  <div class="section-title"><h2>Other goals</h2><span class="section-sub">Home, education, major purchase</span></div>

  ${l}

  <div class="card">

    <div class="field"><label>Goal name</label><input type="text" id="newGoalTitle" placeholder="e.g. House down payment"></div>

    <div class="row">

      <div class="field"><label>Target amount</label><input type="number" id="newGoalAmount" placeholder="0"></div>

      <div class="field"><label>Target date</label><input type="date" id="newGoalDate"></div>

    </div>

    <div class="row">

      <div class="field"><label>Currently saved</label><input type="number" id="newGoalSaved" placeholder="0"></div>

      <div class="field"><label>Monthly contribution</label><input type="number" id="newGoalMonthly" placeholder="0"></div>

    </div>

    <button class="btn ghost" id="addGoalBtn">Add goal</button>

  </div>

  `}function ue(){const e=i.actionPlan.done,a=Object.values(e).filter(Boolean).length,l=T.map((s,t)=>`

    <div class="check-item ${e[t]?"done":""}">

      <div class="check-box ${e[t]?"on":""}" data-idx="${t}">

        ${e[t]?'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>':""}

      </div>

      <div class="m">${t+1}</div>

      <div class="txt">${s}</div>

    </div>

  `).join("");return`

  <div class="section-title"><h2>Your 12-month action plan</h2><span class="section-sub">Chapter 18</span></div>

  <div class="card">

    <div class="progress-track" style="margin-bottom:10px;"><div class="progress-fill ${a===12?"over":""}" style="width:${a/12*100}%"></div></div>

    <div class="small-note" style="margin-bottom:6px;">${a} of 12 months complete</div>

    ${l}

  </div>

  <div class="card">

    <h3 style="color:var(--navy);margin-bottom:8px;">Final reflection</h3>

    <div class="field"><label>The gap between where I started and where I am now</label><input type="text" id="reflGap" value="${i.actionPlan.reflGap||""}"></div>

    <div class="field"><label>The single habit I'm committing to for next year</label><input type="text" id="reflHabit" value="${i.actionPlan.reflHabit||""}"></div>

    <button class="btn ghost small" id="saveReflBtn">Save reflection</button>

  </div>

  `}function ve(){document.querySelectorAll("[data-sub]").forEach(e=>{e.addEventListener("click",()=>{E=e.dataset.sub,k()})}),k()}function k(){var a,l,s;document.querySelectorAll("[data-sub]").forEach(t=>t.classList.toggle("active",t.dataset.sub===E));const e=document.getElementById("planSubContent");e&&(E==="contrib"?(e.innerHTML=ce(),e.querySelectorAll("input[data-acc]").forEach(t=>{t.addEventListener("change",()=>{const n=t.dataset.acc,o=Number(t.dataset.mi);i.contributions.accounts[n].months[o]=Number(t.value)||0,f(i),k()})})):E==="goals"?(e.innerHTML=de(),(a=document.getElementById("saveRetirementBtn"))==null||a.addEventListener("click",()=>{i.goals.retirement={targetAge:document.getElementById("ret_age").value,incomeNeeded:document.getElementById("ret_income").value,yearsLeft:document.getElementById("ret_years").value,currentBalance:document.getElementById("ret_balance").value,currentMonthly:document.getElementById("ret_currentmonthly").value,targetMonthly:document.getElementById("ret_targetmonthly").value},f(i),$("Retirement goal saved")}),(l=document.getElementById("addGoalBtn"))==null||l.addEventListener("click",()=>{const t=document.getElementById("newGoalTitle").value.trim();if(!t){$("Give the goal a name");return}i.goals.items.push({id:Date.now(),title:t,targetAmount:Number(document.getElementById("newGoalAmount").value)||0,targetDate:document.getElementById("newGoalDate").value,currentSaved:Number(document.getElementById("newGoalSaved").value)||0,monthlyContribution:Number(document.getElementById("newGoalMonthly").value)||0}),f(i),$("Goal added"),k()}),e.querySelectorAll("[data-del-goal]").forEach(t=>{t.addEventListener("click",()=>{i.goals.items.splice(Number(t.dataset.delGoal),1),f(i),k()})})):E==="action"&&(e.innerHTML=ue(),e.querySelectorAll(".check-box").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.idx;i.actionPlan.done[n]=!i.actionPlan.done[n],f(i),k(),W()})}),(s=document.getElementById("saveReflBtn"))==null||s.addEventListener("click",()=>{i.actionPlan.reflGap=document.getElementById("reflGap").value,i.actionPlan.reflHabit=document.getElementById("reflHabit").value,f(i),$("Reflection saved")})))}function W(){const e=i.networth.snapshots,a=e[e.length-1],l=a?m(a.assets)-m(a.liabilities):0;document.getElementById("hdrNetWorth").textContent=Q(l);const s=document.getElementById("hdrDelta");if(e.length>1){const t=e[e.length-2],n=m(t.assets)-m(t.liabilities),o=l-n,c=o>0?"pos":o<0?"neg":"flat";s.innerHTML=`<span class="hdr-nw-delta ${c}">${o>0?"▲":o<0?"▼":"—"} ${g(Math.abs(o))} since last check-in</span>`}else s.innerHTML='<span class="hdr-nw-delta flat">Log snapshots to track your trend</span>'}function x(){W();const e=document.getElementById("main");if(y==="home"?e.innerHTML=te():y==="networth"?e.innerHTML=ae():y==="cashflow"?e.innerHTML=se():y==="invest"?e.innerHTML=oe():y==="plan"&&(e.innerHTML=re()),y==="home"){const a=e.querySelector("[data-goto]");a&&a.addEventListener("click",()=>J(a.dataset.goto))}y==="networth"&&ne(),y==="cashflow"&&le(),y==="invest"&&ie(),y==="plan"&&ve(),document.querySelectorAll("nav.tabbar button").forEach(a=>{a.classList.toggle("active",a.dataset.tab===y)}),e.scrollTop=0}function J(e){y=e,x()}async function me(){i=await V(),document.getElementById("loadingScreen").classList.add("hide"),document.getElementById("app").style.display="flex",document.querySelectorAll("nav.tabbar button").forEach(e=>{e.addEventListener("click",()=>J(e.dataset.tab))}),x()}me();
