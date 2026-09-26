const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");
const timestamp = document.querySelector("#timestamp");


// Footer
currentYear.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;


// Form timestamp
timestamp.value = new Date().toISOString();


// Membership modals
const modalButtons = document.querySelectorAll(".modal-button");
const closeButtons = document.querySelectorAll(".close-modal");

modalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const modal = document.querySelector(`#${modalId}`);

        modal.showModal();
    });
});


closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest("dialog");

        modal.close();
    });
});


// Close modal when clicking outside the modal content
document.querySelectorAll("dialog").forEach(modal => {
    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.close();
        }

    });
});