window.LESSONS = window.LESSONS || {};
window.LESSONS[7] = {
  id: 7,
  titleEn: "Receiving",
  titleAr: "الاستلام",
  goalAr: "في الدرس ده هتتعلم تستلم توريدة من السواق وتتكلم معاه بالإنجليزي: تراجع إذن التسليم وأمر الشراء، وتعدّ الكمية، وتبلّغ عن أي حاجة تالفة. وكمان هتتعلم تدّي أوامر قصيرة وتقول إيه اللي لازم يتعمل.",
  whyAr: "الاستلام هو أول خطوة في المخزن، وأي غلطة فيه بتكمّل في كل العمليات اللي بعده. لما تعرف تقول اللي لازم بوضوح للسواق، بتوفّر وقت وبتحمي الشركة من الخسارة.",
  canDo: [
    "أقدر أطلب من السواق يركّن ويدّيني إذن التسليم.",
    "أقدر أقول إن الكمية فيها فرق أو إن في كراتين تالفة.",
    "أقدر أدّي أمر قصير وأقول إيه اللي لازم يتعمل بـ must و have to."
  ],
  vocab: [
    { en: "truck", ar: "شاحنة / عربية نقل (تريلا)", pron: "*تْرَك*", pos: "n.", ex: "The truck is at the dock." },
    { en: "dock", ar: "رصيف التحميل والتفريغ", pron: "*دَاك*", pos: "n.", ex: "Please park at dock number three." },
    { en: "delivery note", ar: "إذن التسليم / إذن الاستلام", pron: "دِ-*لِڤ*-رِي *نُوت*", pos: "n.", ex: "The PO number is on the delivery note." },
    { en: "purchase order (PO)", ar: "أمر شراء (PO)", pron: "*پِر*-تْشِس *أُور*-دِر (پِي أُو)", pos: "n.", ex: "Check the quantity on the PO." },
    { en: "pallet", ar: "باليت (منصّة خشب للبضاعة)", pron: "*پَا*-لِت", pos: "n.", ex: "Each pallet has forty cartons." },
    { en: "carton", ar: "كرتونة / علبة كرتون", pron: "*كَار*-تِن", pos: "n.", ex: "There are forty cartons on this pallet." },
    { en: "quantity", ar: "كمية", pron: "*كْوُون*-تِ-تِي", pos: "n.", ex: "Is the quantity correct?" },
    { en: "damaged", ar: "تالف / مكسور / متضرر", pron: "*دَا*-مِجْد", pos: "adj.", ex: "Two cartons are damaged." },
    { en: "signature", ar: "توقيع / إمضاء", pron: "*سِگ*-نَ-تْشِر", pos: "n.", ex: "I need your signature here." },
    { en: "discrepancy", ar: "فرق / عدم تطابق (بين المكتوب والفعلي)", pron: "دِس-*كْرِپ*-أَنْ-سِي", pos: "n.", ex: "There is a discrepancy in the quantity." },
    { en: "receive", ar: "يستلم", pron: "رِ-*سِيڤ*", pos: "v.", ex: "We receive three trucks every day." },
    { en: "sign", ar: "يوقّع / يمضي", pron: "*سَايْن*", pos: "v.", ex: "Please sign the delivery note." },
    { en: "reject", ar: "يرفض / يرجّع (البضاعة)", pron: "رِ-*جِكْت*", pos: "v.", ex: "We reject damaged cartons." },
    { en: "goods", ar: "بضاعة", pron: "*گُودز*", pos: "n.", ex: "The goods are on dock two." }
  ],
  grammar: {
    titleEn: "Imperatives, must and have to",
    titleAr: "الأمر، و must / have to",
    introAr: "في الاستلام الوقت ضيق والسواق مستني، فبنتكلم بجمل قصيرة وواضحة. ده اسمه الأمر (imperative): بنقول الفعل زي ما هو من غير I أو You، زي Check the PO. ولو عايز تمنع حاجة بنقول Don't قبل الفعل، ولو عايز تبقى مؤدب بنقول Please. وعشان نقول إن حاجة لازم تحصل بنستخدم must أو have to، وبعدهم الفعل زي ما هو. خلّي بالك من الفرق: mustn't معناها ممنوع، لكن don't have to معناها مش لازم (مش إجباري).",
    points: [
      {
        headAr: "الأمر: الفعل لوحده",
        textAr: "عشان تدّي أمر، ابدأ بالفعل على طول من غير ضمير: Check, Count, Sign. وبعد الفعل قول الحاجة اللي عايزها. الجملة قصيرة وبتتفهم بسرعة حتى لو السواق مش بيتكلم إنجليزي كويس.",
        examples: [
          { en: "Check the delivery note.", ar: "راجع إذن التسليم." },
          { en: "Count the cartons on each pallet.", ar: "عدّ الكراتين على كل باليت." },
          { en: "Park at dock three.", ar: "ركّن عند رصيف تلاتة." }
        ]
      },
      {
        headAr: "Don't و Please",
        textAr: "للمنع بنقول Don't + الفعل. وللأدب بنزوّد Please في أول الجملة أو في آخرها. لما بتكلم السواق أو العميل، استخدم Please دايماً عشان الأمر ميبقاش جاف.",
        examples: [
          { en: "Don't unload the damaged pallet.", ar: "متفرّغش الباليت التالف." },
          { en: "Please sign here.", ar: "من فضلك وقّع هنا." },
          { en: "Wait here, please.", ar: "استنى هنا لو سمحت." }
        ]
      },
      {
        headAr: "must = لازم، و mustn't = ممنوع",
        textAr: "must معناها لازم، وبنستخدمها للقواعد والأمان. بعدها الفعل على طول من غير to، وشكلها واحد مع كل الضمائر: I must / he must / they must. والنفي mustn't معناه ممنوع.",
        examples: [
          { en: "We must check every delivery.", ar: "لازم نراجع كل توريدة." },
          { en: "You must wear safety shoes.", ar: "لازم تلبس جزمة سيفتي." },
          { en: "You mustn't smoke on the dock.", ar: "ممنوع التدخين على الرصيف." }
        ]
      },
      {
        headAr: "have to = لازم، و don't have to = مش لازم",
        textAr: "have to كمان معناها لازم، وبنستخدمها لما حاجة مطلوبة منك في الشغل. مع He / She / It بنقول has to. والنفي don't / doesn't have to معناه مش لازم، يعني مش إجباري. ده مختلف تماماً عن mustn't.",
        examples: [
          { en: "I have to sign the delivery note.", ar: "لازم أمضي على إذن التسليم." },
          { en: "Omar has to count the pallets.", ar: "عمر لازم يعدّ الباليتات." },
          { en: "You don't have to count empty pallets.", ar: "مش لازم تعدّ الباليتات الفاضية." }
        ]
      }
    ],
    table: {
      headers: ["Form", "Pattern", "Example"],
      rows: [
        ["Imperative", "Verb + object", "Check the PO."],
        ["Negative", "Don't + verb", "Don't open the carton."],
        ["Polite", "Please + verb", "Please sign here."],
        ["must", "must + verb", "We must count every pallet."],
        ["mustn't", "mustn't + verb", "You mustn't smoke here."],
        ["have to / has to", "have / has to + verb", "She has to sign."],
        ["don't have to", "don't / doesn't have to + verb", "You don't have to wait."]
      ]
    },
    mistakes: [
      { wrong: "You must to check the PO.", right: "You must check the PO.", noteAr: "بعد must بنكتب الفعل على طول من غير to." },
      { wrong: "You don't must smoke here.", right: "You mustn't smoke here.", noteAr: "النفي مع must هو mustn't. متقولش don't must." },
      { wrong: "He have to sign the note.", right: "He has to sign the note.", noteAr: "مع He / She / It بنقول has to مش have to." }
    ],
    tipAr: "قبل ما تبدأ الاستلام، قول لنفسك بصوت عالي 3 أوامر: Check the PO. Count the cartons. Sign here, please. وبعدين قول جملتين بـ must وجملة بـ don't have to، وسجّل صوتك وقارنه بالفيديو."
  },
  sentences: [
    { en: "The truck is at the dock.", ar: "الشاحنة عند الرصيف." },
    { en: "Check the delivery note and the PO.", ar: "راجع إذن التسليم وأمر الشراء." },
    { en: "Count the cartons on every pallet.", ar: "عدّ الكراتين على كل باليت." },
    { en: "The quantity on the PO is two hundred cartons.", ar: "الكمية في أمر الشراء ميتين كرتونة." },
    { en: "Two cartons are damaged.", ar: "كرتونتين تالفين." },
    { en: "There is a discrepancy in the quantity.", ar: "فيه فرق في الكمية." },
    { en: "Don't unload the damaged pallet.", ar: "متفرّغش الباليت التالف." },
    { en: "We must check every delivery.", ar: "لازم نراجع كل توريدة." },
    { en: "The driver has to sign the delivery note.", ar: "السواق لازم يوقّع على إذن التسليم." },
    { en: "You don't have to wait. Please sign here.", ar: "مش لازم تستنى. من فضلك وقّع هنا." }
  ],
  dialogue: {
    titleEn: "A delivery at dock three",
    sceneAr: "عمر بيستلم توريدة من السواق بيتر عند الرصيف.",
    lines: [
      { who: "Peter", en: "Good morning. I have a delivery for Nile Logistics.", ar: "صباح الخير. معايا توريدة لشركة Nile Logistics." },
      { who: "Omar", en: "Good morning. Please park at dock three.", ar: "صباح الخير. من فضلك ركّن عند رصيف تلاتة." },
      { who: "Peter", en: "OK. Here is the delivery note. The PO number is 4521.", ar: "تمام. ده إذن التسليم. رقم أمر الشراء 4521." },
      { who: "Omar", en: "Thank you. I have to check the quantity first.", ar: "شكراً. لازم أراجع الكمية الأول." },
      { who: "Peter", en: "Sure. There are ten pallets, with forty cartons on each.", ar: "أكيد. فيه عشر باليتات، وعلى كل واحد أربعين كرتونة." },
      { who: "Omar", en: "Wait. This pallet has two damaged cartons.", ar: "استنى. الباليت ده فيه كرتونتين تالفين." },
      { who: "Peter", en: "Oh, sorry. What do we do now?", ar: "آسف. نعمل إيه دلوقتي؟" },
      { who: "Omar", en: "I must write a discrepancy on the delivery note.", ar: "لازم أكتب الفرق ده على إذن التسليم." },
      { who: "Peter", en: "No problem. Where do I sign?", ar: "مفيش مشكلة. أمضي فين؟" },
      { who: "Omar", en: "Sign here, please. And write the date.", ar: "وقّع هنا لو سمحت. واكتب التاريخ." },
      { who: "Peter", en: "Done. Do I have to wait here?", ar: "خلصت. لازم أستنى هنا؟" },
      { who: "Omar", en: "No, you don't have to wait. Thank you, and drive safely!", ar: "لأ، مش لازم تستنى. شكراً، وسوق بالسلامة!" }
    ]
  },
  exBuild: [
    { words: ["the", "Check", "delivery", "note"], answer: "Check the delivery note." },
    { words: ["must", "We", "the", "count", "pallets"], answer: "We must count the pallets." },
    { words: ["sign", "Please", "here"], answer: "Please sign here." },
    { words: ["to", "has", "He", "sign", "the", "note"], answer: "He has to sign the note." },
    { words: ["unload", "Don't", "the", "damaged", "pallet"], answer: "Don't unload the damaged pallet." }
  ],
  exComplete: [
    { q: "____ the cartons on the pallet.", options: ["Count", "Counts", "Counting"], answer: "Count" },
    { q: "You ____ smoke on the dock. It is dangerous.", options: ["mustn't", "don't have to", "has to"], answer: "mustn't" },
    { q: "Omar ____ to sign the delivery note.", options: ["have", "has", "must"], answer: "has" },
    { q: "You ____ count empty pallets. They are not on the PO.", options: ["don't have to", "mustn't", "must"], answer: "don't have to" },
    { q: "____ unload the truck before you check the PO.", options: ["Don't", "Doesn't", "Not"], answer: "Don't" }
  ],
  exWrite: [
    { promptAr: "اطلب من السواق يركّن عند رصيف 2.", hint: "Please park at ...", model: "Please park at dock two." },
    { promptAr: "قول إن لازم تراجع إذن التسليم.", hint: "I have to ...", model: "I have to check the delivery note." },
    { promptAr: "قول إن في كرتونتين تالفين.", hint: "There are ...", model: "There are two damaged cartons." },
    { promptAr: "امنع زميلك يدخّن عند الرصيف.", hint: "You mustn't ...", model: "You mustn't smoke at the dock." },
    { promptAr: "اطلب من السواق يوقّع هنا.", hint: "Please sign ...", model: "Please sign here." }
  ],
  exTranslate: [
    { ar: "راجع الكمية على أمر الشراء.", en: "Check the quantity on the PO." },
    { ar: "لازم نعدّ كل باليت.", en: "We must count every pallet." },
    { ar: "متفتحش الكرتونة التالفة.", en: "Don't open the damaged carton." },
    { ar: "مش لازم تستنى هنا.", en: "You don't have to wait here." },
    { ar: "السواق لازم يوقّع على إذن التسليم.", en: "The driver has to sign the delivery note." },
    { ar: "فيه فرق في الكمية.", en: "There is a discrepancy in the quantity." }
  ],
  speak: [
    { promptEn: "Tell the driver where to park.", promptAr: "قول للسواق يركّن فين.", model: "Please park at dock three." },
    { promptEn: "Tell the driver about the damaged cartons.", promptAr: "قول للسواق إن في كراتين تالفة.", model: "Two cartons are damaged. I have to write it on the note." },
    { promptEn: "Ask the driver to sign.", promptAr: "اطلب من السواق يوقّع.", model: "Please sign the delivery note here." }
  ],
  listenAr: "ركّز في الفيديو على الأوامر القصيرة زي Check و Count و Sign، وعلى الفرق في النطق بين must و mustn't.",
  quiz: {
    mcq: [
      { q: "Choose the correct sentence.", options: ["You must to check the PO.", "You must check the PO.", "You must checks the PO.", "You must checking the PO."], answer: 1 },
      { q: "What does 'discrepancy' mean?", options: ["رصيف التحميل", "توقيع", "فرق أو عدم تطابق", "كرتونة"], answer: 2 },
      { q: "Which sentence means: ممنوع تركّن هنا؟", options: ["You don't have to park here.", "You must park here.", "You have to park here.", "You mustn't park here."], answer: 3 },
      { q: "He ____ to wait at the dock.", options: ["has", "have", "must", "does"], answer: 0 },
      { q: "Which sentence is a polite request to the driver?", options: ["Sign here now!", "Please sign here.", "You sign here.", "Signing here."], answer: 1 }
    ],
    fill: [
      { q: "Please ____ here, Peter. I need your signature.", answer: "sign" },
      { q: "We ____ check every pallet. It is a company rule.", answer: "must", alt: ["have to"] },
      { q: "Omar ____ to count the cartons.", answer: "has" },
      { q: "The ____ on the PO is 200 cartons.", answer: "quantity" },
      { q: "You ____ smoke on the dock. It is not allowed.", answer: "mustn't", alt: ["must not"] }
    ],
    trans: [
      { dir: "ar2en", q: "لازم نراجع الكمية.", answer: "We must check the quantity. (أو: We have to check the quantity.)" },
      { dir: "ar2en", q: "متركّنش عند رصيف تلاتة.", answer: "Don't park at dock three." },
      { dir: "ar2en", q: "السواق مش لازم يستنى.", answer: "The driver doesn't have to wait." },
      { dir: "en2ar", q: "The goods are on dock two.", answer: "البضاعة على رصيف اتنين." },
      { dir: "en2ar", q: "There is a discrepancy.", answer: "فيه فرق (أو: عدم تطابق)." }
    ],
    build: [
      { type: "order", q: "pallets / the / Count", answer: "Count the pallets." },
      { type: "order", q: "have / to / I / sign", answer: "I have to sign." },
      { type: "write", q: "اكتب جملة تقول فيها إن في كرتونتين تالفين.", answer: "مثال: Two cartons are damaged." },
      { type: "reply", q: "Reply to: Do I have to wait here?", answer: "No, you don't have to wait. (أو: Yes, please wait here.)" },
      { type: "reply", q: "Reply to: Where do I sign?", answer: "Sign here, please." }
    ]
  }
};
