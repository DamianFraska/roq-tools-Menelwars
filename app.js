
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
  const GANG_TOKEN_KEY = "menelwars_tools_gang_token_v1";
  const ADMIN_TOKEN_KEY = "menelwars_tools_admin_token_v1";

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
  // WPŁATY GANGU — LOGOWANIE + CHRONIONE DANE
  // ============================================================

  function gangToken() {
    return localStorage.getItem(GANG_TOKEN_KEY) || "";
  }

  function setGangToken(token) {
    if (token) {
      localStorage.setItem(GANG_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(GANG_TOKEN_KEY);
    }
  }

  function makeNonce() {
    if (crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2,"0")).join("");
  }

  function jsonp(action, params={}) {

    return new Promise((resolve, reject) => {

      const callbackName =
        "mwJsonp_" +
        Date.now() +
        "_" +
        Math.floor(Math.random()*1000000);

      const script =
        document.createElement("script");

      let done = false;

      const cleanup = () => {
        if (done) return;
        done = true;

        try {
          delete window[callbackName];
        } catch {}

        script.remove();
      };

      const timeout =
        setTimeout(() => {
          cleanup();
          reject(new Error("Przekroczono czas odpowiedzi serwera."));
        }, 12000);

      window[callbackName] = payload => {
        clearTimeout(timeout);
        cleanup();
        resolve(payload);
      };

      script.onerror = () => {
        clearTimeout(timeout);
        cleanup();
        reject(new Error("Błąd połączenia z serwerem."));
      };

      const query =
        new URLSearchParams({
          action,
          ...params,
          callback: callbackName,
          _: String(Date.now())
        });

      script.src =
        BACKEND_URL + "?" + query.toString();

      document.head.appendChild(script);
    });
  }

  function formatPaymentsDate(value) {

  const m =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));

  if (!m) return "—";

  return `${m[3]}.${m[2]}.${m[1]}`;
}

  function formatSaldo(value) {

    return Number(value).toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    );
  }

  function paymentsRow(player) {

  const saldo = Number(player.saldo);

  let label = "✅ Rozliczony";
  let bg = "#eef7ee";
  let border = "#bad7ba";
  let value = "0";

  if (saldo < 0) {
    label = "🔴 Dług";
    bg = "#fff1f1";
    border = "#e3b2b2";
    value = formatSaldo(Math.abs(saldo));
  }

  if (saldo > 0) {
    label = "🟢 Nadpłata";
    bg = "#eef8f0";
    border = "#b6d9bd";
    value = formatSaldo(saldo);
  }

  return `
    <div
      style="
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:8px;
        align-items:center;
        padding:6px 9px;
        margin-bottom:4px;
        border:1px solid ${border};
        border-radius:7px;
        background:${bg};
      "
    >
      <strong
        style="
          overflow-wrap:anywhere;
          font-size:13px;
        "
      >
        ${escapeHtml(player.nick)}
      </strong>

      <div
        style="
          display:flex;
          align-items:center;
          gap:8px;
          text-align:right;
        "
      >
        <span
          style="
            font-size:12px;
            font-weight:700;
          "
        >
          ${label}
        </span>

        <strong
          style="
            font-size:13px;
            min-width:58px;
          "
        >
          ${value}
        </strong>
      </div>
    </div>
  `;
}

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function showPaymentsLogin(message="") {

    el("payments-login").hidden = false;
    el("payments-content").hidden = true;
    el("payments-login-status").textContent = message;
  }

  function showPaymentsContent() {
    el("payments-login").hidden = true;
    el("payments-content").hidden = false;
  }

  async function loadPayments() {

    const token = gangToken();

    if (!token) {
      showPaymentsLogin();
      return;
    }

    showPaymentsContent();

    el("payments-status").textContent =
      "Pobieranie danych...";

    try {

      const payload =
        await jsonp(
          "payments",
          {token}
        );

      if (!payload || !payload.ok) {

        if (
          payload &&
          String(payload.error || "").toLowerCase().includes("brak dostępu")
        ) {
          setGangToken("");
          showPaymentsLogin(
            "Dostęp wygasł. Wpisz hasło ponownie."
          );
          return;
        }

        throw new Error(
          payload && payload.error
            ? payload.error
            : "Nie udało się pobrać wpłat."
        );
      }

      const players =
        Array.isArray(payload.players)
          ? payload.players
          : [];

      el("payments-date").textContent =
        "Stan na: " +
        formatPaymentsDate(payload.updatedAt);

      el("payments-count").textContent =
        `Graczy: ${players.length}`;

      el("payments-list").innerHTML =
        players.length
          ? players.map(paymentsRow).join("")
          : `<div class="empty">Brak danych do wyświetlenia.</div>`;

      el("payments-status").textContent = "";

    } catch (err) {

      el("payments-status").textContent =
        err && err.message
          ? err.message
          : "Nie udało się pobrać danych.";
    }
  }

  async function loginToPayments(event) {

    event.preventDefault();

    const password =
      el("payments-password").value;

    const status =
      el("payments-login-status");

    if (!password) {
      status.textContent = "Wpisz hasło gangu.";
      return;
    }

    if (!backendConfigured()) {
      status.textContent = "Backend nie jest skonfigurowany.";
      return;
    }

    const nonce = makeNonce();

    status.textContent = "Sprawdzanie hasła...";

    try {

      await fetch(
        BACKEND_URL,
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=UTF-8"
          },
          body: JSON.stringify({
            action: "gangLogin",
            nonce,
            password
          })
        }
      );

      let result = null;

      for (let i=0; i<12; i++) {

        await new Promise(
          resolve => setTimeout(resolve, 500)
        );

        result =
          await jsonp(
            "gangLoginResult",
            {nonce}
          );

        if (!result || !result.pending) {
          break;
        }
      }

      if (!result || result.pending) {
        throw new Error(
          "Serwer nie zwrócił wyniku logowania. Spróbuj ponownie."
        );
      }

      if (!result.ok || !result.token) {
        status.textContent =
          result.error || "Nieprawidłowe hasło.";
        return;
      }

      setGangToken(result.token);
      el("payments-password").value = "";
      status.textContent = "";

      await loadPayments();

    } catch (err) {

      status.textContent =
        err && err.message
          ? err.message
          : "Nie udało się zalogować.";
    }
  }

  function setupPayments() {

    el("payments-login-form")
      .addEventListener("submit", loginToPayments);

    el("payments-refresh")
      .addEventListener("click", loadPayments);

    el("payments-logout")
      .addEventListener("click", () => {
        setGangToken("");
        el("payments-list").innerHTML = "";
        showPaymentsLogin("Dostęp na tym urządzeniu został usunięty.");
      });

    if (gangToken()) {
      showPaymentsContent();
    } else {
      showPaymentsLogin();
    }
  }

  // ============================================================
