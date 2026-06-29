/* Guides Library logic: filter, search, render overview, and wire navigation. */

import { GUIDES, GUIDE_CATEGORIES, PLACEHOLDER_SECTIONS } from './guides-data.js';

// Utilities
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function formatDateISO(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso || '';
  }
}

function setUpdatedOnDates() {
  qsa('[data-updated-on]').forEach((el) => {
    const manual = el.getAttribute('data-date');
    el.textContent = formatDateISO(manual || new Date().toISOString().slice(0, 10));
  });
}

// Render category filter chips
function renderCategoryFilter(activeCategory) {
  const container = qs('#category-filter');
  if (!container) return;
  const categories = ['All', ...GUIDE_CATEGORIES];
  container.innerHTML = categories.map((cat) => {
    const active = (activeCategory || 'All') === cat;
    const base = 'px-3 py-2 rounded-full text-sm border transition-colors';
    const on = 'bg-accent text-white border-accent';
    const off = 'bg-white/80 dark:bg-darksection/80 text-main/80 dark:text-darktext border-main/10 dark:border-darkborder hover:bg-main/10 dark:hover:bg-background/10';
    return `<button class="cat-chip ${base} ${active ? on : off}" data-cat="${cat}">${cat}</button>`;
  }).join('');
}

// Filter logic
function filterGuides({ category = 'All', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return GUIDES.filter((g) => {
    const catOk = category === 'All' || g.category === category;
    if (!catOk) return false;
    if (!q) return true;
    const inTitle = g.title.toLowerCase().includes(q);
    const inSteps = (g.steps || []).some((s) => s.toLowerCase().includes(q));
    return inTitle || inSteps;
  });
}

// Group by category (preserve order)
function groupByCategory(items) {
  const map = new Map();
  items.forEach((g) => {
    if (!map.has(g.category)) map.set(g.category, []);
    map.get(g.category).push(g);
  });
  return map;
}

// Card HTML
function renderCard(g) {
  return `
  <article class="group cursor-pointer rounded-xl border border-main/10 dark:border-darkborder border-t-2 border-t-accent/60 dark:border-t-accent/40 bg-white dark:bg-darksection p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all" data-id="${g.id}">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-main dark:text-background m-0">${escapeHtml(g.title)}</h3>
        <div class="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span class="inline-flex items-center px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/30">${g.category}</span>
          <span class="text-main/60 dark:text-background/60">Updated: <time>${formatDateISO(g.updatedOn)}</time></span><br />
          ${g.source?.name ? `<a href="${g.source.url || '#'}" target="_blank" rel="noopener noreferrer" class="underline text-tertiary dark:text-darktertiary hover:text-accent">${escapeHtml(g.source.name)}</a>` : ''}
        </div>
      </div>
      <i class="fa-solid fa-arrow-right text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-1"></i>
    </div>
    ${g.summary ? `<p class="text-sm text-main/80 dark:text-background/80 mt-2">${escapeHtml(g.summary)}</p>` : ''}
  </article>`;
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

// Overview renderer
function renderOverview(list, activeCategory = 'All') {
  const container = qs('#guides-container');
  const empty = qs('#no-results');
  if (!container) return;
  // Always render sections (with placeholders when needed)
  if (empty) empty.classList.add('hidden');

  const grouped = groupByCategory(list);
  // Ensure placeholders render only for the active category when filtering,
  // otherwise keep placeholders for all categories on the "All" view.
  if (activeCategory && activeCategory !== 'All') {
    if (!grouped.has(activeCategory)) grouped.set(activeCategory, []);
  } else {
    PLACEHOLDER_SECTIONS.forEach((p) => {
      if (!grouped.has(p.category)) grouped.set(p.category, []);
    });
  }

  const orderedCategories = (activeCategory && activeCategory !== 'All')
    ? [activeCategory].filter((c) => grouped.has(c))
    : GUIDE_CATEGORIES.filter((c) => grouped.has(c));
  const html = orderedCategories.map((cat) => {
    const items = grouped.get(cat);
    const safeId = `cat-${cat.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
    const header = `
      <div class="flex items-center gap-3 mb-4 md:mb-5">
        <span class="block w-1.5 h-8 rounded bg-accent mr-1"></span>
        <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-main dark:text-background m-0 mt-4">${cat}</h2>
      </div>`;
    if (!items || !items.length) {
      const ph = PLACEHOLDER_SECTIONS.find((p) => p.category === cat);
      return `<section aria-labelledby="${safeId}" id="${safeId}" class="first:border-0 first:pt-0 border-t border-main/10 dark:border-darkborder pt-6 md:pt-8 mb-4">
        ${header}
        <p class="text-sm text-main/60 dark:text-background/60">${escapeHtml(ph?.description || 'More guides coming — check back soon.')}</p>
      </section>`;
    }
    const grid = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-4">${items.map(renderCard).join('')}</div>`;
    return `<section aria-labelledby="${safeId}" id="${safeId}" class="first:border-0 first:pt-0 border-t border-main/10 dark:border-darkborder pt-6 md:pt-8">${header}${grid}</section>`;
  }).join('');

  container.innerHTML = html;

  // Wire card clicks
  qsa('[data-id]', container).forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      if (id) window.location.href = `./${id}.html`;
    });
  });
}

