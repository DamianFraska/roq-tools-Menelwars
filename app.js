
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
  const RESERVATION_OWNER_KEY = "roq_recipe_reservation_owners_v1";
  const COMPANY_SALARY_IDENTITY_KEY = "menelwars_company_salary_identity_v1";
  const PLAYER_IDENTITY_KEY = "menelwars_player_identity_v1";
  const PLAYER_ACCOUNT_SESSION_KEY = "menelwars_player_account_session_v1";
  const GANG_TOKEN_KEY = "menelwars_tools_gang_token_v1";
  const ADMIN_TOKEN_KEY = "menelwars_tools_admin_token_v1";
  const COMPANY_INCOME_KEY = "menelwars_tools_company_income_v1";

  const COMPANY_MIN_CONTRIBUTION = 30000;
  const COMPANY_BASE_SALARY = 160;
  const COMPANY_SALARY_RATIO = 0.50;

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
    ["Wilanów", "Agresywny", "⚔️"],
    ["Mokotów", "Przyjacielski", "🤝"],
    ["Ursynów", "Przyjacielski", "🤝"],
    ["Ochota", "Neutralny", "⚪"],
    ["Śródmieście", "Agresywny", "⚔️"],
    ["Bemowo", "Błagalny", "🙏"],
    ["Wola", "Błagalny", "🙏"],
    ["Żoliborz", "Przyjacielski", "🤝"],
    ["Bielany", "Przyjacielski", "🤝"],
    ["Praga", "Błagalny", "🙏"],
    ["Białołęka", "Neutralny", "⚪"],
    ["Targówek", "Błagalny", "🙏"]
  ];

