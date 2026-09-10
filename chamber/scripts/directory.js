const memberContainer =
    document.querySelector("#member-container");

const gridButton =
    document.querySelector("#grid-button");

const listButton =
    document.querySelector("#list-button");

const currentYear =
    document.querySelector("#currentyear");

const lastModified =
    document.querySelector("#lastModified");


/* =========================================
   FETCH MEMBER DATA
========================================= */

async function getMembers() {

    try {

        const response =
            await fetch("data/members.json");

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }

        const members =
            await response.json();

        displayMembers(members);

    } catch (error) {

        console.error(
            "Unable to load member data:",
            error
        );

        memberContainer.innerHTML = `
            <p class="error">
                Sorry, the member directory
                could not be loaded.
            </p>
        `;

    }

}


/* =========================================
   MEMBERSHIP LEVEL
========================================= */

function getMembershipLevel(level) {

    if (level === 3) {

        return "Gold Member";

    } else if (level === 2) {

        return "Silver Member";

    } else {

        return "Member";

    }

}


/* =========================================
   DISPLAY MEMBERS
========================================= */

function displayMembers(members) {

    memberContainer.innerHTML = "";

    members.forEach(member => {

        const card =
            document.createElement("article");

        card.classList.add("member-card");


        card.innerHTML = `

            <div class="member-header">

                <h2>
                    ${member.name}
                </h2>

                <p class="member-tagline">
                    ${member.tagline}
                </p>

            </div>


            <div class="member-content">

                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                >


                <div class="member-info">

                    <p>
                        <strong>Address:</strong>
                        ${member.address}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${member.phone}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${member.category}
                    </p>

                    <p>
                        <strong>Membership:</strong>
                        ${getMembershipLevel(
                            member.membership
                        )}
                    </p>

                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer">
                        Visit Website
                    </a>

                </div>

            </div>
        `;


        memberContainer.appendChild(card);

    });

}


/* =========================================
   GRID VIEW
========================================= */

gridButton.addEventListener("click", () => {

    memberContainer.classList.remove(
        "member-list"
    );

    memberContainer.classList.add(
        "member-grid"
    );

    gridButton.classList.add(
        "view-selected"
    );

    listButton.classList.remove(
        "view-selected"
    );

});


/* =========================================
   LIST VIEW
========================================= */

listButton.addEventListener("click", () => {

    memberContainer.classList.remove(
        "member-grid"
    );

    memberContainer.classList.add(
        "member-list"
    );

    listButton.classList.add(
        "view-selected"
    );

    gridButton.classList.remove(
        "view-selected"
    );

});


/* =========================================
   COPYRIGHT YEAR
========================================= */

currentYear.textContent =
    new Date().getFullYear();


/* =========================================
   LAST MODIFIED
========================================= */

lastModified.textContent =
    `Last Modification: ${document.lastModified}`;


/* =========================================
   START DIRECTORY
========================================= */

getMembers();