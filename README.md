# Victor Shea-Jay Huang — Personal Site

Source for [jeixhuang.github.io](https://jeixhuang.github.io/), built with a zero-dependency Python 3 static pipeline.

## Repository Structure

```text
├── data/site.json                 # Single source of truth (profile, research, news, projects)
├── content/
│   ├── posts/<slug>/              # Published Blog posts & experiments (native HTML or Markdown)
│   └── drafts/                    # Unpublished drafts (strictly excluded from production builds)
├── templates/post-starter/        # Copy-paste rich HTML post starter & interactive showcase
├── assets/
│   ├── css/site.css               # Unified editorial design system (Light default + Dark mode)
│   ├── js/site.js                 # Locale, theme, News scroll fades, sliding TOC, footnotes, copy
│   ├── fonts/                     # Self-hosted Geist fallback
│   ├── img/                       # Portrait avatar & favicon
│   ├── projects/                  # Active project figures & video poster
│   ├── files/                     # Active project overview diagrams
│   └── videos/                    # SWE-Shift research overview video
├── scripts/
│   ├── build.py                   # Zero-dependency Python 3 static site generator
│   └── check_site.py              # Automated link, layout, SEO, and draft-boundary gate
└── .github/workflows/deploy-gh-pages.yml
```

## Local Build & Preview

No Ruby, Hugo, or Node packages required — only Python 3.9+:

```sh
# 1. Build production site into _site/
python3 scripts/build.py

# 2. Run automated integrity & draft-exclusion checks
python3 scripts/check_site.py _site

# 3. Preview locally
python3 -m http.server 4000 --directory _site
```

To also inspect the rich HTML starter showcase at `/preview/html-post-showcase/` (kept strictly out of production `_site/`):

```sh
python3 scripts/build.py --with-showcase --out _site_preview
python3 scripts/check_site.py _site_preview --allow-showcase
python3 -m http.server 4001 --directory _site_preview
```

## Publish a New Rich HTML Post or Experiment in 3 Steps

Blog unifies essays, research notes, open-source experiments, and interactive demos under `content/posts/`.

1. **Copy the starter folder**:
   ```sh
   cp -R templates/post-starter content/posts/my-new-note
   ```
2. **Edit `content/posts/my-new-note/index.html`**:
   - Update the top `<!--meta { ... } -->` JSON block (`title`, `date`, `slug`, `tags`, `tldr`, optional `math: true`, `bilingual: true`, and optional `x_post` for the right-hand companion X card below the sliding TOC).
   - **Card artwork**: Homepage & `/blog/` cards automatically render a deterministic `16:10` inline SVG print seeded from `slug`. You can also pick a style/palette explicitly via `"art": {"style": "strata|contour|blocks|meridian|ribbon|terrace", "palette": "cobalt|pine|terracotta|plum|slate|indigo"}`, or set `"cover_mode": "image"` with `"cover": "fig.png"` to display a custom image/GIF on cards.
   - Drop any GIFs, MP4 clips, PNGs, SVGs, or JSON data directly into `content/posts/my-new-note/` and reference them with `./filename`.
   - Write standard HTML directly — `<canvas>`, `<svg>`, `<video>`, `.viz`, `.media-stage`, `.callout`, `.fn-ref` hover footnotes, and `<script>` blocks render verbatim.
   - *(Prefer plain Markdown? Create `index.md` with YAML frontmatter instead — both formats work seamlessly.)*
3. **Build & verify**:
   ```sh
   python3 scripts/build.py && python3 scripts/check_site.py _site
   ```

## Draft Safety

- Keep works-in-progress inside `content/drafts/` (never scanned by `scripts/build.py`), or mark `"draft": true` in post metadata.
- `scripts/check_site.py` blocks CI deployment if any unpublished draft slug or preview showcase leaks into `_site/`.

## License

Source is distributed under the [CC0-1.0 license](LICENSE).