// PANEL ADMINISTRATORA
// ============================================================

function adminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}


function setAdminToken(token) {

  if (token) {
    localStorage.setItem(
      ADMIN_TOKEN_KEY,
      token
    );
  } else {
    localStorage.removeItem(
      ADMIN_TOKEN_KEY
    );
  }
}


function showAdminLogin(message="") {

  el("admin-login").hidden = false;
  el("admin-content").hidden = true;

  el("admin-login-status").textContent =
    message;
}


function showAdminContent() {

  el("admin-login").hidden = true;
  el("admin-content").hidden = false;

  el("admin-status").textContent = "";

  loadAdminSubmissions();	
  loadAdminPaymentsStatus();
  loadAdminPlayers();
}


async function checkAdminAccess() {

  const token = adminToken();

  if (!token) {
    showAdminLogin();
    return;
  }

  el("admin-login").hidden = true;
  el("admin-content").hidden = false;

  el("admin-status").textContent =
    "Sprawdzanie dostępu...";

  try {

    const result =
      await jsonp(
        "adminTest",
        {token}
      );

    if (
      !result ||
      !result.ok
    ) {

      setAdminToken("");

      showAdminLogin(
        "Sesja administratora wygasła. Zaloguj się ponownie."
      );

      return;
    }

    showAdminContent();

  } catch (err) {

    el("admin-status").textContent =
      err && err.message
        ? err.message
        : "Nie udało się sprawdzić dostępu.";
  }
}


async function loginToAdmin(event) {

  event.preventDefault();

  const password =
    el("admin-password").value;

  const status =
    el("admin-login-status");

  if (!password) {

    status.textContent =
      "Wpisz hasło administratora.";

    return;
  }

  if (!backendConfigured()) {

    status.textContent =
      "Backend nie jest skonfigurowany.";

    return;
  }

  const nonce =
    makeNonce();

  status.textContent =
    "Sprawdzanie hasła...";

  try {

    await fetch(
      BACKEND_URL,
      {
        method: "POST",
        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=UTF-8"
        },

        body: JSON.stringify({
          action: "adminLogin",
          nonce,
          password
        })
      }
    );


    let result = null;

    for (let i=0; i<12; i++) {

      await new Promise(
        resolve =>
          setTimeout(resolve,500)
      );

      result =
        await jsonp(
          "adminLoginResult",
          {nonce}
        );

      if (
        !result ||
        !result.pending
      ) {
        break;
      }
    }


    if (
      !result ||
      result.pending
    ) {

      throw new Error(
        "Serwer nie zwrócił wyniku logowania. Spróbuj ponownie."
      );
    }


    if (
      !result.ok ||
      !result.token
    ) {

      status.textContent =
        result.error ||
        "Nieprawidłowe hasło administratora.";

      return;
    }


    setAdminToken(
      result.token
    );

    el("admin-password").value = "";

    status.textContent = "";

    await checkAdminAccess();


  } catch (err) {

    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się zalogować.";
  }
}

