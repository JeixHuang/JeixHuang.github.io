/* ==========================================================================
   Victor Shea-Jay Huang — Unified Site Interactivity
   Locale, Theme, Ambient Motion & Lightfield, Sticky Progress Bar,
   Card 3D Tilt & Spotlight, Quick Reveal, News Fades, Blog Tag Filter,
   Sliding Scroll-Spy TOC, Hover Footnotes, Code & BibTeX Copy
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var LOCALE_KEY = "jeix-locale";
  var THEME_KEY = "jeix-theme-choice";
  var MOTION_KEY = "jeix-motion";

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
     9. Ambient Motion Toggle (persists in localStorage['jeix-motion'])
     ------------------------------------------------------------------------ */
  function applyMotion(mode, persist) {
    var next = mode === "reduced" ? "reduced" : "active";
    root.dataset.motion = next;

    var toggles = document.querySelectorAll("[data-motion-toggle]");
    toggles.forEach(function (btn) {
      var reduced = next === "reduced";
      btn.setAttribute("aria-pressed", reduced ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        reduced ? "Resume ambient motion" : "Pause ambient motion"
      );
      btn.setAttribute(
        "title",
        reduced ? "Resume ambient motion" : "Pause ambient motion"
      );
    });

    if (persist) {
      safeStorageSet(MOTION_KEY, next === "reduced" ? "off" : "on");
    }

    window.dispatchEvent(new CustomEvent("jeix:motionchange", { detail: { motion: next } }));
  }

  function initMotion() {
    var saved = safeStorageGet(MOTION_KEY);
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var initial = root.dataset.motion;
    if (initial !== "active" && initial !== "reduced") {
      initial = saved === "off" || (!saved && prefersReduced) ? "reduced" : "active";
    }
    applyMotion(initial, false);

    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-motion-toggle]");
      if (!btn) return;
      var next = root.dataset.motion === "reduced" ? "active" : "reduced";
      applyMotion(next, true);
    });

    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      var onMqChange = function (e) {
        if (safeStorageGet(MOTION_KEY)) return;
        applyMotion(e.matches ? "reduced" : "active", false);
      };
      if (mq.addEventListener) mq.addEventListener("change", onMqChange);
      else if (mq.addListener) mq.addListener(onMqChange);
    }
  }

  /* ------------------------------------------------------------------------
     10. Frosted Topbar Scroll State & Article Reading Progress Bar
     ------------------------------------------------------------------------ */
  function initTopbarAndProgress() {
    var nav = document.querySelector(".site-nav");
    var bar = document.querySelector(".read-progress-bar");
    if (!nav && !bar) return;

    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      if (nav) {
        nav.classList.toggle("is-scrolled", y > 8);
      }
      if (bar) {
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        var progress = maxScroll > 0 ? Math.max(0, Math.min(1, y / maxScroll)) : 0;
        bar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
      }
    }

    function schedule() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule);
    window.addEventListener("jeix:localechange", schedule);
    update();
  }

  /* ------------------------------------------------------------------------
     11. Top Feathered Ambient 3D Particle Field (Auto-Pauses Offscreen/Hidden)
     ------------------------------------------------------------------------ */
  function initAmbientField() {
    var canvas = document.querySelector(".ambient-field");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var count = 32;
    var particles = [];
    var width = 0;
    var height = 0;
    var rafId = 0;
    var timeSec = 0;
    var lastTs = 0;
    var pointerX = 0;
    var pointerY = 0;
    var smoothX = 0;
    var smoothY = 0;

    // Deterministic pseudo-random distribution so initial frame is balanced
    var seed = 20261121;
    function nextRand() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    for (var i = 0; i < count; i++) {
      var z = 0.25 + nextRand() * 0.75;
      particles.push({
        x: nextRand(),
        y: 0.04 + nextRand() * 0.86,
        z: z,
        vx: (nextRand() - 0.5) * 0.0085 * z,
        vy: (-0.0022 - nextRand() * 0.0038) * z,
        r: 0.9 + z * 1.45,
        phase: nextRand() * Math.PI * 2,
        twinkle: 0.55 + nextRand() * 0.95,
        hue: i % 3
      });
    }

    var LIGHT_PAL = [
      [48, 108, 232],
      [124, 92, 238],
      [212, 128, 76]
    ];
    var DARK_PAL = [
      [112, 174, 255],
      [172, 136, 255],
      [246, 169, 122]
    ];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width || window.innerWidth));
      height = Math.max(1, Math.round(rect.height || 390));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);
      var dark = root.dataset.theme === "dark";
      var pal = dark ? DARK_PAL : LIGHT_PAL;

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        var px = p.x * width + smoothX * 14 * p.z;
        var py = p.y * height + smoothY * 7 * p.z;
        var pulse = 0.68 + 0.32 * Math.sin(timeSec * p.twinkle + p.phase);
        var baseAlpha = dark ? (0.20 + p.z * 0.34) : (0.09 + p.z * 0.13);
        var alpha = baseAlpha * pulse;
        var col = pal[p.hue];

        if (p.z > 0.68) {
          var haloR = p.r * (dark ? 4.4 : 2.8);
          var grad = ctx.createRadialGradient(px, py, 0, px, py, haloR);
          grad.addColorStop(0, "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (alpha * (dark ? 0.45 : 0.34)).toFixed(3) + ")");
          grad.addColorStop(1, "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, haloR, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function shouldRun() {
      if (root.dataset.motion === "reduced") return false;
      if (document.hidden) return false;
      var y = window.scrollY || window.pageYOffset || 0;
      return y < 440;
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      lastTs = 0;
    }

    function tick(ts) {
      if (!shouldRun()) {
        stop();
        return;
      }
      var dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
      lastTs = ts;
      timeSec += dt;

      smoothX += (pointerX - smoothX) * 0.045;
      smoothY += (pointerY - smoothY) * 0.045;

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -0.04) p.x = 1.04;
        else if (p.x > 1.04) p.x = -0.04;
        if (p.y < -0.04) p.y = 1.02;
        else if (p.y > 1.04) p.y = -0.02;
      }

      drawFrame();
      rafId = requestAnimationFrame(tick);
    }

    function syncLifecycle() {
      if (shouldRun()) {
        if (!rafId) {
          lastTs = 0;
          rafId = requestAnimationFrame(tick);
        }
      } else if (rafId) {
        stop();
      }
    }

    resize();
    drawFrame();
    syncLifecycle();

    if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      window.addEventListener("mousemove", function (event) {
        if (!rafId) return;
        pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
        pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      }, { passive: true });
    }

    window.addEventListener("resize", function () {
      resize();
      drawFrame();
    }, { passive: true });
    window.addEventListener("scroll", syncLifecycle, { passive: true });
    document.addEventListener("visibilitychange", syncLifecycle);
    window.addEventListener("jeix:themechange", drawFrame);
    window.addEventListener("jeix:motionchange", syncLifecycle);
  }

  /* ------------------------------------------------------------------------
     12. Hover-Only Card 3D Micro-Tilt & Pointer Spotlight
     ------------------------------------------------------------------------ */
  function initCardInteractions() {
    if (window.matchMedia && !window.matchMedia("(any-hover: hover)").matches) {
      return;
    }

    var artFrames = Array.prototype.slice.call(document.querySelectorAll(".post-art-frame"));
    artFrames.forEach(function (frame) {
      var raf = 0;
      var lastEv = null;

      function applyTilt() {
        raf = 0;
        if (!lastEv || root.dataset.motion === "reduced") return;
        var rect = frame.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var nx = Math.max(0, Math.min(1, (lastEv.clientX - rect.left) / rect.width));
        var ny = Math.max(0, Math.min(1, (lastEv.clientY - rect.top) / rect.height));
        var rx = ((0.5 - ny) * 5.0).toFixed(2) + "deg";
        var ry = ((nx - 0.5) * 5.0).toFixed(2) + "deg";
        frame.style.setProperty("--mx", (nx * 100).toFixed(1) + "%");
        frame.style.setProperty("--my", (ny * 100).toFixed(1) + "%");
        frame.style.setProperty("--rx", rx);
        frame.style.setProperty("--ry", ry);
      }

      function resetTilt() {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        lastEv = null;
        frame.style.setProperty("--rx", "0deg");
        frame.style.setProperty("--ry", "0deg");
        frame.style.setProperty("--mx", "50%");
        frame.style.setProperty("--my", "50%");
      }

      frame.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch" || root.dataset.motion === "reduced") return;
        lastEv = event;
        if (!raf) raf = requestAnimationFrame(applyTilt);
      }, { passive: true });
      frame.addEventListener("pointerleave", resetTilt);
      window.addEventListener("jeix:motionchange", function (ev) {
        if (ev.detail && ev.detail.motion === "reduced") resetTilt();
      });
    });

    var spotCards = Array.prototype.slice.call(
      document.querySelectorAll(".research-card, .project-card, .mini-project-card")
    );
    spotCards.forEach(function (card) {
      var raf = 0;
      var lastEv = null;

      function applySpot() {
        raf = 0;
        if (!lastEv || root.dataset.motion === "reduced") return;
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", Math.round(lastEv.clientX - rect.left) + "px");
        card.style.setProperty("--my", Math.round(lastEv.clientY - rect.top) + "px");
      }

      card.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch" || root.dataset.motion === "reduced") return;
        lastEv = event;
        if (!raf) raf = requestAnimationFrame(applySpot);
      }, { passive: true });

      card.addEventListener("pointerleave", function () {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        lastEv = null;
      });
    });
  }

  /* ------------------------------------------------------------------------
     13. Quick Reveal (Below-the-Fold Only, Zero Initial Viewport Delay)
     ------------------------------------------------------------------------ */
  function initQuickReveal() {
    if (root.dataset.motion === "reduced" || !window.IntersectionObserver) return;

    var selector = ".home-section, .post-card, .project-card, .mini-project-card, .research-card, .viz, .media-stage";
    var candidates = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!candidates.length) return;

    var foldY = window.innerHeight * 0.94;
    var pending = [];
    var parentCounts = new Map();

    candidates.forEach(function (el) {
      if (el.parentElement && el.parentElement.closest(".reveal-pending")) return;
      var rect = el.getBoundingClientRect();
      // Strictly never delay or hide anything already in or near the initial viewport
      if (rect.top <= foldY) return;
      // Avoid hiding a parent section if it owns card children that will stagger individually
      if (el.classList.contains("home-section") && el.querySelector(".research-card, .post-card, .mini-project-card")) {
        return;
      }

      var parent = el.parentElement || document.body;
      var idx = parentCounts.get(parent) || 0;
      parentCounts.set(parent, idx + 1);

      el.style.setProperty("--reveal-delay", Math.min(idx, 4) * 50 + "ms");
      el.classList.add("reveal-pending");
      pending.push(el);
    });

    if (!pending.length) return;

    var remaining = new Set(pending);
    var cleanupRefs = new Map();
    var tornDown = false;

    function cleanupEl(el) {
      var ref = cleanupRefs.get(el);
      if (ref) {
        clearTimeout(ref.timer);
        el.removeEventListener("transitionend", ref.onEnd);
        cleanupRefs.delete(el);
      }
      el.classList.remove("reveal-pending", "is-revealed");
      el.style.removeProperty("--reveal-delay");
      if (remaining.size === 0 && cleanupRefs.size === 0) {
        window.removeEventListener("jeix:motionchange", onMotionChange);
      }
    }

    function teardownObservers() {
      if (tornDown) return;
      tornDown = true;
      io.disconnect();
      window.removeEventListener("scroll", onBottomScroll);
    }

    function revealEl(el, immediate) {
      if (!remaining.has(el)) return;
      remaining.delete(el);
      io.unobserve(el);

      if (immediate) {
        cleanupEl(el);
      } else {
        el.classList.add("is-revealed");
        var delayMs = parseInt(el.style.getPropertyValue("--reveal-delay"), 10) || 0;
        var onEnd = function (ev) {
          if (ev.target === el && ev.propertyName === "opacity") {
            cleanupEl(el);
          }
        };
        el.addEventListener("transitionend", onEnd);
        var timer = setTimeout(function () {
          cleanupEl(el);
        }, delayMs + 480);
        cleanupRefs.set(el, { timer: timer, onEnd: onEnd });
      }

      if (remaining.size === 0) {
        teardownObservers();
      }
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          revealEl(entry.target, false);
        });
      },
      { rootMargin: "0px 0px 40px 0px", threshold: 0.01 }
    );

    pending.forEach(function (el) {
      io.observe(el);
    });

    function revealAll(immediate) {
      var list = [];
      remaining.forEach(function (el) {
        list.push(el);
      });
      list.forEach(function (el) {
        revealEl(el, immediate);
      });
      if (immediate) {
        pending.forEach(cleanupEl);
      }
      teardownObservers();
    }

    function onMotionChange(ev) {
      if (ev.detail && ev.detail.motion === "reduced") {
        revealAll(true);
      }
    }

    // Guarantee nothing near the very bottom can remain hidden on fast scroll
    function onBottomScroll() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y + window.innerHeight >= document.documentElement.scrollHeight - 20) {
        revealAll(false);
      }
    }

    window.addEventListener("jeix:motionchange", onMotionChange);
    window.addEventListener("scroll", onBottomScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function boot() {
    initLocale();
    initTheme();
    initMotion();
    initTopbarAndProgress();
    initAmbientField();
    initCardInteractions();
    initQuickReveal();
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
