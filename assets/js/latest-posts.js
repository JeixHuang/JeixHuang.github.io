(function () {
  var container = document.getElementById('latest-posts');
  if (!container) return;

  var postsUrl = container.getAttribute('data-posts-url') || '/blog/posts.json';
  var listEl = container.querySelector('[data-latest-posts-list]');
  var statusEl = container.querySelector('[data-latest-posts-status]');

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function renderFallback() {
    if (listEl) listEl.innerHTML = '';
    setStatus('');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  fetch(postsUrl, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (posts) {
      if (!Array.isArray(posts) || posts.length === 0) throw new Error('empty');
      var top = posts.slice(0, 3);
      var html = top
        .map(function (p) {
          var title = escapeHtml(p.title || '(untitled)');
          var date = escapeHtml(p.date || '');
          var url = escapeHtml(p.url || '/blog/');
          var excerpt = escapeHtml(p.excerpt || '');
          return (
            '<li class="lp-item">' +
            '<div class="lp-row">' +
            '<a class="lp-title" href="' + url + '">' + title + '</a>' +
            (date ? '<span class="lp-date">' + date + '</span>' : '') +
            '</div>' +
            (excerpt ? '<div class="lp-excerpt">' + excerpt + '</div>' : '') +
            '</li>'
          );
        })
        .join('');
      if (listEl) listEl.innerHTML = html;
      setStatus('');
    })
    .catch(function () {
      renderFallback();
    });
})();