function adminSubmissionCard(item) {

  const notes =
    item.uwagi
      ? `
          <div
            class="muted"
            style="margin-top:5px">
            💬 ${escapeHtml(item.uwagi)}
          </div>
        `
      : "";

  return `
    <div
      data-submission-row="${item.row}"
      style="
        border:1px solid #d8c7aa;
        border-radius:8px;
        background:#fffdf8;
        padding:9px 10px;
        margin-bottom:6px;
      "
    >

      <div style="
        display:flex;
        justify-content:space-between;
        gap:8px;
        align-items:center;
      ">

        <strong>
          ${escapeHtml(item.nick)}
        </strong>

        <strong>
          ${formatSaldo(item.litry)} l
        </strong>

      </div>

      <div
        style="
          font-size:13px;
          margin-top:4px;
        "
      >
        ${escapeHtml(displayName(item.baza))}
        ·
        ${escapeHtml(displayName(item.drozdze))}
        ·
        ${escapeHtml(displayName(item.woda))}
        ·
        P${item.program}
      </div>

      <div
        class="muted"
        style="margin-top:3px">
        ${escapeHtml(item.date)}
      </div>

      ${notes}

      <div style="
        display:flex;
        gap:8px;
        margin-top:9px;
      ">

        <button
          type="button"
          data-admin-action="ZATWIERDZONE"
          data-row="${item.row}"
          style="
            flex:1;
            background:#eaf6ea;
            border-color:#9fc79f;
          ">
          ✅ Zatwierdź
        </button>

        <button
          type="button"
          data-admin-action="ODRZUCONE"
          data-row="${item.row}"
          style="
            flex:1;
            background:#fff0f0;
            border-color:#d9aaaa;
          ">
          ❌ Odrzuć
        </button>

      </div>

    </div>
  `;
}

async function setAdminSubmissionStatus(
  row,
  newStatus,
  button
) {

  const token =
    adminToken();

  if (!token) {
    showAdminLogin();
    return;
  }


  const isApprove =
    newStatus === "ZATWIERDZONE";


  const confirmed =
    window.confirm(
      isApprove
        ? "Zatwierdzić tę recepturę?"
        : "Odrzucić tę recepturę?"
    );

  if (!confirmed) {
    return;
  }


  const card =
    button.closest(
      "[data-submission-row]"
    );


  const buttons =
    card
      ? card.querySelectorAll("button")
      : [];


  buttons.forEach(
    btn => btn.disabled = true
  );


  el("admin-status").textContent =
    isApprove
      ? "Zatwierdzanie receptury..."
      : "Odrzucanie receptury...";


  try {

    await fetch(
      BACKEND_URL,
      {
        method: "POST",
        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=UTF-8"
        },

        body: JSON.stringify({
          action:
            "adminSetSubmissionStatus",

          token,

          row,

          status:
            newStatus
        })
      }
    );


    // Dajemy Apps Script chwilę
    // na zapisanie zmiany w arkuszu.
    await new Promise(
      resolve =>
        setTimeout(resolve, 500)
    );


    await loadAdminSubmissions();


    // Odświeżamy też wspólną bazę receptur,
    // dzięki czemu zatwierdzona receptura
    // pojawi się od razu w PWA.
    if (isApprove) {
      fetchApprovedRecipes();
    }


  } catch (err) {

    el("admin-status").textContent =
      err && err.message
        ? err.message
        : "Nie udało się zmienić statusu.";

    buttons.forEach(
      btn => btn.disabled = false
    );
  }
}

async function loadAdminSubmissions() {

  const token =
    adminToken();

  if (!token) {
    showAdminLogin();
    return;
  }

  el("admin-status").textContent =
    "Pobieranie zgłoszeń...";

  try {

    const payload =
      await jsonp(
        "adminSubmissions",
        {token}
      );

    if (
      !payload ||
      !payload.ok
    ) {

      if (
        payload &&
        String(
          payload.error || ""
        )
          .toLowerCase()
          .includes(
            "brak dostępu"
          )
      ) {

        setAdminToken("");

        showAdminLogin(
          "Sesja administratora wygasła."
        );

        return;
      }

      throw new Error(
        payload &&
        payload.error
          ? payload.error
          : "Nie udało się pobrać zgłoszeń."
      );
    }

    const submissions =
      Array.isArray(
        payload.submissions
      )
        ? payload.submissions
        : [];

    el(
      "admin-submissions-count"
    ).textContent =
      `Oczekujące zgłoszenia: ${submissions.length}`;

    el(
      "admin-submissions"
    ).innerHTML =
      submissions.length

        ? submissions
            .map(
              adminSubmissionCard
            )
            .join("")

        : `
            <div
              style="
                padding:14px;
                border:1px solid #bad7ba;
                border-radius:8px;
                background:#eef7ee;
              ">
              ✅ Brak zgłoszeń oczekujących na weryfikację.
            </div>
          `;

	document
  .querySelectorAll(
    "#admin-submissions [data-admin-action]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const row =
          Number(
            button.dataset.row
          );

        const newStatus =
          button.dataset.adminAction;

        setAdminSubmissionStatus(
          row,
          newStatus,
          button
        );
      }
    );
  });

    el("admin-status").textContent =
      "";

  } catch (err) {

    el("admin-status").textContent =
      err && err.message
        ? err.message
        : "Nie udało się pobrać zgłoszeń.";
  }
}

