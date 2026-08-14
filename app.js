
(() => {
  "use strict";

  const D = window.ROQ_DATA;
  const PROGRAMS = [1,2,3,4,5];
  const STORAGE_KEY = "roq_tools_premium_v1";
  const MANUAL_KEY = "roq_tools_manual_recipes_v1";

  const MAP = [
    ["Wilanów", "Agresywnie", "⚔️"],
    ["Mokotów", "Przyjacielski", "🤝"],
    ["Ursynów", "Błagalny", "🙏"],
    ["Ochota", "Neutralny", "⚪"],
    ["Śródmieście", "Agresywny", "⚔️"],
    ["Bemowo", "Przyjacielski", "🤝"],
    ["Wola", "Błagalny", "🙏"],
    ["Żoliborz", "Neutralny", "⚪"],
    ["Bielany", "Neutralny", "⚪"],
    ["Praga", "Błagalny", "🙏"],
    ["Białołęka", null, "❓"],
    ["Targówek", null, "❓"]
  ];

  function key(b,y,w,p){ return `${b}|${y}|${w}|${p}`; }

  function loadJson(k, fallback={}) {
    try { return JSON.parse(localStorage.getItem(k)) || fallback; }
    catch { return fallback; }
  }

  let premium = loadJson(STORAGE_KEY, {});
  let manual = loadJson(MANUAL_KEY, {});

  function allRecipes() {
    const out = [];
    for (const baza of D.bases)
      for (const drozdze of D.yeasts)
        for (const woda of D.waters)
          for (const program of PROGRAMS) {
            const k = key(baza,drozdze,woda,program);
            let litry = Object.prototype.hasOwnProperty.call(D.known,k) ? D.known[k] : null;
            if (Object.prototype.hasOwnProperty.call(manual,k)) litry = Number(manual[k]);
            out.push({baza,drozdze,woda,program,litry});
          }
    return out;
  }

  function available(r) {
    if (D.premiumBases.includes(r.baza) && !premium[r.baza]) return false;
    if (D.premiumYeasts.includes(r.drozdze) && !premium[r.drozdze]) return false;
    return true;
  }

  function fmt(n) {
    return Number(n).toLocaleString("pl-PL", {maximumFractionDigits:2});
  }

  function trio(r){ return `${r.baza}|${r.drozdze}|${r.woda}`; }

  function compute() {
    const recipes = allRecipes();
    const avail = recipes.filter(available);
    const known = avail.filter(x=>x.litry!==null).sort((a,b)=>b.litry-a.litry);
    const unknown = avail.filter(x=>x.litry===null);

    const trioMax = new Map();
    for (const r of recipes.filter(x=>x.litry!==null)) {
      trioMax.set(trio(r), Math.max(trioMax.get(trio(r)) ?? -Infinity, r.litry));
    }
    const vals = known.map(x=>x.litry).sort((a,b)=>a-b);
    const threshold = vals.length ? vals[Math.min(Math.floor(vals.length*.8), vals.length-1)] : Infinity;

    for (const r of unknown) {
      r.trioMax = trioMax.get(trio(r)) ?? null;
      r.interesting = r.trioMax !== null && r.trioMax >= threshold;
    }
    unknown.sort((a,b)=>(b.trioMax??-1)-(a.trioMax??-1) || a.baza.localeCompare(b.baza) || a.program-b.program);

    return {recipes, avail, known, unknown};
  }

  const el = id => document.getElementById(id);

  function renderPremium() {
    const names = [...D.premiumBases, ...D.premiumYeasts];
    el("premium-grid").innerHTML = names.map(name => `
      <label class="check-card">
        <input type="checkbox" data-premium="${name.replaceAll('"','&quot;')}" ${premium[name] ? "checked":""}>
        <span>${name}</span>
      </label>
    `).join("");

    document.querySelectorAll("[data-premium]").forEach(cb=>{
      cb.addEventListener("change",()=>{
        premium[cb.dataset.premium] = cb.checked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(premium));
        renderAll();
      });
    });
  }

  function recipeCard(r,i) {
    return `<article class="recipe-card">
      <div class="rank">${i+1}.</div>
      <div class="recipe-main">
        <strong>${r.baza}</strong>
        <small>${r.drozdze} · ${r.woda} · P${r.program}</small>
      </div>
      <div class="liters">${fmt(r.litry)} l</div>
    </article>`;
  }

  function renderTop(data) {
    el("top-list").innerHTML = data.known.slice(0,10).map(recipeCard).join("") ||
      `<div class="empty">Brak znanych receptur dla wybranych składników.</div>`;
  }

  function renderUnknown(data) {
    const list = data.unknown.slice(0,60);
    el("unknown-list").innerHTML = list.map(r=>`
      <article class="unknown-card ${r.interesting ? "interesting":""}">
        <div>
          <strong>${r.baza}</strong>
          <small>${r.drozdze} · ${r.woda} · P${r.program}</small>
        </div>
        ${r.interesting ? `<div class="hint">⭐ Interesująca do zbadania<br><span>Inny program tej trójki: do ${fmt(r.trioMax)} l</span></div>` : ""}
      </article>
    `).join("") || `<div class="empty">Brak nieodkrytych receptur dla wybranych składników.</div>`;
  }

  function renderProgress(data) {
    const globalKnown = data.recipes.filter(x=>x.litry!==null).length;
    const globalPct = globalKnown/data.recipes.length*100;
    const availPct = data.avail.length ? data.known.length/data.avail.length*100 : 0;
    el("progress-body").innerHTML = `
      <div class="stat-grid">
        <div class="stat"><span>Znane</span><strong>${globalKnown} / ${data.recipes.length}</strong></div>
        <div class="stat"><span>Nieodkryte</span><strong>${data.recipes.length-globalKnown}</strong></div>
        <div class="stat"><span>Postęp</span><strong>${globalPct.toFixed(1).replace(".",",")}%</strong></div>
        <div class="stat"><span>Dostępne</span><strong>${data.known.length} / ${data.avail.length}</strong></div>
      </div>
      <h3>Cała baza</h3>
      <div class="progress"><div style="width:${globalPct}%"></div></div>
      <h3>Twoje dostępne składniki</h3>
      <div class="progress"><div style="width:${availPct}%"></div></div>
      <p class="muted">Nieodkryte dla Twoich składników: <b>${data.unknown.length}</b></p>
    `;
  }

  function renderMap() {
    el("map-list").innerHTML = MAP.map(([district,action,icon])=>`
      <div class="map-row">
        <strong>${district}</strong>
        <span class="${action ? "" : "unknown"}">${icon} ${action ?? "Nieodkryte"}</span>
      </div>
    `).join("");
  }

  function renderAll() {
    renderPremium();
    const data = compute();
    renderTop(data);
    renderUnknown(data);
    renderProgress(data);
  }

  document.querySelectorAll("[data-tab]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active", x===btn));
      document.querySelectorAll(".view").forEach(v=>v.hidden = v.id !== btn.dataset.tab);
    });
  });

  renderMap();
  renderAll();

  // Install prompt
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    el("install-btn").hidden = false;
  });

  el("install-btn").addEventListener("click", async ()=>{
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    el("install-btn").hidden = true;
  });

  window.addEventListener("appinstalled",()=>{ el("install-btn").hidden = true; });

  // Offline state
  function onlineState() {
    el("net-state").textContent = navigator.onLine ? "online" : "offline";
    el("net-state").classList.toggle("offline", !navigator.onLine);
  }
  addEventListener("online",onlineState);
  addEventListener("offline",onlineState);
  onlineState();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  }
})();