const MAP_POSITIONS = {
  "Bielany":      { x: 28.7, y: 12.2 },
  "Białołęka":    { x: 62.0, y: 16.7 },
  "Żoliborz":     { x: 19.2, y: 29.8 },
  "Targówek":     { x: 81.7, y: 33.6 },
  "Bemowo":       { x: 13.5, y: 47.7 },
  "Śródmieście":  { x: 46.8, y: 48.9 },
  "Praga":        { x: 86.1, y: 55.2 },
  "Wola":         { x: 22.0, y: 61.4 },
  "Ochota":       { x: 20.2, y: 75.9 },
  "Mokotów":      { x: 50.8, y: 73.3 },
  "Wilanów":      { x: 77.9, y: 80.9 },
  "Ursynów":      { x: 39.6, y: 92.4 }
};

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
  let recipeReservations = {};
  let recipeRanking = [];

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

    const recipes =
      allRecipes();

    // Pełna baza — niezależna od zaznaczonych premium.
    const known =
      recipes
        .filter(
          recipe =>
            recipe.litry !== null
        )
        .sort(
          (a,b) =>
            b.litry - a.litry
        );

    const unknown =
      recipes
        .filter(
          recipe =>
            recipe.litry === null
        );

    // TYLKO podium / Top 3 respektuje zaznaczone składniki premium.
    const topKnown =
      recipes
        .filter(available)
        .filter(
          recipe =>
            recipe.litry !== null
        )
        .sort(
          (a,b) =>
            b.litry - a.litry
        );

    const trioMax =
      new Map();

    for (
      const r of known
    ) {
      trioMax.set(
        trio(r),
        Math.max(
          trioMax.get(
            trio(r)
          ) ?? -Infinity,
          r.litry
        )
      );
    }

    const vals =
      known
        .map(
          x => x.litry
        )
        .sort(
          (a,b) => a-b
        );

    const threshold =
      vals.length
        ? vals[
            Math.min(
              Math.floor(
                vals.length * .8
              ),
              vals.length - 1
            )
          ]
        : Infinity;

    for (
      const r of unknown
    ) {
      r.trioMax =
        trioMax.get(
          trio(r)
        ) ?? null;

      r.interesting =
        r.trioMax !== null &&
        r.trioMax >=
          threshold;
    }

    unknown.sort(
      (a,b) =>
        (b.trioMax ?? -1) -
        (a.trioMax ?? -1) ||
        a.baza.localeCompare(
          b.baza
        ) ||
        a.program -
        b.program
    );

    return {
      recipes,

      // Zachowujemy "avail" dla starszego renderProgress().
      // Od v20.6 oznacza całą bazę, nie filtr premium.
      avail:recipes,

      known,
      unknown,
      topKnown
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

            <span class="premium-name">${displayName(name)}</span>

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

  function fillAvailableFilter(id, values, allLabel) {
    const select = el(id);
    if (!select || select.dataset.ready === "1") return;

    select.innerHTML =
      `<option value="">${allLabel}</option>` +
      values
        .map(value =>
          `<option value="${escapeHtml(String(value))}">${escapeHtml(displayName(String(value)))}</option>`
        )
        .join("");

    select.dataset.ready = "1";
    select.addEventListener("change", renderAll);
  }

  function setupAvailableRecipeFilters() {
    fillAvailableFilter("available-filter-base", D.bases, "Wszystkie bazy");
    fillAvailableFilter("available-filter-yeast", D.yeasts, "Wszystkie drożdże");
    fillAvailableFilter("available-filter-water", D.waters, "Wszystkie wody");
    fillAvailableFilter("available-filter-program", PROGRAMS.map(String), "Wszystkie programy");
  }

  function setupUnknownRecipeFilters() {
    fillAvailableFilter("unknown-filter-base", D.bases, "Wszystkie bazy");
    fillAvailableFilter("unknown-filter-yeast", D.yeasts, "Wszystkie drożdże");
    fillAvailableFilter("unknown-filter-water", D.waters, "Wszystkie wody");
    fillAvailableFilter("unknown-filter-program", PROGRAMS.map(String), "Wszystkie programy");
  }

  function renderAllAvailableRecipes(data) {
    setupAvailableRecipeFilters();

    const base = el("available-filter-base")?.value || "";
    const yeast = el("available-filter-yeast")?.value || "";
    const water = el("available-filter-water")?.value || "";
    const program = el("available-filter-program")?.value || "";

    const filtered = data.known.filter(recipe =>
      (!base || recipe.baza === base) &&
      (!yeast || recipe.drozdze === yeast) &&
      (!water || recipe.woda === water) &&
      (!program || String(recipe.program) === program)
    );

    const list = el("available-list");
    const summary = el("available-filter-summary");

    if (summary) {
      summary.textContent =
        `Pokazano ${filtered.length} z ${data.known.length} dostępnych recept.`;
    }

    if (list) {
      list.innerHTML =
        filtered.length
          ? filtered.map(recipeCard).join("")
          : `<div class="empty">Brak recept spełniających wybrane filtry.</div>`;
    }
  }

  function renderTop(data) {

    const top =
      data.topKnown.slice(
        0,
        3
      );

    const medal = ["🥇","🥈","🥉"];
    const place = ["1. miejsce","2. miejsce","3. miejsce"];
    const tone = ["gold","silver","bronze"];

    el("top-list").innerHTML =
      top.length
        ? `
            <div class="recipe-podium">
              ${top.map((recipe,index) => `
                <article class="podium-card ${tone[index] || ""}">
                  <div class="podium-head">
                    <span class="podium-medal">${medal[index] || "🏅"}</span>
                    <span class="podium-place">${place[index] || `${index+1}. miejsce`}</span>
                  </div>

                  <div class="podium-base">
                    ${escapeHtml(displayName(recipe.baza))}
                  </div>

                  <div class="podium-combo">
                    ${escapeHtml(displayName(recipe.drozdze))}
                    <span>·</span>
                    ${escapeHtml(displayName(recipe.woda))}
                    <span>·</span>
                    P${recipe.program}
                  </div>

                  <div class="podium-result">
                    ${fmt(recipe.litry)} l
                  </div>
                </article>
              `).join("")}
            </div>
          `
        : `
            <div class="empty">
              Brak znanych receptur dla zaznaczonych składników premium.
            </div>
          `;
  }

  function reservationOwnerMap() {
    try {
      const parsed =
        JSON.parse(
          localStorage.getItem(
            RESERVATION_OWNER_KEY
          ) || "{}"
        );

      return (
        parsed &&
        typeof parsed === "object"
          ? parsed
          : {}
      );
    } catch (err) {
      return {};
    }
  }

  function saveReservationOwnerMap(map) {
    localStorage.setItem(
      RESERVATION_OWNER_KEY,
      JSON.stringify(map || {})
    );
  }

  function reservationOwnerFor(recipe) {
    const recipeKey =
      key(
        recipe.baza,
        recipe.drozdze,
        recipe.woda,
        recipe.program
      );

    const map =
      reservationOwnerMap();

    const owner =
      map[recipeKey];

    if (!owner || !owner.token) {
      return null;
    }

    if (
      Number(owner.expiresAt) &&
      Number(owner.expiresAt) <
        Date.now()
    ) {
      delete map[recipeKey];
      saveReservationOwnerMap(map);
      return null;
    }

    return owner;
  }

  function saveReservationOwner(
    recipe,
    token,
    reservation
  ) {
    if (!token) return;

    const recipeKey =
      key(
        recipe.baza,
        recipe.drozdze,
        recipe.woda,
        recipe.program
      );

    const map =
      reservationOwnerMap();

    map[recipeKey] = {
      token,
      nick:
        String(
          reservation &&
          reservation.nick ||
          ""
        ),
      expiresAt:
        Number(
          reservation &&
          reservation.expiresAt
        ) || 0
    };

    saveReservationOwnerMap(map);
  }

  function clearReservationOwner(recipe) {
    const recipeKey =
      key(
        recipe.baza,
        recipe.drozdze,
        recipe.woda,
        recipe.program
      );

    const map =
      reservationOwnerMap();

    delete map[recipeKey];

    saveReservationOwnerMap(map);
  }

  function normalizedPlayerNick(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase("pl-PL");
  }

  function cachedAccountNick() {
    if (
      !cachedAccountStatus ||
      !cachedAccountStatus.nick ||
      cachedAccountStatusToken !==
        playerAccountSessionToken()
    ) {
      return "";
    }

    return String(
      cachedAccountStatus.nick || ""
    ).trim();
  }

  function accountOwnsReservation(
    reservation
  ) {
    const nick =
      cachedAccountNick();

    if (
      !nick ||
      !reservation ||
      !reservation.nick
    ) {
      return false;
    }

    return (
      normalizedPlayerNick(nick) ===
      normalizedPlayerNick(
        reservation.nick
      )
    );
  }

  function ownsReservation(
    recipe,
    reservation
  ) {
    if (!reservation) {
      return false;
    }

    // v20.15 — zalogowane konto tego samego nicku
    // może obsłużyć rezerwację na każdym urządzeniu.
    if (
      accountOwnsReservation(
        reservation
      )
    ) {
      return true;
    }

    // Dla niezalogowanych zachowujemy dotychczasowy
    // mechanizm urządzenia / ownerToken.
    const owner =
      reservationOwnerFor(recipe);

    if (!owner) {
      return false;
    }

    return (
      normalizedPlayerNick(
        owner.nick
      ) ===
      normalizedPlayerNick(
        reservation.nick
      )
    );
  }

  function makeRecipeNonce() {
    if (
      globalThis.crypto &&
      typeof globalThis.crypto.randomUUID ===
        "function"
    ) {
      return globalThis.crypto
        .randomUUID()
        .replace(/-/g,"");
    }

    const bytes =
      new Uint8Array(24);

    globalThis.crypto
      .getRandomValues(bytes);

    return Array
      .from(
        bytes,
        value =>
          value
            .toString(16)
            .padStart(2,"0")
      )
      .join("");
  }

  function recipeReservationFor(r) {
    return recipeReservations[
      key(r.baza,r.drozdze,r.woda,r.program)
    ] || null;
  }

  function reservationClock(expiresAt) {
    const date = new Date(Number(expiresAt));
    if (!Number.isFinite(date.getTime())) return "";
    return date.toLocaleTimeString("pl-PL", {
      hour:"2-digit",
      minute:"2-digit"
    });
  }

  function showRecipeActionNotice(
    message,
    type="info"
  ) {
    let box =
      document.getElementById(
        "recipe-action-notice"
      );

    if (!box) {
      box =
        document.createElement(
          "div"
        );

      box.id =
        "recipe-action-notice";

      box.className =
        "recipe-action-notice";

      document.body.appendChild(
        box
      );
    }

    box.dataset.type =
      type;

    box.textContent =
      message;

    box.hidden =
      false;

    clearTimeout(
      showRecipeActionNotice.timer
    );

    if (
      type !== "loading"
    ) {
      showRecipeActionNotice.timer =
        setTimeout(
          () => {
            box.hidden = true;
          },
          2400
        );
    }
  }


  async function reserveUnknownRecipe(recipe) {
    if (!backendConfigured()) {
      window.alert(
        "Backend nie jest skonfigurowany."
      );
      return;
    }

    const accountNick =
      cachedAccountNick();

    let cleanNick = "";

    if (accountNick) {
      const accepted =
        window.confirm(
          "Zarezerwować tę receptę?\n\n" +
          `Rezerwacja zostanie przypisana do ${accountNick} na 12 godzin.`
        );

      if (!accepted) {
        return;
      }

      cleanNick =
        accountNick;

    } else {
      const savedNick =
        localStorage.getItem(
          NICK_KEY
        ) || "";

      const nick =
        window.prompt(
          "Kto rezerwuje tę recepturę na 12 godzin?",
          savedNick
        );

      if (nick === null) {
        return;
      }

      cleanNick =
        String(nick || "")
          .trim();

      if (!cleanNick) {
        window.alert(
          "Podaj nick."
        );
        return;
      }

      localStorage.setItem(
        NICK_KEY,
        cleanNick
      );
    }

    showRecipeActionNotice(
      "⏳ Rezerwuję recepturę...",
      "loading"
    );

    try {
      const owner =
        reservationOwnerFor(
          recipe
        );

      const result =
        await jsonp(
          "reserveRecipe",
          {
            nick:cleanNick,
            baza:recipe.baza,
            drozdze:recipe.drozdze,
            woda:recipe.woda,
            program:recipe.program,
            ownerToken:
              owner &&
              owner.token
                ? owner.token
                : "",
            sessionToken:
              accountNick
                ? playerAccountSessionToken()
                : ""
          }
        );

      if (
        !result ||
        !result.ok
      ) {
        throw new Error(
          result &&
          result.error
            ? result.error
            : "Nie udało się zarezerwować receptury."
        );
      }

      if (result.ownerToken) {
        saveReservationOwner(
          recipe,
          result.ownerToken,
          result.reservation
        );
      }

      showRecipeActionNotice(
        result.message ||
        "✅ Receptura zarezerwowana na 12 godzin.",
        "success"
      );

      fetchApprovedRecipes();

    } catch (err) {
      const message =
        err &&
        err.message
          ? err.message
          : "Nie udało się zarezerwować receptury.";

      showRecipeActionNotice(
        "❌ " + message,
        "error"
      );

      window.alert(message);
    }
  }

  async function submitReservedRecipe(
    recipe,
    reservation
  ) {
    const owner =
      reservationOwnerFor(recipe);

    const accountOwner =
      accountOwnsReservation(
        reservation
      );

    if (
      !ownsReservation(
        recipe,
        reservation
      )
    ) {
      window.alert(
        "Wynik może wprowadzić tylko urządzenie, które utworzyło rezerwację, " +
        "albo zalogowane konto gracza przypisanego do tej rezerwacji."
      );
      return;
    }

    const raw =
      window.prompt(
        "Wpisz wynik tej receptury w litrach:",
        ""
      );

    if (raw === null) return;

    const litry =
      Number(
        String(raw)
          .trim()
          .replace(/\s+/g,"")
          .replace(",",".")
      );

    if (
      !Number.isFinite(litry) ||
      litry <= 0 ||
      litry > 50
    ) {
      window.alert(
        "Podaj poprawny wynik w litrach."
      );
      return;
    }

    if (
      !window.confirm(
        `Wysłać wynik ${fmt(litry)} l do weryfikacji?\n\n` +
        `${displayName(recipe.baza)} · ` +
        `${displayName(recipe.drozdze)} · ` +
        `${displayName(recipe.woda)} · P${recipe.program}`
      )
    ) {
      return;
    }

    const nonce =
      makeRecipeNonce();

    showRecipeActionNotice(
      "⏳ Wysyłam wynik...",
      "loading"
    );

    try {
      await fetch(
        BACKEND_URL,
        {
          method:"POST",
          mode:"no-cors",
          headers:{
            "Content-Type":
              "text/plain;charset=UTF-8"
          },
          body:
            JSON.stringify({
              action:
                "submitReservedRecipe",
              nonce,
              ownerToken:
                owner &&
                owner.token
                  ? owner.token
                  : "",
              sessionToken:
                accountOwner
                  ? playerAccountSessionToken()
                  : "",
              baza:recipe.baza,
              drozdze:recipe.drozdze,
              woda:recipe.woda,
              program:recipe.program,
              litry
            })
        }
      );

      let result = null;

      for (
        let attempt = 0;
        attempt < 20;
        attempt++
      ) {
        if (attempt > 0) {
          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                350
              )
          );
        }

        result =
          await jsonp(
            "reservedSubmitResult",
            {nonce}
          );

        if (
          result &&
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
          "Serwer nie zwrócił wyniku zapisu."
        );
      }

      if (!result.ok) {
        throw new Error(
          result.error ||
          "Nie udało się wysłać wyniku."
        );
      }

      showRecipeActionNotice(
        "✅ Wynik został wysłany do weryfikacji.",
        "success"
      );

      // Tak jak w stabilnym v20: po zapisie pobieramy pełny stan.
      fetchApprovedRecipes();

    } catch (err) {
      const message =
        err && err.message
          ? err.message
          : "Nie udało się wysłać wyniku.";

      showRecipeActionNotice(
        "❌ " + message,
        "error"
      );

      window.alert(message);
    }
  }


  function renderUnknown(data) {

    const allUnknown = data.unknown;

    const inProgress = allUnknown
      .filter(recipe => Boolean(recipeReservationFor(recipe)));

    const freeAll = allUnknown
      .filter(recipe => !recipeReservationFor(recipe));

    setupUnknownRecipeFilters();

    const unknownBase =
      el("unknown-filter-base")?.value || "";
    const unknownYeast =
      el("unknown-filter-yeast")?.value || "";
    const unknownWater =
      el("unknown-filter-water")?.value || "";
    const unknownProgram =
      el("unknown-filter-program")?.value || "";

    const free = freeAll.filter(recipe =>
      (!unknownBase || recipe.baza === unknownBase) &&
      (!unknownYeast || recipe.drozdze === unknownYeast) &&
      (!unknownWater || recipe.woda === unknownWater) &&
      (!unknownProgram || String(recipe.program) === unknownProgram)
    );

    const unknownSummary =
      el("unknown-filter-summary");

    if (unknownSummary) {
      unknownSummary.textContent =
        `Pokazano ${free.length} z ${freeAll.length} wolnych nieodkrytych recept.`;
    }

    const researchList = el("research-list");

    if (researchList) {
      researchList.innerHTML =
        inProgress.length
          ? inProgress.map(recipe => {
              const reservation = recipeReservationFor(recipe);

              const isOwner =
                ownsReservation(
                  recipe,
                  reservation
                );

              const isSubmitted =
                String(
                  reservation.state ||
                  "reserved"
                ) === "submitted";

              const canEnterResult =
                isOwner &&
                !isSubmitted;

              return `
                <article
                  class="unknown-card research-card ${
                    isSubmitted
                      ? "research-submitted"
                      : isOwner
                        ? "research-owned"
                        : "research-waiting"
                  }"
                  ${
                    canEnterResult
                      ? `data-owned-research="${escapeHtml(key(recipe.baza,recipe.drozdze,recipe.woda,recipe.program))}" style="cursor:pointer"`
                      : ""
                  }>
                  <div>
                    <strong>${displayName(recipe.baza)}</strong>
                    <small>
                      ${displayName(recipe.drozdze)} ·
                      ${displayName(recipe.woda)} ·
                      P${recipe.program}
                    </small>
                  </div>

                  ${
                    recipe.interesting
                      ? `
                          <div class="hint">
                            ⭐ Interesująca do zbadania
                            <br>
                            <span>
                              Inny program tej trójki:
                              do ${fmt(recipe.trioMax)} l
                            </span>
                          </div>
                        `
                      : ""
                  }

                  <div class="research-status">
                    ${
                      isSubmitted
                        ? (
                            isOwner
                              ? `📨 <b>Wynik wprowadzony</b> · ${reservation.submittedLiters != null ? `${fmt(Number(reservation.submittedLiters))} l · ` : ""}oczekuje na akceptację`
                              : `📨 <b>${escapeHtml(reservation.nick)}</b> wprowadził wynik · oczekuje na akceptację`
                          )
                        : (
                            isOwner
                              ? `🧪 <b>Oczekuje na wynik</b> · Twoja rezerwacja · kliknij, aby wprowadzić wynik · do ${reservationClock(reservation.expiresAt)}`
                              : `⏳ <b>Oczekuje na wynik</b> · ${escapeHtml(reservation.nick)} bada tę recepturę · do ${reservationClock(reservation.expiresAt)}`
                          )
                    }
                  </div>
                </article>
              `;
            }).join("")
          : `<div class="empty">Aktualnie żadna receptura nie jest zarezerwowana.</div>`;
    }

    if (researchList) {
      researchList
        .querySelectorAll(
          "[data-owned-research]"
        )
        .forEach(card => {
          card.addEventListener(
            "click",
            () => {
              const recipeKey =
                card.dataset
                  .ownedResearch;

              const recipe =
                inProgress.find(
                  item =>
                    key(
                      item.baza,
                      item.drozdze,
                      item.woda,
                      item.program
                    ) === recipeKey
                );

              if (!recipe) return;

              submitReservedRecipe(
                recipe,
                recipeReservationFor(recipe)
              );
            }
          );
        });
    }

    const unknownList = el("unknown-list");

    if (unknownList) {
      unknownList.innerHTML =
        free.length
          ? free.map((recipe,index) => `
              <article
                class="unknown-card ${recipe.interesting ? "interesting" : ""}"
                data-reserve-index="${index}"
                style="cursor:pointer"
                title="Kliknij, aby zarezerwować recepturę na 12 godzin">

                <div>
                  <strong>${displayName(recipe.baza)}</strong>
                  <small>
                    ${displayName(recipe.drozdze)} ·
                    ${displayName(recipe.woda)} ·
                    P${recipe.program}
                  </small>
                </div>

                ${
                  recipe.interesting
                    ? `
                        <div class="hint">
                          ⭐ Interesująca do zbadania
                          <br>
                          <span>
                            Inny program tej trójki:
                            do ${fmt(recipe.trioMax)} l
                          </span>
                        </div>
                      `
                    : ""
                }

                <div class="muted" style="margin-top:7px">
                  🔓 Wolna · kliknij, aby zaklepać na 12 h
                </div>
              </article>
            `).join("")
          : `<div class="empty">Brak wolnych nieodkrytych receptur dla wybranych składników.</div>`;

      unknownList
        .querySelectorAll("[data-reserve-index]")
        .forEach(card => {
          card.addEventListener("click", () => {
            const recipe = free[Number(card.dataset.reserveIndex)];
            if (recipe) reserveUnknownRecipe(recipe);
          });
        });
    }
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
        Nieodkryte receptury:
        <b>${data.unknown.length}</b>
      </p>

      <p class="muted">
        Zatwierdzone wyniki pobrane z serwera:
        <b>${Object.keys(remoteApproved).length}</b>
      </p>

      <h3>🏆 Ranking odkrywców</h3>

      <div>
        ${
          recipeRanking.length
            ? recipeRanking.slice(0,15).map((item,index) => `
                <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:10px;
                  padding:6px 8px;
                  margin-bottom:4px;
                  border:1px solid #e1d4bc;
                  border-radius:7px;
                  background:#fffdf8;
                ">
                  <span>
                    <b>${index + 1}.</b>
                    ${escapeHtml(item.nick)}
                  </span>
                  <b>${Number(item.count) || 0}</b>
                </div>
              `).join("")
            : `<div class="empty">Brak zaakceptowanych odkryć do rankingu.</div>`
        }
      </div>

      <p class="muted">
        Ranking liczy unikalne receptury. Duplikaty i późniejsze korekty nie dodają kolejnego punktu.
      </p>

    `;
  }

  function renderMap() {

  const container =
    el("map-list");

  const markers =
    MAP
      .map(
        ([district, action, icon]) => {

          const position =
            MAP_POSITIONS[district];

          if (!position) {
            return "";
          }

          const known =
            Boolean(action);

          return `
            <div
              style="
                position:absolute;
                left:${position.x}%;
                top:${position.y}%;
                transform:translate(-50%, 0);
                z-index:2;

                padding:2px 5px;
                border-radius:6px;

                background:${
                  known
                    ? "rgba(255,248,230,.92)"
                    : "rgba(255,238,238,.94)"
                };

                border:1px solid ${
                  known
                    ? "rgba(95,70,40,.55)"
                    : "rgba(180,80,80,.65)"
                };

                box-shadow:
                  0 1px 3px rgba(0,0,0,.25);

                font-size:10px;
                font-weight:700;
                line-height:1.15;
                white-space:nowrap;

                color:${
                  known
                    ? "#3d3022"
                    : "#9a2f2f"
                };

                pointer-events:none;
              "
            >
              ${icon}
              ${escapeHtml(
                action || "Nieodkryte"
              )}
            </div>
          `;
        }
      )
      .join("");


  container.innerHTML = `

    <div
      style="
        max-width:420px;
        margin:0 auto;
      "
    >

      <div
        style="
          position:relative;
          width:100%;
        "
      >

        <img
          src="mapa-warszawa.png"
          alt="Mapa dzielnic"
          style="
            display:block;
            width:100%;
            height:auto;
            border-radius:8px;
          "
        >

        ${markers}

      </div>


      <div
        style="
          margin-top:12px;
          padding:8px 10px;
          border-radius:8px;
          background:#f8f0df;
          border:1px solid #d8c49f;
          font-size:12px;
          line-height:1.5;
          text-align:center;
        "
      >
        ⚪ Neutralny
        &nbsp;·&nbsp;
        🙏 Błagalny
        &nbsp;·&nbsp;
        🤝 Przyjacielski
        &nbsp;·&nbsp;
        ⚔️ Agresywny
      </div>

    </div>
  `;
}

  function renderAll() {

    renderPremium();

    const data = compute();

    renderTop(data);
    renderAllAvailableRecipes(data);
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

            recipeReservations =
              payload.reservations && typeof payload.reservations === "object"
                ? payload.reservations
                : {};

            recipeRanking =
              Array.isArray(payload.ranking)
                ? payload.ranking
                : [];

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
    return playerAccountSessionToken() || "";
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

  function formatPaymentsDateTime(value) {

    const text =
      String(value || "").trim();

    if (!text) {
      return "—";
    }

    // Backend może zwrócić gotowy zapis w strefie skryptu.
    const display =
      /^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}):(\d{2})(?::(\d{2}))?$/
        .exec(text);

    if (display) {
      return (
        `${display[1]}.${display[2]}.${display[3]} ` +
        `${display[4]}:${display[5]}` +
        (display[6] ? `:${display[6]}` : "")
      );
    }

    // Stary format YYYY-MM-DD.
    const dateOnly =
      /^(\d{4})-(\d{2})-(\d{2})$/
        .exec(text);

    if (dateOnly) {
      return `${dateOnly[3]}.${dateOnly[2]}.${dateOnly[1]}`;
    }

    // ISO — fallback.
    const date =
      new Date(text);

    if (Number.isFinite(date.getTime())) {
      return date.toLocaleString(
        "pl-PL",
        {
          day:"2-digit",
          month:"2-digit",
          year:"numeric",
          hour:"2-digit",
          minute:"2-digit",
          second:"2-digit"
        }
      );
    }

    return text;
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

  function paymentsShare(value) {

    const share =
      Math.max(
        0,
        Number(value) || 0
      );

    return (share * 100)
      .toFixed(2)
      .replace(".", ",") + "%";
  }

  function paymentsRankBadge(index) {
    const position = index + 1;

    if (position === 1) {
      return `<span class="rank-badge gold">1</span>`;
    }

    if (position === 2) {
      return `<span class="rank-badge silver">2</span>`;
    }

    if (position === 3) {
      return `<span class="rank-badge bronze">3</span>`;
    }

    return `<span class="rank-badge normal">${position}</span>`;
  }

  function paymentsRow(player,index=0) {

    const saldo = Number(player.saldo) || 0;

    let stateClass = "zero";
    let status = "🟢 Na bieżąco";
    let amount = "0 zł";

    if (saldo < 0) {
      stateClass = "debt";
      status = "🔴 Dług";
      amount = "-" + formatSaldo(Math.abs(saldo)) + " zł";
    } else if (saldo > 0) {
      stateClass = "credit";
      status = "🔵 Nadpłata";
      amount = "+" + formatSaldo(saldo) + " zł";
    }

    return `
      <div class="finance-player-row ${stateClass} ranked-payment-row">
        <div class="payment-rank">
          ${paymentsRankBadge(index)}
        </div>

        <div class="payment-main">
          <div class="finance-name">
            ${escapeHtml(player.nick)}
          </div>

          <div class="finance-meta">
            <span>${status}</span>
          </div>
        </div>

        <div class="payment-total">
          ${amount}
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
    el("payments-login-status").textContent = message;
    showToolView("gang-gate-view", "gang");
    el("gang-tabs").hidden = true;
  }

  function showPaymentsContent() {
    el("gang-tabs").hidden = false;
    showToolView("payments-view", "gang");
  }

  function playerAccountSessionToken() {
    return localStorage.getItem(PLAYER_ACCOUNT_SESSION_KEY) || "";
  }

  function setPlayerAccountSessionToken(token) {
    if (token) {
      localStorage.setItem(
        PLAYER_ACCOUNT_SESSION_KEY,
        token
      );
    } else {
      localStorage.removeItem(
        PLAYER_ACCOUNT_SESSION_KEY
      );
    }

    cachedAccountStatus = null;
    cachedAccountStatusAt = 0;
    cachedAccountStatusToken = "";
    accountStatusInFlight = null;
  }

  async function playerAccountPostAction(action,data={}) {
    const nonce = makeRecipeNonce();

    await fetch(BACKEND_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=UTF-8"},
      body:JSON.stringify({action,nonce,...data})
    });

    let result = null;
    for (let i=0;i<20;i++) {
      await new Promise(resolve => setTimeout(resolve,350));
      result = await jsonp("playerAccountActionResult",{nonce});
      if (result && !result.pending) break;
    }

    if (!result || result.pending) throw new Error("Serwer nie zwrócił wyniku operacji.");
    if (!result.ok) {
      const err = new Error(result.error || "Operacja nie powiodła się.");
      err.data = result;
      throw err;
    }
    return result;
  }

  let cachedAccountStatus = null;
  let cachedAccountStatusAt = 0;
  let cachedAccountStatusToken = "";
  let accountStatusInFlight = null;

  async function playerAccountStatus(options={}) {
    const token = playerAccountSessionToken();

    if (!token) {
      cachedAccountStatus = null;
      cachedAccountStatusAt = 0;
      cachedAccountStatusToken = "";
      return null;
    }

    const force = Boolean(options.force);

    if (
      !force &&
      cachedAccountStatus &&
      cachedAccountStatusToken === token &&
      Date.now() - cachedAccountStatusAt < 60000
    ) {
      return cachedAccountStatus;
    }

    if (!force && accountStatusInFlight) {
      return accountStatusInFlight;
    }

    accountStatusInFlight = (async () => {
      try {
        const result =
          await jsonp(
            "playerAccountStatus",
            {sessionToken:token}
          );

        if (
          !result ||
          !result.ok ||
          !result.authenticated
        ) {
          cachedAccountStatus = null;
          cachedAccountStatusAt = 0;
          cachedAccountStatusToken = "";
          setPlayerAccountSessionToken("");
          return null;
        }

        cachedAccountStatus = result;
        cachedAccountStatusAt = Date.now();
        cachedAccountStatusToken = token;
        return result;

      } catch (err) {
        return cachedAccountStatusToken === token
          ? cachedAccountStatus
          : null;
      } finally {
        accountStatusInFlight = null;
      }
    })();

    return accountStatusInFlight;
  }

  let accountViewRenderInFlight = null;

  async function renderAccountView() {
    const box = el("account-content");
    const status = el("account-status");
    const adminHost = el("account-admin-host");
    if (!box) return;

    // Jeśli status nie jest jeszcze w cache, pokaż od razu jasny stan ładowania
    // zamiast pozostawiać użytkownika z wrażeniem zawieszenia.
    if (
      playerAccountSessionToken() &&
      !cachedAccountStatus
    ) {
      box.innerHTML = `
        <div class="account-card">
          <div class="loading-inline">
            <span class="loading-spinner" aria-hidden="true"></span>
            Ładowanie konta...
          </div>
        </div>
      `;
    }

    if (adminHost) {
      const adminPanel = el("admin-view");
      if (adminPanel && adminPanel.parentElement === adminHost) {
        adminPanel.hidden = true;
      }
    }

    const account = await playerAccountStatus();

    if (!account) {
      box.innerHTML = `
        <div class="account-card">
          <b>🔐 Logowanie</b>
          <div class="account-form" style="margin-top:9px">
            <label><span>Nick z gry</span><input id="account-login-nick" maxlength="40" placeholder="np. RoQ"></label>
            <label><span>Hasło lub kod 24h przy pierwszym logowaniu</span><input id="account-login-password" type="password" maxlength="128" placeholder="Hasło / kod"></label>
            <button id="account-login-button" class="primary-btn" type="button">🔐 Zaloguj</button>
          </div>
          <div class="account-note">Pierwsze logowanie: wpisz swój nick i kod 24h od administratora. Następnie ustawisz własne hasło.</div>
        </div>

        <div id="account-setup" class="account-card" style="margin-top:10px" hidden>
          <b>🔑 Ustaw własne hasło</b>
          <div class="account-form" style="margin-top:8px">
            <input id="account-new-password" type="password" placeholder="Nowe hasło — minimum 8 znaków">
            <input id="account-new-password-2" type="password" placeholder="Powtórz hasło">
            <button id="account-activate-button" class="primary-btn" type="button">✅ Aktywuj konto</button>
          </div>
        </div>

        <div class="account-card" style="margin-top:10px">
          <button id="account-reset-open" type="button">🔑 Mam kod resetujący hasło</button>
          <div id="account-reset-panel" class="account-form" style="margin-top:8px" hidden>
            <input id="account-reset-nick" placeholder="Nick z gry">
            <input id="account-reset-code" type="password" placeholder="Kod 24h">
            <input id="account-reset-password" type="password" placeholder="Nowe hasło">
            <input id="account-reset-password-2" type="password" placeholder="Powtórz nowe hasło">
            <button id="account-reset-button" class="primary-btn" type="button">✅ Ustaw nowe hasło</button>
          </div>
        </div>
      `;

      let pendingNick = "";
      let pendingCode = "";

      el("account-login-button")?.addEventListener("click",async event => {
        const button = event.currentTarget;
        const nick = el("account-login-nick").value.trim();
        const password = el("account-login-password").value;
        if (!nick || !password) { status.textContent="Podaj nick i hasło."; return; }

        setActionLoading(button,status,"Logowanie...");
        try {
          const result = await playerAccountPostAction("playerAccountLogin",{nick,password});
          setPlayerAccountSessionToken(result.session.token);
          status.textContent="✅ Zalogowano.";
          await renderAccountView();
        } catch (err) {
          if (err.data && err.data.needsActivation) {
            pendingNick=nick;
            pendingCode=password;
            el("account-setup").hidden=false;
            status.textContent="Ustaw własne hasło do konta.";
          } else status.textContent=err.message || "Nie udało się zalogować.";
        } finally { clearActionLoading(button); }
      });

      el("account-activate-button")?.addEventListener("click",async event => {
        const button=event.currentTarget;
        const p1=el("account-new-password").value;
        const p2=el("account-new-password-2").value;
        if (!pendingNick || !pendingCode) { status.textContent="Najpierw wpisz nick i kod 24h."; return; }
        if (p1!==p2) { status.textContent="Hasła nie są identyczne."; return; }
        if (p1.length<8) { status.textContent="Hasło musi mieć minimum 8 znaków."; return; }
        setActionLoading(button,status,"Aktywowanie konta...");
        try {
          const result=await playerAccountPostAction("playerAccountActivate",{nick:pendingNick,code:pendingCode,newPassword:p1});
          setPlayerAccountSessionToken(result.session.token);
          status.textContent="✅ Konto zostało aktywowane.";
          await renderAccountView();
        } catch(err) { status.textContent=err.message || "Nie udało się aktywować konta."; }
        finally { clearActionLoading(button); }
      });

      el("account-bootstrap-code-open")?.addEventListener("click",()=>{
        el("account-bootstrap-code-panel").hidden=!el("account-bootstrap-code-panel").hidden;
      });

      el("account-bootstrap-generate-code")?.addEventListener("click",async event=>{
        const button=event.currentTarget;
        const nick=el("account-bootstrap-code-nick").value.trim();
        const password=el("account-bootstrap-old-password").value;
        const resultBox=el("account-bootstrap-code-result");

        if (!nick || !password) {
          status.textContent="Podaj nick i dotychczasowe hasło Admina.";
          return;
        }

        setActionLoading(button,status,"Generowanie kodu...");

        try {
          const result=await playerAccountPostAction(
            "playerAccountBootstrapGenerateCode",
            {nick,legacyAdminPassword:password}
          );

          resultBox.hidden=false;
          resultBox.innerHTML=`Kod dla: <b>${escapeHtml(result.nick)}</b><strong>${escapeHtml(result.code)}</strong><span class="muted">Jednorazowy · ważny 24 godziny</span>`;
          status.textContent="✅ Kod został wygenerowany. Użyj go jako hasła przy pierwszym logowaniu.";
        } catch(err) {
          status.textContent=err.message || "Nie udało się wygenerować kodu.";
        } finally {
          clearActionLoading(button);
        }
      });

      el("account-reset-open")?.addEventListener("click",()=>{
        el("account-reset-panel").hidden=!el("account-reset-panel").hidden;
      });

      el("account-reset-button")?.addEventListener("click",async event => {
        const button=event.currentTarget;
        const nick=el("account-reset-nick").value.trim();
        const code=el("account-reset-code").value.trim();
        const p1=el("account-reset-password").value;
        const p2=el("account-reset-password-2").value;
        if (!nick || !code) { status.textContent="Podaj nick i kod 24h."; return; }
        if (p1!==p2) { status.textContent="Hasła nie są identyczne."; return; }
        if (p1.length<8) { status.textContent="Hasło musi mieć minimum 8 znaków."; return; }
        setActionLoading(button,status,"Resetowanie hasła...");
        try {
          const result=await playerAccountPostAction("playerAccountResetWithCode",{nick,code,newPassword:p1});
          setPlayerAccountSessionToken(result.session.token);
          status.textContent="✅ Hasło zostało zmienione i zalogowano.";
          await renderAccountView();
        } catch(err) { status.textContent=err.message || "Nie udało się zresetować hasła."; }
        finally { clearActionLoading(button); }
      });

      return;
    }

    // Konto staje się źródłem tożsamości dla obecnych funkcji.
    setPlayerIdentityToken && setPlayerIdentityToken(playerAccountSessionToken());

    box.innerHTML = `
      <div class="account-card logged">
        <b>👤 ${escapeHtml(account.nick)}</b>
        <div style="margin-top:5px">✅ Zalogowany${account.admin ? " · 🛠 Administrator" : ""}</div>
        <div style="margin-top:7px"><span class="account-session-stat">📱 Aktywne sesje: ${Number(account.sessionCount)||0}</span></div>
        <div class="account-actions">
          <button id="account-change-open" type="button">🔑 Zmień hasło</button>
          <button id="account-logout-others" type="button">📱 Wyloguj inne sesje</button>
          <button id="account-logout" class="logout-btn" type="button">🚪 Wyloguj</button>
        </div>

        ${account.admin ? `<div class="account-admin-link"><button id="account-admin-open" class="primary-btn" type="button">🛠 Panel administratora</button></div>` : ""}
      </div>

      <div id="account-change-panel" class="account-card" style="margin-top:10px" hidden>
        <b>🔑 Zmiana hasła</b>
        <div class="account-form" style="margin-top:8px">
          <input id="account-current-password" type="password" placeholder="Aktualne hasło">
          <input id="account-change-password" type="password" placeholder="Nowe hasło">
          <input id="account-change-password-2" type="password" placeholder="Powtórz nowe hasło">
          <button id="account-change-save" class="primary-btn" type="button">✅ Zapisz nowe hasło</button>
        </div>
      </div>
    `;

    el("account-change-open")?.addEventListener("click",()=>{
      el("account-change-panel").hidden=!el("account-change-panel").hidden;
    });

    el("account-change-save")?.addEventListener("click",async event => {
      const button=event.currentTarget;
      const currentPassword=el("account-current-password").value;
      const p1=el("account-change-password").value;
      const p2=el("account-change-password-2").value;
      if (p1!==p2) { status.textContent="Nowe hasła nie są identyczne."; return; }
      setActionLoading(button,status,"Zmiana hasła...");
      try {
        const result=await playerAccountPostAction("playerAccountChangePassword",{sessionToken:playerAccountSessionToken(),currentPassword,newPassword:p1});
        setPlayerAccountSessionToken(result.session.token);
        status.textContent="✅ Hasło zostało zmienione.";
        await renderAccountView();
      } catch(err) { status.textContent=err.message || "Nie udało się zmienić hasła."; }
      finally { clearActionLoading(button); }
    });

    el("account-logout-others")
      ?.addEventListener(
        "click",
        async event => {
          const button = event.currentTarget;

          if (
            !window.confirm(
              "Wylogować wszystkie pozostałe sesje tego konta?"
            )
          ) return;

          setActionLoading(
            button,
            status,
            "Wylogowywanie innych sesji..."
          );

          try {
          adminLoaderTexts(
            "sessions"
          );
            await fetch(
              BACKEND_URL,
              {
                method:"POST",
                mode:"no-cors",
                headers:{
                  "Content-Type":
                    "text/plain;charset=UTF-8"
                },
                body:
                  JSON.stringify({
                    action:
                      "playerAccountLogoutOtherSessions",
                    sessionToken:
                      playerAccountSessionToken()
                  })
              }
            );

            status.textContent =
              "✅ Pozostałe sesje zostały wylogowane.";

            await renderAccountView();

          } catch (err) {
            status.textContent =
              err.message ||
              "Nie udało się wylogować innych sesji.";
          } finally {
            clearActionLoading(button);
          }
        }
      );


    el("account-logout")?.addEventListener("click",async ()=>{
      try { await playerAccountPostAction("playerAccountLogout",{sessionToken:playerAccountSessionToken()}); } catch(err) {}
      setPlayerAccountSessionToken("");
      if (typeof setGangToken === "function") setGangToken("");
      await renderAccountView();
    });

    el("account-bootstrap-admin")?.addEventListener("click",async event=>{
      const button=event.currentTarget;
      const password=el("account-bootstrap-password")?.value || "";
      if (!password) { status.textContent="Wpisz dotychczasowe hasło Admina."; return; }
      setActionLoading(button,status,"Nadawanie uprawnień...");
      try {
        await fetch(BACKEND_URL,{
          method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=UTF-8"},
          body:JSON.stringify({action:"playerAccountBootstrapAdmin",legacyAdminPassword:password,sessionToken:playerAccountSessionToken()})
        });
        await new Promise(resolve=>setTimeout(resolve,600));
        const refreshed=await playerAccountStatus();
        if (!refreshed || !refreshed.admin) throw new Error("Nie udało się nadać uprawnień. Sprawdź stare hasło Admina.");
        status.textContent="✅ Konto otrzymało uprawnienia administratora.";
        await renderAccountView();
      } catch(err) { status.textContent=err.message || "Nie udało się nadać uprawnień."; }
      finally { clearActionLoading(button); }
    });

    el("account-admin-open")?.addEventListener("click",()=>{
      const host=el("account-admin-host");
      const panel=el("admin-view");

      if (host && panel) {
        host.appendChild(panel);
        panel.hidden=false;
        el("admin-login").hidden=true;
        el("admin-content").hidden=false;

        const adminNeedsRequest =
          !adminWarmLoadedAt ||
          Date.now() - adminWarmLoadedAt >= 30000;

        if (
          adminNeedsRequest &&
          el("admin-status")
        ) {
          el("admin-status").textContent =
            "⏳ Ładowanie panelu administratora...";
        }

        if (adminNeedsRequest) {
          withRuntimeLoader(
            () => warmAdminData({
              silent:false
            }),
            "🛠️ Odświeżam panel Admina...",
            ['🥫 Admin gdzieś zapodział puszki z serwera...','🧹 Odkurzam ostatnie zakamarki panelu...','🍺 Panel Admina robi dolewkę...','🥴 Backend twierdzi, że już prawie...']
          );
        } else {
          warmAdminData({
            silent:false
          });
        }
      }
    });
  }

  async function warmAdminData(options={}) {
    const force =
      Boolean(options.force);

    const silent =
      Boolean(options.silent);

    if (
      !force &&
      adminWarmLoadedAt &&
      Date.now() - adminWarmLoadedAt < 30000
    ) {
      return true;
    }

    if (adminWarmPromise) {
      return adminWarmPromise;
    }

    if (!playerAccountSessionToken()) {
      return false;
    }

    adminWarmPromise =
      (async () => {
        const previousSilent =
          adminWarmSilent;

        adminWarmSilent =
          silent;

        const results =
          await Promise.allSettled([
            loadAccountAdminPermissions(),
            loadAdminGangTools(),
            loadAdminPaymentsStatus(),
            loadAdminSubmissions()
          ]);

        const anyOk =
          results.some(
            item =>
              item.status === "fulfilled"
          );

        if (anyOk) {
          adminWarmLoadedAt =
            Date.now();

          const adminStatus =
            el("admin-status");

          if (
            adminStatus &&
            adminStatus.textContent
              .includes("Ładowanie panelu administratora")
          ) {
            adminStatus.textContent = "";
          }
        }

        adminWarmSilent =
          previousSilent;

        return anyOk;
      })();

    try {
      return await adminWarmPromise;
    } finally {
      adminWarmPromise = null;
    }
  }


  async function loadAccountAdminPermissions() {
    const holder =
      el("account-admin-permissions");

    if (!holder) return;

    try {
      const result =
        await jsonp(
          "accountAdminPlayers",
          {
            sessionToken:
              playerAccountSessionToken()
          }
        );

      if (
        !result ||
        !result.ok
      ) {
        throw new Error(
          result &&
          result.error
            ? result.error
            : "Brak dostępu."
        );
      }

      // v20.9 — ta sama lista graczy zasila również
      // "Kody kont i reset hasła". Nie zależymy już od tego,
      // czy wcześniej załadowano dane Wpłat/Spółki.
      const salaryPlayerSelect =
        el("admin-salary-player");

      if (salaryPlayerSelect) {
        const previous =
          salaryPlayerSelect.value;

        salaryPlayerSelect.innerHTML =
          result.players
            .slice()
            .sort(
              (a,b) =>
                String(a.nick || "")
                  .localeCompare(
                    String(b.nick || ""),
                    "pl"
                  )
            )
            .map(
              player => `
                <option
                  value="${escapeHtml(player.nick)}"
                  data-account-active="${player.accountActive ? "1" : "0"}"
                  data-account-sessions="${Number(player.sessions) || 0}">
                  ${escapeHtml(player.nick)}
                </option>
              `
            )
            .join("");

        if (
          previous &&
          Array.from(
            salaryPlayerSelect.options
          ).some(
            option =>
              option.value === previous
          )
        ) {
          salaryPlayerSelect.value =
            previous;
        }

        refreshAdminAccountCodeStatus();
      }


      holder.innerHTML = `
        <div class="admin-player-permissions-head">
          <b>🛠 Uprawnienia graczy</b>
          <span class="muted">
            Dostęp do Panelu Admina i aktywne sesje kont.
          </span>
        </div>

        <div class="admin-player-permissions-list">
          ${
            result.players
              .map(player => `
                <div class="account-admin-player">
                  <div>
                    <b>${escapeHtml(player.nick)}</b>
                    <small>
                      Konto:
                      ${player.accountActive ? "aktywne" : "nieaktywne"}
                      · Sesje:
                      ${Number(player.sessions) || 0}
                    </small>
                  </div>

                  <button
                    data-account-admin-toggle="${escapeHtml(player.nick)}"
                    data-enabled="${player.admin ? 1 : 0}">
                    ${player.admin ? "✅ Admin" : "Nadaj Admin"}
                  </button>

                  <button
                    data-account-logout="${escapeHtml(player.nick)}">
                    🚫 Wyloguj
                  </button>

                  <button
                    type="button"
                    class="account-player-delete"
                    data-account-delete-player="${escapeHtml(player.nick)}">
                    🗑 Usuń
                  </button>
                </div>
              `)
              .join("")
          }
        </div>
      `;

      holder
        .querySelectorAll(
          "[data-account-admin-toggle]"
        )
        .forEach(button => {
          button.onclick =
            async () => {
              await fetch(
                BACKEND_URL,
                {
                  method:"POST",
                  mode:"no-cors",
                  headers:{
                    "Content-Type":
                      "text/plain;charset=UTF-8"
                  },
                  body:
                    JSON.stringify({
                      action:
                        "accountAdminSetPermission",
                      sessionToken:
                        playerAccountSessionToken(),
                      nick:
                        button.dataset.accountAdminToggle,
                      enabled:
                        button.dataset.enabled !== "1"
                    })
                }
              );

              // Bez sztucznego dodatkowego 400 ms.
              loadAccountAdminPermissions();
            };
        });

      holder
        .querySelectorAll(
          "[data-account-logout]"
        )
        .forEach(button => {
          button.onclick =
            async () => {
              const nick =
                button.dataset.accountLogout;

              if (
                !confirm(
                  `Wylogować ${nick} ze wszystkich sesji?`
                )
              ) {
                return;
              }

              await fetch(
                BACKEND_URL,
                {
                  method:"POST",
                  mode:"no-cors",
                  headers:{
                    "Content-Type":
                      "text/plain;charset=UTF-8"
                  },
                  body:
                    JSON.stringify({
                      action:
                        "accountAdminLogoutAll",
                      sessionToken:
                        playerAccountSessionToken(),
                      nick
                    })
                }
              );

              loadAccountAdminPermissions();
            };
        });

      holder
        .querySelectorAll(
          "[data-account-delete-player]"
        )
        .forEach(button => {
          button.onclick =
            async () => {
              const nick =
                button.dataset
                  .accountDeletePlayer;

              await deleteAdminPlayer(
                nick
              );

              // deleteAdminPlayer odświeża stare źródło danych;
              // tu odświeżamy również nową, wspólną listę Gracze.
              loadAccountAdminPermissions();
            };
        });

    } catch (err) {
      holder.innerHTML = `
        <div class="muted">
          ${escapeHtml(
            err.message ||
            "Nie udało się pobrać uprawnień."
          )}
        </div>
      `;
    }
  }

  function playerIdentityToken() {
    const current =
      localStorage.getItem(
        PLAYER_IDENTITY_KEY
      ) || "";

    if (current) return current;

    const legacy =
      localStorage.getItem(
        COMPANY_SALARY_IDENTITY_KEY
      ) || "";

    if (legacy) {
      localStorage.setItem(
        PLAYER_IDENTITY_KEY,
        legacy
      );
    }

    return legacy;
  }

  function setPlayerIdentityToken(token) {
    if (token) {
      localStorage.setItem(
        PLAYER_IDENTITY_KEY,
        token
      );

      // zgodność z v17 — moduł pensji używał starego klucza
      localStorage.setItem(
        COMPANY_SALARY_IDENTITY_KEY,
        token
      );
    } else {
      localStorage.removeItem(
        PLAYER_IDENTITY_KEY
      );

      localStorage.removeItem(
        COMPANY_SALARY_IDENTITY_KEY
      );
    }
  }

  function companySalaryIdentityToken() {
    return playerAccountSessionToken() || playerIdentityToken();
  }

  function setCompanySalaryIdentityToken(token) {
    setPlayerIdentityToken(token);
  }

  async function playerIdentityStatus() {
    const token =
      playerIdentityToken();

    if (!token) return null;

    try {
      const result =
        await jsonp(
          "playerIdentityStatus",
          {identityToken:token}
        );

      if (
        !result ||
        !result.ok ||
        !result.authenticated
      ) {
        setPlayerIdentityToken("");
        return null;
      }

      return result;
    } catch (err) {
      return null;
    }
  }

  async function playerIdentityPostAction(
    action,
    data={}
  ) {
    const nonce =
      makeRecipeNonce();

    await fetch(
      BACKEND_URL,
      {
        method:"POST",
        mode:"no-cors",
        headers:{
          "Content-Type":
            "text/plain;charset=UTF-8"
        },
        body:
          JSON.stringify({
            action,
            nonce,
            ...data
          })
      }
    );

    let result = null;

    for (
      let attempt=0;
      attempt<20;
      attempt++
    ) {
      await new Promise(
        resolve =>
          setTimeout(resolve,350)
      );

      result =
        await jsonp(
          "playerIdentityActionResult",
          {nonce}
        );

      if (
        result &&
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
        "Serwer nie zwrócił wyniku operacji."
      );
    }

    if (!result.ok) {
      throw new Error(
        result.error ||
        "Operacja nie powiodła się."
      );
    }

    return result;
  }

  async function companySalaryPostAction(
    action,
    data={}
  ) {
    // Aktywacja tożsamości jest od v18 wspólna dla całego Gangu.
    if (
      action ===
      "companyClaimSalaryIdentity"
    ) {
      return playerIdentityPostAction(
        "playerClaimIdentity",
        data
      );
    }

    const nonce =
      makeRecipeNonce();

    await fetch(
      BACKEND_URL,
      {
        method:"POST",
        mode:"no-cors",
        headers:{
          "Content-Type":
            "text/plain;charset=UTF-8"
        },
        body:
          JSON.stringify({
            action,
            nonce,
            ...data
          })
      }
    );

    let result = null;

    for (
      let attempt=0;
      attempt<20;
      attempt++
    ) {
      await new Promise(
        resolve =>
          setTimeout(resolve,350)
      );

      result =
        await jsonp(
          "companySalaryActionResult",
          {nonce}
        );

      if (
        result &&
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
        "Serwer nie zwrócił wyniku operacji."
      );
    }

    if (!result.ok) {
      throw new Error(
        result.error ||
        "Operacja nie powiodła się."
      );
    }

    return result;
  }

  async function companySalaryIdentityStatus() {
    const account =
      await playerAccountStatus();

    if (!account) {
      return null;
    }

    return {
      ok:true,
      authenticated:true,
      nick:account.nick,
      expiresAt:account.expiresAt
    };
  }

  async function renderPlayerIdentitySettings() {
    const box =
      el("player-identity-box");

    const status =
      el("player-identity-status");

    if (!box) return;

    const identity =
      await playerIdentityStatus();

    if (!identity) {
      box.innerHTML = `
        <div class="identity-card">
          <b>🔐 Potwierdź swoją tożsamość</b>

          <p class="muted">
            Jednorazowy kod otrzymasz od administratora.
            Po aktywacji to urządzenie będzie mogło korzystać z funkcji przypisanych do Twojego nicku.
          </p>

          <div class="salary-identity-grid">
            <label>
              <span>Twój nick</span>
              <input
                id="player-identity-nick"
                type="text"
                maxlength="40"
                placeholder="np. RoQ">
            </label>

            <label>
              <span>Kod aktywacyjny</span>
              <input
                id="player-identity-code"
                type="text"
                maxlength="12"
                autocomplete="one-time-code"
                placeholder="XXXXXXXX">
            </label>

            <button
              id="player-identity-claim"
              class="primary-btn"
              type="button">
              🔓 Aktywuj
            </button>
          </div>
        </div>
      `;

      el("player-identity-claim")
        ?.addEventListener(
          "click",
          async event => {
            const button =
              event.currentTarget;

            const nick =
              el("player-identity-nick")
                .value.trim();

            const code =
              el("player-identity-code")
                .value.trim();

            if (!nick || !code) {
              status.textContent =
                "Podaj nick i kod aktywacyjny.";
              return;
            }

            setActionLoading(
              button,
              status,
              "Aktywowanie..."
            );

            try {
              const result =
                await playerIdentityPostAction(
                  "playerClaimIdentity",
                  {nick,code}
                );

              setPlayerIdentityToken(
                result.token
              );

              status.textContent =
                `✅ To urządzenie zostało przypisane do: ${result.nick}.`;

              await renderPlayerIdentitySettings();

            } catch (err) {
              status.textContent =
                err.message ||
                "Nie udało się aktywować dostępu.";
            } finally {
              clearActionLoading(button);
            }
          }
        );

      return;
    }

    box.innerHTML = `
      <div class="identity-card identity-ok">
        <b>👤 Tożsamość gracza</b>

        <div style="margin-top:6px">
          Zalogowany jako:
          <strong>${escapeHtml(identity.nick)}</strong>
        </div>

        <div class="muted" style="margin-top:4px">
          ✅ To urządzenie jest potwierdzone.
        </div>

        <button
          id="player-identity-logout"
          class="logout-btn"
          type="button"
          style="margin-top:8px">
          🔒 Odłącz tożsamość
        </button>
      </div>
    `;

    el("player-identity-logout")
      ?.addEventListener(
        "click",
        async () => {
          setPlayerIdentityToken("");

          status.textContent =
            "Tożsamość została odłączona na tym urządzeniu.";

          await renderPlayerIdentitySettings();
        }
      );
  }

  function pollPercent(
    count,
    total
  ) {
    return total
      ? Math.round(
          count /
          total *
          100
        )
      : 0;
  }

  let gangPollsLoadInFlight = null;

  async function loadGangPolls() {
    if (gangPollsLoadInFlight) {
      return gangPollsLoadInFlight;
    }

    gangPollsLoadInFlight = (async () => {
    const box =
      el("gang-polls-list");

    if (!box) return;

    try {
      const payload =
        await jsonp(
          "gangPolls",
          {
            sessionToken:
              playerAccountSessionToken(),
            identityToken:
              playerAccountSessionToken()
          }
        );

      const polls =
        Array.isArray(
          payload &&
          payload.polls
        )
          ? payload.polls
          : [];

      box.innerHTML =
        polls.length
          ? polls.map(poll => {
              const total =
                Number(
                  poll.totalVotes
                ) || 0;

              const isOpen =
                poll.status === "OPEN";

              return `
                <article class="poll-card ${isOpen ? "" : "closed"}">
                  <div class="poll-title">
                    ${escapeHtml(poll.title)}
                  </div>

                  <div class="poll-question">
                    ${escapeHtml(poll.question)}
                  </div>

                  ${
                    !payload.authenticated &&
                    isOpen
                      ? `
                          <div class="poll-auth-note">
                            🔐 Potwierdź swoją tożsamość w
                            <b>Gang → Ustawienia</b>,
                            aby zagłosować.
                          </div>
                        `
                      : ""
                  }

                  ${
                    poll.options
                      .map(
                        (option,index) => {
                          const count =
                            Number(
                              poll.counts &&
                              poll.counts[index]
                            ) || 0;

                          const pct =
                            pollPercent(
                              count,
                              total
                            );

                          const selected =
                            Number(
                              poll.myVote
                            ) === index;

                          return `
                            <div class="poll-option">
                              <button
                                type="button"
                                data-poll-id="${escapeHtml(poll.id)}"
                                data-poll-option="${index}"
                                class="${selected ? "selected" : ""}"
                                ${isOpen ? "" : "disabled"}>
                                ${selected ? "✅ " : ""}
                                ${escapeHtml(option)}
                              </button>

                              <div class="poll-bar">
                                <div style="width:${pct}%"></div>
                              </div>

                              <div class="poll-option-meta">
                                <span>${count} gł.</span>
                                <span>${pct}%</span>
                              </div>
                            </div>
                          `;
                        }
                      )
                      .join("")
                  }

                  <div class="muted">
                    Głosowało:
                    <b>${total}</b>
                    ·
                    ${
                      isOpen
                        ? "ankieta otwarta"
                        : "ankieta zamknięta"
                    }
                  </div>
                </article>
              `;
            }).join("")
          : `
              <div class="empty">
                Brak ankiet.
              </div>
            `;

      box
        .querySelectorAll(
          "[data-poll-id]"
        )
        .forEach(button => {
          button.addEventListener(
            "click",
            async () => {
              if (button.disabled) {
                return;
              }

              const account =
                await playerAccountStatus();

              if (!account) {
                window.alert(
                  "🔐 Zaloguj się na Konto, aby zagłosować."
                );
                return;
              }

              try {
                await playerIdentityPostAction(
                  "gangPollVote",
                  {
                    identityToken:
                      playerAccountSessionToken(),
                    pollId:
                      button.dataset.pollId,
                    optionIndex:
                      Number(
                        button.dataset.pollOption
                      )
                  }
                );

                await loadGangPolls();

              } catch (err) {
                window.alert(
                  err.message ||
                  "Nie udało się zapisać głosu."
                );
              }
            }
          );
        });

    } catch (err) {
      box.innerHTML = `
        <div class="empty">
          Nie udało się pobrać ankiet.
        </div>
      `;
    }
  
    })();

    try {
      return await gangPollsLoadInFlight;
    } finally {
      gangPollsLoadInFlight = null;
    }
  }

  async function renderCompanySalarySelfService(payload) {
    const box = el("company-salary-identity-box");
    const status = el("company-salary-self-status");

    if (!box) return;

    const identity = await companySalaryIdentityStatus();

    if (!identity) {
      box.innerHTML = `
        <div class="salary-identity-card">
          <b>🔐 Zaloguj się na swoje Konto</b>
          <p class="muted">
            Aby zarządzać własną pensją, zaloguj się w
            <b>Konto</b>.
          </p>
        </div>
      `;
      return;
    }

    const players = Array.isArray(payload && payload.players)
      ? payload.players
      : [];

    const player = players.find(item =>
      String(item.nick || "").trim().toLocaleLowerCase("pl-PL") ===
      String(identity.nick || "").trim().toLocaleLowerCase("pl-PL")
    );

    const eligible = player && Number(player.salary) > 0;
    const waived = Boolean(player && player.salaryWaived);

    const money = value =>
      (Number(value) || 0).toLocaleString("pl-PL",{maximumFractionDigits:2}) + " zł";

    box.innerHTML = `
      <div class="salary-waiver-card ${waived ? "waived" : ""}">
        <b>💰 Twoja pensja — ${escapeHtml(identity.nick)}</b>

        ${
          eligible
            ? `
                <div class="finance-meta" style="margin-top:6px">
                  <span>Należna pensja: <strong>${money(player.salary)}</strong></span>
                  <span>Do wypłaty w grze: <strong>${money(player.payoutSalary ?? player.salary)}</strong></span>
                  ${waived ? `<span>Do Funduszu: <strong>${money(player.waivedAmount)}</strong></span>` : ""}
                </div>

                <div class="salary-waiver-actions">
                  <div class="salary-waiver-note">
                    ${
                      waived
                        ? "Dobrowolnie zrzekasz się części pensji ponad minimalne 160 zł."
                        : "Możesz zrzec się części pensji ponad minimalne 160 zł. Różnica trafi do Funduszu i nie zwiększy pensji pozostałych graczy."
                    }
                  </div>

                  <button
                    id="company-salary-waiver-toggle"
                    class="${waived ? "logout-btn" : "primary-btn"}"
                    type="button">
                    ${waived ? "↩️ Przywróć pensję" : "💚 Zrzekam się pensji"}
                  </button>
                </div>
              `
            : `<p class="muted">Nie masz obecnie naliczanej pensji udziałowca.</p>`
        }
      </div>
    `;

    el("company-salary-waiver-toggle")?.addEventListener("click",async event => {
      const button = event.currentTarget;
      const nextWaived = !waived;

      if (!window.confirm(
        nextWaived
          ? "Zrzec się pensji ponad minimalne 160 zł? Różnica trafi do Funduszu."
          : "Przywrócić pełną należną pensję?"
      )) return;

      setActionLoading(
        button,
        status,
        nextWaived ? "Zapisywanie rezygnacji..." : "Przywracanie pensji..."
      );

      try {
        await companySalaryPostAction("companySetSalaryWaiver",{
          identityToken:
            playerAccountSessionToken(),
          waived:nextWaived
        });

        status.textContent = nextWaived
          ? "✅ Zrzekłeś się pensji. Kwota ponad 160 zł trafi do Funduszu."
          : "✅ Pełna pensja została przywrócona.";

        await loadPayments({background:true});
      } catch (err) {
        status.textContent = err.message || "Nie udało się zapisać decyzji.";
      } finally {
        clearActionLoading(button);
      }
    });
  }


  function renderCompanySummary(payload) {
    const box = el("company-summary");
    if (!box) return;

    const players = Array.isArray(payload && payload.players)
      ? payload.players
      : [];

    const eligible = players
      .filter(player => Number(player.share) > 0 || Number(player.salary) > 0)
      .sort((a,b) => Number(b.contribution || 0) - Number(a.contribution || 0));

    const money = value =>
      (Number(value) || 0).toLocaleString("pl-PL",{maximumFractionDigits:2}) + " zł";

    box.innerHTML = `
      <div class="company-grid">
        <div class="company-stat"><small>Dzienny dochód</small><b>${money(payload.companyIncome)}</b></div>
        <div class="company-stat"><small>Budżet pensji 50%</small><b>${money(payload.salaryBudget)}</b></div>
        <div class="company-stat"><small>Rozwój 50%</small><b>${money(payload.developmentBudget)}</b></div>
        <div class="company-stat"><small>Udziałowcy ≥ 30 000</small><b>${Number(payload.eligibleCount) || 0}</b></div>
      </div>

      ${
        Number(payload.waivedToFund) > 0
          ? `
              <div class="salary-fund-highlight company-fund-top">
                <strong>
                  💚 Dobrowolnie przekazane pensje:
                  +${money(payload.waivedToFund)}
                </strong>
                <br>
                <strong>
                  Fundusz łącznie z częścią rozwojową:
                  ${money(payload.fundTotal)}
                </strong>
              </div>
            `
          : ""
      }

      <div
        id="company-salary-self-service"
        class="salary-self-service company-salary-top">
        <div id="company-salary-identity-box">
          <div class="muted">
            Przygotowuję Twoją pensję...
          </div>
        </div>
        <div
          id="company-salary-self-status"
          class="submit-status"></div>
      </div>

      <h3 class="company-shares-title">
        Udziały i przewidywane pensje
      </h3>

      <div class="company-list">
        ${
          eligible.length
            ? eligible.map(player => `
                <div class="finance-player-row credit">
                  <div class="finance-name">
                    ${escapeHtml(player.nick)}
                    ${player.salaryWaived ? `<span class="salary-waived-badge">💚 pensja dla Funduszu</span>` : ""}
                  </div>

                  <div class="finance-meta">
                    <span>🏢 Wkład: <strong>${money(player.contribution)}</strong></span>
                    <span>Udział: <strong>${(Number(player.share || 0)*100).toLocaleString("pl-PL",{minimumFractionDigits:2,maximumFractionDigits:2})}%</strong></span>
                    <span>💰 Należna: <strong>${money(player.salary)}</strong></span>

                    ${
                      player.salaryWaived
                        ? `
                            <span>🎮 Do gry: <strong>${money(player.payoutSalary)}</strong></span>
                            <span>💚 Fundusz: <strong>${money(player.waivedAmount)}</strong></span>
                          `
                        : ""
                    }
                  </div>
                </div>
              `).join("")
            : `<div class="empty">Nikt nie osiągnął jeszcze progu 30 000 zł wkładu.</div>`
        }
      </div>

      <p class="muted" style="margin-top:10px">
        Rezygnacja z pensji nie zmienia udziałów ani należnych pensji pozostałych graczy.
        Gracz zrzekający się pensji otrzymuje w grze minimalne 160 zł, a pozostała część jego własnej pensji trafia do Funduszu.
      </p>
    `;

    renderCompanySalarySelfService(payload);
  }

  function gangFormatNumber(value) {
    return (Number(value) || 0).toLocaleString(
      "pl-PL",
      {maximumFractionDigits:2}
    );
  }

  function renderGangGoal(payload) {
    const box = el("gang-goal-content");
    if (!box) return;
const goal = payload && payload.goal;

    if (!goal) {
      box.innerHTML = `
        <div class="empty">
          🎯 Administrator nie ustawił jeszcze aktywnego celu gangu.
        </div>
      `;
      return;
    }

    const current = Math.max(0, Number(goal.current) || 0);
    const target = Math.max(0, Number(goal.target) || 0);
    const percent = target > 0
      ? Math.max(0, Math.min(100, current / target * 100))
      : 0;
    const unit = String(goal.unit || "").trim();
    const suffix = unit ? ` ${escapeHtml(unit)}` : "";

    box.innerHTML = `
      <div class="gang-goal-card">
        <div class="muted">🎯 Aktualny cel</div>
        <h3 style="margin:4px 0 6px">
          ${escapeHtml(goal.title)}
        </h3>

        <div>
          <b>${gangFormatNumber(current)}${suffix}</b>
          /
          ${gangFormatNumber(target)}${suffix}
        </div>

        <div class="gang-progress-track">
          <div
            class="gang-progress-fill"
            style="width:${percent}%">
          </div>
        </div>

        <div class="muted">
          ${percent.toFixed(1).replace(".",",")}% ukończone
          ${current < target
            ? ` · brakuje ${gangFormatNumber(target-current)}${suffix}`
            : " · ✅ cel osiągnięty"}
        </div>
      </div>
    `;
  }

  function gangAnnouncementDate(timestamp) {
    const date = new Date(Number(timestamp));
    if (!Number.isFinite(date.getTime())) return "";

    return date.toLocaleString(
      "pl-PL",
      {
        day:"2-digit",
        month:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
      }
    );
  }

  function renderGangAnnouncements(payload) {
    const box = el("gang-announcements-content");
    if (!box) return;

    const announcements =
      Array.isArray(payload && payload.announcements)
        ? payload.announcements
        : [];

    box.innerHTML = announcements.length
      ? announcements.map(item => `
          <article class="announcement-card ${item.important ? "important" : ""}">
            <div class="announcement-meta">
              <span>
                ${item.important ? "📌 Ważne" : "📢 Ogłoszenie"}
              </span>
              <span>${escapeHtml(gangAnnouncementDate(item.createdAt))}</span>
            </div>
            <div style="white-space:pre-wrap">
              ${escapeHtml(item.text)}
            </div>
          </article>
        `).join("")
      : `
          <div class="empty">
            📢 Brak aktywnych ogłoszeń.
          </div>
        `;
  }

  function renderGangPayload(payload) {
    if (!payload) return;

    renderCompanySummary(payload);
    renderGangGoal(payload);
    renderGangAnnouncements(payload);

    const players =
      Array.isArray(payload.players)
        ? payload.players
        : [];

    el("payments-date").textContent =
      "Stan na: " +
      formatPaymentsDateTime(
        payload.updatedAtDisplay ||
        payload.updatedAt ||
        payload.saldoDate
      );

    el("payments-count").textContent =
      `Graczy: ${players.length}`;

    const rankedPlayers =
      players
        .slice()
        .sort((a,b) =>
          (Number(b.saldo) || 0) -
          (Number(a.saldo) || 0)
          ||
          String(a.nick || "")
            .localeCompare(
              String(b.nick || ""),
              "pl"
            )
        );

    el("payments-list").innerHTML =
      rankedPlayers.length
        ? rankedPlayers
            .map((player,index) =>
              paymentsRow(player,index)
            )
            .join("")
        : `<div class="empty">Brak danych do wyświetlenia.</div>`;
  }

  let paymentsLoadInFlight = null;

  async function loadPayments(options={}) {
    if (paymentsLoadInFlight) {
      if (latestGangPayload) {
        renderGangPayload(latestGangPayload);
      }
      return paymentsLoadInFlight;
    }

    paymentsLoadInFlight = (async () => {

    const token = gangToken();

    if (!token) {
      showPaymentsLogin();
      return;
    }

    const background = Boolean(options.background);

    if (!background) {
      showPaymentsContent();
    }

    if (latestGangPayload) {
      renderGangPayload(latestGangPayload);
    }

    if (!background) {
      el("payments-status").textContent =
        latestGangPayload
          ? ""
          : "Pobieranie danych...";
    }

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
          setPlayerAccountSessionToken("");

          el("gang-tabs").hidden =
            true;

          showToolView(
            "gang-gate-view",
            "gang"
          );

          return;
        }

        throw new Error(
          payload && payload.error
            ? payload.error
            : "Nie udało się pobrać wpłat."
        );
      }

      latestGangPayload = payload;
      latestGangPayloadAt = Date.now();
      renderGangPayload(payload);

      if (!background) {
        el("payments-status").textContent = "";
      }

    } catch (err) {

      if (!background) {
        el("payments-status").textContent =
          err && err.message
            ? err.message
            : "Nie udało się pobrać danych.";
      }
    }
  
    })();

    try {
      return await paymentsLoadInFlight;
    } finally {
      paymentsLoadInFlight = null;
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
    el("payments-refresh")?.addEventListener("click",loadPayments);
    el("gang-tabs").hidden = true;
  }


  // ============================================================
