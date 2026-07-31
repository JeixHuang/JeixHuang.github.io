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

## License

The source in this repository is distributed under the [CC0-1.0 license](LICENSE).
