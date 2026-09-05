const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-nav");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);

    if (isOpen) {
        menuButton.textContent = "✕";
        menuButton.setAttribute("aria-label", "Close navigation menu");
    } else {
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }
});