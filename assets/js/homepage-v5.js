document.addEventListener("DOMContentLoaded", () => {
  const timelineList = document.querySelector("[data-timeline-list]");
  const timelineToggle = document.querySelector("[data-timeline-toggle]");
  const visibleTimelineItems = 5;

  if (timelineList && timelineToggle) {
    const timelineItems = Array.from(timelineList.querySelectorAll(".timeline-item"));
    const hiddenCount = Math.max(0, timelineItems.length - visibleTimelineItems);

    if (hiddenCount === 0) {
      timelineToggle.hidden = true;
    } else {
      timelineToggle.textContent = `Show ${hiddenCount} more news`;
      timelineToggle.addEventListener("click", () => {
        const nextExpanded = !timelineList.classList.contains("is-expanded");
        timelineList.classList.toggle("is-expanded", nextExpanded);
        timelineToggle.setAttribute("aria-expanded", String(nextExpanded));
        timelineToggle.textContent = nextExpanded ? "Show fewer news" : `Show ${hiddenCount} more news`;
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
    } catch (error) {
      // Non-critical: private browsing or storage quota should not break the page.
    }
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
      tab.classList.toggle("active", tab.dataset.target === target);
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
  if (expandButton) {
    expandButton.addEventListener("click", () => {
      const isExpanded = expandButton.dataset.expanded === "true";
      const nextExpanded = !isExpanded;
      document.querySelectorAll(".publication-panel[data-panel='selected'] .selected-extra").forEach((card) => {
        card.classList.toggle("is-hidden", !nextExpanded);
      });
      expandButton.dataset.expanded = String(nextExpanded);
      expandButton.textContent = nextExpanded ? "Show fewer selected publications" : "Show all selected publications";
    });
  }

  const params = new URLSearchParams(window.location.search);
  const requestedPanel = params.get("panel");
  if (requestedPanel) activatePanel(requestedPanel, false);
  if (params.get("expanded") === "1" && expandButton && expandButton.dataset.expanded !== "true") {
    expandButton.click();
  }
});
