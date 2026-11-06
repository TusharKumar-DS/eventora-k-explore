/* Eventora — main application script (vanilla JS, no dependencies). */
(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const STORE_KEY = "eventora-registrations";
  const THEME_KEY = "eventora-theme";
  document.documentElement.classList.add("js");

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const fmtPrice = (p) => (p === 0 ? "Free" : "₹" + p.toLocaleString("en-IN"));
  const byId = (id) => EVENTS.find((e) => e.id === id);
  const startsAt = (e) => new Date(e.date).getTime();
  const isPast = (e) => startsAt(e) <= Date.now();
  const upcoming = () => EVENTS.filter((e) => !isPast(e));

  /* Safe localStorage wrappers. Storage can be blocked (private mode) or hold
     corrupted data, so every read is validated and falls back to memory. */
  let memory = [];
  const store = {
    read() {
      try {
        const v = JSON.parse(localStorage.getItem(STORE_KEY));
        if (v === null) return memory;
        if (!Array.isArray(v)) return [];
        return v.filter((r) => r && typeof r === "object" && typeof r.eventId === "string" && Number.isFinite(r.tickets));
      } catch (e) { return memory; }
    },
    write(list) {
      memory = list;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
    }
  };

  const seatsLeft = (e) =>
    Math.max(0, e.seats - store.read().filter((r) => r.eventId === e.id).reduce((n, r) => n + r.tickets, 0));

  /* ---------- State ---------- */
  const state = { query: "", category: "All", sort: "date", showPast: false, openId: null };

  /* ---------- Theme ---------- */
  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-btn"), navLinks = $("#nav-links");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  // Keep the active navigation item in sync with the section in view.
  if ("IntersectionObserver" in window) {
    const navTargets = $$("#nav-links a[href^='#']").map((a) => ({ link: a, section: $(a.getAttribute("href")) })).filter((x) => x.section);
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navTargets.forEach(({ link, section }) => {
          if (section === entry.target) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    navTargets.forEach(({ section }) => navObserver.observe(section));
  }

  // Image fallback: keep cards visually intentional if an asset cannot load.
  document.addEventListener("error", (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";
    img.closest(".card-media, .m-hero, .hero-visual")?.classList.add("image-fallback");
    img.alt = "Event image unavailable";
  }, true);

  /* ---------- Countdown manager ----------
     ONE shared ticker drives every countdown on the page. Each countdown is
     keyed by its DOM element, so registering a new target for an element
     replaces the old one (no stale timers) and clearing an element removes it.
     The ticker stops by itself when nothing is left to count down. */
  const Countdown = (() => {
    const entries = new Map(); // element -> { target, onExpire }
    let timer = null;
    const unit = (n, l) => `<div class="unit"><span class="num">${String(n).padStart(2, "0")}</span><span class="lbl">${l}</span></div>`;

    function tick() {
      const t = Date.now();
      entries.forEach((en, el) => {
        if (!el.isConnected) { entries.delete(el); return; }
        const diff = en.target - t;
        if (diff <= 0) {
          entries.delete(el);
          el.innerHTML = `<div class="done">This event has started</div>`;
          if (en.onExpire) en.onExpire();
        } else {
          const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24,
                m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
          el.innerHTML = unit(d, "Days") + unit(h, "Hours") + unit(m, "Mins") + unit(s, "Secs");
        }
      });
      if (!entries.size && timer) { clearInterval(timer); timer = null; }
    }

    return {
      set(el, iso, onExpire) {
        entries.set(el, { target: new Date(iso).getTime(), onExpire });
        tick();
        if (!timer && entries.size) timer = setInterval(tick, 1000);
      },
      clear(el) { entries.delete(el); }
    };
  })();

  /* ---------- Cards ---------- */
  function seatInfo(e) {
    if (isPast(e)) return { text: "Ended", low: false };
    const left = seatsLeft(e);
    return { text: left === 0 ? "Sold out" : left + " seats left", low: left <= 20 };
  }
  function ctaLabel(e) {
    return isPast(e) || seatsLeft(e) === 0 ? "View details" : "Details & register";
  }

  function cardHTML(e, variant = "") {
    const past = isPast(e);
    const s = seatInfo(e);
    return `
      <article class="card reveal ${variant} ${past ? "is-ended" : ""}">
        <div class="card-media">
          <img src="${e.img}" alt="${e.title} event photograph" loading="lazy" width="800" height="500">
          <span class="tag">${e.category}</span>
          <span class="price-tag">${past ? "Ended" : fmtPrice(e.price)}</span>
        </div>
        <div class="card-body">
          <span class="card-date">${fmtDate(e.date)} · ${fmtTime(e.date)}</span>
          <h3>${e.title}</h3>
          <span class="card-venue">📍 ${e.venue}, ${e.city}</span>
          <p class="card-desc">${e.short}</p>
          <div class="card-foot">
            <span class="seats ${s.low ? "low" : ""}" data-seats="${e.id}">${s.text}</span>
            <button class="btn btn-primary btn-sm" data-open="${e.id}" data-cta="${e.id}" aria-label="${ctaLabel(e)}: ${e.title}">${ctaLabel(e)}</button>
          </div>
        </div>
      </article>`;
  }

  /* Update seat counts and button labels in place (no card rebuild). */
  function updateSeats() {
    $$("[data-seats]").forEach((el) => {
      const e = byId(el.dataset.seats);
      if (!e) return;
      const s = seatInfo(e);
      el.textContent = s.text;
      el.classList.toggle("low", s.low);
    });
    $$("[data-cta]").forEach((btn) => {
      const e = byId(btn.dataset.cta);
      if (!e) return;
      btn.textContent = ctaLabel(e);
      btn.setAttribute("aria-label", `${ctaLabel(e)}: ${e.title}`);
    });
  }

  function observeReveals() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Featured: one lead card + compact supporting cards ---------- */
  const featuredList = () => EVENTS.filter((e) => e.featured && !isPast(e)).slice(0, 4);

  function renderFeatured() {
    const list = featuredList();
    $("#featured").hidden = list.length === 0;
    const grid = $("#featured-grid");
    grid.className = "feature-grid n" + list.length;
    grid.innerHTML = list.map((e, i) => cardHTML(e, i === 0 ? "card-lead" : "card-compact")).join("");
    observeReveals();
  }

  /* ---------- Browse: search + filter + sort ---------- */
  const categories = ["All", ...Array.from(new Set(EVENTS.map((e) => e.category)))];

  function renderChips() {
    $("#chips").innerHTML = categories
      .map((c) => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === state.category}">${c}</button>`)
      .join("");
  }

  const hasFilter = () => state.query.trim() !== "" || state.category !== "All";

  function filtered() {
    const q = state.query.trim().toLowerCase();
    // With no search/filter active, events already shown in "Featured" are not repeated here.
    const inFeatured = new Set(hasFilter() ? [] : featuredList().map((e) => e.id));
    const list = EVENTS.filter((e) => {
      if (isPast(e) && !state.showPast) return false;
      if (inFeatured.has(e.id)) return false;
      const inCat = state.category === "All" || e.category === state.category;
      const hay = `${e.title} ${e.venue} ${e.city} ${e.category} ${e.short} ${e.description}`.toLowerCase();
      return inCat && (!q || q.split(/\s+/).every((w) => hay.includes(w)));
    });
    const byDate = (a, b) => startsAt(a) - startsAt(b);
    const sorters = {
      // upcoming first (soonest to latest), then ended events (most recent first)
      date: (a, b) => isPast(a) !== isPast(b) ? (isPast(a) ? 1 : -1) : isPast(a) ? startsAt(b) - startsAt(a) : byDate(a, b),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.title.localeCompare(b.title)
    };
    return list.sort(sorters[state.sort]);
  }

  function renderEvents() {
    const list = filtered();
    $("#events-grid").innerHTML = list.map((e) => cardHTML(e)).join("");

    const none = list.length === 0;
    $("#empty").hidden = !none;
    if (none) {
      const noUpcoming = upcoming().length === 0;
      $("#empty-title").textContent = noUpcoming && !state.showPast ? "No upcoming events right now" : "No events found";
      $("#empty-text").textContent = noUpcoming && !state.showPast
        ? "New events will be announced soon. You can still look at past events."
        : "Try a different keyword or clear the filters.";
      $("#clear-filters").hidden = !hasFilter();
      $("#empty-past").hidden = !(noUpcoming && !state.showPast);
    }

    const n = list.length, s = n === 1 ? "" : "s";
    $("#result-count").textContent = hasFilter() || featuredList().length === 0
      ? `${n} event${s} found`
      : `${n} more event${s} beyond the featured picks. Search or pick a category to include featured events.`;
    observeReveals();
  }

  let debounce;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.query = e.target.value; renderEvents(); }, 150);
  });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderEvents(); });
  $("#show-past").addEventListener("change", (e) => { state.showPast = e.target.checked; renderEvents(); });
  $("#empty-past").addEventListener("click", () => { state.showPast = true; $("#show-past").checked = true; renderEvents(); });
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    state.category = b.dataset.cat;
    renderChips();
    renderEvents();
  });

  document.querySelectorAll("[data-footer-cat]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.footerCat;
      state.query = "";
      $("#search").value = "";
      state.showPast = false;
      $("#show-past").checked = false;
      renderChips();
      renderEvents();
      $("#events").scrollIntoView({ behavior: "smooth" });
    });
  });
  $("#clear-filters").addEventListener("click", () => {
    state.query = ""; state.category = "All"; state.sort = "date";
    $("#search").value = ""; $("#sort").value = "date";
    renderChips(); renderEvents();
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (b) openModal(b.dataset.open);
  });

  /* ---------- Hero "happening next" ---------- */
  function renderNext() {
    const next = upcoming().sort((a, b) => startsAt(a) - startsAt(b))[0];
    const cd = $("#next-countdown");
    if (!next) {
      Countdown.clear(cd);
      cd.innerHTML = "";
      $("#next-title").textContent = "No upcoming events";
      $("#next-meta").textContent = "New events will be announced soon.";
      $("#next-btn").hidden = true;
      return;
    }
    $("#next-btn").hidden = false;
    $("#next-title").textContent = next.title;
    $("#next-meta").textContent = `${fmtDate(next.date)} · ${next.venue}`;
    $("#next-btn").onclick = () => openModal(next.id);
    Countdown.set(cd, next.date, refreshAll); // when it starts, the whole page moves on to the next event
  }

  function renderStats() {
    const up = upcoming();
    $("#stat-events").textContent = up.length;
    $("#stat-cats").textContent = new Set(up.map((e) => e.category)).size;
    $("#stat-free").textContent = up.filter((e) => e.price === 0).length;
  }

  /* Re-render everything that depends on "now" (used when an event starts). */
  function refreshAll() {
    renderStats(); renderNext(); renderFeatured(); renderEvents(); renderRegistrations();
  }

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  const form = $("#reg-form");
  const mCountdown = $("#m-countdown");

  function modalSeats(e) {
    const past = isPast(e);
    $("#m-seats-label").textContent = past ? "🏁 Status" : "💺 Seats left";
    $("#m-seats").textContent = past ? "Event ended" : seatsLeft(e) === 0 ? "Sold out" : `${seatsLeft(e)} of ${e.seats}`;
  }

  /* Show the form for upcoming events, or a "registration closed" note for ended ones. */
  function applyModalMode(e) {
    const past = isPast(e);
    $("#form-view").hidden = past;
    $("#closed-view").hidden = !past;
    $("#success-view").hidden = true;
    modalSeats(e);
    if (past) {
      Countdown.clear(mCountdown);
      mCountdown.innerHTML = `<div class="done">This event has ended</div>`;
    } else {
      Countdown.set(mCountdown, e.date, () => {
        refreshAll();
        if (state.openId === e.id && $("#success-view").hidden) applyModalMode(e);
      });
    }
  }

  function openModal(id) {
    const e = byId(id);
    if (!e) return;
    if (modal.open && state.openId === id) return; // already showing this event
    state.openId = id;
    $("#m-img").src = e.img;
    $("#m-img").alt = `${e.title} event photograph`;
    $("#m-cat").textContent = e.category;
    $("#m-title").textContent = e.title;
    $("#m-date").textContent = `${fmtDate(e.date)}, ${fmtTime(e.date)}`;
    $("#m-venue").textContent = `${e.venue}, ${e.city}`;
    $("#m-price").textContent = fmtPrice(e.price);
    $("#m-desc").textContent = e.description;
    $("#m-schedule").innerHTML = e.schedule.map(([t, d]) => `<li><time>${t}</time>${d}</li>`).join("");

    // only upcoming events can be registered for
    const sel = $("#f-event");
    sel.innerHTML = `<option value="">Select an event…</option>` +
      upcoming().sort((a, b) => startsAt(a) - startsAt(b))
        .map((x) => `<option value="${x.id}">${x.title} — ${fmtDate(x.date)}</option>`).join("");
    resetForm();
    if (!isPast(e)) sel.value = id; // set after reset so the chosen event stays selected

    applyModalMode(e);
    if (!modal.open) modal.showModal();
    $(".modal-inner").scrollTop = 0;
    history.replaceState(null, "", "#event=" + id);
  }

  function closeModal() { if (modal.open) modal.close(); }

  modal.addEventListener("close", () => {
    Countdown.clear(mCountdown);
    state.openId = null;
    if (location.hash.startsWith("#event=")) history.replaceState(null, "", location.pathname + location.search);
    updateSeats();          // refresh seat counts in place; cards are NOT rebuilt
    renderRegistrations();
  });
  $("#m-close").addEventListener("click", closeModal);
  $("#success-close").addEventListener("click", closeModal);
  $("#closed-close").addEventListener("click", closeModal);
  $("#success-view-regs").addEventListener("click", closeModal);
  modal.addEventListener("click", (ev) => { if (ev.target === modal) closeModal(); }); // backdrop click

  /* Deep links: open/close the modal when the URL hash changes. */
  function route() {
    const m = location.hash.match(/^#event=([\w-]+)$/);
    if (m) {
      if (byId(m[1]) && !(modal.open && state.openId === m[1])) openModal(m[1]);
    } else if (modal.open) {
      closeModal();
    }
  }
  window.addEventListener("hashchange", route);

  /* ---------- Validation ---------- */
  const normPhone = (v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0091|91|0)(?=\d{10}$)/, "");

  function validEmail(v) {
    if (v.length > 254 || /\s/.test(v)) return false;
    const at = v.lastIndexOf("@");
    if (at < 1) return false;
    const local = v.slice(0, at), domain = v.slice(at + 1);
    if (local.length > 64 || !/^[A-Za-z0-9._%+'-]+$/.test(local)) return false;
    if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
    return /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/.test(domain);
  }

  const rules = {
    name(v) {
      v = v.trim().replace(/\s+/g, " ");
      if (!v) return "Please enter your full name.";
      if (!/^\p{L}[\p{L}\p{M} .'’-]*$/u.test(v)) return "Use letters, spaces, apostrophes, hyphens or full stops only.";
      if ((v.match(/\p{L}/gu) || []).length < 2) return "Name must contain at least 2 letters.";
      if (v.length > 60) return "Name must be 60 characters or fewer.";
      return "";
    },
    email(v) {
      v = v.trim();
      if (!v) return "Please enter your email address.";
      if (!validEmail(v)) return "Enter a valid email, e.g. name@example.com.";
      return "";
    },
    phone(v) {
      const d = normPhone(v);
      if (!v.trim()) return "Please enter your phone number.";
      if (!/^\d+$/.test(d)) return "Phone number can contain digits only.";
      if (d.length !== 10) return "Phone number must be exactly 10 digits.";
      if (!/^[6-9]/.test(d)) return "Mobile numbers start with 6, 7, 8 or 9.";
      return "";
    },
    event(v) {
      if (!v) return "Please select an event.";
      const e = byId(v);
      if (!e) return "Please select a valid event.";
      if (isPast(e)) return "Registration has closed for this event.";
      return "";
    },
    tickets(v) {
      const n = Number(v);
      if (!v) return "Enter the number of tickets.";
      if (!Number.isInteger(n) || n < 1) return "At least 1 ticket is required.";
      if (n > 5) return "You can book up to 5 tickets at a time.";
      const e = byId($("#f-event").value);
      if (e && n > seatsLeft(e)) return seatsLeft(e) === 0 ? "Sorry, this event is sold out." : `Only ${seatsLeft(e)} seats left.`;
      return "";
    },
    terms(_, el) { return el.checked ? "" : "You must accept the terms to continue."; }
  };

  function validateField(el) {
    const msg = rules[el.name](el.value, el);
    $("#e-" + el.name).textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (el.type !== "checkbox") el.classList.toggle("valid", !msg && el.value !== "");
    return !msg;
  }

  function resetForm() {
    form.reset();
    $("#f-tickets").value = 1;
    $$(".err", form).forEach((x) => (x.textContent = ""));
    $$("input, select", form).forEach((x) => { x.removeAttribute("aria-invalid"); x.classList.remove("valid"); });
  }

  // live validation: on blur, and on input once the field has been touched
  $$("input, select", form).forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
      if (el.getAttribute("aria-invalid") === "true" || el.classList.contains("valid") || el.type === "checkbox") validateField(el);
    });
  });
  $("#f-event").addEventListener("change", () => {
    const e = byId($("#f-event").value);
    if (e) modalSeats(e);
    validateField($("#f-tickets"));
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const fields = $$("input, select", form);
    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
      return;
    }

    const e = byId($("#f-event").value);
    const email = $("#f-email").value.trim().toLowerCase();
    const list = store.read();
    if (list.some((r) => r.eventId === e.id && r.email === email)) {
      $("#e-email").textContent = "This email is already registered for this event.";
      $("#f-email").setAttribute("aria-invalid", "true");
      $("#f-email").focus();
      return;
    }

    const reg = {
      ref: "EVT-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10),
      eventId: e.id,
      name: $("#f-name").value.trim().replace(/\s+/g, " "),
      email,
      phone: normPhone($("#f-phone").value),
      tickets: Number($("#f-tickets").value),
      at: new Date().toISOString()
    };
    list.push(reg);
    store.write(list);

    // textContent keeps user input safe from HTML injection
    $("#success-msg").textContent =
      `Thank you, ${reg.name}. ${reg.tickets} ticket${reg.tickets > 1 ? "s" : ""} for "${e.title}" on ${fmtDate(e.date)} ` +
      `${reg.tickets > 1 ? "are" : "is"} confirmed. Your registration is saved in this browser; no email is sent.`;
    $("#success-ref").textContent = reg.ref;
    $("#form-view").hidden = true;
    $("#success-view").hidden = false;
    $("#success-msg").focus();
    modalSeats(e);
    updateSeats();
    updateCount();
  });

  /* ---------- My registrations ---------- */
  function updateCount() {
    const n = store.read().length;
    const b = $("#reg-count");
    b.textContent = n;
    b.hidden = n === 0;
  }

  function renderRegistrations() {
    const list = store.read().slice().reverse().filter((r) => byId(r.eventId));
    const box = $("#reg-list");
    updateCount();
    if (!list.length) {
      box.innerHTML = `<div class="reg-empty">You haven't registered for any events yet. Pick one above to get started.</div>`;
      return;
    }
    box.innerHTML = "";
    list.forEach((r) => {
      const e = byId(r.eventId);
      const past = isPast(e);
      const item = document.createElement("div");
      item.className = "reg-item";
      const info = document.createElement("div");
      const h = document.createElement("h3"); h.textContent = e.title;
      const status = document.createElement("span");
      status.className = "status " + (past ? "ended" : "ok");
      status.textContent = past ? "Event ended" : "Confirmed";
      h.append(" ", status);
      const p = document.createElement("p");
      p.textContent = `${fmtDate(e.date)} · ${r.tickets} ticket${r.tickets > 1 ? "s" : ""} · ${r.name} · Ref ${r.ref}`;
      info.append(h, p);
      const actions = document.createElement("div"); actions.className = "reg-actions";
      const view = document.createElement("button");
      view.className = "btn btn-ghost btn-sm"; view.textContent = "View event"; view.dataset.open = e.id;
      const cancel = document.createElement("button");
      cancel.className = "btn btn-ghost btn-sm"; cancel.textContent = past ? "Remove" : "Cancel";
      cancel.addEventListener("click", () => {
        if (!confirm(`${past ? "Remove" : "Cancel"} your registration for "${e.title}"?`)) return;
        store.write(store.read().filter((x) => x.ref !== r.ref));
        renderRegistrations(); updateSeats();
        toast(past ? "Registration removed" : "Registration cancelled");
      });
      actions.append(view, cancel);
      item.append(info, actions);
      box.append(item);
    });
  }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderStats();
  renderNext();
  renderFeatured();
  renderChips();
  renderEvents();
  renderRegistrations();
  observeReveals();
  route(); // deep link on first load: index.html#event=<id>
})();
