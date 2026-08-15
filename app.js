
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


function setupAdmin() {

  el("admin-login-form")
    .addEventListener(
      "submit",
      loginToAdmin
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


  if (adminToken()) {
    checkAdminAccess();
  } else {
    showAdminLogin();
  }
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
setupAdmin();
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
