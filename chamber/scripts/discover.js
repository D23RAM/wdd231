import { places } from "../data/discover.mjs";


const container = document.querySelector("#discover-container");
const visitMessage = document.querySelector("#visit-message");
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");


// Footer
currentYear.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;


// Display discover cards
function displayPlaces() {

    container.innerHTML = "";

    places.forEach(place => {

        const card = document.createElement("article");

        card.classList.add("discover-card");

        card.innerHTML = `
            <h2>${place.name}</h2>

            <figure>
                <img
                    src="images/discover/${place.image}"
                    alt="${place.name}"
                    loading="lazy"
                >
            </figure>

            <address>
                ${place.address}
            </address>

            <p>
                ${place.description}
            </p>

            <button type="button">
                Learn More
            </button>
        `;

        container.appendChild(card);

    });
}


// Last visit message
function displayVisitMessage() {

    const now = Date.now();
    const previousVisit = localStorage.getItem("lastVisit");

    if (!previousVisit) {

        visitMessage.textContent =
            "Welcome! Let us know if you have any questions.";

    } else {

        const difference = now - Number(previousVisit);

        const oneDay = 1000 * 60 * 60 * 24;

        const days = Math.floor(difference / oneDay);

        if (difference < oneDay) {

            visitMessage.textContent =
                "Back so soon! Awesome!";

        } else if (days === 1) {

            visitMessage.textContent =
                "You last visited 1 day ago.";

        } else {

            visitMessage.textContent =
                `You last visited ${days} days ago.`;

        }

    }

    localStorage.setItem("lastVisit", now);

}


displayPlaces();
displayVisitMessage();