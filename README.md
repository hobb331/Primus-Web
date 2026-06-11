# Primus Digital — Where Excellence Begins

Official one-page website for **Primus Digital**, a premium digital marketing agency based in Zagazig, Egypt. Dark editorial design, Three.js 3D brand mark, zero build step — one self-contained HTML file.

## Stack

- Single `index.html` — all CSS and JS inline, no build tools, no dependencies to install
- [Three.js](https://threejs.org/) v0.160 via CDN (ES modules + importmap) for the scroll-driven 3D scene
- Google Fonts: Playfair Display + Inter

## Structure

```
index.html    the entire site
robots.txt    crawler rules + sitemap pointer
sitemap.xml   single-URL sitemap
.nojekyll     tells GitHub Pages to serve files as-is
```

## Deploy (GitHub Pages)

1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
3. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

## After deployment — replace the domain placeholders

Search for `YOUR-DOMAIN` and set the live URL in **three places**:

1. `index.html` — the commented-out `<link rel="canonical">` / `og:url` / `og:image` block in `<head>` (uncomment it)
2. `robots.txt` — the `Sitemap:` line
3. `sitemap.xml` — the `<loc>` entry

Then submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and create a [Google Business Profile](https://business.google.com/) for local search.

## Local preview

Open `index.html` directly in a browser — no server needed.

## Contact

WhatsApp: [+20 106 807 2135](https://wa.me/201068072135) · [Facebook](https://www.facebook.com/profile.php?id=61587403386997) · [Instagram](https://www.instagram.com/primusdigital.global)