function formatAdminDate(value) {

  const m =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(String(value || ""));

  if (!m) {
    return value || "—";
  }

  return `${m[3]}.${m[2]}.${m[1]}`;
}

function adminPlayerRow(player) {

  return `
    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:7px 9px;
        margin-bottom:5px;
        border:1px solid #d8c7aa;
        border-radius:7px;
        background:#fffdf8;
      "
    >

      <strong>
        ${escapeHtml(player.nick)}
      </strong>

      <button
        type="button"
        data-delete-player="${escapeHtml(player.nick)}"
        style="
          background:#fff0f0;
          border-color:#d9aaaa;
          white-space:nowrap;
        "
      >
        🗑 Usuń
      </button>

    </div>
  `;
}

async function loadAdminPlayers() {

  const token =
    adminToken();

  const box =
    el("admin-players-list");

  const status =
    el("admin-players-status");

  if (
    !token ||
    !box ||
    !status
  ) {
    return;
  }


  status.textContent =
    "Pobieranie graczy...";


  try {

    const payload =
      await jsonp(
        "adminPaymentsStatus",
        {token}
      );


    if (
      !payload ||
      !payload.ok
    ) {

      throw new Error(
        payload &&
        payload.error
          ? payload.error
          : "Nie udało się pobrać graczy."
      );
    }


    const players =
      Array.isArray(
        payload.players
      )
        ? payload.players
        : [];


    box.innerHTML =
      players.length
        ? players
            .map(adminPlayerRow)
            .join("")
        : `
            <div class="empty">
              Brak graczy.
            </div>
          `;


    box
      .querySelectorAll(
        "[data-delete-player]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            deleteAdminPlayer(
              button.dataset
                .deletePlayer
            );
          }
        );
      });


    status.textContent = "";


  } catch (err) {

    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się pobrać graczy.";
  }
}

async function addAdminPlayer(event) {

  event.preventDefault();


  const token =
    adminToken();

  const input =
    el("admin-player-nick");

  const status =
    el("admin-players-status");


  const nick =
    String(
      input.value || ""
    ).trim();


  if (!nick) {

    status.textContent =
      "Podaj nick gracza.";

    return;
  }


  status.textContent =
    "Dodawanie gracza...";


  try {

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
          JSON.stringify({
            action:
              "adminAddPlayer",

            token,

            nick
          })
      }
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          700
        )
    );


    input.value = "";

    status.textContent =
      `✅ Dodano gracza ${nick}.`;


    await loadAdminPlayers();

    await loadAdminPaymentsStatus();


  } catch (err) {

    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się dodać gracza.";
  }
}

async function deleteAdminPlayer(
  nick
) {

  const token =
    adminToken();

  const status =
    el("admin-players-status");


  const first =
    window.confirm(
      `Czy na pewno chcesz usunąć gracza "${nick}"?`
    );


  if (!first) {
    return;
  }


  const second =
    window.prompt(
      `UWAGA!\n\n` +
      `Usunięcie gracza "${nick}" usunie jego bieżącą historię z tabeli.\n\n` +
      `Aby potwierdzić, wpisz dokładnie nick gracza:`
    );


  if (
    second === null
  ) {
    return;
  }


  if (
    second.trim()
      .toLocaleLowerCase(
        "pl-PL"
      ) !==
    nick.trim()
      .toLocaleLowerCase(
        "pl-PL"
      )
  ) {

    status.textContent =
      "Usuwanie anulowane — nick potwierdzający jest nieprawidłowy.";

    return;
  }


  status.textContent =
    `Usuwanie gracza ${nick}...`;


  try {

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
          JSON.stringify({
            action:
              "adminDeletePlayer",

            token,

            nick,

            confirmationNick:
              second.trim()
          })
      }
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          700
        )
    );


    status.textContent =
      `✅ Usunięto gracza ${nick}.`;


    await loadAdminPlayers();

    await loadAdminPaymentsStatus();


  } catch (err) {

    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się usunąć gracza.";
  }
}

