// Builds ar/index.html from index.html by exact-string replacement.
// Node port of the retired make_ar.py (this machine has no working Python).
//
// Identity locks enforced here:
//   - "Primus Digital" and "Where Excellence Begins" stay in Latin script inside
//     Arabic copy. They are never transliterated.
//   - No em dashes in copy. Ranges use an en dash.
//   - No prices anywhere: every engagement is scoped, then quoted.
//
// Run: node make_ar.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
let src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const misses = [];
const rep = (oldStr, newStr) => {
  if (!src.includes(oldStr)) { misses.push(oldStr.slice(0, 90).replace(/\n/g, ' ')); return; }
  src = src.split(oldStr).join(newStr);
};

/* ==================== HEAD ==================== */
rep('<html lang="en">', '<html lang="ar" dir="rtl">');

rep('<title>Digital Agency in Zagazig | Software, SaaS &amp; Growth | Primus Digital</title>',
    '<title>وكالة رقمية في الزقازيق | برمجيات و SaaS ونمو | Primus Digital</title>');

rep('<meta name="description" content="Primus Digital is a studio in Zagazig, Egypt. We build software, SaaS platforms and websites, automate the operation, film the work, and grow the audience. Every engagement is scoped, then quoted.">',
    '<meta name="description" content="Primus Digital استوديو رقمي في الزقازيق، مصر. نبني السوفتوير ومنصات SaaS والمواقع، نؤتمت التشغيل، نصوّر الشغل، ونكبّر الجمهور. كل تعاقد يتحدد نطاقه أولًا، ثم يصلك عرض سعر مكتوب.">');

rep('<link rel="canonical" href="https://primusdigitalagency.vercel.app/">',
    '<link rel="canonical" href="https://primusdigitalagency.vercel.app/ar/">');
rep('<meta property="og:url" content="https://primusdigitalagency.vercel.app/">',
    '<meta property="og:url" content="https://primusdigitalagency.vercel.app/ar/">');
rep('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="ar_EG">');

rep('<meta property="og:title" content="Digital Agency in Zagazig | Software, SaaS &amp; Growth | Primus Digital">',
    '<meta property="og:title" content="وكالة رقمية في الزقازيق | برمجيات و SaaS ونمو | Primus Digital">');
rep('<meta property="og:description" content="One studio, the whole path. Software and SaaS, automation, film, and growth, engineered in Zagazig, Egypt. Every engagement is scoped, then quoted.">',
    '<meta property="og:description" content="استوديو واحد، الطريق كامل. برمجيات و SaaS، أتمتة، تصوير، ونمو. مهندَس في الزقازيق، مصر. كل تعاقد يتحدد نطاقه أولًا، ثم يصلك عرض سعر مكتوب.">');
rep('<meta name="twitter:title" content="Digital Agency in Zagazig | Software, SaaS &amp; Growth | Primus Digital">',
    '<meta name="twitter:title" content="وكالة رقمية في الزقازيق | برمجيات و SaaS ونمو | Primus Digital">');
rep('<meta name="twitter:description" content="Software, SaaS platforms, automation, film and growth. Engineered in Zagazig, Egypt. Scoped, then quoted.">',
    '<meta name="twitter:description" content="برمجيات، منصات SaaS، أتمتة، تصوير، ونمو. مهندَس في الزقازيق، مصر. النطاق أولًا، وبعده عرض السعر.">');

/* Arabic faces alongside the Latin pair */
rep('family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&display=swap',
    'family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Tajawal:wght@300;400;500;700&display=swap');

