/* ============================================
   upsells.js v3 — Upsells לפי קטגוריה
   יקיר כהן הפקות

   עקרונות v3:
   • קורא מ-YK_CONFIG.upsells (5 לכל קטגוריה)
   • Bento Cards: white / black / #8B0000
   • SVG Line Icons בלבד — אפס אמוג'ים
   • Add-to-cart דרך YK_Cart.addItem / WA fallback
   ============================================ */

const YK_Upsells = (function () {
  'use strict';

  const CFG  = window.YK_CONFIG || {};
  const S    = CFG.studio       || {};
  const WA   = S.whatsapp       || '972587555456';
  const CUR  = S.currency       || '₪';

  // ──────────────────────────────────────────
  // SVG Line Icon Library
  // ──────────────────────────────────────────
  const ICONS = {
    sliders:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
    layers:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    globe:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    fileText:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    video:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    home:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    book:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    monitor:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    gift:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
    scissors:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    camera:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    palette:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    smartphone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    drum:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-3"/><ellipse cx="12" cy="9" rx="10" ry="5"/><path d="M2 9v9"/><path d="M22 9v9"/><path d="M9 12l2-3 4 6"/></svg>`,
    mic:        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    zap:        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    star:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    plus:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    check:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    music:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
  };

  function _icon(id) {
    return ICONS[id] || ICONS.music;
  }

  // ──────────────────────────────────────────
  // _addToCart — YK_Cart.addItem with WA fallback
  // ──────────────────────────────────────────
  function _addToCart(item) {
    if (window.YK_Cart && typeof YK_Cart.addItem === 'function') {
      YK_Cart.addItem({
        id:    item.id,
        name:  item.title,
        price: item.price,
        category: 'upsell',
        waText: item.waText
      });
    } else {
      const text = item.waText || `אשמח להוסיף ${item.title} (${CUR}${item.price ? item.price.toLocaleString() : ''})`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank');
    }
  }


  // ──────────────────────────────────────────
  // renderUpsells
  // Reads from CFG.upsells[category] (v3 config)
  // ──────────────────────────────────────────
  function renderUpsells(containerId, category, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const items = (CFG.upsells && CFG.upsells[category]) || [];
    if (items.length === 0) return;

    const { heading = 'תוספות מומלצות' } = options;

    // Build DOM
    const wrap = document.createElement('div');
    wrap.style.cssText = 'font-family:\'Heebo\',sans-serif; direction:rtl;';

    if (heading) {
      const h = document.createElement('div');
      h.style.cssText = 'font-size:1rem; font-weight:800; color:#000; margin-bottom:16px; letter-spacing:0.02em;';
      h.textContent = heading;
      wrap.appendChild(h);
    }

    const grid = document.createElement('div');
    grid.style.cssText = `
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));
      gap:12px;
    `;

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'upsell-card';
      card.dataset.id = item.id;
      card.style.cssText = `
        background:#fff;
        border:1px solid #E8E8E8;
        border-radius:12px;
        padding:18px;
        cursor:pointer;
        transition:border-color 0.2s ease, box-shadow 0.2s ease;
        position:relative;
      `;

      card.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px;">
          <span style="color:#8B0000; flex-shrink:0; margin-top:1px;">${_icon(item.iconId)}</span>
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; font-size:0.9rem; color:#000; line-height:1.35; margin-bottom:4px;">
              ${item.title}
            </div>
            <div style="font-size:0.8rem; color:#7A7A7A; line-height:1.5;">
              ${item.desc}
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span style="font-size:0.92rem; font-weight:800; color:#000;">
            ${CUR}${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
          </span>
          <button class="upsell-add-btn" data-upsell-id="${item.id}" style="
            background:#8B0000; color:#fff;
            border:none; border-radius:6px;
            padding:7px 14px;
            font-size:0.78rem; font-weight:700;
            cursor:pointer; display:flex; align-items:center; gap:5px;
            font-family:'Heebo',sans-serif;
            transition:background 0.15s ease;
            white-space:nowrap;
          ">
            <span style="display:inline-flex;">${ICONS.plus}</span>
            הוסף לסל
          </button>
        </div>
        <div class="upsell-added-badge" style="
          display:none; position:absolute; inset:0;
          background:rgba(255,255,255,0.92);
          border-radius:12px; align-items:center; justify-content:center;
          font-weight:700; font-size:0.88rem; color:#000;
          gap:6px;
        ">
          <span style="color:#8B0000; display:inline-flex;">${ICONS.check}</span>
          נוסף לסל
        </div>
      `;

      // Hover
      card.addEventListener('mouseenter', () => {
        card.style.borderColor = '#8B0000';
        card.style.boxShadow = '0 4px 16px rgba(139,0,0,0.08)';
      });
      card.addEventListener('mouseleave', () => {
        if (!card.dataset.added) {
          card.style.borderColor = '#E8E8E8';
          card.style.boxShadow = 'none';
        }
      });

      // Add button
      const btn = card.querySelector('.upsell-add-btn');
      btn.addEventListener('mouseenter', () => { btn.style.background = '#6B0000'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = '#8B0000'; });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        _addToCart(item);
        _flashAdded(card, btn);
      });

      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    el.innerHTML = '';
    el.appendChild(wrap);
  }

  function _flashAdded(card, btn) {
    card.dataset.added = '1';
    card.style.borderColor = '#8B0000';

    const badge = card.querySelector('.upsell-added-badge');
    if (badge) {
      badge.style.display = 'flex';
      setTimeout(() => {
        badge.style.display = 'none';
        card.dataset.added = '';
        card.style.borderColor = '#E8E8E8';
        card.style.boxShadow = 'none';
        btn.style.background = '#8B0000';
      }, 1800);
    }
  }


  // ──────────────────────────────────────────
  // renderUpsellSection (legacy compat)
  // Maps old 2-arg call to new renderUpsells
  // ──────────────────────────────────────────
  function renderUpsellSection(containerId, category, _section, options) {
    renderUpsells(containerId, category, options);
  }


  // ──────────────────────────────────────────
  // renderYakirIntro — Bento minimal v3
  // ──────────────────────────────────────────
  function renderYakirIntro(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const monthNames    = S.monthNames || ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
    const month         = options.currentMonth || monthNames[new Date().getMonth()];
    const experience    = options.experience   || S.experience          || '20 שנה';
    const maxPerMonth   = options.maxPerMonth  || S.maxMonthlyProjects  || 8;
    const spotsLeft     = options.spotsLeft    || 3;
    const ctaText       = options.ctaText      || 'קבע שיחת ייעוץ';
    const ctaUrl        = options.ctaUrl       || `https://wa.me/${WA}?text=${encodeURIComponent('היי יקיר, אשמח לשיחת ייעוץ קצרה')}`;

    el.innerHTML = `
      <div style="
        border:1px solid #E8E8E8;
        border-radius:12px; padding:28px 22px;
        background:#fff; font-family:'Heebo',sans-serif; direction:rtl;
      ">
        <div style="font-size:0.75rem; font-weight:700; color:#7A7A7A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px;">
          יקיר כהן
        </div>
        <p style="font-size:0.9rem; color:#222; line-height:1.65; margin-bottom:14px;">
          אחרי ${experience} בתעשייה, למדתי שהפרש בין שיר טוב לשיר מושלם הוא לא ציוד — זה זמן ויחס אישי.
        </p>
        <p style="font-size:0.85rem; color:#7A7A7A; line-height:1.6; margin-bottom:18px;">
          לכן אני מקבל מקסימום ${maxPerMonth} פרויקטים בחודש.
        </p>

        <div style="
          display:flex; align-items:center; gap:8px;
          border:1px solid #E8E8E8; border-radius:8px;
          padding:10px 14px; margin-bottom:18px;
          font-size:0.82rem; color:#000; font-weight:600;
        ">
          <span style="color:#8B0000;">${ICONS.star}</span>
          נשארו ${spotsLeft} מקומות לסבב ${month}
        </div>

        <a href="${ctaUrl}" target="_blank" style="
          display:block; background:#8B0000; color:#fff;
          text-align:center; padding:12px; border-radius:8px;
          font-weight:700; font-size:0.9rem; text-decoration:none;
          letter-spacing:0.02em;
        ">${ctaText}</a>
      </div>
    `;
  }


  // ──────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────
  return {
    renderUpsells,
    renderUpsellSection,
    renderYakirIntro,
    ICONS
  };

})();
