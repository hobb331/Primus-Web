# Primus Digital · Where Excellence Begins

Official one-page website for **Primus Digital**, a digital studio in Zagazig, Egypt:
software and SaaS development, business automation, coverage and brand film, social
media management and media buying. Dark editorial design, Three.js 3D brand mark,
scroll-driven motion layer, zero build step.

## Stack

- Single `index.html` · all CSS and JS inline, no build tools, no dependencies to install
- [Three.js](https://threejs.org/) v0.160 via CDN (ES modules + importmap) for the scroll-driven 3D scene
- Google Fonts: Playfair Display + Inter (Amiri + Tajawal on the Arabic page)

## Structure

```
index.html    the entire English site
ar/index.html the Arabic (RTL) site — GENERATED, do not hand-edit
make_ar.mjs   generates ar/index.html from index.html (node make_ar.mjs)
index.md      markdown mirror for AI agents (served on Accept: text/markdown)
llms.txt      agent-facing overview (llms.txt convention)
auth.md       tells agents no auth/registration is needed
api/mcp.js    MCP server, streamable HTTP
api/a2a.js    A2A concierge agent, JSON-RPC
robots.txt    crawler rules + Content-Signal + sitemap pointer
sitemap.xml   en + ar sitemap with hreflang alternates
vercel.json   static-serve config, Link headers, markdown negotiation
.well-known/  api-catalog (RFC 9727), agent card, MCP server card, agent-skills
.nojekyll     tells GitHub Pages to serve files as-is
```

## Two rules this site is built on

**1. No prices, anywhere.** There is no price list and no fixed package. Every
engagement is scoped, then quoted in writing. This holds on the page, in `index.md`,
`llms.txt`, both API handlers, and every `.well-known/` document, so an agent
reading any surface gives the same answer. `make_ar.mjs` fails the build if a
price string reappears.

**2. `Primus Digital` and `Where Excellence Begins` stay in Latin script**, including
inside Arabic copy. Never transliterated. `make_ar.mjs` also fails the build on this.

## Editing the Arabic page

`ar/index.html` is generated. Edit `index.html`, then:

```
node make_ar.mjs
```

It replaces exact strings and exits non-zero listing every anchor it could not
find, so an English edit that breaks a translation is caught immediately rather
than silently leaving English on the Arabic page.

## Deploy

**Vercel (current):** the repo is connected to Vercel; pushes deploy to
[primusdigitalagency.vercel.app](https://primusdigitalagency.vercel.app/). `vercel.json` pins the
project to static serving, no framework and no build command. Production can also be
released directly with `npx vercel --prod`.

## If the domain changes (e.g. a custom domain)

Update the URL in the `canonical`/`og:url` tags in `index.html`'s `<head>` (then
regenerate the Arabic page), the `Sitemap:` line in `robots.txt`, the `<loc>` entries
in `sitemap.xml`, and the absolute URLs in `llms.txt` and `.well-known/`.

## Local preview

Open `index.html` directly in a browser, no server needed.

## Contact

WhatsApp: [+20 106 807 2135](https://wa.me/201068072135) · [Facebook](https://www.facebook.com/profile.php?id=61587403386997) · [Instagram](https://www.instagram.com/primusdigital.global)
