/* ============================================
   pricing.js v3 — מחירון + Anchoring + Decoy
   יקיר כהן הפקות

   עקרונות v3:
   • Extreme Minimalism: white / black / #8B0000
   • אפס גרדיינטים — 1px borders בלבד
   • אפס אמוג'ים — SVG Line Icons
   • Bento card layout לכל רכיב
   ============================================ */

const YK_Pricing = (function () {
  'use strict';

  const CFG  = window.YK_CONFIG || {};
  const S    = CFG.studio       || {};
  const COPY = CFG.copy         || {};
  const ANC  = CFG.anchoring    || {};

  const WA  = S.whatsapp || '972587555456';
  const CUR = S.currency  || '₪';

  // Shared SVG icons
  const SVG = {
    check:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    zap:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    target: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    arrow:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
  };


  // ──────────────────────────────────────────
  // 1. PRICE COMPARISON (Anchoring)
  // ──────────────────────────────────────────
  function renderComparison(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const competitors = ANC.competitors || options.competitors || [
      { label: 'אולפן הקלטות',  price: 1800 },
      { label: 'מפיק חיצוני',    price: 1500 },
      { label: 'עריכת וידאו',    price: 1200 },
      { label: 'הפצה + שיווק',   price: 800  }
    ];
    const ourLabel     = ANC.ourLabel     || 'הכל כאן, בניהול אחד';
    const ourPrice     = ANC.ourPrice     || 2380;
    const ourTimeLabel = ANC.ourTimeLabel || '48 שעות למיקס ראשון';

    const totalMarket = competitors.reduce((s, c) => s + c.price, 0);
    const savings     = totalMarket - ourPrice;
    const savingsPct  = Math.round((savings / totalMarket) * 100);

    el.innerHTML = `
      <div style="
        background:#fff; border:1px solid #E8E8E8;
        border-radius:12px; padding:24px 22px;
        font-family:'Heebo',sans-serif; direction:rtl;
        max-width:440px;
      ">
        <div style="font-size:0.75rem; font-weight:700; color:#7A7A7A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px;">
          כמה עולה לקנות בנפרד
        </div>

        ${competitors.map(c => `
          <div style="
            display:flex; justify-content:space-between; align-items:center;
            padding:10px 0; border-bottom:1px solid #F5F5F5; gap:8px;
          ">
            <span style="color:#7A7A7A; font-size:0.87rem;">${c.label}</span>
            <span style="color:#000; font-size:0.87rem; font-weight:600; text-decoration:line-through; text-decoration-color:#CCC;">
              ${CUR}${c.price.toLocaleString()}
            </span>
          </div>
        `).join('')}

        <div style="
          display:flex; justify-content:space-between; align-items:center;
          padding:12px 0; border-bottom:1px solid #E8E8E8;
          font-size:0.9rem; font-weight:700; gap:8px;
        ">
          <span style="color:#7A7A7A;">סה"כ בנפרד</span>
          <span style="color:#7A7A7A; text-decoration:line-through;">${CUR}${totalMarket.toLocaleString()}</span>
        </div>

        <div style="
          display:flex; justify-content:space-between; align-items:center;
          padding:14px 0; gap:8px;
        ">
          <div>
            <div style="font-size:0.95rem; font-weight:800; color:#000; margin-bottom:4px;">${ourLabel}</div>
            <span style="
              display:inline-flex; align-items:center; gap:4px;
              font-size:0.72rem; font-weight:700;
              background:#F5F5F5; color:#000;
              padding:2px 8px; border-radius:4px;
            ">
              <span style="color:#8B0000;">${SVG.zap}</span>
              ${ourTimeLabel}
            </span>
          </div>
          <span style="color:#000; font-size:1.2rem; font-weight:900; white-space:nowrap;">
            ${CUR}${ourPrice.toLocaleString()}
          </span>
        </div>

        <div style="
          background:#F5F5F5; border-radius:8px;
          padding:12px 14px; text-align:center;
          font-size:0.9rem; font-weight:800; color:#000;
        ">
          חיסכון של ${CUR}${savings.toLocaleString()} — ${savingsPct}%
        </div>
      </div>
    `;
  }


  // ──────────────────────────────────────────
  // 2. FIT QUIZ
  // ──────────────────────────────────────────
  function renderFitQuiz(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const {
      questions = [
        'אני מוכן לפרוץ ולהשמיע את הקול שלי לעולם',
        'אני רוצה תוצאה שתישאר לנצח — לא "מספיק טוב"',
        'אני מבין שהשקעה נכונה היום חוסכת כסף ועצבים מחר',
        'חשוב לי ליווי אישי לאורך כל הדרך'
      ],
      threshold = 3,
      ctaUrl    = `https://wa.me/${WA}?text=${encodeURIComponent('היי יקיר, עברתי את השאלון — אשמח לשמוע עוד')}`
    } = options;

    el.innerHTML = `
      <div id="yk-fit-quiz"
        style="
          background:#fff; border:1px solid #E8E8E8;
          border-radius:12px; padding:24px 22px;
          font-family:'Heebo',sans-serif; direction:rtl;
          max-width:440px;
        "
        data-threshold="${threshold}"
        data-questions="${questions.length}"
      >
        <div style="font-size:0.75rem; font-weight:700; color:#7A7A7A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:14px;">
          האם אנחנו מתאימים?
        </div>

        <div style="background:#F5F5F5; border-radius:4px; height:4px; overflow:hidden; margin-bottom:18px;">
          <div id="yk-quiz-prog-fill" style="
            height:100%; width:0%; border-radius:4px;
            background:#8B0000;
            transition:width 0.35s ease;
          "></div>
        </div>

        <div id="yk-quiz-items">
          ${questions.map((q, i) => `
            <label style="
              display:flex; align-items:flex-start; gap:12px;
              padding:11px 0; border-bottom:1px solid #F5F5F5;
              cursor:pointer; font-size:0.87rem; color:#222; line-height:1.5;
            ">
              <input type="checkbox" class="yk-quiz-cb" data-idx="${i}"
                style="width:18px; height:18px; min-width:18px; accent-color:#8B0000; cursor:pointer; margin-top:2px;"
                onchange="YK_Pricing._updateQuiz()"
              >
              <span>${q}</span>
            </label>
          `).join('')}
        </div>

        <div id="yk-quiz-result" style="
          margin-top:14px; padding:12px; border-radius:8px;
          text-align:center; font-size:0.85rem;
          background:#F5F5F5; color:#7A7A7A;
          transition:background 0.3s ease, color 0.3s ease;
        ">
          סמן את מה שמתאים לך
        </div>

        <a id="yk-quiz-cta" href="${ctaUrl}" target="_blank" style="
          display:none; margin-top:12px;
          background:#8B0000; color:#fff;
          text-align:center; padding:13px;
          border-radius:8px; font-weight:700;
          text-decoration:none; font-size:0.92rem;
          letter-spacing:0.02em;
        ">בואו נתחיל לעבוד</a>
      </div>
    `;
  }

  function _updateQuiz() {
    const checked   = document.querySelectorAll('.yk-quiz-cb:checked').length;
    const container = document.getElementById('yk-fit-quiz');
    const total     = parseInt(container?.dataset.questions || '4');
    const threshold = parseInt(container?.dataset.threshold || '3');

    const result   = document.getElementById('yk-quiz-result');
    const cta      = document.getElementById('yk-quiz-cta');
    const progFill = document.getElementById('yk-quiz-prog-fill');

    if (progFill) progFill.style.width = Math.round((checked / total) * 100) + '%';

    if (checked >= threshold) {
      result.style.background = '#F5F5F5';
      result.style.color      = '#000';
      result.innerHTML        = `<strong>נשמע שאנחנו מתאימים — בוא נדבר</strong>`;
      if (cta) cta.style.display = 'block';
    } else if (checked > 0) {
      result.style.background = '#F5F5F5';
      result.style.color      = '#7A7A7A';
      result.innerHTML        = `סימנת ${checked} מתוך ${threshold} — ממשיך?`;
      if (cta) cta.style.display = 'none';
    } else {
      result.style.background = '#F5F5F5';
      result.style.color      = '#7A7A7A';
      result.innerHTML        = 'סמן את מה שמתאים לך';
      if (cta) cta.style.display = 'none';
    }
  }


  // ──────────────────────────────────────────
  // 3. PRODUCTION JOURNEY (Progress Steps)
  // ──────────────────────────────────────────
  function renderProgressBar(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const {
      steps = [
        { label: 'בחירת חבילה',                   active: true  },
        { label: 'פגישת אפיון (30 דקות, חינם)',   active: false },
        { label: 'הקלטה באולפן',                   active: false },
        { label: 'מיקס + מאסטרינג (48 שעות)',     active: false },
        { label: 'הפצה לכל הפלטפורמות',           active: false },
        { label: 'קידום ודוחות חודשיים',           active: false }
      ],
      stat = '87% מהלקוחות מסיימים תוך 14 יום'
    } = options;

    const activeIdx = steps.findIndex(s => s.active);

    el.innerHTML = `
      <div style="
        background:#fff; border:1px solid #E8E8E8;
        border-radius:12px; padding:24px 22px;
        font-family:'Heebo',sans-serif; direction:rtl;
        max-width:380px;
      ">
        <div style="font-size:0.75rem; font-weight:700; color:#7A7A7A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:18px;">
          מסלול ההפקה
        </div>

        ${steps.map((s, i) => {
          const isDone   = i < activeIdx;
          const isActive = s.active;
          return `
            <div style="display:flex; align-items:flex-start; gap:14px; margin-bottom:0;">
              <div style="display:flex; flex-direction:column; align-items:center; flex-shrink:0;">
                <div style="
                  width:24px; height:24px; border-radius:50%;
                  background:${isActive ? '#8B0000' : isDone ? '#000' : '#F0F0F0'};
                  border:1px solid ${isActive ? '#8B0000' : isDone ? '#000' : '#E8E8E8'};
                  display:flex; align-items:center; justify-content:center;
                  font-size:10px; color:${isActive || isDone ? '#fff' : '#AAAAAA'};
                  font-weight:800;
                ">${isDone ? SVG.check : i + 1}</div>
                ${i < steps.length - 1
                  ? `<div style="width:1px; height:22px; background:${isDone ? '#000' : '#E8E8E8'};"></div>`
                  : ''}
              </div>
              <span style="
                font-size:0.85rem;
                color:${isActive ? '#000' : isDone ? '#7A7A7A' : '#AAAAAA'};
                font-weight:${isActive ? '700' : '400'};
                padding-bottom:${i < steps.length - 1 ? '22px' : '0'};
                padding-top:3px;
              ">
                ${s.label}
                ${isActive ? `<span style="color:#8B0000; font-size:0.75rem; font-weight:700;"> — אתה כאן</span>` : ''}
              </span>
            </div>
          `;
        }).join('')}

        ${stat ? `
          <div style="
            border-top:1px solid #F5F5F5; margin-top:16px; padding-top:14px;
            font-size:0.8rem; color:#7A7A7A; text-align:center;
          ">${stat}</div>
        ` : ''}
      </div>
    `;
  }


  // ──────────────────────────────────────────
  // 4. IDENTITY SELECTOR
  // ──────────────────────────────────────────
  function renderIdentitySelector(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const { audience = 'singer' } = options;

    const profiles = {
      singer: [
        { label: 'אני רוצה לנסות',        desc: 'הצעד הראשון',                           pkg: 'המסלול הבסיסי', price: 990   },
        { label: 'אני מוכן לפרוץ',         desc: 'לקריירה רצינית',                        pkg: 'מסלול הלהיט',  price: 1480, featured: true },
        { label: 'הפקה מלאה',               desc: 'ראש שקט, תוצאה מקסימלית',              pkg: 'All-In',       price: 2380  }
      ],
      barmitzvah: [
        { label: 'שיר מרגש ופשוט',          desc: 'רגע מושלם על הבמה',                    pkg: 'בסיסי',  price: 990  },
        { label: 'כוכב על הבמה',            desc: 'שיר + צילום + זיכרון לכל החיים',      pkg: 'Silver', price: 1480, featured: true },
        { label: 'חוויה מלאה',              desc: 'קליפ + שיר + כל המעטפת',              pkg: 'VIP',    price: 2380  }
      ],
      podcast: [
        { label: 'פרק ראשון',               desc: 'לבדוק את השוק',                        pkg: 'פרק בודד', price: 890  },
        { label: 'לצמוח',                   desc: '4 פרקים לתחילת דרך',                  pkg: '4 פרקים', price: 2800, featured: true },
        { label: 'פודקאסטר רציני',          desc: '12 פרקים + ליווי + הפצה',             pkg: 'Premium', price: 6900  }
      ],
      dj: [
        { label: 'מסיבה כיפית',             desc: 'אנרגיה טובה',                         pkg: 'בסיסי', price: 2500  },
        { label: 'אירוע רציני',             desc: 'ריקודים ורגעים לא נשכחים',            pkg: 'Gold',  price: 4200, featured: true },
        { label: 'חתונה / בר מצווה VIP',   desc: 'מושלם עד הפרט',                       pkg: 'VIP',   price: 6800  }
      ]
    };

    const profs = profiles[audience] || profiles.singer;

    el.innerHTML = `
      <div style="
        background:#fff; border:1px solid #E8E8E8;
        border-radius:12px; padding:24px 22px;
        font-family:'Heebo',sans-serif; direction:rtl;
        max-width:440px;
      ">
        <div style="font-size:0.75rem; font-weight:700; color:#7A7A7A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px;">
          מה מתאים לך?
        </div>

        ${profs.map(p => `
          <div style="
            display:flex; align-items:center; gap:14px;
            padding:14px; margin-bottom:8px; border-radius:10px;
            background:#fff;
            border:${p.featured ? '1px solid #8B0000' : '1px solid #E8E8E8'};
            cursor:pointer;
            transition:border-color 0.15s ease, background 0.15s ease;
          "
          onmouseover="this.style.background='#FAFAFA'; this.style.borderColor='#8B0000';"
          onmouseout="this.style.background='#fff'; this.style.borderColor='${p.featured ? '#8B0000' : '#E8E8E8'}';"
          onclick="window.open('https://wa.me/${WA}?text=${encodeURIComponent('היי יקיר, אני מחפש ' + p.label + ' — אשמח לשמוע על ' + p.pkg)}', '_blank')"
          >
            <div style="flex:1;">
              <div style="
                font-weight:800; font-size:0.9rem;
                color:${p.featured ? '#8B0000' : '#000'};
                margin-bottom:2px;
              ">${p.label}</div>
              <div style="font-size:0.8rem; color:#7A7A7A;">${p.desc}</div>
            </div>
            <div style="text-align:left; flex-shrink:0;">
              <div style="font-weight:900; font-size:1rem; color:#000;">
                ${CUR}${p.price.toLocaleString()}
              </div>
              <div style="font-size:0.72rem; color:#AAAAAA;">${p.pkg}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }


  // ──────────────────────────────────────────
  // 5. PACKAGE CARDS — Bento Decoy Effect
  // ──────────────────────────────────────────
  function renderPackageCards(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const packages = (CFG.packages && CFG.packages.length > 0) ? CFG.packages : [
      {
        id: 'basic', name: 'המסלול הבסיסי',
        subtitle: 'סאונד מקצועי. בלי תוספות.',
        price: 990, marketValue: 1800,
        features: ['הקלטה עד שעתיים', 'מיקס ומאסטרינג', 'תיקון זיופים', 'WAV + MP3'],
        paymentLink: 'https://mrng.to/az6dR8yZoH',
        isPopular: false, badge: null,
        waText: 'היי יקיר, אשמח לשמוע עוד על המסלול הבסיסי (₪990)'
      },
      {
        id: 'silver', name: 'מסלול הלהיט',
        subtitle: '80% מהאמנים בוחרים זה.',
        price: 1480, marketValue: 2600,
        features: ['הקלטה ללא הגבלה', 'Pitch Correction ידני', 'מיקס אנלוגי + מאסטרינג', 'ייעוץ אמנותי', 'צילומי סטילס'],
        paymentLink: 'https://mrng.to/bEmvs34vnj',
        isPopular: true, badge: 'הנבחר',
        waText: 'היי יקיר, ראיתי את מסלול הלהיט (₪1,480) — אשמח לשמוע איך מתחילים'
      },
      {
        id: 'vip', name: 'All-In',
        subtitle: 'הפקה מלאה. ראש שקט.',
        price: 2380, marketValue: 4800,
        features: ['כל מה שב-להיט', 'קליפ לייב (2 זוויות)', 'הפצה ל-40+ פלטפורמות', '3 Reels מוכנים', 'קידום ראשוני'],
        paymentLink: 'https://mrng.to/R1nx1cDPdZ',
        isPopular: false, badge: 'הכל כלול',
        waText: 'היי יקיר, ראיתי את חבילת ה-All-In (₪2,380) — אשמח לשמוע עוד'
      }
    ];

    const { heading = '' } = options;

    el.innerHTML = `
      ${heading ? `
        <div style="
          font-size:0.75rem; font-weight:700; color:#7A7A7A;
          letter-spacing:0.1em; text-transform:uppercase;
          text-align:center; margin-bottom:20px;
          font-family:'Heebo',sans-serif; direction:rtl;
        ">${heading}</div>
      ` : ''}

      <div class="bento bento--3" style="
        font-family:'Heebo',sans-serif; direction:rtl;
      ">
        ${packages.map(pkg => {
          const savings = (pkg.marketValue || 0) - pkg.price;
          return `
            <div
              class="bento-cell bento-cell--pkg${pkg.isPopular ? ' is-popular' : ''}"
              onclick="window.open('${pkg.paymentLink}', '_blank')"
              style="cursor:pointer;"
            >
              ${pkg.badge ? `
                <div style="
                  display:inline-block;
                  background:${pkg.isPopular ? '#8B0000' : '#000'};
                  color:#fff; font-size:0.7rem; font-weight:700;
                  padding:3px 10px; border-radius:4px;
                  margin-bottom:14px; letter-spacing:0.04em;
                ">${pkg.badge}</div>
              ` : '<div style="height:22px; margin-bottom:14px;"></div>'}

              ${pkg.marketValue ? `
                <div style="font-size:0.78rem; color:#AAAAAA; text-decoration:line-through; margin-bottom:2px;">
                  ${CUR}${pkg.marketValue.toLocaleString()}
                </div>
              ` : ''}

              <div style="font-size:1.9rem; font-weight:900; color:#000; letter-spacing:-0.03em; line-height:1;">
                ${CUR}${pkg.price.toLocaleString()}
              </div>

              ${savings > 0 ? `
                <div style="font-size:0.75rem; color:#8B0000; font-weight:700; margin-top:2px; margin-bottom:10px;">
                  חיסכון ${CUR}${savings.toLocaleString()}
                </div>
              ` : '<div style="margin-bottom:10px;"></div>'}

              <div style="font-size:1rem; font-weight:800; color:#000; margin-bottom:3px;">
                ${pkg.name}
              </div>
              <div style="font-size:0.8rem; color:#7A7A7A; margin-bottom:18px; line-height:1.4;">
                ${pkg.subtitle}
              </div>

              <ul style="list-style:none; margin-bottom:20px; padding:0;">
                ${pkg.features.map(f => `
                  <li style="
                    display:flex; align-items:flex-start; gap:8px;
                    padding:6px 0; border-bottom:1px solid #F5F5F5;
                    font-size:0.83rem; color:#444;
                  ">
                    <span style="color:#000; flex-shrink:0; margin-top:1px;">${SVG.check}</span>
                    ${f}
                  </li>
                `).join('')}
              </ul>

              <div style="
                background:${pkg.isPopular ? '#8B0000' : '#000'};
                color:#fff; text-align:center;
                padding:12px; border-radius:8px;
                font-weight:700; font-size:0.88rem;
                letter-spacing:0.02em;
              ">
                ${COPY.ctaPayment || 'לתשלום מאובטח'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }


  // ──────────────────────────────────────────
  // 6. UPSELL POPUP (minimal)
  // ──────────────────────────────────────────
  function showUpsell(options = {}) {
    if (document.getElementById('yk-upsell-overlay')) return;

    const {
      title       = 'שדרוג אחד שישנה הכל',
      description = '',
      price       = '',
      ctaText     = 'כן, הוסף לי',
      ctaUrl      = '#',
      declineText = 'לא תודה'
    } = options;

    const overlay = document.createElement('div');
    overlay.id = 'yk-upsell-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0;
      background:rgba(0,0,0,0.5);
      z-index:10001;
      display:flex; align-items:center; justify-content:center;
      backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
    `;

    overlay.innerHTML = `
      <div style="
        background:#fff; border-radius:12px; padding:28px;
        max-width:360px; width:92%; text-align:center;
        font-family:'Heebo',sans-serif; direction:rtl;
        box-shadow:0 20px 50px rgba(0,0,0,0.2);
      ">
        <h3 style="font-size:1.1rem; font-weight:800; color:#000; margin-bottom:8px;">${title}</h3>
        ${description ? `<p style="font-size:0.87rem; color:#7A7A7A; margin-bottom:8px; line-height:1.5;">${description}</p>` : ''}
        ${price ? `<p style="font-size:1.3rem; font-weight:900; color:#8B0000; margin-bottom:20px;">${price}</p>` : '<div style="margin-bottom:20px;"></div>'}

        <a href="${ctaUrl}" target="_blank" style="
          display:block; background:#8B0000; color:#fff;
          padding:13px; border-radius:8px; font-weight:700;
          text-decoration:none; margin-bottom:10px; font-size:0.9rem;
          letter-spacing:0.02em;
        ">${ctaText}</a>

        <button onclick="document.getElementById('yk-upsell-overlay').remove()" style="
          background:none; border:none; color:#AAAAAA; cursor:pointer;
          font-size:0.82rem; font-family:'Heebo',sans-serif;
        ">${declineText}</button>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }


  // ──────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────
  return {
    renderComparison,
    renderFitQuiz,
    renderProgressBar,
    renderIdentitySelector,
    renderPackageCards,
    showUpsell,
    _updateQuiz
  };

})();
