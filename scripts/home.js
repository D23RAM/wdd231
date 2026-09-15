const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");
const currentTemperature = document.querySelector("#current-temperature");
const currentDescription = document.querySelector("#current-description");
const forecastContainer = document.querySelector("#forecast-container");
const spotlightContainer = document.querySelector("#spotlight-container");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;

const API_KEY = "1376c7127c25559c1dd369fc6ef877ce";
const LATITUDE = 5.8520;
const LONGITUDE = -55.2038;

async function getCurrentWeather() {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather error: ${response.status}`);
        }

        const data = await response.json();

        currentTemperature.textContent = `${Math.round(data.main.temp)}°C`;
        currentDescription.textContent =
            capitalize(data.weather[0].description);

    } catch (error) {
        console.error("Current weather error:", error);
        currentTemperature.textContent = "--°C";
        currentDescription.textContent = "Weather unavailable";
    }
}

async function getForecast() {
    const url =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Forecast error: ${response.status}`);
        }

        const data = await response.json();

        forecastContainer.innerHTML = "";

        const days = {};

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);

            const day = date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
            });

            if (!days[day]) {
                days[day] = item;
            }
        });

        const forecastDays = Object.values(days).slice(1, 4);

        forecastDays.forEach(item => {
            const date = new Date(item.dt * 1000);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            const card = document.createElement("article");
            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>
                <p class="forecast-temperature">
                    ${Math.round(item.main.temp)}°C
                </p>
                <p>${capitalize(item.weather[0].description)}</p>
            `;

            forecastContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Forecast error:", error);
        forecastContainer.innerHTML =
            `<p>Forecast unavailable.</p>`;
    }
}

async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Members JSON error: ${response.status}`);
        }

        const members = await response.json();

        const eligibleMembers = members.filter(member =>
            Number(member.membership) === 2 ||
            Number(member.membership) === 3
        );

        const shuffled = [...eligibleMembers]
            .sort(() => Math.random() - 0.5);

        const selected = shuffled.slice(0, 3);

        spotlightContainer.innerHTML = "";

        selected.forEach(member => {
            const card = document.createElement("article");
            card.classList.add("spotlight-card");

            card.innerHTML = `
                <div class="spotlight-header">
                    <span class="membership-badge">
                        ${getMembershipLevel(member.membership)}
                    </span>

                    <h3>${member.name}</h3>

                    <p>${member.tagline}</p>
                </div>

                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                >

                <div class="spotlight-info">
                    <p>
                        <strong>Phone:</strong>
                        ${member.phone}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${member.address}
                    </p>

                    <p>
                        <strong>Membership:</strong>
                        ${getMembershipLevel(member.membership)}
                    </p>

                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                    </a>
                </div>
            `;

            spotlightContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Business spotlight error:", error);

        spotlightContainer.innerHTML =
            `<p>Business spotlights unavailable.</p>`;
    }
}

function getMembershipLevel(level) {
    if (Number(level) === 3) {
        return "Gold Member";
    }

    if (Number(level) === 2) {
        return "Silver Member";
    }

    return "Member";
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

getCurrentWeather();
getForecast();
getSpotlights();