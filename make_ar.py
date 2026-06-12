# Generates ar/index.html from index.html — same design/JS, Arabic content, RTL.
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
misses = []

def rep(old, new):
    global src
    if old not in src:
        misses.append(old[:80])
        return
    src = src.replace(old, new)

# ---- document language / head ----
rep('<html lang="en">', '<html lang="ar" dir="rtl">')
rep('<title>Digital Marketing Agency in Zagazig | Primus Digital</title>',
    '<title>وكالة تسويق إلكتروني في الزقازيق | بريموس ديجيتال Primus Digital</title>')
rep('<meta name="description" content="Premium digital marketing agency in Zagazig, Egypt. Social media management, media buying, coverage & web development. From 3,499 EGP/month — your first audit is free.">',
    '<meta name="description" content="وكالة تسويق إلكتروني فاخرة في الزقازيق، مصر. إدارة سوشيال ميديا، إعلانات ممولة، تغطية فعاليات، وتصميم مواقع وتطبيقات. باقات من 3,499 ج.م شهريًا — والتدقيق الأول لصفحتك مجانًا.">')
rep('<link rel="canonical" href="https://primusdigitalagency.vercel.app/">',
    '<link rel="canonical" href="https://primusdigitalagency.vercel.app/ar/">')
rep('<meta property="og:url" content="https://primusdigitalagency.vercel.app/">',
    '<meta property="og:url" content="https://primusdigitalagency.vercel.app/ar/">')
rep('<meta property="og:title" content="Digital Marketing Agency in Zagazig | Primus Digital">',
    '<meta property="og:title" content="وكالة تسويق إلكتروني في الزقازيق | بريموس ديجيتال">')
rep('<meta property="og:description" content="Social media management, media buying, coverage & web development — engineered in Zagazig, Egypt. Packages from 3,499 EGP/month. First audit free.">',
    '<meta property="og:description" content="إدارة سوشيال ميديا، إعلانات ممولة، تغطية فعاليات، وتطوير مواقع — من الزقازيق، مصر. باقات من 3,499 ج.م شهريًا. التدقيق الأول مجانًا.">')
rep('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="ar_EG">')
rep('<meta name="twitter:title" content="Digital Marketing Agency in Zagazig | Primus Digital">',
    '<meta name="twitter:title" content="وكالة تسويق إلكتروني في الزقازيق | بريموس ديجيتال">')
rep('<meta name="twitter:description" content="Premium social media management, media buying & coverage in Zagazig, Egypt. From 3,499 EGP/month — first audit free.">',
    '<meta name="twitter:description" content="إدارة سوشيال ميديا وإعلانات ممولة وتغطية فعاليات في الزقازيق، مصر. من 3,499 ج.م شهريًا — التدقيق الأول مجانًا.">')
rep('family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&display=swap',
    'family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Tajawal:wght@300;400;500;700&display=swap')

