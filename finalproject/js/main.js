// main.js — shared behavior for every page (ES module)
// Handles the responsive hamburger navigation and the footer's copyright year.
// Imported on every page; deities.js and form.js both import initNav() from here
// so the mobile menu works consistently across the site.

export function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu once a link is chosen.
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // If the window is resized past the desktop breakpoint while the mobile
  // menu is open, reset it back to the horizontal layout.
  const desktopQuery = window.matchMedia("(min-width: 62rem)");
  desktopQuery.addEventListener("change", (e) => {
    if (e.matches) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

export function setFooterYear() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

initNav();
setFooterYear();
