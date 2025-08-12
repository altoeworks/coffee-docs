// Changelog modal: reusable across pages. Injects modal if missing and
// opens when any element with [data-open-changelog] or #footer-open-changelog is clicked.
(function () {
  function ensureModal() {
    if (document.getElementById('changelog-modal')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'changelog-modal';
    wrapper.className = 'fixed inset-0 z-50 opacity-0 pointer-events-none transition-opacity duration-300';
    wrapper.innerHTML = `
      <div class="absolute inset-0 bg-black/50" data-close-changelog></div>
      <div class="absolute left-1/2 top-16 -translate-x-1/2 w-[92vw] max-w-2xl">
        <div class="rounded-xl bg-white/90 dark:bg-darksection/90 backdrop-blur-sm border border-main/10 dark:border-darkborder shadow-2xl">
          <div class="flex items-center justify-between p-4 border-b border-main/10 dark:border-darkborder">
            <h3 class="text-lg font-semibold text-main dark:text-background">Changelog</h3>
            <button id="close-changelog" class="p-2 rounded hover:bg-main/10 dark:hover:bg-background/10" aria-label="Close changelog">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div id="changelog-list" class="p-4 space-y-4 max-h-[70vh] overflow-y-auto text-main/80 dark:text-background/80">
            <div class="text-sm opacity-60">Loading…</div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrapper);
  }

  function openModal() {
    const modal = document.getElementById('changelog-modal');
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    const modal = document.getElementById('changelog-modal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  async function loadChangelog() {
    const list = document.getElementById('changelog-list');
    if (!list) return;
    try {
      const res = await fetch('changelog.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('Failed to load changelog');
      const entries = await res.json();
      renderEntries(entries);
    } catch (e) {
      console.error(e);
      list.innerHTML = '<div class="text-sm opacity-60">Could not load changelog.</div>';
    }
  }
  function renderEntries(entries) {
    const list = document.getElementById('changelog-list');
    if (!list) return;
    if (!Array.isArray(entries) || entries.length === 0) {
      list.innerHTML = '<div class="text-sm opacity-60">No entries yet.</div>';
      return;
    }
    const html = entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((e) => {
        const date = e.date ? new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : '';
        return `
          <article class="rounded-lg border border-main/10 dark:border-darkborder bg-white/70 dark:bg-darksection/80 p-4">
            <div class="flex items-center justify-between mb-1">
              <h4 class="font-semibold text-main dark:text-background">${escapeHtml(e.title || 'Update')}</h4>
              <time class="text-xs text-main/60 dark:text-background/60">${date}</time>
            </div>
            <p class="text-sm leading-relaxed">${escapeHtml(e.description || '')}</p>
          </article>`;
      }).join('');
    list.innerHTML = html;
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
  }

  function wireUp() {
    ensureModal();
    const openers = [
      ...document.querySelectorAll('[data-open-changelog]'),
      document.getElementById('footer-open-changelog')
    ].filter(Boolean);
    openers.forEach((el) => el.addEventListener('click', () => {
      openModal();
      loadChangelog();
    }));
    const modal = document.getElementById('changelog-modal');
    const closeBtn = document.getElementById('close-changelog');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
      if (e.target && e.target.hasAttribute('data-close-changelog')) closeModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();

