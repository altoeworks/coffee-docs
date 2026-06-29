// Marks the nav link matching the current page as active.
// Works for both root-level pages (relative hrefs) and resource sub-pages (absolute hrefs).
(function () {
  var path = window.location.pathname;

  document.querySelectorAll('#top-nav nav a[href], #hamburger-menu a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.indexOf('#') !== -1) return;

    var resolved;
    try {
      resolved = new URL(href, window.location.href).pathname;
    } catch (e) {
      return;
    }

    var active = false;

    if (resolved === '/' || resolved.endsWith('/index.html')) {
      // Home: only active on the actual home page
      active = path === '/' || path === '' || path.endsWith('/index.html');
    } else if (resolved.endsWith('/resources/') || resolved === '/resources') {
      // Resource library directory: active for any path under /resources/
      active = path.startsWith('/resources') || (path + '/').indexOf('/resources/') !== -1;
    } else {
      // Other pages: match by filename
      var basename = resolved.split('/').pop();
      var currentBasename = path.split('/').pop();
      active = basename.length > 0 && basename === currentBasename;
    }

    if (active) {
      link.classList.add('nav-active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
