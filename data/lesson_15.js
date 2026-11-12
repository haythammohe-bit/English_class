window.LESSONS = window.LESSONS || {};
window.LESSONS[15] = {
  id: 15,
  titleEn: "Microsoft Dynamics 365 Warehouse Vocabulary 1",
  titleAr: "مصطلحات Dynamics 365 للمخزن (1)",
  goalAr: "في الدرس ده هتتعلم المصطلحات الأساسية اللي بتشوفها في Microsoft Dynamics 365 في عملية الاستلام: أمر الشراء، والـ inbound load، والـ license plate، ومستند الاستلام، وحالة المخزون. وهتشرح خطوات الاستلام بجمل المبني للمجهول زي The order is created.",
  whyAr: "شاشات السيستم والتقارير كلها بالإنجليزي. لو فهمت المصطلحات دي هتشتغل أسرع، وهتشرح للزمايل والمديرين اللي حصل في الاستلام بدقة.",
  canDo: [
    "أقدر أقرا شاشات الاستلام في Dynamics 365 وأفهم مصطلحاتها.",
    "أقدر أشرح خطوات الاستلام بجمل زي The items are registered.",
    "أقدر أسأل Is the product receipt posted؟ وأفهم الرد."
  ],
  vocab: [
    { en: "item", ar: "صنف / منتج (ليه رقم صنف في السيستم)", pron: "*آي*-تِم", pos: "n.", ex: "Every item has an item number." },
    { en: "vendor", ar: "المورّد (الكلمة اللي بتظهر في السيستم)", pron: "*ڤِن*-دِر", pos: "n.", ex: "The purchase order shows the vendor name." },
    { en: "inbound load", ar: "شحنة واردة (لود وارد)", pron: "*إِن*-بَاوند *لُود*", pos: "n.", ex: "The inbound load has twelve pallets." },
    { en: "arrival", ar: "وصول (وصول الشحنة للمخزن)", pron: "أ-*رَاي*-ڤِل", pos: "n.", ex: "Check the arrival overview before the truck comes." },
    { en: "register", ar: "يسجّل (استلام الأصناف في السيستم)", pron: "*رِ*-جِس-تِر", pos: "v.", ex: "Omar registers the items with a scanner." },
    { en: "license plate", ar: "رقم تعريف الباليت (LP)", pron: "*لَاي*-سِنس *پْلَيْت*", pos: "n.", ex: "Scan the license plate on the pallet." },
    { en: "product receipt", ar: "مستند استلام البضاعة", pron: "*پْرَا*-دَكت رِ-*سِيت*", pos: "n.", ex: "The product receipt shows what we received." },
    { en: "post", ar: "يرحّل (يسجّل المستند رسمياً في السيستم)", pron: "*پُوست*", pos: "v.", ex: "The office posts the product receipt." },
    { en: "inventory status", ar: "حالة المخزون (Available / Blocked ...)", pron: "*إِن*-ڤِن-تُو-رِي *سْتَيْ*-تِس", pos: "n.", ex: "The inventory status is Available." },
    { en: "available", ar: "متاح", pron: "أ-*ڤَيْ*-لَ-بِل", pos: "adj.", ex: "Available stock is ready for picking." },
    { en: "blocked", ar: "محجوز / موقوف (مش متاح للاستخدام)", pron: "*بْلَاكْت*", pos: "adj.", ex: "The damaged pallet has Blocked status." },
    { en: "quarantine", ar: "حجر (بضاعة مستنية فحص)", pron: "*كْوُور*-ن-تِين", pos: "n.", ex: "The food items are in quarantine." },
    { en: "serial number", ar: "الرقم التسلسلي (سيريال)", pron: "*سِي*-رِي-أَل *نَم*-بِر", pos: "n.", ex: "Each laptop has its own serial number." },
    { en: "batch number", ar: "رقم التشغيلة (باتش)", pron: "*بَاتْش* *نَم*-بِر", pos: "n.", ex: "Yogurt has a batch number and an expiry date." }
  ],
  grammar: {
    titleEn: "Simple passive: The order is created",
    titleAr: "المبني للمجهول البسيط: The order is created",
    introAr: "في السيستم، المهم هو إيه اللي بيحصل، مش مين اللي بيعمله. مثلاً بنقول: The purchase order is created، يعني أمر الشراء بيتعمل، ومش مهم مين عمله. ده اسمه المبني للمجهول (passive). الشكل بسيط: is / are + الفعل في التصريف التالت (past participle). لو الفعل عادي بنزوّد ed: created, received, posted. ولو شاذ بيتغيّر: send ← sent, make ← made, put ← put. ولو عايز تقول مين عمل الحاجة بنزوّد by: The load is created by the buyer. بالشكل ده هتشرح مراحل الاستلام في Dynamics 365 بسهولة.",
    points: [
      {
        headAr: "الشكل: is / are + past participle",
        textAr: "مع الاسم المفرد بنقول is، ومع الجمع بنقول are. وبعدهم الفعل في التصريف التالت: created, received, posted, scanned. الفاعل مش مهم، المهم هو الحاجة اللي حصل لها الفعل.",
        examples: [
          { en: "The purchase order is created.", ar: "أمر الشراء بيتعمل." },
          { en: "The items are registered.", ar: "الأصناف بتتسجّل." },
          { en: "The product receipt is posted.", ar: "مستند الاستلام بيتم ترحيله." }
        ]
      },
      {
        headAr: "أفعال شاذة بتتكرر في السيستم",
        textAr: "من الأفعال الشاذة المهمة: put ← put، set ← set، send ← sent، make ← made، show ← shown. لازم تحفظ التصريف التالت بتاعها، ومنها put away بمعنى يخزّن في مكانه.",
        examples: [
          { en: "The pallet is put away in a pick location.", ar: "الباليت بيتخزّن في موقع تجهيز." },
          { en: "The status is set to Available.", ar: "الحالة بتتحدد على Available." },
          { en: "The email is sent to the vendor.", ar: "الإيميل بيتبعت للمورّد." }
        ]
      },
      {
        headAr: "by: مين عمل الحاجة",
        textAr: "لو عايز تقول مين عمل الفعل بنزوّد by في الآخر. لكن لو السيستم هو اللي بيعمل الحاجة لوحده، بنقول automatically ومن غير by.",
        examples: [
          { en: "The purchase order is created by the buyer.", ar: "أمر الشراء بيتعمل بواسطة مسؤول المشتريات." },
          { en: "The items are registered by Omar.", ar: "الأصناف بيسجّلها عمر." },
          { en: "The inventory is updated automatically.", ar: "المخزون بيتحدّث أوتوماتيك." }
        ]
      },
      {
        headAr: "السؤال والنفي",
        textAr: "للسؤال بنقدّم is أو are: Is the load created؟ Are the items registered؟ وللنفي بنزوّد not: The product receipt is not posted yet. وكلمة yet معناها لسه. والرد القصير: Yes, it is. أو No, it isn't.",
        examples: [
          { en: "Is the inbound load created?", ar: "الـ inbound load اتعمل؟" },
          { en: "Are the items registered?", ar: "الأصناف اتسجّلت؟" },
          { en: "The product receipt is not posted yet.", ar: "مستند الاستلام لسه ما اترحّلش." }
        ]
      }
    ],
    table: {
      headers: ["Type", "Pattern", "Example"],
      rows: [
        ["Statement (singular)", "is + past participle", "The purchase order is created."],
        ["Statement (plural)", "are + past participle", "The items are registered."],
        ["Negative", "is / are + not + past participle", "The load is not received yet."],
        ["Question", "Is / Are + subject + past participle?", "Is the receipt posted?"],
        ["Short answer", "Yes, it is. / No, it isn't.", "Yes, it is."],
        ["With the doer", "… + by + person", "The load is created by the buyer."],
        ["Irregular verbs", "put / set / sent / made", "The pallet is put away."]
      ]
    },
    mistakes: [
      { wrong: "The purchase order created.", right: "The purchase order is created.", noteAr: "في المبني للمجهول لازم is / are قبل التصريف التالت." },
      { wrong: "The items is registered.", right: "The items are registered.", noteAr: "الجمع (items) بياخد are مش is." },
      { wrong: "The receipt is post.", right: "The receipt is posted.", noteAr: "بعد is / are بنحط التصريف التالت (posted) مش الفعل الأصلي." }
    ],
    tipAr: "افتح شاشة أي أمر شراء في التدريب وقول بصوت عالي اللي بيحصل بالترتيب: The order is created. The load is created. The items are received. The inventory is updated."
  },
  sentences: [
    { en: "The purchase order is created in the system.", ar: "أمر الشراء بيتعمل في السيستم." },
    { en: "The inbound load is created from the purchase order.", ar: "الـ inbound load بيتعمل من أمر الشراء." },
    { en: "The license plate is scanned on the pallet.", ar: "الـ license plate بتتمسح على الباليت." },
    { en: "The items are registered with a scanner.", ar: "الأصناف بتتسجّل بالسكانر." },
    { en: "The product receipt is posted after receiving.", ar: "مستند الاستلام بيتم ترحيله بعد الاستلام." },
    { en: "The inventory status is set to Available.", ar: "حالة المخزون بتتحدد على Available." },
    { en: "Damaged items are set to Blocked.", ar: "الأصناف التالفة بتتحط على Blocked." },
    { en: "The batch number is entered for food items.", ar: "رقم التشغيلة بيتدخل للأصناف الغذائية." },
    { en: "The on-hand inventory is updated automatically.", ar: "المخزون الموجود بيتحدّث أوتوماتيك." },
    { en: "Each laptop is tracked by its serial number.", ar: "كل لاب توب بيتتبّع برقمه التسلسلي." }
  ],
  dialogue: {
    titleEn: "Receiving in the system",
    sceneAr: "لورا (خدمة العملاء) بتسأل أحمد إزاي بيتم استلام شحنة المورّد في Dynamics 365، وأحمد بيشرح الخطوات.",
    lines: [
      { who: "Laura", en: "Ahmed, a client asks about their delivery. Is it received?", ar: "يا أحمد، عميل بيسأل عن توصيلته. هي اتستلمت؟" },
      { who: "Ahmed", en: "Let me explain. First, the purchase order is created for the vendor.", ar: "خليني أشرحلك. الأول، أمر الشراء بيتعمل للمورّد." },
      { who: "Laura", en: "OK. What happens next?", ar: "تمام. وبعد كده إيه اللي بيحصل؟" },
      { who: "Ahmed", en: "The inbound load is created. We check the arrival overview.", ar: "الـ inbound load بيتعمل. وإحنا بنراجع شاشة Arrival overview." },
      { who: "Laura", en: "How does Omar receive the pallets?", ar: "عمر بيستلم الباليتات إزاي؟" },
      { who: "Ahmed", en: "He scans the license plate. The items are registered.", ar: "بيمسح الـ license plate. وبعدين الأصناف بتتسجّل." },
      { who: "Laura", en: "Do all items have a batch number?", ar: "كل الأصناف ليها رقم تشغيلة؟" },
      { who: "Ahmed", en: "No. Food items have a batch number. Laptops have a serial number.", ar: "لأ. الأصناف الغذائية ليها رقم تشغيلة. واللاب توب ليه رقم تسلسلي." },
      { who: "Laura", en: "Is the stock on hand now?", ar: "المخزون بقى موجود دلوقتي؟" },
      { who: "Ahmed", en: "Not yet. The product receipt is posted, then the inventory is updated.", ar: "لسه. الأول مستند الاستلام بيترحّل، وبعدين المخزون بيتحدّث." },
      { who: "Laura", en: "Thanks! And if a pallet is damaged?", ar: "شكراً! ولو باليت كان تالف؟" },
      { who: "Ahmed", en: "Its inventory status is set to Blocked or Quarantine.", ar: "حالة المخزون بتاعته بتتحط على Blocked أو Quarantine." }
    ]
  },
  exBuild: [
    { words: ["is", "The", "purchase", "order", "created"], answer: "The purchase order is created." },
    { words: ["are", "The", "items", "registered"], answer: "The items are registered." },
    { words: ["receipt", "is", "The", "product", "posted"], answer: "The product receipt is posted." },
    { words: ["not", "The", "load", "is", "received", "yet"], answer: "The load is not received yet." },
    { words: ["Is", "the", "status", "set", "to", "Available"], answer: "Is the status set to Available?" }
  ],
  exComplete: [
    { q: "The purchase order ____ created in the system.", options: ["is", "are", "be"], answer: "is" },
    { q: "The pallets ____ received at the dock door.", options: ["is", "are", "was"], answer: "are" },
    { q: "The product receipt is ____ after receiving.", options: ["post", "posted", "posting"], answer: "posted" },
    { q: "The items are ____ with a scanner.", options: ["registered", "register", "registering"], answer: "registered" },
    { q: "The load is created ____ the buyer.", options: ["by", "in", "to"], answer: "by" }
  ],
  exWrite: [
    { promptAr: "قول إن أمر الشراء بيتعمل في السيستم.", hint: "The purchase order is ...", model: "The purchase order is created in the system." },
    { promptAr: "قول إن الأصناف بتتسجّل بالسكانر.", hint: "The items are ...", model: "The items are registered with a scanner." },
    { promptAr: "قول إن مستند الاستلام لسه ما اترحّلش.", hint: "The product receipt is not ... yet.", model: "The product receipt is not posted yet." },
    { promptAr: "اسأل: الـ inbound load اتعمل؟", hint: "Is the inbound load ...?", model: "Is the inbound load created?" },
    { promptAr: "قول إن حالة الباليت التالف بتتحط على Blocked.", hint: "The inventory status is set to ...", model: "The inventory status is set to Blocked." }
  ],
  exTranslate: [
    { ar: "الـ inbound load بيتعمل من أمر الشراء.", en: "The inbound load is created from the purchase order." },
    { ar: "الباليتات بتتسجّل في السيستم.", en: "The pallets are registered in the system." },
    { ar: "الـ license plate بتتمسح على الباليت.", en: "The license plate is scanned on the pallet." },
    { ar: "مستند الاستلام اترحّل؟", en: "Is the product receipt posted?" },
    { ar: "المخزون بيتحدّث أوتوماتيك.", en: "The inventory is updated automatically." },
    { ar: "كل لاب توب ليه رقم تسلسلي.", en: "Every laptop has a serial number." }
  ],
  speak: [
    { promptEn: "Explain the first two steps of receiving.", promptAr: "اشرح أول خطوتين في الاستلام داخل السيستم.", model: "The purchase order is created. Then the inbound load is created." },
    { promptEn: "Say what happens at the dock door.", promptAr: "قول إيه اللي بيحصل عند باب الرصيف.", model: "The license plate is scanned. The items are registered." },
    { promptEn: "Explain what happens after receiving.", promptAr: "اشرح إيه اللي بيحصل بعد الاستلام.", model: "The product receipt is posted. Then the inventory is updated." }
  ],
  listenAr: "ركّز في الفيديو على الجمل اللي فيها is / are + past participle زي is created و are registered، وعلى مصطلحات Dynamics 365 زي license plate و product receipt.",
  quiz: {
    mcq: [
      { q: "Choose the correct sentence.", options: ["The items are register.", "The items registered.", "The items are registered.", "The items is registered."], answer: 2 },
      { q: "What is a license plate in the warehouse system?", options: ["رقم تعريف الباليت أو الحاوية", "رقم عربية الشاحنة", "رخصة السائق", "رقم الموظف"], answer: 0 },
      { q: "What does 'product receipt' mean?", options: ["الفاتورة اللي بندفعها للمورّد", "ملصق على الباليت", "تقرير الجرد الشهري", "مستند بيسجّل استلام البضاعة"], answer: 3 },
      { q: "Which inventory status means the stock is ready to use?", options: ["Blocked", "Available", "Quarantine", "Missing"], answer: 1 },
      { q: "Which item usually has a serial number?", options: ["Bottled water", "Plastic bags", "A laptop", "Paper tape"], answer: 2 }
    ],
    fill: [
      { q: "The inventory ____ updated automatically.", answer: "is" },
      { q: "The batch numbers ____ entered for food items.", answer: "are" },
      { q: "The product receipt is not ____ yet.", answer: "posted" },
      { q: "Each pallet has a ____ plate with a unique number.", answer: "license", alt: ["licence"] },
      { q: "The inventory ____ is Blocked, so we cannot pick it.", answer: "status" }
    ],
    trans: [
      { dir: "ar2en", q: "أمر الشراء بيتعمل للمورّد.", answer: "The purchase order is created for the vendor." },
      { dir: "ar2en", q: "الأصناف اتسجّلت؟", answer: "Are the items registered?" },
      { dir: "ar2en", q: "حالة المخزون Available.", answer: "The inventory status is Available." },
      { dir: "en2ar", q: "The pallet is scanned at the dock door.", answer: "الباليت بيتمسح عند باب الرصيف." },
      { dir: "en2ar", q: "Food items need a batch number.", answer: "الأصناف الغذائية محتاجة رقم تشغيلة." }
    ],
    build: [
      { type: "order", q: "is / The / load / created / inbound", answer: "The inbound load is created." },
      { type: "order", q: "status / is / The / Blocked / inventory", answer: "The inventory status is Blocked." },
      { type: "write", q: "اكتب جملة بالمبني للمجهول بتقول إن الأصناف بتتسجّل.", answer: "مثال: The items are registered." },
      { type: "reply", q: "Reply to: Is the product receipt posted?", answer: "Yes, it is. (أو: No, it isn't.)" },
      { type: "reply", q: "Reply to: Are the pallets received?", answer: "Yes, they are. (أو: No, they aren't.)" }
    ]
  }
};
