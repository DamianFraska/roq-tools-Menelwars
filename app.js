
(() => {
  "use strict";

  const D = window.ROQ_DATA;
  const PROGRAMS = [1,2,3,4,5];

  // ============================================================
  // WKLEJ TU URL WEB APP Z GOOGLE APPS SCRIPT
  // Musi kończyć się na /exec
  // ============================================================
  const BACKEND_URL = "https://script.google.com/macros/s/AKfycby8rjCO9HuRtQvQvFoF-OkjFhfnfcS1bTIag0V9LCSJykW6c8k5IZVH8K3pSVFH66ZBKQ/exec";

  const STORAGE_KEY = "roq_tools_premium_v1";
  const REMOTE_KEY = "roq_tools_remote_approved_v1";
  const NICK_KEY = "roq_tools_submitter_nick_v1";

  const DISPLAY_NAMES = {
  "Ziemniak irga": 'Ziemniaki "Irga"',
  "Ziemniak vinieta": 'Ziemniaki "Vineta"',
  "Obierki jabłek": "Obierki po jabłkach",
  "Obierki ziemniaków": "Obierki po ziemniakach",
  "Cukier": 'Cukier "Klasyczny"',

  "Instant": 'Drożdże "Instant"',
  "Babuni": "Drożdże Babuni",
  "Klasyczne": "Drożdże klasyczne",
  "Piekarskie": "Drożdże piekarskie",
  "Turbo": "Turbo drożdże",
  "Winiarskie": "Drożdże winiarskie",

  "Górski strumyk": 'Woda "Górski strumyk"',
  "Menel zdrój": 'Woda "Menel Zdrój"'
};

function displayName(name) {
  return DISPLAY_NAMES[name] || name;
}

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

  const el = id => document.getElementById(id);

  function key(b,y,w,p) {
    return `${b}|${y}|${w}|${p}`;
  }

  function loadJson(k, fallback={}) {
    try {
      return JSON.parse(localStorage.getItem(k)) || fallback;
    } catch {
      return fallback;
    }
  }

  let premium = loadJson(STORAGE_KEY, {});
  let remoteApproved = loadJson(REMOTE_KEY, {});

  function backendConfigured() {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(BACKEND_URL);
  }

  function allRecipes() {

    const out = [];

    for (const baza of D.bases)
      for (const drozdze of D.yeasts)
        for (const woda of D.waters)
          for (const program of PROGRAMS) {

            const k = key(baza,drozdze,woda,program);

            let litry =
              Object.prototype.hasOwnProperty.call(D.known,k)
                ? Number(D.known[k])
                : null;

            // Zatwierdzone wyniki z serwera nadpisują bazę wbudowaną.
            if (Object.prototype.hasOwnProperty.call(remoteApproved,k)) {
              litry = Number(remoteApproved[k]);
            }

            out.push({
              baza,
              drozdze,
              woda,
              program,
              litry
            });
          }

    return out;
  }

  function available(r) {

    if (
      D.premiumBases.includes(r.baza) &&
      !premium[r.baza]
    ) {
      return false;
    }

    if (
      D.premiumYeasts.includes(r.drozdze) &&
      !premium[r.drozdze]
    ) {
      return false;
    }

    return true;
  }

  function fmt(n) {

    return Number(n)
      .toLocaleString(
        "pl-PL",
        {maximumFractionDigits:2}
      );
  }

  function trio(r) {
    return `${r.baza}|${r.drozdze}|${r.woda}`;
  }

  function compute() {

    const recipes = allRecipes();

    const avail = recipes.filter(available);

    const known = avail
      .filter(x => x.litry !== null)
      .sort((a,b) => b.litry - a.litry);

    const unknown = avail
      .filter(x => x.litry === null);

    const trioMax = new Map();

    for (const r of recipes.filter(x => x.litry !== null)) {

      trioMax.set(
        trio(r),
        Math.max(
          trioMax.get(trio(r)) ?? -Infinity,
          r.litry
        )
      );
    }

    const vals = known
      .map(x => x.litry)
      .sort((a,b) => a-b);

    const threshold = vals.length
      ? vals[
          Math.min(
            Math.floor(vals.length * .8),
            vals.length - 1
          )
        ]
      : Infinity;

    for (const r of unknown) {

      r.trioMax =
        trioMax.get(trio(r)) ?? null;

      r.interesting =
        r.trioMax !== null &&
        r.trioMax >= threshold;
    }

    unknown.sort(
      (a,b) =>
        (b.trioMax ?? -1) -
        (a.trioMax ?? -1) ||
        a.baza.localeCompare(b.baza) ||
        a.program - b.program
    );

    return {
      recipes,
      avail,
      known,
      unknown
    };
  }

  function renderPremium() {

    const names = [
      ...D.premiumBases,
      ...D.premiumYeasts
    ];

    el("premium-grid").innerHTML =
      names
        .map(name => `

          <label class="check-card">

            <input
              type="checkbox"
              data-premium="${name.replaceAll('"','&quot;')}"
              ${premium[name] ? "checked" : ""}
            >

            <span>${displayName(name)}</span>

          </label>

        `)
        .join("");

    document
      .querySelectorAll("[data-premium]")
      .forEach(cb => {

        cb.addEventListener(
          "change",
          () => {

            premium[cb.dataset.premium] =
              cb.checked;

            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(premium)
            );

            renderAll();
          }
        );
      });
  }

  function recipeCard(r,i) {

    return `

      <article class="recipe-card">

        <div class="rank">
          ${i+1}.
        </div>

        <div class="recipe-main">

          <strong>
	  ${displayName(r.baza)}
	</strong>

	<small>
	  ${displayName(r.drozdze)} ·
	  ${displayName(r.woda)} ·
	  P${r.program}
	</small>

        </div>

        <div class="liters">
          ${fmt(r.litry)} l
        </div>

      </article>

    `;
  }

  function renderTop(data) {

    el("top-list").innerHTML =
      data.known
        .slice(0,10)
        .map(recipeCard)
        .join("")
      ||
      `<div class="empty">
        Brak znanych receptur dla wybranych składników.
      </div>`;
  }

  function renderUnknown(data) {

    const list =
  data.unknown;

    el("unknown-list").innerHTML =
      list
        .map(r => `

          <article class="unknown-card ${r.interesting ? "interesting" : ""}">

            <div>

	<strong>
	  ${displayName(r.baza)}
	</strong>

	<small>
	  ${displayName(r.drozdze)} ·
	  ${displayName(r.woda)} ·
	  P${r.program}
	</small>

            </div>

            ${
              r.interesting
                ? `
                  <div class="hint">
                    ⭐ Interesująca do zbadania
                    <br>
                    <span>
                      Inny program tej trójki:
                      do ${fmt(r.trioMax)} l
                    </span>
                  </div>
                `
                : ""
            }

          </article>

        `)
        .join("")
      ||
      `<div class="empty">
        Brak nieodkrytych receptur dla wybranych składników.
      </div>`;
  }

  function renderProgress(data) {

    const globalKnown =
      data.recipes
        .filter(x => x.litry !== null)
        .length;

    const globalPct =
      globalKnown /
      data.recipes.length *
      100;

    const availPct =
      data.avail.length
        ? data.known.length /
          data.avail.length *
          100
        : 0;

    el("progress-body").innerHTML = `

      <div class="stat-grid">

        <div class="stat">
          <span>Znane</span>
          <strong>
            ${globalKnown} /
            ${data.recipes.length}
          </strong>
        </div>

        <div class="stat">
          <span>Nieodkryte</span>
          <strong>
            ${data.recipes.length-globalKnown}
          </strong>
        </div>

        <div class="stat">
          <span>Postęp</span>
          <strong>
            ${globalPct.toFixed(1).replace(".",",")}%
          </strong>
        </div>

        <div class="stat">
          <span>Dostępne</span>
          <strong>
            ${data.known.length} /
            ${data.avail.length}
          </strong>
        </div>

      </div>

      <h3>Cała baza</h3>

      <div class="progress">
        <div style="width:${globalPct}%"></div>
      </div>

      <h3>Twoje dostępne składniki</h3>

      <div class="progress">
        <div style="width:${availPct}%"></div>
      </div>

      <p class="muted">
        Nieodkryte dla Twoich składników:
        <b>${data.unknown.length}</b>
      </p>

      <p class="muted">
        Zatwierdzone wyniki pobrane z serwera:
        <b>${Object.keys(remoteApproved).length}</b>
      </p>

    `;
  }

  function renderMap() {

    el("map-list").innerHTML =
      MAP
        .map(([district,action,icon]) => `

          <div class="map-row">

            <strong>
              ${district}
            </strong>

            <span class="${action ? "" : "unknown"}">

              ${icon}
              ${action ?? "Nieodkryte"}

            </span>

          </div>

        `)
        .join("");
  }

  function renderAll() {

    renderPremium();

    const data = compute();

    renderTop(data);
    renderUnknown(data);
    renderProgress(data);
    updateSubmissionInfo();
  }


  // ============================================================
  // FORMULARZ ZGŁOSZENIA
  // ============================================================

  function fillSelect(id, values) {

  el(id).innerHTML =
    values
      .map(
        v =>
          `<option value="${v}">${displayName(v)}</option>`
      )
      .join("");
}

  function setupSubmissionForm() {

    fillSelect(
      "submit-base",
      D.bases
    );

    fillSelect(
      "submit-yeast",
      D.yeasts
    );

    fillSelect(
      "submit-water",
      D.waters
    );

    fillSelect(
      "submit-program",
      PROGRAMS.map(String)
    );

    el("submit-nick").value =
      localStorage.getItem(NICK_KEY) || "";

    [
      "submit-base",
      "submit-yeast",
      "submit-water",
      "submit-program"
    ].forEach(id => {

      el(id).addEventListener(
        "change",
        updateSubmissionInfo
      );
    });

    el("submit-nick")
      .addEventListener(
        "change",
        () => {

          localStorage.setItem(
            NICK_KEY,
            el("submit-nick").value.trim()
          );
        }
      );

    el("submit-form")
      .addEventListener(
        "submit",
        submitRecipe
      );

    if (!backendConfigured()) {

      el("submit-status").innerHTML = `
        <div class="server-warning">
          ⚠️ Administrator nie skonfigurował jeszcze adresu serwera zgłoszeń.
        </div>
      `;
    }

    updateSubmissionInfo();
  }

  function selectedSubmissionKey() {

    return key(
      el("submit-base").value,
      el("submit-yeast").value,
      el("submit-water").value,
      Number(el("submit-program").value)
    );
  }

  function currentKnownValue(k) {

    if (
      Object.prototype
        .hasOwnProperty
        .call(remoteApproved,k)
    ) {
      return Number(remoteApproved[k]);
    }

    if (
      Object.prototype
        .hasOwnProperty
        .call(D.known,k)
    ) {
      return Number(D.known[k]);
    }

    return null;
  }

  function updateSubmissionInfo() {

    const info = el("submit-info");

    if (!info) return;

    const k =
      selectedSubmissionKey();

    const knownValue =
      currentKnownValue(k);

    if (knownValue === null) {

      info.className =
        "submit-info unknown-recipe";

      info.innerHTML =
        "🔬 Ta receptura jest obecnie <b>nieodkryta</b>.";

    } else {

      info.className =
        "submit-info known-recipe";

      info.innerHTML =
        "ℹ️ Aktualny znany wynik tej receptury: " +
        "<b>" +
        fmt(knownValue) +
        " l</b>. " +
        "Możesz wysłać korektę do weryfikacji.";
    }
  }

  async function submitRecipe(event) {

    event.preventDefault();

    const status =
      el("submit-status");

    const nick =
      el("submit-nick").value.trim();

    const litryRaw =
  	el("submit-liters").value.trim();

	const litry =
  		Number(
    			litryRaw
      				.replace(/\s+/g, "")
      				.replace(",", ".")
  	);

    if (!nick) {

      status.textContent =
        "Podaj nick.";

      return;
    }

    if (
      !Number.isFinite(litry) ||
      litry <= 0
    ) {

      status.textContent =
        "Podaj poprawną liczbę litrów.";

      return;
    }

    if (!backendConfigured()) {

      status.textContent =
        "Serwer zgłoszeń nie jest jeszcze skonfigurowany.";

      return;
    }

    localStorage.setItem(
      NICK_KEY,
      nick
    );

    const payload = {

      nick,

      baza:
        el("submit-base").value,

      drozdze:
        el("submit-yeast").value,

      woda:
        el("submit-water").value,

      program:
        Number(
          el("submit-program").value
        ),

      litry,

      uwagi:
        el("submit-notes").value.trim()
    };

    status.textContent =
      "Wysyłanie...";

    try {

      // no-cors pozwala wysłać dane do Apps Script
      // bez proszenia użytkownika o konto Google.
      await fetch(
        BACKEND_URL,
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type":
              "text/plain;charset=UTF-8"
          },
          body:
            JSON.stringify(payload)
        }
      );

      status.innerHTML =
        "✅ Zgłoszenie wysłane do weryfikacji.";

      el("submit-liters").value = "";
      el("submit-notes").value = "";

    } catch (err) {

      status.textContent =
        "Nie udało się wysłać zgłoszenia. Sprawdź internet.";
    }
  }


  // ============================================================
  // AUTOMATYCZNE POBIERANIE ZATWIERDZONYCH RECEPTUR
  // JSONP omija ograniczenia CORS Apps Script.
  // ============================================================

  function fetchApprovedRecipes() {

    if (!backendConfigured()) {
      return;
    }

    const callbackName =
      "roqApproved_" +
      Date.now() +
      "_" +
      Math.floor(Math.random()*100000);

    const script =
      document.createElement("script");

    const cleanup = () => {

      try {
        delete window[callbackName];
      } catch {}

      script.remove();
    };

    window[callbackName] =
      payload => {

        try {

          if (
            payload &&
            payload.ok &&
            payload.recipes &&
            typeof payload.recipes === "object"
          ) {

            remoteApproved =
              payload.recipes;

            localStorage.setItem(
              REMOTE_KEY,
              JSON.stringify(remoteApproved)
            );

            renderAll();
          }

        } finally {
          cleanup();
        }
      };

    script.onerror =
      cleanup;

    script.src =
      BACKEND_URL +
      "?action=approved" +
      "&callback=" +
      encodeURIComponent(callbackName) +
      "&_=" +
      Date.now();

    document.head.appendChild(
      script
    );
  }


  // ============================================================
  // TABS
  // ============================================================

  document
    .querySelectorAll("[data-tab]")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll("[data-tab]")
            .forEach(
              x =>
                x.classList.toggle(
                  "active",
                  x === btn
                )
            );

          document
            .querySelectorAll(".view")
            .forEach(
              v =>
                v.hidden =
                  v.id !==
                  btn.dataset.tab
            );
        }
      );
    });


  // ============================================================
  // START
  // ============================================================

  renderMap();
  setupSubmissionForm();
  renderAll();
  fetchApprovedRecipes();

  // Pobieramy nowe zatwierdzone dane także co 5 minut.
  setInterval(
    fetchApprovedRecipes,
    5 * 60 * 1000
  );


  // ============================================================
  // INSTALACJA PWA
  // ============================================================

  let deferredPrompt = null;

  window.addEventListener(
    "beforeinstallprompt",
    e => {

      e.preventDefault();

      deferredPrompt = e;

      el("install-btn").hidden =
        false;
    }
  );

  el("install-btn")
    .addEventListener(
      "click",
      async () => {

        if (!deferredPrompt) {
          return;
        }

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        deferredPrompt = null;

        el("install-btn").hidden =
          true;
      }
    );

  window.addEventListener(
    "appinstalled",
    () => {
      el("install-btn").hidden = true;
    }
  );


  // ============================================================
  // ONLINE / OFFLINE
  // ============================================================

  function onlineState() {

    el("net-state").textContent =
      navigator.onLine
        ? "online"
        : "offline";

    el("net-state").classList.toggle(
      "offline",
      !navigator.onLine
    );
  }

  addEventListener(
    "online",
    onlineState
  );

  addEventListener(
    "offline",
    onlineState
  );

  onlineState();


  if ("serviceWorker" in navigator) {

    navigator.serviceWorker
      .register("./sw.js")
      .catch(console.error);
  }

})();
