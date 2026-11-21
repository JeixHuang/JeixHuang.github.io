#!/usr/bin/env python3
"""Zero-dependency Python 3 static site builder for JeixHuang.github.io.

Supports native HTML posts (first-class) and Markdown posts under content/posts/,
single source of truth in data/site.json, and strict draft/showcase boundaries.
Compatible with Python 3.9+.
"""
from __future__ import annotations

import argparse
import datetime as dt
import email.utils
import hashlib
import html
import json
import math
import re
import shutil
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple


REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = REPO_ROOT / "data" / "site.json"
ASSETS_DIR = REPO_ROOT / "assets"
POSTS_DIR = REPO_ROOT / "content" / "posts"
SHOWCASE_DIR = REPO_ROOT / "templates" / "post-starter"


# ---------------------------------------------------------------------------
# Crisp Inline Monochrome SVGs (Zero external icon-font dependency)
# ---------------------------------------------------------------------------
ICONS: Dict[str, str] = {
    "scholar": (
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
        '<path d="M12 3 1 9l4 2.18v6L12 21l7-3.82v-6L23 9 12 3zm0 2.27L18.82 9 12 12.73 5.18 9 12 5.27zM7 12.4l5 2.73 5-2.73v3.52L12 18.65l-5-2.73V12.4z"/>'
        "</svg>"
    ),
    "github": (
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
        '<path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>'
        "</svg>"
    ),
    "linkedin": (
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
        '<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>'
        "</svg>"
    ),
    "x": (
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
        '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
        "</svg>"
    ),
    "email": (
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<rect x="3" y="5" width="18" height="14" rx="2"/>'
        '<path d="m3 7 9 6 9-6"/>'
        "</svg>"
    ),
    "sun": (
        '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<circle cx="12" cy="12" r="4"/>'
        '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'
        "</svg>"
    ),
    "moon": (
        '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
        "</svg>"
    ),
    "motion_on": (
        '<svg class="icon-motion-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M10.5 3.5L12.1 8.4L17 10L12.1 11.6L10.5 16.5L8.9 11.6L4 10L8.9 8.4Z"/>'
        '<path d="M18.2 14.2L19 16.6L21.4 17.4L19 18.2L18.2 20.6L17.4 18.2L15 17.4L17.4 16.6Z"/>'
        "</svg>"
    ),
    "motion_off": (
        '<svg class="icon-motion-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M12 4.5L13.5 9.1L18.1 10.6L13.5 12.1L12 16.7L10.5 12.1L5.9 10.6L10.5 9.1Z" opacity="0.55"/>'
        '<path d="M4.5 19.5L19.5 4.5"/>'
        "</svg>"
    ),
    "agents": (
        '<svg class="research-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6.5" r="2.5"/><circle cx="18" cy="17.5" r="2.5"/>'
        '<path d="M8.3 10.9 15.6 7.5M8.3 13.1l7.3 3.4"/>'
        "</svg>"
    ),
    "physical-ai": (
        '<svg class="research-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<circle cx="12" cy="12" r="8.5"/>'
        '<ellipse cx="12" cy="12" rx="8.5" ry="3.4"/>'
        '<path d="M12 3.5a12 12 0 0 1 0 17M12 3.5a12 12 0 0 0 0 17"/>'
        "</svg>"
    ),
}


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------
def esc(text: Any) -> str:
    return html.escape(str(text or ""), quote=True)


def slugify(text: str) -> str:
    plain = re.sub(r"<[^>]+>", "", text)
    plain = html.unescape(plain).strip().lower()
    plain = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", plain)
    plain = re.sub(r"-{2,}", "-", plain).strip("-")
    return plain or "section"


def file_hash(path: Path) -> str:
    if not path.exists():
        return "dev"
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def parse_date(raw: str) -> dt.date:
    s = str(raw or "").strip()
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return dt.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    return dt.date(2026, 1, 1)


def format_date_en(d: dt.date) -> str:
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return f"{months[d.month - 1]} {d.day}, {d.year}"


def format_date_zh(d: dt.date) -> str:
    return f"{d.year} 年 {d.month} 月 {d.day} 日"


def format_rfc2822(d: dt.date) -> str:
    stamp = dt.datetime(d.year, d.month, d.day, 12, 0, 0, tzinfo=dt.timezone.utc)
    return email.utils.format_datetime(stamp)


def estimate_reading_minutes(body_html: str, bilingual: bool = False) -> int:
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", body_html, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    en_words = len(re.findall(r"[A-Za-z0-9_'-]+", text))
    zh_chars = len(re.findall(r"[\u4e00-\u9fff]", text))
    if bilingual:
        minutes = max(en_words / 220.0, zh_chars / 360.0)
    else:
        minutes = en_words / 220.0 + zh_chars / 360.0
    return max(1, int(math.ceil(minutes)))


def parse_frontmatter_yaml(block: str) -> Dict[str, Any]:
    """Minimal YAML-subset parser for simple Markdown post frontmatter."""
    meta: Dict[str, Any] = {}
    for line in block.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, val = line.split(":", 1)
        key = key.strip()
        val = val.strip()
        if not val:
            meta[key] = ""
        elif val.lower() == "true":
            meta[key] = True
        elif val.lower() == "false":
            meta[key] = False
        elif val.startswith("[") and val.endswith("]"):
            try:
                meta[key] = json.loads(val.replace("'", '"'))
            except json.JSONDecodeError:
                items = [x.strip().strip("\"'") for x in val[1:-1].split(",") if x.strip()]
                meta[key] = items
        elif (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            meta[key] = val[1:-1]
        else:
            meta[key] = val
    return meta


INLINE_MATH_RE = re.compile(
    r"(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|(?<!\\)\$(?!\$)(?!\s)[^$\n]+?(?<!\s)(?<!\\)\$)"
)
INLINE_TAG_RE = re.compile(r"<[^>]+>")


def render_inline_md(text: str) -> str:
    """Render inline Markdown formatting while preserving inline code, math, and raw HTML tags."""
    slots: List[str] = []

    def stash(snippet: str) -> str:
        idx = len(slots)
        slots.append(snippet)
        return f"\x00SLOT{idx}\x00"

    # 1. Protect inline code first
    out = re.sub(r"`([^`]+)`", lambda m: stash(f"<code>{esc(m.group(1))}</code>"), text)
    # 2. Protect inline & display math ($...$, $$...$$, \(...\), \[...\]) before emphasis
    out = INLINE_MATH_RE.sub(lambda m: stash(m.group(0)), out)
    # 3. Protect inline raw HTML tags (e.g. <br>, <span ...>)
    out = INLINE_TAG_RE.sub(lambda m: stash(m.group(0)), out)

    # 4. Standard inline Markdown transforms
    out = re.sub(
        r"!\[([^\]]*)\]\(([^)]+)\)",
        lambda m: stash(f'<img src="{esc(m.group(2))}" alt="{esc(m.group(1))}" loading="lazy">'),
        out,
    )
    out = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{esc(m.group(2))}">{m.group(1)}</a>',
        out,
    )
    out = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", out)

    # 5. Restore protected slots in reverse order (handles nested stashes cleanly)
    for idx in range(len(slots) - 1, -1, -1):
        out = out.replace(f"\x00SLOT{idx}\x00", slots[idx])
    return out


PAIRED_HTML_BLOCK_RE = re.compile(
    r"^<(div|figure|section|table|svg|canvas|video|style|script|details|blockquote|iframe|pre)\b",
    re.I,
)


def _format_list_item_lines(item_lines: List[str]) -> str:
    """Join continuation lines inside a list item, honoring two-space hard line breaks."""
    parts: List[str] = []
    for idx, raw_line in enumerate(item_lines):
        hard_break = raw_line.endswith("  ")
        cleaned = raw_line.strip()
        if not cleaned:
            continue
        rendered = render_inline_md(cleaned)
        if idx < len(item_lines) - 1:
            parts.append(rendered + ("<br>" if hard_break else " "))
        else:
            parts.append(rendered)
    return "".join(parts).strip()


def _consume_list(lines: List[str], start: int, ordered: bool) -> Tuple[str, int]:
    """Consume an ordered or unordered Markdown list, supporting continuation lines and loose blank lines."""
    marker_re = re.compile(r"^\d+\.\s+(.*)$") if ordered else re.compile(r"^[-*+]\s+(.*)$")
    n = len(lines)
    i = start
    items_html: List[str] = []

    while i < n:
        m = marker_re.match(lines[i].strip())
        if not m:
            break
        item_lines = [m.group(1)]
        i += 1

        while i < n:
            cur = lines[i]
            cur_stripped = cur.strip()
            if not cur_stripped:
                # Look ahead past blank lines
                j = i + 1
                while j < n and not lines[j].strip():
                    j += 1
                if j >= n:
                    i = j
                    break
                # Another item of the same list follows -> finish current item, stay in list
                if marker_re.match(lines[j].strip()):
                    i = j
                    break
                # Indented continuation paragraph inside current item
                if lines[j].startswith(("  ", "\t")):
                    item_lines.append("")
                    i = j
                    continue
                # Otherwise list ends
                i = j
                break

            if marker_re.match(cur_stripped) and not cur.startswith(("  ", "\t")):
                break

            if cur.startswith((" ", "\t")):
                item_lines.append(cur)
                i += 1
                continue

            # Non-indented line that is not a new marker stops the list
            break

        items_html.append(f"<li>{_format_list_item_lines(item_lines)}</li>")

        # If next line is not a marker of the same list, stop the list
        if i < n and not marker_re.match(lines[i].strip()):
            break

    tag = "ol" if ordered else "ul"
    return f"<{tag}>" + "".join(items_html) + f"</{tag}>", i


def render_markdown_to_html(md_text: str) -> str:
    """Clean pure-Python Markdown converter supporting raw HTML blocks, math, lists, and code blocks."""
    lines = md_text.splitlines()
    out: List[str] = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Fenced code block
        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            i += 1
            code_lines: List[str] = []
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1
            cls = f' class="language-{esc(lang)}"' if lang else ""
            out.append(f"<pre><code{cls}>{esc(chr(10).join(code_lines))}</code></pre>")
            continue

        # Standalone display math block ($$ ... $$)
        if stripped.startswith("$$"):
            if stripped.endswith("$$") and len(stripped) > 4:
                out.append(f'<div class="math-display">{stripped}</div>')
                i += 1
                continue
            math_lines = [line]
            i += 1
            while i < n:
                math_lines.append(lines[i])
                if lines[i].strip().endswith("$$"):
                    i += 1
                    break
                i += 1
            out.append('<div class="math-display">\n' + "\n".join(math_lines) + "\n</div>")
            continue

        # HTML comment block (may span blank lines)
        if stripped.startswith("<!--"):
            cmt_lines = [line]
            if "-->" not in stripped:
                i += 1
                while i < n:
                    cmt_lines.append(lines[i])
                    if "-->" in lines[i]:
                        i += 1
                        break
                    i += 1
            else:
                i += 1
            out.append("\n".join(cmt_lines))
            continue

        # Paired raw HTML block passthrough (survives internal blank lines)
        html_open = PAIRED_HTML_BLOCK_RE.match(stripped)
        if html_open:
            tag_name = html_open.group(1).lower()
            tag_token_re = re.compile(rf"<(/?){tag_name}\b[^>]*?(/?)>", re.I)
            html_lines: List[str] = []
            depth = 0
            while i < n:
                cur_line = lines[i]
                html_lines.append(cur_line)
                for tm in tag_token_re.finditer(cur_line):
                    is_close = bool(tm.group(1))
                    is_self = bool(tm.group(2))
                    if is_self:
                        continue
                    depth += -1 if is_close else 1
                i += 1
                if depth <= 0:
                    break
            out.append("\n".join(html_lines))
            continue

        # Self-closing HTML <hr>
        if re.match(r"^<hr\b[^>]*/?>$", stripped, re.I):
            out.append(stripped)
            i += 1
            continue

        # Horizontal rule
        if re.match(r"^(-{3,}|\*{3,}|_{3,})$", stripped):
            out.append("<hr>")
            i += 1
            continue

        # Headings
        hm = re.match(r"^(#{1,4})\s+(.*)$", stripped)
        if hm:
            lvl = len(hm.group(1))
            content = render_inline_md(hm.group(2).strip())
            out.append(f"<h{lvl}>{content}</h{lvl}>")
            i += 1
            continue

        # Blockquote
        if stripped.startswith(">"):
            bq_lines: List[str] = []
            while i < n and lines[i].strip().startswith(">"):
                bq_lines.append(re.sub(r"^>\s?", "", lines[i].strip()))
                i += 1
            out.append(f"<blockquote><p>{render_inline_md(' '.join(bq_lines))}</p></blockquote>")
            continue

        # Unordered list
        if re.match(r"^[-*+]\s+", stripped):
            list_html, i = _consume_list(lines, i, ordered=False)
            out.append(list_html)
            continue

        # Ordered list
        if re.match(r"^\d+\.\s+", stripped):
            list_html, i = _consume_list(lines, i, ordered=True)
            out.append(list_html)
            continue

        # Standalone image becomes figure
        im = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)$", stripped)
        if im:
            alt, src = im.group(1), im.group(2)
            out.append(f'<figure><img src="{esc(src)}" alt="{esc(alt)}" loading="lazy"></figure>')
            i += 1
            continue

        # Paragraph
        para: List[str] = [stripped]
        i += 1
        while i < n and lines[i].strip() and not re.match(
            r"^(#{1,4}\s|```|\$\$|>|[-*+]\s|\d+\.\s|<!--|<(?:div|figure|section|table|svg|canvas|video|style|script|details|blockquote|hr|iframe|pre)\b)",
            lines[i].strip(),
            re.I,
        ):
            para.append(lines[i].strip())
            i += 1
        out.append(f"<p>{render_inline_md(' '.join(para))}</p>")

    return "\n\n".join(out)


