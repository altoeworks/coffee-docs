/* Guide detail page utilities: updated-on injection, copy-to-clipboard, prev/next wiring. */

import { GUIDES } from './guides-data.js';

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

function copyText(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
  return Promise.resolve();
}

function toast(msg) {
  const n = document.createElement('div');
  n.textContent = msg;
  n.className = 'share-notification';
  n.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#ff6b35;color:#fff;padding:12px 16px;border-radius:10px;font-weight:500;z-index:10000;border:1px solid rgba(255,107,53,0.2);box-shadow:0 4px 12px rgba(0,0,0,.15)';
  document.body.appendChild(n);
  setTimeout(() => { n.style.opacity = '0'; n.style.transition = 'opacity .3s'; setTimeout(() => n.remove(), 300); }, 1800);
}

function wireCopyButtons() {
  const metaBtn = qs('[data-copy-meta]');
  const stepsBtn = qs('[data-copy-steps]');
  const metaContainer = qs('[data-meta]');
  const stepsContainer = qs('[data-steps]');
  if (metaBtn && metaContainer) {
    metaBtn.addEventListener('click', () => {
      const txt = qsa('[data-kv]', metaContainer).map(el => `${el.getAttribute('data-k')}: ${el.getAttribute('data-v')}`).join('\n');
      copyText(txt).then(() => toast('Metadata copied'));
    });
  }
  if (stepsBtn && stepsContainer) {
    stepsBtn.addEventListener('click', () => {
      const txt = qsa('li', stepsContainer).map((el, i) => `${i + 1}. ${el.textContent.trim()}`).join('\n');
      copyText(txt).then(() => toast('Steps copied'));
    });
  }
}

function wirePrevNext() {
  // Determine current by file name (without .html)
  const path = window.location.pathname;
  const id = (path.split('/').pop() || '').replace(/\.html$/i, '');
  const idx = GUIDES.findIndex(g => g.id === id);
  if (idx === -1) return;
  const prev = GUIDES[idx - 1];
  const next = GUIDES[idx + 1];
  const prevLink = qs('[data-prev]');
  const nextLink = qs('[data-next]');
  if (prevLink) {
    if (prev) {
      prevLink.href = `./${prev.id}.html`;
      prevLink.querySelector('[data-label]').textContent = prev.title;
    } else {
      prevLink.classList.add('pointer-events-none', 'opacity-40');
    }
  }
  if (nextLink) {
    if (next) {
      nextLink.href = `./${next.id}.html`;
      nextLink.querySelector('[data-label]').textContent = next.title;
    } else {
      nextLink.classList.add('pointer-events-none', 'opacity-40');
    }
  }
}

function initDarkPref() {
  const darkPref = localStorage.getItem('darkMode');
  if (darkPref === 'true') document.documentElement.classList.add('dark');
}

function wireHamburger() {
  const btn = document.getElementById('hamburger-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const menu = document.getElementById('hamburger-menu');
  const icon = document.getElementById('hamburger-icon');
  const toggleDm = document.getElementById('menu-dark-mode-toggle');
  const toggleDmButtons = document.querySelectorAll('#menu-dark-mode-toggle, .menu-dark-mode-toggle');
  const menuContent = menu ? menu.querySelector('div') : null;

  // Scroll lock helpers (scoped here for this page)
  let __scrollLockY = 0;
  const lockBodyScroll = () => {
    if (document.body.style.position === 'fixed') return;
    __scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${__scrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.documentElement.style.overscrollBehavior = 'none';
  };
  const unlockBodyScroll = () => {
    if (document.body.style.position !== 'fixed') return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.documentElement.style.overscrollBehavior = '';
    window.scrollTo(0, __scrollLockY || 0);
  };

  if (btn) btn.addEventListener('click', () => {
    if (menu) {
      menu.classList.add('menu-open');
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'auto';
      if (menuContent) {
        menuContent.classList.remove('translate-x-full');
        menuContent.style.transform = 'translateX(0)';
        menuContent.style.overflowY = 'auto';
        menuContent.style.maxHeight = '100vh';
        menuContent.style.webkitOverflowScrolling = 'touch';
      }
    }
    lockBodyScroll();
    if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
  });
  if (closeBtn) closeBtn.addEventListener('click', () => {
    if (menu) {
      menu.classList.remove('menu-open');
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      if (menuContent) {
        menuContent.classList.add('translate-x-full');
        menuContent.style.transform = 'translateX(100%)';
      }
    }
    unlockBodyScroll();
    if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
  });
  if (menu) menu.addEventListener('click', (e) => { if (e.target === menu && closeBtn) closeBtn.click(); });
  // Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('menu-open')) {
      if (closeBtn) closeBtn.click();
    }
  });
  if (toggleDm) toggleDm.addEventListener('click', () => { const isDark = document.documentElement.classList.contains('dark'); document.documentElement.classList.toggle('dark', !isDark); localStorage.setItem('darkMode', String(!isDark)); if (closeBtn) closeBtn.click(); });
  if (toggleDmButtons && toggleDmButtons.length) {
    toggleDmButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', !isDark);
        localStorage.setItem('darkMode', String(!isDark));
        if (closeBtn) closeBtn.click();
      });
    });
  }
}

function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = percent + '%';
}

function boot() {
  initDarkPref();
  setUpdatedOnDates();
  wireCopyButtons();
  wirePrevNext();
  wireHamburger();
  window.addEventListener('scroll', updateProgressBar);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