/* ==================== JSON-LD ==================== */
const JSONLD = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "#primus",
      "name": "Primus Digital",
      "alternateName": ["Primus Digital Agency", "بريمس ديجيتال"],
      "slogan": "Where Excellence Begins",
      "description": "استوديو رقمي في الزقازيق، مصر. تطوير برمجيات ومنصات SaaS ومواقع وتطبيقات، أتمتة الأعمال، تغطية وتصوير، إدارة سوشيال ميديا و media buying. كل تعاقد يتحدد نطاقه ثم يُسعَّر على حدة.",
      "url": "https://primusdigitalagency.vercel.app/ar/",
      "inLanguage": "ar",
      "telephone": "+201068072135",
      "email": "primusdigitalcorpration@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Zagazig",
        "addressRegion": "Sharqia",
        "addressCountry": "EG"
      },
      "geo": {"@type": "GeoCoordinates", "latitude": 30.5877, "longitude": 31.5020},
      "areaServed": [
        {"@type": "City", "name": "الزقازيق"},
        {"@type": "City", "name": "العاشر من رمضان"},
        {"@type": "City", "name": "بلبيس"},
        {"@type": "Country", "name": "مصر"}
      ],
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61587403386997",
        "https://www.instagram.com/primusdigital.global"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "التعاقدات",
        "description": "Primus Digital لا تبيع باقات بسعر ثابت. كل تعاقد يتحدد نطاقه ثم يُسعَّر على حدة.",
        "itemListElement": [
          {"@type": "Offer", "name": "BUILD", "description": "مواقع ومنصات ومنتجات SaaS، من المعمارية وقاعدة البيانات حتى الواجهة والنشر. النطاق أولًا، ثم عرض السعر.", "itemOffered": {"@type": "Service", "name": "تطوير برمجيات و SaaS ومواقع"}},
          {"@type": "Offer", "name": "AUTOMATE", "description": "فَنِلز، dashboards، أنظمة استقبال العملاء، وأتمتة الشغل الداخلي. النطاق أولًا، ثم عرض السعر.", "itemOffered": {"@type": "Service", "name": "أنظمة وبنية تشغيل"}},
          {"@type": "Offer", "name": "FILM", "description": "تغطية فعاليات وافتتاحات وأفلام براند. النطاق أولًا، ثم عرض السعر.", "itemOffered": {"@type": "Service", "name": "تغطية وتصوير"}},
          {"@type": "Offer", "name": "GROW", "description": "إدارة سوشيال ميديا و media buying، تُدار كعقد شهري. النطاق أولًا، ثم عرض السعر.", "itemOffered": {"@type": "Service", "name": "سوشيال ميديا وإعلانات ممولة"}}
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "إزاي Primus Digital بتسعّر شغلها؟",
          "acceptedAnswer": {"@type": "Answer", "text": "كل تعاقد يُسعَّر على حدة. مفيش باقات شهرية ثابتة، لأن النطاق هو اللي بيحرّك الرقم: المنصات، حجم المحتوى، الـ integrations، وأيام التصوير كلها بتغيّره. تقول لنا النطاق، نقيس اللي موجود فعلًا، ويوصلك عرض سعر مكتوب ومفصّل بنود."}
        },
        {
          "@type": "Question",
          "name": "هل Primus Digital بتبني برمجيات ومنصات SaaS؟",
          "acceptedAnswer": {"@type": "Answer", "text": "أيوه. مواقع ومنصات ويب ومنتجات SaaS كاملة، من المعمارية وقاعدة البيانات حتى الواجهة والنشر. آخرها Zoom Bazar، منصة تشغيل بازار فيها إدارة العارضين والأماكن، خريطة أرضية تفاعلية، وحسابات محكومة بالصلاحيات على السيرفر."}
        },
        {
          "@type": "Question",
          "name": "مين المناطق اللي بتخدمها Primus Digital؟",
          "acceptedAnswer": {"@type": "Answer", "text": "مقرّنا الزقازيق ونخدم شركات الشرقية كلها، ومنها العاشر من رمضان وبلبيس، بالإضافة لأي براند في مصر. البرمجيات والاستراتيجية والتقارير و media buying بتتدار عن بُعد. التغطية والتصوير بيتجدولوا في الموقع."}
        },
        {
          "@type": "Question",
          "name": "إيه الخدمات اللي بتقدمها Primus Digital؟",
          "acceptedAnswer": {"@type": "Answer", "text": "أربعة تخصصات تُباع كحلقة واحدة. BUILD برمجيات و SaaS ومواقع. AUTOMATE فَنِلز و dashboards وأنظمة داخلية. FILM تغطية فعاليات وأفلام براند. GROW إدارة سوشيال ميديا و media buying."}
        },
        {
          "@type": "Question",
          "name": "إيه اللي بيفرّق Primus عن باقي الوكالات في مصر؟",
          "acceptedAnswer": {"@type": "Answer", "text": "أغلب الوكالات بتبيع كمية، مقاسة بعدد البوستات في الشهر. إحنا بنهندس حضورًا، وقادرين نبني المنتج نفسه اللي الحضور ده بيشاور عليه. الاستراتيجية قبل المنشورات، البيانات قبل الآراء، النتائج قبل التصفيق."}
        },
        {
          "@type": "Question",
          "name": "إزاي أبدأ الشغل مع Primus Digital؟",
          "acceptedAnswer": {"@type": "Answer", "text": "ابعت \\"FIRST\\" على واتساب (+20 106 807 2135) أو راسلنا بالإيميل. هتاخد قراءة أولى لمكان تسريب حضورك، وبعدها عرض سعر مبني على الشغل اللي محتاجه فعلًا. من غير عرض مبيعات ومن غير التزام."}
        }
      ]
    }
  ]
}
</script>`;

{
  const a = src.indexOf('<script type="application/ld+json">');
  const b = src.indexOf('</script>', a) + '</script>'.length;
  if (a === -1 || b <= a) misses.push('JSON-LD block');
  else src = src.slice(0, a) + JSONLD + src.slice(b);
}

/* ==================== ARABIC / RTL STYLE ==================== */
const AR_STYLE = `
  /* ---------------- ARABIC / RTL ---------------- */
  body{font-family:'Tajawal','Inter',sans-serif;font-weight:400}
  .hero h1,.sec-head h2,.manifesto h2,.svc h3,.band-card h3,.step h3,.pack h3,
  .case-main h3,.loc h2,.faq summary,#contact h2,.loc-card .city,.marquee span{
    font-family:'Amiri','Playfair Display',serif;
  }
  .caps,.kicker,.sec-num,.btn,.pack ul li,.pack .badge,.loc-card .country,
  .pack-note,footer .mid,#contact .small,.svc-list li,.case-spec span{letter-spacing:.02em}
  .nav-links a{letter-spacing:.04em;font-size:12.5px}
  .caps{font-size:12.5px}
  .sec-num{font-size:12.5px}
  .btn{font-size:13px;font-weight:500;letter-spacing:.02em}
  .pack ul li{font-size:13px;letter-spacing:0}
  .pack .badge{font-size:11px;letter-spacing:.04em}
  .pack .scope{font-size:11px;letter-spacing:.08em}
  .pack .pack-key,.case-tag,.case-n{letter-spacing:.18em}
  .case-spec b{font-size:11px;letter-spacing:.06em}
  .case-spec span{font-size:14px}
  .svc-list li{font-size:13px}
  .hero h1{line-height:1.3;letter-spacing:0}
  .faq summary{line-height:1.8}
  .nav-cta{margin-left:0;margin-right:14px}
  footer .mid{font-size:12.5px;font-family:'Playfair Display',serif;letter-spacing:.14em}
  .loader-word{letter-spacing:.48em} /* Latin wordmark keeps its tracking */
  /* the progress rail has to fill from the right in RTL */
  .scroll-rail i{transform-origin:100% 50%;background:linear-gradient(270deg,rgba(244,242,236,.12),rgba(244,242,236,.55) 55%,var(--porcelain))}
  /* the case rail and spec rows mirror with the flow; only the hairline flips */
  .case-note{padding-left:0;padding-right:16px;border-left:none;border-right:1px solid var(--line)}
  .svc-list li{padding-left:0;padding-right:20px}
  .svc-list li::before{left:auto;right:0}
  .pack ul li::before{left:auto;right:0}
  /* the Latin brand lockup keeps /// before the wordmark, and the marquee
     loop needs LTR flow to stay seamless: each span's Arabic still renders RTL */
  .nav-mark,footer .mark{direction:ltr}
  .marquee{direction:ltr}