async function loadAdminPaymentsStatus() {

  const token =
    adminToken();

  if (!token) {
    showAdminLogin();
    return;
  }

  const box =
    el("admin-payments-status-box");

  if (!box) {
    return;
  }

  box.innerHTML = `
    <div class="muted">
      Pobieranie statusu wpłat...
    </div>
  `;

  try {

    const payload =
      await jsonp(
        "adminPaymentsStatus",
        {token}
      );

    if (
      !payload ||
      !payload.ok
    ) {

      if (
        payload &&
        String(payload.error || "")
          .toLowerCase()
          .includes("brak dostępu")
      ) {

        setAdminToken("");

        showAdminLogin(
          "Sesja administratora wygasła."
        );

        return;
      }

      throw new Error(
        payload && payload.error
          ? payload.error
          : "Nie udało się pobrać statusu wpłat."
      );
    }

    const writeProtection =
      payload.writeProtection || {};

    const writeBlocked =
      Boolean(
        writeProtection.blocked
      );

    box.innerHTML = `

      <div style="
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
        gap:8px;
      ">

        <div style="
          padding:10px;
          border:1px solid #d8c7aa;
          border-radius:8px;
          background:#fffdf8;
        ">
          <div class="muted">
            Dane uwzględnione do
          </div>

          <strong>
            ${escapeHtml(
              formatAdminDate(
                payload.saldoDate
              )
            )}
          </strong>
        </div>


        <div style="
          padding:10px;
          border:1px solid #d8c7aa;
          border-radius:8px;
          background:#fffdf8;
        ">
          <div class="muted">
            Ostatnia aktualizacja
          </div>

          <strong>
            ${escapeHtml(
              formatAdminDate(
                payload.lastClose
              )
            )}
          </strong>
        </div>


        <div style="
          padding:10px;
          border:1px solid #d8c7aa;
          border-radius:8px;
          background:#fffdf8;
        ">
          <div class="muted">
            Graczy w tabeli
          </div>

          <strong>
            ${Number(payload.count) || 0}
          </strong>
        </div>

      </div>

      ${
        writeBlocked
          ? `
              <div style="
                margin-top:10px;
                padding:10px;
                border:1px solid #e0b766;
                border-radius:8px;
                background:#fff8e7;
              ">

                <strong>
                  🌙 Okres ochronny 00:00–04:00
                </strong>

                <div
                  class="muted"
                  style="margin-top:4px"
                >
                  Możesz sprawdzać raporty,
                  ale wprowadzanie danych
                  będzie zablokowane do 04:00.
                </div>

              </div>
            `
          : `
              <div style="
                margin-top:10px;
                padding:10px;
                border:1px solid #bad7ba;
                border-radius:8px;
                background:#eef7ee;
              ">

                <strong>
                  ✅ Wprowadzanie danych dostępne
                </strong>

              </div>
            `
      }
    `;

  } catch (err) {

    box.innerHTML = `
      <div style="
        padding:10px;
        border:1px solid #e3b2b2;
        border-radius:8px;
        background:#fff1f1;
      ">
        ${escapeHtml(
          err && err.message
            ? err.message
            : "Nie udało się pobrać statusu wpłat."
        )}
      </div>
    `;
  }
}

function paymentPreviewMoney(value) {
  return Number(value).toLocaleString(
    "pl-PL",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  );
}


