// deities.js — Explore Hindu Deities page (ES module)
// Fetches deity data, renders cards dynamically, and wires up search,
// category filtering, an accessible details modal, and localStorage favorites.

import { initNav, setFooterYear } from "./main.js";

initNav();
setFooterYear();

const DATA_URL = "data/deities.json";
const FAVORITES_KEY = "hinduDeitiesExplorer:favorites";

const grid = document.querySelector("#deity-grid");
const statusLine = document.querySelector("#status-line");
const categoryFilter = document.querySelector("#category-filter");
const searchInput = document.querySelector("#deity-search");
const favOnlyToggle = document.querySelector("#fav-only");

const modalOverlay = document.querySelector("#deity-modal");
const modalBody = document.querySelector("#modal-body");
const modalCloseBtn = document.querySelector("#modal-close");

let allDeities = [];
let lastFocusedElement = null;

/* ---------------------------------------------------------
   localStorage helpers — persists the visitor's favorite deities
--------------------------------------------------------- */
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read favorites from localStorage:", err);
    return [];
  }
}

function saveFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn("Could not save favorites to localStorage:", err);
  }
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites(favorites);
  return favorites;
}

/* ---------------------------------------------------------
   Fetching
--------------------------------------------------------- */
async function loadDeities() {
  statusLine.textContent = "Loading deities…";
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const data = await response.json();
    allDeities = data;
    populateCategoryOptions(allDeities);
    renderDeities(allDeities);
  } catch (err) {
    console.error("Failed to load deity data:", err);
    statusLine.textContent =
      "Sorry — the deity list couldn't be loaded. Please refresh the page to try again.";
    grid.innerHTML = "";
  }
}

function populateCategoryOptions(deities) {
  const categories = [...new Set(deities.map((d) => d.category))].sort();
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function categoryClass(category) {
  // first word of the category maps to one of the CSS color classes
  return "category-" + category.split(" ")[0].replace(/[()]/g, "");
}

/* ---------------------------------------------------------
   Rendering
--------------------------------------------------------- */
function deityCardTemplate(deity, favorites) {
  const isFav = favorites.includes(deity.id);
  const qualitiesText = deity.qualities.slice(0, 3).join(", ");

  return `
    <article class="deity-card" data-id="${deity.id}">
      <div class="thumb">
        <img
          src="${deity.image}"
          alt="${deity.imageAlt}"
          loading="lazy"
          width="400"
          height="500">
      </div>
      <div class="body">
        <h3>${deity.name}</h3>
        <span class="category-tag ${categoryClass(deity.category)}">${deity.category}</span>
        <p class="qualities"><span>Qualities:</span> ${qualitiesText}</p>
        <p class="qualities"><span>Symbols:</span> ${deity.symbols.slice(0, 3).join(", ")}</p>
        <p class="qualities"><span>Festival:</span> ${deity.festivals[0]}</p>
        <div class="card-actions">
          <button type="button" class="details-btn" data-id="${deity.id}">
            Learn more
          </button>
          <button
            type="button"
            class="fav-btn"
            data-id="${deity.id}"
            aria-pressed="${isFav}"
            aria-label="${isFav ? "Remove " + deity.name + " from favorites" : "Add " + deity.name + " to favorites"}"
          >${isFav ? "♥" : "♡"}</button>
        </div>
      </div>
    </article>
  `;
}

function renderDeities(deities) {
  const favorites = getFavorites();

  if (deities.length === 0) {
    grid.innerHTML = "";
    statusLine.textContent = "No deities match your search or filters.";
    return;
  }

  grid.innerHTML = deities.map((d) => deityCardTemplate(d, favorites)).join("");
  statusLine.textContent = `Showing ${deities.length} of ${allDeities.length} deities.`;
}

/* ---------------------------------------------------------
   Filtering — combines search text, category, and favorites-only
--------------------------------------------------------- */
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const favOnly = favOnlyToggle.checked;
  const favorites = getFavorites();

  const filtered = allDeities.filter((deity) => {
    const matchesQuery = query === "" || deity.name.toLowerCase().includes(query);
    const matchesCategory = category === "all" || deity.category === category;
    const matchesFav = !favOnly || favorites.includes(deity.id);
    return matchesQuery && matchesCategory && matchesFav;
  });

  renderDeities(filtered);
}

/* ---------------------------------------------------------
   Modal
--------------------------------------------------------- */
function openModal(deity) {
  lastFocusedElement = document.activeElement;

  modalBody.innerHTML = `
    <img class="modal-photo" src="${deity.image}" alt="${deity.imageAlt}" width="760" height="288">
    <h2 id="modal-title">${deity.name}</h2>
    <span class="category-tag ${categoryClass(deity.category)}">${deity.category}</span>

    <div class="modal-section">
      <h3>Story</h3>
      <p>${deity.story}</p>
    </div>

    <div class="modal-section">
      <h3>Associated qualities</h3>
      <ul>${deity.qualities.map((q) => `<li>${q}</li>`).join("")}</ul>
    </div>

    <div class="modal-section">
      <h3>Symbols</h3>
      <ul>${deity.symbols.map((s) => `<li>${s}</li>`).join("")}</ul>
    </div>

    <div class="modal-section">
      <h3>Festivals</h3>
      <ul>${deity.festivals.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>

    <div class="mantra-box">${deity.mantra}</div>
  `;

  modalOverlay.classList.add("open");
  modalOverlay.setAttribute("aria-hidden", "false");
  modalCloseBtn.focus();
  document.addEventListener("keydown", handleModalKeydown);
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", handleModalKeydown);
  if (lastFocusedElement) lastFocusedElement.focus();
}

function handleModalKeydown(e) {
  if (e.key === "Escape") {
    closeModal();
    return;
  }
  // Simple focus trap: keep Tab cycling within the modal while it's open.
  if (e.key === "Tab") {
    const focusable = modalOverlay.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

/* ---------------------------------------------------------
   Event wiring
--------------------------------------------------------- */
grid.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".fav-btn");
  const detailsBtn = e.target.closest(".details-btn");

  if (favBtn) {
    const id = favBtn.dataset.id;
    const favorites = toggleFavorite(id);
    const isFav = favorites.includes(id);
    favBtn.setAttribute("aria-pressed", String(isFav));
    favBtn.textContent = isFav ? "♥" : "♡";
    const deity = allDeities.find((d) => d.id === id);
    favBtn.setAttribute(
      "aria-label",
      isFav ? `Remove ${deity.name} from favorites` : `Add ${deity.name} to favorites`
    );
    if (favOnlyToggle.checked) applyFilters();
    return;
  }

  if (detailsBtn) {
    const id = detailsBtn.dataset.id;
    const deity = allDeities.find((d) => d.id === id);
    if (deity) openModal(deity);
  }
});

modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

categoryFilter.addEventListener("change", applyFilters);
favOnlyToggle.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

loadDeities();
