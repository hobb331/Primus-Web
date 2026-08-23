// Primus Digital — minimal A2A (Agent2Agent) endpoint, JSON-RPC over HTTP.
// A deterministic concierge: answers questions about the agency's services,
// disciplines, how work is priced, and the contact flow. No streaming, no
// long-running tasks. There is no price list to serve: everything is quoted.

const OVERVIEW =
  'Primus Digital is a digital studio in Zagazig, Sharqia, Egypt, serving brands across Egypt. ' +
  'Four disciplines, run in-house and sold as one loop: BUILD (software, SaaS platforms, web platforms, websites, mobile apps), ' +
  'AUTOMATE (funnels, lead capture, dashboards, workflow automation, integrations), ' +
  'FILM (event and launch coverage, cinematic brand film), and ' +
  'GROW (social media management, content production, media buying, performance reporting). ' +
  'There is no price list and no fixed package: scope drives the number, so every engagement is measured first and quoted individually in writing. ' +
  'Proof: Zoom Bazar, a bazaar operations SaaS platform designed, built and deployed end to end, two paid Measured Audits published anonymised, and this website itself as a verifiable public artifact. ' +
  'The first read of your presence is free. ' +
  'Contact: WhatsApp +20 106 807 2135 (https://wa.me/201068072135?text=FIRST) or primusdigitalcorpration@gmail.com. ' +
  'Full details: https://primusdigitalagency.vercel.app/index.md';

const PRICING =
  'Primus Digital publishes no prices and sells no fixed monthly package. Scope drives the number: platforms, ' +
  'output volume, integrations, shoot days, and how much of the system already exists all move it. ' +
  'BUILD is quoted per project, AUTOMATE per system, FILM per production, and GROW per brand as a monthly retainer. ' +
  'The process: you give the scope, we measure what already exists, and you receive a written quote with the work itemised. ' +
  'The first read costs nothing. To start: https://wa.me/201068072135?text=FIRST';

const PROOF =
  'Published Primus Digital proof. Zoom Bazar: a bazaar operations SaaS platform carried from blank page to production, ' +
  'covering product design, architecture, build and deployment (React 18, TypeScript, Vite, Tailwind, Zustand on the interface; ' +
  'Node, Express and libSQL on Turso behind it), with role-gated accounts enforced on the server. It is a private platform and ' +
  'no operational records, figures or screenshots from it are published. ' +
  'Two paid Measured Audits are published fully anonymised, findings only, no fixes: a manufacturer website, 24 findings across ' +
  '10 pages, whose first finding was that the site published no contact channel at all; and an Arabic D2C store, 22 findings ' +
  'across 11 pages, weighing 15.9 MB on first mobile load with a fabricated stock counter and an invented review rating in its ' +
  'page schema. Client names, domains and screenshots are withheld. ' +
  'This website is published as proof in its own right and can be verified from outside: one static document with no build ' +
  'step or framework, an Arabic build generated from the English source so the two cannot drift apart, skip link and visible ' +
  'focus with WCAG AA contrast, hardened response headers, and machine-readable mirrors including this endpoint.';

const CONTACT =
  'Contact Primus Digital: WhatsApp +20 106 807 2135. Send "FIRST" for a first read of what you already have, ' +
  'followed by a written quote scoped to the work ' +
  '(https://wa.me/201068072135?text=FIRST). Email: primusdigitalcorpration@gmail.com. ' +
  'Facebook: https://www.facebook.com/profile.php?id=61587403386997 · Instagram: https://www.instagram.com/primusdigital.global';

const SERVICES =
  'Primus Digital disciplines. BUILD: software development, SaaS platforms, web platforms and websites, mobile applications. ' +
  'AUTOMATE: funnels, lead capture, reporting dashboards, workflow automation, integrations. ' +
  'FILM: event and launch coverage, cinematic brand film. ' +
  'GROW: social media management, content production, media buying on Meta and beyond, performance reporting. ' +
  'All four run in-house and are sold as one loop; take one or take the loop. Each is scoped, then quoted. ' +
  'Based in Zagazig, serving Zagazig, 10th of Ramadan, Belbeis, and brands across Egypt.';

function answer(q) {
  const t = (q || '').toLowerCase();
  if (/(price|pricing|cost|quote|package|budget|how much|سعر|اسعار|أسعار|باقة|باقات|عرض سعر)/.test(t)) return PRICING;
  if (/(case study|portfolio|proof|work|example|saas|audit|zoom bazar|اعمال|أعمال|سابقة)/.test(t)) return PROOF;
  if (/(contact|whatsapp|email|phone|reach|تواصل|واتس|ايميل)/.test(t)) return CONTACT;
  if (/(service|offer|what do you do|خدمة|خدمات)/.test(t)) return SERVICES;
  return OVERVIEW;
}

async function readBody(req) {
  if (req.body !== undefined) return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : undefined;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Use POST with a JSON-RPC 2.0 body. Agent card: https://primusdigitalagency.vercel.app/.well-known/agent-card.json' }));
  }

  const reply = (id, r) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Object.assign({ jsonrpc: '2.0', id: id }, r)));
  };

  let msg;
  try { msg = await readBody(req); }
  catch (e) { return reply(null, { error: { code: -32700, message: 'Parse error' } }); }

  if (!msg || Array.isArray(msg) || typeof msg.method !== 'string') {
    return reply(null, { error: { code: -32600, message: 'Invalid request: expected a single JSON-RPC 2.0 message' } });
  }

  switch (msg.method) {
    case 'message/send': {
      const parts = (msg.params && msg.params.message && msg.params.message.parts) || [];
      const textPart = parts.find(p => p && (p.kind === 'text' || p.type === 'text') && typeof p.text === 'string');
      const replyText = answer(textPart && textPart.text);
      return reply(msg.id, {
        result: {
          kind: 'message',
          role: 'agent',
          messageId: 'm-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          parts: [{ kind: 'text', text: replyText }]
        }
      });
    }
    case 'message/stream':
      return reply(msg.id, { error: { code: -32004, message: 'Streaming is not supported by this agent' } });
    case 'tasks/get':
    case 'tasks/cancel':
      return reply(msg.id, { error: { code: -32001, message: 'Task not found: this agent responds synchronously and does not persist tasks' } });
    default:
      return reply(msg.id, { error: { code: -32601, message: 'Method not found: ' + msg.method } });
  }
};