</style>`;

if (!src.includes('</style>')) misses.push('</style>');
src = src.replace('</style>', AR_STYLE);

/* ==================== NAV ==================== */
rep(`    <a href="#services">Services</a>
    <a href="#method">Method</a>
    <a href="#work">Work</a>
    <a href="#engagements">Engagements</a>
    <a href="#about">Zagazig</a>
    <a href="/ar/" lang="ar">عربي</a>
    <a href="#contact" class="nav-cta">Begin</a>`,
`    <a href="#services">التخصصات</a>
    <a href="#method">المنهج</a>
    <a href="#work">أعمالنا</a>
    <a href="#engagements">التعاقدات</a>
    <a href="#about">الزقازيق</a>
    <a href="/" lang="en">EN</a>
    <a href="#contact" class="nav-cta">ابدأ</a>`);

/* ==================== HERO ==================== */
rep('<div class="kicker caps fade-in" style="--d:.15s">Digital Studio · Zagazig, Egypt</div>',
    '<div class="kicker caps fade-in" style="--d:.15s">استوديو رقمي · الزقازيق، مصر</div>');

rep('<h1><span class="w" style="--d:.3s">Where</span> <span class="w" style="--d:.48s"><em>Excellence</em></span><br><span class="w" style="--d:.66s">Begins.</span></h1>',
    '<h1><span class="w" style="--d:.3s">حيث</span> <span class="w" style="--d:.48s">يبدأ</span><br><span class="w" style="--d:.66s"><em>التميّز.</em></span></h1>');

rep('<p class="sub fade-in" style="--d:.9s">We build the software, automate the operation, film the work, and grow the audience. One studio, the whole path. Not posted. Positioned.</p>',
    '<p class="sub fade-in" style="--d:.9s">بنبني السوفتوير، ونؤتمت التشغيل، ونصوّر الشغل، ونكبّر الجمهور. استوديو واحد، الطريق كامل. مش مجرد نشر. تموضع.</p>');

rep('>Start Your Project</a>', '>ابدأ مشروعك</a>');
rep('>See The Work</a>', '>شوف أعمالنا</a>');

/* ==================== MARQUEE ==================== */
rep('<span>Software &amp; SaaS <i>///</i></span><span>Web Platforms <i>///</i></span><span>Automation <i>///</i></span><span>Coverage &amp; Film <i>///</i></span><span>Social Media Management <i>///</i></span><span>Media Buying <i>///</i></span>',
    '<span>برمجيات و SaaS <i>///</i></span><span>منصات ويب <i>///</i></span><span>أتمتة <i>///</i></span><span>تغطية وتصوير <i>///</i></span><span>إدارة سوشيال ميديا <i>///</i></span><span>Media Buying <i>///</i></span>');

/* ==================== MANIFESTO ==================== */
rep('<h2>Most agencies manage pages.<br>We <em>engineer presence.</em></h2>',
    '<h2>أغلب الوكالات بتدير صفحات.<br>إحنا <em>بنهندس حضورًا.</em></h2>');
rep('<span>Strategy before posts.</span>', '<span>الاستراتيجية قبل المنشورات.</span>');
rep('<span>Data before opinions.</span>', '<span>البيانات قبل الآراء.</span>');
rep('<span>Results before applause.</span>', '<span>النتائج قبل التصفيق.</span>');

/* ==================== 01 · DISCIPLINES ==================== */
rep('<div class="sec-num">/// 01 · What We Do</div>', '<div class="sec-num">/// 01 · اللي بنعمله</div>');
rep('<h2 class="mask">Four disciplines.<br>One <em>standard.</em></h2>',
    '<h2 class="mask">أربعة تخصصات.<br>معيار <em>واحد.</em></h2>');
rep('<p class="lede">Most studios sell one of these and outsource the rest. We run all four in-house, which is why they compound instead of colliding. Nothing here is sold off a price list.</p>',
    '<p class="lede">أغلب الاستوديوهات بتبيع واحد من دول وبتخرّج الباقي بره. إحنا بنشغّل الأربعة جوّه، وعشان كده بيتراكموا بدل ما يتصادموا. ومفيش حاجة هنا بتتباع من قايمة أسعار.</p>');

rep('<h3>Software, SaaS &amp; Web</h3>', '<h3>برمجيات و SaaS ومواقع</h3>');
rep('<p>Websites, web platforms, and full SaaS products. Architecture, database, interface, deployment. We have shipped a production platform end to end, so the pitch and the build come from the same room.</p>',
    '<p>مواقع ومنصات ويب ومنتجات SaaS كاملة. المعمارية، قاعدة البيانات، الواجهة، والنشر. طلّعنا منصة شغالة فعليًا من أول سطر لآخر deploy، يعني العرض والتنفيذ بيخرجوا من نفس الأوضة.</p>');
rep('<li>SaaS platforms and internal tools</li>', '<li>منصات SaaS وأدوات داخلية</li>');
rep('<li>Websites engineered to convert</li>', '<li>مواقع مهندَسة عشان تحوّل</li>');
rep('<li>Mobile applications</li>', '<li>تطبيقات موبايل</li>');

rep('<h3>Systems &amp; Infrastructure</h3>', '<h3>أنظمة وبنية تشغيل</h3>');
rep('<p>Growth is not a post, it is machinery. Funnels, lead capture, dashboards, and the automation that stops your team retyping the same row into a third spreadsheet.</p>',
    '<p>النمو مش بوست، النمو ماكينة. فَنِلز، أنظمة استقبال عملاء، dashboards، والأتمتة اللي بتوقف فريقك عن إعادة كتابة نفس الصف في ثالث شيت.</p>');
rep('<li>Lead systems and funnels</li>', '<li>أنظمة عملاء وفَنِلز</li>');
rep('<li>Reporting dashboards</li>', '<li>Dashboards للتقارير</li>');
rep('<li>Workflow automation</li>', '<li>أتمتة سير الشغل</li>');

rep('<h3>Coverage &amp; Brand Film</h3>', '<h3>تغطية وأفلام براند</h3>');
rep('<p>Your best moments should not live and die in the room. Openings, launches, and brand films, shot and cut to the same standard as everything else we ship.</p>',
    '<p>أحسن لحظاتك المفروض ما تعيشش وتموت جوه الأوضة. افتتاحات وإطلاقات وأفلام براند، تصوير ومونتاج بنفس المعيار اللي بنطلّع بيه أي حاجة تانية.</p>');
rep('<li>Event and launch coverage</li>', '<li>تغطية فعاليات وإطلاقات</li>');
rep('<li>Cinematic brand film</li>', '<li>أفلام براند سينمائية</li>');
rep('<li>Same-week turnaround</li>', '<li>تسليم في نفس الأسبوع</li>');

rep('<h3>Social &amp; Media Buying</h3>', '<h3>سوشيال ميديا و Media Buying</h3>');
rep('<p>Anyone can fill a feed. Few can hold a position. Social media management and paid media run as one system: audience architecture, creative testing, daily optimisation.</p>',
    '<p>أي حد يقدر يملا فيد. قليلين اللي يقدروا يمسكوا تموضع. إدارة السوشيال ميديا والإعلانات الممولة بتشتغل كنظام واحد: بناء الجمهور، اختبار الكرياتيف، وتحسين يومي.</p>');
rep('<li>Social media management</li>', '<li>إدارة سوشيال ميديا</li>');
rep('<li>Media buying on Meta and beyond</li>', '<li>Media buying على Meta وغيرها</li>');
rep('<li>Reporting you can actually read</li>', '<li>تقارير تقدر تقراها فعلًا</li>');

/* ==================== BAND ==================== */
rep('<h3>Skip the scroll. <em>Talk to us.</em></h3>', '<h3>بلاش تدوّر. <em>كلّمنا مباشرة.</em></h3>');
rep('<p>Tell us the scope. You get a first read of what you already have, then a quote built around it.</p>',
    '<p>قول لنا النطاق. هتاخد قراءة أولى للي موجود عندك، وبعدها عرض سعر مبني عليه.</p>');
rep('>WhatsApp Us · "FIRST"</a>', '>واتساب · "FIRST"</a>');

/* ==================== 02 · METHOD ==================== */
rep('<div class="sec-num">/// 02 · How We Work</div>', '<div class="sec-num">/// 02 · إزاي بنشتغل</div>');
rep('<h2 class="mask">The Primus <em>Method.</em></h2>', '<h2 class="mask">منهج <em>Primus.</em></h2>');
rep('<p class="lede">Four moves. One standard. Every engagement follows the same engineered sequence, whether we are writing your codebase or running your feed.</p>',
    '<p class="lede">أربع خطوات. معيار واحد. كل تعاقد بيمشي بنفس التسلسل المهندَس، سواء بنكتب الـ codebase بتاعك أو بندير الفيد بتاعك.</p>');

rep('<h3>AUDIT</h3>', '<h3>التدقيق</h3>');
rep('<p>We measure what already exists and find where money and attention leak. Site, product, ads, feed, competitors.</p>',
    '<p>بنقيس اللي موجود فعلًا ونلاقي مكان تسريب الفلوس والانتباه. الموقع، المنتج، الإعلانات، الفيد، المنافسين.</p>');
rep('<h3>ENGINEER</h3>', '<h3>الهندسة</h3>');
rep('<p>Strategy, software, identity, and content built as systems. Nothing improvised post by post or screen by screen.</p>',
    '<p>استراتيجية وسوفتوير وهوية ومحتوى، كلها متبنية كأنظمة. مفيش حاجة بتتعمل ارتجال بوست ورا بوست أو شاشة ورا شاشة.</p>');
rep('<h3>AMPLIFY</h3>', '<h3>التضخيم</h3>');
rep('<p>We ship it, then push it. Organic growth and paid media, mathematically managed and relentlessly optimised.</p>',
    '<p>بنطلّعه، وبعدين بندفعه. نمو أورجانيك وإعلانات ممولة، بتتدار بالرياضة وبتتحسّن من غير رحمة.</p>');
rep('<h3>SCALE</h3>', '<h3>التوسع</h3>');
rep('<p>Reporting, iteration, compounding results. Excellence maintained, not excellence announced once.</p>',
    '<p>تقارير وتكرار ونتائج بتتراكم. تميّز بيتحافظ عليه، مش تميّز بيتعلن مرة واحدة.</p>');

/* ==================== 03 · WORK ==================== */
rep('<div class="sec-num">/// 03 · Proof</div>', '<div class="sec-num">/// 03 · الدليل</div>');
rep('<h2 class="mask">The work, and what it <em>found.</em></h2>', '<h2 class="mask">الشغل، واللي <em>اكتشفه.</em></h2>');
rep('<p class="lede">One platform we designed, built and shipped, and two paid audits of businesses that thought they were fine. The audit clients stay sealed: no name, no domain, no screenshot. The numbers are theirs, the findings were ours.</p>',
    '<p class="lede">منصة واحدة صمّمناها وبنيناها وطلّعناها، وتدقيقين مدفوعين لبيزنسات كانت فاكرة نفسها تمام. عملاء التدقيق مقفولين: من غير اسم، من غير دومين، من غير صورة. الأرقام أرقامهم، والاكتشافات كانت بتاعتنا.</p>');

rep('<div class="case-tag">Product · SaaS Platform</div>', '<div class="case-tag">منتج · منصة SaaS</div>');
rep('<p class="case-line">A bazaar runs on paper and group chats until the day it cannot. We designed, built and deployed the operations platform that replaced both.</p>',
    '<p class="case-line">البازار بيشتغل بالورق وجروبات الواتس لحد اليوم اللي ما يقدرش فيه. إحنا صمّمنا وبنينا ونشرنا منصة التشغيل اللي بدّلت الاتنين.</p>');
rep('<p>A full SaaS product carried from blank page to production: booth and vendor tracking, cost and progress boards, an interactive floor model, and Arabic-first RTL interface work throughout. Access is scoped per role and enforced on the server, not hidden in the interface, so a limited account cannot read what it is not entitled to even if it asks the API directly.</p>',
    '<p>منتج SaaS كامل اتشال من صفحة فاضية لحد الـ production: تتبّع العارضين والأماكن، لوحات تكلفة وتقدّم، موديل أرضي تفاعلي، وشغل واجهة RTL عربي أولًا في كل حتة. الصلاحيات محدودة حسب الدور ومفروضة على السيرفر، مش مخبّية في الواجهة، فالحساب المحدود ما يقدرش يقرا حاجة مش من حقه حتى لو سأل الـ API مباشرة.</p>');
rep('<li><b>Scope</b><span>Product design, architecture, build, deployment</span></li>',
    '<li><b>النطاق</b><span>تصميم المنتج، المعمارية، البناء، النشر</span></li>');
rep('<li><b>Interface</b><span>React 18, TypeScript, Vite, Tailwind, Zustand</span></li>',
    '<li><b>الواجهة</b><span>React 18، TypeScript، Vite، Tailwind، Zustand</span></li>');
rep('<li><b>Service</b><span>Node, Express, libSQL on Turso</span></li>',
    '<li><b>الخدمة</b><span>Node، Express، libSQL على Turso</span></li>');
rep('<li><b>Access</b><span>Role-gated accounts, hashed credentials, server-side sessions</span></li>',
    '<li><b>الصلاحيات</b><span>حسابات محكومة بالأدوار، بيانات دخول مشفّرة، جلسات على السيرفر</span></li>');
rep('<li><b>Hardening</b><span>Parameterised queries, column allowlists, rate limiting, CSRF</span></li>',
    '<li><b>التأمين</b><span>استعلامات parameterised، قوائم أعمدة مسموحة، rate limiting، CSRF</span></li>');
rep('<p class="case-note">Private platform, login only. No operational records, figures or screenshots from the live product are published here or anywhere else.</p>',
    '<p class="case-note">منصة خاصة، بتسجيل دخول بس. مفيش أي سجلات تشغيل أو أرقام أو صور من المنتج الحي منشورة هنا ولا في أي مكان تاني.</p>');

rep('<div class="case-tag">Measured Audit · Manufacturer</div>', '<div class="case-tag">تدقيق مقاس · مصنّع</div>');
rep('<h3>24 findings.<br>Zero ways to <em>contact them.</em></h3>', '<h3>24 اكتشافًا.<br>وصفر طريقة <em>للتواصل معاهم.</em></h3>');
rep('<p class="case-line">A manufacturer with a site that looked finished. Ten pages of findings later, the first one was the cheapest and the most expensive at the same time.</p>',
    '<p class="case-line">مصنّع بموقع شكله خلصان. بعد عشر صفحات اكتشافات، طلع أول واحد فيهم هو الأرخص والأغلى في نفس الوقت.</p>');
rep('<p>Finding 01 was that the site published no contact channel at all. Not a form, not a number, not an address. Everything spent driving traffic there arrived at a page with no way to answer. Underneath that sat the drift: a site assembled section by section rather than designed once and reused.</p>',
    '<p>الاكتشاف رقم 01 إن الموقع مش ناشر أي وسيلة تواصل خالص. لا فورم، لا رقم، لا عنوان. كل جنيه اتصرف عشان يجيب زيارات كان بيوصل لصفحة مفيهاش طريقة للرد. وتحت ده كان في انحراف: موقع متجمّع قسم ورا قسم بدل ما يتصمم مرة ويتعاد استخدامه.</p>');
rep('<li><b>Finding 01</b><span>No contact channel anywhere on the site</span></li>',
    '<li><b>الاكتشاف 01</b><span>مفيش وسيلة تواصل في أي مكان بالموقع</span></li>');
rep('<li><b>Type scale</b><span>15 different text sizes</span></li>',
    '<li><b>مقاسات الخط</b><span>15 مقاس نص مختلف</span></li>');
rep('<li><b>Components</b><span>8 button designs, 8 corner radii</span></li>',
    '<li><b>المكوّنات</b><span>8 تصميمات أزرار، و8 أنصاف أقطار للزوايا</span></li>');
rep('<li><b>Detail</b><span>25 separate letter-spacing values</span></li>',
    '<li><b>التفاصيل</b><span>25 قيمة تباعد حروف منفصلة</span></li>');
rep('<li><b>Deliverable</b><span>10 pages, 24 findings, no fixes</span></li>',
    '<li><b>المُسلَّم</b><span>10 صفحات، 24 اكتشافًا، بدون حلول</span></li>');
rep('<p class="case-note">Name, domain and screenshots withheld. The audit ships findings only. The fixes are the work.</p>',
    '<p class="case-note">الاسم والدومين والصور محجوبة. التدقيق بيسلّم الاكتشافات بس. الحلول هي الشغل نفسه.</p>');

rep('<div class="case-tag">Measured Audit · D2C Store</div>', '<div class="case-tag">تدقيق مقاس · متجر D2C</div>');
rep('<h3>22 findings.<br><em>15.9 MB</em> on a phone.</h3>', '<h3>22 اكتشافًا.<br><em>15.9 ميجابايت</em> على الموبايل.</h3>');
rep('<p class="case-line">An Arabic storefront buying traffic it could not hold. We measured it at 390 px and at 1440 px, and the phone number is the one that hurts.</p>',
    '<p class="case-line">متجر عربي بيشتري زيارات مش قادر يمسكها. قِسناه على 390 بكسل وعلى 1440 بكسل، ورقم الموبايل هو اللي بيوجع.</p>');
rep(`<p>Every paid click landed on 15.9 MB of page, and the two heaviest files had been uploaded through the client's own dashboard. Two further findings were liability rather than performance: a stock counter that invented urgency, and a review rating written into the page markup for products that had no reviews. Meta suspends accounts over the first. Google strips rich results across an entire catalogue over the second.</p>`,
    '<p>كل كليك مدفوع كان بينزل على صفحة وزنها 15.9 ميجابايت، وأتقل ملفين فيها كانوا مرفوعين من الـ dashboard بتاع العميل نفسه. واكتشافين تانيين كانوا مسؤولية قانونية مش أداء: عدّاد مخزون بيخترع إلحاح، وتقييم مراجعات مكتوب في كود الصفحة لمنتجات مالهاش أي مراجعة. Meta بتوقف حسابات بسبب الأول. Google بتشيل الـ rich results عن الكتالوج كله بسبب التاني.</p>');
