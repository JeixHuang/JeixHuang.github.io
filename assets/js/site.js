/* ==========================================================================
   Victor Shea-Jay Huang — Unified Site Interactivity
   Locale, Theme, Scrollable News fades, Blog Tag Filter, Sliding Scroll-Spy TOC,
   Hover Footnotes, Code & BibTeX Copy
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var LOCALE_KEY = "jeix-locale";
  var THEME_KEY = "jeix-theme-choice";

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeStorageSet(key, val) {
    try {
      window.localStorage.setItem(key, val);
    } catch (err) {}
  }

  /* ------------------------------------------------------------------------
     1. Locale Control (EN / 中)
     ------------------------------------------------------------------------ */
  function applyLocale(locale, persist) {
    var next = locale === "zh" ? "zh" : "en";
    root.dataset.locale = next;
    root.lang = next === "zh" ? "zh-CN" : "en-US";

    var buttons = document.querySelectorAll("[data-locale-option]");
    buttons.forEach(function (btn) {
      var active = btn.getAttribute("data-locale-option") === next;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (persist) {
      safeStorageSet(LOCALE_KEY, next);
    }

    window.dispatchEvent(new CustomEvent("jeix:localechange", { detail: { locale: next } }));
  }

  function initLocale() {
    var initial = root.dataset.locale || safeStorageGet(LOCALE_KEY) || "en";
    applyLocale(initial, false);

    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-locale-option]");
      if (!btn) return;
      applyLocale(btn.getAttribute("data-locale-option"), true);
    });
  }

  /* ------------------------------------------------------------------------
     2. Theme Control (Light default / Dark toggle)
     ------------------------------------------------------------------------ */
  function applyTheme(theme, persist) {
    var next = theme === "dark" ? "dark" : "light";
    root.dataset.theme = next;
    root.style.colorScheme = next;

    var toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      btn.setAttribute(
        "title",
        next === "dark" ? "Light mode" : "Dark mode"
      );
    });

    if (persist) {
      safeStorageSet(THEME_KEY, next);
    }

    window.dispatchEvent(new CustomEvent("jeix:themechange", { detail: { theme: next } }));
  }

  function initTheme() {
    var initial = root.dataset.theme || safeStorageGet(THEME_KEY) || "light";
    applyTheme(initial, false);

    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-theme-toggle]");
      if (!btn) return;
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  }

  /* ------------------------------------------------------------------------
     3. Scrollable News Box Fades
     ------------------------------------------------------------------------ */
  function initNewsScroll() {
    var boxes = document.querySelectorAll(".news-box");
    if (!boxes.length) return;

    function updateBox(box) {
      var scroller = box.querySelector(".news-scroll");
      if (!scroller) return;
      var top = scroller.scrollTop;
      var maxScroll = scroller.scrollHeight - scroller.clientHeight;
      var hasTop = top > 4;
      var hasBottom = maxScroll > 4 && top < maxScroll - 4;
      box.classList.toggle("has-more-top", hasTop);
      box.classList.toggle("has-more-bottom", hasBottom);
    }

    boxes.forEach(function (box) {
      var scroller = box.querySelector(".news-scroll");
      if (!scroller) return;
      scroller.addEventListener("scroll", function () {
        updateBox(box);
      }, { passive: true });
      updateBox(box);
    });

    window.addEventListener("resize", function () {
      boxes.forEach(updateBox);
    }, { passive: true });

    window.addEventListener("jeix:localechange", function () {
      requestAnimationFrame(function () {
        boxes.forEach(updateBox);
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Blog Tag Filtering
     ------------------------------------------------------------------------ */
  function initTagFilters() {
    var bar = document.querySelector("[data-tag-filters]");
    if (!bar) return;

    var pills = Array.prototype.slice.call(bar.querySelectorAll("[data-filter-tag]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".post-card[data-tags]"));
    var countEl = document.querySelector("[data-post-count]");

    function applyFilter(tag) {
      var visible = 0;
      pills.forEach(function (pill) {
        var active = pill.getAttribute("data-filter-tag") === tag;
        pill.setAttribute("aria-pressed", active ? "true" : "false");
      });

      cards.forEach(function (card) {
        var raw = (card.getAttribute("data-tags") || "").split("|").filter(Boolean);
        var match = tag === "all" || raw.indexOf(tag) !== -1;
        card.hidden = !match;
        if (match) visible += 1;
      });

      if (countEl) {
        countEl.textContent = String(visible);
        var unitEn = document.querySelector("[data-post-unit-en]");
        if (unitEn) {
          unitEn.textContent = visible === 1 ? "post" : "posts";
        }
      }
    }

    bar.addEventListener("click", function (event) {
      var pill = event.target.closest("[data-filter-tag]");
      if (!pill) return;
      applyFilter(pill.getAttribute("data-filter-tag") || "all");
    });
  }

  /* ------------------------------------------------------------------------
     5. Sliding Scroll-Spy TOC (Desktop Vertical Rail + Mobile Horizontal Strip)
     ------------------------------------------------------------------------ */
  function initSlidingToc() {
    var tocNav = document.querySelector(".toc-nav");
    var tocStrip = document.querySelector(".toc-strip-list");
    if (!tocNav && !tocStrip) return;

    var indicator = tocNav ? tocNav.querySelector(".toc-indicator") : null;
    var tocPanel = document.querySelector(".toc-panel");
    var tocScroll = document.querySelector(".toc-scroll");

    function updateTocFades() {
      if (!tocPanel || !tocScroll) return;
      var maxScroll = tocScroll.scrollHeight - tocScroll.clientHeight;
      var hasTop = tocScroll.scrollTop > 4;
      var hasBottom = maxScroll > 4 && tocScroll.scrollTop < maxScroll - 4;
      tocPanel.classList.toggle("has-toc-top", hasTop);
      tocPanel.classList.toggle("has-toc-fade", hasBottom);
    }

    if (tocScroll) {
      tocScroll.addEventListener("scroll", updateTocFades, { passive: true });
    }
    var sideLinks = tocNav ? Array.prototype.slice.call(tocNav.querySelectorAll('a[href^="#"]')) : [];
    var stripLinks = tocStrip ? Array.prototype.slice.call(tocStrip.querySelectorAll('a[href^="#"]')) : [];

    var entries = [];
    var sourceLinks = sideLinks.length ? sideLinks : stripLinks;
    var lastH2StripLink = null;
    sourceLinks.forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute("href").slice(1));
      var target = document.getElementById(id);
      if (!target) return;
      var sLink = sideLinks.find(function (el) {
        return decodeURIComponent(el.getAttribute("href").slice(1)) === id;
      }) || null;
      var ownStripLink = stripLinks.find(function (el) {
        return decodeURIComponent(el.getAttribute("href").slice(1)) === id;
      }) || null;
      if (ownStripLink) {
        lastH2StripLink = ownStripLink;
      }
      var mLink = ownStripLink || lastH2StripLink;
      entries.push({ id: id, target: target, sideLink: sLink, stripLink: mLink });
    });

    if (!entries.length) return;

    var activeId = null;
    var ticking = false;

    function moveIndicator(link) {
      if (!indicator || !tocNav || !link) return;
      var navRect = tocNav.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();
      if (linkRect.height === 0) return;

      var top = linkRect.top - navRect.top;
      var height = Math.max(18, Math.round(linkRect.height - 8));
      var offsetTop = Math.round(top + 4);

      indicator.style.transform = "translateY(" + offsetTop + "px)";
      indicator.style.height = height + "px";
      indicator.style.opacity = "1";
    }

    function scrollTocToCenter(link) {
      if (!tocScroll || !link) return;
      if (tocScroll.scrollHeight <= tocScroll.clientHeight + 2) return;
      var cRect = tocScroll.getBoundingClientRect();
      var lRect = link.getBoundingClientRect();
      var relTop = lRect.top - cRect.top + tocScroll.scrollTop;
      var desired = relTop - tocScroll.clientHeight / 2 + lRect.height / 2;
      var clamped = Math.max(0, Math.min(desired, tocScroll.scrollHeight - tocScroll.clientHeight));
      if (Math.abs(tocScroll.scrollTop - clamped) > 20) {
        tocScroll.scrollTo({ top: clamped, behavior: "smooth" });
      }
    }

    function scrollStripToLink(link) {
      if (!tocStrip || !link) return;
      if (tocStrip.scrollWidth <= tocStrip.clientWidth + 2) return;
      var left = link.offsetLeft - tocStrip.clientWidth / 2 + link.offsetWidth / 2;
      tocStrip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }

    function setActive(id, shouldAutoScroll) {
      if (!id) return;
      var changed = id !== activeId;
      activeId = id;
      var currentEntry = null;

      entries.forEach(function (entry) {
        var isCurrent = entry.id === id;
        if (isCurrent) currentEntry = entry;
        if (entry.sideLink) {
          entry.sideLink.classList.toggle("is-active", isCurrent);
          if (isCurrent) entry.sideLink.setAttribute("aria-current", "location");
          else entry.sideLink.removeAttribute("aria-current");
        }
      });

      var activeStripLink = currentEntry ? currentEntry.stripLink : null;
      stripLinks.forEach(function (link) {
        var isCurrentStrip = link === activeStripLink;
        link.classList.toggle("is-active", isCurrentStrip);
        if (isCurrentStrip) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });

      if (currentEntry) {
        moveIndicator(currentEntry.sideLink);
        if (changed && shouldAutoScroll) {
          scrollTocToCenter(currentEntry.sideLink);
          scrollStripToLink(activeStripLink);
        }
      }
    }

    function computeActiveHeading() {
      var scrollY = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight;
      var winHeight = window.innerHeight;
      var threshold = 132;

      if (scrollY > 0 && docHeight > winHeight + 24 && scrollY + winHeight >= docHeight - 24) {
        return entries[entries.length - 1].id;
      }

      var current = entries[0].id;
      for (var i = 0; i < entries.length; i++) {
        var rect = entries[i].target.getBoundingClientRect();
        if (rect.top <= threshold) {
          current = entries[i].id;
        } else {
          break;
        }
      }
      return current;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        setActive(computeActiveHeading(), true);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", function () {
      setActive(computeActiveHeading(), true);
    }, { passive: true });
    window.addEventListener("resize", function () {
      setActive(computeActiveHeading(), false);
      updateTocFades();
    }, { passive: true });
    window.addEventListener("jeix:localechange", function () {
      requestAnimationFrame(function () {
        setActive(computeActiveHeading(), false);
        updateTocFades();
      });
    });

    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(
        function () {
          setActive(computeActiveHeading(), true);
        },
        { rootMargin: "-90px 0px -65% 0px", threshold: [0, 1] }
      );
      entries.forEach(function (entry) {
        io.observe(entry.target);
      });
    }

    // Immediate click feedback (bound once per link)
    sideLinks.concat(stripLinks).forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute("href").slice(1));
      link.addEventListener("click", function () {
        setActive(id, true);
      });
    });

    // Initial position after layout, fonts, and full page load settle
    requestAnimationFrame(function () {
      setActive(computeActiveHeading(), false);
      updateTocFades();
    });
    window.addEventListener("load", function () {
      setActive(computeActiveHeading(), false);
      updateTocFades();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        setActive(computeActiveHeading(), false);
        updateTocFades();
      });
    }
  }

  /* ------------------------------------------------------------------------
     6. Hover / Click Footnotes (.fn-ref + floating .fn-pop)
     ------------------------------------------------------------------------ */
  function initFootnotes() {
    var refs = Array.prototype.slice.call(document.querySelectorAll(".fn-ref"));
    if (!refs.length) return;

    var pop = document.createElement("div");
    pop.className = "fn-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Footnote");
    document.body.appendChild(pop);

    var activeBtn = null;
    var pinned = false;
    var suppressFocusOpen = false;
    var closeTimer = null;

    function resolveTarget(btn) {
      var num = btn.getAttribute("data-fn");
      if (!num) return null;
      return document.getElementById("ref-" + num) || document.getElementById("fn-" + num);
    }

    function resolveContent(btn) {
      var locale = root.dataset.locale === "zh" ? "zh" : "en";
      var note = btn.getAttribute("data-note-" + locale) || btn.getAttribute("data-note");
      if (note) return note;

      var refEl = resolveTarget(btn);
      if (refEl) return refEl.innerHTML;
      return "";
    }

    function positionPop(btn) {
      var rect = btn.getBoundingClientRect();
      var popRect = pop.getBoundingClientRect();
      var margin = 12;
      var left = rect.left + rect.width / 2 - popRect.width / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - popRect.width - margin));

      var top = rect.top - popRect.height - 10;
      if (top < margin + 60) {
        top = rect.bottom + 10;
      }

      pop.style.left = Math.round(left) + "px";
      pop.style.top = Math.round(top) + "px";
    }

    function openPop(btn, isPinned) {
      clearTimeout(closeTimer);
      var html = resolveContent(btn);
      if (!html) return;

      if (activeBtn && activeBtn !== btn) {
        activeBtn.setAttribute("aria-expanded", "false");
      }
      activeBtn = btn;
      pinned = Boolean(isPinned);
      btn.setAttribute("aria-expanded", "true");

      var target = resolveTarget(btn);
      var jumpHtml = "";
      if (target && target.id) {
        var jumpLabel = root.dataset.locale === "zh" ? "跳至参考文献 ↓" : "Jump to reference ↓";
        jumpHtml =
          '<div class="fn-pop-foot">' +
          '<a class="fn-pop-jump" href="#' + encodeURIComponent(target.id) + '">' + jumpLabel + "</a>" +
          "</div>";
      }

      pop.innerHTML = '<div class="fn-pop-body">' + html + "</div>" + jumpHtml;
      pop.classList.add("is-open");
      positionPop(btn);
    }

    function closeNow() {
      clearTimeout(closeTimer);
      if (activeBtn) {
        activeBtn.setAttribute("aria-expanded", "false");
        activeBtn = null;
      }
      pinned = false;
      pop.classList.remove("is-open");
    }

    function scheduleClose() {
      if (pinned) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeNow, 160);
    }

    function isKeyboardFocus(el) {
      try {
        return el.matches(":focus-visible");
      } catch (err) {
        return false;
      }
    }

    refs.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");

      btn.addEventListener("mouseenter", function () {
        if (pinned && activeBtn !== btn) return;
        openPop(btn, pinned && activeBtn === btn);
      });

      btn.addEventListener("focus", function () {
        if (suppressFocusOpen) {
          suppressFocusOpen = false;
          return;
        }
        // Only open hover preview on keyboard navigation, avoiding mouse focus-before-click race
        if (!pinned && isKeyboardFocus(btn)) {
          openPop(btn, false);
        }
      });

      btn.addEventListener("mouseleave", scheduleClose);
      btn.addEventListener("blur", function () {
        if (!pinned) scheduleClose();
      });

      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        if (activeBtn === btn && pinned && pop.classList.contains("is-open")) {
          closeNow();
        } else {
          openPop(btn, true);
        }
      });
    });

    pop.addEventListener("click", function (event) {
      var jumpLink = event.target.closest(".fn-pop-jump");
      if (jumpLink) {
        event.preventDefault();
        var targetId = decodeURIComponent(jumpLink.getAttribute("href").slice(1));
        var targetEl = document.getElementById(targetId);
        closeNow();
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      event.stopPropagation();
    });

    pop.addEventListener("mouseenter", function () {
      clearTimeout(closeTimer);
    });
    pop.addEventListener("mouseleave", scheduleClose);

    document.addEventListener("click", function (event) {
      if (!activeBtn) return;
      if (!pop.contains(event.target) && !event.target.closest(".fn-ref")) {
        closeNow();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && activeBtn) {
        var btnToFocus = activeBtn;
        closeNow();
        suppressFocusOpen = true;
        btnToFocus.focus();
        suppressFocusOpen = false;
      }
    });

    window.addEventListener("jeix:localechange", function () {
      if (activeBtn && pop.classList.contains("is-open")) {
        openPop(activeBtn, pinned);
      }
    });

    window.addEventListener("scroll", function () {
      if (!activeBtn || !pop.classList.contains("is-open")) return;
      var rect = activeBtn.getBoundingClientRect();
      if (rect.top < 64 || rect.bottom > window.innerHeight - 16) {
        closeNow();
      } else {
        positionPop(activeBtn);
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     7. Copy Helper, Code Block Copy Buttons & BibTeX Copy
     ------------------------------------------------------------------------ */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function initCodeCopy() {
    var blocks = document.querySelectorAll(".article-body pre");
    blocks.forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains("code-wrap")) return;
      var code = pre.querySelector("code");
      if (!code) return;

      var wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode.insertBefore(wrap, pre);

      var bar = document.createElement("div");
      bar.className = "code-bar";

      var langMatch = (code.className || "").match(/language-([a-z0-9+-]+)/i);
      var tag = document.createElement("span");
      tag.className = "code-lang-tag";
      tag.textContent = langMatch ? langMatch[1] : "code";
      bar.appendChild(tag);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        copyText(code.textContent || "").then(function () {
          btn.textContent = "Copied";
          setTimeout(function () {
            btn.textContent = "Copy";
          }, 1600);
        });
      });
      bar.appendChild(btn);

      wrap.appendChild(bar);
      wrap.appendChild(pre);
    });

    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-copy-citation]");
      if (!btn) return;
      var targetId = btn.getAttribute("data-copy-citation");
      var el = document.getElementById(targetId);
      if (!el) return;
      var status = btn.closest(".post-citation")
        ? btn.closest(".post-citation").querySelector(".copy-status")
        : null;

      copyText(el.textContent || "").then(function () {
        var orig = btn.textContent;
        btn.textContent = "Copied";
        if (status) status.textContent = "BibTeX copied to clipboard.";
        setTimeout(function () {
          btn.textContent = orig;
          if (status) status.textContent = "";
        }, 1800);
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. Back to Top
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".back-to-top");
      if (!btn) return;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function boot() {
    initLocale();
    initTheme();
    initNewsScroll();
    initTagFilters();
    initSlidingToc();
    initFootnotes();
    initCodeCopy();
    initBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
