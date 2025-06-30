// Typewriter and fade-in logic

document.addEventListener("DOMContentLoaded", function () {
  const siteContent = document.querySelector(".site-content");
  const introFade = document.getElementById("intro-fade");
  const otherSections = siteContent.querySelectorAll(".fade-in-section");
  const typewriter = document.getElementById("typewriter-title");
  const solidTitle = document.getElementById("solid-title");

  [introFade, ...otherSections].forEach((section) => {
    section.classList.remove("visible");
    section
      .querySelectorAll(".fade-line")
      .forEach((line) => line.classList.remove("visible"));
  });

  setTimeout(() => {
    setTimeout(() => {
      typewriter.style.display = "none";
      solidTitle.style.display = "inline";

      // Fade in dark mode toggle right after typewriter
      const darkToggle = document.getElementById("dark-mode-toggle");
      if (darkToggle) {
        darkToggle.classList.remove("opacity-0", "pointer-events-none");
        darkToggle.classList.add("opacity-100");
        darkToggle.style.pointerEvents = "auto";
      }

      let sectionDelay = 0;
      const lineDelay = 80; // slightly faster
      [introFade, ...otherSections].forEach((section, i) => {
        setTimeout(() => {
          section.classList.add("visible");
          const lines = section.querySelectorAll(".fade-line");
          lines.forEach((line, j) => {
            setTimeout(() => {
              line.classList.add("visible");
            }, j * lineDelay);
          });
        }, sectionDelay);
        sectionDelay += lineDelay;
      });
      // Fade in sticky banner after all fade-in animations
      setTimeout(() => {
        const banner = document.getElementById("sticky-banner");
        if (banner) {
          banner.style.opacity = 1;
          banner.style.pointerEvents = "auto";
        }
      }, sectionDelay + 600); // 600ms after last section
    }, 1200);
  }, 100);
});

// Dark mode toggle logic
const darkModeToggle = document.getElementById("dark-mode-toggle");
const darkModeIcon = document.getElementById("dark-mode-icon");
const body = document.body;

function setDarkMode(enabled, animate = true) {
  if (enabled) {
    body.classList.add("dark-mode");
    if (animate) {
      darkModeIcon.classList.remove("bounce-rotate", "bounce-rotate-reverse");
      void darkModeIcon.offsetWidth; // force reflow
      darkModeIcon.classList.add("bounce-rotate");
    }
    localStorage.setItem("darkMode", "true");
  } else {
    body.classList.remove("dark-mode");
    if (animate) {
      darkModeIcon.classList.remove("bounce-rotate", "bounce-rotate-reverse");
      void darkModeIcon.offsetWidth; // force reflow
      darkModeIcon.classList.add("bounce-rotate-reverse");
    }
    localStorage.setItem("darkMode", "false");
  }
}

// Load preference
const darkPref = localStorage.getItem("darkMode");
if (darkPref === "true") {
  setDarkMode(true, false);
} else {
  setDarkMode(false, false);
}

darkModeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-mode");
  setDarkMode(!isDark);
});
