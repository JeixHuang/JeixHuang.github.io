document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeKey = "jeix-theme-choice";
  const localeKey = "jeix-locale";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const reducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const finePointer = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
  const localeButtons = Array.from(document.querySelectorAll("[data-locale-option]"));
  const revealTargets = Array.from(document.querySelectorAll(".identity-rail, .intro-section, .section-head, .work-entry, .site-footer"));
  const workEntries = Array.from(document.querySelectorAll(".work-entry"));

  function readPersisted(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  function addMediaListener(query, callback) {
    if (!query) return;
    if (typeof query.addEventListener === "function") query.addEventListener("change", callback);
    else if (typeof query.addListener === "function") query.addListener(callback);
  }

  function resolvedTheme(choice) {
    if (choice === "system") return media && media.matches ? "dark" : "light";
    return choice === "light" ? "light" : "dark";
  }

  function applyTheme(choice, shouldPersist = false) {
    const safeChoice = ["light", "dark", "system"].includes(choice) ? choice : "dark";
    const theme = resolvedTheme(safeChoice);
    root.dataset.themeChoice = safeChoice;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeOption === safeChoice));
    });
    if (shouldPersist) persist(themeKey, safeChoice);
    root.dispatchEvent(new CustomEvent("jeix:themechange", { detail: { theme } }));
  }

  function applyLocale(locale, shouldPersist = false) {
    const safeLocale = locale === "zh" ? "zh" : "en";
    root.dataset.locale = safeLocale;
    root.lang = safeLocale === "zh" ? "zh-CN" : "en-US";
    localeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.localeOption === safeLocale));
    });
    if (shouldPersist) persist(localeKey, safeLocale);
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeOption, true));
  });

  localeButtons.forEach((button) => {
    button.addEventListener("click", () => applyLocale(button.dataset.localeOption, true));
  });

  function setupMotion() {
    const motionIsReduced = reducedMotion && reducedMotion.matches;
    root.dataset.motion = motionIsReduced ? "reduced" : "ready";
    revealTargets.forEach((target) => target.classList.add("reveal-target"));

    if (motionIsReduced || !("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -7% 0px",
      threshold: 0.08,
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  function setupPointerLight() {
    if ((reducedMotion && reducedMotion.matches) || !(finePointer && finePointer.matches)) return;
    workEntries.forEach((entry) => {
      entry.addEventListener("pointermove", (event) => {
        const bounds = entry.getBoundingClientRect();
        entry.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
        entry.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  addMediaListener(media, () => {
    if (root.dataset.themeChoice === "system") applyTheme("system");
  });

  applyTheme(readPersisted(themeKey, root.dataset.themeChoice || "dark"));
  applyLocale(readPersisted(localeKey, root.dataset.locale || "en"));
  setupMotion();
  setupPointerLight();
});
