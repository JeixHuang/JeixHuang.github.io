// Reveal the chosen palette from its control. The existing handlers own preference storage.
let pendingThemeTurn = null;
function turnTheme(button, nextTheme, apply) {
  const root = document.documentElement;
  if (pendingThemeTurn) {
    pendingThemeTurn.skipTransition();
    pendingThemeTurn = null;
    root.classList.remove("turning-theme");
  }
  if (nextTheme === root.dataset.theme || !document.startViewTransition ||
      root.dataset.userMotion === "paused" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }

  const box = button.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty("--turn-x", x + "px");
  root.style.setProperty("--turn-y", y + "px");
  root.style.setProperty("--turn-radius", Math.ceil(radius) + "px");
  root.classList.add("turning-theme");
  const turn = document.startViewTransition(() => {
    if (pendingThemeTurn === turn) apply();
  });
  pendingThemeTurn = turn;
  turn.ready.catch(() => {}); // A second choice can supersede an in-flight capture.
  turn.finished.finally(() => {
    if (pendingThemeTurn === turn) {
      pendingThemeTurn = null;
      root.classList.remove("turning-theme");
    }
  });
}

document.addEventListener("click", async (event) => {
  if (event.target.closest("[data-motion-toggle]")) {
    const root = document.documentElement;
    root.classList.toggle("motion-resumed", root.dataset.userMotion === "active");
    return;
  }
  const button = event.target.closest("[data-copy-citation]");
  if (!button) return;
  const code = document.getElementById(button.dataset.copyCitation);
  const section = button.closest(".citation-section");
  const status = section && section.querySelector(".citation-feedback");
  if (!code) return;
  const zh = document.documentElement.dataset.locale === "zh";
  try {
    await navigator.clipboard.writeText(code.textContent.trim());
    if (status) status.textContent = zh ? "已复制 BibTeX。" : "BibTeX copied.";
  } catch (_) {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    if (status) status.textContent = zh ? "已选中引用，请按 ⌘C / Ctrl+C 复制。" : "Citation selected. Press ⌘C / Ctrl+C to copy.";
  }
});
