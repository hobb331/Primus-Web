# Auth.md

> Agent access and authentication policy for https://primusdigitalagency.vercel.app/

## Summary

This site is fully public. There are no protected APIs, no user accounts, no
login, and no paywalls. Agents do not need credentials, tokens, or API keys to
read any resource on this domain, including the MCP server at `/api/mcp` and
the A2A endpoint at `/api/a2a`.

## Agent Registration

Not required. No registration endpoint exists because no resource on this
domain requires authentication. `/.well-known/oauth-protected-resource`
accordingly lists no authorization servers.

## Identity & Credentials

- Supported identity types: none required (anonymous access)
- Credential types: none issued
- Claims / revocation: not applicable

## Machine-Readable Resources

- `/.well-known/api-catalog` — linkset of machine-readable resources (RFC 9727)
- `/.well-known/agent-skills/index.json` — agent skills discovery index
- `/.well-known/mcp/server-card.json` — MCP server card for `/api/mcp`
- `/.well-known/agent-card.json` — A2A agent card for `/api/a2a`
- `/llms.txt` and `/index.md` — agent-facing content (also served for
  `Accept: text/markdown` on `/`)

## Human Contact

To start a business engagement with the agency (human-in-the-loop):
WhatsApp +20 106 807 2135 (https://wa.me/201068072135?text=FIRST) or email
primusdigitalcorpration@gmail.com.