// PANEL ADMINISTRATORA
// ============================================================

let adminPaymentsSnapshot = null;
let latestGangPayload = null;
let latestGangPayloadAt = 0;
let gangSessionValidationAt = 0;

// v20.11 — jeden wspólny preload Admina.
// Kliknięcie panelu podczas prefetchu nie uruchamia drugiego kompletu requestów.
let adminWarmPromise = null;
let adminWarmLoadedAt = 0;
let adminWarmSilent = false;

function adminToken() {
  return playerAccountSessionToken() || localStorage.getItem(ADMIN_TOKEN_KEY) || "";
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


function setActionLoading(button,statusEl,text="Zapisywanie...") {
  if (button) {
    button.disabled = true;
    button.dataset.originalText =
      button.dataset.originalText ||
      button.innerHTML;
    button.innerHTML =
      `<span class="loading-spinner" aria-hidden="true"></span> ${escapeHtml(text)}`;
  }

  if (statusEl) {
    statusEl.innerHTML =
      `<span class="loading-inline">
        <span class="loading-spinner" aria-hidden="true"></span>
        ${escapeHtml(text)}
      </span>`;
  }
}

function clearActionLoading(button) {
  if (!button) return;

  button.disabled = false;

  if (button.dataset.originalText) {
    button.innerHTML =
      button.dataset.originalText;
    delete button.dataset.originalText;
  }
}

async function adminPostAction(action, data={}) {
  const token = adminToken();

  if (!token) {
    showAdminLogin();
    throw new Error("Brak sesji administratora.");
  }

  await fetch(
    BACKEND_URL,
    {
      method:"POST",
      mode:"no-cors",
      headers:{
        "Content-Type":"text/plain;charset=UTF-8"
      },
      body:JSON.stringify({
        action,
        token,
        ...data
      })
    }
  );

  // Apps Script + no-cors: wynik odczytujemy przez odświeżenie GET.
  await new Promise(resolve => setTimeout(resolve, 350));
}

function adminRecipeLabel(item) {
  return [
    item.baza,
    item.drozdze,
    item.woda,
    `P${Number(item.program) || 0}`
  ].filter(Boolean).join(" · ");
}

function refreshAdminAccountCodeStatus() {
  const select =
    el("admin-salary-player");

  const box =
    el("admin-identity-device-count");

  if (!select || !box) return;

  const option =
    select.options[
      select.selectedIndex
    ];

  if (!option) {
    box.textContent =
      "Konto: — · Aktywne sesje: 0";
    return;
  }

  const active =
    option.dataset.accountActive === "1";

  const sessions =
    Number(
      option.dataset.accountSessions
    ) || 0;

  box.textContent =
    `Konto: ${active ? "aktywne" : "nieaktywne"} · Aktywne sesje: ${sessions}`;
}


async function refreshAdminIdentityStatus() {
  // Alias pozostawiony dla zgodności starszych wywołań.
  refreshAdminAccountCodeStatus();
}

async function loadAdminPolls() {
  const box =
    el("admin-polls-list");

  if (!box) return;

  try {
    const payload =
      await jsonp(
        "gangPolls",
        {}
      );

    const polls =
      Array.isArray(
        payload &&
        payload.polls
      )
        ? payload.polls
        : [];

    box.innerHTML =
      polls.length
        ? polls.map(poll => `
            <div class="poll-admin-card">
              <b>${escapeHtml(poll.title)}</b>

              <div class="muted">
                ${escapeHtml(poll.question)}
                · ${poll.totalVotes || 0} gł.
                · ${poll.status === "OPEN" ? "otwarta" : "zamknięta"}
              </div>

              <div class="poll-admin-actions">
                <button
                  type="button"
                  data-admin-poll-toggle="${escapeHtml(poll.id)}"
                  data-next-status="${poll.status === "OPEN" ? "CLOSED" : "OPEN"}">
                  ${poll.status === "OPEN" ? "🔒 Zamknij" : "🔓 Otwórz"}
                </button>

                <button
                  type="button"
                  data-admin-poll-delete="${escapeHtml(poll.id)}">
                  🗑 Usuń
                </button>
              </div>
            </div>
          `).join("")
        : `<div class="muted">Brak ankiet.</div>`;

    box
      .querySelectorAll(
        "[data-admin-poll-toggle]"
      )
      .forEach(button => {
        button.onclick =
          async () => {
            adminLoaderTexts(
              "poll"
            );

            try {
              await adminPostAction(
              "adminSetGangPollStatus",
              {
                pollId:
                  button.dataset.adminPollToggle,
                status:
                  button.dataset.nextStatus
              }
            );

              await Promise.allSettled([
                loadAdminPolls(),
                loadGangPolls()
              ]);

              await runtimeLoaderFinish(
                "✅ Ankieta zaktualizowana"
              );
            } catch (err) {
              await runtimeLoaderFinish(
                "❌ Aktualizacja nieudana"
              );
              throw err;
            }
          };
      });

    box
      .querySelectorAll(
        "[data-admin-poll-delete]"
      )
      .forEach(button => {
        button.onclick =
          async () => {
            if (
              !window.confirm(
                "Usunąć tę ankietę razem z głosami?"
              )
            ) {
              return;
            }

            adminLoaderTexts(
              "poll"
            );

            try {
              await adminPostAction(
              "adminDeleteGangPoll",
              {
                pollId:
                  button.dataset.adminPollDelete
              }
            );

              await Promise.allSettled([
                loadAdminPolls(),
                loadGangPolls()
              ]);

              await runtimeLoaderFinish(
                "✅ Ankieta usunięta"
              );
            } catch (err) {
              await runtimeLoaderFinish(
                "❌ Usuwanie nieudane"
              );
              throw err;
            }
          };
      });

  } catch (err) {
    box.innerHTML =
      `<div class="muted">Nie udało się pobrać ankiet.</div>`;
  }
}


function renderAdminGangTools(payload) {

  // v20.9 — lista graczy do kodów kont jest ładowana
  // przez loadAccountAdminPermissions(), a nie przez latestGangPayload.
  // Dzięki temu wejście bezpośrednio Konto → Admin nie czyści selecta.


  const reservations =
    Array.isArray(payload && payload.reservations)
      ? payload.reservations
      : [];

  const reservationsBox =
    el("admin-reservations-list");

  const reservationsAccordion =
    el("admin-section-reservations");

  if (
    reservationsAccordion &&
    reservations.length > 0
  ) {
    reservationsAccordion.open = true;
  }

  if (reservationsBox) {
    reservationsBox.innerHTML =
      reservations.length
        ? reservations.map(item => `
            <div class="reservation-admin-row">
              <div>
                <b>${escapeHtml(item.nick)}</b>
                <div class="muted">
                  ${escapeHtml(adminRecipeLabel(item))}
                  · do ${escapeHtml(
                    new Date(Number(item.expiresAt))
                      .toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"})
                  )}
                </div>
              </div>

              <button
                type="button"
                data-clear-reservation="${escapeHtml(item.recipeKey)}">
                🗑 Zwolnij
              </button>
            </div>
          `).join("")
        : `<div class="empty">Brak aktywnych rezerwacji.</div>`;

    reservationsBox
      .querySelectorAll("[data-clear-reservation]")
      .forEach(button => {
        button.onclick = async () => {
          if (!window.confirm("Usunąć tę rezerwację?")) return;

          const status = el("admin-gang-tools-status");

          setActionLoading(
            button,
            status,
            "Zwalnianie rezerwacji..."
          );

          try {
            adminLoaderTexts(
              "reservation"
            );

            await adminPostAction(
              "adminClearReservation",
              {recipeKey:button.dataset.clearReservation}
            );

            status.textContent =
              "✅ Rezerwacja została zwolniona.";

            await loadAdminGangTools();
            fetchApprovedRecipes();

            await runtimeLoaderFinish(
              "✅ Rezerwacja zwolniona"
            );
          } catch (err) {
            status.textContent =
              err.message || "Nie udało się usunąć rezerwacji.";

            await runtimeLoaderFinish(
              "❌ Zwalnianie nieudane"
            );
          } finally {
            clearActionLoading(button);
          }
        };
      });
  }

  const goal = payload && payload.goal;

  if (el("admin-goal-title")) {
    el("admin-goal-title").value =
      goal ? String(goal.title || "") : "";
    el("admin-goal-current").value =
      goal ? String(goal.current ?? "") : "";
    el("admin-goal-target").value =
      goal ? String(goal.target ?? "") : "";
    el("admin-goal-unit").value =
      goal ? String(goal.unit || "") : "";
  }

  const announcements =
    Array.isArray(payload && payload.announcements)
      ? payload.announcements
      : [];

  const announcementsBox =
    el("admin-announcements-list");

  if (announcementsBox) {
    announcementsBox.innerHTML =
      announcements.length
        ? announcements.map(item => `
            <div class="announcement-card ${item.important ? "important" : ""}">
              <div class="announcement-meta">
                <span>${item.important ? "📌 Ważne" : "📢 Ogłoszenie"}</span>
                <span>${escapeHtml(gangAnnouncementDate(item.createdAt))}</span>
              </div>

              <div style="white-space:pre-wrap;margin-bottom:8px">
                ${escapeHtml(item.text)}
              </div>

              <div class="admin-actions-row">
                <button
                  type="button"
                  data-toggle-important="${escapeHtml(item.id)}"
                  data-important="${item.important ? "1" : "0"}">
                  ${item.important ? "📌 Odepnij" : "📌 Oznacz Ważne"}
                </button>

                <button
                  type="button"
                  data-delete-announcement="${escapeHtml(item.id)}">
                  🗑 Usuń
                </button>
              </div>
            </div>
          `).join("")
        : `<div class="empty">Brak ogłoszeń.</div>`;

    announcementsBox
      .querySelectorAll("[data-toggle-important]")
      .forEach(button => {
        button.onclick = async () => {
          const important =
            button.dataset.important !== "1";

          button.disabled = true;

          try {
            adminLoaderTexts(
              "announcement"
            );

            await adminPostAction(
              "adminSetAnnouncementImportant",
              {
                id:button.dataset.toggleImportant,
                important
              }
            );
            await Promise.allSettled([
              loadAdminGangTools(),
              loadPayments({background:true})
            ]);

            await runtimeLoaderFinish(
              "✅ Ogłoszenie zaktualizowane"
            );
          } catch (err) {
            el("admin-gang-tools-status").textContent =
              err.message || "Nie udało się zmienić przypięcia.";

            await runtimeLoaderFinish(
              "❌ Aktualizacja nieudana"
            );
          }
        };
      });

    announcementsBox
      .querySelectorAll("[data-delete-announcement]")
      .forEach(button => {
        button.onclick = async () => {
          if (!window.confirm("Usunąć to ogłoszenie?")) return;

          button.disabled = true;

          try {
            adminLoaderTexts(
              "announcement"
            );

            await adminPostAction(
              "adminDeleteAnnouncement",
              {id:button.dataset.deleteAnnouncement}
            );
            await Promise.allSettled([
              loadAdminGangTools(),
              loadPayments({background:true})
            ]);

            await runtimeLoaderFinish(
              "✅ Ogłoszenie usunięte"
            );
          } catch (err) {
            el("admin-gang-tools-status").textContent =
              err.message || "Nie udało się usunąć ogłoszenia.";

            await runtimeLoaderFinish(
              "❌ Usuwanie nieudane"
            );
          }
        };
      });
  }
}

async function loadAdminGangTools() {
  const token = adminToken();

  if (!token) return;

  const status = el("admin-gang-tools-status");

  try {
    const payload =
      await jsonp("adminGangTools",{token});

    if (!payload || !payload.ok) {
      throw new Error(
        payload && payload.error
          ? payload.error
          : "Nie udało się pobrać narzędzi gangu."
      );
    }

    renderAdminGangTools(payload);
    loadAdminPolls();

    if (status) status.textContent = "";

  } catch (err) {
    if (status) {
      status.textContent =
        err && err.message
          ? err.message
          : "Nie udało się pobrać narzędzi gangu.";
    }
  }
}

function showAdminContent() {

  el("admin-login").hidden = true;
  el("admin-content").hidden = false;

  el("admin-status").textContent = "";

  loadAdminSubmissions();	
  loadAdminPaymentsStatus();
  loadAdminPlayers();
  loadAdminGangTools();
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

  const duplicateInfo = item.duplicate
    ? `<div style="margin-top:6px;padding:6px;border-radius:6px;background:#f4efe5">
         ♻️ Identyczny wynik jest już zatwierdzony (${formatSaldo(item.knownLiters)} l).
       </div>`
    : "";

  const correctionInfo = item.correction
    ? `<div style="margin-top:6px;padding:6px;border-radius:6px;background:#fff3d6">
         ⚠️ Znany wynik: <b>${formatSaldo(item.knownLiters)} l</b> · nowe zgłoszenie: <b>${formatSaldo(item.litry)} l</b>.
       </div>`
    : "";

  const approveAction = item.duplicate
    ? "DUPLIKAT"
    : "ZATWIERDZONE";

  const approveLabel = item.duplicate
    ? "♻️ Oznacz duplikat"
    : item.correction
      ? "✅ Zatwierdź korektę"
      : "✅ Zatwierdź";

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
      ${duplicateInfo}
      ${correctionInfo}

      <div style="
        display:flex;
        gap:8px;
        margin-top:9px;
      ">

        <button
          type="button"
          data-admin-action="${approveAction}"
          data-correction="${item.correction ? "1" : "0"}"
          data-row="${item.row}"
          style="
            flex:1;
            background:#eaf6ea;
            border-color:#9fc79f;
          ">
          ${approveLabel}
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
  button,
  correction=false
) {

  const token =
    adminToken();

  if (!token) {
    showAdminLogin();
    return;
  }


  const isApprove =
    newStatus === "ZATWIERDZONE";

  const isDuplicate =
    newStatus === "DUPLIKAT";


  const confirmed =
    window.confirm(
      isDuplicate
        ? "Oznaczyć to zgłoszenie jako duplikat?"
        : isApprove
          ? (
              correction
                ? "Zatwierdzić ten wynik jako korektę istniejącej receptury?"
                : "Zatwierdzić tę recepturę?"
            )
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


  const loadingText =
    isDuplicate
      ? "♻️ Oznaczam duplikat..."
      : isApprove
        ? (
            correction
              ? "✅ Zatwierdzam korektę receptury..."
              : "✅ Zatwierdzam recepturę..."
          )
        : "❌ Odrzucam recepturę...";

  const funnyText =
    isApprove
      ? [
          "🧪 Destylator miesza w papierach, już kończę...",
          "🥫 Recepta zaplątała się między puszkami...",
          "📋 Sprawdzam ostatnią karteczkę z wynikiem...",
          "🍺 Laborant obiecuje, że to już moment..."
        ]
      : isDuplicate
        ? [
            "♻️ Szukam bliźniaka tej recepty w stercie kartek...",
            "🧬 Porównuję składniki jeszcze raz...",
            "🥫 Duplikat schował się za puszką...",
            "🍺 Archiwum twierdzi, że już go widziało..."
          ]
        : [
            "🗑️ Wyrzucam receptę do kosza, kosz stawia opór...",
            "📄 Kartka nie chce się poddać...",
            "🥫 Kosz jest pełen puszek...",
            "🍺 Jeszcze chwila i recepta znika..."
          ];


  el("admin-status").textContent =
    loadingText;

  runtimeLoaderStart(
    loadingText,
    funnyText
  );


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
            newStatus,

          correction:
            Boolean(correction)
        })
      }
    );


    // Backend v20.19 robi SpreadsheetApp.flush()
    // przed odpowiedzią, więc nie potrzebujemy już
    // sztucznego dodatkowego oczekiwania 500 ms.
    await loadAdminSubmissions();


    // Zatwierdzona receptura ma od razu trafić
    // również do wspólnej bazy widocznej w PWA.
    if (isApprove) {
      fetchApprovedRecipes();
    }


    const finalText =
      isDuplicate
        ? "✅ Duplikat oznaczony"
        : isApprove
          ? (
              correction
                ? "✅ Korekta zatwierdzona"
                : "✅ Receptura zatwierdzona"
            )
          : "✅ Receptura odrzucona";

    await runtimeLoaderFinish(
      finalText
    );

    adminWarmLoadedAt =
      Date.now();


  } catch (err) {

    el("admin-status").textContent =
      err && err.message
        ? err.message
        : "Nie udało się zmienić statusu.";

    buttons.forEach(
      btn => btn.disabled = false
    );

    await runtimeLoaderFinish(
      "❌ Operacja nieudana"
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
          button,
          button.dataset.correction === "1"
        );
      }
    );
  });

    el("admin-status").textContent =
      "";

  } catch (err) {

    if (!adminWarmSilent) {
      el("admin-status").textContent =
        err && err.message
          ? err.message
          : "Nie udało się pobrać zgłoszeń.";
    }
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


    // Lista graczy jest od v20.5 renderowana wspólnie
    // z uprawnieniami w account-admin-permissions.
    // Ten element zostaje tylko dla kompatybilności starego kodu.
    box.innerHTML = "";


    status.textContent = "";

    await runtimeLoaderFinish(
      "✅ Dane sprawdzone"
    );


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

  adminLoaderTexts(
    "playerAdd"
  );


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


    input.value = "";

    status.textContent =
      `✅ Dodano gracza ${nick}.`;


    await loadAdminPlayers();
    await loadAccountAdminPermissions();

    await loadAdminPaymentsStatus();

    await runtimeLoaderFinish(
      "✅ Gracz dodany"
    );


  } catch (err) {

    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się dodać gracza.";

    await runtimeLoaderFinish(
      "❌ Dodawanie nieudane"
    );
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

  adminLoaderTexts(
    "playerDelete"
  );


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


    status.textContent =
      `✅ Usunięto gracza ${nick}.`;


    await loadAdminPlayers();
    await loadAccountAdminPermissions();

    await loadAdminPaymentsStatus();

    await runtimeLoaderFinish(
      "✅ Gracz usunięty"
    );


  } catch (err) {

    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się usunąć gracza.";

    await runtimeLoaderFinish(
      "❌ Usuwanie nieudane"
    );
  }
}