rep('<li><b>Weight</b><span>15.9 MB on first mobile load</span></li>',
    '<li><b>الوزن</b><span>15.9 ميجابايت في أول تحميل على الموبايل</span></li>');
rep('<li><b>Cause</b><span>The two heaviest assets were client-uploaded</span></li>',
    '<li><b>السبب</b><span>أتقل ملفين كانوا مرفوعين من العميل</span></li>');
rep('<li><b>Exposure</b><span>Fabricated stock counter, invented review rating in schema</span></li>',
    '<li><b>المخاطرة</b><span>عدّاد مخزون مفبرك، وتقييم مراجعات مخترع في الـ schema</span></li>');
rep('<li><b>Measured at</b><span>390 px and 1440 px</span></li>',
    '<li><b>قِيس على</b><span>390 بكسل و1440 بكسل</span></li>');
rep('<li><b>Deliverable</b><span>11 pages, 22 findings, no fixes</span></li>',
    '<li><b>المُسلَّم</b><span>11 صفحة، 22 اكتشافًا، بدون حلول</span></li>');
rep('<p class="case-note">Name, domain and screenshots withheld. Published anonymised, by agreement.</p>',
    '<p class="case-note">الاسم والدومين والصور محجوبة. منشور مجهّل الهوية، بالاتفاق.</p>');

