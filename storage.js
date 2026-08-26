/**
 * storage.js
 * ---------------------------------------------------------------------
 * Mengelola kosakata/bagian tambahan yang ditambahkan lewat UI.
 * Tambahan disimpan di localStorage browser (khusus perangkat itu),
 * lalu digabung (merge) dengan data bawaan dari data.js saat halaman
 * dibuka. Ada juga fungsi "export" untuk mengubah semua tambahan itu
 * menjadi potongan kode yang tinggal ditempel ke data.js supaya
 * permanen dan bisa dibawa ke perangkat/branch lain.
 * ---------------------------------------------------------------------
 */

const GeodesiStorage = (() => {
  const STORAGE_KEY = "geodesi_randomizer_custom_v1";

  function _readRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { categories: [] };
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.categories)) return { categories: [] };
      return parsed;
    } catch (e) {
      console.warn("Gagal membaca data tambahan, mengabaikan.", e);
      return { categories: [] };
    }
  }

  function _writeRaw(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /** Deep-clone data bawaan lalu gabungkan dengan tambahan localStorage. */
  function getMergedData() {
    const base = JSON.parse(JSON.stringify(GEODESI_DATA));
    const custom = _readRaw();

    custom.categories.forEach((customCat) => {
      const existing = base.categories.find((c) => c.id === customCat.id);
      if (existing) {
        existing.terms = existing.terms.concat(customCat.terms || []);
      } else {
        base.categories.push(customCat);
      }
    });

    return base;
  }

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "bagian-" + Date.now();
  }

  /** Tambah satu kosakata ke kategori (kategori boleh sudah ada / baru). */
  function addTerm(categoryId, term, definition) {
    const custom = _readRaw();
    let cat = custom.categories.find((c) => c.id === categoryId);
    if (!cat) {
      cat = { id: categoryId, name: categoryId, symbol: "", description: "", terms: [], __termsOnly: true };
      custom.categories.push(cat);
    }
    cat.terms.push({ term: term.trim(), definition: (definition || "").trim() });
    _writeRaw(custom);
  }

  /** Tambah bagian (kategori) baru yang kosong, siap diisi kosakata. */
  function addCategory({ name, symbol, description }) {
    const id = slugify(name);
    const custom = _readRaw();
    if (custom.categories.some((c) => c.id === id) ||
        GEODESI_DATA.categories.some((c) => c.id === id)) {
      throw new Error("Bagian dengan nama itu sudah ada.");
    }
    custom.categories.push({
      id,
      name: name.trim(),
      symbol: (symbol || name.slice(0, 2)).toUpperCase(),
      description: (description || "").trim(),
      terms: [],
    });
    _writeRaw(custom);
    return id;
  }

  function hasCustomData() {
    const custom = _readRaw();
    return custom.categories.length > 0;
  }

  function clearCustomData() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Hasilkan teks kode JS siap-tempel berisi SEMUA data (bawaan + tambahan). */
  function exportAsCode() {
    const merged = getMergedData();
    const cleaned = {
      categories: merged.categories.map((c) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol || c.name.slice(0, 2).toUpperCase(),
        description: c.description || "",
        terms: c.terms,
      })),
    };
    const body = JSON.stringify(cleaned, null, 2);
    return `const GEODESI_DATA = ${body};\n`;
  }

  return {
    getMergedData,
    addTerm,
    addCategory,
    hasCustomData,
    clearCustomData,
    exportAsCode,
  };
})();