# ---------------------------------------------------------------------------
# Heading Extraction & Auto-ID Injection (for Sliding TOC)
# ---------------------------------------------------------------------------
SHELL_RESERVED_IDS: Set[str] = {"content", "overview", "citation", "citation-heading"}
ID_ATTR_RE = re.compile(r'\bid\s*=\s*["\']([^"\']+)["\']', re.I)
INERT_OR_HEADING_RE = re.compile(
    r"(?P<comment><!--[\s\S]*?-->)"
    r"|(?P<inert><(?P<itag>script|style|pre|code|template)\b[^>]*>[\s\S]*?</(?P=itag)>)"
    r"|(?P<heading><(?P<htag>h[23])(?P<hattrs>\s[^>]*)?>(?P<hinner>[\s\S]*?)</(?P=htag)>)",
    re.I,
)


def extract_and_id_headings(body_html: str) -> Tuple[str, List[Dict[str, Any]]]:
    """Ensure every real h2/h3 has a unique non-colliding id while skipping comments/scripts/code."""
    toc: List[Dict[str, Any]] = []
    used_ids: Set[str] = set(SHELL_RESERVED_IDS)

    # First pass: reserve all non-heading IDs outside inert blocks/comments
    stripped_body = INERT_OR_HEADING_RE.sub(" ", body_html)
    for m in ID_ATTR_RE.finditer(stripped_body):
        used_ids.add(m.group(1))

    def alloc_id(base: str) -> str:
        hid = base or "section"
        counter = 2
        while hid in used_ids:
            hid = f"{base}-{counter}"
            counter += 1
        used_ids.add(hid)
        return hid

    def replace_token(match: re.Match) -> str:
        if match.group("comment") is not None or match.group("inert") is not None:
            return match.group(0)

        tag = match.group("htag").lower()
        attrs = match.group("hattrs") or ""
        inner = match.group("hinner").strip()

        id_match = ID_ATTR_RE.search(attrs)
        if id_match:
            existing = id_match.group(1)
            if existing not in used_ids:
                hid = existing
                used_ids.add(hid)
                new_attrs = attrs
            else:
                hid = alloc_id(existing)
                new_attrs = ID_ATTR_RE.sub(f'id="{esc(hid)}"', attrs, count=1)
        else:
            en_match = re.search(r'<span[^>]*data-lang=["\']en["\'][^>]*>(.*?)</span>', inner, re.S | re.I)
            base = slugify(en_match.group(1) if en_match else inner)
            hid = alloc_id(base)
            new_attrs = f' id="{esc(hid)}"{attrs}'

        # Strip links/buttons from TOC label while keeping data-lang spans intact
        label_html = re.sub(r"<button[^>]*>.*?</button>", "", inner, flags=re.S | re.I)
        label_html = re.sub(r"</?a\b[^>]*>", "", label_html, flags=re.I).strip()

        toc.append({
            "level": int(tag[1]),
            "id": hid,
            "label_html": label_html,
        })
        return f"<{tag}{new_attrs}>{inner}</{tag}>"

    updated_html = INERT_OR_HEADING_RE.sub(replace_token, body_html)
    return updated_html, toc


# ---------------------------------------------------------------------------
# Deterministic 3D / Luminous SVG Card Artwork Engine (6 Styles × 6 Palettes)
# ---------------------------------------------------------------------------
ART_STYLES: Tuple[str, ...] = ("aurora", "manifold", "ridge", "prism", "orbital", "caustic")
ART_PALETTES: Tuple[str, ...] = ("aurora", "cobalt", "terracotta", "emerald", "violet", "slate")

ART_STYLE_ALIASES: Dict[str, str] = {
    "strata": "ridge",
    "contour": "aurora",
    "blocks": "prism",
    "meridian": "manifold",
    "ribbon": "caustic",
    "terrace": "orbital",
}
ART_PALETTE_ALIASES: Dict[str, str] = {
    "pine": "emerald",
    "plum": "violet",
    "indigo": "aurora",
}


def _art_seed_bytes(seed: str) -> bytes:
    return hashlib.sha256(seed.encode("utf-8")).digest()


def _art_unit(raw: bytes, idx: int) -> float:
    return raw[idx % len(raw)] / 255.0


def _lerp_rgb(c0: Tuple[int, int, int], c1: Tuple[int, int, int], t: float) -> Tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    return (
        int(round(c0[0] + (c1[0] - c0[0]) * t)),
        int(round(c0[1] + (c1[1] - c0[1]) * t)),
        int(round(c0[2] + (c1[2] - c0[2]) * t)),
    )


def _elevation_hex(val: float, shade: float) -> str:
    """Smooth scientific elevation colormap (deep cobalt -> cerulean -> warm sand -> terracotta peak)."""
    stops = [
        (0.00, (24, 52, 128)),
        (0.32, (46, 108, 188)),
        (0.58, (112, 166, 206)),
        (0.78, (226, 174, 122)),
        (1.00, (216, 92, 42)),
    ]
    v = max(0.0, min(1.0, val))
    rgb = stops[-1][1]
    for idx in range(len(stops) - 1):
        t0, col0 = stops[idx]
        t1, col1 = stops[idx + 1]
        if v <= t1:
            local = (v - t0) / max(1e-6, t1 - t0)
            rgb = _lerp_rgb(col0, col1, local)
            break
    # Directional lighting modulation
    lit = max(0.76, min(1.16, shade))
    r = max(0, min(255, int(round(rgb[0] * lit))))
    g = max(0, min(255, int(round(rgb[1] * lit))))
    b = max(0, min(255, int(round(rgb[2] * lit))))
    return f"#{r:02x}{g:02x}{b:02x}"


