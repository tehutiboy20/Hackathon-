document.getElementById('toggle').addEventListener("click", () => {
    alert("focus mode activated 🧠");
});
  

  // dark mode toggle 
const themeToggle = document.querySelector("#ThemeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode"
    }
});