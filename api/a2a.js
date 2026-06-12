// Primus Digital — minimal A2A (Agent2Agent) endpoint, JSON-RPC over HTTP.
// A deterministic concierge: answers questions about the agency's services,
// packages, pricing, and contact flow. No streaming, no long-running tasks.

const OVERVIEW =
  'Primus Digital is a digital marketing agency in Zagazig, Sharqia, Egypt, serving brands across Egypt. ' +
  'Core services: social media management, media buying, coverage, and business solutions; ' +
  'exclusive services: elite videography, website design & development, and mobile app development. ' +
  'Packages: Signature Starter 3,499 EGP/mo, Pro Growth 4,999 EGP/mo (most popular), Elite Prestige 7,999 EGP/mo, Custom by request. ' +
  'Every engagement starts with a complimentary page audit. ' +
  'Contact: WhatsApp +20 106 807 2135 (https://wa.me/201068072135?text=FIRST) or primusdigitalcorpration@gmail.com. ' +
  'Full details: https://primusdigitalagency.vercel.app/index.md';

const PRICING =
  'Primus Digital packages (EGP, monthly): ' +
  'Signature Starter — 3,499 EGP/mo (2 reels, 10 posts, Facebook moderation). ' +
  'Pro Growth — 4,999 EGP/mo, most popular (4 reels, 15 posts, FB+IG moderation, monthly report). ' +
  'Elite Prestige — 7,999 EGP/mo (6 reels, 20 posts, all-platform moderation, weekly reports, priority editing & shooting). ' +
  'Custom — by request. All packages begin with a free page audit. ' +
  'To start: https://wa.me/201068072135?text=FIRST';

const CONTACT =
  'Contact Primus Digital: WhatsApp +20 106 807 2135 — send "FIRST" to receive a complimentary page audit ' +
  '(https://wa.me/201068072135?text=FIRST). Email: primusdigitalcorpration@gmail.com. ' +
  'Facebook: https://www.facebook.com/profile.php?id=61587403386997 · Instagram: https://www.instagram.com/primusdigital.global';

const SERVICES =
  'Primus Digital services — core: social media management, media buying (Meta ads), event/brand coverage, ' +
  'business solutions (funnels, automation, analytics). Exclusive: elite videography, website design & development, ' +
  'mobile app development. Based in Zagazig; serving Zagazig, 10th of Ramadan, Belbeis, and brands across Egypt.';

function answer(q) {
  const t = (q || '').toLowerCase();
  if (/(price|cost|package|how much|سعر|اسعار|أسعار|باقة|باقات)/.test(t)) return PRICING;
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
