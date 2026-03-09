/* ============================================
   cart.js v4 — Lead Report Cart
   יקיר כהן הפקות

   v4 חידושים:
   • Lead Report מפורט — שם, טלפון, חבילה, upsells, לינק
   • Validation: שם + טלפון חובה לפני תשלום
   • Confirmation Toast: 2 שניות לפני מעבר ל-Morning
   • Email זהה לדוח WA (Web3Forms)
   • addItem תומך ב-object API ו-legacy API
   • חלוקה: package items vs. upsell items
   ============================================ */

const YK_Cart = (function () {
  'use strict';

  const CFG  = window.YK_CONFIG || {};
  const S    = CFG.studio       || {};
  const COPY = CFG.copy         || {};
  const W3F  = CFG.web3forms    || {};

  const WA          = S.whatsapp || '972587555456';
  const CUR         = S.currency  || '₪';
  const STORAGE_KEY = 'yk_cart_v3';

  // Payment links — match config.js packages
  const PAYMENT_LINKS = {
    basic:  (CFG.packages || []).find(p => p.id === 'basic')?.paymentLink  || 'https://mrng.to/az6dR8yZoH',
    silver: (CFG.packages || []).find(p => p.id === 'silver')?.paymentLink || 'https://mrng.to/bEmvs34vnj',
    vip:    (CFG.packages || []).find(p => p.id === 'vip')?.paymentLink    || 'https://mrng.to/R1nx1cDPdZ'
  };

  let items       = _load();
  let drawerOpen  = false;
  let customerCtx = {};      // { name, phone, category, audience }
  let _currentPayUrl = '';   // set by _updateDrawer, used by _onCheckout


  /* ─── Storage ──────────────────────────── */
  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (_) { return []; }
  }
  function _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
  }


  /* ─── Context ──────────────────────────── */
  function setContext(ctx) {
    customerCtx = Object.assign(customerCtx, ctx);
  }


  /* ─── Helper: resolve payment link ────── */
  function _getPaymentLink(id) {
    return PAYMENT_LINKS[id] || '';
  }


  /* ─── addItem — supports object or legacy (name, price, opts) ── */
  function addItem(itemOrName, price, options = {}) {
    let item;

    if (itemOrName && typeof itemOrName === 'object') {
      // v4 object API: addItem({ id, name, price, marketValue, category, waText, isPackage })
      item = {
        id:          itemOrName.id || ('item_' + Date.now()),
        name:        itemOrName.name        || '',
        price:       parseFloat(itemOrName.price)        || 0,
        marketValue: parseFloat(itemOrName.marketValue)  || 0,
        category:    itemOrName.category    || '',
        paymentLink: itemOrName.paymentLink || _getPaymentLink(itemOrName.id),
        waText:      itemOrName.waText      || '',
        isPackage:   itemOrName.isPackage !== false  // default: true
      };
      // Upsell items explicitly marked with isPackage: false
      if (itemOrName.category === 'upsell') item.isPackage = false;
    } else {
      // Legacy API: addItem('name', price, { paymentLink, category, waText, marketValue })
      item = {
        id:          Date.now(),
        name:        itemOrName || '',
        price:       parseFloat(price) || 0,
        marketValue: parseFloat(options.marketValue) || 0,
        category:    options.category    || '',
        paymentLink: options.paymentLink || '',
        waText:      options.waText      || '',
        isPackage:   options.isPackage !== false
      };
    }

    // Avoid duplicate IDs
    if (item.id && items.find(i => i.id === item.id)) {
      _flashFAB();
      openDrawer();
      return;
    }

    items.push(item);
    _save();
    _updateFAB();
    _updateDrawer();
    openDrawer();
    _flashFAB();

    document.dispatchEvent(new CustomEvent('yk:itemAdded', { detail: item }));
    document.dispatchEvent(new CustomEvent('yk:cartChanged'));
  }

  function removeItem(id) {
    // Use loose equality so string IDs ('basic') match both string and number
    items = items.filter(i => String(i.id) !== String(id));
    _save();
    _updateFAB();
    _updateDrawer();
    if (items.length === 0) closeDrawer();
    document.dispatchEvent(new CustomEvent('yk:cartChanged'));
  }

  function getTotal()       { return items.reduce((s, i) => s + (i.price || 0), 0); }
  function getMarketTotal() { return items.reduce((s, i) => s + (i.marketValue || 0), 0); }
  function getSavings()     { const m = getMarketTotal(); return m > 0 ? m - getTotal() : 0; }


  /* ─── FAB ──────────────────────────────── */
  function _updateFAB() {
    const fab = document.getElementById('yk-cart-fab');
    const lbl = document.getElementById('yk-cart-fab-count');
    if (!fab) return;
    fab.style.display = items.length > 0 ? 'block' : 'none';
    if (lbl) lbl.textContent = items.length;
  }

  function _flashFAB() {
    const btn = document.getElementById('yk-cart-fab-btn');
    if (!btn) return;
    btn.style.transform = 'scale(1.12)';
    btn.style.background = '#8B0000';
    setTimeout(() => {
      btn.style.transform = '';
      btn.style.background = '';
    }, 350);
  }


  /* ─── Drawer toggle ────────────────────── */
  function openDrawer() {
    const d = document.getElementById('yk-cart-drawer');
    if (!d) return;
    d.classList.add('is-open');
    drawerOpen = true;
  }
  function closeDrawer() {
    const d = document.getElementById('yk-cart-drawer');
    if (!d) return;
    d.classList.remove('is-open');
    drawerOpen = false;
  }
  function toggleDrawer() { drawerOpen ? closeDrawer() : openDrawer(); }


  /* ─── SVG helpers ──────────────────────── */
  const _svg = (path, w = 16, h = 16) =>
    `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  const ICONS = {
    cart:   _svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
    lock:   _svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    check:  _svg('<polyline points="20 6 9 17 4 12"/>'),
    trash:  _svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6m5 0V4h4v2"/>'),
    shield: _svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    user:   _svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    phone:  _svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.62 5c-.04-.64.44-1.19 1.07-1.29l2.92-.55a2 2 0 0 1 2 1.15l1.27 3.12a2 2 0 0 1-.46 2.22L7.09 10.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.22-.46l3.12 1.27a2 2 0 0 1 1.19 1.97z"/>')
  };


  /* ─── Payment Brand Trust Bar ──────────── */
  function _trustBar() {
    const logos = [
      `<div class="trust-icon" title="Visa">
        <svg width="38" height="13" viewBox="0 0 38 13">
          <text x="0" y="11" font-family="Arial" font-size="13" font-weight="900"
            font-style="italic" fill="#1A1F71">VISA</text>
        </svg>
      </div>`,
      `<div class="trust-icon" title="Mastercard">
        <svg width="34" height="22" viewBox="0 0 34 22">
          <circle cx="13" cy="11" r="11" fill="#EB001B"/>
          <circle cx="21" cy="11" r="11" fill="#F79E1B" opacity=".85"/>
        </svg>
      </div>`,
      `<div class="trust-icon" title="Apple Pay" style="padding:0 10px;">
        <svg width="46" height="20" viewBox="0 0 46 20">
          <text x="0" y="15" font-family="Arial" font-size="12" font-weight="600" fill="#000">&#xF8FF;</text>
          <text x="11" y="15" font-family="Arial" font-size="11" font-weight="500" fill="#000"> Pay</text>
        </svg>
      </div>`,
      `<div class="trust-icon" title="Google Pay" style="padding:0 8px;">
        <svg width="55" height="18" viewBox="0 0 55 18">
          <text x="0" y="14" font-family="Arial" font-size="11" fill="#5F6368">Google Pay</text>
        </svg>
      </div>`,
      `<div class="trust-icon" title="Bit" style="padding:0 10px;">
        <svg width="22" height="18" viewBox="0 0 22 18">
          <text x="0" y="14" font-family="Arial" font-size="12" font-weight="800" fill="#0033A0">bit</text>
        </svg>
      </div>`,
      `<div class="trust-icon" title="PayPal" style="padding:0 8px;">
        <svg width="46" height="18" viewBox="0 0 46 18">
          <text x="0" y="13" font-family="Arial" font-size="12" font-weight="800" fill="#003087">Pay</text>
          <text x="22" y="13" font-family="Arial" font-size="12" font-weight="800" fill="#009CDE">Pal</text>
        </svg>
      </div>`
    ];

    return `
      <div class="trust-bar">
        ${logos.join('')}
        <div class="trust-ssl">
          ${_svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 12, 12)}
          <span>Secure SSL Payment via Morning</span>
        </div>
      </div>
    `;
  }


  /* ─── Lead Report Builder ──────────────── */
  function _buildLeadReport() {
    const packages    = items.filter(i => i.isPackage !== false);
    const upsells     = items.filter(i => i.isPackage === false);
    const total       = getTotal();
    const savings     = getSavings();
    const upsellTotal = upsells.reduce((s, i) => s + (i.price || 0), 0);

    const name     = (customerCtx.name     || '').trim();
    const phone    = (customerCtx.phone    || '').trim();
    const category = customerCtx.category || '';
    const audience = customerCtx.audience || '';

    // Best payment link: highest-value package
    const mainPkg = [...packages].sort((a, b) => (b.price || 0) - (a.price || 0))[0]
                  || [...items].sort((a, b) => (b.price || 0) - (a.price || 0))[0];
    const payUrl  = mainPkg?.paymentLink || _getPaymentLink(mainPkg?.id) || '';

    let report = `🎯 פרויקט חדש בדרך!\n`;
    report += `─────────────────────\n\n`;

    // Customer details
    report += `👤 פרטי לקוח:\n`;
    report += `שם: ${name  || '—'}\n`;
    report += `טלפון: ${phone || '—'}\n`;
    if (category) report += `קהל יעד: ${category}\n`;
    if (audience && audience !== category) report += `פרופיל: ${audience}\n`;

    // Main package
    if (packages.length > 0) {
      report += `\n📦 החבילה שנבחרה:\n`;
      packages.forEach(p => {
        report += `${p.name} — ${CUR}${p.price.toLocaleString()}`;
        if (p.marketValue > p.price) {
          report += ` (שווי שוק ${CUR}${p.marketValue.toLocaleString()})`;
        }
        report += `\n`;
      });
    } else if (items.length > 0) {
      report += `\n📦 בחירות:\n`;
      items.forEach(i => { report += `${i.name} — ${CUR}${i.price.toLocaleString()}\n`; });
    }

    // Upsells
    if (upsells.length > 0) {
      report += `\n➕ תוספות שנבחרו:\n`;
      upsells.forEach(u => {
        report += `• ${u.name} — ${CUR}${u.price.toLocaleString()}\n`;
      });
    }

    report += `\n─────────────────────\n`;
    report += `💰 סה"כ להשקעה: ${CUR}${total.toLocaleString()}`;
    if (savings > 0) report += ` (חיסכון ${CUR}${savings.toLocaleString()})`;
    report += `\n`;

    // Payment link
    if (payUrl) {
      report += `\n✅ לינק לתשלום חבילה:\n${payUrl}\n`;
    }

    // Balance note for upsells
    if (upsellTotal > 0) {
      report += `\n⚠️ גביית הפרש: ${CUR}${upsellTotal.toLocaleString()} עבור התוספות\n`;
    }

    report += `\nיקיר, הלקוח מחכה לאישור תאריך.`;

    return { report, payUrl, total, upsellTotal, name, phone };
  }

  function _buildWAPayload() {
    return encodeURIComponent(_buildLeadReport().report);
  }


  /* ─── Web3Forms Email ──────────────────── */
  async function _sendEmail() {
    if (!W3F.enabled || !W3F.accessKey || W3F.accessKey === 'YOUR_WEB3FORMS_KEY_HERE') return;

    const { report, total } = _buildLeadReport();
    const cname = customerCtx.name || 'לקוח';

    const payload = {
      access_key:  W3F.accessKey,
      to_email:    S.email || 'yakir@yakircohen.com',
      subject:     `ליד חדש — ${cname} — ${CUR}${total.toLocaleString()}`,
      from_name:   'יקיר כהן הפקות — Website',
      message:     report,
      botcheck:    ''
    };

    try {
      await fetch(W3F.endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload)
      });
    } catch (_) { /* silent fail */ }
  }


  /* ─── Validation ───────────────────────── */
  function _validate() {
    const name  = (customerCtx.name  || '').trim();
    const phone = (customerCtx.phone || '').trim();

    if (!name) {
      _highlightField('yk-input-name', 'מלא/י שם מלא');
      return false;
    }
    if (!phone) {
      _highlightField('yk-input-phone', 'מלא/י טלפון');
      return false;
    }
    return true;
  }

  function _highlightField(id, placeholder) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor   = '#8B0000';
    el.style.boxShadow     = '0 0 0 2px rgba(139,0,0,0.15)';
    el.placeholder         = placeholder;
    el.classList.add('yk-field-shake');
    setTimeout(() => {
      el.classList.remove('yk-field-shake');
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    }, 700);
    el.focus();
  }


  /* ─── Checkout Flow ────────────────────── */
  function _onCheckout() {
    if (items.length === 0) return;
    if (!_validate()) return;

    sessionStorage.setItem('yk_checkout_started', '1');
    _sendEmail(); // async, silent
    _showOrderSummaryModal();
  }

  /* ─── Order Summary Modal (v4) ─────────── */
  function _showOrderSummaryModal() {
    const existing = document.getElementById('yk-order-modal');
    if (existing) existing.remove();

    const ld      = _buildLeadReport();
    const waUrl   = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(ld.report);
    const pkgs    = items.filter(i => i.isPackage !== false);
    const ups     = items.filter(i => i.isPackage === false);
    const savings = getSavings();
    const mkt     = getMarketTotal();

    // ── Overlay
    const overlay = document.createElement('div');
    overlay.id = 'yk-order-modal';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.52);' +
      'display:flex;align-items:flex-end;justify-content:center;';

    // ── Modal sheet
    const modal = document.createElement('div');
    modal.style.cssText =
      'background:#fff;border-radius:20px 20px 0 0;' +
      'width:100%;max-width:540px;max-height:88vh;overflow-y:auto;' +
      'padding:28px 22px 36px;font-family:\'Heebo\',sans-serif;direction:rtl;' +
      'transform:translateY(100%);transition:transform .4s cubic-bezier(.22,1,.36,1);' +
      'box-sizing:border-box;';

    // ── Row builders
    const pkgRows = pkgs.map(p =>
      '<div style="display:flex;justify-content:space-between;align-items:center;' +
      'padding:8px 0;border-bottom:1px solid #F5F5F5;gap:8px;">' +
      '<span style="font-weight:700;font-size:.88rem;color:#000;flex:1;">' + p.name + '</span>' +
      '<span style="font-weight:800;font-size:.88rem;color:#000;white-space:nowrap;">' + CUR + p.price.toLocaleString() + '</span>' +
      '</div>'
    ).join('');

    const upsRows = ups.map(u =>
      '<div style="display:flex;justify-content:space-between;align-items:center;' +
      'padding:7px 0;border-bottom:1px solid #F5F5F5;gap:8px;">' +
      '<span style="font-size:.83rem;color:#7A7A7A;flex:1;">+ ' + u.name + '</span>' +
      '<span style="font-size:.83rem;color:#7A7A7A;white-space:nowrap;">' + CUR + u.price.toLocaleString() + '</span>' +
      '</div>'
    ).join('');

    const savingsRows = savings > 0
      ? '<div style="display:flex;justify-content:space-between;padding:5px 0;gap:8px;">' +
        '<span style="font-size:.77rem;color:#AAAAAA;">שווי שוק</span>' +
        '<span style="font-size:.77rem;color:#AAAAAA;text-decoration:line-through;">' + CUR + mkt.toLocaleString() + '</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #F5F5F5;gap:8px;">' +
        '<span style="font-size:.8rem;color:#27AE60;font-weight:700;">חיסכון</span>' +
        '<span style="font-size:.8rem;color:#27AE60;font-weight:800;">−' + CUR + savings.toLocaleString() + '</span>' +
        '</div>'
      : '';

    const balanceNote = ld.upsellTotal > 0
      ? '<div style="font-size:.74rem;color:#7A7A7A;background:#F5F5F5;border-radius:6px;' +
        'padding:8px 12px;margin-bottom:14px;display:flex;align-items:center;gap:6px;">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" stroke-width="2" stroke-linecap="round">' +
        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        'יקיר יגבה ' + CUR + ld.upsellTotal.toLocaleString() + ' נוספים עבור התוספות שנבחרו.</div>'
      : '';

    const payBtnHtml = ld.payUrl
      ? '<button id="yk-modal-pay"' +
        ' style="width:100%;padding:15px;background:#8B0000;color:#fff;border:none;border-radius:10px;' +
        'font-family:\'Heebo\',sans-serif;font-size:.95rem;font-weight:800;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;gap:9px;box-sizing:border-box;">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">' +
        '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
        'להמשך לתשלום מאובטח</button>'
      : '';

    const waIconPath = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 ' +
      '1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458' +
      '.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207' +
      '-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462' +
      ' 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118' +
      '.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347' +
      'm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26' +
      'c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 ' +
      '9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 ' +
      '5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 ' +
      '0 00-3.48-8.413z';

    modal.innerHTML =
      // Check mark
      '<div style="width:48px;height:48px;border-radius:50%;background:#000;' +
      'display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white"' +
      ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="20 6 9 17 4 12"/></svg></div>' +
      // Heading
      '<h2 style="font-size:1.15rem;font-weight:900;color:#000;text-align:center;margin-bottom:5px;letter-spacing:-.01em;">' +
      'תודה' + (ld.name ? ', ' + ld.name : '') + '!</h2>' +
      '<p style="font-size:.83rem;color:#7A7A7A;text-align:center;margin-bottom:22px;line-height:1.55;">' +
      'הפרטים שלך נקלטו — יקיר יחזור אליך בהקדם לסגירת הפרטים.</p>' +
      // Order summary
      '<div style="border:1px solid #E8E8E8;border-radius:12px;padding:14px 16px;margin-bottom:16px;">' +
      '<div style="font-size:.68rem;font-weight:700;color:#7A7A7A;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;">' +
      'סיכום ההזמנה</div>' +
      pkgRows + upsRows + savingsRows +
      '<div style="display:flex;justify-content:space-between;align-items:center;' +
      'padding:11px 0 2px;border-top:1px solid #E8E8E8;margin-top:6px;">' +
      '<span style="font-weight:700;font-size:.88rem;color:#000;">' + (COPY.priceLabel || 'סה"כ') + '</span>' +
      '<span style="font-weight:900;font-size:1.25rem;color:#000;letter-spacing:-.02em;">' + CUR + ld.total.toLocaleString() + '</span>' +
      '</div></div>' +
      // Balance note
      balanceNote +
      // CTAs
      '<div style="display:flex;flex-direction:column;gap:10px;">' +
      payBtnHtml +
      '<a id="yk-modal-wa" href="' + waUrl + '" target="_blank" rel="noopener"' +
      ' style="width:100%;padding:14px;background:#fff;color:#000;border:1px solid #E8E8E8;' +
      'border-radius:10px;font-family:\'Heebo\',sans-serif;font-size:.9rem;font-weight:700;' +
      'display:flex;align-items:center;justify-content:center;gap:9px;' +
      'text-decoration:none;box-sizing:border-box;">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="' + waIconPath + '"/></svg>' +
      'שלח הזמנה ב-WhatsApp</a>' +
      '<button id="yk-modal-close"' +
      ' style="background:none;border:none;color:#AAAAAA;font-size:.8rem;cursor:pointer;' +
      'font-family:\'Heebo\',sans-serif;padding:6px;letter-spacing:.01em;">סגור</button>' +
      '</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      modal.style.transform = 'translateY(0)';
    }));

    // Event handlers
    const payBtn   = modal.querySelector('#yk-modal-pay');
    const waBtn    = modal.querySelector('#yk-modal-wa');
    const closeBtn = modal.querySelector('#yk-modal-close');

    if (payBtn) payBtn.addEventListener('click', () => {
      overlay.remove();
      window.open(ld.payUrl, '_blank');
    });
    if (waBtn) waBtn.addEventListener('click', () => {
      sessionStorage.setItem('yk_checkout_started', '1');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  }


  /* ─── Drawer Render ────────────────────── */
  function _updateDrawer() {
    const drawer = document.getElementById('yk-cart-drawer');
    if (!drawer) return;

    const total    = getTotal();
    const mkt      = getMarketTotal();
    const savings  = getSavings();

    // Determine payment link
    const packages    = items.filter(i => i.isPackage !== false);
    const upsells     = items.filter(i => i.isPackage === false);
    const upsellTotal = upsells.reduce((s, i) => s + (i.price || 0), 0);
    const payItem     = [...packages].sort((a, b) => (b.price || 0) - (a.price || 0))[0]
                      || [...items].sort((a, b) => (b.price || 0) - (a.price || 0))[0];
    _currentPayUrl    = payItem?.paymentLink || _getPaymentLink(payItem?.id) || '';

    // Build WA payload (uses current customerCtx)
    const waPayload = _buildWAPayload();

    // ── Savings block
    const savingsEl = savings > 0 ? `
      <div style="display:flex; justify-content:space-between; align-items:center;
        padding:8px 0; border-bottom:1px solid var(--c-border); font-size:.82rem;">
        <span style="color:var(--c-text-3);">שווי שוק</span>
        <span style="color:var(--c-text-3); text-decoration:line-through;">${CUR}${mkt.toLocaleString()}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;
        padding:6px 0; font-size:.82rem;">
        <span style="color:#27AE60; font-weight:700;">חיסכון שלך</span>
        <span style="color:#27AE60; font-weight:800;">${CUR}${savings.toLocaleString()}</span>
      </div>
    ` : '';

    // ── Upsell balance note
    const balanceNote = (upsellTotal > 0 && _currentPayUrl) ? `
      <div style="
        font-size:.76rem; color:#7A7A7A; background:#F5F5F5;
        border-radius:6px; padding:7px 10px; margin-bottom:10px;
        display:flex; align-items:center; gap:6px;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        גביית הפרש ${CUR}${upsellTotal.toLocaleString()} עבור התוספות
      </div>
    ` : '';

    // ── Input styles
    const inputStyle = `
      width:100%; box-sizing:border-box;
      padding:10px 14px; border:1px solid #E8E8E8; border-radius:8px;
      font-family:'Heebo',sans-serif; font-size:.88rem; direction:rtl;
      color:#000; background:#fff; outline:none;
      transition:border-color .2s ease, box-shadow .2s ease;
    `;

    drawer.innerHTML = `
      <div style="padding:20px 20px 28px; max-width:560px; margin:0 auto;">

        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div style="display:flex; align-items:center; gap:8px;">
            ${ICONS.cart}
            <span style="font-weight:800; font-size:.97rem;">העגלה שלך</span>
            ${items.length > 0 ? `<span class="yk-badge yk-badge--black">${items.length}</span>` : ''}
          </div>
          <button onclick="YK_Cart.closeDrawer()"
            style="background:none; border:none; cursor:pointer; color:#7A7A7A;
              width:32px; height:32px; display:flex; align-items:center; justify-content:center;
              border-radius:50%; transition:background .15s ease;"
            onmouseover="this.style.background='#F5F5F5'"
            onmouseout="this.style.background='none'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div style="margin-bottom:4px;">
          ${items.length === 0 ? `
            <p style="text-align:center; color:#AAAAAA; padding:24px 0; font-size:.9rem; line-height:1.6;">
              עדיין לא בחרת חבילה. בחר חבילה ראשית ושדרוגים, ואז נחזור לכאן לסיכום קצר.
            </p>
          ` : items.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center;
              padding:10px 0; border-bottom:1px solid #F5F5F5; font-size:.87rem; gap:10px;">
              <div style="flex:1; min-width:0;">
                <div style="color:#000; font-weight:600; line-height:1.3; margin-bottom:2px;">
                  ${item.name}
                </div>
                ${!item.isPackage ? `
                  <div style="font-size:.72rem; color:#AAAAAA;">תוספת</div>
                ` : ''}
              </div>
              <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
                <span style="font-weight:800; color:#000;">${CUR}${item.price.toLocaleString()}</span>
                <button onclick="YK_Cart.removeItem('${item.id}')"
                  style="background:none; border:none; color:#AAAAAA; cursor:pointer;
                    padding:4px; border-radius:4px; display:flex; align-items:center;
                    transition:color .15s ease;"
                  onmouseover="this.style.color='#8B0000'"
                  onmouseout="this.style.color='#AAAAAA'">
                  ${ICONS.trash}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Savings -->
        ${savingsEl}

        <!-- Total -->
        ${items.length > 0 ? `
          <div style="display:flex; justify-content:space-between; align-items:center;
            padding:14px 0; border-top:1px solid #E8E8E8; margin-top:4px; margin-bottom:16px;">
            <span style="font-size:.82rem; font-weight:700; color:#7A7A7A;">
              ${COPY.priceLabel || 'השקעה בפרויקט'}
            </span>
            <span style="font-weight:900; font-size:1.3rem; color:#000; letter-spacing:-0.02em;">
              ${CUR}${total.toLocaleString()}
            </span>
          </div>
        ` : ''}

        <!-- Customer Details Form -->
        ${items.length > 0 ? `
          <div style="margin-bottom:16px;">
            <div style="font-size:.7rem; font-weight:700; color:#7A7A7A;
              letter-spacing:.1em; text-transform:uppercase; margin-bottom:10px;">
              פרטים לאישור
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="position:relative;">
                <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%);
                  color:#AAAAAA; pointer-events:none;">
                  ${ICONS.user}
                </span>
                <input
                  id="yk-input-name"
                  type="text"
                  placeholder="שם מלא *"
                  value="${(customerCtx.name || '').replace(/"/g, '&quot;')}"
                  oninput="YK_Cart.setContext({ name: this.value })"
                  onfocus="this.style.borderColor='#8B0000'; this.style.boxShadow='0 0 0 2px rgba(139,0,0,0.1)'"
                  onblur="this.style.borderColor=''; this.style.boxShadow=''"
                  style="${inputStyle} padding-right:38px;"
                >
              </div>
              <div style="position:relative;">
                <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%);
                  color:#AAAAAA; pointer-events:none;">
                  ${ICONS.phone}
                </span>
                <input
                  id="yk-input-phone"
                  type="tel"
                  placeholder="טלפון *"
                  value="${(customerCtx.phone || '').replace(/"/g, '&quot;')}"
                  oninput="YK_Cart.setContext({ phone: this.value })"
                  onfocus="this.style.borderColor='#8B0000'; this.style.boxShadow='0 0 0 2px rgba(139,0,0,0.1)'"
                  onblur="this.style.borderColor=''; this.style.boxShadow=''"
                  style="${inputStyle} padding-right:38px;"
                >
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Guarantee Strip -->
        ${items.length > 0 ? `
          <div class="guarantee-strip" style="margin-bottom:14px;">
            ${ICONS.shield}
            <span>${COPY.guarantee || 'לא מרוצה מהסאונד — לא משלמים על המיקס.'}</span>
          </div>
        ` : ''}

        <!-- Balance note -->
        ${balanceNote}

        <!-- CTA -->
        ${items.length > 0 ? `
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:8px;">

            ${_currentPayUrl ? `
              <button
                onclick="YK_Cart._onCheckout()"
                class="yk-btn yk-btn--primary yk-btn--block yk-btn--lg"
                style="display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;">
                ${ICONS.lock}
                ${COPY.ctaPayment || 'לתשלום מאובטח'}
              </button>
            ` : ''}

            <a href="https://wa.me/${WA}?text=${waPayload}"
              target="_blank" rel="noopener"
              onclick="sessionStorage.setItem('yk_checkout_started','1')"
              class="yk-btn yk-btn--outline yk-btn--block"
              style="text-align:center; text-decoration:none;">
              ${COPY.ctaWhatsApp || 'שאלה? נדבר'}
            </a>
          </div>

          <p style="font-size:.73rem; color:#AAAAAA; text-align:center; margin-bottom:2px;">
            ${COPY.paymentNote || 'תשלום מאובטח דרך Morning — SSL מוצפן'}
          </p>
        ` : ''}

        <!-- Trust Bar -->
        ${items.length > 0 ? _trustBar() : ''}

        <!-- Social Proof -->
        ${items.length > 0 ? `
          <p style="text-align:center; font-size:.73rem; color:#AAAAAA; margin-top:8px;">
            ${(COPY.socialProof || '{n} אמנים הקליטו אצלנו השנה').replace('{n}', S.artistsThisYear || 120)}
          </p>
        ` : ''}
      </div>
    `;

    // Inject shake keyframes if needed
    if (!document.getElementById('yk-shake-style')) {
      const style = document.createElement('style');
      style.id = 'yk-shake-style';
      style.textContent = `
        @keyframes ykFieldShake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-5px); }
          40%     { transform:translateX(5px); }
          60%     { transform:translateX(-4px); }
          80%     { transform:translateX(4px); }
        }
        .yk-field-shake { animation: ykFieldShake 0.5s ease; }
      `;
      document.head.appendChild(style);
    }
  }


  /* ─── initCart ─────────────────────────── */
  function initCart() {
    if (document.getElementById('yk-cart-drawer')) return;

    // Drawer element
    const drawer = document.createElement('div');
    drawer.id = 'yk-cart-drawer';
    document.body.appendChild(drawer);

    // FAB
    const fab = document.createElement('div');
    fab.id = 'yk-cart-fab';
    fab.innerHTML = `
      <button id="yk-cart-fab-btn" onclick="YK_Cart.toggleDrawer()"
        style="
          display:flex; align-items:center; gap:8px;
          padding:11px 18px; background:#000; color:#fff;
          border:none; border-radius:50px;
          font-family:'Heebo',sans-serif; font-weight:700; font-size:.88rem;
          cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,.2);
          transition:all .25s ease;
        "
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,.28)'"
        onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 16px rgba(0,0,0,.2)'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span id="yk-cart-fab-count">0</span>
      </button>
    `;
    document.body.appendChild(fab);

    // Close on outside click
    document.addEventListener('click', (e) => {
      const d = document.getElementById('yk-cart-drawer');
      const f = document.getElementById('yk-cart-fab');
      if (drawerOpen && d && !d.contains(e.target) && f && !f.contains(e.target)) {
        closeDrawer();
      }
    });

    _updateFAB();
    _updateDrawer();
  }


  /* ─── Demo Upload ──────────────────────── */
  function renderDemoUpload(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const waMsg = encodeURIComponent('היי יקיר, אשמח לשלוח דמו לחוות דעת מקצועית');

    el.innerHTML = `
      <div style="
        border:1px solid #E8E8E8; border-radius:12px; padding:24px 22px;
        background:#fff; font-family:'Heebo',sans-serif; direction:rtl; text-align:center;
      ">
        <div style="
          width:44px; height:44px; border-radius:50%;
          border:1px solid #E8E8E8;
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 14px;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A"
            stroke-width="1.75" stroke-linecap="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
            <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
          </svg>
        </div>

        <h4 style="font-size:.95rem; font-weight:800; color:#000; margin-bottom:5px;">
          ${COPY.demoTitle || 'שלחו דמו לחוות דעת'}
        </h4>
        <p style="font-size:.83rem; color:#7A7A7A; margin-bottom:16px; line-height:1.5;">
          ${COPY.demoSubtitle || 'יקיר מאזין אישית ומחזיר משוב תוך 24 שעות.'}
        </p>

        <a href="https://wa.me/${WA}?text=${waMsg}" target="_blank" rel="noopener"
          class="yk-btn yk-btn--primary yk-btn--block">
          ${COPY.demoCta || 'שלחו את הקובץ'}
        </a>
        <p style="font-size:.74rem; color:#AAAAAA; margin-top:10px;">חינם לחלוטין — ללא התחייבות</p>
      </div>
    `;
  }


  /* ─── Public API ───────────────────────── */
  return {
    initCart,
    addItem,
    removeItem,
    getTotal,
    getSavings,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setContext,
    renderDemoUpload,
    _onCheckout,
    PAYMENT_LINKS
  };

})();
