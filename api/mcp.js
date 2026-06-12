// Primus Digital — minimal MCP server (streamable HTTP, stateless, no deps).
// Read-only information tools about the agency: packages, services, contact.

const SITE = 'https://primusdigitalagency.vercel.app';

const PACKAGES = [
  { name: 'Signature Starter Pack', price: '3,499 EGP/month', includes: ['2 Reels', '10 Posts', 'Facebook Moderation'] },
  { name: 'Pro Growth Pack', price: '4,999 EGP/month', popular: true, includes: ['4 Reels', '15 Posts', 'FB + IG Moderation', 'Monthly Performance Report'] },
  { name: 'Elite Prestige Pack', price: '7,999 EGP/month', includes: ['6 Reels', '20 Posts', 'All Platforms Moderation', 'Weekly Performance Reports', 'Priority Editing & Shooting'] },
  { name: 'Custom Pack', price: 'By request', includes: ['Every service, tailored to your goals, platforms, and budget'] }
];

const SERVICES = {
  core: ['Social Media Management', 'Media Buying', 'Coverage', 'Business Solutions'],
  exclusive: ['Elite Videography', 'Website Design & Development', 'Mobile App Development'],
  location: 'Zagazig, Sharqia, Egypt',
  serving: ['Zagazig', '10th of Ramadan', 'Belbeis', 'brands across Egypt']
};

const CONTACT = {
  whatsapp: '+20 106 807 2135',
  whatsapp_link: 'https://wa.me/201068072135?text=FIRST',
  email: 'primusdigitalcorpration@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61587403386997',
  instagram: 'https://www.instagram.com/primusdigital.global',
  note: 'Message "FIRST" on WhatsApp to receive a complimentary page audit — no pitch, no obligation.'
};

const TOOLS = [
  {
    name: 'get_packages',
    description: "List Primus Digital's social media marketing packages with monthly EGP pricing and what each includes.",
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_services',
    description: 'List the services Primus Digital offers (core and exclusive) and the areas served.',
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
    case 'get_packages': return PACKAGES;
    case 'get_services': return SERVICES;
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
          instructions: 'Read-only information server for Primus Digital, a digital marketing agency in Zagazig, Egypt. Use get_packages for EGP pricing, get_services for the service catalog, get_contact_options for channels, and get_inquiry_link to generate the WhatsApp free-audit link.'
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
