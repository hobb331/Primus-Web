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
vercel.json   static-serve config (no build step)
.nojekyll     tells GitHub Pages to serve files as-is
```

## Deploy

**Vercel (current):** the repo is connected to Vercel; every push to `main` deploys to
[primusdigitalagency.vercel.app](https://primusdigitalagency.vercel.app/). `vercel.json` pins the project
to static serving — no framework, no build command.

**GitHub Pages (alternative):** Repo → **Settings → Pages** → Source: *Deploy from a branch* →
Branch: `main`, folder `/ (root)`.

## If the domain changes (e.g. a custom domain)

Update the URL in three places: the `canonical`/`og:url` tags in `index.html`'s `<head>`,
the `Sitemap:` line in `robots.txt`, and the `<loc>` entry in `sitemap.xml`.

Next growth steps: submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console)
and create a [Google Business Profile](https://business.google.com/) for local search in Zagazig.

## Local preview

Open `index.html` directly in a browser — no server needed.

## Contact

WhatsApp: [+20 106 807 2135](https://wa.me/201068072135) · [Facebook](https://www.facebook.com/profile.php?id=61587403386997) · [Instagram](https://www.instagram.com/primusdigital.global)