def _art_aurora(raw: bytes, gid: str) -> str:
    """Luminous optical aurora ribbons, radiant caustics, and subtle photographic grain."""
    ph = _art_unit(raw, 0) * math.tau
    dx = (_art_unit(raw, 1) - 0.5) * 60.0
    dy = (_art_unit(raw, 2) - 0.5) * 40.0

    defs = (
        f"<defs>"
        f'<linearGradient id="{gid}-bg" x1="0%" y1="0%" x2="100%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-bg0)"/>'
        f'<stop offset="55%" stop-color="var(--a-bg1)"/>'
        f'<stop offset="100%" stop-color="var(--a-deep)"/>'
        f"</linearGradient>"
        f'<radialGradient id="{gid}-g1" cx="26%" cy="32%" r="58%">'
        f'<stop offset="0%" stop-color="var(--a-c1)" stop-opacity="0.88"/>'
        f'<stop offset="55%" stop-color="var(--a-c2)" stop-opacity="0.34"/>'
        f'<stop offset="100%" stop-color="var(--a-deep)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<radialGradient id="{gid}-g2" cx="76%" cy="28%" r="54%">'
        f'<stop offset="0%" stop-color="var(--a-c2)" stop-opacity="0.78"/>'
        f'<stop offset="52%" stop-color="var(--a-c1)" stop-opacity="0.28"/>'
        f'<stop offset="100%" stop-color="var(--a-deep)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<radialGradient id="{gid}-g3" cx="62%" cy="76%" r="52%">'
        f'<stop offset="0%" stop-color="var(--a-c3)" stop-opacity="0.62"/>'
        f'<stop offset="55%" stop-color="var(--a-c2)" stop-opacity="0.22"/>'
        f'<stop offset="100%" stop-color="var(--a-deep)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<linearGradient id="{gid}-r1" x1="0%" y1="80%" x2="100%" y2="15%">'
        f'<stop offset="0%" stop-color="var(--a-c1)" stop-opacity="0.1"/>'
        f'<stop offset="32%" stop-color="var(--a-c1)" stop-opacity="0.78"/>'
        f'<stop offset="68%" stop-color="var(--a-c2)" stop-opacity="0.85"/>'
        f'<stop offset="100%" stop-color="var(--a-c3)" stop-opacity="0.62"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-r2" x1="10%" y1="90%" x2="95%" y2="10%">'
        f'<stop offset="0%" stop-color="var(--a-c2)" stop-opacity="0.12"/>'
        f'<stop offset="45%" stop-color="var(--a-hi)" stop-opacity="0.68"/>'
        f'<stop offset="78%" stop-color="var(--a-c3)" stop-opacity="0.76"/>'
        f'<stop offset="100%" stop-color="var(--a-c1)" stop-opacity="0.18"/>'
        f"</linearGradient>"
        f'<filter id="{gid}-blur" x="-20%" y="-20%" width="140%" height="140%">'
        f'<feGaussianBlur stdDeviation="24"/>'
        f"</filter>"
        f'<filter id="{gid}-soft" x="-15%" y="-15%" width="130%" height="130%">'
        f'<feGaussianBlur stdDeviation="8"/>'
        f"</filter>"
        f'<filter id="{gid}-grain">'
        f'<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>'
        f'<feColorMatrix type="saturate" values="0"/>'
        f"</filter>"
        f"</defs>"
    )

    parts: List[str] = [
        defs,
        f'<rect width="640" height="400" fill="url(#{gid}-bg)"/>',
        # Soft luminous atmospheric blooms
        f'<ellipse cx="{190 + dx * 0.5:.1f}" cy="{140 + dy * 0.4:.1f}" rx="280" ry="190" fill="url(#{gid}-g1)" filter="url(#{gid}-blur)"/>',
        f'<ellipse cx="{470 - dx * 0.4:.1f}" cy="{130 - dy * 0.3:.1f}" rx="250" ry="185" fill="url(#{gid}-g2)" filter="url(#{gid}-blur)"/>',
        f'<ellipse cx="{390 + dx * 0.3:.1f}" cy="{300 + dy * 0.3:.1f}" rx="240" ry="150" fill="url(#{gid}-g3)" filter="url(#{gid}-blur)"/>',
        # Diagonal refracted light beams
        f'<polygon points="-40,360 220,0 315,0 60,400" fill="var(--a-hi)" opacity="0.08" filter="url(#{gid}-soft)"/>',
        f'<polygon points="210,400 470,0 560,0 320,400" fill="var(--a-c3)" opacity="0.09" filter="url(#{gid}-soft)"/>',
    ]

    # 5 layered optical aurora curtains
    curtains = [
        (268.0, 58.0, 86.0, 0.0, f"url(#{gid}-r1)", 0.52, "var(--a-hi)", 1.3, 0.36),
        (225.0, 64.0, 74.0, 0.9, f"url(#{gid}-r2)", 0.48, "var(--a-hi)", 1.9, 0.58),
        (192.0, 52.0, 60.0, 1.8, f"url(#{gid}-r1)", 0.62, "var(--a-hi)", 2.2, 0.72),
        (158.0, 44.0, 42.0, 2.7, f"url(#{gid}-r2)", 0.42, "var(--a-c3)", 1.5, 0.62),
        (296.0, 38.0, 48.0, 3.6, f"url(#{gid}-r1)", 0.38, "var(--a-c2)", 1.1, 0.44),
    ]
    for cy, amp, thick, off, fill_ref, fill_op, rim_col, rim_w, rim_op in curtains:
        top_pts: List[Tuple[float, float]] = []
        bot_pts: List[Tuple[float, float]] = []
        for s in range(0, 37):
            u = s / 36.0
            x = -24.0 + u * 688.0
            diag = (0.5 - u) * 120.0
            wave = math.sin(u * 4.4 + ph + off) * amp + math.cos(u * 2.6 - off * 0.8) * (amp * 0.42)
            y = cy + diag + wave
            w = thick * (0.65 + 0.55 * math.sin(u * math.pi + off * 0.35))
            top_pts.append((x, y - w * 0.48))
            bot_pts.append((x, y + w * 0.52))
        top_d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in top_pts)
        poly_d = top_d + " L" + " ".join(f"{x:.1f},{y:.1f}" for x, y in reversed(bot_pts)) + " Z"
        parts.append(f'<path d="{poly_d}" fill="{fill_ref}" fill-opacity="{fill_op:.2f}"/>')
        parts.append(f'<path d="{top_d}" fill="none" stroke="{rim_col}" stroke-width="{rim_w:.1f}" stroke-opacity="{rim_op:.2f}" stroke-linecap="round"/>')

    # Delicate optical dust motes
    for i in range(14):
        mx = 40.0 + _art_unit(raw, i + 3) * 560.0
        my = 36.0 + _art_unit(raw, i + 17) * 328.0
        mr = 1.2 + _art_unit(raw, i + 9) * 2.4
        op = 0.25 + _art_unit(raw, i + 13) * 0.55
        parts.append(f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="{mr:.1f}" fill="var(--a-hi)" fill-opacity="{op:.2f}"/>')

    # Subtle tactile film grain overlay
    parts.append(f'<rect width="640" height="400" filter="url(#{gid}-grain)" opacity="0.045"/>')
    return "".join(parts)


def _art_manifold(raw: bytes, gid: str) -> str:
    """True 3D isometric energy surface with painter's algorithm shading & 45-deg cutaway hatching."""
    p0 = (_art_unit(raw, 0) - 0.5) * 0.55
    p1 = (_art_unit(raw, 1) - 0.5) * 0.55
    grid_n = 17
    z_base = -0.82

    def height_fn(u: float, v: float) -> float:
        peak = 0.92 * math.exp(-2.3 * ((u - 0.26 - p0 * 0.3) ** 2 + (v + 0.24 - p1 * 0.3) ** 2))
        trough = -0.62 * math.exp(-2.5 * ((u + 0.34 + p0 * 0.25) ** 2 + (v - 0.26 + p1 * 0.25) ** 2))
        saddle = 0.24 * math.sin(u * 2.5 + p0) * math.cos(v * 2.3 - p1)
        return peak + trough + saddle

    def proj(u: float, v: float, z: float) -> Tuple[float, float]:
        px = 326.0 + (u - v) * 192.0
        py = 212.0 + (u + v) * 86.0 - z * 82.0
        return px, py

    # Precompute 3D grid heights & projected coordinates
    coords: List[List[Tuple[float, float, float]]] = []
    zs: List[float] = []
    max_z = -999.0
    max_pt = (0.0, 0.0)
    for r in range(grid_n):
        row: List[Tuple[float, float, float]] = []
        v = -1.0 + 2.0 * (r / (grid_n - 1))
        for c in range(grid_n):
            u = -1.0 + 2.0 * (c / (grid_n - 1))
            z = height_fn(u, v)
            px, py = proj(u, v, z)
            row.append((px, py, z))
            zs.append(z)
            if z > max_z:
                max_z = z
                max_pt = (px, py)
        coords.append(row)

    z_min, z_max = min(zs), max(zs)
    z_span = max(1e-5, z_max - z_min)

    defs = (
        f"<defs>"
        f'<linearGradient id="{gid}-bg" x1="0%" y1="0%" x2="100%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-bg0)"/>'
        f'<stop offset="100%" stop-color="var(--a-bg1)"/>'
        f"</linearGradient>"
        f'<pattern id="{gid}-hatch-l" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
        f'<rect width="8" height="8" fill="var(--a-bg1)"/>'
        f'<line x1="0" y1="0" x2="0" y2="8" stroke="var(--a-ink)" stroke-opacity="0.28" stroke-width="1.6"/>'
        f"</pattern>"
        f'<pattern id="{gid}-hatch-r" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">'
        f'<rect width="8" height="8" fill="var(--a-bg0)"/>'
        f'<line x1="0" y1="0" x2="0" y2="8" stroke="var(--a-ink)" stroke-opacity="0.2" stroke-width="1.4"/>'
        f"</pattern>"
        f'<radialGradient id="{gid}-peak" cx="50%" cy="50%" r="50%">'
        f'<stop offset="0%" stop-color="#FFE0B5" stop-opacity="0.95"/>'
        f'<stop offset="45%" stop-color="var(--a-c3)" stop-opacity="0.55"/>'
        f'<stop offset="100%" stop-color="var(--a-c3)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<filter id="{gid}-sh" x="-20%" y="-20%" width="140%" height="140%">'
        f'<feGaussianBlur stdDeviation="12"/>'
        f"</filter>"
        f"</defs>"
    )

    parts: List[str] = [
        defs,
        f'<rect width="640" height="400" fill="url(#{gid}-bg)"/>',
    ]

    # Soft cast floor shadow beneath the 3D slab
    b00 = proj(-1.0, -1.0, z_base)
    b10 = proj(1.0, -1.0, z_base)
    b11 = proj(1.0, 1.0, z_base)
    b01 = proj(-1.0, 1.0, z_base)
    shadow_pts = " ".join(f"{x:.1f},{y + 14:.1f}" for x, y in (b00, b10, b11, b01))
    parts.append(f'<polygon points="{shadow_pts}" fill="var(--a-deep)" fill-opacity="0.18" filter="url(#{gid}-sh)"/>')

    # Painter's algorithm surface quads sorted back-to-front by (r + c)
    quads: List[Tuple[int, str]] = []
    for r in range(grid_n - 1):
        for c in range(grid_n - 1):
            p00 = coords[r][c]
            p10 = coords[r][c + 1]
            p11 = coords[r + 1][c + 1]
            p01 = coords[r + 1][c]
            avg_z = (p00[2] + p10[2] + p11[2] + p01[2]) * 0.25
            norm_z = (avg_z - z_min) / z_span
            # Finite-difference slope for directional shading
            dz_u = (p10[2] - p00[2]) + (p11[2] - p01[2])
            dz_v = (p01[2] - p00[2]) + (p11[2] - p10[2])
            shade = 0.96 - dz_u * 0.65 + dz_v * 0.48
            fill_hex = _elevation_hex(norm_z, shade)
            pts_str = f"{p00[0]:.1f},{p00[1]:.1f} {p10[0]:.1f},{p10[1]:.1f} {p11[0]:.1f},{p11[1]:.1f} {p01[0]:.1f},{p01[1]:.1f}"
            quads.append((
                r + c,
                f'<polygon points="{pts_str}" fill="{fill_hex}" stroke="var(--a-hi)" stroke-opacity="0.24" stroke-width="0.65" stroke-linejoin="round"/>',
            ))

    quads.sort(key=lambda item: item[0])
    parts.extend(svg_el for _, svg_el in quads)

    # Front-left extruded 3D cutaway wall (v = +1, r = grid_n - 1) with 45-deg hatching
    left_top = [(coords[grid_n - 1][c][0], coords[grid_n - 1][c][1]) for c in range(grid_n)]
    left_bot = [proj(1.0, 1.0, z_base), proj(-1.0, 1.0, z_base)]
    left_wall_pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in left_top + left_bot)
    parts.append(f'<polygon points="{left_wall_pts}" fill="url(#{gid}-hatch-l)" stroke="var(--a-ink)" stroke-opacity="0.58" stroke-width="1.35" stroke-linejoin="round"/>')

    # Front-right extruded 3D cutaway wall (u = +1, c = grid_n - 1) with counter-45-deg hatching
    right_top = [(coords[r][grid_n - 1][0], coords[r][grid_n - 1][1]) for r in range(grid_n)]
    right_bot = [proj(1.0, 1.0, z_base), proj(1.0, -1.0, z_base)]
    right_wall_pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in right_top + right_bot)
    parts.append(f'<polygon points="{right_wall_pts}" fill="url(#{gid}-hatch-r)" stroke="var(--a-ink)" stroke-opacity="0.52" stroke-width="1.35" stroke-linejoin="round"/>')

    # Glowing summit anchor node
    parts.append(f'<circle cx="{max_pt[0]:.1f}" cy="{max_pt[1]:.1f}" r="20" fill="url(#{gid}-peak)"/>')
    parts.append(f'<circle cx="{max_pt[0]:.1f}" cy="{max_pt[1]:.1f}" r="4.6" fill="#FFFFFF" stroke="var(--a-c3)" stroke-width="2.1"/>')

    # Miniature 3-axis isometric triad in bottom-left
    ox, oy = 68.0, 342.0
    parts.append(
        f'<g stroke="var(--a-ink)" stroke-opacity="0.52" stroke-width="1.25" stroke-linecap="round">'
        f'<line x1="{ox}" y1="{oy}" x2="{ox}" y2="{oy - 38}"/>'
        f'<line x1="{ox}" y1="{oy}" x2="{ox + 34}" y2="{oy + 15}"/>'
        f'<line x1="{ox}" y1="{oy}" x2="{ox - 34}" y2="{oy + 15}"/>'
        f"</g>"
        f'<circle cx="{ox}" cy="{oy}" r="2.2" fill="var(--a-c1)"/>'
    )
    return "".join(parts)


def _art_ridge(raw: bytes, gid: str) -> str:
    """High-density 3D topographic ribbons with heavy foreground occlusion and catchlights."""
    p0 = _art_unit(raw, 0) * math.tau
    p1 = _art_unit(raw, 1) * math.tau
    f1 = 0.0085 + _art_unit(raw, 2) * 0.0035
    f2 = 0.021 + _art_unit(raw, 3) * 0.007

    defs = (
        f"<defs>"
        f'<linearGradient id="{gid}-bg" x1="0%" y1="0%" x2="0%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-bg0)"/>'
        f'<stop offset="100%" stop-color="var(--a-bg1)"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-hero" x1="0%" y1="0%" x2="100%" y2="0%">'
        f'<stop offset="0%" stop-color="var(--a-deep)"/>'
        f'<stop offset="52%" stop-color="var(--a-c1)"/>'
        f'<stop offset="100%" stop-color="var(--a-deep)"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-mid" x1="0%" y1="0%" x2="100%" y2="0%">'
        f'<stop offset="0%" stop-color="var(--a-c2)"/>'
        f'<stop offset="55%" stop-color="var(--a-c1)"/>'
        f'<stop offset="100%" stop-color="var(--a-c3)"/>'
        f"</linearGradient>"
        f"</defs>"
    )

    parts: List[str] = [
        defs,
        f'<rect width="640" height="400" fill="url(#{gid}-bg)"/>',
        # Architectural calibration hairlines
        '<line x1="36" y1="24" x2="36" y2="376" stroke="var(--a-grid)" stroke-width="1"/>',
        '<line x1="604" y1="24" x2="604" y2="376" stroke="var(--a-grid)" stroke-width="1"/>',
    ]

    # 16 stratified depth bands from far (thin gray) -> mid (colored) -> near (10-18px occluding bold bands)
    total = 16
    for k in range(total):
        depth = k / (total - 1)  # 0 = far, 1 = foreground
        base_y = 54.0 + depth * 296.0
        amp1 = 12.0 + depth * 28.0
        amp2 = 5.0 + depth * 12.0
        pts: List[Tuple[float, float]] = []
        for s in range(0, 41):
            x = -16.0 + s * (672.0 / 40.0)
            y = (
                base_y
                + math.sin(x * f1 + p0 + k * 0.44) * amp1
                + math.cos(x * f2 + p1 - k * 0.33) * amp2
            )
            pts.append((x, y))

        line_d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        # Opaque occluding skirt behind mid & foreground ridges so near ridges genuinely block distant ones!
        if k >= 5:
            skirt_d = line_d + " L656.0,420.0 L-16.0,420.0 Z"
            parts.append(f'<path d="{skirt_d}" fill="url(#{gid}-bg)"/>')

        if k < 6:
            # Far distant hills: crisp subtle gray hairlines
            op = 0.16 + depth * 0.25
            parts.append(f'<path d="{line_d}" fill="none" stroke="var(--a-ink)" stroke-opacity="{op:.2f}" stroke-width="{1.0 + depth * 1.4:.1f}"/>')
        elif k < 12:
            # Mid saturated folded bands
            sw = 4.2 + (k - 6) * 0.85
            dash = ' stroke-dasharray="110 14 48 12"' if k in (8, 10) else ""
            parts.append(f'<path d="{line_d}" fill="none" stroke="url(#{gid}-mid)" stroke-opacity="{0.74 + (k - 6) * 0.04:.2f}" stroke-width="{sw:.1f}" stroke-linecap="round"{dash}/>')
        else:
            # Foreground sculptural 11-18px dominant bands + luminous upper catchlight
            sw = 10.5 + (k - 12) * 2.4
            dash = ' stroke-dasharray="180 18 76 16"' if k in (13, 15) else ""
            stroke_ref = f"url(#{gid}-hero)" if k % 2 == 0 else "var(--a-deep)"
            parts.append(f'<path d="{line_d}" fill="none" stroke="{stroke_ref}" stroke-width="{sw:.1f}" stroke-linecap="round"{dash}/>')
            rim_d = "M" + " ".join(f"{x:.1f},{y - sw * 0.42:.1f}" for x, y in pts)
            parts.append(f'<path d="{rim_d}" fill="none" stroke="var(--a-hi)" stroke-opacity="0.48" stroke-width="1.3" stroke-linecap="round"{dash}/>')

    return "".join(parts)


