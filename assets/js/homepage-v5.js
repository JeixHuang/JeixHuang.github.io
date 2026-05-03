document.addEventListener("DOMContentLoaded", () => {
  const timelineViewport = document.querySelector("[data-timeline-viewport]");
  const timelineSlider = document.querySelector("[data-timeline-slider]");

  function sizeTimelineViewport() {
    if (!timelineViewport) return;
    const rows = Array.from(timelineViewport.querySelectorAll(".timeline-item"));
    if (rows.length < 6) return;
    const firstTop = rows[0].offsetTop;
    const sixth = rows[5];
    timelineViewport.style.height = `${sixth.offsetTop + sixth.offsetHeight - firstTop}px`;
  }

  function syncTimelineSlider() {
    if (!timelineViewport || !timelineSlider) return;
    sizeTimelineViewport();
    const maxScroll = Math.max(0, timelineViewport.scrollHeight - timelineViewport.clientHeight);
    timelineSlider.max = String(maxScroll);
    timelineSlider.value = String(timelineViewport.scrollTop);
    timelineSlider.disabled = maxScroll === 0;
  }

  if (timelineViewport && timelineSlider) {
    timelineViewport.addEventListener("scroll", () => {
      timelineSlider.value = String(timelineViewport.scrollTop);
    });
    timelineSlider.addEventListener("input", () => {
      timelineViewport.scrollTop = Number(timelineSlider.value);
    });
    window.addEventListener("resize", syncTimelineSlider);
    syncTimelineSlider();
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
  const requestedTimelineScroll = Number(params.get("timelineScroll") || 0);
  if (requestedPanel) activatePanel(requestedPanel, false);
  if (params.get("expanded") === "1" && expandButton && expandButton.dataset.expanded !== "true") {
    expandButton.click();
  }
  if (timelineViewport && requestedTimelineScroll > 0) {
    timelineViewport.scrollTop = Math.min(requestedTimelineScroll, timelineViewport.scrollHeight - timelineViewport.clientHeight);
    syncTimelineSlider();
  }
});
