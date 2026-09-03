# Victor Shea-Jay Huang Homepage

Source for [jeixhuang.github.io](https://jeixhuang.github.io/).

This is an independent repository containing the current homepage and blog:

- Jekyll renders the homepage from `index.md`, `_layouts/homepage.html`, the five `_data/publication_*.yml` files, and the assets they reference.
- Hugo renders the blog from `blog_src/` into `/blog/`.
- `.github/workflows/deploy-gh-pages.yml` builds both parts and publishes the result to the `gh-pages` branch.

Generated Jekyll and Hugo output is intentionally not committed to `main`.

## Local build

Install Ruby, Bundler 2.4.19, and Hugo 0.161.1, then run:

```bash
bundle install
JEKYLL_ENV=production bundle exec jekyll build --destination _site
hugo --source blog_src --destination ../_site/blog --minify
```

Serve the generated site:

```bash
ruby -run -e httpd _site -p 4000
```

Then open <http://127.0.0.1:4000/>.

## Long-form margin citations

Long-form posts keep a sticky left table of contents, a centered reading
column, and optional right margin citations. Add a citation with the Hugo
shortcode:

```md
The claim that needs a source.{{</* sidenote url="https://example.com/paper" */>}}
Paper title (Author et al., 2026){{</* /sidenote */>}}
```

At wide desktop widths the note floats beside its source paragraph. At medium
and mobile widths it returns to the article flow. Draft prose should remain
outside a public Git repository until it is intentionally released; Hugo's
`draft: true` only affects rendering.

## Blog translations

The Blog header always shows a compact `EN / 中` switch. When the current page
has a translation, the other segment links directly to it. When no translation
exists, that segment stays visible but is marked unavailable instead of
redirecting to unrelated content.

For a translated post bundle, keep the default Chinese source and English
translation together:

```text
blog_src/content/posts/Post title/
├── index.md       # Chinese / default language
└── index.en.md    # English translation
```

The two files must preserve source-native technical terms and share the same
meaning, Evidence boundary, and public `work_id` when mapped to a Repo Work.

## License

The source in this repository is distributed under the [CC0-1.0 license](LICENSE).