/* ==================== 04 · ENGAGEMENTS ==================== */
rep('<div class="sec-num">/// 04 · Engagements</div>', '<div class="sec-num">/// 04 · التعاقدات</div>');
rep('<h2 class="mask">No packages.<br>A <em>quote.</em></h2>', '<h2 class="mask">مفيش باقات.<br><em>عرض سعر.</em></h2>');
rep('<p class="lede center-lede">A price list is a guess made before anyone looked. Scope moves the number, and scope is different every time: platforms, output volume, integrations, shoot days, how much of the system already exists. So we measure first, then quote in writing, itemised.</p>',
    '<p class="lede center-lede">قايمة الأسعار تخمين اتعمل قبل ما حد يبص. النطاق هو اللي بيحرّك الرقم، والنطاق مختلف كل مرة: المنصات، حجم المحتوى، الـ integrations، أيام التصوير، وقد إيه من النظام موجود أصلًا. فبنقيس الأول، وبعدين نسعّر مكتوب ومفصّل بنود.</p>');

rep('<div class="badge">Most Requested</div>', '<div class="badge">الأكثر طلبًا</div>');
rep('<div class="scope">Scoped, then quoted</div>', '<div class="scope">النطاق أولًا، ثم عرض السعر</div>');

rep('<li>SaaS platforms and web apps</li>', '<li>منصات SaaS وتطبيقات ويب</li>');
rep('<li>Websites and landing systems</li>', '<li>مواقع وأنظمة صفحات هبوط</li>');
rep('<li>Architecture, build, deployment</li>', '<li>معمارية، بناء، نشر</li>');
rep('<p class="desc">Quoted per project, against a written scope and a build order.</p>',
    '<p class="desc">يُسعَّر لكل مشروع، مقابل نطاق مكتوب وترتيب تنفيذ.</p>');
