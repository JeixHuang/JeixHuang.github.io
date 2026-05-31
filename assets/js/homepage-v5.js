document.addEventListener("DOMContentLoaded", () => {
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
