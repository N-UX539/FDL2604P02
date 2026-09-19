import "../css/index.css";

// navMenu Toogler Function
let navMenu = document.getElementById("navLinks");
let toggleBtn = document.getElementById("toggleBtn");
function toggleState() {
  navMenu.classList.toggle("max-lg:translate-x-0");
}
toggleBtn.addEventListener("click", toggleState);
toggleBtn.addEventListener("blur", () =>
  navMenu.classList.remove("max-lg:translate-x-0"),
);