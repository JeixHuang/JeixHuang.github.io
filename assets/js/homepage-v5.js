document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeKey = "jeix-theme-choice";
  const localeKey = "jeix-locale";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  const copy = {
    en: {
      showMoreNews: (count) => `Show ${count} more news`,
      showFewerNews: "Show fewer news",
      showAllPubs: "Show all publications",
      showFewerPubs: "Show fewer publications",
    },
    zh: {
      showMoreNews: (count) => `展开 ${count} 条近况`,
      showFewerNews: "收起近况",
      showAllPubs: "展开全部论文",
      showFewerPubs: "收起论文",
    },
  };

  function currentLocale() {
    return root.dataset.locale === "zh" ? "zh" : "en";
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Private browsing should not break page controls.
    }
  }

  function readPersisted(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function resolveTheme(choice) {
    if (choice === "light" || choice === "dark") return choice;
    return media && media.matches ? "dark" : "light";
  }

  function applyTheme(choice) {
    const nextChoice = ["light", "dark", "system"].includes(choice) ? choice : "dark";
    const theme = resolveTheme(nextChoice);
    root.dataset.theme = theme;
    root.dataset.themeChoice = nextChoice;
    root.style.colorScheme = theme;
    document.querySelectorAll("[data-theme-option]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeOption === nextChoice));
    });
  }

  function applyLocale(locale) {
    const nextLocale = locale === "zh" ? "zh" : "en";
    root.dataset.locale = nextLocale;
    root.lang = nextLocale === "zh" ? "zh-CN" : "en-US";
    document.querySelectorAll("[data-locale-option]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.localeOption === nextLocale));
    });
    updateTimelineToggle();
    updateExpandButton();
  }

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.themeOption || "dark";
      persist(themeKey, choice);
      applyTheme(choice);
    });
  });

  document.querySelectorAll("[data-locale-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const locale = button.dataset.localeOption || "en";
      persist(localeKey, locale);
      applyLocale(locale);
    });
  });

  if (media) {
    const onSystemThemeChange = () => {
      if (root.dataset.themeChoice === "system") {
        applyTheme("system");
      }
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSystemThemeChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSystemThemeChange);
    }
  }

  const timelineList = document.querySelector("[data-timeline-list]");
  const timelineToggle = document.querySelector("[data-timeline-toggle]");
  const visibleTimelineItems = 5;
  let hiddenTimelineCount = 0;

  function updateTimelineToggle() {
    if (!timelineList || !timelineToggle) return;
    if (hiddenTimelineCount === 0) {
      timelineToggle.hidden = true;
      return;
    }
    const expanded = timelineList.classList.contains("is-expanded");
    const locale = currentLocale();
    timelineToggle.textContent = expanded ? copy[locale].showFewerNews : copy[locale].showMoreNews(hiddenTimelineCount);
  }

  if (timelineList && timelineToggle) {
    const timelineItems = Array.from(timelineList.querySelectorAll(".timeline-item"));
    hiddenTimelineCount = Math.max(0, timelineItems.length - visibleTimelineItems);

    if (hiddenTimelineCount === 0) {
      timelineToggle.hidden = true;
    } else {
      timelineToggle.addEventListener("click", () => {
        const nextExpanded = !timelineList.classList.contains("is-expanded");
        timelineList.classList.toggle("is-expanded", nextExpanded);
        timelineToggle.setAttribute("aria-expanded", String(nextExpanded));
        updateTimelineToggle();
      });
    }
  }

  const githubStarBadges = Array.from(document.querySelectorAll("[data-github-stars]"));
  const starCacheMs = 6 * 60 * 60 * 1000;

  function formatStarCount(count) {
    if (!Number.isFinite(count)) return "Stars";
    if (count < 1000) return String(count);
    if (count < 1000000) {
      const value = count / 1000;
      return `${value >= 10 ? Math.round(value) : value.toFixed(1)}k`;
    }
    const value = count / 1000000;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1)}m`;
  }

  function readCachedStars(repo) {
    try {
      const cached = JSON.parse(localStorage.getItem(`github-stars:${repo}`) || "null");
      if (cached && Date.now() - cached.cachedAt < starCacheMs) return cached.count;
    } catch (error) {
      return undefined;
    }
    return undefined;
  }

  function writeCachedStars(repo, count) {
    try {
      localStorage.setItem(`github-stars:${repo}`, JSON.stringify({ count, cachedAt: Date.now() }));
    } catch (error) {}
  }

  function updateStarBadges(repo, count) {
    document.querySelectorAll(`[data-github-stars="${repo}"]`).forEach((badge) => {
      const countNode = badge.querySelector("[data-github-star-count]");
      if (countNode) countNode.textContent = formatStarCount(count);
      badge.classList.remove("is-loading", "is-error");
      badge.classList.add("is-loaded");
      badge.setAttribute("aria-label", `${repo} GitHub stars: ${count}`);
    });
  }

  function markStarBadgesError(repo) {
    document.querySelectorAll(`[data-github-stars="${repo}"]`).forEach((badge) => {
      badge.classList.remove("is-loading");
      badge.classList.add("is-error");
    });
  }

  async function hydrateGitHubStars() {
    const repos = Array.from(new Set(githubStarBadges.map((badge) => badge.dataset.githubStars).filter(Boolean)));
    await Promise.all(repos.map(async (repo) => {
      const cached = readCachedStars(repo);
      if (Number.isFinite(cached)) {
        updateStarBadges(repo, cached);
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        const data = await response.json();
        const count = Number(data.stargazers_count);
        if (!Number.isFinite(count)) throw new Error("Missing stargazers_count");
        writeCachedStars(repo, count);
        updateStarBadges(repo, count);
      } catch (error) {
        markStarBadgesError(repo);
      }
    }));
  }

  if (githubStarBadges.length > 0) {
    hydrateGitHubStars();
  }

  const publicationTabs = Array.from(document.querySelectorAll(".pub-tab"));
  const publicationPanels = Array.from(document.querySelectorAll(".publication-panel"));

  function activatePanel(target, shouldScroll) {
    publicationTabs.forEach((tab) => {
      const active = tab.dataset.target === target;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    publicationPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
    if (shouldScroll) {
      document.getElementById("publications")?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#publications");
    }
  }

  publicationTabs.forEach((tab) => {
    tab.addEventListener("click", () => activatePanel(tab.dataset.target, true));
  });

  const expandButton = document.querySelector(".expand-button");

  function updateExpandButton() {
    if (!expandButton) return;
    const locale = currentLocale();
    const expanded = expandButton.dataset.expanded === "true";
    expandButton.textContent = expanded ? copy[locale].showFewerPubs : copy[locale].showAllPubs;
  }

  if (expandButton) {
    expandButton.addEventListener("click", () => {
      const isExpanded = expandButton.dataset.expanded === "true";
      const nextExpanded = !isExpanded;
      document.querySelectorAll(".publication-panel[data-panel='selected'] .selected-extra").forEach((card) => {
        card.classList.toggle("is-hidden", !nextExpanded);
      });
      expandButton.dataset.expanded = String(nextExpanded);
      updateExpandButton();
    });
  }

  const requestedPanel = new URLSearchParams(window.location.search).get("panel");
  if (requestedPanel) activatePanel(requestedPanel, false);
  if (new URLSearchParams(window.location.search).get("expanded") === "1" && expandButton && expandButton.dataset.expanded !== "true") {
    expandButton.click();
  }

  applyTheme(readPersisted(themeKey, root.dataset.themeChoice || "dark"));
  applyLocale(readPersisted(localeKey, root.dataset.locale || "en"));
});
