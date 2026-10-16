# Victor Shea-Jay Huang Homepage

Source for [jeixhuang.github.io](https://jeixhuang.github.io/).

## Site structure

- `/`: About me, Research, and Updates. The brief biography lives in `index.html`; bilingual research scope and dated updates are maintained in `_data/about.yml`. Keep updates tied to their recorded sources and use only confirmed dates.
- `/publications/`: the five selected papers, newest first. Each paper has its own `/publications/<slug>/` page, figure, summary, source links, and copyable/downloadable BibTeX.
- `/projects/`: research projects, code, and resources with real project figures; maintained in `_data/homepage.yml`. Each entry includes `image`, descriptive `image_alt`, and the original `image_source` for maintenance. Figures are displayed in full without cropping.
- `/blog/` and `/blog/en/`: writing, with image / TL;DR / Read / Citation cards. Both indexes include available originals, preferring real translations when present.
- All collections and detail pages retain the same author sidebar and primary navigation. Article contents sit on the right on wide screens and collapse above the text on smaller screens.

Jekyll builds the profile and paper/project pages; Hugo builds the blog. `.github/workflows/deploy-gh-pages.yml` builds both and publishes `main` to `gh-pages`. Generated output is not committed.

## Local build

Install Ruby, Bundler 2.4.19, and Hugo 0.161.1, then run:

```sh
bundle install
LANG=en_US.UTF-8 JEKYLL_ENV=production bundle exec jekyll build --destination _site
hugo --source blog_src --destination ../_site/blog --minify
python3 scripts/check_site.py
python3 -m http.server 4000 --directory _site
```

Open <http://127.0.0.1:4000/>. Rebuild Jekyll and then Hugo after edits.

## Publications

`_data/selected_publications.yml` is the content source. `sort_date` records the dated proceedings, public acceptance record, or first preprint date, with a source and explanation in `note`. It is deliberately distinct from an unverified future presentation date. Keep official author order and venue provenance; the owner's name is highlighted in both published forms.

A new paper needs a data entry, a real figure, a matching `assets/citations/<slug>.bib`, and a small `publications/<slug>/index.html` file selecting `layout: publication`, `section: publications`, and `paper_slug`. Resource buttons appear only when their URL exists. Keep the inline citation and downloadable BibTeX identical.

`_layouts/homepage.html`, `_includes/identity.html`, and `assets/css/site-shell.css` provide the Jekyll shell. Hugo uses the same stylesheet and matching `blog_src/layouts/partials/identity.html`. Public profile values in `_config.yml` and `blog_src/data/profile.yaml` should stay synchronized.

## Blog content

A post bundle may include these optional front-matter fields:

```yaml
title: An article title
date: 2026-10-16T12:00:00+08:00
slug: an-article-title
summary: A short summary.
tldr: The main idea in one or two sentences.
cover: figure.png
content_lang: en
```

Keep the cover inside the bundle. Without a cover, the card uses a typographic title panel. Citation is generated from the author, original title, publication date, and permanent URL. Short articles use compact Overview / Citation navigation; longer articles also list their section headings.

The `EN / 中` control links to a real translation when available. If an article has no translation, that language is unavailable; an index may still list the original with an explicit language label. `content_lang` marks the original language without changing an existing URL.

For a translated bundle, keep `index.md` and `index.en.md` together. Preserve original technical terms, evidence boundaries, and meaning.

`draft: true` excludes a post from production rendering; `hide_from_lists: true` hides an otherwise public page from indexes. Draft prose should remain outside a public Git repository until intentionally released: `draft: true` only controls rendering. The two existing drafts remain unpublished; only `Why the blog` is listed.

Long-form source notes use:

```md
A claim with its source.{{</* sidenote url="https://example.com/paper" */>}}
Paper title (Author et al., 2026){{</* /sidenote */>}}
```

These notes stay in the article flow so they do not collide with the right-hand contents. KaTeX continues to render mathematical notation.

## License

Source is distributed under the [CC0-1.0 license](LICENSE).
