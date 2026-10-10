// form.js — handles the "Share Your Favorite Deity" form on about.html
// and the results display on form-action.html (ES module).

import { initNav, setFooterYear } from "./main.js";

initNav();
setFooterYear();

/* ---------------------------------------------------------
   About page: live character counter for the message field
--------------------------------------------------------- */
const message = document.querySelector("#message");
const counter = document.querySelector("#message-counter");
const MAX_LEN = 500;

if (message && counter) {
  message.setAttribute("maxlength", String(MAX_LEN));
  const updateCounter = () => {
    counter.textContent = `${message.value.length} / ${MAX_LEN} characters`;
  };
  message.addEventListener("input", updateCounter);
  updateCounter();
}

/* ---------------------------------------------------------
   form-action page: read the submitted query string and display it
--------------------------------------------------------- */
const output = document.querySelector("#submission-output");

if (output) {
  const FIELD_LABELS = {
    name: "Name",
    email: "Email",
    favoriteDeity: "Favorite deity",
    message: "Message",
    updates: "Wants future updates",
  };

  function renderSubmission() {
    const params = new URLSearchParams(window.location.search);
    const entries = [...params.entries()];

    if (entries.length === 0) {
      output.innerHTML = `<p>No submission data was found. Return to the <a href="about.html">feedback form</a> and send it to see your details here.</p>`;
      return;
    }

    const rows = entries
      .map(([key, value]) => {
        const label = FIELD_LABELS[key] ?? key;
        const displayValue = value === "" ? "—" : value;
        return `<dt>${label}</dt><dd>${displayValue}</dd>`;
      })
      .join("");

    output.innerHTML = `
      <p>Thank you — here is what was submitted:</p>
      <dl>${rows}</dl>
    `;
  }

  renderSubmission();
}
