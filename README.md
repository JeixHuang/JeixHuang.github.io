# Victor Shea-Jay Huang Homepage

Source for `https://jeixhuang.github.io/`.

The site is built from two static systems:

- Jekyll builds the homepage from `index.md`, `_layouts/homepage.html`, and `_data/publication_*.yml`.
- Hugo builds the blog from `blog_src/` into `/blog/`.

Deployment is handled by `.github/workflows/deploy-gh-pages.yml`, which publishes the generated `_site` directory to the `gh-pages` branch.

## Local Build

```bash
bundle install
JEKYLL_ENV=production PAGES_REPO_NWO=JeixHuang/JeixHuang.github.io bundle exec jekyll build --destination _site
hugo --source blog_src --destination ../_site/blog --minify
```

Serve the generated site:

```bash
ruby -run -e httpd _site -p 4000
```

Then open `http://127.0.0.1:4000/`.
