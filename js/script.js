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

// Persist dismissal state for the sticky banner
const STICKY_BANNER_STORAGE_KEY = "stickyBannerDismissed";

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM_ELEMENTS = {
  siteContent: null,
  introFade: null,
  otherSections: null,
  typewriter: null,
  solidTitle: null,
  darkModeIcon: null,
  stickyBanner: null,
  stickyBannerClose: null,
  topNav: null,
  body: document.body
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  initializeStickyBanner();
  resetAnimations();
  startAnimations();
  initializeHamburgerMenu();
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
  DOM_ELEMENTS.darkModeIcon = document.getElementById("dark-mode-icon");
  DOM_ELEMENTS.stickyBanner = document.getElementById("sticky-banner");
  DOM_ELEMENTS.stickyBannerClose = document.getElementById("sticky-banner-close");
  DOM_ELEMENTS.topNav = document.getElementById("top-nav");
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
 * Note: This function is kept for compatibility but the original dark mode toggle
 * has been moved to the hamburger menu
 */
function showDarkModeToggle() {
  // The original dark mode toggle has been moved to the hamburger menu
  // This function is kept for compatibility with existing animation code
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
      // Skip showing if user has dismissed it previously
      const isDismissed = localStorage.getItem(STICKY_BANNER_STORAGE_KEY) === "true";
      if (isDismissed) {
        updateTopNavOffset();
        return;
      }

      DOM_ELEMENTS.stickyBanner.style.opacity = 1;
      DOM_ELEMENTS.stickyBanner.style.pointerEvents = "auto";
      updateTopNavOffset();
      // Keep offset accurate on resize or orientation changes
      window.addEventListener('resize', updateTopNavOffset, { passive: true });
      window.addEventListener('orientationchange', updateTopNavOffset, { passive: true });
      
      // Show cookie banner simultaneously if it exists
      if (typeof window.__showCookieBanner === 'function') {
        window.__showCookieBanner();
      }
    }
  }, totalDelay);
}

/**
 * Ensure top navigation sits below the sticky banner by adjusting its top offset
 */
function updateTopNavOffset() {
  const banner = DOM_ELEMENTS.stickyBanner;
  const nav = DOM_ELEMENTS.topNav;
  if (!banner || !nav) return;

  const isBannerVisible = banner.style.opacity === '1' || banner.style.opacity === 1 || getComputedStyle(banner).opacity === '1';
  const bannerHeight = isBannerVisible ? banner.offsetHeight : 0;

  // Apply a transform via style to avoid layout shift of the document flow
  nav.style.top = bannerHeight + 'px';
}

// Initialize banner dismissal and persistence
function initializeStickyBanner() {
  if (!DOM_ELEMENTS.stickyBanner) return;

  const isDismissed = localStorage.getItem(STICKY_BANNER_STORAGE_KEY) === "true";
  if (isDismissed) {
    // Ensure the banner is completely inactive and nav is at the top
    DOM_ELEMENTS.stickyBanner.style.opacity = 0;
    DOM_ELEMENTS.stickyBanner.style.pointerEvents = "none";
    DOM_ELEMENTS.stickyBanner.style.display = "none";
    if (DOM_ELEMENTS.topNav) {
      DOM_ELEMENTS.topNav.style.top = '0px';
    }
    return;
  }

  if (DOM_ELEMENTS.stickyBannerClose) {
    DOM_ELEMENTS.stickyBannerClose.addEventListener("click", dismissStickyBanner);
  }
}

function dismissStickyBanner() {
  if (!DOM_ELEMENTS.stickyBanner) return;
  localStorage.setItem(STICKY_BANNER_STORAGE_KEY, "true");

  // Smoothly fade out, stop interactions
  DOM_ELEMENTS.stickyBanner.style.opacity = 0;
  DOM_ELEMENTS.stickyBanner.style.pointerEvents = "none";

  // Immediately move nav back to the very top
  if (DOM_ELEMENTS.topNav) {
    DOM_ELEMENTS.topNav.style.top = '0px';
  }

  // After transition ends, fully hide the banner to avoid any layout quirks
  const handleTransitionEnd = () => {
    if (DOM_ELEMENTS.stickyBanner) {
      DOM_ELEMENTS.stickyBanner.style.display = 'none';
    }
    updateTopNavOffset();
  };
  DOM_ELEMENTS.stickyBanner.addEventListener('transitionend', handleTransitionEnd, { once: true });

  // No longer need to adjust on resize/orientation once dismissed
  window.removeEventListener('resize', updateTopNavOffset);
  window.removeEventListener('orientationchange', updateTopNavOffset);
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
    document.documentElement.classList.add("dark");
    if (animate) {
      animateDarkModeIcon("bounce-rotate");
    }
    localStorage.setItem("darkMode", "true");
  } else {
    document.documentElement.classList.remove("dark");
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
  const isDark = document.documentElement.classList.contains("dark");
  setDarkMode(!isDark);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Load the user's dark mode preference on page load
loadDarkModePreference();

// ============================================================================
// PROGRESS BAR FUNCTIONALITY
// ============================================================================

/**
 * Update the reading progress bar based on scroll position
 */
function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = percent + '%';
}

