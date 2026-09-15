
console.log("🔥 HOME.JS IS RUNNING 🔥");


const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const currentTemperature = document.querySelector("#current-temperature");
const currentDescription = document.querySelector("#current-description");

const forecastContainer = document.querySelector("#forecast-container");
const spotlightContainer = document.querySelector("#spotlight-container");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;

const API_KEY = "efe7934edb035eba7f465905d385cdda";

const LATITUDE = 5.8520;
const LONGITUDE = -55.2038;


// WEATHER
async function getWeather() {

    const currentURL =
        `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

    try {

        // Current weather
        const currentResponse = await fetch(currentURL);

        if (!currentResponse.ok) {
            throw new Error(`Current weather error: ${currentResponse.status}`);
        }

        const currentData = await currentResponse.json();

        currentTemperature.textContent =
            `${Math.round(currentData.main.temp)}°C`;

        currentDescription.textContent =
            capitalize(currentData.weather[0].description);


        // Forecast
        const forecastResponse = await fetch(forecastURL);

        if (!forecastResponse.ok) {
            throw new Error(`Forecast error: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        forecastContainer.innerHTML = "";

        const days = [];

        forecastData.list.forEach(item => {

            const date = new Date(item.dt * 1000);

            const dateString = date.toLocaleDateString("en-US");

            if (!days.some(day => day.date === dateString)) {

                days.push({
                    date: dateString,
                    item: item
                });

            }

        });

        // Skip today and show the next 3 days
        const nextThreeDays = days.slice(1, 4);

        nextThreeDays.forEach(day => {

            const date = new Date(day.item.dt * 1000);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            const card = document.createElement("article");

            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>

                <p class="forecast-temperature">
                    ${Math.round(day.item.main.temp)}°C
                </p>

                <p>
                    ${capitalize(day.item.weather[0].description)}
                </p>
            `;

            forecastContainer.appendChild(card);

        });

    } catch (error) {

        console.error("WEATHER ERROR:", error);

        currentTemperature.textContent = "--°C";
        currentDescription.textContent = "Weather unavailable";

        forecastContainer.innerHTML =
            "<p>Forecast unavailable.</p>";
    }
}


// BUSINESS SPOTLIGHTS
async function getSpotlights() {

    try {

        console.log("Loading members.json...");

        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Members error: ${response.status}`);
        }

        const members = await response.json();

        console.log("Members loaded:", members);

        const eligibleMembers = members.filter(member =>
            Number(member.membership) === 2 ||
            Number(member.membership) === 3
        );

        const shuffledMembers =
            [...eligibleMembers].sort(() => Math.random() - 0.5);

        const selectedMembers =
            shuffledMembers.slice(0, 3);

        spotlightContainer.innerHTML = "";

        selectedMembers.forEach(member => {

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

        console.error("SPOTLIGHT ERROR:", error);

        spotlightContainer.innerHTML =
            "<p>Business spotlights unavailable.</p>";
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


getWeather();
getSpotlights();