function adminReportDate(value) {

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(String(value || ""));

  if (!match) {
    return String(value || "");
  }

  return (
    match[3] +
    "." +
    match[2] +
    "." +
    match[1]
  );
}


function adminReportAmount(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  const rounded =
    Math.round(number);

  const formatted =
    Math.abs(rounded)
      .toLocaleString(
        "pl-PL",
        {
          maximumFractionDigits: 0
        }
      );

  if (number > 0) {
    return "+" + formatted;
  }

  if (number < 0) {
    return "-" + formatted;
  }

  return "0";
}


function adminReportNick(value) {

  const nick =
    String(value || "");

  const width = 22;

  if (nick.length >= width) {
    return nick.slice(0,width);
  }

  return (
    nick +
    " ".repeat(
      width - nick.length
    )
  );
}


function buildAdminDailyReport(payload) {

  const players =
    Array.isArray(
      payload &&
      payload.players
    )
      ? payload.players
      : [];

  const date =
    adminReportDate(
      payload &&
      payload.saldoDate
    );

  const rows =
    players
      .map(
        player =>
          adminReportNick(
            player.nick
          ) +
          adminReportAmount(
            player.saldo
          )
      )
      .join("\n");

  return (
`📊 Dzienne podsumowanie wpłat — ${date}

🔴 wartość ujemna — dług do nadrobienia
🟢 0 — wszystko na bieżąco
🔵 wartość dodatnia — wkład w firmę

Każdego dnia naliczany jest wymóg 2 000 zł.
Nadpłata przechodzi na kolejne dni i jednocześnie stanowi wkład w firmę.

🏢 Od 30 000 zł wkładu gracz kwalifikuje się do udziału w spółce.

\`\`\`
${rows}
\`\`\`

🔎 MenelWars Tools
https://roq665.github.io/Menelwars-Tools/
(Hasło do wpłat: 6N4X38)

Dziękuję wszystkim za regularne wpłaty i dodatkowe wsparcie. ❤️`
  );
}


