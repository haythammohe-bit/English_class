window.LESSONS = window.LESSONS || {};
window.LESSONS[12] = {
  id: 12,
  titleEn: "Inventory Management",
  titleAr: "إدارة المخزون",
  goalAr: "في الدرس ده هتتعلم تتكلم عن كمية البضاعة الموجودة في المخزن، وتقول إيه اللي قرّب يخلص وإيه اللي لازم نطلبه. وهتعرف تناقش مع مراقب المخزون مستوى المخزون وتاريخ الصلاحية بجمل بسيطة وواضحة.",
  whyAr: "المشرف الشاطر مش بس بيجهّز الطلبات، ده كمان بيعرف إيه الموجود وإيه اللي هيخلص. لو البضاعة خلصت قبل ما نطلب، العميل بيستنى والشغل بيقف.",
  canDo: [
    "أقدر أقول كام وحدة موجودة عندنا من أي صنف.",
    "أقدر أقارن بين كميتين وأقول إيه الأكتر وإيه الأقل.",
    "أقدر أقول إيه اللي لازم نعمله دلوقتي بـ need to و should."
  ],
  vocab: [
    { en: "inventory", ar: "المخزون / الجرد", pron: "*إِن*-ڤِن-تُو-رِي", pos: "n.", ex: "Sara checks the inventory every morning." },
    { en: "stock level", ar: "مستوى المخزون (الكمية الموجودة)", pron: "*سْتَاك* *لِ*-ڤِل", pos: "n.", ex: "The stock level is low today." },
    { en: "on hand", ar: "موجود فعلاً في المخزن", pron: "أُون *هَاند*", pos: "phr.", ex: "We have 200 cartons on hand." },
    { en: "reorder point", ar: "نقطة إعادة الطلب (لما نوصلها لازم نطلب)", pron: "رِي-*أُور*-دِر *پُوينت*", pos: "n.", ex: "The reorder point for this SKU is 50." },
    { en: "safety stock", ar: "مخزون الأمان (احتياطي للطوارئ)", pron: "*سَيْف*-تِي *سْتَاك*", pos: "n.", ex: "We keep safety stock for important items." },
    { en: "cycle count", ar: "جرد دوري (جرد جزء من المخزن كل فترة)", pron: "*سَاي*-كِل *كَاونت*", pos: "n.", ex: "We do a cycle count every Thursday." },
    { en: "accuracy", ar: "الدقة", pron: "*أَ*-كْيُو-رَ-سِي", pos: "n.", ex: "Our inventory accuracy is 98% this month." },
    { en: "expiry date", ar: "تاريخ الصلاحية", pron: "إِك-*سْپَاي*-رِي *دَيْت*", pos: "n.", ex: "Check the expiry date before you ship." },
    { en: "FIFO", ar: "الداخل أولاً يخرج أولاً", pron: "*فَاي*-فُو", pos: "abbr.", ex: "We use FIFO for all food products." },
    { en: "replenish", ar: "يعبّي / يعوّض النقص", pron: "رِ-*پْلِ*-نِش", pos: "v.", ex: "We replenish the picking area every night." },
    { en: "out of stock", ar: "خلصان / مفيش منه في المخزن", pron: "*آوت* أَڤ *سْتَاك*", pos: "phr.", ex: "This item is out of stock." },
    { en: "run out of", ar: "يخلص / الكمية تخلص", pron: "*رَن* *آوت* أَڤ", pos: "phr.", ex: "We will run out of tape tomorrow." },
    { en: "minimum", ar: "الحد الأدنى", pron: "*مِ*-نِ-مَم", pos: "n.", ex: "The minimum for this SKU is 20 cartons." },
    { en: "enough", ar: "كفاية", pron: "إِ-*نَف*", pos: "adj.", ex: "We have enough stock for two weeks." },
    { en: "low", ar: "قليل / واطي", pron: "*لُو*", pos: "adj.", ex: "The stock of labels is low." }
  ],
  grammar: {
    titleEn: "There is / There are, more than / less than, need to / should",
    titleAr: "there is / there are مع الأرقام، والمقارنة، وneed to / should",
    introAr: "لما بنتكلم عن المخزون، أول سؤال هو: كام وحدة موجودة؟ عشان كده بنستخدم there is و there are مع الأرقام. بعد كده بنقارن بين الكميات بـ more than (أكتر من) و less than (أقل من). وفي الآخر بنقول إيه اللي لازم يتعمل: need to معناها محتاج، و should معناها المفروض أو الأحسن. التلات حاجات دول هيخلّوك تشرح لسارة أو لمنى الوضع في المخزن وإيه الخطوة الجاية بجمل بسيطة وواضحة.",
    points: [
      {
        headAr: "there is / there are مع الأرقام",
        textAr: "بنقول there is مع حاجة واحدة أو حاجة مش بتتعد زي stock. وبنقول there are مع أكتر من واحدة زي 120 cartons. وللسؤال بنقول How many … are there؟ أو Is there …؟ وكلمة left هنا معناها فاضل.",
        examples: [
          { en: "There are 120 cartons on hand.", ar: "فيه 120 كرتونة موجودة." },
          { en: "There is one pallet left.", ar: "فاضل باليت واحد." },
          { en: "How many pallets are there?", ar: "فيه كام باليت؟" }
        ]
      },
      {
        headAr: "more than / less than",
        textAr: "more than معناها أكتر من، و less than معناها أقل من، و the same as معناها زي. بنحط بعدهم رقم أو اسم. مع الحاجات اللي بتتعد ممكن تسمع fewer than كمان، لكن less than بتتقال كتير في الكلام العادي.",
        examples: [
          { en: "We have more than 500 units on hand.", ar: "عندنا أكتر من 500 وحدة موجودة." },
          { en: "Stock is less than the reorder point.", ar: "المخزون أقل من نقطة إعادة الطلب." },
          { en: "There are fewer than ten cartons left.", ar: "فاضل أقل من عشر كراتين." }
        ]
      },
      {
        headAr: "need to: محتاج / لازم",
        textAr: "بنقول need to + الفعل: We need to order more. ومع he / she / it بنقول needs to. وللنفي بنقول don't need to أو doesn't need to، ومعناها مش لازم.",
        examples: [
          { en: "We need to replenish the picking area.", ar: "محتاجين نعبّي منطقة التجهيز." },
          { en: "Sara needs to check the expiry dates.", ar: "سارة محتاجة تراجع تواريخ الصلاحية." },
          { en: "We don't need to order today.", ar: "مش لازم نطلب النهارده." }
        ]
      },
      {
        headAr: "should: المفروض / الأحسن",
        textAr: "بنستخدم should لما ننصح حد أو نقول الصح إيه. بعدها بنحط الفعل على طول من غير to ومن غير s. وللنفي بنقول shouldn't، وللسؤال بنقول Should we …؟",
        examples: [
          { en: "We should order more tape today.", ar: "المفروض نطلب شريط لاصق أكتر النهارده." },
          { en: "We shouldn't ship new stock first.", ar: "ما ينفعش نشحن البضاعة الجديدة الأول." },
          { en: "Should we reorder now?", ar: "نعيد الطلب دلوقتي؟" }
        ]
      }
    ],
    table: {
      headers: ["Pattern", "Use", "Example"],
      rows: [
        ["There is + one / uncountable", "one thing or an amount", "There is one pallet left."],
        ["There are + number", "more than one", "There are 40 boxes on hand."],
        ["more than / less than", "compare amounts", "We have more than 50 units."],
        ["need(s) to + verb", "it is necessary", "We need to reorder today."],
        ["don't need to + verb", "it is not necessary", "We don't need to reorder."],
        ["should + verb", "advice, the right thing", "You should count it again."],
        ["Should we + verb?", "ask for advice", "Should we replenish now?"]
      ]
    },
    mistakes: [
      { wrong: "There is 120 cartons on hand.", right: "There are 120 cartons on hand.", noteAr: "مع أكتر من واحد بنقول there are مش there is." },
      { wrong: "We need order more tape.", right: "We need to order more tape.", noteAr: "لازم to بين need والفعل." },
      { wrong: "We should to count again.", right: "We should count again.", noteAr: "بعد should بنحط الفعل على طول من غير to." }
    ],
    tipAr: "كل يوم بصّ على 3 حاجات حواليك في الشغل وقول عنهم بصوت عالي: There are … / There is … / We need to … وجرّب تقارن بين مكانين: This shelf has more than that shelf."
  },
  sentences: [
    { en: "There are 200 cartons on hand.", ar: "فيه 200 كرتونة موجودة في المخزن." },
    { en: "The stock level is low today.", ar: "مستوى المخزون النهارده قليل." },
    { en: "Stock is less than the reorder point.", ar: "المخزون أقل من نقطة إعادة الطلب." },
    { en: "We keep safety stock for important items.", ar: "بنحتفظ بمخزون أمان للأصناف المهمة." },
    { en: "Sara does a cycle count every Thursday.", ar: "سارة بتعمل جرد دوري كل يوم خميس." },
    { en: "Our inventory accuracy is more than 98%.", ar: "دقة المخزون عندنا أكتر من 98%." },
    { en: "You should check the expiry date first.", ar: "المفروض تراجع تاريخ الصلاحية الأول." },
    { en: "We use FIFO, so old stock goes first.", ar: "بنستخدم FIFO، فالبضاعة القديمة بتخرج الأول." },
    { en: "We need to replenish the picking area.", ar: "محتاجين نعبّي منطقة التجهيز." },
    { en: "We will run out of labels tomorrow.", ar: "الملصقات هتخلص بكرة." }
  ],
  dialogue: {
    titleEn: "Checking stock for tomorrow",
    sceneAr: "سارة (مراقبة المخزون) بتراجع الكميات الصبح وبتعرّف أحمد على الأصناف اللي قربت تخلص.",
    lines: [
      { who: "Ahmed", en: "Good morning, Sara. How is the stock today?", ar: "صباح الخير يا سارة. المخزون عامل إيه النهارده؟" },
      { who: "Sara", en: "Good morning. Most stock levels are fine, but SKU 4120 is low.", ar: "صباح النور. أغلب مستويات المخزون تمام، بس الصنف 4120 قليل." },
      { who: "Ahmed", en: "How many cartons are there on hand?", ar: "فيه كام كرتونة موجودة؟" },
      { who: "Sara", en: "There are only 30 cartons. The reorder point is 50.", ar: "فيه 30 كرتونة بس. نقطة إعادة الطلب 50." },
      { who: "Ahmed", en: "That is less than the reorder point. We need to order more.", ar: "ده أقل من نقطة إعادة الطلب. لازم نطلب أكتر." },
      { who: "Sara", en: "Yes. We should use the safety stock for now.", ar: "أيوه. المفروض نستخدم مخزون الأمان دلوقتي." },
      { who: "Ahmed", en: "Good idea. Please check the expiry dates on the food items.", ar: "فكرة كويسة. راجعي تواريخ الصلاحية على الأصناف الغذائية لو سمحتي." },
      { who: "Sara", en: "Two pallets have an early expiry date. We should ship them first.", ar: "فيه باليتين تاريخ صلاحيتهم قريب. المفروض نشحنهم الأول." },
      { who: "Ahmed", en: "Right. That is FIFO. Do we have enough stock for Friday?", ar: "صح. ده الـ FIFO. هو عندنا مخزون كفاية ليوم الجمعة؟" },
      { who: "Sara", en: "Yes, we have more than enough. I will do a cycle count today.", ar: "أيوه، عندنا أكتر من كفاية. هعمل جرد دوري النهارده." },
      { who: "Ahmed", en: "Thanks, Sara. Our inventory accuracy is very good.", ar: "شكراً يا سارة. دقة المخزون عندنا كويسة جداً." }
    ]
  },
  exBuild: [
    { words: ["are", "There", "on", "50", "cartons", "hand"], answer: "There are 50 cartons on hand." },
    { words: ["need", "We", "to", "more", "order"], answer: "We need to order more." },
    { words: ["less", "is", "Stock", "than", "the", "minimum"], answer: "Stock is less than the minimum." },
    { words: ["should", "check", "You", "the", "expiry", "date"], answer: "You should check the expiry date." },
    { words: ["use", "We", "FIFO", "for", "food"], answer: "We use FIFO for food." }
  ],
  exComplete: [
    { q: "There ____ 40 pallets in the warehouse.", options: ["are", "is", "be"], answer: "are" },
    { q: "We have ____ than 100 units on hand.", options: ["more", "most", "many"], answer: "more" },
    { q: "We need ____ replenish the picking area.", options: ["to", "for", "should"], answer: "to" },
    { q: "Sara ____ to do a cycle count.", options: ["need", "needs", "should"], answer: "needs" },
    { q: "This item is out ____ stock.", options: ["of", "from", "in"], answer: "of" }
  ],
  exWrite: [
    { promptAr: "قول إن فيه 120 كرتونة موجودة.", hint: "There are ... on hand.", model: "There are 120 cartons on hand." },
    { promptAr: "قول إن المخزون أقل من الحد الأدنى.", hint: "Stock is less than ...", model: "Stock is less than the minimum." },
    { promptAr: "قول إنكم محتاجين تطلبوا كمية أكتر.", hint: "We need to ...", model: "We need to order more items." },
    { promptAr: "انصح زميلك يراجع تاريخ الصلاحية.", hint: "You should ...", model: "You should check the expiry date." },
    { promptAr: "اسأل: فيه كام باليت في المخزن؟", hint: "How many ... are there ...?", model: "How many pallets are there in the warehouse?" }
  ],
  exTranslate: [
    { ar: "فيه خمسين وحدة موجودة.", en: "There are fifty units on hand." },
    { ar: "المخزون النهارده قليل.", en: "The stock is low today." },
    { ar: "محتاجين نطلب أكتر.", en: "We need to order more." },
    { ar: "لازم نستخدم FIFO.", en: "We need to use FIFO." },
    { ar: "الصنف ده خلصان.", en: "This item is out of stock." },
    { ar: "عندنا أكتر من 500 وحدة.", en: "We have more than 500 units." }
  ],
  speak: [
    { promptEn: "Tell Sara how many cartons are on hand.", promptAr: "قول لسارة فيه كام كرتونة موجودة.", model: "There are ... cartons on hand." },
    { promptEn: "Say that stock is lower than the reorder point.", promptAr: "قول إن المخزون أقل من نقطة إعادة الطلب.", model: "Stock is less than the reorder point. We need to order more." },
    { promptEn: "Advise a picker about expiry dates and FIFO.", promptAr: "انصح مجهّز طلبات عن تواريخ الصلاحية والـ FIFO.", model: "You should check the expiry date. We use FIFO." }
  ],
  listenAr: "ركّز في الفيديو على الأرقام وعلى كلمتي need to و should، ولاحظ إزاي المتكلم بيقول there are مع الكميات.",
  quiz: {
    mcq: [
      { q: "Choose the correct sentence.", options: ["There is five pallets.", "There are five pallets.", "There be five pallets.", "Is five pallets."], answer: 1 },
      { q: "What does 'safety stock' mean?", options: ["مخزون احتياطي بنحتفظ بيه للطوارئ", "بضاعة تالفة", "بضاعة جديدة وصلت النهارده", "جرد كل المخزن في يوم واحد"], answer: 0 },
      { q: "We ____ to reorder this item today.", options: ["should", "needs", "need", "are need"], answer: 2 },
      { q: "The stock is 30. The minimum is 50. Which sentence is correct?", options: ["Stock is more than the minimum.", "Stock is the same as the minimum.", "Stock is much more than we need.", "Stock is less than the minimum."], answer: 3 },
      { q: "What does FIFO mean?", options: ["Ship the newest stock first.", "The oldest stock goes out first.", "Count the stock every day.", "Order more safety stock."], answer: 1 }
    ],
    fill: [
      { q: "There ____ 300 cartons on hand.", answer: "are" },
      { q: "The stock is ____ than the reorder point.", answer: "less", alt: ["lower"] },
      { q: "____ means first in, first out.", answer: "FIFO", alt: ["fifo"] },
      { q: "Mona ____ to approve the order.", answer: "needs", alt: ["has"] },
      { q: "Check the ____ date on the yogurt.", answer: "expiry" }
    ],
    trans: [
      { dir: "ar2en", q: "فيه 20 باليت في المخزن.", answer: "There are 20 pallets in the warehouse." },
      { dir: "ar2en", q: "لازم نطلب بضاعة جديدة.", answer: "We need to order new stock." },
      { dir: "ar2en", q: "المفروض نبدأ بالبضاعة القديمة.", answer: "We should start with the old stock." },
      { dir: "en2ar", q: "The stock level is low.", answer: "مستوى المخزون قليل." },
      { dir: "en2ar", q: "We will run out of tape tomorrow.", answer: "الشريط اللاصق هيخلص بكرة." }
    ],
    build: [
      { type: "order", q: "need / We / to / reorder", answer: "We need to reorder." },
      { type: "order", q: "more / than / have / We / 100 / units", answer: "We have more than 100 units." },
      { type: "write", q: "اكتب جملة بتقول إن فيه 15 باليت موجودة.", answer: "مثال: There are 15 pallets on hand." },
      { type: "reply", q: "Reply to: How many cartons are there on hand?", answer: "There are ... cartons on hand. (أي رقم تمام)" },
      { type: "reply", q: "Reply to: Should we order more tape?", answer: "Yes, we should. (أو: No, we shouldn't.)" }
    ]
  }
};
