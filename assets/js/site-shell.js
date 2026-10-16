document.addEventListener("click", async (event) => {
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