async function copyAdminDailyReport() {

  const status =
    el(
      "admin-copy-daily-report-status"
    );

  if (!adminPaymentsSnapshot) {

    if (status) {
      status.textContent =
        "Najpierw pobierz dane wpłat.";
    }

    return;
  }

  const report =
    buildAdminDailyReport(
      adminPaymentsSnapshot
    );

  try {

    await navigator.clipboard.writeText(
      report
    );

    if (status) {

      status.textContent =
        "✅ Raport skopiowany do schowka.";

      setTimeout(
        () => {
          if (status) {
            status.textContent = "";
          }
        },
        2000
      );
    }

  } catch (err) {

    if (status) {
      status.textContent =
        "Nie udało się skopiować raportu.";
    }
  }
}


function companyMoney(value) {

  return Number(value || 0)
    .toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    );
}


function companyPlan(
  payload,
  income
) {

  const players =
    Array.isArray(
      payload &&
      payload.players
    )
      ? payload.players
      : [];

  const safeIncome =
    Math.max(
      0,
      Number(income) || 0
    );

  const eligible =
    players
      .map(player => ({
        nick: player.nick,
        contribution:
          Math.max(
            0,
            Number(
              player.contribution
            ) || 0
          )
      }))
      .filter(
        player =>
          player.contribution >=
          COMPANY_MIN_CONTRIBUTION
      );

  const eligibleContribution =
    eligible.reduce(
      (sum, player) =>
        sum +
        player.contribution,
      0
    );

  const targetSalaryBudget =
    safeIncome *
    COMPANY_SALARY_RATIO;

  const baseTotal =
    eligible.length *
    COMPANY_BASE_SALARY;

  // Budżet 80/20 wynika z dochodu spółki
  // niezależnie od liczby zatrudnionych.
  const salaryBudget =
    targetSalaryBudget;

  const developmentBudget =
    safeIncome *
    (1 - COMPANY_SALARY_RATIO);

  const bonusPool =
    Math.max(
      0,
      salaryBudget -
      baseTotal
    );

  const rows =
    eligible.map(player => {

      const share =
        eligibleContribution > 0
          ? player.contribution /
            eligibleContribution
          : 0;

      const salary =
        COMPANY_BASE_SALARY +
        bonusPool * share;

      return {
        ...player,
        share,
        salary
      };
    });

  const actualSalaryTotal =
    rows.reduce(
      (sum, player) =>
        sum +
        Number(player.salary || 0),
      0
    );

  return {
    income: safeIncome,
    salaryBudget,
    developmentBudget,
    actualSalaryTotal,
    baseTotal,
    bonusPool,
    eligibleContribution,
    rows
  };
}


