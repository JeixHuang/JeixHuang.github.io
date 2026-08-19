document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeKey = "jeix-theme-choice";
  const localeKey = "jeix-locale";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
  const localeButtons = Array.from(document.querySelectorAll("[data-locale-option]"));
  const writingFilterButtons = Array.from(document.querySelectorAll("[data-writing-filter]"));
  const writingEntries = Array.from(document.querySelectorAll("[data-writing-tag]"));
  const writingEmpty = document.querySelector("[data-writing-empty]");

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

  function applyWritingFilter(filter) {
    const safeFilter = ["all", "paper", "project"].includes(filter) ? filter : "all";
    let visibleCount = 0;

    writingEntries.forEach((entry) => {
      const isVisible = safeFilter === "all" || entry.dataset.writingTag === safeFilter;
      entry.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    writingFilterButtons.forEach((button) => {
      const isActive = button.dataset.writingFilter === safeFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (writingEmpty) writingEmpty.hidden = visibleCount !== 0;
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeOption, true));
  });

  localeButtons.forEach((button) => {
    button.addEventListener("click", () => applyLocale(button.dataset.localeOption, true));
  });

  writingFilterButtons.forEach((button) => {
    button.addEventListener("click", () => applyWritingFilter(button.dataset.writingFilter));
  });

  if (media) {
    media.addEventListener("change", () => {
      if (root.dataset.themeChoice === "system") applyTheme("system");
    });
  }

  applyTheme(readPersisted(themeKey, root.dataset.themeChoice || "dark"));
  applyLocale(readPersisted(localeKey, root.dataset.locale || "en"));
  applyWritingFilter("all");
});