function renderAdminPaymentsPreview(payload) {

  const result =
    el("admin-payments-preview-result");

  const days =
    Array.isArray(payload.days)
      ? payload.days
      : [];

  if (!days.length) {

    result.innerHTML = `
      <div class="empty">
        Nie znaleziono danych do wyświetlenia.
      </div>
    `;

    return;
  }


  const validDays =
    days.filter(
      day => day.canClose
    );


  const invalidDays =
    days.filter(
      day => !day.canClose
    );

  const importButton =
  el("admin-payments-import");


if (importButton) {

  importButton.hidden =
    validDays.length === 0;

  importButton.disabled =
    false;
}

  function compactPlayerRow(
    player,
    type
  ) {

    let icon = "🟢";
    let bg = "#eef7ee";
    let border = "#bad7ba";
    let value =
      paymentPreviewMoney(
        player.amount
      );


    if (type === "zero") {

      icon = "🟡";
      bg = "#fff8e7";
      border = "#e0b766";
      value = "0";
    }


    if (type === "missing") {

      icon = "🔴";
      bg = "#fff1f1";
      border = "#e3b2b2";
      value = "BRAK";
    }


    return `
      <div style="
        display:grid;
        grid-template-columns:1fr auto;
        align-items:center;
        gap:8px;
        padding:6px 8px;
        margin-bottom:4px;
        border:1px solid ${border};
        border-radius:7px;
        background:${bg};
      ">

        <strong style="
          font-size:13px;
          overflow-wrap:anywhere;
        ">
          ${icon}
          ${escapeHtml(player.nick)}
        </strong>

        <strong style="
          font-size:13px;
          text-align:right;
        ">
          ${escapeHtml(value)}
        </strong>

      </div>
    `;
  }


  function dayDetailsHtml(
    day,
    index
  ) {

    const errors =
      Array.isArray(day.errors)
        ? day.errors
        : [];


    const warnings =
      Array.isArray(day.warnings)
        ? day.warnings
        : [];


    const players =
      Array.isArray(day.players)
        ? day.players
        : [];


    const paidPlayers =
  players.filter(
    player =>
      player.status === "paid"
  );


const zeroPlayers =
  players.filter(
    player =>
      player.status === "zero"
  );


const missingPlayers =
  players.filter(
    player =>
      player.status === "missing"
  );


const freshmanPlayers =
  players.filter(
    player =>
      player.status === "freshman"
  );


// "before_join" celowo nie trafia
// do żadnej listy.
// Taki gracz nie należał jeszcze
// do gangu w tym dniu.


    const errorsHtml =
      errors.length
        ? `
            <div style="
              margin-top:10px;
              padding:10px;
              border:1px solid #e3b2b2;
              border-radius:8px;
              background:#fff1f1;
            ">

              <strong>
                ❌ Błędy: ${errors.length}
              </strong>

              <div style="
                margin-top:6px;
                font-size:13px;
              ">
                ${
                  errors
                    .map(
                      error =>
                        `<div>• ${escapeHtml(error)}</div>`
                    )
                    .join("")
                }
              </div>

            </div>
          `
        : "";


    const warningsHtml =
      warnings.length
        ? `
            <div style="
              margin-top:10px;
              padding:10px;
              border:1px solid #e0b766;
              border-radius:8px;
              background:#fff8e7;
            ">

              <strong>
                ⚠️ Ostrzeżenia: ${warnings.length}
              </strong>

              <div style="
                margin-top:6px;
                font-size:13px;
              ">
                ${
                  warnings
                    .map(
                      warning =>
                        `<div>• ${escapeHtml(warning)}</div>`
                    )
                    .join("")
                }
              </div>

            </div>
          `
        : "";


    const missingHtml =
      missingPlayers.length
        ? `
            <div style="margin-top:10px">

              <strong>
                🔴 Braki w raporcie (${missingPlayers.length})
              </strong>

              <div style="margin-top:6px">
                ${
                  missingPlayers
                    .map(
                      player =>
                        compactPlayerRow(
                          player,
                          "missing"
                        )
                    )
                    .join("")
                }
              </div>

            </div>
          `
        : "";
    
    const freshmanHtml =
  freshmanPlayers.length
    ? `
        <div style="margin-top:10px">

          <strong>
            🟦 Świeżak (${freshmanPlayers.length})
          </strong>

          <div style="margin-top:6px">
            ${
              freshmanPlayers
                .map(
                  player =>
                    `
                      <div style="
                        display:grid;
                        grid-template-columns:1fr auto;
                        align-items:center;
                        gap:8px;
                        padding:6px 8px;
                        margin-bottom:4px;
                        border:1px solid #b8cde2;
                        border-radius:7px;
                        background:#eef5fb;
                      ">

                        <strong style="
                          font-size:13px;
                          overflow-wrap:anywhere;
                        ">
                          🟦 ${escapeHtml(player.nick)}
                        </strong>

                        <strong style="
                          font-size:13px;
                          text-align:right;
                        ">
                          Świeżak
                        </strong>

                      </div>
                    `
                )
                .join("")
            }
          </div>

        </div>
      `
    : "";

    const zeroHtml =
      zeroPlayers.length
        ? `
            <div style="margin-top:10px">

              <strong>
                🟡 Nie wpłacili (${zeroPlayers.length})
              </strong>

              <div style="margin-top:6px">
                ${
                  zeroPlayers
                    .map(
                      player =>
                        compactPlayerRow(
                          player,
                          "zero"
                        )
                    )
                    .join("")
                }
              </div>

            </div>
          `
        : "";


    const paidHtml =
      paidPlayers.length
        ? `
            <div style="
              margin-top:12px;
              border-top:1px solid #d8c7aa;
              padding-top:10px;
            ">

              <button
                type="button"
                data-paid-toggle="${index}"
                style="
                  width:100%;
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:8px;
                "
              >
                <span>
                  ✅ Wpłacili (${paidPlayers.length})
                </span>

                <span data-paid-toggle-icon="${index}">
                  Pokaż ▼
                </span>
              </button>

              <div
                data-paid-list="${index}"
                hidden
                style="margin-top:8px"
              >
                ${
                  paidPlayers
                    .map(
                      player =>
                        compactPlayerRow(
                          player,
                          "paid"
                        )
                    )
                    .join("")
                }
              </div>

            </div>
          `
        : "";


    return `
  <div style="
    margin-top:10px;
  ">
    ${errorsHtml}
    ${warningsHtml}
    ${missingHtml}
    ${freshmanHtml}
    ${zeroHtml}
    ${paidHtml}
  </div>
`;
}

  function dayCardHtml(
    day,
    index
  ) {

    const ok =
      Boolean(day.canClose);

    const errorCount =
      Array.isArray(day.errors)
        ? day.errors.length
        : 0;


    const summaryText =
      ok

        ? `
            ${Number(day.paidCount) || 0} wpłaciło
            ·
            ${Number(day.zeroCount) || 0} nie wpłaciło
            ·
            ${paymentPreviewMoney(day.calculatedTotal)} zł
          `

        : `
            Raport niekompletny
            ·
            błędów: ${errorCount}
          `;


    return `
      <div style="
        margin-top:10px;
        border:1px solid ${
          ok
            ? "#bad7ba"
            : "#e3b2b2"
        };
        border-radius:8px;
        background:${
          ok
            ? "#eef7ee"
            : "#fff1f1"
        };
        overflow:hidden;
      ">

        <button
          type="button"
          data-day-toggle="${index}"
          style="
            width:100%;
            border:0;
            border-radius:0;
            background:transparent;
            padding:10px;
            text-align:left;
            cursor:pointer;
          "
        >

          <div style="
            display:flex;
            justify-content:space-between;
            gap:10px;
            align-items:center;
          ">

            <div>

              <strong>
                ${
                  ok
                    ? "✅"
                    : "❌"
                }
                ${escapeHtml(day.date)}
              </strong>

              <div
                class="muted"
                style="
                  margin-top:3px;
                  font-size:13px;
                "
              >
                ${summaryText}
              </div>

            </div>

            <strong
              data-day-toggle-icon="${index}"
              style="
                white-space:nowrap;
              "
            >
              Pokaż ▼
            </strong>

          </div>

        </button>


        <div
          data-day-details="${index}"
          hidden
          style="
            padding:0 10px 10px 10px;
          "
        >

          <div style="
            font-size:13px;
            padding-top:4px;
          ">

            Suma raportu:
            <b>
              ${
                day.reportedTotal === null
                  ? "—"
                  : `${paymentPreviewMoney(day.reportedTotal)} zł`
              }
            </b>

            <br>

            Suma obliczona:
            <b>
              ${paymentPreviewMoney(day.calculatedTotal)} zł
            </b>

          </div>

          ${dayDetailsHtml(day, index)}

        </div>

      </div>
    `;
  }


  const ignoredTodayHtml =
    Number(
      payload.ignoredTodayCount
    ) > 0
      ? `
          <div style="
            margin-top:8px;
            padding:8px 10px;
            border:1px solid #b8cde2;
            border-radius:8px;
            background:#eef5fb;
            font-size:13px;
          ">
            ℹ️ Pominięto bieżący dzień.
            Wpłaty z dzisiaj mogą się jeszcze zmienić.
          </div>
        `
      : "";


  result.innerHTML = `

    <div style="
      margin-bottom:8px;
      font-size:13px;
    ">

      Rozpoznano dni:
      <b>${days.length}</b>

      ·

      ✅ Poprawne:
      <b>${validDays.length}</b>

      ·

      ❌ Z błędem:
      <b>${invalidDays.length}</b>

    </div>

    ${ignoredTodayHtml}

    ${
      days
        .map(
          (day, index) =>
            dayCardHtml(
              day,
              index
            )
        )
        .join("")
    }
  `;


  document
    .querySelectorAll(
      "[data-day-toggle]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            button.dataset.dayToggle;

          const details =
            document.querySelector(
              `[data-day-details="${index}"]`
            );

          const icon =
            document.querySelector(
              `[data-day-toggle-icon="${index}"]`
            );


          details.hidden =
            !details.hidden;


          icon.textContent =
            details.hidden
              ? "Pokaż ▼"
              : "Ukryj ▲";
        }
      );
    });


  document
    .querySelectorAll(
      "[data-paid-toggle]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            button.dataset.paidToggle;

          const list =
            document.querySelector(
              `[data-paid-list="${index}"]`
            );

          const icon =
            document.querySelector(
              `[data-paid-toggle-icon="${index}"]`
            );


          list.hidden =
            !list.hidden;


          icon.textContent =
            list.hidden
              ? "Pokaż ▼"
              : "Ukryj ▲";
        }
      );
    });
}