function renderAdminCompanyPlan(
  payload =
    adminPaymentsSnapshot
) {

  const result =
    el(
      "admin-company-result"
    );

  const input =
    el(
      "admin-company-income"
    );

  if (
    !result ||
    !input ||
    !payload
  ) {
    return;
  }

  const income =
    Math.max(
      0,
      Number(
        payload.companyIncome ??
        String(
          input.value || ""
        )
          .replace(/\s+/g, "")
          .replace(",", ".")
      ) || 0
    );

  input.value =
    String(income);

  const plan =
    companyPlan(
      payload,
      income
    );

  const totalContribution =
    (Array.isArray(payload.players)
      ? payload.players
      : []
    ).reduce(
      (sum, player) =>
        sum +
        Math.max(
          0,
          Number(
            player.contribution
          ) || 0
        ),
      0
    );

  const rowsHtml =
    plan.rows.length
      ? plan.rows
          .map(player => `
            <div style="
              display:grid;
              grid-template-columns:minmax(0,1fr) auto auto;
              gap:8px;
              align-items:center;
              padding:6px 7px;
              margin-top:4px;
              border:1px solid #d8c7aa;
              border-radius:7px;
              background:#fffdf8;
              font-size:12px;
            ">
              <div>
                <strong>
                  ${escapeHtml(player.nick)}
                </strong>
                <div class="muted">
                  Wkład:
                  ${companyMoney(
                    player.contribution
                  )} zł
                </div>
              </div>

              <strong>
                ${(
                  player.share * 100
                )
                  .toFixed(2)
                  .replace(".",",")}%
              </strong>

              <strong>
                ${companyMoney(
                  player.salary
                )} zł
              </strong>
            </div>
          `)
          .join("")
      : `
          <div class="empty">
            Nikt nie osiągnął jeszcze progu
            ${companyMoney(
              COMPANY_MIN_CONTRIBUTION
            )} zł.
          </div>
        `;

  result.innerHTML = `
    <div style="
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(135px,1fr));
      gap:6px;
      margin-bottom:8px;
    ">
      <div style="
        padding:8px;
        border:1px solid #d8c7aa;
        border-radius:7px;
        background:#fffdf8;
      ">
        <div class="muted">
          Łączny wkład
        </div>
        <strong>
          ${companyMoney(
            totalContribution
          )} zł
        </strong>
      </div>

      <div style="
        padding:8px;
        border:1px solid #d8c7aa;
        border-radius:7px;
        background:#fffdf8;
      ">
        <div class="muted">
          Kwalifikowani
        </div>
        <strong>
          ${plan.rows.length}
        </strong>
      </div>

      <div style="
        padding:8px;
        border:1px solid #d8c7aa;
        border-radius:7px;
        background:#fffdf8;
      ">
        <div class="muted">
          Budżet pensji 50%
        </div>
        <strong>
          ${companyMoney(
            plan.salaryBudget
          )} zł
        </strong>
      </div>

      <div style="
        padding:8px;
        border:1px solid #d8c7aa;
        border-radius:7px;
        background:#fffdf8;
      ">
        <div class="muted">
          Do wypłaty
        </div>
        <strong>
          ${companyMoney(
            plan.actualSalaryTotal
          )} zł
        </strong>
      </div>

      <div style="
        padding:8px;
        border:1px solid #d8c7aa;
        border-radius:7px;
        background:#fffdf8;
      ">
        <div class="muted">
          Rozwój 50%
        </div>
        <strong>
          ${companyMoney(
            plan.developmentBudget
          )} zł
        </strong>
      </div>
    </div>

    <div class="muted" style="margin-bottom:6px">
      Próg zatrudnienia:
      <b>
        ${companyMoney(
          COMPANY_MIN_CONTRIBUTION
        )} zł
      </b>.
      Każdy zakwalifikowany dostaje najpierw
      <b>${COMPANY_BASE_SALARY} zł</b>,
      a pozostała część 50% dochodu jest
      dzielona proporcjonalnie do wkładu.
    </div>

    ${rowsHtml}
  `;
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

    adminPaymentsSnapshot =
      payload;

    renderAdminCompanyPlan(
      payload
    );

    const writeProtection =
      {blocked:false};

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
            Snapshot rankingu do
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

  const result = el("admin-payments-preview-result");
  const importButton = el("admin-payments-import");
  const players = Array.isArray(payload.players) ? payload.players : [];
  const errors = Array.isArray(payload.errors) ? payload.errors : [];
  const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];

  if (importButton) {
    importButton.hidden = !payload.canWrite;
    importButton.disabled = false;
  }

  const summary = `
    <div class="panel" style="margin-bottom:10px">
      <div class="panel-body">
        <b>${payload.mode === "initialize" ? "🧭 Pierwszy snapshot" : "✅ Rozliczenie do zapisania"}</b><br>
        Stan rankingu: <b>${escapeHtml(formatAdminDate(payload.closeDate))}</b><br>
        Aktywni w rosterze: <b>${Number(payload.rosterCount)||0}</b> ·
        znalezieni: <b>${Number(payload.matchedCount)||0}</b> ·
        zignorowani spoza gangu: <b>${Number(payload.ignoredCount)||0}</b>
      </div>
    </div>`;

  const messages = [
    ...errors.map(x => `<div style="color:#9b2d2d;margin:4px 0">❌ ${escapeHtml(x)}</div>`),
    ...warnings.map(x => `<div style="color:#8a6500;margin:4px 0">⚠️ ${escapeHtml(x)}</div>`)
  ].join("");

  const rows = players.map(player => {
    const baseline = player.status === "baseline";
    const waiting = player.status === "waiting_baseline";
    const bad = player.status === "error";
    const bg = bad ? "#fff1f1" : waiting ? "#f3f3f3" : baseline ? "#eef4ff" : "#eef7ee";
    const border = bad ? "#e3b2b2" : waiting ? "#c8c8c8" : baseline ? "#b7c8e8" : "#bad7ba";

    return `
      <div style="border:1px solid ${border};background:${bg};border-radius:8px;padding:8px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;gap:8px"><strong>${escapeHtml(player.nick)}</strong><strong>${paymentPreviewMoney(player.newBalance)} zł</strong></div>
        <div class="muted" style="margin-top:3px">
          ${baseline ? "Pierwszy odczyt · delta 0 zł" : waiting ? "Oczekiwanie na pierwszy odczyt" : `Nowe wpłaty: +${paymentPreviewMoney(player.delta)} zł · Obowiązek: -${paymentPreviewMoney(player.obligation)} zł (${Number(player.chargedDays)||0} dni)`}
        </div>
        ${player.previousTotal != null ? `<div class="muted">Suma: ${paymentPreviewMoney(player.previousTotal)} → ${paymentPreviewMoney(player.currentTotal)} zł · wpłaty: ${Number(player.previousCount)||0} → ${Number(player.currentCount)||0}</div>` : ""}
      </div>`;
  }).join("");

  result.innerHTML = summary + messages + rows;
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
      "Wklej pełny ranking łącznych wpłat.";

    result.innerHTML = "";

    return;
  }


  status.textContent =
    "Sprawdzanie danych...";

  result.innerHTML = "";


  const nonce =
    makeNonce();

  adminLoaderTexts("paymentsPreview");


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

    await runtimeLoaderFinish(
      "✅ Dane sprawdzone"
    );


  } catch (err) {

    status.textContent =
      err &&
      err.message
        ? err.message
        : "Nie udało się sprawdzić danych.";

    await runtimeLoaderFinish(
      "❌ Sprawdzanie nieudane"
    );
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
      "Wklej pełny ranking łącznych wpłat.";

    return;
  }


  const confirmed =
    window.confirm(
      "Zapisać ten stan rankingu i przeliczyć dożywotnie salda?"
    );


  if (!confirmed) {
    return;
  }


  const nonce =
    makeNonce();


  button.disabled = true;

  status.textContent =
    "Wprowadzanie danych...";

  adminLoaderTexts(
    "paymentsImport"
  );


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


    await runtimeLoaderFinish(
      "✅ Wpłaty zaktualizowane"
    );


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

    await runtimeLoaderFinish(
      "❌ Import nieudany"
    );

  } finally {

    button.disabled = false;
  }
}

