# 🎵 יקיר כהן הפקות — ספריית רכיבי אתר

ספריית JavaScript מודולרית עם כל הטריגרים הפסיכולוגיים, רכיבי מחירון, Upsells, ועגלת קניות.  
**מוכן להטמעה ב-GitHub Pages / WordPress / כל אתר.**

---

## 📁 מבנה הפרויקט

```
yakir-cohen-site/
├── index.html                    # דף דמו עם כל הרכיבים
├── README.md                     # הקובץ הזה
├── assets/
│   ├── css/
│   │   └── main.css              # עיצוב משותף + משתני מותג
│   └── js/
│       ├── psychology.js          # טריגרים פסיכולוגיים
│       ├── pricing.js             # מחירון + Anchoring + קוויזים
│       ├── upsells.js             # Upsells לפי קטגוריה
│       └── cart.js                # עגלה + וואטסאפ + תשלום
```

---

## 🧠 psychology.js — טריגרים פסיכולוגיים

| רכיב | פונקציה | מה עושה |
|-------|---------|---------|
| זמינות (Scarcity) | `renderAvailability(id)` | מד זמינות חודשי עם progress bar |
| הנמכרת ביותר | `renderPopularityBadge(id, opts)` | תג social proof דינמי |
| דחיפות | `renderUrgencyBlock(id, opts)` | "מה יקרה אם תחכה" — לפי קהל יעד |
| אחריות | `renderGuarantee(id)` | "בלי כוכביות" — risk reversal |
| Exit Popup | `initExitPopup(opts)` | מתנות חינם כשעוזבים |
| Live Notifications | `initLiveNotifications(opts)` | "מיכל מ. הזמינה Silver לפני 3 דקות" |

### קהלי יעד ל-Urgency:
- `singer` — זמרים ומוזיקאים
- `barmitzvah` — הורים לבר/בת מצווה
- `podcast` — פודקאסטרים
- `dj` — לקוחות DJ ואירועים

---

## 💰 pricing.js — מחירון ו-Anchoring

| רכיב | פונקציה | מה עושה |
|-------|---------|---------|
| השוואת מחירים | `renderComparison(id, opts)` | "כמה עולה לך בלעדינו?" |
| קוויז התאמה | `renderFitQuiz(id, opts)` | "האם אנחנו מתאימים לך?" |
| Progress Bar | `renderProgressBar(id, opts)` | "הדרך שלך להפקה מושלמת" |
| בחירת זהות | `renderIdentitySelector(id, opts)` | "איזה סוג אמן אתה?" |
| Upsell Popup | `showUpsell(opts)` | חלון שדרוג אחרי הוספה לעגלה |

---

## 🛒 upsells.js — תוספות לפי קטגוריה

### קטגוריות זמינות:

**singer** (זמרים):
- `primary` — הפרדת ערוצים, קליפ, הפצה
- `social` — YouTube, Instagram Reels, TikTok

**barmitzvah** (בר/בת מצווה):
- `primary` — שיר, קליפ, תמונות
- `family` — שובר מתנה, ברכות משפחתיות, דרשה

**podcast**:
- `primary` — עריכה, צילום, מיתוג
- `social` — קטעים קצרים, תמלול, תכנון תוכן

**dj** (אירועים):
- `primary` — מתופף, LED, קריוקי
- `attractions` — עשן, זיקוקים, קונפטי, בועות

**gift** (שיר במתנה):
- `primary` — שובר, Silver, VIP

---

## 🛍️ cart.js — עגלת קניות

```javascript
// אתחול
YK_Cart.initCart();

// הוספה עם upsell אוטומטי
YK_Cart.addItem('חבילת Silver', 1480, {
  paymentLink: YK_Cart.PAYMENT_LINKS.silver,
  category: 'recording',
  triggerUpsell: true
});

// לינקי תשלום מובנים (Morning)
YK_Cart.PAYMENT_LINKS.basic   // ₪990
YK_Cart.PAYMENT_LINKS.silver  // ₪1,480
YK_Cart.PAYMENT_LINKS.vip     // ₪2,380
```

---

## ⚡ הטמעה מהירה

```html
<!-- CSS -->
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/main.css">

<!-- קונטיינרים -->
<div id="availability"></div>
<div id="comparison"></div>
<div id="upsells"></div>

<!-- JS (בסוף body) -->
<script src="assets/js/psychology.js"></script>
<script src="assets/js/pricing.js"></script>
<script src="assets/js/upsells.js"></script>
<script src="assets/js/cart.js"></script>

<script>
  // פסיכולוגיה
  YK_Psychology.renderAvailability('availability');
  YK_Psychology.initExitPopup();
  YK_Psychology.initLiveNotifications();

  // מחירון
  YK_Pricing.renderComparison('comparison');

  // Upsells (לדוגמה: זמרים + סושיאל)
  YK_Upsells.renderUpsellSection('upsells', 'singer', 'social', {
    title: '📱 שדרוג נראות דיגיטלית'
  });

  // עגלה
  YK_Cart.initCart();
</script>
```

---

## 📱 מותאם מובייל

כל הרכיבים responsive ומותאמים למובייל.  
העגלה נשארת sticky בתחתית המסך.  
כפתור WhatsApp FAB תמיד נגיש.

---

## 🔗 לינקים חשובים

- **שובר מתנה:** https://voucher.yakircohen.com/
- **וואטסאפ:** https://wa.me/972587555456
- **תשלום בסיס:** https://mrng.to/az6dR8yZoH
- **תשלום Silver:** https://mrng.to/bEmvs34vnj
- **תשלום VIP:** https://mrng.to/R1nx1cDPdZ