def _art_prism(raw: bytes, gid: str) -> str:
    """3D floating refractive glass slabs with floor shadows, crisp bevels, and chromatic dispersion."""
    dx = (_art_unit(raw, 4) - 0.5) * 32.0
    dy = (_art_unit(raw, 5) - 0.5) * 22.0

    defs = (
        f"<defs>"
        f'<linearGradient id="{gid}-bg" x1="0%" y1="0%" x2="100%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-bg0)"/>'
        f'<stop offset="100%" stop-color="var(--a-bg1)"/>'
        f"</linearGradient>"
        f'<radialGradient id="{gid}-disp" cx="50%" cy="50%" r="50%">'
        f'<stop offset="0%" stop-color="var(--a-c2)" stop-opacity="0.58"/>'
        f'<stop offset="52%" stop-color="var(--a-c1)" stop-opacity="0.24"/>'
        f'<stop offset="100%" stop-color="var(--a-c3)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<linearGradient id="{gid}-glass1" x1="0%" y1="0%" x2="100%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-hi)" stop-opacity="0.88"/>'
        f'<stop offset="48%" stop-color="var(--a-c1)" stop-opacity="0.32"/>'
        f'<stop offset="100%" stop-color="var(--a-c2)" stop-opacity="0.58"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-glass2" x1="100%" y1="0%" x2="0%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-hi)" stop-opacity="0.82"/>'
        f'<stop offset="45%" stop-color="var(--a-c3)" stop-opacity="0.36"/>'
        f'<stop offset="100%" stop-color="var(--a-c1)" stop-opacity="0.46"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-beam" x1="0%" y1="100%" x2="100%" y2="0%">'
        f'<stop offset="0%" stop-color="var(--a-c1)" stop-opacity="0.0"/>'
        f'<stop offset="38%" stop-color="var(--a-c2)" stop-opacity="0.65"/>'
        f'<stop offset="68%" stop-color="var(--a-c3)" stop-opacity="0.72"/>'
        f'<stop offset="100%" stop-color="var(--a-hi)" stop-opacity="0.0"/>'
        f"</linearGradient>"
        f'<filter id="{gid}-sh" x="-25%" y="-25%" width="150%" height="150%">'
        f'<feGaussianBlur stdDeviation="11"/>'
        f"</filter>"
        f"</defs>"
    )

    def iso_slab(cx: float, cy: float, rx: float, ry: float, thick: float, grad: str, edge_col: str) -> str:
        top = (cx, cy - ry)
        right = (cx + rx, cy)
        bot = (cx, cy + ry)
        left = (cx - rx, cy)
        # Drop shadow projected below
        sh_pts = " ".join(f"{x:.1f},{y + thick + 24:.1f}" for x, y in (top, right, bot, left))
        # Left & right extruded thickness facets
        left_face = (
            f"{left[0]:.1f},{left[1]:.1f} {bot[0]:.1f},{bot[1]:.1f} "
            f"{bot[0]:.1f},{bot[1] + thick:.1f} {left[0]:.1f},{left[1] + thick:.1f}"
        )
        right_face = (
            f"{bot[0]:.1f},{bot[1]:.1f} {right[0]:.1f},{right[1]:.1f} "
            f"{right[0]:.1f},{right[1] + thick:.1f} {bot[0]:.1f},{bot[1] + thick:.1f}"
        )
        top_face = " ".join(f"{x:.1f},{y:.1f}" for x, y in (top, right, bot, left))
        return (
            f'<polygon points="{sh_pts}" fill="var(--a-deep)" fill-opacity="0.16" filter="url(#{gid}-sh)"/>'
            f'<polygon points="{left_face}" fill="{edge_col}" fill-opacity="0.54" stroke="var(--a-hi)" stroke-opacity="0.35" stroke-width="0.9"/>'
            f'<polygon points="{right_face}" fill="var(--a-deep)" fill-opacity="0.38" stroke="var(--a-hi)" stroke-opacity="0.3" stroke-width="0.9"/>'
            f'<polygon points="{top_face}" fill="url(#{grad})" stroke="var(--a-hi)" stroke-opacity="0.86" stroke-width="1.4" stroke-linejoin="round"/>'
            f'<line x1="{left[0]:.1f}" y1="{left[1]:.1f}" x2="{top[0]:.1f}" y2="{top[1]:.1f}" stroke="#FFFFFF" stroke-opacity="0.72" stroke-width="1.6"/>'
        )

    parts: List[str] = [
        defs,
        f'<rect width="640" height="400" fill="url(#{gid}-bg)"/>',
        # Fine isometric reference grid
        '<g stroke="var(--a-grid)" stroke-width="0.9">',
        '<line x1="0" y1="260" x2="640" y2="60"/><line x1="0" y1="340" x2="640" y2="140"/>',
        '<line x1="0" y1="140" x2="640" y2="340"/><line x1="0" y1="60" x2="640" y2="260"/>',
        "</g>",
        # Chromatic dispersion glow behind prisms
        f'<ellipse cx="{330 + dx * 0.5:.1f}" cy="{190 + dy * 0.4:.1f}" rx="210" ry="125" fill="url(#{gid}-disp)" filter="url(#{gid}-sh)"/>',
        # Refracted dispersion ray
        f'<polygon points="80,320 530,85 568,125 118,358" fill="url(#{gid}-beam)"/>',
        # Three stacked 3D glass plates (back -> mid -> front)
        iso_slab(254.0 + dx * 0.5, 224.0 + dy * 0.4, 146.0, 68.0, 18.0, f"{gid}-glass1", "var(--a-c1)"),
        iso_slab(348.0 - dx * 0.3, 186.0 - dy * 0.3, 152.0, 72.0, 22.0, f"{gid}-glass2", "var(--a-c2)"),
        iso_slab(308.0 + dx * 0.2, 132.0 + dy * 0.2, 108.0, 50.0, 15.0, f"{gid}-glass1", "var(--a-c3)"),
    ]
    return "".join(parts)


