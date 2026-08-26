/**
 * app.js — logika utama tampilan
 */

(() => {
  let DATA = null;
  let currentCategoryId = null;
  let lastTermShown = null;
  let isSpinning = false;

  const el = (sel, root = document) => root.querySelector(sel);
  const elAll = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tabsEl = el("#category-tabs");
  const catNameEl = el("#current-category-name");
  const catDescEl = el("#current-category-desc");
  const catCountEl = el("#current-category-count");
  const readoutEl = el("#readout-term");
  const readoutDefEl = el("#readout-definition");
  const dialEl = el("#benchmark-dial");
  const spinBtn = el("#spin-btn");
  const listEl = el("#term-list");
  const searchInput = el("#search-input");
  const emptyStateEl = el("#empty-state");

  function init() {
    DATA = GeodesiStorage.getMergedData();
    renderDialTicks();
    renderTabs();
    const first = DATA.categories[0];
    if (first) selectCategory(first.id);
    bindGlobalEvents();
  }

  function renderDialTicks() {
    const wrap = el("#dial-ticks");
    const count = 24;
    for (let i = 0; i < count; i++) {
      const tick = document.createElement("span");
      tick.style.transform = `rotate(${(360 / count) * i}deg)`;
      wrap.appendChild(tick);
    }
  }

  function refreshData() {
    DATA = GeodesiStorage.getMergedData();
    renderTabs();
    if (!DATA.categories.find((c) => c.id === currentCategoryId)) {
      currentCategoryId = DATA.categories[0] ? DATA.categories[0].id : null;
    }
    if (currentCategoryId) selectCategory(currentCategoryId);
  }

  function getCurrentCategory() {
    return DATA.categories.find((c) => c.id === currentCategoryId);
  }

  // ---------------------------------------------------------------
  // TABS (bagian / kategori)
  // ---------------------------------------------------------------
  function renderTabs() {
    tabsEl.innerHTML = "";
    DATA.categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "tab" + (cat.id === currentCategoryId ? " tab--active" : "");
      btn.type = "button";
      btn.dataset.id = cat.id;
      btn.innerHTML = `<span class="tab__symbol">${escapeHtml(cat.symbol || "??")}</span><span class="tab__name">${escapeHtml(cat.name)}</span>`;
      btn.addEventListener("click", () => selectCategory(cat.id));
      tabsEl.appendChild(btn);
    });

    const addTab = document.createElement("button");
    addTab.className = "tab tab--add";
    addTab.type = "button";
    addTab.setAttribute("aria-label", "Tambah bagian baru");
    addTab.innerHTML = `<span class="tab__symbol">+</span><span class="tab__name">Bagian baru</span>`;
    addTab.addEventListener("click", () => openModal("category"));
    tabsEl.appendChild(addTab);
  }

  function selectCategory(id) {
    currentCategoryId = id;
    lastTermShown = null;
    elAll(".tab", tabsEl).forEach((t) => t.classList.toggle("tab--active", t.dataset.id === id));
    const cat = getCurrentCategory();
    if (!cat) return;
    catNameEl.textContent = cat.name;
    catDescEl.textContent = cat.description || "";
    catCountEl.textContent = `${cat.terms.length} kosakata`;
    readoutEl.textContent = cat.terms.length ? "Tekan putar" : "Belum ada kosakata";
    readoutDefEl.textContent = "";
    dialEl.classList.remove("dial--locked");
    spinBtn.disabled = cat.terms.length === 0;
    searchInput.value = "";
    renderTermList(cat.terms);
  }

  // ---------------------------------------------------------------
  // RANDOMIZER — "total station readout"
  // ---------------------------------------------------------------
  function spin() {
    const cat = getCurrentCategory();
    if (!cat || !cat.terms.length || isSpinning) return;

    let pool = cat.terms;
    if (pool.length > 1 && lastTermShown) {
      pool = pool.filter((t) => t.term !== lastTermShown.term);
    }
    const finalTerm = pool[Math.floor(Math.random() * pool.length)];

    if (prefersReducedMotion) {
      lockOn(finalTerm);
      return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    dialEl.classList.remove("dial--locked");
    dialEl.classList.add("dial--spinning");
    readoutDefEl.textContent = "";

    const steps = 14;
    let i = 0;
    const minDelay = 40;
    const maxDelay = 220;

    function tick() {
      const progress = i / steps;
      // easeOutCubic: cepat di awal, melambat menuju akhir
      const eased = 1 - Math.pow(1 - progress, 3);
      const delay = minDelay + eased * (maxDelay - minDelay);

      if (i < steps) {
        const randomPick = cat.terms[Math.floor(Math.random() * cat.terms.length)];
        readoutEl.textContent = randomPick.term;
        i++;
        setTimeout(tick, delay);
      } else {
        lockOn(finalTerm);
      }
    }
    tick();
  }

  function lockOn(finalTerm) {
    readoutEl.textContent = finalTerm.term;
    readoutDefEl.textContent = finalTerm.definition || "";
    lastTermShown = finalTerm;
    dialEl.classList.remove("dial--spinning");
    dialEl.classList.add("dial--locked");
    isSpinning = false;
    spinBtn.disabled = false;
    setTimeout(() => dialEl.classList.remove("dial--locked"), 700);
  }

  // ---------------------------------------------------------------
  // DAFTAR KOSAKATA + PENCARIAN
  // ---------------------------------------------------------------
  function renderTermList(terms) {
    listEl.innerHTML = "";
    const query = searchInput.value.trim().toLowerCase();
    const filtered = query
      ? terms.filter(
          (t) =>
            t.term.toLowerCase().includes(query) ||
            (t.definition || "").toLowerCase().includes(query)
        )
      : terms;

    emptyStateEl.hidden = filtered.length !== 0;

    filtered.forEach((t) => {
      const item = document.createElement("li");
      item.className = "term-item";
      item.innerHTML = `
        <span class="term-item__marker" aria-hidden="true"></span>
        <div class="term-item__body">
          <p class="term-item__term">${escapeHtml(t.term)}</p>
          ${t.definition ? `<p class="term-item__def">${escapeHtml(t.definition)}</p>` : ""}
        </div>
      `;
      listEl.appendChild(item);
    });
  }

  // ---------------------------------------------------------------
  // MODALS: tambah kosakata / tambah bagian / export
  // ---------------------------------------------------------------
  function openModal(type) {
    if (type === "term") {
      const cat = getCurrentCategory();
      el("#term-modal-cat-name").textContent = cat ? cat.name : "";
      el("#term-form").dataset.categoryId = currentCategoryId;
      el("#term-input").value = "";
      el("#term-def-input").value = "";
      showModal("#term-modal");
      el("#term-input").focus();
    } else if (type === "category") {
      el("#category-form").reset();
      showModal("#category-modal");
      el("#category-name-input").focus();
    } else if (type === "export") {
      el("#export-textarea").value = GeodesiStorage.exportAsCode();
      showModal("#export-modal");
    }
  }

  function showModal(sel) {
    const modal = el(sel);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("modal--visible"));
  }

  function closeModal(modal) {
    modal.classList.remove("modal--visible");
    setTimeout(() => (modal.hidden = true), 150);
  }

  function bindGlobalEvents() {
    spinBtn.addEventListener("click", spin);
    dialEl.addEventListener("click", spin);
    dialEl.setAttribute("role", "button");
    dialEl.setAttribute("tabindex", "0");
    dialEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        spin();
      }
    });

    searchInput.addEventListener("input", () => {
      const cat = getCurrentCategory();
      if (cat) renderTermList(cat.terms);
    });

    el("#add-term-btn").addEventListener("click", () => openModal("term"));
    el("#export-btn").addEventListener("click", () => openModal("export"));

    elAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", (e) => closeModal(e.target.closest(".modal")));
    });
    elAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        elAll(".modal--visible").forEach(closeModal);
      }
    });

    el("#term-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const categoryId = form.dataset.categoryId;
      const term = el("#term-input").value.trim();
      const def = el("#term-def-input").value.trim();
      if (!term) return;
      GeodesiStorage.addTerm(categoryId, term, def);
      closeModal(el("#term-modal"));
      refreshData();
      toast(`"${term}" ditambahkan.`);
    });

    el("#category-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = el("#category-name-input").value.trim();
      const symbol = el("#category-symbol-input").value.trim();
      const desc = el("#category-desc-input").value.trim();
      if (!name) return;
      try {
        const id = GeodesiStorage.addCategory({ name, symbol, description: desc });
        closeModal(el("#category-modal"));
        refreshData();
        selectCategory(id);
        toast(`Bagian "${name}" dibuat.`);
      } catch (err) {
        el("#category-form-error").textContent = err.message;
      }
    });

    el("#copy-export-btn").addEventListener("click", async () => {
      const textarea = el("#export-textarea");
      textarea.select();
      try {
        await navigator.clipboard.writeText(textarea.value);
        toast("Kode disalin ke clipboard.");
      } catch (e) {
        toast("Gagal menyalin otomatis — salin manual dari kotak teks.");
      }
    });
  }

  function toast(message) {
    const t = el("#toast");
    t.textContent = message;
    t.classList.add("toast--visible");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => t.classList.remove("toast--visible"), 2600);
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