async function previewAdminPayments() {

  const token =
    adminToken();

  if (!token) {
    showAdminLogin();
    return;
  }


  const report =
    el("admin-payments-report")
      .value
      .trim();


  const status =
    el("admin-payments-preview-status");


  const result =
    el("admin-payments-preview-result");


  if (!report) {

    status.textContent =
      "Wklej raport wpłat.";

    result.innerHTML = "";

    return;
  }


  status.textContent =
    "Sprawdzanie danych...";

  result.innerHTML = "";


  const nonce =
    makeNonce();


  try {

    await fetch(
      BACKEND_URL,
      {
        method: "POST",
        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=UTF-8"
        },

        body: JSON.stringify({
          action:
            "adminPreviewPayments",

          token,
          nonce,
          report
        })
      }
    );


    let payload = null;


    for (
      let i = 0;
      i < 12;
      i++
    ) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            500
          )
      );


      payload =
        await jsonp(
          "adminPreviewPaymentsResult",
          {
            token,
            nonce
          }
        );


      if (
        !payload ||
        !payload.pending
      ) {
        break;
      }
    }


    if (
      !payload ||
      payload.pending
    ) {

      throw new Error(
        "Serwer nie zwrócił wyniku sprawdzania."
      );
    }


    if (!payload.ok) {

      throw new Error(
        payload.error ||
        "Nie udało się sprawdzić raportu."
      );
    }

    renderAdminPaymentsPreview(
      payload
    );