rep('>Scope A Build</a>', '>حدّد نطاق البناء</a>');

rep('<li>Content production and editing</li>', '<li>إنتاج محتوى ومونتاج</li>');
rep('<li>Meta and platform ad buying</li>', '<li>شراء إعلانات Meta والمنصات</li>');
rep('<li>Performance reporting</li>', '<li>تقارير أداء</li>');
rep('<p class="desc">Quoted per brand as a monthly retainer, priced to the output you actually need.</p>',
    '<p class="desc">يُسعَّر لكل براند كعقد شهري، مبني على المخرجات اللي محتاجها فعلًا.</p>');
rep('>Scope A Retainer</a>', '>حدّد نطاق العقد</a>');

rep('<li>Funnels and lead capture</li>', '<li>فَنِلز وأنظمة استقبال عملاء</li>');
rep('<li>Integrations between what you own</li>', '<li>ربط بين الأدوات اللي عندك</li>');
rep('<p class="desc">Quoted per system, once we know what it has to talk to.</p>',
    '<p class="desc">يُسعَّر لكل نظام، بعد ما نعرف هيتكلم مع إيه.</p>');
rep('>Scope A System</a>', '>حدّد نطاق النظام</a>');

rep('<li>Direction, shoot, edit, delivery</li>', '<li>إخراج، تصوير، مونتاج، تسليم</li>');
rep('<li>Priority turnaround available</li>', '<li>تسليم أولوية متاح</li>');
rep('<p class="desc">Quoted per production, by shoot days and deliverables.</p>',
    '<p class="desc">يُسعَّر لكل إنتاج، بأيام التصوير والمخرجات.</p>');
