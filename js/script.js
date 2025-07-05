/**
 * Coffee Docs - Main JavaScript
 * 
 * Handles the interactive elements of the coffee guides website:
 * - Typewriter animation for the title
 * - Fade-in animations for content sections
 * - Dark mode toggle functionality
 * - Sticky banner visibility
 */

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

const ANIMATION_CONFIG = {
  // Typewriter animation duration (ms)
  TYPEWRITER_DURATION: 1200,
  
  // Delay between fade-in section (ms)
  SECTION_DELAY: 80,
  
  // Delay between individual lines within a section (ms)
  LINE_DELAY: 80,
  
  // Extra delay before showing the sticky banner
  BANNER_DELAY: 200,
  
  // Initial delay before starting animations (ms)
  INITIAL_DELAY: 100
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM_ELEMENTS = {
  siteContent: null,
  introFade: null,
  otherSections: null,
  typewriter: null,
  solidTitle: null,
  darkModeToggle: null,
  darkModeIcon: null,
  stickyBanner: null,
  body: document.body
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  resetAnimations();
  startAnimations();
});

/**
 * Grab all the DOM elements we need to work with
 * This runs once when the page loads
 */
function initializeElements() {
  DOM_ELEMENTS.siteContent = document.querySelector(".site-content");
  DOM_ELEMENTS.introFade = document.getElementById("intro-fade");
  DOM_ELEMENTS.otherSections = DOM_ELEMENTS.siteContent.querySelectorAll(".fade-in-section");
  DOM_ELEMENTS.typewriter = document.getElementById("typewriter-title");
  DOM_ELEMENTS.solidTitle = document.getElementById("solid-title");
  DOM_ELEMENTS.darkModeToggle = document.getElementById("dark-mode-toggle");
  DOM_ELEMENTS.darkModeIcon = document.getElementById("dark-mode-icon");
  DOM_ELEMENTS.stickyBanner = document.getElementById("sticky-banner");
}

/**
 * Reset everything to its starting state
 * We hide all sections and lines so they can fade in later
 */
function resetAnimations() {
  const allSections = [DOM_ELEMENTS.introFade, ...DOM_ELEMENTS.otherSections];
  
  allSections.forEach((section) => {
    if (section) {
      section.classList.remove("visible");
      section
        .querySelectorAll(".fade-line")
        .forEach((line) => line.classList.remove("visible"));
    }
  });
}

/**
 * Start the sequence of animations
 */
function startAnimations() {
  setTimeout(() => {
    setTimeout(() => {
      completeTypewriterAnimation();
      showDarkModeToggle();
      animateSections();
      showStickyBanner();
    }, ANIMATION_CONFIG.TYPEWRITER_DURATION);
  }, ANIMATION_CONFIG.INITIAL_DELAY);
}

// ============================================================================
// ANIMATION FUNCTIONS
// ============================================================================

/**
 * Complete the typewriter animation by hiding the animated version
 * and showing the solid version
 */
function completeTypewriterAnimation() {
  if (DOM_ELEMENTS.typewriter && DOM_ELEMENTS.solidTitle) {
    DOM_ELEMENTS.typewriter.style.display = "none";
    DOM_ELEMENTS.solidTitle.style.display = "inline";
  }
}

/**
 * Show the dark mode toggle button
 */
function showDarkModeToggle() {
  if (DOM_ELEMENTS.darkModeToggle) {
    DOM_ELEMENTS.darkModeToggle.classList.remove("opacity-0", "pointer-events-none");
    DOM_ELEMENTS.darkModeToggle.classList.add("opacity-100");
    DOM_ELEMENTS.darkModeToggle.style.pointerEvents = "auto";
  }
}

/**
 * Animate all sections with staggered fade-in effects
 */
function animateSections() {
  const allSections = [DOM_ELEMENTS.introFade, ...DOM_ELEMENTS.otherSections];
  let sectionDelay = 0;
  
  allSections.forEach((section, index) => {
    if (section) {
      setTimeout(() => {
        section.classList.add("visible");
        animateSectionLines(section);
      }, sectionDelay);
      sectionDelay += ANIMATION_CONFIG.SECTION_DELAY;
    }
  });
}

/**
 * Animate the individual lines within each section for the cascading effect
 * @param {Element} section - The section we're animating lines for
 */
function animateSectionLines(section) {
  const lines = section.querySelectorAll(".fade-line");
  lines.forEach((line, lineIndex) => {
    setTimeout(() => {
      line.classList.add("visible");
    }, lineIndex * ANIMATION_CONFIG.LINE_DELAY);
  });
}

/**
 * Show the sticky banner after all other animations complete
 */
function showStickyBanner() {
  const allSections = [DOM_ELEMENTS.introFade, ...DOM_ELEMENTS.otherSections];
  const totalDelay = allSections.length * ANIMATION_CONFIG.SECTION_DELAY + ANIMATION_CONFIG.BANNER_DELAY;
  
  setTimeout(() => {
    if (DOM_ELEMENTS.stickyBanner) {
      DOM_ELEMENTS.stickyBanner.style.opacity = 1;
      DOM_ELEMENTS.stickyBanner.style.pointerEvents = "auto";
    }
  }, totalDelay);
}

// ============================================================================
// DARK MODE FUNCTIONALITY
// ============================================================================

/**
 * Turn dark mode on or off
 * @param {boolean} enabled - true for dark mode, false for light mode
 * @param {boolean} animate - whether to spin the icon (skipped on page load)
 */
function setDarkMode(enabled, animate = true) {
  if (enabled) {
    DOM_ELEMENTS.body.classList.add("dark-mode");
    if (animate) {
      animateDarkModeIcon("bounce-rotate");
    }
    localStorage.setItem("darkMode", "true");
  } else {
    DOM_ELEMENTS.body.classList.remove("dark-mode");
    if (animate) {
      animateDarkModeIcon("bounce-rotate-reverse");
    }
    localStorage.setItem("darkMode", "false");
  }
}

/**
 * Animate the dark mode toggle icon
 * @param {string} animationClass - The CSS animation class to apply
 */
function animateDarkModeIcon(animationClass) {
  if (DOM_ELEMENTS.darkModeIcon) {
    // Remove existing animations and force reflow
    DOM_ELEMENTS.darkModeIcon.classList.remove("bounce-rotate", "bounce-rotate-reverse");
    void DOM_ELEMENTS.darkModeIcon.offsetWidth; // Force reflow
    DOM_ELEMENTS.darkModeIcon.classList.add(animationClass);
  }
}

/**
 * Check if the user has a dark mode preference saved in local storage
 */
function loadDarkModePreference() {
  const darkPref = localStorage.getItem("darkMode");
  const shouldEnableDarkMode = darkPref === "true";
  setDarkMode(shouldEnableDarkMode, false);
}

/**
 * Toggle dark mode when the toggle button is clicked
 */
function handleDarkModeToggle() {
  const isDark = DOM_ELEMENTS.body.classList.contains("dark-mode");
  setDarkMode(!isDark);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Load the user's dark mode preference on page load
loadDarkModePreference();

// Add click listener to dark mode toggle
if (DOM_ELEMENTS.darkModeToggle) {
  DOM_ELEMENTS.darkModeToggle.addEventListener("click", handleDarkModeToggle);
}