status.textContent = "";


  } catch (err) {

    status.textContent =
      err &&
      err.message
        ? err.message
        : "Nie udało się sprawdzić danych.";
  }
}

async function importAdminPayments() {

  const token =
    adminToken();


  if (!token) {

    showAdminLogin();
    return;
  }


  const report =
    el("admin-payments-report")
      .value
      .trim();


  const status =
    el(
      "admin-payments-preview-status"
    );


  const button =
    el(
      "admin-payments-import"
    );


  if (!report) {

    status.textContent =
      "Wklej raport wpłat.";

    return;
  }


  const confirmed =
    window.confirm(
      "Wprowadzić poprawne dni do arkusza?\n\n" +
      "Dni zawierające błędy zostaną pominięte."
    );


  if (!confirmed) {
    return;
  }


  const nonce =
    makeNonce();


  button.disabled = true;

  status.textContent =
    "Wprowadzanie danych...";


  try {

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
          JSON.stringify({
            action:
              "adminImportPayments",

            token,
            nonce,
            report
          })
      }
    );


    let payload = null;


    for (
      let i = 0;
      i < 20;
      i++
    ) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            500
          )
      );


      payload =
        await jsonp(
          "adminImportPaymentsResult",
          {
            token,
            nonce
          }
        );


      if (
        !payload ||
        !payload.pending
      ) {
        break;
      }
    }


    if (
      !payload ||
      payload.pending
    ) {

      throw new Error(
        "Serwer nie zwrócił wyniku zapisu."
      );
    }


    if (!payload.ok) {

      throw new Error(
        payload.error ||
        "Nie udało się wprowadzić danych."
      );
    }


    let message =
      `✅ ${payload.message || "Dane zostały zapisane."}`;


    if (
      Array.isArray(
        payload.written
      ) &&
      payload.written.length
    ) {

      message +=
        "\n\nZapisane dni:\n" +
        payload.written
          .map(item => {

            const mode =
              item.mode === "overwrite"
                ? "nadpisano"
                : "dodano";

            return (
              `• ${item.date} — ${mode}`
            );
          })
          .join("\n");
    }


    if (
      Array.isArray(
        payload.skipped
      ) &&
      payload.skipped.length
    ) {

      message +=
        "\n\nPominięte dni:\n" +
        payload.skipped
          .map(
            item =>
              `• ${item.date} — ${item.reason}`
          )
          .join("\n");
    }


    status.textContent =
      message;


    // Po zapisie pobieramy aktualny stan arkusza.
    await loadAdminPaymentsStatus();


    // Raport został już wykorzystany.
    // Ukrywamy przycisk zapisu,
    // aby przypadkiem nie zapisać go drugi raz.
    button.hidden = true;


  } catch (err) {

    status.textContent =
      err &&
      err.message
        ? err.message
        : "Nie udało się wprowadzić danych.";

  } finally {

    button.disabled = false;
  }
}

function setupAdmin() {

  el("admin-login-form")
    .addEventListener(
      "submit",
      loginToAdmin
    );

  el("admin-refresh")
    .addEventListener(
      "click",
      loadAdminSubmissions
    );

  el("admin-payments-preview")
  .addEventListener(
    "click",
    previewAdminPayments
  );

  el("admin-payments-import")
  ?.addEventListener(
    "click",
    importAdminPayments
  );

  el("admin-payments-refresh")
  .addEventListener(
    "click",
    loadAdminPaymentsStatus
  );

  el("admin-player-add-form")
    ?.addEventListener(
      "submit",
      addAdminPlayer
    );

  el("admin-logout")
    .addEventListener(
      "click",
      () => {

        setAdminToken("");

        showAdminLogin(
          "Wylogowano administratora."
        );
      }
    );

  // Na czas testu zawsze pokaż ekran logowania.
  showAdminLogin();
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

          if (btn.dataset.tab === "payments-view") {
  loadPayments();
}

if (btn.dataset.tab === "admin-view") {
  checkAdminAccess();
}
        }
      );
    });


  // ============================================================
  // START
  // ============================================================

renderMap();
setupSubmissionForm();
setupPayments();
renderAll();
fetchApprovedRecipes();
setupAdmin();

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
