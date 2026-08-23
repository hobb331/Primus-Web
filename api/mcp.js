// Primus Digital — minimal MCP server (streamable HTTP, stateless, no deps).
// Read-only information tools about the studio: engagements, disciplines,
// proof, contact. No prices are served: every engagement is scoped, then quoted.

const SITE = 'https://primusdigitalagency.vercel.app';

const ENGAGEMENTS = [
  { key: 'BUILD', name: 'Software, SaaS & Web', pricing: 'Scoped, then quoted per project', includes: ['SaaS platforms and web apps', 'Websites and landing systems', 'Mobile applications', 'Architecture, build, deployment'] },
  { key: 'GROW', name: 'Social & Media Buying', pricing: 'Scoped, then quoted per brand as a monthly retainer', popular: true, includes: ['Social media management', 'Content production and editing', 'Meta and platform ad buying', 'Performance reporting'] },
  { key: 'AUTOMATE', name: 'Systems & Infrastructure', pricing: 'Scoped, then quoted per system', includes: ['Funnels and lead capture', 'Reporting dashboards', 'Workflow automation', 'Integrations between the tools you own'] },
  { key: 'FILM', name: 'Coverage & Brand Film', pricing: 'Scoped, then quoted per production', includes: ['Event and launch coverage', 'Cinematic brand film', 'Direction, shoot, edit, delivery'] }
];

const PRICING_MODEL = {
  price_list: false,
  fixed_packages: false,
  summary: 'Primus Digital publishes no price list and sells no fixed monthly package. Scope drives the number: platforms, output volume, integrations, shoot days, and how much of the system already exists all move it.',
  process: ['You give the scope', 'We measure what already exists', 'You receive a written quote with the work itemised'],
  first_read: 'The first read of your presence costs nothing.'
};

const PROOF = [
  {
    type: 'SaaS platform',
    name: 'Zoom Bazar',
    scope: 'Product design, architecture, build, deployment',
    capabilities: ['Booth and vendor tracking', 'Cost and progress boards', 'Interactive floor model', 'Arabic-first RTL interface'],
    stack: ['React 18', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'Node', 'Express', 'libSQL on Turso'],
    hardening: ['Role-gated accounts enforced server side', 'Hashed credentials', 'Server-side sessions', 'Parameterised queries and column allowlists', 'Rate limiting and CSRF'],
    disclosure: 'Private platform, login only. No operational records, figures or screenshots from the live product are published.'
  },
  {
    type: 'Measured Audit',
    subject: 'Manufacturer website (anonymised)',
    findings: 24,
    pages: 10,
    highlights: ['Finding 01: no contact channel published anywhere on the site', '15 different text sizes', '8 button designs and 8 corner radii', '25 separate letter-spacing values'],
    disclosure: 'Findings only, no fixes. Name, domain and screenshots withheld.'
  },
  {
    type: 'Measured Audit',
    subject: 'Arabic D2C store (anonymised)',
    findings: 22,
    pages: 11,
    highlights: ['15.9 MB on first mobile load, on paid traffic', 'The two heaviest assets were client-uploaded', 'A fabricated stock counter inventing urgency', 'An invented review rating written into the page schema'],
    measured_at: ['390 px', '1440 px'],
    disclosure: 'Findings only, no fixes. Name, domain and screenshots withheld.'
  },
  {
    type: 'Public artifact',
    name: 'This website (primusdigitalagency.vercel.app)',
    scope: 'Published as proof in its own right; every claim is verifiable from outside',
    capabilities: [
      'One static document, no build step, no framework, no third-party script',
      'Arabic build generated from the English source so the two cannot drift apart',
      'Skip link, visible focus, WCAG AA contrast, reduced motion honoured',
      'HSTS, framing denied, MIME sniffing off, permissions closed by default',
      'Machine-readable: structured data, llms.txt, markdown mirror, live MCP endpoint',
      'Performance measured on a throttled mid-range phone'
    ],
    disclosure: 'Verifiable directly: read the page source, inspect the response headers, or fetch /index.md.'
  }
];