function setupAdmin() {

  el("admin-refresh")
    .addEventListener(
      "click",
      () => {
        adminWarmLoadedAt = 0;

        withRuntimeLoader(
          () => Promise.allSettled([
            warmAdminData({force:true}),
            loadAdminPlayers()
          ]),
          "🛠️ Odświeżam panel Admina...",
          ['🍺 Panel Admina robi dolewkę, już kończę...','🥫 Szukam ostatniej puszki z uprawnieniami...','🧹 Sprzątam kolejkę requestów...','🥴 Jeszcze tylko jedna rubryka...']
        );
      }
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

  el("admin-copy-daily-report")
    ?.addEventListener(
      "click",
      copyAdminDailyReport
    );

  el("admin-company-income")
    ?.addEventListener(
      "change",
      async event => {

        const input =
          event.target;

        const income =
          Math.max(
            0,
            Number(
              String(
                input.value || ""
              )
                .replace(/\s+/g, "")
                .replace(",", ".")
            ) || 0
          );

        input.disabled = true;

        try {

          adminLoaderTexts(
            "company"
          );

          const payload =
            await jsonp(
              "adminSetCompanyIncome",
              {
                token:
                  adminToken(),
                income:
                  String(income)
              }
            );

          if (!payload || !payload.ok) {
            throw new Error(
              payload && payload.error
                ? payload.error
                : "Nie udało się zapisać dochodu spółki."
            );
          }

          await loadAdminPaymentsStatus();

          await runtimeLoaderFinish(
            "✅ Spółka zaktualizowana"
          );

        } catch (err) {

          const status =
            el("admin-status");

          if (status) {
            status.textContent =
              err && err.message
                ? err.message
                : "Nie udało się zapisać dochodu spółki.";
          }

          await runtimeLoaderFinish(
            "❌ Aktualizacja nieudana"
          );

        } finally {
          input.disabled = false;
        }
      }
    );

  el("admin-payments-refresh")
  .addEventListener(
    "click",
    loadAdminPaymentsStatus
  );

  el("admin-clear-all-reservations")
    ?.addEventListener(
      "click",
      async event => {
        if (!window.confirm(
          "Wyczyścić WSZYSTKIE aktywne rezerwacje receptur?"
        )) return;

        const button = event.currentTarget;
        const status = el("admin-gang-tools-status");

        setActionLoading(
          button,
          status,
          "Czyszczenie rezerwacji..."
        );

        try {
          adminLoaderTexts(
            "reservation"
          );

          await adminPostAction(
            "adminClearAllReservations"
          );

          status.textContent =
            "✅ Rezerwacje zostały wyczyszczone.";

          await loadAdminGangTools();
          fetchApprovedRecipes();

          await runtimeLoaderFinish(
            "✅ Rezerwacje wyczyszczone"
          );
        } catch (err) {
          status.textContent =
            err.message || "Nie udało się wyczyścić rezerwacji.";

          await runtimeLoaderFinish(
            "❌ Czyszczenie nieudane"
          );
        } finally {
          clearActionLoading(button);
        }
      }
    );

  el("admin-goal-form")
    ?.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const button =
          form.querySelector('button[type="submit"]');
        const status =
          el("admin-goal-status");

        const current = Number(
          String(el("admin-goal-current").value || "")
            .replace(/\s+/g,"")
            .replace(",",".")
        );

        const target = Number(
          String(el("admin-goal-target").value || "")
            .replace(/\s+/g,"")
            .replace(",",".")
        );

        setActionLoading(
          button,
          status,
          "Zapisywanie celu..."
        );

        try {
          adminLoaderTexts(
            "goal"
          );

          await adminPostAction(
            "adminSaveGoal",
            {
              title:el("admin-goal-title").value.trim(),
              current,
              target,
              unit:el("admin-goal-unit").value.trim()
            }
          );

          status.textContent =
            "✅ Cel gangu zapisany.";

          // Odświeżamy dane już po pokazaniu użytkownikowi sukcesu.
          await Promise.allSettled([
            loadAdminGangTools(),
            loadPayments({background:true})
          ]);

          await runtimeLoaderFinish(
            "✅ Cel zapisany"
          );

        } catch (err) {
          status.textContent =
            err.message || "Nie udało się zapisać celu.";

          await runtimeLoaderFinish(
            "❌ Zapis celu nieudany"
          );
        } finally {
          clearActionLoading(button);
        }
      }
    );

  el("admin-goal-delete")
    ?.addEventListener(
      "click",
      async event => {
        if (!window.confirm("Usunąć aktywny cel gangu?")) return;

        const button = event.currentTarget;
        const status = el("admin-goal-status");

        setActionLoading(
          button,
          status,
          "Usuwanie celu..."
        );

        try {
          adminLoaderTexts(
            "goal"
          );

          await adminPostAction("adminDeleteGoal");

          status.textContent =
            "✅ Cel został usunięty.";

          await Promise.allSettled([
            loadAdminGangTools(),
            loadPayments({background:true})
          ]);

          await runtimeLoaderFinish(
            "✅ Cel usunięty"
          );

        } catch (err) {
          status.textContent =
            err.message || "Nie udało się usunąć celu.";

          await runtimeLoaderFinish(
            "❌ Usuwanie celu nieudane"
          );
        } finally {
          clearActionLoading(button);
        }
      }
    );

  el("admin-announcement-form")
    ?.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const button =
          form.querySelector('button[type="submit"]');
        const status =
          el("admin-gang-tools-status");

        const text =
          el("admin-announcement-text").value.trim();

        if (!text) {
          status.textContent =
            "Wpisz treść ogłoszenia.";
          return;
        }

        setActionLoading(
          button,
          status,
          "Dodawanie ogłoszenia..."
        );

        try {
          adminLoaderTexts(
            "announcement"
          );

          await adminPostAction(
            "adminAddAnnouncement",
            {
              text,
              important:
                el("admin-announcement-important").checked
            }
          );

          el("admin-announcement-text").value = "";
          el("admin-announcement-important").checked = false;

          status.textContent =
            "✅ Ogłoszenie dodane.";

          await Promise.allSettled([
            loadAdminGangTools(),
            loadPayments({background:true})
          ]);

          await runtimeLoaderFinish(
            "✅ Ogłoszenie dodane"
          );

        } catch (err) {
          status.textContent =
            err.message || "Nie udało się dodać ogłoszenia.";

          await runtimeLoaderFinish(
            "❌ Dodawanie nieudane"
          );
        } finally {
          clearActionLoading(button);
        }
      }
    );


  el("admin-player-add-form")
    ?.addEventListener(
      "submit",
      addAdminPlayer
    );

  el("admin-poll-create")
    ?.addEventListener(
      "click",
      async event => {
        const button =
          event.currentTarget;

        const status =
          el("admin-poll-status");

        const title =
          el("admin-poll-title")
            .value.trim();

        const question =
          el("admin-poll-question")
            .value.trim();

        const options =
          el("admin-poll-options")
            .value
            .split(/\r?\n/)
            .map(value =>
              value.trim()
            )
            .filter(Boolean);

        const endValue =
          el("admin-poll-end")
            .value;

        if (
          !title ||
          !question ||
          options.length < 2
        ) {
          status.textContent =
            "Podaj tytuł, pytanie i co najmniej 2 odpowiedzi.";
          return;
        }

        setActionLoading(
          button,
          status,
          "Tworzenie ankiety..."
        );

        try {
          adminLoaderTexts(
            "poll"
          );

          await adminPostAction(
            "adminCreateGangPoll",
            {
              title,
              question,
              options,
              endAt:
                endValue
                  ? new Date(
                      endValue
                    ).toISOString()
                  : ""
            }
          );

          status.textContent =
            "✅ Ankieta została utworzona.";

          el("admin-poll-title").value = "";
          el("admin-poll-question").value = "";
          el("admin-poll-options").value = "";
          el("admin-poll-end").value = "";

          await Promise.allSettled([
            loadAdminPolls(),
            loadGangPolls()
          ]);

          await runtimeLoaderFinish(
            "✅ Ankieta utworzona"
          );

        } catch (err) {
          status.textContent =
            err.message ||
            "Nie udało się utworzyć ankiety.";

          await runtimeLoaderFinish(
            "❌ Tworzenie nieudane"
          );
        } finally {
          clearActionLoading(button);
        }
      }
    );


  el("admin-salary-player")
    ?.addEventListener(
      "change",
      refreshAdminAccountCodeStatus
    );


  el("admin-identity-revoke-all")
    ?.addEventListener(
      "click",
      async event => {
        const button =
          event.currentTarget;

        const select =
          el("admin-salary-player");

        const status =
          el("admin-identity-revoke-status");

        const nick =
          select && select.value
            ? select.value
            : "";

        if (!nick) {
          status.textContent =
            "Wybierz gracza.";
          return;
        }

        if (
          !window.confirm(
            `Wylogować ${nick} ze wszystkich sesji konta?`
          )
        ) {
          return;
        }

        setActionLoading(
          button,
          status,
          "Wylogowywanie sesji..."
        );

        try {
          await fetch(
            BACKEND_URL,
            {
              method:"POST",
              mode:"no-cors",
              headers:{
                "Content-Type":
                  "text/plain;charset=UTF-8"
              },
              body:
                JSON.stringify({
                  action:
                    "accountAdminLogoutAll",
                  sessionToken:
                    playerAccountSessionToken(),
                  nick
                })
            }
          );

          status.textContent =
            `✅ Wylogowano wszystkie sesje konta ${nick}.`;

          // Odświeżamy źródło danych dropdownu i liczbę sesji.
          await loadAccountAdminPermissions();

          await runtimeLoaderFinish(
            "✅ Sesje wylogowane"
          );

        } catch (err) {
          status.textContent =
            err.message ||
            "Nie udało się wylogować sesji.";

          await runtimeLoaderFinish(
            "❌ Wylogowanie nieudane"
          );
        } finally {
          clearActionLoading(button);
        }
      }
    );


  el("admin-salary-generate-code")
    ?.addEventListener(
      "click",
      async event => {
        const button = event.currentTarget;
        const select = el("admin-salary-player");
        const resultBox = el("admin-salary-code-result");
        const nick = select && select.value ? select.value : "";

        if (!nick) {
          resultBox.hidden = false;
          resultBox.textContent = "Brak gracza do wygenerowania kodu.";
          return;
        }

        button.disabled = true;
        button.textContent = "⏳ Generowanie...";

        try {
          const result = await jsonp("adminGenerateSalaryClaimCode",{
            token:adminToken(),
            nick
          });

          if (!result || !result.ok) {
            throw new Error(result && result.error ? result.error : "Nie udało się wygenerować kodu.");
          }

          resultBox.hidden = false;
          resultBox.innerHTML = `
            Kod dla: <b>${escapeHtml(result.nick)}</b>
            <strong>${escapeHtml(result.code)}</strong>
            <span class="muted">Jednorazowy · ważny 24 godziny</span>
          `;
        } catch (err) {
          resultBox.hidden = false;
          resultBox.textContent = err.message || "Nie udało się wygenerować kodu.";
        } finally {
          button.disabled = false;
          button.innerHTML = "🔑 Generuj kod";
        }
      }
    );


  el("admin-logout")
    ?.addEventListener(
      "click",
      () => {
        const panel =
          el("admin-view");

        if (panel) {
          panel.hidden = true;
        }

        showToolView(
          "account-view"
        );
      }
    );

  const companyIncomeInput =
    el("admin-company-income");

  if (companyIncomeInput) {
    companyIncomeInput.value =
      "25000";
  }

  // v20.8 — osobne logowanie Admina nie jest już używane.
}
  // ============================================================
  // NAWIGACJA MODUŁOWA
  // ============================================================

  function showToolView(viewId,moduleName) {
    document.querySelectorAll(".view").forEach(view=>{
      view.hidden = view.id !== viewId;
    });

    document.querySelectorAll("[data-module]").forEach(button=>{
      button.classList.toggle("active",button.dataset.module===moduleName);
    });

    const distilleryTabs=el("distillery-tabs");
    const gangTabs=el("gang-tabs");
    distilleryTabs.hidden = moduleName !== "distillery";
    gangTabs.hidden = moduleName !== "gang" || !playerAccountSessionToken() || viewId === "gang-gate-view";

    document.querySelectorAll("[data-subtab]").forEach(button=>{
      button.classList.toggle("active",button.dataset.subtab===viewId);
    });
  }

  function validateGangSessionInBackground() {
    const now =
      Date.now();

    // Nie sprawdzaj sesji przy każdym kliknięciu.
    // Jedno sprawdzenie maksymalnie raz na 60 sekund.
    if (
      now -
      gangSessionValidationAt <
      60000
    ) {
      return;
    }

    gangSessionValidationAt =
      now;

    playerAccountStatus()
      .then(account => {
        if (account) return;

        // Jeśli sesja faktycznie wygasła / została cofnięta,
        // backend potwierdzi to w tle i dopiero wtedy wracamy do bramki.
        el("gang-tabs").hidden =
          true;

        showToolView(
          "gang-gate-view",
          "gang"
        );
      })
      .catch(() => {
        // Błąd sieci nie blokuje lokalnej nawigacji.
      });
  }


  let runtimeLoaderTimer = null;
  let runtimeLoaderFunnyTimer = null;
  let runtimeLoaderProgress = 0;
  let runtimeLoaderActive = false;

  function runtimeLoaderStart(
    text="⏳ Odświeżam dane...",
    funnyTexts=[
      "🥫 Serwer szuka ostatniej puszki...",
      "🍺 Ktoś zalał logi, już wycieram...",
      "🧹 Odkurzam dane spod serwera...",
      "🥴 Jeszcze chwila, backend ma kaca..."
    ]
  ) {
    const box=el("app-preload");
    const bar=el("app-preload-bar");
    const percent=el("app-preload-percent");

    if(!box||!bar||!percent)return;

    clearInterval(runtimeLoaderTimer);
    clearTimeout(runtimeLoaderFunnyTimer);

    runtimeLoaderActive=true;
    runtimeLoaderProgress=8;

    box.hidden=false;
    box.classList.remove("done","hiding","finishing");

    appBootSetText(text);
    bar.style.width="8%";
    percent.textContent="8%";

    const startedAt=Date.now();

    runtimeLoaderTimer=setInterval(()=>{
      if(!runtimeLoaderActive)return;

      const elapsed =
        Date.now() - startedAt;

      // v20.21 — wolniejszy, bardziej naturalny postęp.
      // Pasek nie dobija szybko do 90% przy dłuższych operacjach.
      const target =
        Math.min(
          92,
          8 +
          84 *
          (
            1 -
            Math.exp(
              -elapsed / 7000
            )
          )
        );

      runtimeLoaderProgress +=
        Math.max(
          .22,
          (
            target -
            runtimeLoaderProgress
          ) * .105
        );

      runtimeLoaderProgress =
        Math.min(
          runtimeLoaderProgress,
          92
        );

      bar.style.width=`${runtimeLoaderProgress}%`;
      percent.textContent=`${Math.round(runtimeLoaderProgress)}%`;
    },90);

    runtimeLoaderFunnyTimer=setTimeout(()=>{
      if(!runtimeLoaderActive)return;

      const texts=Array.isArray(funnyTexts)
        ? funnyTexts.filter(Boolean)
        : [String(funnyTexts||"")].filter(Boolean);

      if(!texts.length)return;

      let index=0;
      appBootSetText(texts[index++]);

      const rotation=setInterval(()=>{
        if(!runtimeLoaderActive){
          clearInterval(rotation);
          return;
        }

        appBootSetText(
          texts[index%texts.length]
        );
        index+=1;
      },1200);
    },2000);
  }

  async function runtimeLoaderFinish(
    finalText="✅ Gotowe"
  ) {
    if (!runtimeLoaderActive) {
      return;
    }

    runtimeLoaderActive = false;

    clearInterval(runtimeLoaderTimer);
    clearTimeout(runtimeLoaderFunnyTimer);

    const box = el("app-preload");
    const bar = el("app-preload-bar");
    const percent = el("app-preload-percent");

    if (!box || !bar || !percent) {
      return;
    }

    appBootSetText(finalText);
    box.classList.add("finishing");

    const from =
      Math.max(
        0,
        Math.min(
          99,
          runtimeLoaderProgress
        )
      );

    const duration = 260;
    const started = performance.now();

    await new Promise(resolve => {
      const tick = now => {
        const t =
          Math.min(
            1,
            (now - started) / duration
          );

        const eased =
          1 - Math.pow(1 - t, 3);

        const value =
          from + (100 - from) * eased;

        bar.style.width = `${value}%`;
        percent.textContent =
          `${Math.round(value)}%`;

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

    bar.style.width = "100%";
    percent.textContent = "100%";
    box.classList.remove("finishing");
    box.classList.add("done");

    await new Promise(
      resolve => setTimeout(resolve, 420)
    );

    box.classList.add("hiding");

    await new Promise(
      resolve => setTimeout(resolve, 280)
    );

    box.hidden = true;
    box.classList.remove(
      "done",
      "hiding",
      "finishing"
    );
  }

  async function withRuntimeLoader(
    promiseFactory,
    text,
    funnyText
  ) {
    runtimeLoaderStart(
      text,
      funnyText
    );

    try {
      return await promiseFactory();
    } finally {
      await runtimeLoaderFinish();
    }
  }


  function adminLoaderTexts(kind){
    const sets={
      paymentsPreview:["🔍 Sprawdzam dane wpłat...",[
        "🧾 Księgowy porównuje cyferki po raz trzeci...",
        "🪙 Liczę drobniaki spod biurka...",
        "🥫 Raport zaplątał się między puszkami...",
        "🍺 Kalkulator prosi o chwilę przerwy..."
      ]],
      paymentsImport:["✅ Wprowadzam dane wpłat...",[
        "💰 Księgowy przelicza wszystko jeszcze raz...",
        "🧮 Kalkulator dostał zadyszki...",
        "🥫 Wkładam wpłaty do właściwych przegródek...",
        "🍺 Ostatnia kontrola i lecimy dalej..."
      ]],
      playerAdd:["➕ Dodaję gracza...",[
        "👤 Szukam wolnego miejsca przy stole...",
        "🪑 Dosuwam krzesło dla nowego gracza...",
        "🥫 Sprawdzam, czy starczy puszek na powitanie...",
        "🍺 Kadry właśnie znalazły długopis..."
      ]],
      playerDelete:["🗑️ Usuwam gracza...",[
        "📦 Pakuję jego rzeczy do kartonu...",
        "🧹 Sprzątam po nim sesje i uprawnienia...",
        "🥫 Sprawdzam, czy nie zostawił puszek w szafce...",
        "🍺 Kadry wykreślają ostatnią rubrykę..."
      ]],
      poll:["📊 Aktualizuję ankietę...",[
        ['🗳️ Liczę głosy, nawet te oddane po pijaku...','📋 Komisja sprawdza ostatnią kartkę...','🥫 Głosy schowały się między puszkami...','🍺 Ankieta zaraz odzyska pion...'],
        "📋 Ankieta szuka pieczątki...",
        "🥫 Głosy rozsypały się między puszkami...",
        "🍺 Komisja wyborcza robi krótką przerwę..."
      ]],
      announcement:["📢 Aktualizuję ogłoszenia...",[
        "📯 Goniec chyba zasnął po drodze...",
        "📌 Szukam pinezki do ważnego ogłoszenia...",
        "🥫 Ogłoszenie utknęło pod stertą puszek...",
        "🍺 Tablica ogłoszeń właśnie trzeźwieje..."
      ]],
      goal:["🎯 Aktualizuję cel gangu...",[
        "🎯 Cel się przesunął, już go łapię...",
        "📏 Mierzę postęp jeszcze raz...",
        ['🥫 Zbieram puszki na realizację celu...','🎯 Cel ucieka, ale już go doganiam...','📏 Mierzę postęp linijką z magazynu...','🍺 Motywacja jeszcze się ładuje...'],
        "🍺 Motywacja przyszła, ale trochę chwiejnym krokiem..."
      ]],
      reservation:["🧪 Aktualizuję rezerwacje...",[
        "🧪 Destylator przestawia karteczki na beczkach...",
        "🥫 Rezerwacja zgubiła się między puszkami...",
        "📋 Sprawdzam, kto zaklepał którą receptę...",
        "🍺 Laborant wraca za moment..."
      ]],
      company:["🏢 Aktualizuję Spółkę...",[
        ['💸 Księgowy zgubił kalkulator, już szukam...','🧮 Kalkulator chyba poszedł na przerwę...','🥫 Liczę fundusz na puszkach...','🍺 Zarząd obiecuje, że to już chwila...'],
        "🧾 Udziały układają się w równy stos...",
        "🥫 Fundusz liczy puszki po raz ostatni...",
        "🍺 Zarząd ma właśnie bardzo krótkie zebranie..."
      ]],
      sessions:["📱 Aktualizuję sesje gracza...",[
        "📱 Szukam telefonu, który jeszcze się nie wylogował...",
        "🔑 Zbieram porzucone klucze do sesji...",
        "🥫 Jedna sesja schowała się za puszką...",
        "🍺 Ostatnie urządzenie właśnie dostało wypowiedzenie..."
      ]]
    };

    const set=sets[kind]||[
      "⏳ Wykonuję operację...",
      [
        "🥫 Serwer szuka ostatniej puszki...",
        "🍺 Backend robi małą przerwę...",
        "🧹 Odkurzam dane...",
        "🥴 Jeszcze chwila..."
      ]
    ];

    runtimeLoaderStart(
      set[0],
      set[1]
    );
  }


  function openGangModule(
    target="payments-view"
  ) {
    if (
      !playerAccountSessionToken()
    ) {
      el("gang-tabs").hidden = true;

      showToolView(
        "gang-gate-view",
        "gang"
      );

      return;
    }

    el("gang-tabs").hidden = false;

    showToolView(
      target,
      "gang"
    );

    if (latestGangPayload) {
      renderGangPayload(
        latestGangPayload
      );
    }

    const dataIsStale =
      !latestGangPayload ||
      (
        Date.now() -
        latestGangPayloadAt >
        30000
      );

    const requests = [];

    if (dataIsStale) {
      requests.push(
        loadPayments({
          background:true
        })
      );
    }

    // Ankiety mają osobny endpoint.
    // Jeśli użytkownik wchodzi w Ankiety, ten request również
    // jest objęty wspólnym paskiem.
    if (
      target ===
      "polls-view"
    ) {
      requests.push(
        loadGangPolls()
      );
    }

    if (requests.length) {
      const labels = {
        "payments-view":
          [
            "💰 Odświeżam wpłaty...",
            "🪙 Liczę drobniaki pod kanapą serwera..."
          ],
        "company-view":
          [
            "🏢 Odświeżam Spółkę...",
            ['💸 Księgowy zgubił kalkulator, już szukam...','🧮 Kalkulator chyba poszedł na przerwę...','🥫 Liczę fundusz na puszkach...','🍺 Zarząd obiecuje, że to już chwila...']
          ],
        "polls-view":
          [
            "📊 Odświeżam ankiety...",
            ['🗳️ Liczę głosy, nawet te oddane po pijaku...','📋 Komisja sprawdza ostatnią kartkę...','🥫 Głosy schowały się między puszkami...','🍺 Ankieta zaraz odzyska pion...']
          ],
        "goals-view":
          [
            "🎯 Odświeżam cele gangu...",
            ['🥫 Zbieram puszki na realizację celu...','🎯 Cel ucieka, ale już go doganiam...','📏 Mierzę postęp linijką z magazynu...','🍺 Motywacja jeszcze się ładuje...']
          ],
        "announcements-view":
          [
            "📢 Odświeżam ogłoszenia...",
            ['📯 Wołam gońca, chyba zasnął po drodze...','📌 Szukam pinezki do ogłoszenia...','🥫 Kartka utknęła pod puszką...','🍺 Goniec twierdzi, że był tylko na chwilę...']
          ]
      };

      const pair =
        labels[target] ||
        [
          "⏳ Odświeżam dane Gangu...",
          "🥫 Serwer szuka ostatniej puszki..."
        ];

      withRuntimeLoader(
        () => Promise.allSettled(
          requests
        ),
        pair[0],
        pair[1]
      );
    }

    validateGangSessionInBackground();
  }

  document.querySelectorAll("[data-module]").forEach(button=>{
    button.addEventListener("click",()=>{
      const moduleName=button.dataset.module;
      if (moduleName === "distillery") showToolView("optimizer-view","distillery");
      else if (moduleName === "gang") openGangModule("payments-view");
      else if (moduleName === "map") showToolView("map-view","map");
      else if (moduleName === "account") {
        showToolView("account-view","account");

        const token =
          playerAccountSessionToken();

        const accountNeedsRequest =
          Boolean(
            token &&
            (
              !cachedAccountStatus ||
              cachedAccountStatusToken !== token ||
              Date.now() - cachedAccountStatusAt >= 60000
            )
          );

        if (accountNeedsRequest) {
          withRuntimeLoader(
            () => renderAccountView(),
            "👤 Odświeżam konto...",
            ['🔑 Szukam kluczy do konta, ktoś je znowu przełożył...','📱 Sprawdzam, czy telefon nie schował sesji...','🥫 Token wpadł między puszki...','🍺 Konto zaraz się otrząśnie...']
          );
        } else {
          renderAccountView();
        }
      }
    });
  });

  document.querySelectorAll("[data-subtab]").forEach(button=>{
    button.addEventListener("click",()=>{
      const viewId=button.dataset.subtab;
      const group=button.dataset.group;
      if (group === "gang") { openGangModule(viewId); return; }
      showToolView(viewId,"distillery");
    });
  });

  el("gang-go-account")?.addEventListener("click",()=>{
    showToolView("account-view","account");

    const token =
      playerAccountSessionToken();

    const accountNeedsRequest =
      Boolean(
        token &&
        (
          !cachedAccountStatus ||
          cachedAccountStatusToken !== token ||
          Date.now() - cachedAccountStatusAt >= 60000
        )
      );

    if (accountNeedsRequest) {
      withRuntimeLoader(
        () => renderAccountView(),
        "👤 Odświeżam konto...",
        ['🔑 Szukam kluczy do konta, ktoś je znowu przełożył...','📱 Sprawdzam, czy telefon nie schował sesji...','🥫 Token wpadł między puszki...','🍺 Konto zaraz się otrząśnie...']
      );
    } else {
      renderAccountView();
    }
  });
// ============================================================
  // GLOBALNY PRELOAD / PASEK POSTĘPU
  // ============================================================

  let appBootProgress = 5;
  let appBootTarget = 5;
  let appBootTimer = null;
  let appBootFinished = false;

  function appBootSetText(text) {
    const label =
      el("app-preload-text");

    if (label) {
      label.textContent = text;
    }
  }

  function appBootRender() {
    const box =
      el("app-preload");

    const bar =
      el("app-preload-bar");

    const percent =
      el("app-preload-percent");

    if (!box || !bar || !percent) {
      return;
    }

    box.hidden = false;
    bar.style.width =
      `${Math.round(appBootProgress)}%`;

    percent.textContent =
      `${Math.round(appBootProgress)}%`;
  }

  function appBootReach(value,text) {
    appBootTarget =
      Math.max(
        appBootTarget,
        Math.min(
          94,
          Number(value) || 0
        )
      );

    if (text) {
      appBootSetText(text);
    }

    appBootRender();
  }

  function appBootStart() {
    const box =
      el("app-preload");

    if (!box) return;

    box.hidden = false;
    box.classList.remove(
      "done",
      "hiding"
    );

    appBootProgress = 5;
    appBootTarget = 14;
    appBootFinished = false;

    appBootSetText(
      "⏳ Przygotowuję konto..."
    );

    appBootRender();

    clearInterval(
      appBootTimer
    );

    const startedAt =
      Date.now();

    appBootTimer =
      setInterval(
        () => {
          if (appBootFinished) {
            return;
          }

          const elapsed =
            Date.now() -
            startedAt;

          // Symulowany wzrost przez ok. 5 s.
          // Nigdy nie dobija sam do 100%.
          const simulated =
            Math.min(
              90,
              5 +
              (
                elapsed /
                6500
              ) *
              83
            );

          appBootTarget =
            Math.max(
              appBootTarget,
              simulated
            );

          if (
            appBootProgress <
            appBootTarget
          ) {
            const distance =
              appBootTarget -
              appBootProgress;

            appBootProgress +=
              Math.max(
                .35,
                distance * .12
              );

            appBootProgress =
              Math.min(
                appBootProgress,
                94
              );

            appBootRender();
          }
        },
        120
      );
  }

  function appBootDone() {
    appBootFinishSmooth();
  }


  async function appBootFinishSmooth() {
    if (appBootFinished) {
      return;
    }

    appBootFinished = true;

    clearInterval(
      appBootTimer
    );

    const box =
      el("app-preload");

    const bar =
      el("app-preload-bar");

    const percent =
      el("app-preload-percent");

    if (
      !box ||
      !bar ||
      !percent
    ) {
      return;
    }

    // Najpierw komunikat końcowy, potem krótki płynny dojazd do 100%.
    appBootSetText(
      "✅ Dane gotowe"
    );

    box.classList.add(
      "finishing"
    );

    const from =
      Math.max(
        0,
        Math.min(
          99,
          appBootProgress
        )
      );

    const duration =
      320;

    const started =
      performance.now();

    await new Promise(
      resolve => {
        const tick =
          now => {
            const t =
              Math.min(
                1,
                (
                  now -
                  started
                ) /
                duration
              );

            const eased =
              1 -
              Math.pow(
                1 - t,
                3
              );

            appBootProgress =
              from +
              (
                100 -
                from
              ) *
              eased;

            bar.style.width =
              `${appBootProgress}%`;

            percent.textContent =
              `${Math.round(appBootProgress)}%`;

            if (t < 1) {
              requestAnimationFrame(
                tick
              );
            } else {
              resolve();
            }
          };

        requestAnimationFrame(
          tick
        );
      }
    );

    appBootProgress = 100;
    appBootTarget = 100;

    bar.style.width =
      "100%";

    percent.textContent =
      "100%";

    box.classList.remove(
      "finishing"
    );

    box.classList.add(
      "done"
    );

    setTimeout(
      () => {
        box.classList.add(
          "hiding"
        );

        setTimeout(
          () => {
            box.hidden = true;

            box.classList.remove(
              "done",
              "hiding",
              "finishing"
            );
          },
          280
        );
      },
      1100
    );
  }


  async function preloadApplicationData() {
    if (
      !playerAccountSessionToken()
    ) {
      appBootSetText(
        "✅ Strona gotowa"
      );

      await appBootFinishSmooth();
      return;
    }

    let account = null;
    let finished = 0;
    let expected = 2;

    const visualSteps = [
      {
        after:0,
        target:8,
        text:"🔐 Sprawdzam konto i sesję..."
      },
      {
        after:550,
        target:16,
        text:"🔑 Szukam kluczy do gangu..."
      },
      {
        after:650,
        target:26,
        text:"🔥 Rozgrzewam serwer..."
      },
      {
        after:800,
        target:38,
        text:"💰 Liczę drobniaki w kasie gangu..."
      },
      {
        after:950,
        target:50,
        text:"🥫 Zbieram puszki z serwera..."
      },
      {
        after:1050,
        target:62,
        text:"🧪 Szukam zagubionych recept..."
      },
      {
        after:1100,
        target:72,
        text:"📊 Przeglądam ankiety..."
      },
      {
        after:1150,
        target:82,
        text:"🛠️ Odkurzam panel Admina..."
      },
      {
        after:1200,
        target:88,
        text:"🍺 Popijam coś mocniejszego, serwer jeszcze pracuje..."
      },
      {
        after:1250,
        target:92,
        text:"🥴 Jeszcze chwila, serwer też ma kaca..."
      }
    ];

    let visualCancelled = false;

    const runVisualSteps =
      async () => {
        for (
          const step of
          visualSteps
        ) {
          if (
            visualCancelled ||
            appBootFinished
          ) {
            return;
          }

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                step.after
              )
          );

          if (
            visualCancelled ||
            appBootFinished
          ) {
            return;
          }

          appBootReach(
            step.target,
            step.text
          );
        }
      };

    const visualPromise =
      runVisualSteps();

    const finishOne =
      (label) => {
        finished += 1;

        // Realny postęp może podbić pasek,
        // ale nie wymusza pokazania wszystkich etapów.
        const target =
          34 +
          (
            finished /
            expected
          ) *
          54;

        appBootReach(
          Math.min(
            92,
            target
          ),
          label
        );
      };

    try {
      account =
        await playerAccountStatus();

      // Nick konta jest już w cache. Odświeżamy lokalnie
      // oznaczenia "Twoja rezerwacja" bez dodatkowego requestu.
      if (account) {
        renderAll();
      }

      if (
        account &&
        account.admin
      ) {
        expected = 3;
      }

      const tasks = [
        loadPayments({
          background:true
        })
          .then(
            () => finishOne(
              "💰 Wpłaty i Spółka gotowe"
            )
          )
          .catch(
            err => {
              console.warn(
                "[MenelWars Tools] Gang preload:",
                err
              );

              finishOne(
                "💰 Wpłaty sprawdzone"
              );
            }
          ),

        loadGangPolls()
          .then(
            () => finishOne(
              "📊 Ankiety sprawdzone"
            )
          )
          .catch(
            err => {
              console.warn(
                "[MenelWars Tools] Poll preload:",
                err
              );

              finishOne(
                "📊 Ankiety sprawdzone"
              );
            }
          )
      ];

      if (
        account &&
        account.admin
      ) {
        tasks.push(
          warmAdminData({
            silent:true
          })
            .then(
              () => finishOne(
                "🛠 Panel Admina gotowy"
              )
            )
            .catch(
              err => {
                console.warn(
                  "[MenelWars Tools] Admin preload:",
                  err
                );

                finishOne(
                  "🛠 Panel Admina sprawdzony"
                );
              }
            )
        );
      }

      await Promise.allSettled(
        tasks
      );

    } catch (err) {
      console.warn(
        "[MenelWars Tools] Preload:",
        err
      );
    }

    visualCancelled = true;

    // Nie czekamy na dokończenie "historii" tekstów.
    // Dane są gotowe -> płynne domknięcie do 100%.
    await appBootFinishSmooth();

    // Sprzątamy asynchroniczny narrator, jeśli jeszcze kończy timeout.
    Promise.resolve(
      visualPromise
    ).catch(() => {});
  }


// ============================================================
  // START
  // ============================================================

renderMap();
setupSubmissionForm();
setupPayments();
renderAll();
fetchApprovedRecipes();
setupAdmin();
showToolView("optimizer-view", "distillery");
if (el("admin-view")) el("admin-view").hidden = true;

appBootStart();
preloadApplicationData();


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
