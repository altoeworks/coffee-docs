// Subtle cookie consent for YouTube embeds
// Injects a small bottom-left banner. Stores consent in localStorage.
(function () {
  const CONSENT_KEY = 'cookieConsent';
  const CONSENT_VERSION = '2'; // bump to re-show after copy/behavior changes

  function hasConsented() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      return Boolean(data && data.version === CONSENT_VERSION && data.accepted === true);
    } catch {
      return false;
    }
  }

  function saveConsent() {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, version: CONSENT_VERSION, ts: Date.now() }));
    } catch {}
  }

  // ---------- YouTube gating ----------
  let pendingPlayTarget = null;

  function isYouTubeUrl(url) {
    return /youtube\.com|youtu\.be|youtube-nocookie\.com/i.test(url || '');
  }

  function ensureOverlayForIframe(iframe) {
    const parent = iframe.parentElement;
    if (!parent) return;
    parent.style.position = parent.style.position || 'relative';
    if (parent.querySelector('.yt-consent-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'yt-consent-overlay';
    overlay.style.cssText = [
      'position:absolute','inset:0','display:flex','align-items:center','justify-content:center','gap:10px',
      'background:rgba(0,0,0,0.08)','backdrop-filter:blur(2px)','border-radius:12px','cursor:pointer'
    ].join(';');

    const label = document.createElement('span');
    label.textContent = 'Click to enable YouTube and play';
    label.style.cssText = 'font-size:13px;color:#333;background:rgba(255,255,255,0.9);padding:6px 10px;border-radius:10px;border:1px solid rgba(0,0,0,0.06)';

    overlay.appendChild(label);

    overlay.addEventListener('click', function () {
      pendingPlayTarget = iframe;
      if (typeof window.__cookieConsentForceShow === 'function') {
        window.__cookieConsentForceShow();
      }
    });

    parent.appendChild(overlay);
  }

  function gateYouTubeEmbeds() {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    const consented = hasConsented();
    iframes.forEach((iframe) => {
      const currentSrc = iframe.getAttribute('src') || '';
      const dataSrc = iframe.getAttribute('data-yt-src');
      const isYT = isYouTubeUrl(currentSrc) || isYouTubeUrl(dataSrc);
      if (!isYT) return;

      if (consented) {
        // restore if needed
        const original = dataSrc || currentSrc;
        if (!currentSrc && dataSrc) {
          iframe.setAttribute('src', dataSrc);
        }
        // remove overlay if present
        const ov = iframe.parentElement && iframe.parentElement.querySelector('.yt-consent-overlay');
        if (ov) ov.remove();
      } else {
        // store and blank
        if (!dataSrc && currentSrc) iframe.setAttribute('data-yt-src', currentSrc);
        if (currentSrc) iframe.setAttribute('src', '');
        ensureOverlayForIframe(iframe);
      }
    });
  }

  function currentTheme() {
    const dark = document.documentElement.classList.contains('dark');
    return dark ? 'dark' : 'light';
  }

  function createBanner() {
    if (document.getElementById('cookie-consent-banner')) return; // already present
    const theme = currentTheme();
    const isDark = theme === 'dark';

    const wrapper = document.createElement('div');
    wrapper.id = 'cookie-consent-banner';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-live', 'polite');
    wrapper.setAttribute('aria-label', 'Cookie notice');
    wrapper.style.cssText = [
      'position:fixed',
      'left:16px',
      'bottom:16px',
      'z-index:10000',
      'max-width: 520px',
      'font-family: inherit',
      'border-radius:14px',
      'padding:12px 14px',
      'box-shadow: 0 6px 20px rgba(0,0,0,0.12)',
      'backdrop-filter: blur(8px)',
      'border: 1px solid ' + (isDark ? 'rgba(68,68,68,0.9)' : 'rgba(0,0,0,0.06)'),
      'background: ' + (isDark ? 'rgba(42,42,42,0.95)' : 'rgba(255,255,255,0.95)'),
      'color: ' + (isDark ? '#F2F2F2' : '#333'),
      'opacity: 0',
      'transform: translateY(8px)',
      'transition: opacity .25s ease, transform .25s ease'
    ].join(';');

    const text = document.createElement('div');
    text.style.cssText = 'font-size: 13px; line-height: 1.5; margin: 0 8px 0 0;';
    text.innerHTML =
      'I use embedded YouTube videos which may set cookies when you play them. I don\'t use tracking cookies. ' +
      '<a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" ' +
      'style="text-decoration: underline; color: #005271;">Learn more</a>.';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex; gap:8px; align-items:center;';

    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.textContent = 'OK';
    acceptBtn.setAttribute('aria-label', 'Accept and close cookie notice');
    acceptBtn.style.cssText = [
      'border:1px solid rgba(255,107,53,0.3)',
      'background:#ff6b35',
      'color:#fff',
      'width:36px',
      'height:36px',
      'padding:0',
      'border-radius:10px',
      'font-size:12px',
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'cursor:pointer'
    ].join(';');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Dismiss cookie notice');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.style.cssText = [
      'border:1px solid ' + (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'),
      'background: transparent',
      'color: inherit',
      'width:36px',
      'height:36px',
      'padding:0',
      'border-radius:10px',
      'font-size:14px',
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'cursor:pointer'
    ].join(';');

    actions.appendChild(acceptBtn);
    actions.appendChild(closeBtn);

    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:12px;';
    row.appendChild(text);
    row.appendChild(actions);

    wrapper.appendChild(row);

    function close() {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(8px)';
      setTimeout(() => wrapper.remove(), 250);
    }

    acceptBtn.addEventListener('click', () => {
      saveConsent();
      // notify listeners
      try { window.dispatchEvent(new CustomEvent('cookie-consented')); } catch {}
      close();
    });
    closeBtn.addEventListener('click', () => {
      // Non-obtrusive: dismiss without saving still hides for the session
      close();
    });

    // Adjust when theme changes (dark mode toggle)
    const obs = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      wrapper.style.background = nowDark ? 'rgba(42,42,42,0.95)' : 'rgba(255,255,255,0.95)';
      wrapper.style.border = '1px solid ' + (nowDark ? 'rgba(68,68,68,0.9)' : 'rgba(0,0,0,0.06)');
      wrapper.style.color = nowDark ? '#F2F2F2' : '#333';
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    try {
      document.body.appendChild(wrapper);
    } catch (e) {
      // If body not ready for some reason, retry shortly
      setTimeout(() => {
        if (!document.getElementById('cookie-consent-banner')) {
          document.body.appendChild(wrapper);
          requestAnimationFrame(() => {
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
          });
        }
      }, 100);
      return;
    }
    // Fade in
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });
  }

  function boot() {
    if (hasConsented()) return;
    createBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Expose a manual trigger for debugging
  try { window.__cookieConsentForceShow = function(){ createBanner(); }; } catch {}

  // Gate or restore YouTube embeds on load and on consent
  function initGating() {
    gateYouTubeEmbeds();
    window.addEventListener('cookie-consented', function () {
      if (pendingPlayTarget) {
        const src = pendingPlayTarget.getAttribute('data-yt-src') || '';
        if (src) {
          const join = src.includes('?') ? '&' : '?';
          pendingPlayTarget.setAttribute('src', src + join + 'autoplay=1');
        }
      }
      pendingPlayTarget = null;
      gateYouTubeEmbeds();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGating);
  } else {
    initGating();
  }
})();

