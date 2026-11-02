document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-blog-link]').forEach(function (link) {
    link.href = document.documentElement.dataset.locale === 'en' ? '/blog/en/' : '/blog/';
  });

  document.querySelectorAll('[data-article-language]').forEach(function (link) {
    link.addEventListener('click', function () {
      try { localStorage.setItem('jeix-locale', link.dataset.articleLanguage); } catch (error) {}
    });
  });

  var toc = document.querySelector('.post-toc details');
  if (toc) {
    var wide = window.matchMedia('(min-width: 1101px)');
    function adaptToc() { toc.open = wide.matches; }
    adaptToc();
    if (wide.addEventListener) wide.addEventListener('change', adaptToc);
    else if (wide.addListener) wide.addListener(adaptToc);
  }

  document.querySelectorAll('[data-copy-citation]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var code = document.getElementById(button.dataset.copyCitation);
      var status = button.closest('.post-citation').querySelector('.copy-status');
      if (!code) return;
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied';
        status.textContent = 'BibTeX copied to clipboard.';
        window.setTimeout(function () { button.textContent = 'Copy BibTeX'; }, 2200);
      } catch (error) {
        var range = document.createRange();
        range.selectNodeContents(code);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'BibTeX selected. Press ⌘C or Ctrl+C to copy.';
      }
    });
  });
});