const SERVICES = {
  disciplines: {
    BUILD: ['Software development', 'SaaS platform development', 'Web platforms and websites', 'Mobile applications'],
    AUTOMATE: ['Funnels and lead capture', 'Reporting dashboards', 'Workflow automation', 'Integrations'],
    FILM: ['Event and launch coverage', 'Cinematic brand film'],
    GROW: ['Social media management', 'Content production', 'Media buying on Meta and beyond', 'Performance reporting']
  },
  model: 'All four run in-house and are sold as one closed loop. Take one, or take the loop.',
  pricing: PRICING_MODEL.summary,
  location: 'Zagazig, Sharqia, Egypt',
  serving: ['Zagazig', '10th of Ramadan', 'Belbeis', 'brands across Egypt']
};

const CONTACT = {
  whatsapp: '+20 106 807 2135',
  whatsapp_link: 'https://wa.me/201068072135?text=FIRST',
  email: 'primusdigitalcorpration@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61587403386997',
  instagram: 'https://www.instagram.com/primusdigital.global',
  note: 'Message "FIRST" on WhatsApp for a first read of what you already have, then a written quote scoped to the work. No pitch, no price list, no obligation.'
};

const TOOLS = [
  {
    name: 'get_engagements',
    description: "List Primus Digital's four engagement types (BUILD, GROW, AUTOMATE, FILM), what each includes, and how each is quoted. There is no price list: every engagement is scoped, then quoted individually.",
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_services',
    description: 'List the four disciplines Primus Digital runs in-house (BUILD, AUTOMATE, FILM, GROW), what sits under each, and the areas served.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_proof',
    description: 'List published Primus Digital proof: one SaaS platform built end to end, two paid Measured Audits published anonymised, and this website itself as a verifiable public artifact. No client data, figures or screenshots from the live SaaS are exposed.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_contact_options',
    description: "Get Primus Digital's contact channels (WhatsApp, email, socials) and the free-audit inquiry flow.",
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_inquiry_link',
    description: "Build a prefilled WhatsApp link that starts Primus Digital's free page-audit flow on the user's behalf.",
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Optional message to prefill; defaults to "FIRST", which triggers the complimentary audit.' }
      },
      additionalProperties: false
    }
  }
];

function callTool(name, args) {
  switch (name) {
    case 'get_engagements': return { pricing_model: PRICING_MODEL, engagements: ENGAGEMENTS };
    case 'get_services': return SERVICES;
    case 'get_proof': return PROOF;
    case 'get_contact_options': return CONTACT;
    case 'get_inquiry_link': {
      const msg = (args && typeof args.message === 'string' && args.message.trim()) || 'FIRST';
      return {
        whatsapp_link: 'https://wa.me/201068072135?text=' + encodeURIComponent(msg),
        note: 'Open or share this link to start the WhatsApp chat with Primus Digital.'
      };
    }
    default: return null;
  }
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version');
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Use POST with a JSON-RPC 2.0 body. See ' + SITE + '/.well-known/mcp/server-card.json' }));
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
  // notifications get 202 Accepted with no body
  if (msg.id === undefined || msg.id === null) { res.statusCode = 202; return res.end(); }

  switch (msg.method) {
    case 'initialize':
      return reply(msg.id, {
        result: {
          protocolVersion: (msg.params && msg.params.protocolVersion) || '2025-06-18',
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'primus-digital-info', title: 'Primus Digital — Agency Info', version: '1.0.0' },
          instructions: 'Read-only information server for Primus Digital, a digital studio in Zagazig, Egypt. The studio publishes no prices: every engagement is scoped, then quoted. Use get_engagements for the engagement types and how each is quoted, get_services for the four disciplines, get_proof for published work, get_contact_options for channels, and get_inquiry_link to generate the WhatsApp inquiry link.'
        }
      });
    case 'ping':
      return reply(msg.id, { result: {} });
    case 'tools/list':
      return reply(msg.id, { result: { tools: TOOLS } });
    case 'tools/call': {
      const name = msg.params && msg.params.name;
      const out = callTool(name, msg.params && msg.params.arguments);
      if (out === null) return reply(msg.id, { error: { code: -32602, message: 'Unknown tool: ' + name } });
      return reply(msg.id, { result: { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }], isError: false } });
    }
    default:
      return reply(msg.id, { error: { code: -32601, message: 'Method not found: ' + msg.method } });
  }
};