# ---- JSON-LD: splice the whole block with the Arabic graph ----
start = src.find('<script type="application/ld+json">')
end = src.find('</script>', start) + len('</script>')
assert start != -1 and end > start, 'JSON-LD block not found'
jsonld = '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "#primus",
      "name": "بريموس ديجيتال",
      "alternateName": ["Primus Digital", "Primus Digital Agency"],
      "slogan": "حيث يبدأ التميّز",
      "description": "وكالة تسويق إلكتروني فاخرة في الزقازيق، مصر. إدارة سوشيال ميديا، إعلانات ممولة، تغطية فعاليات، حلول أعمال، فيديوغرافي، وتصميم مواقع وتطبيقات موبايل.",
      "url": "https://primusdigitalagency.vercel.app/ar/",
      "inLanguage": "ar",
      "telephone": "+201068072135",
      "email": "primusdigitalcorpration@gmail.com",
      "priceRange": "3,499–7,999 EGP/month",
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
      "knowsAbout": [
        "إدارة السوشيال ميديا", "الإعلانات الممولة", "إعلانات ميتا", "تغطية الفعاليات",
        "فيديوغرافي", "تصميم وتطوير المواقع", "تطوير تطبيقات الموبايل", "التسويق الإلكتروني"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "باقات إدارة السوشيال ميديا",
        "itemListElement": [
          {"@type": "Offer", "name": "باقة الانطلاقة", "price": "3499", "priceCurrency": "EGP", "description": "2 ريلز، 10 منشورات، إدارة فيسبوك — شهريًا."},
          {"@type": "Offer", "name": "باقة النمو برو", "price": "4999", "priceCurrency": "EGP", "description": "4 ريلز، 15 منشورًا، إدارة فيسبوك وإنستجرام، تقرير أداء شهري — شهريًا."},
          {"@type": "Offer", "name": "باقة النخبة", "price": "7999", "priceCurrency": "EGP", "description": "6 ريلز، 20 منشورًا، إدارة جميع المنصات، تقارير أسبوعية، أولوية المونتاج والتصوير — شهريًا."}
        ]
      }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "ar",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كم تكلفة إدارة السوشيال ميديا في الزقازيق؟",
          "acceptedAnswer": {"@type": "Answer", "text": "تبدأ باقات بريموس ديجيتال من 3,499 ج.م شهريًا (باقة الانطلاقة)، و4,999 ج.م شهريًا لباقة النمو برو — الأكثر طلبًا — و7,999 ج.م شهريًا لباقة النخبة. الباقات المخصصة تُسعَّر حسب الطلب، وكل تعاقد يبدأ بتدقيق مجاني لصفحتك."}
        },
        {
          "@type": "Question",
          "name": "ما المناطق التي تخدمها بريموس ديجيتال؟",
          "acceptedAnswer": {"@type": "Answer", "text": "مقرنا الزقازيق ونخدم الأعمال في كل الشرقية — بما فيها العاشر من رمضان وبلبيس — وأي علامة في مصر. الاستراتيجية والتقارير والإعلانات تُدار عن بُعد؛ والتغطية والتصوير يُجدولان في الموقع."}
        },
        {
          "@type": "Question",
          "name": "ما الخدمات التي تقدمها بريموس ديجيتال؟",
          "acceptedAnswer": {"@type": "Answer", "text": "أربعة تخصصات أساسية: إدارة السوشيال ميديا، الإعلانات الممولة (على ميتا وغيرها)، تغطية احترافية للفعاليات والعلامات، وحلول الأعمال — قمع مبيعات وأتمتة وتحليلات. نقدم أيضًا فيديوغرافي فاخر وتصميم وتطوير مواقع وتطبيقات موبايل."}
        },
        {
          "@type": "Question",
          "name": "ما الذي يميز بريموس عن باقي الوكالات في مصر؟",
          "acceptedAnswer": {"@type": "Answer", "text": "أغلب الوكالات تبيع الكم — عدد منشورات في الشهر. نحن نهندس الحضور: الاستراتيجية قبل المنشورات، البيانات قبل الآراء، النتائج قبل التصفيق. تصميم تحريري فاخر، إعلانات تُدار رياضيًا، وتقارير تُقرأ فعلًا."}
        },
        {
          "@type": "Question",
          "name": "كيف أبدأ العمل مع بريموس ديجيتال؟",
          "acceptedAnswer": {"@type": "Answer", "text": "أرسل \\"FIRST\\" على واتساب (+20 106 807 2135) أو راسلنا بالإيميل. ستحصل على تدقيق مجاني لصفحتك — أين تتسرب الأموال والانتباه — بلا عرض مبيعات وبلا أي التزام."}
        },
        {
          "@type": "Question",
          "name": "هل تصممون مواقع وتطبيقات موبايل؟",
          "acceptedAnswer": {"@type": "Answer", "text": "نعم. مواقع فاخرة مُفصّلة تُهندَس للتحويل وتطبيقات موبايل مخصصة — ضمن خدماتنا الحصرية، بالمعيار نفسه لكل ما نقدمه."}
        }
      ]
    }
  ]
}
</script>'''
src = src[:start] + jsonld + src[end:]

# ---- Arabic typography overrides, appended at the end of the main stylesheet ----
arstyle = '''
  /* ---------------- ARABIC / RTL ---------------- */
  body{font-family:'Tajawal','Inter',sans-serif;font-weight:400}
  .hero h1,.sec-head h2,.manifesto h2,.svc h3,.band-card h3,.step h4,.pack h3,.pack .price,.exc h3,.loc h2,.faq summary,#contact h2,.loc-card .city,.marquee span{font-family:'Amiri','Playfair Display',serif}
  .caps,.kicker,.sec-num,.btn,.pack ul li,.pack .badge,.loc-card .country,.pack-note,footer .mid,.marquee span,#contact .small{letter-spacing:.02em}
  .nav-links a{letter-spacing:.04em;font-size:12.5px}
  .caps{font-size:12.5px}
  .sec-num{font-size:12.5px}
  .btn{font-size:13px;font-weight:500;letter-spacing:.02em}
  .pack ul li{font-size:13px;letter-spacing:0}
  .pack .badge{font-size:11px;letter-spacing:.04em}
  .hero h1{line-height:1.3;letter-spacing:0}
  .faq summary{line-height:1.8}
  .nav-cta{margin-left:0;margin-right:14px}
  footer .mid{font-size:12.5px}
  .loader-word{letter-spacing:.48em} /* Latin wordmark keeps its tracking */