def _art_orbital(raw: bytes, gid: str) -> str:
    """3D tilted gravitational orbital rings and depth-scaled luminous particle field."""
    cx, cy = 320.0, 202.0
    base_roll = -0.34 + (_art_unit(raw, 6) - 0.5) * 0.28

    defs = (
        f"<defs>"
        f'<radialGradient id="{gid}-bg" cx="50%" cy="50%" r="72%">'
        f'<stop offset="0%" stop-color="var(--a-bg1)"/>'
        f'<stop offset="100%" stop-color="var(--a-deep)"/>'
        f"</radialGradient>"
        f'<radialGradient id="{gid}-core" cx="50%" cy="50%" r="50%">'
        f'<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98"/>'
        f'<stop offset="28%" stop-color="var(--a-c3)" stop-opacity="0.82"/>'
        f'<stop offset="62%" stop-color="var(--a-c1)" stop-opacity="0.38"/>'
        f'<stop offset="100%" stop-color="var(--a-c2)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<radialGradient id="{gid}-halo" cx="50%" cy="50%" r="50%">'
        f'<stop offset="0%" stop-color="var(--a-hi)" stop-opacity="0.95"/>'
        f'<stop offset="45%" stop-color="var(--a-c2)" stop-opacity="0.5"/>'
        f'<stop offset="100%" stop-color="var(--a-c2)" stop-opacity="0"/>'
        f"</radialGradient>"
        f'<filter id="{gid}-glow" x="-30%" y="-30%" width="160%" height="160%">'
        f'<feGaussianBlur stdDeviation="12"/>'
        f"</filter>"
        f"</defs>"
    )

    orbits = [
        (256.0, 82.0, base_roll - 0.22, "var(--a-c1)", 1.9, ""),
        (220.0, 70.0, base_roll + 0.14, "var(--a-c2)", 1.5, ""),
        (184.0, 56.0, base_roll - 0.06, "var(--a-hi)", 1.2, "6 6"),
        (146.0, 44.0, base_roll + 0.30, "var(--a-c3)", 1.6, ""),
        (108.0, 34.0, base_roll - 0.36, "var(--a-c2)", 1.25, ""),
        (286.0, 96.0, base_roll + 0.04, "var(--a-c1)", 1.0, "3 7"),
    ]

    back_arcs: List[str] = []
    front_arcs: List[str] = []
    back_dots: List[Tuple[float, str]] = []
    front_dots: List[Tuple[float, str]] = []

    def orbit_pt(rx: float, ry: float, roll: float, theta: float) -> Tuple[float, float, float]:
        lx = rx * math.cos(theta)
        ly = ry * math.sin(theta)
        # Depth z > 0 means front half (theta in (0, pi))
        z = math.sin(theta)
        cr, sr = math.cos(roll), math.sin(roll)
        return cx + lx * cr - ly * sr, cy + lx * sr + ly * cr, z

    for oidx, (rx, ry, roll, col, sw, dash) in enumerate(orbits):
        dash_attr = f' stroke-dasharray="{dash}"' if dash else ""
        # Back hemisphere: theta in [pi, 2*pi]
        b_pts = [orbit_pt(rx, ry, roll, math.pi + s * (math.pi / 28.0)) for s in range(29)]
        b_d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y, _ in b_pts)
        back_arcs.append(
            f'<path d="{b_d}" fill="none" stroke="{col}" stroke-opacity="0.28" stroke-width="{sw * 0.78:.1f}"{dash_attr}/>'
        )
        # Front hemisphere: theta in [0, pi]
        f_pts = [orbit_pt(rx, ry, roll, s * (math.pi / 28.0)) for s in range(29)]
        f_d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y, _ in f_pts)
        front_arcs.append(
            f'<path d="{f_d}" fill="none" stroke="{col}" stroke-opacity="0.82" stroke-width="{sw:.1f}" stroke-linecap="round"{dash_attr}/>'
        )

        # Depth-scaled particles along each orbit
        for k in range(5):
            theta = (_art_unit(raw, oidx * 5 + k) * math.tau + k * 1.25) % math.tau
            px, py, z = orbit_pt(rx, ry, roll, theta)
            depth01 = (z + 1.0) * 0.5  # 0 far, 1 near
            rad = 1.4 + depth01 * 4.2
            op = 0.25 + depth01 * 0.72
            p_col = "var(--a-c3)" if (oidx + k) % 3 == 0 else ("var(--a-hi)" if depth01 > 0.65 else col)
            if z < 0:
                back_dots.append((z, f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{rad:.1f}" fill="{p_col}" fill-opacity="{op:.2f}"/>'))
            else:
                halo_el = f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{rad * 2.8:.1f}" fill="url(#{gid}-halo)" opacity="{0.45 * depth01:.2f}"/>'
                core_el = f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{rad:.1f}" fill="{p_col}" fill-opacity="{op:.2f}"/>'
                front_dots.append((z, halo_el + core_el))

    back_dots.sort(key=lambda t: t[0])
    front_dots.sort(key=lambda t: t[0])

    parts: List[str] = [
        defs,
        f'<rect width="640" height="400" fill="url(#{gid}-bg)"/>',
        *back_arcs,
        *(d for _, d in back_dots),
        # Central luminous gravitational core
        f'<circle cx="{cx}" cy="{cy}" r="96" fill="url(#{gid}-core)" filter="url(#{gid}-glow)"/>',
        f'<ellipse cx="{cx}" cy="{cy}" rx="84" ry="4.5" fill="var(--a-hi)" fill-opacity="0.34"/>',
        f'<circle cx="{cx}" cy="{cy}" r="22" fill="url(#{gid}-core)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="6.5" fill="#FFFFFF"/>',
        *front_arcs,
        *(d for _, d in front_dots),
    ]
    return "".join(parts)


def _art_caustic(raw: bytes, gid: str) -> str:
    """Luminous optical water caustics, refracted light shafts, and radiant wave crests."""
    ph = _art_unit(raw, 8) * math.tau
    defs = (
        f"<defs>"
        f'<linearGradient id="{gid}-bg" x1="0%" y1="0%" x2="100%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-deep)"/>'
        f'<stop offset="48%" stop-color="var(--a-bg1)"/>'
        f'<stop offset="100%" stop-color="var(--a-bg0)"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-w1" x1="0%" y1="0%" x2="100%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-c1)" stop-opacity="0.72"/>'
        f'<stop offset="55%" stop-color="var(--a-c2)" stop-opacity="0.54"/>'
        f'<stop offset="100%" stop-color="var(--a-c3)" stop-opacity="0.35"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-w2" x1="100%" y1="0%" x2="0%" y2="100%">'
        f'<stop offset="0%" stop-color="var(--a-c3)" stop-opacity="0.62"/>'
        f'<stop offset="50%" stop-color="var(--a-c2)" stop-opacity="0.48"/>'
        f'<stop offset="100%" stop-color="var(--a-c1)" stop-opacity="0.22"/>'
        f"</linearGradient>"
        f'<linearGradient id="{gid}-crest" x1="0%" y1="0%" x2="100%" y2="0%">'
        f'<stop offset="0%" stop-color="var(--a-c2)" stop-opacity="0.2"/>'
        f'<stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.88"/>'
        f'<stop offset="78%" stop-color="var(--a-c3)" stop-opacity="0.82"/>'
        f'<stop offset="100%" stop-color="var(--a-c1)" stop-opacity="0.18"/>'
        f"</linearGradient>"
        f'<filter id="{gid}-glow" x="-15%" y="-15%" width="130%" height="130%">'
        f'<feGaussianBlur stdDeviation="5"/>'
        f"</filter>"
        f"</defs>"
    )

    parts: List[str] = [
        defs,
        f'<rect width="640" height="400" fill="url(#{gid}-bg)"/>',
        # Soft diagonal aquatic light shafts
        f'<polygon points="90,0 190,0 320,400 185,400" fill="var(--a-hi)" opacity="0.09" filter="url(#{gid}-glow)"/>',
        f'<polygon points="340,0 445,0 590,400 455,400" fill="var(--a-c2)" opacity="0.1" filter="url(#{gid}-glow)"/>',
    ]

    # 6 layered caustic wave sheets + glowing bright refraction crests
    waves = [
        (96.0, 28.0, 62.0, 0.0, f"url(#{gid}-w1)", 0.44),
        (148.0, 34.0, 68.0, 1.1, f"url(#{gid}-w2)", 0.48),
        (198.0, 38.0, 74.0, 2.2, f"url(#{gid}-w1)", 0.56),
        (246.0, 32.0, 70.0, 3.3, f"url(#{gid}-w2)", 0.54),
        (292.0, 26.0, 64.0, 4.4, f"url(#{gid}-w1)", 0.48),
        (338.0, 22.0, 56.0, 5.4, f"url(#{gid}-w2)", 0.42),
    ]
    for idx, (cy, amp, thick, off, fill_ref, fill_op) in enumerate(waves):
        top_pts: List[Tuple[float, float]] = []
        bot_pts: List[Tuple[float, float]] = []
        for s in range(0, 37):
            u = s / 36.0
            x = -20.0 + u * 680.0
            y = cy + math.sin(u * 6.2 + ph + off) * amp + math.cos(u * 10.5 - off * 1.4) * (amp * 0.34)
            w = thick * (0.72 + 0.38 * math.sin(u * 4.8 + off))
            top_pts.append((x, y - w * 0.45))
            bot_pts.append((x, y + w * 0.55))
        top_d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in top_pts)
        poly_d = top_d + " L" + " ".join(f"{x:.1f},{y:.1f}" for x, y in reversed(bot_pts)) + " Z"
        parts.append(f'<path d="{poly_d}" fill="{fill_ref}" fill-opacity="{fill_op:.2f}"/>')
        if idx in (1, 2, 3):
            parts.append(f'<path d="{top_d}" fill="none" stroke="url(#{gid}-crest)" stroke-width="5.5" stroke-opacity="0.4" filter="url(#{gid}-glow)"/>')
            parts.append(f'<path d="{top_d}" fill="none" stroke="url(#{gid}-crest)" stroke-width="1.9" stroke-linecap="round"/>')
        else:
            parts.append(f'<path d="{top_d}" fill="none" stroke="var(--a-hi)" stroke-opacity="0.32" stroke-width="1.1"/>')

    # Caustic optical interference rings
    for cx, cy, rx, ry in ((220.0, 178.0, 62.0, 24.0), (432.0, 232.0, 74.0, 28.0)):
        parts.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="var(--a-hi)" stroke-opacity="0.36" stroke-width="1.2"/>')
    return "".join(parts)


ART_BUILDERS = {
    "aurora": _art_aurora,
    "manifold": _art_manifold,
    "ridge": _art_ridge,
    "prism": _art_prism,
    "orbital": _art_orbital,
    "caustic": _art_caustic,
}


def resolve_art_style(style: Optional[str], raw: bytes) -> str:
    if style:
        s = style.strip().lower()
        s = ART_STYLE_ALIASES.get(s, s)
        if s in ART_BUILDERS:
            return s
    return ART_STYLES[raw[12] % len(ART_STYLES)]


def resolve_art_palette(palette: Optional[str], raw: bytes) -> str:
    if palette:
        p = palette.strip().lower()
        p = ART_PALETTE_ALIASES.get(p, p)
        if p in ART_PALETTES:
            return p
    return ART_PALETTES[raw[13] % len(ART_PALETTES)]


def render_card_art(
    seed: str,
    style: Optional[str] = None,
    palette: Optional[str] = None,
    *,
    aria_label: str = "",
    uid: str = "",
) -> str:
    """Render a deterministic, Light/Dark-adaptive 640x400 3D/luminous inline SVG artwork."""
    raw = _art_seed_bytes(seed or "article")
    chosen_style = resolve_art_style(style, raw)
    chosen_palette = resolve_art_palette(palette, raw)
    gid = "a" + hashlib.sha256(f"{seed}:{chosen_style}:{chosen_palette}:{uid}".encode("utf-8")).hexdigest()[:8]
    inner = ART_BUILDERS[chosen_style](raw, gid)
    aria = f' role="img" aria-label="{esc(aria_label)}"' if aria_label else ' aria-hidden="true"'
    return (
        f'<svg class="art-svg art-pal-{chosen_palette} art-style-{chosen_style}" viewBox="0 0 640 400" width="640" height="400"'
        f' xmlns="http://www.w3.org/2000/svg"{aria}>'
        f"{inner}"
        f"</svg>"
    )


ART_PLACEHOLDER_RE = re.compile(
    r"(?P<inert><(?P<itag>script|style|pre|code|template)\b[^>]*>[\s\S]*?</(?P=itag)>)"
    r"|(?P<ph><!--\s*art:([a-z]+):([a-z]+)(?::([a-zA-Z0-9_-]+))?\s*-->)",
    re.I,
)


def expand_art_placeholders(body_html: str) -> str:
    """Expand <!--art:style:palette[:seed]--> tokens outside script/code blocks into inline SVG art."""
    occ = 0

    def repl(m: re.Match) -> str:
        nonlocal occ
        if m.group("inert") is not None:
            return m.group(0)
        occ += 1
        st = m.group(4).lower()
        pal = m.group(5).lower()
        sd = m.group(6) or f"{st}-{pal}"
        return render_card_art(sd, style=st, palette=pal, uid=f"p{occ}")

    return ART_PLACEHOLDER_RE.sub(repl, body_html)


# ---------------------------------------------------------------------------
# Post Loader
# ---------------------------------------------------------------------------
def load_post(post_dir: Path, url_prefix: str = "/blog") -> Optional[Dict[str, Any]]:
    html_file = post_dir / "index.html"
    md_file = post_dir / "index.md"
    if not html_file.exists() and not md_file.exists():
        return None

    meta: Dict[str, Any] = {}
    meta_file = post_dir / "meta.json"
    if meta_file.exists():
        meta.update(json.loads(meta_file.read_text(encoding="utf-8")))

    if html_file.exists():
        raw = html_file.read_text(encoding="utf-8")
        m_json = re.match(r"^\s*<!--\s*meta\s*(\{.*?\})\s*-->\s*", raw, flags=re.S)
        m_yaml = re.match(r"^\s*---\s*\n(.*?)\n---\s*\n", raw, flags=re.S)
        if m_json:
            meta.update(json.loads(m_json.group(1)))
            body_html = raw[m_json.end():]
        elif m_yaml:
            meta.update(parse_frontmatter_yaml(m_yaml.group(1)))
            body_html = raw[m_yaml.end():]
        else:
            body_html = raw
        source_format = "html"
    else:
        raw = md_file.read_text(encoding="utf-8")
        m_yaml = re.match(r"^\s*---\s*\n(.*?)\n---\s*\n", raw, flags=re.S)
        if m_yaml:
            meta.update(parse_frontmatter_yaml(m_yaml.group(1)))
            body_md = raw[m_yaml.end():]
        else:
            body_md = raw
        body_html = render_markdown_to_html(body_md)
        source_format = "md"

    # Strict draft exclusion
    if bool(meta.get("draft", False)):
        return None

    slug = str(meta.get("slug") or slugify(post_dir.name))
    date_obj = parse_date(str(meta.get("date", "2026-01-01")))
    bilingual = bool(meta.get("bilingual", False))
    body_html = expand_art_placeholders(body_html)
    body_html, toc = extract_and_id_headings(body_html)

    permalink = f"{url_prefix.rstrip('/')}/{slug}/"
    cover = str(meta.get("cover") or "").strip()
    if cover and not cover.startswith(("http://", "https://", "/")):
        cover_url = f"{permalink}{cover.lstrip('./')}"
    else:
        cover_url = cover

    art_cfg = meta.get("art") if isinstance(meta.get("art"), dict) else {}
    art_style = str(art_cfg.get("style") or "").strip().lower() or None
    art_palette = str(art_cfg.get("palette") or "").strip().lower() or None
    cover_mode = str(meta.get("cover_mode") or "art").strip().lower()
    if cover_mode not in ("art", "image"):
        cover_mode = "art"

    reading_min = int(meta.get("reading_minutes") or estimate_reading_minutes(body_html, bilingual=bilingual))
    raw_tags = meta.get("tags", [])
    if isinstance(raw_tags, str):
        tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
    elif isinstance(raw_tags, (list, tuple)):
        tags = [str(t).strip() for t in raw_tags if str(t).strip()]
    else:
        tags = []

    return {
        "dir": post_dir,
        "format": source_format,
        "slug": slug,
        "permalink": permalink,
        "title": str(meta.get("title") or post_dir.name),
        "title_zh": str(meta.get("title_zh") or ""),
        "date": date_obj,
        "date_iso": date_obj.isoformat(),
        "date_en": format_date_en(date_obj),
        "date_zh": format_date_zh(date_obj),
        "tags": tags,
        "summary": str(meta.get("summary") or meta.get("tldr") or ""),
        "summary_zh": str(meta.get("summary_zh") or ""),
        "tldr": str(meta.get("tldr") or meta.get("summary") or ""),
        "tldr_zh": str(meta.get("tldr_zh") or ""),
        "cover": cover,
        "cover_url": cover_url,
        "cover_mode": cover_mode,
        "cover_width": meta.get("cover_width"),
        "cover_height": meta.get("cover_height"),
        "cover_alt": str(meta.get("cover_alt") or meta.get("title") or ""),
        "art_style": art_style,
        "art_palette": art_palette,
        "content_lang": str(meta.get("content_lang") or "en"),
        "bilingual": bilingual,
        "math": bool(meta.get("math", False)),
        "citation": bool(meta.get("citation", True)),
        "aliases": [str(a) for a in meta.get("aliases", []) if str(a).strip()],
        "x_post": meta.get("x_post"),
        "reading_minutes": reading_min,
        "body_html": body_html,
        "toc": toc,
    }


# ---------------------------------------------------------------------------
# HTML Template Renderers
# ---------------------------------------------------------------------------
def render_head(
    data: Dict[str, Any],
    *,
    page_title: str,
    description: str,
    canonical_path: str,
    css_ver: str,
    js_ver: str,
    og_type: str = "website",
    og_image_path: Optional[str] = None,
    include_math: bool = False,
) -> str:
    site = data["site"]
    base_url = site["url"].rstrip("/")
    canonical_url = base_url + canonical_path
    img_path = og_image_path or site["avatar"]
    og_image_abs = img_path if img_path.startswith(("http://", "https://")) else base_url + img_path

    katex_block = ""
    if include_math:
        katex_block = """
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" crossorigin="anonymous"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" crossorigin="anonymous" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},{left:'\\\\(',right:'\\\\)',display:false},{left:'\\\\[',right:'\\\\]',display:true}],throwOnError:false});"></script>"""

    return f"""<!doctype html>
<html lang="en-US" data-locale="en" data-theme="light" data-motion="active">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{esc(page_title)}</title>
    <meta name="description" content="{esc(description)}">
    <meta name="keywords" content="{esc(site['keywords'])}">
    <meta name="color-scheme" content="light dark">
    <meta property="og:type" content="{esc(og_type)}">
    <meta property="og:title" content="{esc(page_title)}">
    <meta property="og:url" content="{esc(canonical_url)}">
    <meta property="og:site_name" content="{esc(site['title'])}">
    <meta property="og:description" content="{esc(description)}">
    <meta property="og:image" content="{esc(og_image_abs)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{esc(page_title)}">
    <meta name="twitter:description" content="{esc(description)}">
    <meta name="twitter:image" content="{esc(og_image_abs)}">
    <link rel="canonical" href="{esc(canonical_url)}">
    <link rel="alternate" type="application/rss+xml" title="{esc(site['title'])} · Blog RSS" href="/blog/rss.xml">
    <link rel="icon" href="{esc(site['favicon'])}" type="{esc(site['favicon_type'])}">
    <script>
      (function () {{
        var root = document.documentElement;
        var theme = "light";
        var locale = "en";
        var motion = "active";
        try {{
          var savedTheme = localStorage.getItem("jeix-theme-choice");
          if (savedTheme === "dark" || savedTheme === "light") theme = savedTheme;
          var savedLocale = localStorage.getItem("jeix-locale");
          if (savedLocale === "zh" || savedLocale === "en") locale = savedLocale;
          var savedMotion = localStorage.getItem("jeix-motion");
          var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (savedMotion === "off" || (!savedMotion && prefersReduced)) motion = "reduced";
        }} catch (e) {{}}
        root.dataset.theme = theme;
        root.dataset.locale = locale;
        root.dataset.motion = motion;
        root.lang = locale === "zh" ? "zh-CN" : "en-US";
        root.style.colorScheme = theme;
      }})();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="/assets/css/site.css?v={css_ver}">
    <script src="/assets/js/site.js?v={js_ver}" defer></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap">{katex_block}
  </head>"""


def render_nav(data: Dict[str, Any], active_section: str, *, show_progress: bool = False) -> str:
    def cur(sec: str) -> str:
        return ' aria-current="page"' if active_section == sec else ""

    progress_html = (
        '\n      <div class="read-progress" aria-hidden="true"><span class="read-progress-bar"></span></div>'
        if show_progress
        else ""
    )

    return f"""    <div class="ambient-stage" aria-hidden="true">
      <div class="ambient-glow"></div>
      <canvas class="ambient-field"></canvas>
    </div>
    <a class="skip-link" href="#content"><span data-lang="en">Skip to content</span><span data-lang="zh">跳到正文</span></a>
    <header class="site-nav topbar">
      <div class="nav-inner">
        <a class="brand" href="/" aria-label="{esc(data['site']['title'])} home">Victor <span class="brand-middle">Shea-Jay </span>Huang</a>
        <div class="nav-right">
          <nav class="nav-links" aria-label="Primary navigation">
            <a href="/"{cur('about')}>About</a>
            <a href="/projects/"{cur('projects')}>Projects</a>
            <a href="/blog/"{cur('blog')}>Blog</a>
          </nav>
          <div class="nav-controls" aria-label="Display controls">
            <div class="lang-pill" role="group" aria-label="Language">
              <button type="button" data-locale-option="en" aria-pressed="true">EN</button>
              <button type="button" data-locale-option="zh" aria-pressed="false">中</button>
            </div>
            <button type="button" class="icon-btn motion-btn" data-motion-toggle aria-pressed="false" aria-label="Pause ambient motion" title="Ambient motion">
              {ICONS['motion_on']}
              {ICONS['motion_off']}
            </button>
            <button type="button" class="icon-btn theme-btn" data-theme-toggle aria-pressed="false" aria-label="Switch to dark theme" title="Dark mode">
              {ICONS['moon']}
              {ICONS['sun']}
            </button>
          </div>
        </div>
      </div>{progress_html}
    </header>"""


def render_profile_rail(data: Dict[str, Any]) -> str:
    site = data["site"]
    p = data["profile"]
    link_items = []
    for item in p["links"]:
        icon = ICONS.get(item["id"], "")
        is_ext = item["url"].startswith(("http://", "https://"))
        rel = ' target="_blank" rel="noopener noreferrer"' if is_ext else ""
        link_items.append(
            f'          <a href="{esc(item["url"])}"{rel}>'
            f'<span class="profile-link-icon">{icon}</span>'
            f'<span>{esc(item["label"])}</span>'
            f'<span class="profile-link-arrow" aria-hidden="true">↗</span>'
            f"</a>"
        )

    return f"""      <aside class="profile-rail" aria-label="Profile">
        <div class="profile-header">
          <a class="profile-avatar-link" href="/" aria-label="{esc(p['name'])}">
            <img class="profile-avatar" src="{esc(site['avatar'])}" alt="{esc(p['name'])} portrait" width="{site['avatar_width']}" height="{site['avatar_height']}">
          </a>
          <div class="profile-identity">
            <p class="profile-name"><a href="/">{esc(p['name'])}</a></p>
            <p class="profile-role">
              <span data-lang="en">{esc(p['role_en'])}</span>
              <span data-lang="zh">{esc(p['role_zh'])}</span>
            </p>
            <p class="profile-affiliation">
              <a href="{esc(p['subaffiliation_link'])}" target="_blank" rel="noopener noreferrer">{esc(p['subaffiliation'])}</a>
              ·
              <a href="{esc(p['affiliation_link'])}" target="_blank" rel="noopener noreferrer">{esc(p['affiliation'])}</a>
            </p>
          </div>
        </div>
        <nav class="profile-links" aria-label="Profile links">
{chr(10).join(link_items)}
        </nav>
      </aside>"""


def render_footer(data: Dict[str, Any]) -> str:
    site = data["site"]
    github_url = next(
        (lk["url"] for lk in data["profile"].get("links", []) if lk.get("id") == "github"),
        "",
    )
    github_part = (
        f' · <a href="{esc(github_url)}" target="_blank" rel="noopener noreferrer">GitHub</a>'
        if github_url
        else ""
    )
    return f"""        <footer class="site-footer">
          <p>© {site['copyright_year']} {esc(site['title'])}</p>
          <p><a href="/blog/rss.xml">RSS</a>{github_part}</p>
        </footer>"""


def render_post_card(post: Dict[str, Any], *, heading_tag: str = "h2") -> str:
    tags_attr = "|".join(t.lower() for t in post["tags"])
    use_image = post.get("cover_mode") == "image" and bool(post.get("cover_url"))

    if use_image:
        w = f' width="{post["cover_width"]}"' if post.get("cover_width") else ""
        h = f' height="{post["cover_height"]}"' if post.get("cover_height") else ""
        media_inner = f'<img src="{esc(post["cover_url"])}" alt="{esc(post["cover_alt"])}"{w}{h} loading="lazy">'
    else:
        media_inner = render_card_art(
            post["slug"],
            style=post.get("art_style"),
            palette=post.get("art_palette"),
        )

    if post["bilingual"] and post["title_zh"]:
        title_html = f'<span data-lang="en">{esc(post["title"])}</span><span data-lang="zh">{esc(post["title_zh"])}</span>'
    else:
        title_html = esc(post["title"])

    if post["bilingual"] and post["tldr_zh"]:
        excerpt_html = f'<span data-lang="en">{esc(post["tldr"])}</span><span data-lang="zh">{esc(post["tldr_zh"])}</span>'
    else:
        excerpt_html = esc(post["tldr"])

    read_time_en = f"{post['reading_minutes']} min"
    read_time_zh = f"{post['reading_minutes']} 分钟"

    return f"""        <article class="post-card" data-tags="{esc(tags_attr)}">
          <a class="post-art-frame" href="{esc(post['permalink'])}" aria-label="{esc(post['title'])}">
            {media_inner}
          </a>
          <div class="post-card-body">
            <div class="post-card-meta">
              <time datetime="{esc(post['date_iso'])}"><span data-lang="en">{esc(post['date_en'])}</span><span data-lang="zh">{esc(post['date_zh'])}</span></time>
              <span class="meta-sep" aria-hidden="true">·</span>
              <span><span data-lang="en">{read_time_en}</span><span data-lang="zh">{read_time_zh}</span></span>
            </div>
            <{heading_tag} class="post-card-title"><a href="{esc(post['permalink'])}">{title_html}</a></{heading_tag}>
            <p class="post-excerpt">{excerpt_html}</p>
          </div>
        </article>"""


def render_homepage(data: Dict[str, Any], posts: List[Dict[str, Any]], css_ver: str, js_ver: str) -> str:
    p = data["profile"]
    site = data["site"]

    # Research cards
    research_cards = []
    for area in data["research"]:
        mark = ICONS.get(area["id"], "")
        research_cards.append(f"""          <article class="research-card">
            <div class="research-card-head">
              <h3><span data-lang="en">{esc(area['title_en'])}</span><span data-lang="zh">{esc(area['title_zh'])}</span></h3>
              {mark}
            </div>
            <p><span data-lang="en">{esc(area['scope_en'])}</span><span data-lang="zh">{esc(area['scope_zh'])}</span></p>
          </article>""")

    # Scrollable News items (sorted newest first, with subtle divider on year break)
    news_items_sorted = sorted(data["news"], key=lambda x: x["month"], reverse=True)
    news_rows = []
    prev_year = None
    for item in news_items_sorted:
        yr = item.get("year")
        yr_break = ' data-year-break="true"' if prev_year is not None and yr != prev_year else ""
        prev_year = yr
        news_rows.append(f"""            <li class="news-item"{yr_break}>
              <time class="news-date" datetime="{esc(item['month'])}"><span data-lang="en">{esc(item['date_en'])}</span><span data-lang="zh">{esc(item['date_zh'])}</span></time>
              <div class="news-copy">
                <span data-lang="en">{item['html_en']}</span>
                <span data-lang="zh">{item['html_zh']}</span>
              </div>
            </li>""")

    # Recent writing (up to 3 in compact 3-column gallery grid)
    recent_posts_html = "\n".join(render_post_card(post, heading_tag="h3") for post in posts[:3])

    # Selected projects (4 featured)
    featured_projects = [proj for proj in data["projects"] if proj.get("featured")][:4]
    mini_cards = []
    for proj in featured_projects:
        is_video = bool(proj.get("video_url"))
        thumb_cls = "mini-project-thumb is-video" if is_video else "mini-project-thumb"
        badge = '<span class="video-badge">▶ Video</span>' if is_video else ""
        res_links = "".join(
            f'<a class="resource-link" href="{esc(lk["url"])}" target="_blank" rel="noopener noreferrer">'
            f'<span data-lang="en">{esc(lk["label_en"])}</span>'
            f'<span data-lang="zh">{esc(lk["label_zh"])}</span>'
            f' <span aria-hidden="true">↗</span></a>'
            for lk in proj["links"][:3]
        )
        mini_cards.append(f"""          <article class="mini-project-card">
            <a class="{thumb_cls}" href="{esc(proj['primary_url'])}" target="_blank" rel="noopener noreferrer" aria-label="{esc(proj['title'])}">
              <img src="{esc(proj['image'])}" alt="{esc(proj['image_alt'])}" width="{proj['image_width']}" height="{proj['image_height']}" loading="lazy">
              {badge}
            </a>
            <div class="mini-project-body">
              <h3><a href="{esc(proj['primary_url'])}" target="_blank" rel="noopener noreferrer">{esc(proj['title'])}</a></h3>
              <p><span data-lang="en">{esc(proj['summary_en'])}</span><span data-lang="zh">{esc(proj['summary_zh'])}</span></p>
              <div class="resource-links">{res_links}</div>
            </div>
          </article>""")

    head = render_head(
        data,
        page_title=site["title"],
        description=site["description_en"],
        canonical_path="/",
        css_ver=css_ver,
        js_ver=js_ver,
    )
    nav = render_nav(data, "about")
    rail = render_profile_rail(data)
    footer = render_footer(data)
    news_count = len(news_items_sorted)
    proj_count = len(data["projects"])

    return f"""{head}
  <body>
{nav}
    <main class="page-shell" id="content">
{rail}
      <div class="content-column">
        <section class="home-section" id="about-me" aria-labelledby="about-heading">
          <h1 class="page-title" id="about-heading"><span data-lang="en">About</span><span data-lang="zh">关于</span></h1>
          <p class="about-bio">
            <span data-lang="en">{p['about_html_en']}</span>
            <span data-lang="zh">{p['about_html_zh']}</span>
          </p>
        </section>

        <section class="home-section" id="research" aria-labelledby="research-heading">
          <div class="section-head">
            <h2 id="research-heading"><span data-lang="en">Research</span><span data-lang="zh">研究方向</span></h2>
          </div>
          <div class="research-grid">
{chr(10).join(research_cards)}
          </div>
        </section>

        <section class="home-section" id="news" aria-labelledby="news-heading">
          <div class="section-head">
            <h2 id="news-heading"><span data-lang="en">News</span><span data-lang="zh">动态</span></h2>
            <span class="section-meta"><span data-lang="en">{news_count} updates · scroll ↕</span><span data-lang="zh">{news_count} 条动态 · 可滚动 ↕</span></span>
          </div>
          <div class="news-box has-more-bottom">
            <div class="news-scroll" tabindex="0" aria-label="Scrollable news timeline">
              <ul class="news-list">
{chr(10).join(news_rows)}
              </ul>
            </div>
          </div>
        </section>

        <section class="home-section" id="writing" aria-labelledby="writing-heading">
          <div class="section-head">
            <h2 id="writing-heading"><span data-lang="en">Recent Writing</span><span data-lang="zh">近期写作</span></h2>
            <a class="section-link" href="/blog/"><span data-lang="en">All posts →</span><span data-lang="zh">全部文章 →</span></a>
          </div>
          <div class="writing-grid">
{recent_posts_html}
          </div>
          <p class="writing-note">
            <span data-lang="en">Blog brings together essays, research notes, and open-source experiments in one place.</span>
            <span data-lang="zh">Blog 统一承载研究笔记、开源实验与交互式技术记录。</span>
          </p>
        </section>

        <section class="home-section" id="selected-projects" aria-labelledby="projects-heading">
          <div class="section-head">
            <h2 id="projects-heading"><span data-lang="en">Selected Projects</span><span data-lang="zh">精选项目</span></h2>
            <a class="section-link" href="/projects/"><span data-lang="en">All {proj_count} projects →</span><span data-lang="zh">全部 {proj_count} 个项目 →</span></a>
          </div>
          <div class="selected-projects-grid">
{chr(10).join(mini_cards)}
          </div>
        </section>
{footer}
      </div>
    </main>
  </body>
</html>
"""


def render_projects_page(data: Dict[str, Any], css_ver: str, js_ver: str) -> str:
    site = data["site"]
    cards = []
    for item in data["projects"]:
        if item.get("video_url"):
            media_html = f"""          <figure class="research-video">
            <video controls autoplay muted loop playsinline preload="auto" poster="{esc(item['image'])}" width="1920" height="1080" aria-label="{esc(item.get('video_label') or item['title'])}">
              <source src="{esc(item['video_url'])}" type="video/mp4">
              <a href="{esc(item['video_url'])}">Watch the video</a>
            </video>
            <figcaption>
              <span data-lang="en">2-minute research overview</span><span data-lang="zh">两分钟研究介绍</span>
              <a href="{esc(item['video_url'])}"><span data-lang="en">Open video ↗</span><span data-lang="zh">打开视频 ↗</span></a>
            </figcaption>
          </figure>"""
        else:
            media_html = f"""          <a class="project-figure" href="{esc(item['primary_url'])}" target="_blank" rel="noopener noreferrer" aria-label="{esc(item['title'])}">
            <img src="{esc(item['image'])}" alt="{esc(item['image_alt'])}" width="{item['image_width']}" height="{item['image_height']}" loading="lazy">
          </a>"""

        date_html = f'<span class="project-date">{esc(item["date"][:7])}</span>' if item.get("date") else ""
        tags_html = "".join(f'<span class="tag-chip">{esc(t)}</span>' for t in item.get("tags", []))
        links_html = "".join(
            f'<a class="resource-link" href="{esc(lk["url"])}" target="_blank" rel="noopener noreferrer">'
            f'<span data-lang="en">{esc(lk["label_en"])}</span>'
            f'<span data-lang="zh">{esc(lk["label_zh"])}</span>'
            f' <span aria-hidden="true">↗</span></a>'
            for lk in item.get("links", [])
        )

        cards.append(f"""        <article class="project-card" id="{esc(item['slug'])}">
{media_html}
          <div class="project-copy">
            <div class="project-title-row">
              <h2><a href="{esc(item['primary_url'])}" target="_blank" rel="noopener noreferrer">{esc(item['title'])}</a></h2>
              {date_html}
            </div>
            <p><span data-lang="en">{esc(item['summary_en'])}</span><span data-lang="zh">{esc(item['summary_zh'])}</span></p>
            <div class="tag-row">{tags_html}</div>
            <div class="resource-links">{links_html}</div>
          </div>
        </article>""")

    head = render_head(
        data,
        page_title=f"Projects · {site['title']}",
        description=f"Open-source benchmarks, frameworks, and research projects by {site['title']}.",
        canonical_path="/projects/",
        css_ver=css_ver,
        js_ver=js_ver,
    )
    nav = render_nav(data, "projects")
    rail = render_profile_rail(data)
    footer = render_footer(data)

    return f"""{head}
  <body>
{nav}
    <main class="page-shell" id="content">
{rail}
      <div class="content-column">
        <header class="collection-header">
          <h1 class="page-title"><span data-lang="en">Projects</span><span data-lang="zh">项目</span></h1>
          <span class="section-meta"><span data-lang="en">{len(data['projects'])} open works</span><span data-lang="zh">共 {len(data['projects'])} 项</span></span>
        </header>
        <p class="page-lead">
          <span data-lang="en">Open-source benchmarks, frameworks, curated collections, and research series across agents, physical AI, and multimodal models.</span>
          <span data-lang="zh">围绕智能体、物理智能与多模态模型的开源基准、框架、资源索引与研究项目。</span>
        </p>
        <div class="project-list">
{chr(10).join(cards)}
        </div>
{footer}
      </div>
    </main>
  </body>
</html>
"""


def render_blog_index(data: Dict[str, Any], posts: List[Dict[str, Any]], css_ver: str, js_ver: str) -> str:
    site = data["site"]

    # Collect unique tags in stable order
    unique_tags: List[str] = []
    seen: set = set()
    for post in posts:
        for t in post["tags"]:
            key = t.lower()
            if key not in seen:
                seen.add(key)
                unique_tags.append(t)

    filter_pills = [
        '<button type="button" class="filter-pill" data-filter-tag="all" aria-pressed="true">'
        '<span data-lang="en">All</span><span data-lang="zh">全部</span></button>'
    ]
    for tag in unique_tags:
        filter_pills.append(
            f'<button type="button" class="filter-pill" data-filter-tag="{esc(tag.lower())}" aria-pressed="false">{esc(tag)}</button>'
        )

    cards_html = "\n".join(render_post_card(p) for p in posts)

    head = render_head(
        data,
        page_title=f"Blog · {site['title']}",
        description=f"Research notes, open-source experiments, interactive demos, and essays by {site['title']}.",
        canonical_path="/blog/",
        css_ver=css_ver,
        js_ver=js_ver,
    )
    nav = render_nav(data, "blog")
    rail = render_profile_rail(data)
    footer = render_footer(data)

    return f"""{head}
  <body>
{nav}
    <main class="page-shell" id="content">
{rail}
      <div class="content-column">
        <header class="collection-header">
          <h1 class="page-title"><span data-lang="en">Blog</span><span data-lang="zh">博客</span></h1>
          <div class="blog-header-actions">
            <span class="section-meta"><span data-post-count>{len(posts)}</span> <span data-lang="en" data-post-unit-en>{"post" if len(posts) == 1 else "posts"}</span><span data-lang="zh">篇</span></span>
            <a class="rss-link" href="/blog/rss.xml">RSS ↗</a>
          </div>
        </header>
        <p class="page-lead">
          <span data-lang="en">Research notes, open-source experiments, interactive demos, and technical ideas worth thinking through in writing.</span>
          <span data-lang="zh">研究笔记、开源实验、交互演示与值得写下来推敲的技术思考。</span>
        </p>
        <div class="tag-filters" data-tag-filters role="group" aria-label="Filter posts by tag">
          {"".join(filter_pills)}
        </div>
        <div class="writing-grid">
{cards_html}
        </div>
{footer}
      </div>
    </main>
  </body>
</html>
"""


def render_x_card(data: Dict[str, Any], x_post: Dict[str, Any]) -> str:
    site = data["site"]
    p = data["profile"]
    url = str(x_post.get("url") or "https://x.com/Xijie358")
    handle = str(x_post.get("handle") or p["handle"])
    date_str = str(x_post.get("date") or "")

    if x_post.get("text_en") and x_post.get("text_zh"):
        text_html = f'<span data-lang="en">{esc(x_post["text_en"])}</span><span data-lang="zh">{esc(x_post["text_zh"])}</span>'
    else:
        text_html = esc(x_post.get("text") or x_post.get("text_en") or "")

    media_html = ""
    if x_post.get("image"):
        media_html = (
            f'          <div class="x-card-media">'
            f'<img src="{esc(x_post["image"])}" alt="{esc(x_post.get("image_alt") or "Post preview")}" loading="lazy">'
            f"</div>\n"
        )

    return f"""        <a class="x-card" href="{esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="View companion post on X">
          <div class="x-card-head">
            <img class="x-card-avatar" src="{esc(site['avatar'])}" alt="{esc(p['name'])}" width="30" height="30">
            <div class="x-card-author">
              <span class="x-card-name">{esc(p['name'])}</span>
              <span class="x-card-handle">{esc(handle)}</span>
            </div>
            <span class="x-card-logo">{ICONS['x']}</span>
          </div>
          <p class="x-card-text">{text_html}</p>
{media_html}          <div class="x-card-foot">
            <span class="x-card-date">{esc(date_str)}</span>
            <span class="x-card-cta">View on X ↗</span>
          </div>
        </a>"""


def render_article_page(data: Dict[str, Any], post: Dict[str, Any], css_ver: str, js_ver: str) -> str:
    site = data["site"]
    p = data["profile"]

    # Build TOC items (compact Overview + Citation for short notes, full headings + Citation for long posts)
    toc_items: List[Dict[str, Any]] = []
    if not post["toc"]:
        toc_items.append({
            "level": 2,
            "id": "overview",
            "label_html": '<span data-lang="en">Overview</span><span data-lang="zh">正文</span>',
        })
    else:
        toc_items.extend(post["toc"])

    if post["citation"]:
        toc_items.append({
            "level": 2,
            "id": "citation",
            "label_html": '<span data-lang="en">Cite this post</span><span data-lang="zh">引用本文</span>',
        })

    toc_li_html = "\n".join(
        f'              <li class="toc-h{item["level"]}"><a href="#{esc(item["id"])}">{item["label_html"]}</a></li>'
        for item in toc_items
    )
    strip_li_html = "\n".join(
        f'            <li><a href="#{esc(item["id"])}">{item["label_html"]}</a></li>'
        for item in toc_items if item["level"] == 2
    )

    # Bilingual inline switcher for bilingual posts
    bilingual_switch = ""
    if post["bilingual"]:
        bilingual_switch = """          <div class="lang-pill" role="group" aria-label="Article language">
            <button type="button" data-locale-option="en" aria-pressed="true">EN</button>
            <button type="button" data-locale-option="zh" aria-pressed="false">中文</button>
          </div>"""

    title_html = (
        f'<span data-lang="en">{esc(post["title"])}</span><span data-lang="zh">{esc(post["title_zh"])}</span>'
        if post["bilingual"] and post["title_zh"]
        else esc(post["title"])
    )
    tldr_html = ""
    if post["tldr"]:
        tldr_inner = (
            f'<span data-lang="en">{esc(post["tldr"])}</span><span data-lang="zh">{esc(post["tldr_zh"])}</span>'
            if post["bilingual"] and post["tldr_zh"]
            else esc(post["tldr"])
        )
        tldr_html = f'          <p class="article-tldr">{tldr_inner}</p>\n'

    tags_html = "".join(f'<span class="tag-chip">{esc(t)}</span>' for t in post["tags"])
    read_en = f"{post['reading_minutes']} min read"
    read_zh = f"约 {post['reading_minutes']} 分钟"

    # BibTeX citation section
    citation_html = ""
    if post["citation"]:
        clean_slug = re.sub(r"[^a-zA-Z0-9]", "", post["slug"])
        cite_key = f"huang{post['date'].year}{clean_slug}"
        clean_title = post["title"].replace("{", "").replace("}", "")
        abs_url = site["url"].rstrip("/") + post["permalink"]
        bibtex = (
            f"@misc{{{cite_key},\n"
            f"  author = {{{p['name']}}},\n"
            f"  title = {{{clean_title}}},\n"
            f"  year = {{{post['date'].year}}},\n"
            f"  month = {{{post['date'].month:02d}}},\n"
            f"  url = {{{abs_url}}}\n"
            f"}}"
        )
        citation_html = f"""        <section class="post-citation" id="citation" aria-labelledby="citation-heading">
          <div class="citation-head">
            <h2 id="citation-heading"><span data-lang="en">Cite this post</span><span data-lang="zh">引用本文</span></h2>
            <button type="button" class="copy-citation-btn" data-copy-citation="post-bibtex">Copy BibTeX</button>
          </div>
          <p class="citation-line">{esc(p['name'])}. “{esc(post['title'])}.” {post['date'].year}.</p>
          <pre><code id="post-bibtex">{esc(bibtex)}</code></pre>
          <p class="copy-status" role="status" aria-live="polite"></p>
        </section>"""

    x_card_html = render_x_card(data, post["x_post"]) if isinstance(post.get("x_post"), dict) else ""
    aside_cls = "article-aside has-x-card" if x_card_html else "article-aside"

    head = render_head(
        data,
        page_title=f"{post['title']} · {site['title']}",
        description=post["summary"] or site["description_en"],
        canonical_path=post["permalink"],
        css_ver=css_ver,
        js_ver=js_ver,
        og_type="article",
        og_image_path=post["cover_url"] or site["avatar"],
        include_math=post["math"],
    )
    nav = render_nav(data, "blog", show_progress=True)
    rail = render_profile_rail(data)
    footer = render_footer(data)

    return f"""{head}
  <body class="is-article">
{nav}
    <main class="article-shell" id="content">
{rail}
      <article class="article-main">
        <nav class="toc-strip" aria-label="On this page">
          <ul class="toc-strip-list">
{strip_li_html}
          </ul>
        </nav>

        <header class="article-header" id="overview">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/blog/">Blog</a>
            <span class="breadcrumb-sep" aria-hidden="true">›</span>
            <span class="breadcrumb-current">{title_html}</span>
          </nav>

          <div class="article-meta-row">
            <div class="article-meta">
              <time datetime="{esc(post['date_iso'])}"><span data-lang="en">{esc(post['date_en'])}</span><span data-lang="zh">{esc(post['date_zh'])}</span></time>
              <span class="meta-sep" aria-hidden="true">·</span>
              <span><span data-lang="en">{read_en}</span><span data-lang="zh">{read_zh}</span></span>
              {tags_html}
            </div>
{bilingual_switch}
          </div>

          <h1>{title_html}</h1>
{tldr_html}          <div class="article-byline">
            <img class="byline-avatar" src="{esc(site['avatar'])}" alt="{esc(p['name'])}" width="28" height="28">
            <span><span data-lang="en">By</span><span data-lang="zh">作者：</span> <strong>{esc(p['name'])}</strong></span>
          </div>
        </header>

        <div class="article-body">
{post['body_html']}
        </div>

{citation_html}

        <nav class="article-foot-nav" aria-label="Post navigation">
          <a href="/blog/">← <span data-lang="en">All posts</span><span data-lang="zh">返回全部文章</span></a>
          <button type="button" class="back-to-top"><span data-lang="en">Back to top</span><span data-lang="zh">回到顶部</span> ↑</button>
        </nav>
{footer}
      </article>

      <aside class="{aside_cls}" aria-label="Table of contents and companion links">
        <div class="toc-panel">
          <p class="toc-heading"><span data-lang="en">On this page</span><span data-lang="zh">目录</span></p>
          <div class="toc-scroll">
            <nav class="toc-nav" aria-label="Table of contents">
              <span class="toc-indicator" aria-hidden="true"></span>
              <ul class="toc-list">
{toc_li_html}
              </ul>
            </nav>
          </div>
        </div>
{x_card_html}
      </aside>
    </main>
  </body>
</html>
"""


def render_redirect_page(data: Dict[str, Any], target_path: str, title: str) -> str:
    abs_url = data["site"]["url"].rstrip("/") + target_path
    return f"""<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <title>Redirecting · {esc(title)}</title>
    <link rel="canonical" href="{esc(abs_url)}">
    <meta http-equiv="refresh" content="0; url={esc(target_path)}">
    <meta name="robots" content="noindex">
  </head>
  <body>
    <p>Redirecting to <a href="{esc(target_path)}">{esc(title)}</a>…</p>
  </body>
</html>
"""


def render_404_page(data: Dict[str, Any], css_ver: str, js_ver: str) -> str:
    site = data["site"]
    head = render_head(
        data,
        page_title=f"Page not found · {site['title']}",
        description=site["description_en"],
        canonical_path="/404.html",
        css_ver=css_ver,
        js_ver=js_ver,
    )
    nav = render_nav(data, "")
    rail = render_profile_rail(data)
    footer = render_footer(data)

    return f"""{head}
  <body>
{nav}
    <main class="page-shell" id="content">
{rail}
      <div class="content-column">
        <section class="not-found-box">
          <p class="not-found-code">404</p>
          <h1 class="page-title"><span data-lang="en">Page not found</span><span data-lang="zh">页面不存在</span></h1>
          <p class="page-lead">
            <span data-lang="en">The page you are looking for may have moved or no longer exists.</span>
            <span data-lang="zh">你访问的页面可能已移动或不再存在。</span>
          </p>
          <div class="resource-links">
            <a class="resource-link" href="/"><span data-lang="en">Return home →</span><span data-lang="zh">返回首页 →</span></a>
            <a class="resource-link" href="/projects/"><span data-lang="en">Projects</span><span data-lang="zh">项目</span></a>
            <a class="resource-link" href="/blog/"><span data-lang="en">Blog</span><span data-lang="zh">博客</span></a>
          </div>
        </section>
{footer}
      </div>
    </main>
  </body>
</html>
"""


def render_rss(data: Dict[str, Any], posts: List[Dict[str, Any]]) -> str:
    site = data["site"]
    base = site["url"].rstrip("/")
    items = []
    for post in posts:
        link = base + post["permalink"]
        desc = post["tldr"] or post["summary"]
        items.append(f"""    <item>
      <title>{esc(post['title'])}</title>
      <link>{esc(link)}</link>
      <guid isPermaLink="true">{esc(link)}</guid>
      <pubDate>{esc(format_rfc2822(post['date']))}</pubDate>
      <description>{esc(desc)}</description>
    </item>""")
    return f"""<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{esc(site['title'])} · Blog</title>
    <link>{esc(base)}/blog/</link>
    <atom:link href="{esc(base)}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <description>{esc(site['description_en'])}</description>
    <language>en-us</language>
{chr(10).join(items)}
  </channel>
</rss>
"""


def render_posts_json(data: Dict[str, Any], posts: List[Dict[str, Any]]) -> str:
    base = data["site"]["url"].rstrip("/")
    payload = [
        {
            "title": p["title"],
            "slug": p["slug"],
            "date": p["date_iso"],
            "url": base + p["permalink"],
            "permalink": p["permalink"],
            "tags": p["tags"],
            "summary": p["summary"],
            "tldr": p["tldr"],
            "reading_minutes": p["reading_minutes"],
            "cover": p["cover_url"],
        }
        for p in posts
    ]
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def render_sitemap(data: Dict[str, Any], posts: List[Dict[str, Any]]) -> str:
    base = data["site"]["url"].rstrip("/")
    urls = [
        f"{base}/",
        f"{base}/projects/",
        f"{base}/blog/",
    ]
    for post in posts:
        urls.append(base + post["permalink"])

    entries = "\n".join(f"  <url><loc>{esc(u)}</loc></url>" for u in urls)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{entries}
</urlset>
"""


# ---------------------------------------------------------------------------
# Main Build Routine
# ---------------------------------------------------------------------------
def copy_bundle_assets(src_dir: Path, dst_dir: Path) -> None:
    dst_dir.mkdir(parents=True, exist_ok=True)
    skip_names = {"index.html", "index.md", "meta.json", ".DS_Store"}
    for child in src_dir.iterdir():
        if child.name in skip_names or child.name.startswith("."):
            continue
        target = dst_dir / child.name
        if child.is_dir():
            shutil.copytree(child, target, dirs_exist_ok=True)
        else:
            shutil.copy2(child, target)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def build(out_dir: Path, with_showcase: bool = False) -> None:
    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    css_ver = file_hash(ASSETS_DIR / "css" / "site.css")
    js_ver = file_hash(ASSETS_DIR / "js" / "site.js")

    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # 1. Copy active assets
    shutil.copytree(ASSETS_DIR, out_dir / "assets")

    # 2. Load published posts (strictly from content/posts/, never content/drafts/)
    posts: List[Dict[str, Any]] = []
    if POSTS_DIR.exists():
        for entry in sorted(POSTS_DIR.iterdir()):
            if not entry.is_dir() or entry.name.startswith("."):
                continue
            post = load_post(entry, url_prefix="/blog")
            if post is not None:
                posts.append(post)
    posts.sort(key=lambda p: (p["date"], p["slug"]), reverse=True)

    # 3. Render primary pages
    write_text(out_dir / "index.html", render_homepage(data, posts, css_ver, js_ver))
    write_text(out_dir / "projects" / "index.html", render_projects_page(data, css_ver, js_ver))
    write_text(out_dir / "blog" / "index.html", render_blog_index(data, posts, css_ver, js_ver))
    write_text(out_dir / "404.html", render_404_page(data, css_ver, js_ver))

    # 4. Render published posts + companion assets + legacy aliases
    for post in posts:
        post_out = out_dir / "blog" / post["slug"]
        copy_bundle_assets(post["dir"], post_out)
        write_text(post_out / "index.html", render_article_page(data, post, css_ver, js_ver))
        for alias in post["aliases"]:
            rel = alias.strip("/")
            if rel:
                write_text(out_dir / rel / "index.html", render_redirect_page(data, post["permalink"], post["title"]))

    # 5. Auxiliary feeds & discovery files
    write_text(out_dir / "blog" / "rss.xml", render_rss(data, posts))
    write_text(out_dir / "blog" / "posts.json", render_posts_json(data, posts))
    write_text(out_dir / "sitemap.xml", render_sitemap(data, posts))
    write_text(
        out_dir / "robots.txt",
        f"User-agent: *\nAllow: /\n\nSitemap: {data['site']['url'].rstrip('/')}/sitemap.xml\n",
    )
    write_text(out_dir / ".nojekyll", "")

    # 6. Optional local preview showcase (NEVER included in default production _site)
    if with_showcase and SHOWCASE_DIR.exists():
        showcase = load_post(SHOWCASE_DIR, url_prefix="/preview")
        if showcase is not None:
            sc_out = out_dir / "preview" / showcase["slug"]
            copy_bundle_assets(SHOWCASE_DIR, sc_out)
            write_text(sc_out / "index.html", render_article_page(data, showcase, css_ver, js_ver))

    mode = "preview (+showcase)" if with_showcase else "production"
    print(f"Built {mode} site into {out_dir} ({len(posts)} published post(s)).")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build JeixHuang.github.io static site.")
    parser.add_argument("--out", default="_site", help="Output directory (default: _site)")
    parser.add_argument(
        "--with-showcase",
        action="store_true",
        help="Also render templates/post-starter to /preview/html-post-showcase/ (local preview only)",
    )
    args = parser.parse_args()
    out_path = Path(args.out)
    if not out_path.is_absolute():
        out_path = REPO_ROOT / out_path
    build(out_path, with_showcase=args.with_showcase)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