rep('>Scope A Shoot</a>', '>حدّد نطاق التصوير</a>');

rep('<p class="pack-note">Take one discipline or take the loop. Every engagement opens the same way: we read what you already have, and your first read costs nothing.</p>',
    '<p class="pack-note">خد تخصص واحد أو خد الحلقة كلها. كل تعاقد بيفتح بنفس الطريقة: بنقرا اللي موجود عندك، والقراءة الأولى من غير مقابل.</p>');

/* ==================== 05 · LOCATION ==================== */
rep('<div class="sec-num" style="margin-bottom:14px">/// 05 · Where We Stand</div>',
    '<div class="sec-num" style="margin-bottom:14px">/// 05 · مكاننا</div>');
rep('<h2 class="mask">Based in Zagazig.<br>Built for <em>ambition.</em></h2>',
    '<h2 class="mask">مقرّنا الزقازيق.<br>مبنيين <em>للطموح.</em></h2>');
rep(`<p style="margin-top:22px">Sharqia's businesses have been told the same thing for years: settle for templates, settle for "good enough," settle for agencies whose own pages look abandoned and whose developers are somebody else's freelancer.</p>`,
    '<p style="margin-top:22px">بيزنسات الشرقية اتقال لها نفس الكلام لسنين: ارضى بالقوالب، ارضى بـ"كفاية كده"، ارضى بوكالات صفحاتها هي نفسها شكلها مهجور ومطوّرينها فريلانسر بتاع حد تاني.</p>');
rep(`<p><strong>We didn't open in Zagazig despite the market. We opened because of it.</strong> The brands here deserve work that stands next to anything coming out of Cairo: software that holds up under audit, strategy with mathematics behind it, and design with taste in front of it.</p>`,
    '<p><strong>ما فتحناش في الزقازيق رغم السوق. فتحنا بسببه.</strong> البراندات هنا تستاهل شغل يقف جنب أي حاجة طالعة من القاهرة: سوفتوير يصمد قدام التدقيق، استراتيجية وراها رياضة، وتصميم قدامه ذوق.</p>');
rep('<p>From restaurants and clinics to real estate, retail and founders building a product, if your brand lives in Sharqia and thinks bigger than it, we should talk.</p>',
    '<p>من المطاعم والعيادات للعقارات والريتيل ومؤسسين بيبنوا منتج، لو براندك عايش في الشرقية وبيفكر أكبر منها، لازم نتكلم.</p>');
rep('<div class="city serif">Zagazig</div>', '<div class="city serif">الزقازيق</div>');
rep('<div class="country">Sharqia · Egypt</div>', '<div class="country">الشرقية · مصر</div>');
rep('<p class="serve">Serving Zagazig, 10th of Ramadan, Belbeis, and brands across Egypt.</p>',
    '<p class="serve">بنخدم الزقازيق والعاشر من رمضان وبلبيس، وبراندات في كل مصر.</p>');

/* ==================== 06 · FAQ ==================== */
rep('<div class="sec-num">/// 06 · Questions, Answered</div>', '<div class="sec-num">/// 06 · أسئلة، وإجابات</div>');
rep('<h2 class="mask">Asked &amp; <em>answered.</em></h2>', '<h2 class="mask">اتسأل و<em>اتجاوب.</em></h2>');

rep('<summary>How does Primus Digital price its work?<span class="x">+</span></summary>',
    '<summary>إزاي Primus Digital بتسعّر شغلها؟<span class="x">+</span></summary>');
rep('<p class="a">Every engagement is quoted individually. There are no fixed monthly packages, because scope is what drives the number: platforms, output volume, integrations, shoot days, and how much of the system already exists all move it. You tell us the scope, we measure what you already have, and you receive a written quote with the work itemised.</p>',
    '<p class="a">كل تعاقد بيتسعّر لوحده. مفيش باقات شهرية ثابتة، لأن النطاق هو اللي بيحرّك الرقم: المنصات، حجم المخرجات، الـ integrations، أيام التصوير، وقد إيه من النظام موجود أصلًا، كلهم بيغيّروه. تقول لنا النطاق، نقيس اللي عندك، ويوصلك عرض سعر مكتوب ومفصّل بنود.</p>');

rep('<summary>Why no price list?<span class="x">+</span></summary>',
    '<summary>ليه مفيش قايمة أسعار؟<span class="x">+</span></summary>');
rep('<p class="a">A price list is a guess published before anyone looked at your business. It either overcharges the simple job or quietly strips the complicated one down until it fits the number. We would rather spend an hour measuring and give you a figure that survives contact with the actual work.</p>',
    '<p class="a">قايمة الأسعار تخمين متنشر قبل ما حد يبص على البيزنس بتاعك. يا إما بتحمّل الشغل البسيط زيادة، يا إما بتقصقص الشغل المعقّد في الضلمة لحد ما يدخل في الرقم. إحنا نفضّل نصرف ساعة في القياس ونديك رقم يصمد قدام الشغل الحقيقي.</p>');

rep('<summary>Do you build software and SaaS platforms?<span class="x">+</span></summary>',
    '<summary>بتبنوا برمجيات ومنصات SaaS؟<span class="x">+</span></summary>');