// ============================================================================
// SOCIAL SHARING FUNCTIONALITY
// ============================================================================

/**
 * Share guide by copying download link to clipboard
 * @param {string} title - The title of the guide to share
 * @param {string} url - The URL to share
 */
function shareGuide(title, url) {
  // Prefer the native Web Share API when available
  if (navigator.share) {
    navigator.share({
      title,
      text: `${title} — free coffee guide`,
      url
    }).catch((err) => {
      // If user cancels or share fails, fall back to clipboard
      if (err && err.name !== 'AbortError') {
        copyToClipboard(url, title);
      }
    });
  } else {
    // Fallback
    copyToClipboard(url, title);
  }
}

/**
 * Copy URL to clipboard with better user feedback
 * @param {string} url - URL to copy
 * @param {string} title - Title for user feedback
 */
function copyToClipboard(url, title) {
  if (navigator.clipboard && (window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    // Modern clipboard API
    navigator.clipboard.writeText(url).then(() => {
      showShareFeedback('Copied to clipboard!');
    }).catch((err) => {
      console.error('Clipboard API failed:', err);
      // Fallback for older browsers
      fallbackCopyToClipboard(url, title);
    });
  } else {
    // Fallback for older browsers or non-secure contexts
    fallbackCopyToClipboard(url, title);
  }
}

/**
 * Fallback copy method for older browsers
 * @param {string} url - URL to copy
 * @param {string} title - Title for user feedback
 */
function fallbackCopyToClipboard(url, title) {
  // For mobile devices, try a different approach
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile-specific approach
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '0';
    textArea.style.top = '0';
    textArea.style.width = '100%';
    textArea.style.height = '100%';
    textArea.style.opacity = '0';
    textArea.style.zIndex = '-1';
    textArea.style.pointerEvents = 'none';

    document.body.appendChild(textArea);

    // Focus and select on mobile
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showShareFeedback('Copied to clipboard!');
      } else {
        // Try alternative mobile approach
        textArea.style.opacity = '1';
        textArea.style.zIndex = '9999';
        textArea.style.pointerEvents = 'auto';
        textArea.style.background = 'white';
        textArea.style.color = 'black';
        textArea.style.padding = '10px';
        textArea.style.fontSize = '16px';

        showShareFeedback('Select the link above and copy it manually');

        // Remove after 5 seconds
        setTimeout(() => {
          if (textArea.parentNode) {
            textArea.parentNode.removeChild(textArea);
          }
        }, 5000);
        return;
      }
    } catch (err) {
      console.error('Mobile copy failed:', err);
      showShareFeedback('Failed to copy link. Please copy manually: ' + url);
    }

    document.body.removeChild(textArea);
  } else {
    // Desktop fallback
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');
    textArea.style.userSelect = 'none';
    textArea.style.webkitUserSelect = 'none';
    textArea.style.mozUserSelect = 'none';
    textArea.style.msUserSelect = 'none';

    document.body.appendChild(textArea);

    // Prevent scrolling and focus issues on mobile
    const originalScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const originalScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showShareFeedback('Copied to clipboard!');
      } else {
        throw new Error('execCommand copy returned false');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      showShareFeedback('Failed to copy link. Please copy manually: ' + url);
    }

    // Restore scroll position
    window.scrollTo(originalScrollLeft, originalScrollTop);

    document.body.removeChild(textArea);
  }
}

/**
 * Show user-friendly feedback for share actions
 * @param {string} message - Message to show
 */
