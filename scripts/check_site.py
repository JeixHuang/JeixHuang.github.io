"""Check the assembled Jekyll + Hugo output, including navigation and draft boundaries."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import sys

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
HOST = 'https://jeixhuang.github.io'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.refs, self.classes, self.h1 = set(), [], [], 0
        self.videos = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        self.classes.extend(attrs.get('class', '').split())
        self.h1 += tag == 'h1'
        if tag == 'video':
            self.videos.append(attrs)
        for attr in ('href', 'src', 'poster'):
            if attr in attrs:
                self.refs.append(attrs[attr])

pages = {p: Page(p.read_text()) for p in ROOT.rglob('*.html')}
errors = []
for path, page in pages.items():
    base = HOST + '/' + str(path.relative_to(ROOT))
    for ref in page.refs:
        if not ref:
            errors.append(f'{path.relative_to(ROOT)}: empty URL')
            continue
        url = urlparse(urljoin(base, ref))
        if url.scheme not in ('http', 'https') or url.netloc != 'jeixhuang.github.io':
            continue
        target = ROOT / unquote(url.path).lstrip('/')
        if target.is_dir():
            target /= 'index.html'
        if not target.exists():
            errors.append(f'{path.relative_to(ROOT)}: missing {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{path.relative_to(ROOT)}: missing fragment {ref}')

for route in ('index.html', 'publications/index.html', 'projects/index.html', 'blog/index.html', 'blog/en/index.html'):
    page = pages.get(ROOT / route)
    if not page or page.h1 != 1 or 'identity-rail' not in page.classes:
        errors.append(f'{route}: missing page, profile, or unique main heading')
if not {'about-me', 'research', 'updates'} <= pages[ROOT / 'index.html'].ids:
    errors.append('index.html: missing About, Research, or Updates section')
for route in ('publications/index.html',):
    if pages[ROOT / route].classes.count('publication-card') != 6:
        errors.append(f'{route}: expected the six selected papers')
for route in ('publications/index.html', 'projects/index.html', 'publications/swe-shift/index.html'):
    page = pages.get(ROOT / route)
    if not page or len(page.videos) != 1:
        errors.append(f'{route}: expected the SWE-Shift video player')
        continue
    video = page.videos[0]
    if not {'controls', 'autoplay', 'muted', 'loop', 'playsinline', 'poster', 'aria-label'} <= video.keys() or video.get('preload') != 'auto':
        errors.append(f'{route}: video must autoplay muted, loop, and retain accessible native controls')
    for resource in ('https://arxiv.org/abs/2610.32196', 'https://arxiv.org/pdf/2610.32196', 'https://github.com/JeixHuang/SWE-Shift'):
        if resource not in page.refs:
            errors.append(f'{route}: missing SWE-Shift resource {resource}')
for route in ('blog/index.html', 'blog/en/index.html'):
    page = pages[ROOT / route]
    if page.classes.count('post-card') != 1 or page.classes.count('post-excerpt') != 1:
        errors.append(f'{route}: expected Why the blog and its TL;DR')
for path in ROOT.rglob('*'):
    if path.suffix not in ('.html', '.json', '.xml'):
        continue
    text = path.read_text()
    if 'mindrl-reward-interface' in text or 'late-may-vla-wam-world-model-reading-list-vol-1' in text:
        errors.append(f'{path.relative_to(ROOT)}: draft URL leaked into production')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'OK: {len(pages)} pages; internal links, About sections, six papers, Blog TL;DR, and draft exclusion.')