rep('<p class="a">Yes. Websites, web platforms and full SaaS products, covering architecture, database, interface and deployment. The most recent is Zoom Bazar, a bazaar operations platform we carried from blank page to production with role-gated accounts enforced on the server. Mobile applications are built to the same standard.</p>',
    '<p class="a">أيوه. مواقع ومنصات ويب ومنتجات SaaS كاملة، تشمل المعمارية وقاعدة البيانات والواجهة والنشر. آخرها Zoom Bazar، منصة تشغيل بازار شِلناها من صفحة فاضية لحد الـ production بحسابات محكومة بالأدوار مفروضة على السيرفر. وتطبيقات الموبايل بتتبني بنفس المعيار.</p>');

rep('<summary>What services does Primus Digital offer?<span class="x">+</span></summary>',
    '<summary>إيه الخدمات اللي بتقدمها Primus Digital؟<span class="x">+</span></summary>');
rep('<p class="a">Four disciplines sold as one closed loop. BUILD is software, SaaS and web. AUTOMATE is funnels, dashboards and internal systems. FILM is event coverage and brand film. GROW is social media management and media buying. Take one, or take the loop.</p>',
    '<p class="a">أربعة تخصصات بتتباع كحلقة واحدة مقفولة. BUILD يعني برمجيات و SaaS ومواقع. AUTOMATE يعني فَنِلز و dashboards وأنظمة داخلية. FILM يعني تغطية فعاليات وأفلام براند. GROW يعني إدارة سوشيال ميديا و media buying. خد واحد، أو خد الحلقة كلها.</p>');

rep('<summary>Which areas does Primus Digital serve?<span class="x">+</span></summary>',
    '<summary>مين المناطق اللي بتخدموها؟<span class="x">+</span></summary>');
rep('<p class="a">We are based in Zagazig and serve businesses across Sharqia, including 10th of Ramadan and Belbeis, as well as brands anywhere in Egypt. Software, strategy, reporting and media buying are handled remotely. Coverage and film are scheduled on location.</p>',
    '<p class="a">مقرّنا الزقازيق وبنخدم شركات في الشرقية كلها، ومنها العاشر من رمضان وبلبيس، وكمان براندات في أي مكان في مصر. البرمجيات والاستراتيجية والتقارير و media buying بتتدار عن بُعد. التغطية والتصوير بيتجدولوا في الموقع.</p>');

rep('<summary>What makes Primus different from other agencies in Egypt?<span class="x">+</span></summary>',
    '<summary>إيه اللي بيفرّق Primus عن باقي الوكالات في مصر؟<span class="x">+</span></summary>');
rep('<p class="a">Most agencies sell volume, measured in posts per month. We engineer presence, and we can build the product that presence points at. Strategy before posts, data before opinions, results before applause.</p>',
    '<p class="a">أغلب الوكالات بتبيع كمية، مقاسة بعدد البوستات في الشهر. إحنا بنهندس حضورًا، وقادرين نبني المنتج نفسه اللي الحضور ده بيشاور عليه. الاستراتيجية قبل المنشورات، البيانات قبل الآراء، النتائج قبل التصفيق.</p>');

rep('<summary>How do I start working with Primus Digital?<span class="x">+</span></summary>',
    '<summary>إزاي أبدأ الشغل مع Primus Digital؟<span class="x">+</span></summary>');
rep(`<p class="a">Message "FIRST" on WhatsApp (+20 106 807 2135) or email us. You receive a first read of where your presence leaks attention and money, then a quote scoped to the work you actually need. No pitch and no obligation.</p>`,
    '<p class="a">ابعت "FIRST" على واتساب (+20 106 807 2135) أو راسلنا بالإيميل. هتاخد قراءة أولى لمكان تسريب الانتباه والفلوس من حضورك، وبعدها عرض سعر مبني على الشغل اللي محتاجه فعلًا. من غير عرض مبيعات ومن غير التزام.</p>');

/* ==================== 07 · CONTACT ==================== */
rep('<div class="kicker caps">/// 07 · The First Move Is Free</div>',
    '<div class="kicker caps">/// 07 · الخطوة الأولى علينا</div>');
rep('<h2 class="mask">Begin with <em>excellence.</em></h2>', '<h2 class="mask">ابدأ <em>بالتميّز.</em></h2>');
rep(`<p class="lead-line">Tell us the scope. Message "FIRST" and you get a first read of what you already have, then a quote built around it. No pitch, no price list, no obligation.</p>`,
    '<p class="lead-line">قول لنا النطاق. ابعت "FIRST" وهتاخد قراءة أولى للي موجود عندك، وبعدها عرض سعر مبني عليه. من غير عرض مبيعات، من غير قايمة أسعار، من غير التزام.</p>');
rep('>Email Us</a>', '>راسلنا بالإيميل</a>');
rep('>Facebook</a>', '>فيسبوك</a>');
rep('>Instagram</a>', '>إنستجرام</a>');

/* ==================== FOOTER ==================== */
/* the wordmark and the slogan stay in Latin script: brand lock */
rep('<div class="right">© <span id="yr"></span> Primus Digital · Zagazig, Egypt</div>',
    '<div class="right">© <span id="yr"></span> Primus Digital · الزقازيق، مصر</div>');

/* ==================== GUARDS ==================== */
const forbidden = [
  ['transliterated brand', /بريموس/],
  ['em dash in copy', /<(?:h[1-4]|p|li|span|summary|div)[^>]*>[^<]*—/],
  ['price leak', /\b(?:3,?499|4,?999|7,?999)\b|EGP/]
];
for (const [label, re] of forbidden) {
  if (re.test(src)) misses.push('FORBIDDEN: ' + label);
}

if (misses.length) {
  console.error(`MISSING (${misses.length}):`);
  for (const m of misses) console.error('  ' + m);
  process.exit(1);
}

const outdir = path.join(ROOT, 'ar');
fs.mkdirSync(outdir, { recursive: true });
fs.writeFileSync(path.join(outdir, 'index.html'), src, 'utf8');
console.log('ar/index.html written, ' + Buffer.byteLength(src) + ' bytes');