function showShareFeedback(message) {
  // Remove any existing notifications first
  const existingNotifications = document.querySelectorAll('.share-notification');
  existingNotifications.forEach(notification => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  // Create a temporary notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = 'share-notification';

  notification.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff6b35;
    color: #ffffff;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 90vw;
    text-align: center;
    font-family: inherit;
    font-size: 15px;
    line-height: 1.5;
    border: 1px solid rgba(255,107,53,0.2);
    backdrop-filter: blur(8px);
    animation: slideInDown 0.3s ease-out;
  `;

  // Add keyframe animation for slide-in effect
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remove after 3 seconds with fade out
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transition = 'opacity 0.3s ease-out';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

// ============================================================================
// PDF DOWNLOAD FUNCTIONALITY
// ============================================================================

/**
 * Lazy load PDF by creating a temporary download link
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} guideName - Name of the guide for the download filename
 */
function downloadPDF(pdfPath, guideName) {
  // Create a hidden link and click it
  const link = document.createElement('a');
  link.href = pdfPath;
  link.download = guideName + '.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// ADDITIONAL EVENT LISTENERS
// ============================================================================

// Add scroll listener for progress bar
window.addEventListener('scroll', updateProgressBar);

// ============================================================================
// HAMBURGER MENU FUNCTIONALITY
// =========================================================================

// Scroll lock helpers to prevent background page scrolling while menu is open
let __scrollLockY = 0;
function lockBodyScroll() {
  if (document.body.style.position === 'fixed') return; // already locked
  __scrollLockY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${__scrollLockY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  // Prevent rubber-band on mobile
  document.documentElement.style.overscrollBehavior = 'none';
}
function unlockBodyScroll() {
  if (document.body.style.position !== 'fixed') return;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.documentElement.style.overscrollBehavior = '';
  window.scrollTo(0, __scrollLockY || 0);
}

/**
 * Initialize hamburger menu functionality
 */
function initializeHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menuDarkModeToggles = document.querySelectorAll('#menu-dark-mode-toggle, .menu-dark-mode-toggle');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  // Show hamburger menu button after animations
  if (hamburgerBtn) {
    // Make it clickable immediately to avoid timing issues
    hamburgerBtn.classList.remove("pointer-events-none");
    hamburgerBtn.style.pointerEvents = "auto";
    // Preserve the intended fade-in of opacity
    setTimeout(() => {
      hamburgerBtn.classList.remove("opacity-0");
      hamburgerBtn.classList.add("opacity-100");
    }, ANIMATION_CONFIG.TYPEWRITER_DURATION + 100);
  }

  // Open menu
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      openHamburgerMenu();
    });
  }

  // Close menu
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      closeHamburgerMenu();
    });
  }

  // Close menu when clicking outside
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', (e) => {
      if (e.target === hamburgerMenu) {
        closeHamburgerMenu();
      }
    });
  }

  // Dark mode toggle within menu
  if (menuDarkModeToggles && menuDarkModeToggles.length) {
    menuDarkModeToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains("dark");
        setDarkMode(!isDark);
        closeHamburgerMenu();
      });
    });
  }

  // Close menu when any menu link is clicked
  const menuLinks = hamburgerMenu?.querySelectorAll('a');
  if (menuLinks) {
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Close menu first
        closeHamburgerMenu();

        // For links to glossary.html, use replace for more reliable navigation
        if (link.href && link.href.includes('glossary.html')) {
          e.preventDefault();
          setTimeout(() => {
            window.location.replace('glossary.html');
          }, 100);
        }
      });
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerMenu && hamburgerMenu.classList.contains('menu-open')) {
      closeHamburgerMenu();
    }
  });
}

/**
 * Open the hamburger menu
 */
function openHamburgerMenu() {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menuContent = hamburgerMenu?.querySelector('div');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  if (hamburgerMenu && menuContent) {
    hamburgerMenu.classList.add('menu-open');
    hamburgerMenu.style.opacity = '1';
    hamburgerMenu.style.pointerEvents = 'auto';
    menuContent.style.transform = 'translateX(0)';
    // Allow scrolling inside the menu panel only
    menuContent.style.overflowY = 'auto';
    menuContent.style.maxHeight = '100vh';
    menuContent.style.webkitOverflowScrolling = 'touch';
    // Lock background scroll
    lockBodyScroll();

    // Change icon to X
    if (hamburgerIcon) {
      hamburgerIcon.classList.remove('fa-bars');
      hamburgerIcon.classList.add('fa-times');
    }
  }
}

/**
 * Close the hamburger menu
 */
function closeHamburgerMenu() {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menuContent = hamburgerMenu?.querySelector('div');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  if (hamburgerMenu && menuContent) {
    hamburgerMenu.classList.remove('menu-open');
    hamburgerMenu.style.opacity = '0';
    hamburgerMenu.style.pointerEvents = 'none';
    menuContent.style.transform = 'translateX(100%)';

    // Unlock background scroll
    unlockBodyScroll();

    // Change icon back to bars
    if (hamburgerIcon) {
      hamburgerIcon.classList.remove('fa-times');
      hamburgerIcon.classList.add('fa-bars');
    }
  }
}

// Make functions globally available
window.shareGuide = shareGuide;
window.downloadPDF = downloadPDF;
