/* ============================================
   psychology.js v3 — טריגרים פסיכולוגיים
   יקיר כהן הפקות

   עקרונות v3:
   • אפס מספרים רנדומליים — כל הנתונים אמיתיים/קבועים
   • Exit Intent: פעם אחת בסשן, לא אם התחיל checkout
   • Notifications: פעם אחת בסשן, אחרי 2 דקות
   • עיצוב Extreme Minimalism: white / black / #8B0000
   • אפס אמוג'י — SVG Line Icons בלבד
   ============================================ */

const YK_Psychology = (function () {
  'use strict';

  const CFG  = window.YK_CONFIG || {};
  const S    = CFG.studio       || {};
  const COPY = CFG.copy         || {};

  const CONFIG = {
    waNumber:            S.whatsapp             || '972587555456',
    voucherUrl:          S.voucherUrl           || 'https://voucher.yakircohen.com/',
    monthNames:          S.monthNames           || ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
    maxSlotsPerMonth:    S.maxMonthlyProjects   || 8,
    exitPopupDelay:      5000,
    voucherAmount:       COPY.voucherAmount     || 200,
    notifDelay:          CFG.notificationDelay  || 120000,
    maxNotifs:           CFG.maxNotificationsPerSession || 1
  };

  // Shared SVG icons (line icons, stroke only)
  const ICONS = {
    check:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    shield:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    clock:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    x:        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    close:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
  };


  // ============================================
  // 1. SCARCITY — Availability Widget
  //    קבועים בלבד, ללא מספרים רנדומליים
  // ============================================
  function renderAvailability(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const now        = new Date();
    const monthName  = CONFIG.monthNames[now.getMonth()];
    const nextMonth  = CONFIG.monthNames[(now.getMonth() + 1) % 12];
    const maxSlots   = options.maxSlots   || CONFIG.maxSlotsPerMonth; // 8
    const remaining  = options.remaining  || 3;                       // קבוע, אמיתי
    const booked     = maxSlots - remaining;
    const fillPct    = Math.round((booked / maxSlots) * 100);

    const isUrgent   = remaining <= 2;

    el.innerHTML = `
      <div style="
        border: 1px solid ${isUrgent ? '#8B0000' : '#E8E8E8'};
        border-radius: 12px;
        padding: 20px 22px;
        background: #fff;
        font-family: 'Heebo', sans-serif;
        direction: rtl;
      ">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
          <span style="color:#8B0000;">${ICONS.calendar}</span>
          <span style="font-size:0.82rem; font-weight:700; color:#000; letter-spacing:0.03em;">
            זמינות ${monthName} ${now.getFullYear()}
          </span>
        </div>

        <div style="
          background:#F5F5F5; height:6px; border-radius:20px; overflow:hidden; margin-bottom:12px;
        ">
          <div id="yk-avail-bar" style="
            height:100%; width:0%; border-radius:20px;
            background:#8B0000;
            transition: width 1.4s cubic-bezier(0.4,0,0.2,1);
          " data-fill="${fillPct}"></div>
        </div>

        <div style="font-size:1rem; font-weight:800; color:#000; margin-bottom:4px;">
          ${remaining === 1
            ? `מקום אחד אחרון לסבב ${monthName}`
            : `נשארו ${remaining} מקומות לסבב ${monthName}`
          }
        </div>
        <div style="font-size:0.78rem; color:#7A7A7A;">
          ${isUrgent
            ? `ל${nextMonth} כבר מתחילים להירשם`
            : `${booked} מתוך ${maxSlots} הוזמנו החודש`
          }
        </div>
      </div>
    `;

    // Animate bar after paint
    requestAnimationFrame(() => {
      const bar = el.querySelector('#yk-avail-bar');
      if (bar) setTimeout(() => { bar.style.width = bar.dataset.fill + '%'; }, 80);
    });
  }


  // ============================================
  // 2. URGENCY — Cost of Waiting
  //    עיצוב minimal: black cell, dark red CTA
  // ============================================
  function renderUrgencyBlock(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const { audience = 'singer' } = options;

    const waUrl = `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(
      COPY.waPreFillDefault || 'היי יקיר, אשמח לשמוע עוד'
    )}`;

    const content = {
      singer: {
        heading: 'מה יקרה אם תחכה עוד חודש?',
        pains: [
          'עוד 30 שירים של מתחרים יעלו לספוטיפיי',
          'עוד 5 אירועים ייסגרו בלעדיך',
          'עוד 1,000 צפיות פוטנציאליות יאבדו'
        ],
        win: 'מתחילים עכשיו — ובעוד 14 יום השיר שלך כבר מתנגן'
      },
      barmitzvah: {
        heading: 'למה לא כדאי לחכות?',
        pains: [
          'התאריכים הטובים נתפסים חודשים מראש',
          'הלחץ רק גדל ככל שמתקרבים לאירוע',
          'בלחץ הביצועים והאיכות סובלים'
        ],
        win: 'מזמינים עכשיו — בוחרים תאריך בנחת, יש שנה שלמה לנצל'
      },
      podcast: {
        heading: 'כל שבוע בלי פודקאסט',
        pains: [
          'מתחרים תפסו את הקהל שמחכה לך',
          'אלף האזנות שלא יחזרו',
          'אמינות דיגיטלית שמתפוררת'
        ],
        win: 'פרק ראשון יכול לצאת השבוע הבא — תקבע פגישה'
      },
      dj: {
        heading: 'האירוע מתקרב...',
        pains: [
          'DJ שזמין ברגע האחרון — לא מספיק תפוס',
          'בלי תיאום מראש אין פלייליסט מותאם',
          'מחיר עולה ב-20-30% ככל שהתאריך קרוב'
        ],
        win: 'סוגרים עכשיו — מתאמים הכל בנחת, בלי הפתעות'
      }
    };

    const msg = content[audience] || content.singer;

    el.innerHTML = `
      <div style="
        background:#000; color:#fff;
        border-radius:12px; padding:28px 24px;
        font-family:'Heebo',sans-serif; direction:rtl;
        max-width:480px;
      ">
        <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:16px; color:#fff;">
          ${msg.heading}
        </h3>

        <div style="margin-bottom:18px;">
          ${msg.pains.map(p => `
            <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:10px;">
              <span style="color:#8B0000; flex-shrink:0; margin-top:2px;">${ICONS.x}</span>
              <span style="font-size:0.88rem; color:#CCC; line-height:1.5;">${p}</span>
            </div>
          `).join('')}
        </div>

        <div style="
          border-right:2px solid #8B0000;
          padding:10px 14px; margin-bottom:20px;
          background:rgba(139,0,0,0.08); border-radius:0 6px 6px 0;
        ">
          <span style="color:#8B0000; font-size:0.88rem; font-weight:700;">${msg.win}</span>
        </div>

        <a href="${waUrl}" target="_blank" style="
          display:block; background:#8B0000; color:#fff;
          text-align:center; padding:14px; border-radius:8px;
          font-weight:700; font-size:0.95rem; text-decoration:none;
          letter-spacing:0.02em;
        ">אני בוחר להתחיל עכשיו</a>
      </div>
    `;
  }


  // ============================================
  // 3. EXIT INTENT POPUP
  //    — פעם אחת בסשן בלבד
  //    — לא מציג אם התחיל checkout
  //    — ללא countdown (לא מלחיץ)
  // ============================================
  function initExitPopup(options = {}) {
    // Session guards
    if (sessionStorage.getItem('yk_exit_shown')) return;

    const {
      title      = COPY.exitTitle    || 'לפני שאתה הולך',
      subtitle   = COPY.exitSubtitle || 'קח את המדריך בחינם:',
      gifts      = [
        { text: 'מדריך: "5 הטעויות שהורסות שירים" (PDF)' },
        { text: 'צ׳ק-ליסט: "האם האולפן מתאים לך?"' },
        { text: 'דוגמת עריכה: שלח קובץ ונחזיר ערוך' }
      ],
      ctaText    = COPY.exitCta || 'קבל את המדריך',
      ctaUrl     = `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent('היי יקיר, אשמח לקבל את המדריך בחינם')}`,
      disclaimer = 'בלי התחייבות. פשוט מתנה.',
      delay      = CONFIG.exitPopupDelay
    } = options;

    let shown = false;
    let ready = false;

    setTimeout(() => { ready = true; }, delay);

    const _maybeShow = () => {
      if (shown || !ready) return;
      if (sessionStorage.getItem('yk_checkout_started')) return;
      shown = true;
      sessionStorage.setItem('yk_exit_shown', '1');
      _showPopup();
    };

    // Desktop: genuine tab-direction exit
    const handleMouseLeave = (e) => {
      if (e.clientY <= 20 && e.movementY < 0) _maybeShow();
    };

    // Mobile: fast scroll up near top
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const delta = lastScrollY - window.scrollY;
      if (delta > 120 && window.scrollY < 200) _maybeShow();
      lastScrollY = window.scrollY;
    };

    const _showPopup = () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);

      const overlay = document.createElement('div');
      overlay.id = 'yk-exit-overlay';
      overlay.style.cssText = `
        position:fixed; inset:0;
        background:rgba(0,0,0,0.55);
        z-index:10000;
        display:flex; align-items:center; justify-content:center;
        animation:ykFadeIn 0.3s ease;
        backdrop-filter:blur(4px);
        -webkit-backdrop-filter:blur(4px);
      `;

      overlay.innerHTML = `
        <div style="
          background:#fff;
          border-radius:16px;
          padding:32px 28px;
          max-width:400px; width:92%;
          text-align:center;
          font-family:'Heebo',sans-serif;
          direction:rtl;
          position:relative;
          box-shadow:0 24px 60px rgba(0,0,0,0.25);
          animation:ykSlideUp 0.35s ease;
        ">
          <button id="yk-exit-close" aria-label="סגור" style="
            position:absolute; top:14px; left:14px;
            background:#F5F5F5; border:none; border-radius:50%;
            width:32px; height:32px; cursor:pointer;
            display:flex; align-items:center; justify-content:center;
            color:#555;
          ">${ICONS.close}</button>

          <div style="
            display:inline-block; background:#000; color:#fff;
            padding:4px 14px; border-radius:4px;
            font-size:0.75rem; font-weight:700; letter-spacing:0.06em;
            margin-bottom:16px;
          ">בחינם</div>

          <h3 style="font-size:1.25rem; font-weight:900; color:#000; margin-bottom:6px;">
            ${title}
          </h3>
          <p style="font-size:0.88rem; color:#7A7A7A; margin-bottom:20px;">
            ${subtitle}
          </p>

          <div style="text-align:right; margin-bottom:20px;">
            ${gifts.map(g => `
              <div style="
                display:flex; align-items:center; gap:10px;
                padding:9px 0; border-bottom:1px solid #F0F0F0;
                font-size:0.85rem; color:#222;
              ">
                <span style="color:#8B0000; flex-shrink:0;">${ICONS.check}</span>
                <span>${g.text}</span>
              </div>
            `).join('')}
          </div>

          <a href="${ctaUrl}" target="_blank" style="
            display:block; background:#8B0000; color:#fff;
            padding:14px; border-radius:8px; font-weight:700;
            font-size:0.95rem; text-decoration:none;
            margin-bottom:10px; letter-spacing:0.02em;
          ">${ctaText}</a>

          <p style="font-size:0.75rem; color:#AAAAAA;">${disclaimer}</p>
        </div>
      `;

      document.body.appendChild(overlay);

      document.getElementById('yk-exit-close').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
  }


  // ============================================
  // 4. LIVE ACTIVITY NOTIFICATIONS
  //    — פעם אחת בסשן (sessionStorage)
  //    — רק אחרי notifDelay (ברירת מחדל 2 דק)
  //    — פורמט: { text, minutesAgo }
  // ============================================
  function initLiveNotifications() {
    if (sessionStorage.getItem('yk_notif_shown')) return;

    const messages = (CFG.liveNotifications || []);
    if (messages.length === 0) return;

    const delay = CONFIG.notifDelay;

    setTimeout(() => {
      // Don't show if exit overlay is open
      if (document.getElementById('yk-exit-overlay')) return;
      if (sessionStorage.getItem('yk_checkout_started')) return;

      sessionStorage.setItem('yk_notif_shown', '1');
      _showNotif(messages[0]);
    }, delay);
  }

  function _showNotif(msg) {
    if (!msg) return;

    const text = msg.text || '';
    const ago  = msg.minutesAgo ? `לפני ${msg.minutesAgo} דקות` : '';

    const notif = document.createElement('div');
    notif.id = 'yk-live-notif';
    notif.style.cssText = `
      position:fixed;
      bottom:110px; right:20px;
      background:#fff;
      border:1px solid #E8E8E8;
      border-right:3px solid #8B0000;
      border-radius:10px;
      padding:12px 16px;
      box-shadow:0 4px 20px rgba(0,0,0,0.08);
      font-family:'Heebo',sans-serif;
      direction:rtl;
      z-index:998;
      max-width:270px;
      transform:translateX(calc(100% + 30px));
      opacity:0;
      transition:transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
    `;

    notif.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
        <span style="color:#8B0000; flex-shrink:0;">${ICONS.clock}</span>
        <span style="font-size:0.82rem; font-weight:700; color:#000; line-height:1.4;">
          ${text}
        </span>
      </div>
      ${ago ? `<div style="font-size:0.72rem; color:#AAAAAA; padding-right:22px;">${ago}</div>` : ''}
    `;

    document.body.appendChild(notif);

    // Slide in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      notif.style.transform = 'translateX(0)';
      notif.style.opacity   = '1';
    }));

    // Slide out after 5.5s
    setTimeout(() => {
      notif.style.transform = 'translateX(calc(100% + 30px))';
      notif.style.opacity   = '0';
      setTimeout(() => notif.remove(), 500);
    }, 5500);
  }


  // ============================================
  // 5. GUARANTEE STRIP
  //    — ביטוח יצירתי — minimal Bento style
  // ============================================
  function renderGuarantee(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const items = options.items || [
      { text: COPY.guarantee || 'לא מרוצה מהסאונד — לא משלמים על המיקס.' },
      { text: 'תיקונים ושינויים כלולים עד שאתה מרוצה' },
      { text: 'שינוי כיוון אמנותי? נסתדר ביחד' },
      { text: 'דחוף לך? נעדיף אותך על פני שאר ההזמנות' }
    ];

    const title = options.title || COPY.guaranteeTitle || 'הביטוח היצירתי';

    el.innerHTML = `
      <div style="
        border:1px solid #E8E8E8;
        border-radius:12px; padding:24px 22px;
        background:#fff;
        font-family:'Heebo',sans-serif; direction:rtl;
      ">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
          <span style="color:#8B0000;">${ICONS.shield}</span>
          <span style="font-size:0.95rem; font-weight:800; color:#000;">${title}</span>
        </div>

        ${items.map(i => `
          <div style="
            display:flex; align-items:flex-start; gap:12px;
            padding:10px 0; border-bottom:1px solid #F5F5F5;
          ">
            <span style="
              background:#000; color:#fff;
              width:20px; height:20px; border-radius:50%;
              display:flex; align-items:center; justify-content:center;
              flex-shrink:0; margin-top:2px;
            ">${ICONS.check}</span>
            <span style="font-size:0.88rem; color:#222; line-height:1.5;">${i.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }


  // ============================================
  // PUBLIC API
  // ============================================
  return {
    renderAvailability,
    renderUrgencyBlock,
    renderGuarantee,
    initExitPopup,
    initLiveNotifications,
    CONFIG
  };

})();