// Search and category wiring
function wireFilters() {
  const searchInput = qs('#search-input');
  const clearBtn = qs('#clear-search-btn');
  let state = { category: 'All', query: '' };

  renderCategoryFilter(state.category);
  // removed jump-to anchors: keep only category filters

  const apply = () => {
    const results = filterGuides(state);
    renderOverview(results, state.category);
    // Update clear button
    if (clearBtn) {
      const any = Boolean(state.query);
      clearBtn.classList.toggle('opacity-0', !any);
      clearBtn.classList.toggle('pointer-events-none', !any);
    }
  };

  // Category clicks
  qs('#category-filter')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    state.category = btn.getAttribute('data-cat');
    renderCategoryFilter(state.category);
    apply();
  });

  // Search typing
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.query = searchInput.value;
      apply();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.query = '';
      apply();
      if (searchInput) searchInput.focus();
    });
  }

  // Initial render
  apply();
}

// anchors removed

// Scroll lock helpers
let __scrollLockY = 0;
function lockBodyScroll() {
  if (document.body.style.position === 'fixed') return;
  __scrollLockY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${__scrollLockY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
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

// Hamburger menu reuse from site (minimal subset)
function initializeHamburgerMenuLocal() {
  const hamburgerBtn = document.getElementById('hamburger-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menuDarkModeToggle = document.getElementById('menu-dark-mode-toggle');
  const menuDarkModeToggles = document.querySelectorAll('#menu-dark-mode-toggle, .menu-dark-mode-toggle');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const menuContent = hamburgerMenu ? hamburgerMenu.querySelector('div') : null;

  // Ensure the button is clickable (HTML has pointer-events-none by default)
  if (hamburgerBtn) {
    hamburgerBtn.classList.remove('pointer-events-none');
    hamburgerBtn.style.pointerEvents = 'auto';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (hamburgerMenu) {
        hamburgerMenu.classList.add('menu-open');
        hamburgerMenu.style.opacity = '1';
        hamburgerMenu.style.pointerEvents = 'auto';
        if (menuContent) {
          menuContent.classList.remove('translate-x-full');
          menuContent.style.transform = 'translateX(0)';
          menuContent.style.overflowY = 'auto';
          menuContent.style.maxHeight = '100vh';
          menuContent.style.webkitOverflowScrolling = 'touch';
        }
      }
      lockBodyScroll();
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
      }
    });
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      if (hamburgerMenu) {
        hamburgerMenu.classList.remove('menu-open');
        hamburgerMenu.style.opacity = '0';
        hamburgerMenu.style.pointerEvents = 'none';
        if (menuContent) {
          // Use both class and inline style to ensure animation works consistently
          menuContent.classList.add('translate-x-full');
          menuContent.style.transform = 'translateX(100%)';
        }
      }
      unlockBodyScroll();
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
      }
    });
  }
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', (e) => {
      if (e.target === hamburgerMenu) {
        if (closeMenuBtn) closeMenuBtn.click();
      }
    });
  }
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerMenu && hamburgerMenu.classList.contains('menu-open')) {
      if (closeMenuBtn) closeMenuBtn.click();
    }
  });

  // Dark mode toggle(s) — bind ONCE per button
  const handleToggleDark = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkMode', String(next));
    // Close overlay only if it is currently open
    if (hamburgerMenu && hamburgerMenu.classList.contains('menu-open') && closeMenuBtn) {
      closeMenuBtn.click();
    }
  };

  // Attach to all matching buttons (navbar + overlay)
  if (menuDarkModeToggles && menuDarkModeToggles.length) {
    menuDarkModeToggles.forEach((btn) => {
      btn.addEventListener('click', handleToggleDark);
    });
  }
}

// Progress bar
function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = percent + '%';
}

/**
 * Set up keyboard shortcuts for better accessibility
 */
function setupKeyboardShortcuts() {
    // Ctrl+F to focus search
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search-input');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                // Reuse existing input listener to re-render
                const evt = new Event('input', { bubbles: true });
                searchInput.dispatchEvent(evt);
            }
        }
    });
}

// Boot
function boot() {
  // Load dark pref
  const darkPref = localStorage.getItem('darkMode');
  if (darkPref === 'true') document.documentElement.classList.add('dark');
  setUpdatedOnDates();
  // Ensure something renders immediately
  try {
    renderOverview(GUIDES || [], 'All');
  } catch {}
  wireFilters();
  initializeHamburgerMenuLocal();
  setupKeyboardShortcuts();
  window.addEventListener('scroll', updateProgressBar);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
