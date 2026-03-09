/* ============================================
   config.js v3 — Central Configuration
   יקיר כהן הפקות

   עדכון פה → כל האתר מתעדכן
   ============================================ */

const YK_CONFIG = {

  // ─── Studio ───────────────────────────────
  studio: {
    name:               'יקיר כהן הפקות',
    whatsapp:           '972587555456',
    email:              'callwebboss@gmail.com', // מייל לקבלת לידים
    voucherUrl:         'https://voucher.yakircohen.com/',
    maxMonthlyProjects: 8,
    currency:           '₪',
    monthNames:         ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
    artistsThisYear:    120,
    experience:         '20 שנה',
    eventCount:         '1,500+'
  },

  // ─── Web3Forms (Email Notifications) ──────
  // מיילים מגיעים ל: studio.email = 'callwebboss@gmail.com'
  web3forms: {
    accessKey:    '636e046c-45b4-4011-a947-1ffe575b5bb1',
    endpoint:     'https://api.web3forms.com/submit',
    enabled:      true
  },

  // ─── Packages ─────────────────────────────
  packages: [
    {
      id:           'basic',
      name:         'המסלול הבסיסי',
      subtitle:     'סאונד מקצועי. בלי תוספות.',
      price:        990,
      marketValue:  1800,
      features:     ['הקלטה עד שעתיים', 'מיקס ומאסטרינג', 'תיקון זיופים', 'WAV + MP3'],
      paymentLink:  'https://mrng.to/az6dR8yZoH',
      isPopular:    false,
      badge:        null,
      waText:       'היי יקיר, אשמח לשמוע עוד על המסלול הבסיסי (₪990)'
    },
    {
      id:           'silver',
      name:         'מסלול הלהיט',
      subtitle:     '80% מהאמנים בוחרים במסלול הזה.',
      price:        1480,
      marketValue:  2600,
      features:     ['הקלטה ללא הגבלה', 'Pitch Correction ידני', 'מיקס אנלוגי + מאסטרינג', 'ייעוץ אמנותי', 'צילומי סטילס'],
      paymentLink:  'https://mrng.to/bEmvs34vnj',
      isPopular:    true,
      badge:        'הנבחר',
      waText:       'היי יקיר, ראיתי את מסלול הלהיט (₪1,480) — אשמח לשמוע איך מתחילים'
    },
    {
      id:           'vip',
      name:         'All-In',
      subtitle:     'הפקה מלאה. ראש שקט.',
      price:        2380,
      marketValue:  4800,
      features:     ['כל מה שב-להיט', 'קליפ לייב (2 זוויות)', 'הפצה ל-40+ פלטפורמות', '3 Reels מוכנים', 'קידום ראשוני'],
      paymentLink:  'https://mrng.to/R1nx1cDPdZ',
      isPopular:    false,
      badge:        'הכל כלול',
      waText:       'היי יקיר, ראיתי את חבילת ה-All-In (₪2,380) — אשמח לשמוע עוד'
    }
  ],

  // ─── Upsells (5 per category) ─────────────
  upsells: {

    // ── זמרים ──────────────────────────────
    singer: [
      {
        id:     'pitch-perfect',
        title:  'Pitch Perfect',
        desc:   'תיקון זיופים אמנותי — ידני על כל תו, לא AutoTune. ברמת אולפני L.A.',
        price:  480,
        iconId: 'sliders',
        waText: 'אשמח להוסיף Pitch Perfect (₪480)'
      },
      {
        id:     'vocal-layers',
        title:  'Vocal Layers',
        desc:   'קולות ליווי מקצועיים + הרמוניות — מה שהופך שיר טוב ללהיט.',
        price:  650,
        iconId: 'layers',
        waText: 'אשמח להוסיף Vocal Layers (₪650)'
      },
      {
        id:     'spotify-distro',
        title:  'Spotify Distro',
        desc:   'הפצה ל-40+ פלטפורמות (ספוטיפיי, אפל, טיקטוק). כולל ISRC וברקוד.',
        price:  450,
        iconId: 'globe',
        waText: 'אשמח להוסיף Spotify Distro (₪450)'
      },
      {
        id:     'social-reels',
        title:  'Social Reels',
        desc:   '3 Reels מוכנים מתוך ההקלטה — תוכן שמוכר לפני שהשיר אפילו יוצא.',
        price:  350,
        iconId: 'video',
        waText: 'אשמח להוסיף Social Reels (₪350)'
      },
      {
        id:     'pr-starter',
        title:  'PR Starter',
        desc:   'קומוניקט מקצועי לשחרור + רשימת אנשי קשר בתקשורת. מוכן לשלוח.',
        price:  390,
        iconId: 'fileText',
        waText: 'אשמח להוסיף PR Starter (₪390)'
      }
    ],

    // ── בר/בת מצווה ───────────────────────
    barmitzvah: [
      {
        id:     'field-recording',
        title:  'הקלטת בית',
        desc:   'מגיעים אליכם עם ציוד מקצועי — מושלם למי שמעדיף לשיר בסביבה נוחה.',
        price:  550,
        iconId: 'home',
        waText: 'אשמח להוסיף הקלטת בית (₪550)'
      },
      {
        id:     'family-landing',
        title:  'דף נחיתה משפחתי',
        desc:   'עמוד מעוצב עם השיר, התמונות ומסר אישי — לשתף עם כל הקרובים.',
        price:  480,
        iconId: 'book',
        waText: 'אשמח להוסיף דף נחיתה משפחתי (₪480)'
      },
      {
        id:     'zoom-prep',
        title:  'שיחת הכנה בזום',
        desc:   '30 דקות עם יקיר לפני ההקלטה — מוריד מתח, מעלה ביטחון ותוצאה.',
        price:  250,
        iconId: 'video',
        waText: 'אשמח להוסיף שיחת הכנה (₪250)'
      },
      {
        id:     'photo-slideshow',
        title:  'מצגת תמונות לשיר',
        desc:   'תמונות האירוע + השיר = רגע שמרגש את כולם. מוכן להקרנה באולם.',
        price:  390,
        iconId: 'monitor',
        waText: 'אשמח להוסיף מצגת תמונות (₪390)'
      },
      {
        id:     'usb-keepsake',
        title:  'מארז USB יוקרתי',
        desc:   'קופסת עץ עם חסן נייד מעוצב — מזכרת שנשמרת לדורות.',
        price:  320,
        iconId: 'gift',
        waText: 'אשמח להוסיף מארז USB (₪320)'
      }
    ],

    // ── פודקאסט ───────────────────────────
    podcast: [
      {
        id:     'ai-noise-clean',
        title:  'ניקוי רעשים AI',
        desc:   'ניקוי רעשי רקע, מיקרופון ואוויר — נשמע כמו סטודיו מקצועי.',
        price:  290,
        iconId: 'scissors',
        waText: 'אשמח להוסיף ניקוי רעשים (₪290/פרק)'
      },
      {
        id:     'original-intro',
        title:  'מוזיקת פתיח מקורית',
        desc:   'ג\'ינגל ייחודי שמשויך לפודקאסט שלך בלבד. חד-פעמי. חסין זכויות.',
        price:  890,
        iconId: 'mic',
        waText: 'אשמח להוסיף מוזיקת פתיח (₪890)'
      },
      {
        id:     'youtube-chapters',
        title:  'מרקרים ליוטיוב',
        desc:   'עריכת פרק עם timestamps + תמלול — האלגוריתם של יוטיוב אוהב את זה.',
        price:  380,
        iconId: 'fileText',
        waText: 'אשמח להוסיף מרקרים ליוטיוב (₪380/פרק)'
      },
      {
        id:     'cover-art',
        title:  'עיצוב Cover Art',
        desc:   'תמונת שער מקצועית לספוטיפיי + אפל. הדבר הראשון שרואים.',
        price:  490,
        iconId: 'palette',
        waText: 'אשמח להוסיף Cover Art (₪490)'
      },
      {
        id:     'podcast-distrib',
        title:  'הפצה לכל הפלטפורמות',
        desc:   'RSS + הגשה לספוטיפיי, אפל, גוגל ו-20+ פלטפורמות. תקף שנה.',
        price:  350,
        iconId: 'globe',
        waText: 'אשמח להוסיף הפצת פודקאסט (₪350/שנה)'
      }
    ],

    dj: [
      {
        id: 'live-drummer',
        title: 'מתופף LIVE',
        desc: 'מתופף על תופים אלקטרוניים — אנרגיה שאי אפשר לשכפל.',
        price: 1800,
        iconId: 'drum',
        waText: 'אשמח להוסיף מתופף לייב (₪1,800)'
      },
      {
        id: 'led-stage',
        title: 'עמדת LED',
        desc: 'מסכי LED + תאורה + אפקטים. נראות של הופעה בינלאומית.',
        price: 2200,
        iconId: 'monitor',
        waText: 'אשמח להוסיף עמדת LED (₪2,200)'
      },
      {
        id: 'karaoke',
        title: 'עמדת קריוקי',
        desc: 'מסך + מיקרופונים + ספריית שירים. הלהיט של כל אירוע.',
        price: 800,
        iconId: 'mic',
        waText: 'אשמח להוסיף קריוקי (₪800)'
      },
      {
        id: 'cold-sparks',
        title: 'זיקוקים קרים',
        desc: 'מזרקות אש בטיחותיות לרגע השיא. מותר בפנים, בטוח לחלוטין.',
        price: 450,
        iconId: 'zap',
        waText: 'אשמח להוסיף זיקוקים קרים (₪450)'
      },
      {
        id: 'confetti',
        title: 'תותח קונפטי',
        desc: 'פיצוץ צבעוני ברגע המרגש. בחרו צבעים לפי תמת האירוע.',
        price: 350,
        iconId: 'star',
        waText: 'אשמח להוסיף קונפטי (₪350)'
      }
    ],

    gift: [
      {
        id: 'gift-basic',
        title: 'שובר הקלטה',
        desc: 'שובר מעוצב + הקלטה באולפן. תקף שנה שלמה.',
        price: 990,
        iconId: 'gift',
        url: 'https://voucher.yakircohen.com/',
        waText: 'אשמח לשובר הקלטה (₪990)'
      },
      {
        id: 'gift-silver',
        title: 'שובר Silver',
        desc: 'הקלטה + צילום + ייעוץ. החוויה המלאה.',
        price: 1480,
        iconId: 'star',
        url: 'https://voucher.yakircohen.com/',
        waText: 'אשמח לשובר Silver (₪1,480)'
      },
      {
        id: 'gift-vip',
        title: 'שובר All-In',
        desc: 'קליפ + שיר + הפצה. מתנה שנשארת לנצח.',
        price: 2380,
        iconId: 'zap',
        url: 'https://voucher.yakircohen.com/',
        waText: 'אשמח לשובר All-In (₪2,380)'
      }
    ]
  },

  // ─── Anchoring ────────────────────────────
  anchoring: {
    competitors: [
      { label: 'אולפן הקלטות',  price: 1800 },
      { label: 'מפיק חיצוני',    price: 1500 },
      { label: 'עריכת וידאו',    price: 1200 },
      { label: 'הפצה ושיווק',    price: 800  }
    ],
    ourLabel:     'הכל כאן, בניהול אחד',
    ourPrice:     2380,
    ourTimeLabel: '48 שעות למיקס ראשון'
  },

  // ─── Professional Micro-Copy ──────────────
  copy: {
    priceLabel:         'השקעה באירוע שלך',
    ctaBook:            'שריין את התאריך ביומן',
    ctaPayment:         'להמשך לתשלום מאובטח',
    ctaWhatsApp:        'מעוניין לשאול שאלה? בוא נדבר',
    guaranteeTitle:     'התחייבות לשקט שלך',
    guarantee:          'אם משהו בסאונד לא עומד במה שסיכמנו — אני מתקן עד שאתה מרוצה.',
    demoTitle:          'רוצה חוות דעת מקצועית על דמו?',
    demoSubtitle:       'שלח קובץ, ואני חוזר אליך אישית עם משוב תוך 24 שעות.',
    demoCta:            'שלח דמו לבדיקה',
    paymentNote:        'תשלום מאובטח דרך Morning עם הצפנת SSL מלאה.',
    exitTitle:          'רגע לפני שאתה יוצא',
    exitSubtitle:       'תן לי לשלוח לך מדריך קצר שיחסוך לך טעויות בהפקה:',
    exitCta:            'שלח לי את המדריך למייל / וואטסאפ',
    scarcityNote:       'יקיר עובד על מקסימום {n} פרויקטים בחודש כדי לשמור על איכות.',
    socialProof:        '{n} לקוחות הפקה בחרו ביקיר כהן השנה',
    voucherAmount:      200,
    successMessage:     'הפרטים נקלטו — אחזור אליך תוך שעה לסגירת הפרטים.'
  },

  // ─── Live Notifications (real, quiet) ─────
  // אין מספרים רנדומליים — הודעות אמיתיות, נדירות
  liveNotifications: [
    { text: 'איתי מ-תל אביב שריין מקום לסבב מרץ', minutesAgo: 12 },
    { text: 'מיכל מ-ירושלים הזמינה מסלול הלהיט',   minutesAgo: 34 },
    { text: 'דני מ-חיפה קבע שיחת ייעוץ',            minutesAgo: 58 }
  ],
  maxNotificationsPerSession: 1, // מקסימום 1 התראה לביקור
  notificationDelay: 120000      // רק אחרי 2 דקות
};

window.YK_CONFIG = YK_CONFIG;
