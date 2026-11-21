#!/usr/bin/env python3
"""Automated quality gate for the built JeixHuang.github.io static site.

Verifies links, anchors, duplicate DOM IDs, dynamic data parity with data/site.json,
scrollable News, SWE-Shift video, SEO/favicon hygiene, XML/JSON feeds, and strict
dynamic draft/showcase exclusion.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple
from urllib.parse import unquote, urljoin, urlparse


REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = REPO_ROOT / "data" / "site.json"
DRAFTS_DIR = REPO_ROOT / "content" / "drafts"
POSTS_DIR = REPO_ROOT / "content" / "posts"

HOST = "https://jeixhuang.github.io"
NETLOC = "jeixhuang.github.io"
BASELINE_DRAFT_SLUGS = (
    "mindrl-reward-interface",
    "late-may-vla-wam-world-model-reading-list-vol-1",
)


def _slugify(text: str) -> str:
    plain = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", text.strip().lower())
    return re.sub(r"-{2,}", "-", plain).strip("-")


def _extract_bundle_meta(bundle_dir: Path) -> Dict[str, Any]:
    meta: Dict[str, Any] = {}
    meta_file = bundle_dir / "meta.json"
    if meta_file.exists():
        try:
            meta.update(json.loads(meta_file.read_text(encoding="utf-8")))
        except json.JSONDecodeError:
            pass

    for fname in ("index.html", "index.md"):
        src = bundle_dir / fname
        if not src.exists():
            continue
        raw = src.read_text(encoding="utf-8")
        m_json = re.match(r"^\s*<!--\s*meta\s*(\{.*?\})\s*-->", raw, flags=re.S)
        m_yaml = re.match(r"^\s*---\s*\n(.*?)\n---", raw, flags=re.S)
        if m_json:
            try:
                meta.update(json.loads(m_json.group(1)))
            except json.JSONDecodeError:
                pass
        elif m_yaml:
            for line in m_yaml.group(1).splitlines():
                line = line.strip()
                if not line or line.startswith("#") or ":" not in line:
                    continue
                k, v = line.split(":", 1)
                k, v = k.strip(), v.strip()
                if v.lower() == "true":
                    meta[k] = True
                elif v.lower() == "false":
                    meta[k] = False
                else:
                    meta[k] = v.strip("\"'")
        break
    return meta


def discover_forbidden_draft_slugs() -> Set[str]:
    """Combine baseline draft slugs with all drafts in content/drafts/ and draft:true posts."""
    slugs: Set[str] = set(BASELINE_DRAFT_SLUGS)

    if DRAFTS_DIR.exists():
        for entry in DRAFTS_DIR.iterdir():
            if not entry.is_dir() or entry.name.startswith("."):
                continue
            meta = _extract_bundle_meta(entry)
            slug = str(meta.get("slug") or _slugify(entry.name)).strip()
            if slug:
                slugs.add(slug)

    if POSTS_DIR.exists():
        for entry in POSTS_DIR.iterdir():
            if not entry.is_dir() or entry.name.startswith("."):
                continue
            meta = _extract_bundle_meta(entry)
            if bool(meta.get("draft", False)):
                slug = str(meta.get("slug") or _slugify(entry.name)).strip()
                if slug:
                    slugs.add(slug)

    return slugs


class PageInspector(HTMLParser):
    def __init__(self, text: str) -> None:
        super().__init__()
        self.ids: Set[str] = set()
        self.duplicate_ids: List[str] = []
        self.refs: List[str] = []
        self.classes: List[str] = []
        self.h1_count: int = 0
        self.videos: List[Dict[str, str]] = []
        self.icons: List[Dict[str, str]] = []
        self.meta_images: List[Tuple[str, str]] = []
        self.feed(text)

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, str]]) -> None:
        attr_map = {k: (v if v is not None else "") for k, v in attrs}
        el_id = attr_map.get("id", "")
        if el_id:
            if el_id in self.ids:
                self.duplicate_ids.append(el_id)
            else:
                self.ids.add(el_id)
        if "class" in attr_map:
            self.classes.extend(attr_map["class"].split())
        if tag == "h1":
            self.h1_count += 1
        elif tag == "video":
            self.videos.append(attr_map)
        elif tag == "link" and "icon" in attr_map.get("rel", "").split():
            self.icons.append(attr_map)
        elif tag == "meta":
            key = attr_map.get("property") or attr_map.get("name") or ""
            if key in ("og:image", "twitter:image"):
                self.meta_images.append((key, attr_map.get("content", "")))

        for ref_attr in ("href", "src", "poster"):
            if ref_attr in attr_map:
                self.refs.append(attr_map[ref_attr])


def check_site(root: Path, allow_showcase: bool = False) -> Tuple[List[str], Dict[str, int]]:
    errors: List[str] = []
    if not root.exists():
        return [f"Output directory does not exist: {root}"], {}

    site_data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    expected_news = len(site_data.get("news", []))
    expected_projects = len(site_data.get("projects", []))
    if expected_news < 1:
        errors.append("data/site.json: expected at least 1 news item")
    if expected_projects < 1:
        errors.append("data/site.json: expected at least 1 project item")

    pages: Dict[Path, PageInspector] = {}
    for html_path in sorted(root.rglob("*.html")):
        pages[html_path] = PageInspector(html_path.read_text(encoding="utf-8"))

    # 1. Duplicate DOM IDs, internal links, media assets, fragment anchors, and zero /publications/
    for path, page in pages.items():
        rel = str(path.relative_to(root))
        for dup_id in sorted(set(page.duplicate_ids)):
            errors.append(f"{rel}: duplicate DOM id=\"{dup_id}\"")

        base = f"{HOST}/{rel}"
        for ref in page.refs:
            if not ref:
                errors.append(f"{rel}: empty URL reference")
                continue
            if "/publications/" in ref:
                errors.append(f"{rel}: forbidden legacy /publications/ reference ({ref})")
            parsed = urlparse(urljoin(base, ref))
            if parsed.scheme not in ("http", "https") or parsed.netloc != NETLOC:
                continue
            target = root / unquote(parsed.path).lstrip("/")
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                errors.append(
                    f"{rel}: broken internal target {ref} -> "
                    f"{target.relative_to(root) if str(target).startswith(str(root)) else target}"
                )
            elif parsed.fragment and target in pages:
                frag = unquote(parsed.fragment)
                if frag not in pages[target].ids:
                    errors.append(f"{rel}: missing fragment #{frag} in {target.relative_to(root)}")

    if (root / "publications").exists():
        errors.append("publications/ directory must not exist in built output")

    # 2. Primary routes: profile-rail, unique H1, favicon MIME, absolute og:image
    primary_routes = (
        "index.html",
        "projects/index.html",
        "blog/index.html",
        "blog/why-the-blog/index.html",
        "404.html",
    )
    for route in primary_routes:
        page = pages.get(root / route)
        if not page:
            errors.append(f"{route}: missing required page")
            continue
        if page.h1_count != 1:
            errors.append(f"{route}: expected exactly 1 <h1>, found {page.h1_count}")
        if "profile-rail" not in page.classes:
            errors.append(f"{route}: missing .profile-rail")
        if not any(ic.get("type") == "image/jpeg" for ic in page.icons):
            errors.append(f'{route}: favicon must specify type="image/jpeg"')
        for key, val in page.meta_images:
            if not val.startswith(f"{HOST}/"):
                errors.append(f"{route}: {key} must be an absolute URL ({val})")

    # 3. Homepage invariants (#about-me, #research, #news, .news-scroll, dynamic News count)
    home = pages.get(root / "index.html")
    if home:
        required_ids = {"about-me", "research", "news", "writing", "selected-projects"}
        missing_ids = required_ids - home.ids
        if missing_ids:
            errors.append(f"index.html: missing sections {sorted(missing_ids)}")
        if "news-scroll" not in home.classes:
            errors.append("index.html: missing .news-scroll scrollable News container")
        actual_news = home.classes.count("news-item")
        if actual_news != expected_news:
            errors.append(f"index.html: expected {expected_news} .news-item entries from data/site.json, found {actual_news}")

    # 4. Projects invariants (dynamic count, SWE-Shift video + external links)
    projects = pages.get(root / "projects/index.html")
    if projects:
        actual_projects = projects.classes.count("project-card")
        if actual_projects != expected_projects:
            errors.append(f"projects/index.html: expected {expected_projects} .project-card entries from data/site.json, found {actual_projects}")
        has_swe_shift = any(p.get("slug") == "swe-shift" and p.get("video_url") for p in site_data.get("projects", []))
        if has_swe_shift:
            if len(projects.videos) < 1:
                errors.append("projects/index.html: expected SWE-Shift video player")
            else:
                v = projects.videos[0]
                needed_attrs = {"controls", "autoplay", "muted", "loop", "playsinline", "poster", "aria-label"}
                if not needed_attrs <= set(v.keys()) or v.get("preload") != "auto":
                    errors.append("projects/index.html: SWE-Shift <video> missing required autoplay/loop/controls attributes")
            for url in (
                "https://arxiv.org/abs/2610.32196",
                "https://arxiv.org/pdf/2610.32196",
                "https://github.com/JeixHuang/SWE-Shift",
            ):
                if url not in projects.refs:
                    errors.append(f"projects/index.html: missing SWE-Shift external link {url}")

    # 5. Unified Blog gallery + Why the blog + legacy alias
    blog_idx = pages.get(root / "blog/index.html")
    if blog_idx:
        if blog_idx.classes.count("post-card") < 1 or blog_idx.classes.count("post-excerpt") < 1:
            errors.append("blog/index.html: missing .post-card or .post-excerpt")
        if "writing-grid" not in blog_idx.classes or "art-svg" not in blog_idx.classes:
            errors.append("blog/index.html: expected compact .writing-grid with .art-svg card artwork")
        if "/blog/why-the-blog/" not in blog_idx.refs:
            errors.append("blog/index.html: missing link to /blog/why-the-blog/")

    if home and ("writing-grid" not in home.classes or "art-svg" not in home.classes):
        errors.append("index.html: expected compact .writing-grid with .art-svg card artwork")

    if not (root / "blog/2026/01/29/why-the-blog/index.html").exists():
        errors.append("blog/2026/01/29/why-the-blog/index.html: missing legacy redirect page")

    why_post = pages.get(root / "blog/why-the-blog/index.html")
    if why_post:
        for cls in ("article-main", "toc-nav", "toc-indicator", "profile-rail"):
            if cls not in why_post.classes:
                errors.append(f"blog/why-the-blog/index.html: missing .{cls}")
        if "citation" not in why_post.ids:
            errors.append("blog/why-the-blog/index.html: missing #citation BibTeX section")
        if not (root / "blog/why-the-blog/why-the-blog.png").exists():
            errors.append("blog/why-the-blog/why-the-blog.png: missing cover asset")

    # 6. Auxiliary files (RSS, JSON, sitemap, robots, .nojekyll)
    for aux in ("blog/rss.xml", "blog/posts.json", "sitemap.xml", "robots.txt", ".nojekyll"):
        if not (root / aux).exists():
            errors.append(f"{aux}: missing auxiliary file")

    if (root / "blog/rss.xml").exists():
        try:
            ET.fromstring((root / "blog/rss.xml").read_text(encoding="utf-8"))
        except ET.ParseError as exc:
            errors.append(f"blog/rss.xml: invalid XML ({exc})")

    if (root / "sitemap.xml").exists():
        sm_text = (root / "sitemap.xml").read_text(encoding="utf-8")
        try:
            ET.fromstring(sm_text)
        except ET.ParseError as exc:
            errors.append(f"sitemap.xml: invalid XML ({exc})")
        if "/publications/" in sm_text:
            errors.append("sitemap.xml: must not contain /publications/")

    if (root / "blog/posts.json").exists():
        try:
            posts_data = json.loads((root / "blog/posts.json").read_text(encoding="utf-8"))
            if not isinstance(posts_data, list) or len(posts_data) < 1:
                errors.append("blog/posts.json: expected non-empty JSON array")
        except json.JSONDecodeError as exc:
            errors.append(f"blog/posts.json: invalid JSON ({exc})")

    # 7. Strict dynamic draft & showcase boundary scan
    forbidden_drafts = discover_forbidden_draft_slugs()
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix not in (".html", ".json", ".xml"):
            continue
        text = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(root))
        for forbidden in sorted(forbidden_drafts):
            if forbidden in text:
                errors.append(f"{rel}: unpublished draft slug leaked ({forbidden})")
        if not allow_showcase and "html-post-showcase" in text:
            errors.append(f"{rel}: preview showcase leaked into production output")

    # 8. Optional showcase page verification (when checking _site_preview)
    if allow_showcase:
        sc = pages.get(root / "preview/html-post-showcase/index.html")
        if not sc:
            errors.append("preview/html-post-showcase/index.html: missing showcase page")
        else:
            if sc.h1_count != 1:
                errors.append(f"preview/html-post-showcase/index.html: expected 1 <h1>, found {sc.h1_count}")
            for cls in (
                "profile-rail", "article-main", "toc-nav", "toc-indicator",
                "x-card", "media-stage", "viz", "seg-toggle", "preset-grid", "fn-ref",
            ):
                if cls not in sc.classes:
                    errors.append(f"preview/html-post-showcase/index.html: missing .{cls}")
            if sc.classes.count("art-svg") < 6:
                errors.append(f"preview/html-post-showcase/index.html: expected >= 6 .art-svg presets, found {sc.classes.count('art-svg')}")

    stats = {
        "pages": len(pages),
        "news": expected_news,
        "projects": expected_projects,
        "draft_guards": len(forbidden_drafts),
    }
    return errors, stats


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate built JeixHuang.github.io output.")
    parser.add_argument("target", nargs="?", default="_site", help="Directory to validate (default: _site)")
    parser.add_argument("--allow-showcase", action="store_true", help="Allow and validate preview/html-post-showcase")
    args = parser.parse_args()

    target_root = Path(args.target).resolve()
    errors, stats = check_site(target_root, allow_showcase=args.allow_showcase)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1

    mode = "preview (+showcase)" if args.allow_showcase else "production"
    print(
        f"OK ({mode}): {stats['pages']} HTML pages verified; 0 duplicate IDs, internal links & anchors valid, "
        f"scrollable News ({stats['news']}), Projects ({stats['projects']}) + SWE-Shift video, "
        f"unified Blog, feeds, and {stats['draft_guards']} draft guards clean."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