</style>'''
assert '</style>' in src
src = src.replace('</style>', arstyle, 1)  # arstyle ends with </style>

# ---- nav ----
rep('''    <a href="#services">Services</a>
    <a href="#method">Method</a>
    <a href="#packages">Packages</a>
    <a href="#exclusive">Exclusive</a>
    <a href="#about">Zagazig</a>
    <a href="/ar/" lang="ar">عربي</a>
    <a href="#contact" class="nav-cta">Begin</a>''',
'''    <a href="#services">خدماتنا</a>
    <a href="#method">منهجنا</a>
    <a href="#packages">الباقات</a>
    <a href="#exclusive">حصري</a>
    <a href="#about">الزقازيق</a>
    <a href="/" lang="en">EN</a>
    <a href="#contact" class="nav-cta">ابدأ الآن</a>''')

# ---- hero ----
rep('<div class="kicker caps fade-in" style="--d:.15s">Digital Marketing Agency — Zagazig, Egypt</div>',
    '<div class="kicker caps fade-in" style="--d:.15s">وكالة تسويق إلكتروني — الزقازيق، مصر</div>')
rep('<h1><span class="w" style="--d:.3s">Where</span> <span class="w" style="--d:.48s"><em>Excellence</em></span><br><span class="w" style="--d:.66s">Begins.</span></h1>',
    '<h1><span class="w" style="--d:.3s">حيث</span> <span class="w" style="--d:.48s">يبدأ</span><br><span class="w" style="--d:.66s"><em>التميّز.</em></span></h1>')
rep('<p class="sub fade-in" style="--d:.9s">Social media management, media buying, coverage, and business solutions — engineered with the precision your brand deserves. Not posted. Positioned.</p>',
    '<p class="sub fade-in" style="--d:.9s">إدارة سوشيال ميديا، إعلانات ممولة، تغطية فعاليات، وحلول أعمال — مُهندَسة بالدقة التي تستحقها علامتك. لا نكتفي بالنشر… نحن نبني المكانة.</p>')
rep('>Start Your Project</a>', '>ابدأ مشروعك</a>')
rep('>View Packages</a>', '>استعرض الباقات</a>')

# ---- marquee (two identical tracks — replace both) ----
rep('<span>Social Media Management <i>///</i></span><span>Media Buying <i>///</i></span><span>Coverage <i>///</i></span><span>Business Solutions <i>///</i></span><span>Elite Videography <i>///</i></span><span>Web &amp; App Development <i>///</i></span>',
    '<span>إدارة السوشيال ميديا <i>///</i></span><span>الإعلانات الممولة <i>///</i></span><span>تغطية الفعاليات <i>///</i></span><span>حلول الأعمال <i>///</i></span><span>فيديوغرافي فاخر <i>///</i></span><span>تصميم مواقع وتطبيقات <i>///</i></span>')

# ---- manifesto ----
rep('<h2>Most agencies manage pages.<br>We <em>engineer presence.</em></h2>',
    '<h2>أغلب الوكالات تدير صفحات.<br>نحن <em>نهندس الحضور.</em></h2>')
rep('<span>Strategy before posts.</span>', '<span>الاستراتيجية قبل المنشورات.</span>')
rep('<span>Data before opinions.</span>', '<span>البيانات قبل الآراء.</span>')
rep('<span>Results before applause.</span>', '<span>النتائج قبل التصفيق.</span>')

# ---- services ----
rep('<div class="sec-num">/// 01 — What We Do</div>', '<div class="sec-num">/// 01 — ماذا نفعل</div>')
rep('<h2>Four disciplines.<br>One <em>standard.</em></h2>', '<h2>أربعة تخصصات.<br>معيار <em>واحد.</em></h2>')
rep('<h3>Social Media Management</h3>', '<h3>إدارة السوشيال ميديا</h3>')
rep('<p>Anyone can fill a feed. Few can hold a position. We run your social media like a chess game — every post a calculated move toward authority, attention, and revenue.</p>',
    '<p>أي أحد يقدر يملأ صفحة. قليلون من يحافظون على مكانة. ندير حساباتك كمباراة شطرنج — كل منشور خطوة محسوبة نحو الهيبة والانتباه والإيراد.</p>')
rep('<h3>Media Buying</h3>', '<h3>الإعلانات الممولة</h3>')
rep('<p>Boosted posts burn money. Engineered campaigns print it. Audience architecture, creative testing, and daily optimization — every pound accounted for.</p>',
    '<p>تعزيز المنشورات يحرق المال. الحملات المُهندَسة تطبعه. بناء جمهور، اختبار إعلانات، وتحسين يومي — كل جنيه له حساب.</p>')
rep('<h3>Coverage</h3>', '<h3>تغطية الفعاليات</h3>')
rep("<p>Your best moments shouldn't live and die in the room. Openings, events, and launches — shot, cut, and published while the moment is still hot.</p>",
    '<p>أجمل لحظاتك لا يجب أن تعيش وتموت داخل القاعة. افتتاحات وفعاليات وإطلاقات — تُصوَّر وتُمنتَج وتُنشَر واللحظة لسه ساخنة.</p>')
rep('<h3>Business Solutions</h3>', '<h3>حلول الأعمال</h3>')
rep("<p>Growth isn't a post — it's infrastructure. Funnels, automation, analytics, and lead systems: the machinery behind brands that scale.</p>",
    '<p>النمو ليس منشورًا — بل بنية تحتية. قمع مبيعات، أتمتة، تحليلات، وأنظمة عملاء: الماكينة وراء العلامات التي تتوسع.</p>')

# ---- quick contact band ----
rep('<h3>Skip the scroll. <em>Talk to us.</em></h3>', '<h3>تخطَّ البحث. <em>كلِّمنا مباشرة.</em></h3>')
rep('<p>A complimentary audit of your page is one message away — no pitch, no obligation.</p>',
    '<p>تدقيق مجاني لصفحتك على بُعد رسالة واحدة — بلا عرض مبيعات، بلا التزام.</p>')
rep('>WhatsApp Us — "FIRST"</a>', '>واتساب — "FIRST"</a>')  # band + contact

# ---- method ----
rep('<div class="sec-num">/// 02 — How We Work</div>', '<div class="sec-num">/// 02 — كيف نعمل</div>')
rep('<h2>The Primus <em>Method.</em></h2>', '<h2>منهج <em>بريموس.</em></h2>')
rep('<p class="lede">Four moves. One standard. Every engagement follows the same engineered sequence — no guesswork, no improvisation.</p>',
    '<p class="lede">أربع خطوات. معيار واحد. كل تعاقد يتبع التسلسل المُهندَس نفسه — لا تخمين، ولا ارتجال.</p>')
rep('<h4>AUDIT</h4>', '<h4>التدقيق</h4>')
rep('<p>We find where your money and attention leak — your page, your ads, your competitors.</p>',
    '<p>نكتشف أين يتسرب مالك وانتباه جمهورك — صفحتك، إعلاناتك، ومنافسوك.</p>')
rep('<h4>ENGINEER</h4>', '<h4>الهندسة</h4>')
rep('<p>Strategy, identity, and content built like systems — not improvised post by post.</p>',
    '<p>استراتيجية وهوية ومحتوى يُبنى كأنظمة — لا ارتجالًا منشورًا بمنشور.</p>')
rep('<h4>AMPLIFY</h4>', '<h4>التضخيم</h4>')
rep('<p>Organic growth and paid media, mathematically managed and relentlessly optimized.</p>',
    '<p>نمو أورجانيك وإعلانات ممولة، تُدار رياضيًا وتُحسَّن بلا هوادة.</p>')
rep('<h4>SCALE</h4>', '<h4>التوسع</h4>')
rep('<p>Reporting, iteration, compounding results. Excellence, maintained month after month.</p>',
    '<p>تقارير، تحسين مستمر، ونتائج تتراكم. تميّز يُصان شهرًا بعد شهر.</p>')

# ---- packages ----
rep('<div class="sec-num">/// 03 — Investment</div>', '<div class="sec-num">/// 03 — الاستثمار</div>')
rep('<h2>Choose Your <em>Package.</em></h2>', '<h2>اختر <em>باقتك.</em></h2>')
rep('<h3>Signature Starter Pack</h3>', '<h3>باقة الانطلاقة</h3>')
rep('<h3>Pro Growth Pack</h3>', '<h3>باقة النمو برو</h3>')
rep('<h3>Elite Prestige Pack</h3>', '<h3>باقة النخبة</h3>')
rep('<h3>Custom Pack</h3>', '<h3>باقة مخصصة</h3>')
rep('<div class="badge">Most Popular</div>', '<div class="badge">الأكثر طلبًا</div>')
rep('<b>3,499</b> EGP/month', '<b>3,499</b> ج.م/شهريًا')
rep('<b>4,999</b> EGP/month', '<b>4,999</b> ج.م/شهريًا')
rep('<b>7,999</b> EGP/month', '<b>7,999</b> ج.م/شهريًا')
rep('<div class="price"><b>Price</b> by Request</div>', '<div class="price"><b>السعر</b> حسب الطلب</div>')
rep('<li>2 Reels</li>', '<li>2 ريلز</li>')
rep('<li>10 Posts</li>', '<li>10 منشورات</li>')
rep('<li>Facebook Moderation</li>', '<li>إدارة فيسبوك</li>')
rep('<li>4 Reels</li>', '<li>4 ريلز</li>')
rep('<li>15 Posts</li>', '<li>15 منشورًا</li>')
rep('<li>FB + IG Moderation</li>', '<li>إدارة فيسبوك وإنستجرام</li>')
rep('<li>Monthly Performance Report</li>', '<li>تقرير أداء شهري</li>')
rep('<li>6 Reels</li>', '<li>6 ريلز</li>')
rep('<li>20 Posts</li>', '<li>20 منشورًا</li>')
rep('<li>All Platforms Moderation</li>', '<li>إدارة جميع المنصات</li>')
rep('<li>Weekly Performance Reports</li>', '<li>تقارير أداء أسبوعية</li>')
rep('<li>Priority Editing &amp; Shooting</li>', '<li>أولوية المونتاج والتصوير</li>')
rep("""<p class="desc">Every service, tailored entirely to your brand's vision. Fully bespoke — your goals, your platforms, your budget.</p>""",
    '<p class="desc">كل خدماتنا، مفصّلة بالكامل على رؤية علامتك — أهدافك، منصاتك، وميزانيتك.</p>')
rep('>Ignite Your Presence</a>', '>أشعل حضورك</a>')
rep('>Dominate The Feed</a>', '>تصدّر الفيد</a>')
rep('>Establish Your Legacy</a>', '>أسّس إرثك</a>')
rep('>Define Your Vision</a>', '>حدّد رؤيتك</a>')
rep('<p class="pack-note">All packages begin with a complimentary audit of your page — your first move is free.</p>',
    '<p class="pack-note">كل الباقات تبدأ بتدقيق مجاني لصفحتك — خطوتك الأولى علينا.</p>')

# ---- exclusive ----
rep('<div class="sec-num">/// 04 — Beyond the Feed</div>', '<div class="sec-num">/// 04 — ما وراء الفيد</div>')
rep('<h2>Exclusive <em>Services.</em></h2>', '<h2>خدمات <em>حصرية.</em></h2>')
rep('<h3>Elite Videography</h3>', '<h3>فيديوغرافي فاخر</h3>')
rep('<p>Cinematic, professional-grade video production crafted to captivate. From concept to final cut, every frame reflects the prestige of your brand.</p>',
    '<p>إنتاج فيديو سينمائي بمستوى احترافي صُنع ليأسر. من الفكرة إلى المونتاج النهائي، كل لقطة تعكس رُقي علامتك.</p>')
rep('<h3>Website Design &amp; Development</h3>', '<h3>تصميم وتطوير المواقع</h3>')
rep("<p>Bespoke, luxury-grade websites that don't just look stunning — they convert. Your online presence should be as impressive as your brand.</p>",
    '<p>مواقع فاخرة مُفصّلة لا تكتفي بالإبهار — بل تحوّل الزائر إلى عميل. حضورك الرقمي يجب أن يكون بمستوى علامتك.</p>')
rep('<h3>Mobile App Development</h3>', '<h3>تطوير تطبيقات الموبايل</h3>')
rep("<p>Custom mobile applications engineered for performance, designed for elegance. Put your brand directly in your clients' hands.</p>",
    '<p>تطبيقات موبايل مخصصة مُهندَسة للأداء ومُصمَّمة للأناقة. ضع علامتك مباشرة في يد عملائك.</p>')
rep('>Capture The Extraordinary</a>', '>صوّر الاستثنائي</a>')
rep('>Architect Your Legacy</a>', '>ابنِ إرثك الرقمي</a>')
rep('>Engineer Your Future</a>', '>اهندس مستقبلك</a>')

# ---- location ----
rep('<div class="sec-num" style="margin-bottom:14px">/// 05 — Where We Stand</div>',
    '<div class="sec-num" style="margin-bottom:14px">/// 05 — أين نقف</div>')
rep('<h2>Based in Zagazig.<br>Built for <em>ambition.</em></h2>',
    '<h2>من الزقازيق.<br>لطموح <em>بلا سقف.</em></h2>')
rep("""<p style="margin-top:22px">Sharqia's businesses have been told the same thing for years: settle for templates, settle for "good enough," settle for agencies whose own pages look abandoned.</p>""",
    '<p style="margin-top:22px">قيل لأصحاب الأعمال في الشرقية الكلام نفسه لسنوات: ارضَ بالقوالب الجاهزة، ارضَ بـ"كويس كفاية"، ارضَ بوكالات صفحاتها هي نفسها مهجورة.</p>')
rep("<p><strong>We didn't open in Zagazig despite the market. We opened because of it.</strong> The brands here deserve work that stands next to anything coming out of Cairo — strategy with mathematics behind it, and design with taste in front of it.</p>",
    '<p><strong>لم نفتح في الزقازيق رغم السوق — فتحنا بسببه.</strong> العلامات هنا تستحق شغلًا يقف بجانب أي شغل خارج من القاهرة — استراتيجية وراءها رياضيات، وتصميم أمامه ذوق.</p>')
rep('<p>From restaurants and clinics to real estate and retail — if your brand lives in Sharqia and thinks bigger than it, we should talk.</p>',
    '<p>من المطاعم والعيادات إلى العقارات والريتيل — لو علامتك في الشرقية وبتفكر أكبر منها، يبقى لازم نتكلم.</p>')
rep('<div class="city serif">Zagazig</div>', '<div class="city serif">الزقازيق</div>')
rep('<div class="country">Sharqia · Egypt</div>', '<div class="country">الشرقية · مصر</div>')
rep('<p class="serve">Serving Zagazig, 10th of Ramadan, Belbeis, and brands across Egypt.</p>',
    '<p class="serve">نخدم الزقازيق، العاشر من رمضان، بلبيس، وعلامات في كل مصر.</p>')

# ---- FAQ ----
rep('<div class="sec-num">/// 06 — Questions, Answered</div>', '<div class="sec-num">/// 06 — أسئلة وأجوبة</div>')
rep('<h2>Asked &amp; <em>answered.</em></h2>', '<h2>سألتم. <em>أجبنا.</em></h2>')
rep('<summary>How much does social media management cost in Zagazig?<span class="x">+</span></summary>',
    '<summary>كم تكلفة إدارة السوشيال ميديا في الزقازيق؟<span class="x">+</span></summary>')
rep('<p class="a">Primus Digital packages start at 3,499 EGP/month (Signature Starter), 4,999 EGP/month for the Pro Growth pack — our most popular — and 7,999 EGP/month for Elite Prestige. Fully custom packages are priced by request, and every engagement begins with a free audit of your page.</p>',
    '<p class="a">تبدأ باقات بريموس ديجيتال من 3,499 ج.م شهريًا (باقة الانطلاقة)، و4,999 ج.م شهريًا لباقة النمو برو — الأكثر طلبًا — و7,999 ج.م شهريًا لباقة النخبة. الباقات المخصصة تُسعَّر حسب الطلب، وكل تعاقد يبدأ بتدقيق مجاني لصفحتك.</p>')
rep('<summary>Which areas does Primus Digital serve?<span class="x">+</span></summary>',
    '<summary>ما المناطق التي تخدمها بريموس ديجيتال؟<span class="x">+</span></summary>')
rep('<p class="a">We are based in Zagazig and serve businesses across Sharqia — including 10th of Ramadan and Belbeis — as well as brands anywhere in Egypt. Strategy, reporting, and media buying are handled remotely; coverage and videography are scheduled on location.</p>',
    '<p class="a">مقرنا الزقازيق ونخدم الأعمال في كل الشرقية — بما فيها العاشر من رمضان وبلبيس — وأي علامة في مصر. الاستراتيجية والتقارير والإعلانات تُدار عن بُعد؛ والتغطية والتصوير يُجدولان في الموقع.</p>')
rep('<summary>What services does Primus Digital offer?<span class="x">+</span></summary>',
    '<summary>ما الخدمات التي تقدمها بريموس ديجيتال؟<span class="x">+</span></summary>')
rep('<p class="a">Four core disciplines: social media management, media buying (paid ads on Meta and beyond), professional event and brand coverage, and business solutions — funnels, automation, and analytics. We also offer elite videography, website design and development, and mobile app development.</p>',
    '<p class="a">أربعة تخصصات أساسية: إدارة السوشيال ميديا، الإعلانات الممولة (على ميتا وغيرها)، تغطية احترافية للفعاليات والعلامات، وحلول الأعمال — قمع مبيعات وأتمتة وتحليلات. نقدم أيضًا فيديوغرافي فاخر وتصميم وتطوير مواقع وتطبيقات موبايل.</p>')
rep('<summary>What makes Primus different from other agencies in Egypt?<span class="x">+</span></summary>',
    '<summary>ما الذي يميز بريموس عن باقي الوكالات في مصر؟<span class="x">+</span></summary>')
rep('<p class="a">Most agencies sell volume — posts per month. We engineer presence: strategy before posts, data before opinions, results before applause. Premium editorial design, mathematical media buying, and reporting you can actually read.</p>',
    '<p class="a">أغلب الوكالات تبيع الكم — عدد منشورات في الشهر. نحن نهندس الحضور: الاستراتيجية قبل المنشورات، البيانات قبل الآراء، النتائج قبل التصفيق. تصميم تحريري فاخر، إعلانات تُدار رياضيًا، وتقارير تُقرأ فعلًا.</p>')
rep('<summary>How do I start working with Primus Digital?<span class="x">+</span></summary>',
    '<summary>كيف أبدأ العمل مع بريموس ديجيتال؟<span class="x">+</span></summary>')
rep("""<p class="a">Message "FIRST" on WhatsApp (+20 106 807 2135) or email us. You'll receive a complimentary audit of your page — where it leaks attention and money — with no pitch and no obligation.</p>""",
    '<p class="a">أرسل "FIRST" على واتساب (+20 106 807 2135) أو راسلنا بالإيميل. ستحصل على تدقيق مجاني لصفحتك — أين تتسرب الأموال والانتباه — بلا عرض مبيعات وبلا أي التزام.</p>')
rep('<summary>Do you build websites and mobile apps?<span class="x">+</span></summary>',
    '<summary>هل تصممون مواقع وتطبيقات موبايل؟<span class="x">+</span></summary>')
rep('<p class="a">Yes. Bespoke, luxury-grade websites engineered to convert and custom mobile applications are part of our Exclusive Services — designed to the same standard as everything we ship.</p>',
    '<p class="a">نعم. مواقع فاخرة مُفصّلة تُهندَس للتحويل وتطبيقات موبايل مخصصة — ضمن خدماتنا الحصرية، بالمعيار نفسه لكل ما نقدمه.</p>')

# ---- contact ----
rep('<div class="kicker caps">/// 07 — The First Move Is Free</div>', '<div class="kicker caps">/// 07 — الخطوة الأولى علينا</div>')
rep('<h2>Begin with <em>excellence.</em></h2>', '<h2>ابدأ <em>بالتميّز.</em></h2>')
rep('<p class="lead-line">Ready to begin? Message us "FIRST" and receive a complimentary audit of your page — no pitch, no obligation.</p>',
    '<p class="lead-line">جاهز تبدأ؟ أرسل لنا "FIRST" واحصل على تدقيق مجاني لصفحتك — بلا عرض مبيعات، بلا التزام.</p>')
rep('>Email Us</a>', '>راسلنا بالإيميل</a>')
rep('>Facebook</a>', '>فيسبوك</a>')
rep('>Instagram</a>', '>إنستجرام</a>')

# ---- footer ----
rep('<div class="mid">Where Excellence Begins</div>', '<div class="mid">حيث يبدأ التميّز</div>')
rep('<div class="right">© <span id="yr"></span> Primus Digital — Zagazig, Egypt</div>',
    '<div class="right">© <span id="yr"></span> بريموس ديجيتال — الزقازيق، مصر</div>')

# ---- write out ----
if misses:
    print('MISSING (%d):' % len(misses))
    for m in misses:
        print('  ' + m)
    sys.exit(1)

outdir = os.path.join(ROOT, 'ar')
os.makedirs(outdir, exist_ok=True)
with open(os.path.join(outdir, 'index.html'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(src)
print('ar/index.html written, %d bytes' % len(src.encode('utf-8')))
