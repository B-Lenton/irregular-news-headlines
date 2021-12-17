// navbar:
const navBtn = document.getElementById("js-nav-btn");
const menuDropdown = document.getElementById("js-nav-dropdown");
navBtn.addEventListener("click", () => {
    menuDropdown.classList.toggle("hidden");
});
