window.LESSONS = window.LESSONS || {};
window.LESSONS[16] = {
  id: 16,
  titleEn: "Microsoft Dynamics 365 Warehouse Vocabulary 2",
  titleAr: "مصطلحات Dynamics 365 للمخزن (2)",
  goalAr: "في الدرس ده هتتعلم مصطلحات الـ wave والـ work في Dynamics 365: الـ wave template والـ work template والـ location directive والـ pick work والـ put work. وهتشرح العملية خطوة خطوة بـ when وكلمات الترتيب زي first و then.",
  whyAr: "المشرف هو اللي بيبعت الـ wave ويتابع الـ work على أجهزة العمال. لو فهمت المصطلحات وعرفت تشرحها بسرعة، هتحل مشاكل التجهيز بدل ما تستنى حد.",
  canDo: [
    "أقدر أشرح يعني إيه wave و work و work template بجمل بسيطة.",
    "أقدر أقول إيه اللي بيحصل لما الـ wave تتبعت باستخدام When.",
    "أقدر أشرح الخطوات بالترتيب بـ first و then و after that و finally."
  ],
  vocab: [
    { en: "wave", ar: "موجة (مجموعة شحنات بتتجهّز مع بعض)", pron: "*وَيْڤ*", pos: "n.", ex: "A wave groups many shipments together." },
    { en: "wave template", ar: "قالب الموجة (قواعد بتحدد إزاي الـ wave بتتعالج)", pron: "*وَيْڤ* *تِم*-پْلَيْت", pos: "n.", ex: "The wave template decides the steps of the wave." },
    { en: "work", ar: "work (مهمة شغل بتتبعت للعامل على الجهاز)", pron: "*وِرك*", pos: "n.", ex: "The system creates work for the pickers." },
    { en: "work template", ar: "قالب الـ work (بيحدد خطوات الشغل: pick و put)", pron: "*وِرك* *تِم*-پْلَيْت", pos: "n.", ex: "The work template defines the pick and put steps." },
    { en: "location directive", ar: "توجيه المواقع (قاعدة بتحدد ناخد الصنف منين ونحطه فين)", pron: "لُو-*كَيْ*-شِن دِ-*رِك*-تِڤ", pos: "n.", ex: "A location directive finds the best location." },
    { en: "pick work", ar: "work نوع Pick (ناخد الصنف من الموقع)", pron: "*پِك* *وِرك*", pos: "n.", ex: "Pick work tells the picker where to go." },
    { en: "put work", ar: "work نوع Put (نحط الصنف في الموقع)", pron: "*پُت* *وِرك*", pos: "n.", ex: "Put work moves the pallet to a storage location." },
    { en: "mobile device menu item", ar: "بند في قائمة الجهاز المحمول (الهاند هيلد)", pron: "*مُو*-بَاي-ل دِ-*ڤَايس* *مِ*-نْيُو *آي*-تِم", pos: "n.", ex: "The worker selects a mobile device menu item." },
    { en: "release", ar: "يبعت للتنفيذ / يطلق", pron: "رِ-*لِيس*", pos: "v.", ex: "The supervisor releases the wave at nine." },
    { en: "release to warehouse", ar: "إرسال الأوردر للمخزن للتنفيذ", pron: "رِ-*لِيس* تُو *وِير*-هَاوس", pos: "phr.", ex: "Release to warehouse sends the order to the floor." },
    { en: "worker", ar: "عامل المخزن (اللي بينفّذ الـ work)", pron: "*وِر*-كِر", pos: "n.", ex: "Each worker gets work on a mobile device." },
    { en: "step", ar: "خطوة", pron: "*سْتِپ*", pos: "n.", ex: "Each wave has several steps." },
    { en: "automatically", ar: "أوتوماتيك / تلقائياً", pron: "أُو-تُو-*مَا*-تِك-لِي", pos: "adv.", ex: "The system creates work automatically." },
    { en: "process", ar: "يعالج / يشغّل (عملية)", pron: "*پْرَا*-سِس", pos: "v.", ex: "We process the wave every hour." }
  ],
  grammar: {
    titleEn: "When + present simple, and sequence words",
    titleAr: "when مع المضارع البسيط، وكلمات الترتيب",
    introAr: "لما بتشرح عملية في السيستم، بتقول إيه اللي بيحصل بعد إيه. عشان كده بنستخدم when، ومعناها لما: When the wave is released, the system creates work. بعد when بنستخدم المضارع البسيط، حتى لو الكلام عن المستقبل. وبعد كده بنرتّب الخطوات بكلمات الترتيب: first، then، next، after that، finally. بالشكل ده تقدر تشرح لأي حد مراحل الـ wave من الأول للآخر من غير ما يتلخبط. وفي الدرس كمان هتتعلم مصطلحات زي wave و work و work template اللي بتشوفها كل يوم على الشاشة.",
    points: [
      {
        headAr: "when + المضارع البسيط",
        textAr: "بنقول when + جملة بالمضارع البسيط، وبعدها النتيجة بالمضارع البسيط برضه. لو بدأنا بـ when بنحط فاصلة قبل النتيجة. وممكن نعكس الترتيب من غير فاصلة: Work is created when the wave is released.",
        examples: [
          { en: "When the wave is released, the system creates work.", ar: "لما الـ wave تتبعت، السيستم بيعمل work." },
          { en: "When the worker scans the label, the work starts.", ar: "لما العامل يمسح الملصق، الـ work بيبدأ." },
          { en: "Work is created when the wave is released.", ar: "الـ work بيتعمل لما الـ wave تتبعت." }
        ]
      },
      {
        headAr: "when مع المستقبل: من غير will",
        textAr: "لو الكلام عن المستقبل، برضه بنستخدم المضارع البسيط بعد when، وبنستخدم will في النتيجة بس. بنقول: When the truck arrives, we will receive it. ومش: When the truck will arrive.",
        examples: [
          { en: "When the truck arrives, we will receive it.", ar: "لما الشاحنة توصل، هنستلمها." },
          { en: "When the order is ready, we release it.", ar: "لما الأوردر يجهز، بنبعته للتنفيذ." }
        ]
      },
      {
        headAr: "كلمات الترتيب",
        textAr: "بنرتّب الخطوات بـ first (الأول)، then (بعدين)، next (بعد كده)، after that (بعد ده)، finally (في الآخر). بنحط فاصلة بعد first و next و after that و finally. أما then فبنقولها غالباً من غير فاصلة.",
        examples: [
          { en: "First, the order is released to warehouse.", ar: "الأول، الأوردر بيتبعت للمخزن." },
          { en: "Then the system creates a shipment.", ar: "بعدين السيستم بيعمل shipment." },
          { en: "Finally, the worker finishes the put work.", ar: "في الآخر، العامل بيخلّص الـ put work." }
        ]
      },
      {
        headAr: "نجمع الاتنين في شرح كامل",
        textAr: "في الشرح الكامل بنستخدم كلمات الترتيب مع when. نبدأ بـ First، وبعدين Then، وبعد كده After that، ونقفل بـ Finally. وأي خطوة فيها شرط بنكتب فيها when.",
        examples: [
          { en: "First, we create the wave. Then we release it.", ar: "الأول بنعمل الـ wave. وبعدين بنبعتها للتنفيذ." },
          { en: "After that, when the work is ready, the picker starts.", ar: "بعد كده، لما الـ work يجهز، المجهّز بيبدأ." }
        ]
      }
    ],
    table: {
      headers: ["Pattern", "Meaning", "Example"],
      rows: [
        ["When + present simple, present simple", "an event, then a result", "When the wave is released, work is created."],
        ["Present simple + when + present simple", "same idea, different order", "Work is created when the wave is released."],
        ["When + present simple, will + verb", "a future result", "When the truck arrives, we will receive it."],
        ["First, …", "step 1", "First, release the order."],
        ["Then / Next, …", "step 2, step 3", "Then the system creates the shipment."],
        ["After that, …", "the following step", "After that, the wave is processed."],
        ["Finally, …", "the last step", "Finally, the worker picks the items."]
      ]
    },
    mistakes: [
      { wrong: "When the wave will be released, work is created.", right: "When the wave is released, work is created.", noteAr: "بعد when ما بنستخدمش will. بنستخدم المضارع البسيط." },
      { wrong: "When the worker scan the label, work starts.", right: "When the worker scans the label, work starts.", noteAr: "مع he / she / it / the worker لازم s في المضارع البسيط." },
      { wrong: "The system creates a works.", right: "The system creates work.", noteAr: "work مبتتجمعش وماليهاش a. بنقول work وبس." }
    ],
    tipAr: "اختار عملية واحدة من شغلك (الاستلام أو التجهيز) واشرحها بصوت عالي في 4 جمل: First … Then … After that … Finally … وسجّل صوتك، وبعدين اسمعه وصحّح لنفسك."
  },
  sentences: [
    { en: "A wave groups many shipments together.", ar: "الـ wave بتجمّع شحنات كتير مع بعض." },
    { en: "First, the sales order is released to warehouse.", ar: "الأول، أمر البيع بيتبعت للمخزن (Release to warehouse)." },
    { en: "When the wave is released, the system creates work.", ar: "لما الـ wave تتبعت، السيستم بيعمل work." },
    { en: "The work template defines the pick and put steps.", ar: "الـ work template بيحدد خطوات الـ pick والـ put." },
    { en: "The location directive finds the best pick location.", ar: "الـ location directive بيدوّر على أحسن موقع للتجهيز." },
    { en: "The worker opens a mobile device menu item.", ar: "العامل بيفتح بند من قائمة الجهاز المحمول." },
    { en: "Then the worker follows the pick work on the screen.", ar: "بعدين العامل بيمشي ورا الـ pick work على الشاشة." },
    { en: "After that, the put work moves the pallet to storage.", ar: "بعد كده، الـ put work بينقل الباليت للتخزين." },
    { en: "When a pick location is low, replenishment work is created.", ar: "لما موقع التجهيز يقل، بيتعمل replenishment work." },
    { en: "Cycle counting work checks the stock in a location.", ar: "الـ cycle counting work بيراجع المخزون في موقع." }
  ],
  dialogue: {
    titleEn: "How a wave works",
    sceneAr: "أحمد بيشرح ليوسف (المجهّز الجديد) إزاي الـ wave بتشتغل في Dynamics 365، من أول الأوردر لحد ما الـ work يوصل على الجهاز.",
    lines: [
      { who: "Youssef", en: "Ahmed, I get work on my device. How does it start?", ar: "يا أحمد، بيجيلي work على الجهاز. بيبدأ إزاي؟" },
      { who: "Ahmed", en: "First, the sales order is released to warehouse.", ar: "الأول، أمر البيع بيتبعت للمخزن (Release to warehouse)." },
      { who: "Youssef", en: "OK. And then?", ar: "تمام. وبعدين؟" },
      { who: "Ahmed", en: "Then the system creates a shipment. A wave groups shipments together.", ar: "بعدين السيستم بيعمل shipment. والـ wave بتجمّع الـ shipments مع بعض." },
      { who: "Youssef", en: "What happens when you release the wave?", ar: "إيه اللي بيحصل لما تبعت الـ wave؟" },
      { who: "Ahmed", en: "When I release the wave, the system creates the work.", ar: "لما أبعت الـ wave، السيستم بيعمل الـ work." },
      { who: "Youssef", en: "How does the system know the steps?", ar: "السيستم بيعرف الخطوات إزاي؟" },
      { who: "Ahmed", en: "The work template defines them. The location directive finds the locations.", ar: "الـ work template بيحددها، والـ location directive بيلاقي المواقع." },
      { who: "Youssef", en: "So I open the picking menu item on my mobile device?", ar: "يعني أنا بفتح بند التجهيز من قائمة الجهاز؟" },
      { who: "Ahmed", en: "Yes. First you do the pick work. Then you do the put work.", ar: "أيوه. الأول بتعمل الـ pick work، وبعدين بتعمل الـ put work." },
      { who: "Youssef", en: "And what about replenishment?", ar: "طب والـ replenishment؟" },
      { who: "Ahmed", en: "When a pick location is low, replenishment work is created automatically.", ar: "لما موقع التجهيز يقل، بيتعمل replenishment work أوتوماتيك." }
    ]
  },
  exBuild: [
    { words: ["First", "the", "order", "is", "released", "to", "warehouse"], answer: "First, the order is released to warehouse." },
    { words: ["Then", "creates", "the", "system", "a", "shipment"], answer: "Then the system creates a shipment." },
    { words: ["When", "the", "wave", "is", "released", "work", "is", "created"], answer: "When the wave is released, work is created." },
    { words: ["opens", "The", "worker", "the", "mobile", "device", "menu"], answer: "The worker opens the mobile device menu." },
    { words: ["Finally", "the", "worker", "does", "the", "put", "work"], answer: "Finally, the worker does the put work." }
  ],
  exComplete: [
    { q: "When the wave ____ released, work is created.", options: ["is", "are", "will"], answer: "is" },
    { q: "When the worker ____ the label, the work starts.", options: ["scan", "scans", "scanning"], answer: "scans" },
    { q: "First, the order is released. ____, the system creates a shipment.", options: ["Then", "When", "Before"], answer: "Then" },
    { q: "First, we create the wave. ____ that, we release it.", options: ["After", "Before", "In"], answer: "After" },
    { q: "A location directive ____ the best location.", options: ["find", "finds", "finding"], answer: "finds" }
  ],
  exWrite: [
    { promptAr: "قول إن الـ wave بتجمّع شحنات كتير.", hint: "A wave groups ...", model: "A wave groups many shipments together." },
    { promptAr: "قول إيه اللي بيحصل لما الـ wave تتبعت.", hint: "When the wave is released, ...", model: "When the wave is released, the system creates work." },
    { promptAr: "قول إن الـ work template بيحدد الخطوات.", hint: "The work template ...", model: "The work template defines the steps." },
    { promptAr: "رتّب خطوتين: الأول الأوردر يتبعت للمخزن وبعدين يتعمل shipment.", hint: "First, ... Then ...", model: "First, the order is released to warehouse. Then the system creates a shipment." },
    { promptAr: "قول إن العامل بيفتح بند من قائمة الجهاز المحمول.", hint: "The worker opens ...", model: "The worker opens a mobile device menu item." }
  ],
  exTranslate: [
    { ar: "الـ wave بتجمّع الشحنات.", en: "The wave groups the shipments." },
    { ar: "الأول، بنبعت الأوردر للمخزن.", en: "First, we release the order to warehouse." },
    { ar: "لما العامل يمسح الملصق، الـ work بيبدأ.", en: "When the worker scans the label, the work starts." },
    { ar: "الـ location directive بيلاقي الموقع.", en: "The location directive finds the location." },
    { ar: "بعد كده، العامل بيعمل الـ put work.", en: "After that, the worker does the put work." },
    { ar: "الـ cycle counting بيراجع المخزون.", en: "Cycle counting checks the stock." }
  ],
  speak: [
    { promptEn: "Explain what a wave is.", promptAr: "اشرح يعني إيه wave.", model: "A wave groups many shipments together." },
    { promptEn: "Say what happens when you release a wave.", promptAr: "قول إيه اللي بيحصل لما تبعت wave.", model: "When I release a wave, the system creates work." },
    { promptEn: "Explain the order of work for a picker.", promptAr: "اشرح ترتيب شغل المجهّز.", model: "First, the picker opens the menu item. Then he does the pick work. Finally, he does the put work." }
  ],
  listenAr: "ركّز في الفيديو على كلمات الترتيب first و then و after that و finally، ولاحظ إزاي المتكلم بيقول when + جملة قبل النتيجة.",
  quiz: {
    mcq: [
      { q: "What is a wave in the warehouse system?", options: ["مجموعة شحنات بتتجهّز مع بعض", "نوع من الباليتات", "اسم المورّد", "تقرير الجرد"], answer: 0 },
      { q: "Choose the correct sentence.", options: ["When the wave will be released, work is created.", "When the wave released, work is created.", "When the wave is released, work is created.", "When the wave releases, work are created."], answer: 2 },
      { q: "Which word starts the LAST step?", options: ["First", "Finally", "Then", "Next"], answer: 1 },
      { q: "What does a location directive do?", options: ["بيطبع الملصقات", "بيعدّ الباليتات", "بيحسب تاريخ الصلاحية", "بيحدد ناخد الصنف منين ونحطه فين"], answer: 3 },
      { q: "What is put work?", options: ["Work to count stock", "Work to move items into a location", "Work to print labels", "Work to take items from a rack"], answer: 1 }
    ],
    fill: [
      { q: "When the worker ____ (finish) the pick work, he does the put work.", answer: "finishes" },
      { q: "First, the picker scans the label. ____ the picker takes the item.", answer: "Then", alt: ["Next", "After that"] },
      { q: "A ____ groups many shipments together.", answer: "wave" },
      { q: "The work ____ defines the steps for pick and put.", answer: "template" },
      { q: "Release to ____ sends the sales order to the floor.", answer: "warehouse" }
    ],
    trans: [
      { dir: "ar2en", q: "الـ work بيتعمل أوتوماتيك.", answer: "The work is created automatically." },
      { dir: "ar2en", q: "لما الشاحنة توصل، بنستلم الباليتات.", answer: "When the truck arrives, we receive the pallets." },
      { dir: "ar2en", q: "الـ pick work بيقول للعامل يروح فين.", answer: "The pick work tells the worker where to go." },
      { dir: "en2ar", q: "Replenishment work moves stock to the pick location.", answer: "الـ replenishment work بينقل المخزون لموقع التجهيز." },
      { dir: "en2ar", q: "Cycle counting work checks the stock in a location.", answer: "الـ cycle counting work بيراجع المخزون في موقع." }
    ],
    build: [
      { type: "order", q: "wave / the / First / create / we", answer: "First, we create the wave." },
      { type: "order", q: "arrives / When / the / truck / we / unload / it", answer: "When the truck arrives, we unload it." },
      { type: "write", q: "اكتب جملتين بكلمات الترتيب: الأول العامل يفتح بند القائمة، وبعدين ينفّذ الـ pick work.", answer: "مثال: First, the worker opens the menu item. Then he does the pick work." },
      { type: "reply", q: "Reply to: What is a wave?", answer: "A wave groups many shipments together. (أي إجابة قريبة تمام)" },
      { type: "reply", q: "Reply to: What does a location directive do?", answer: "It finds the best location. (أي إجابة قريبة تمام)" }
    ]
  }
};
