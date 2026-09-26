/*
 * Seating data, transcribed from "הושבה - Sheet1.pdf".
 * Each guest row: [partySize, originalName, ...otherSpellings]
 * The first name is exactly as written in the sheet. The others are
 * transliterations into the other two scripts so search works across languages.
 * "sheetTotal" is the total printed in the sheet, used to verify transcription.
 */
var SEATING = (function () {
  var LABELS = {
    shared: { he: "חברים משותפים", ar: "أصدقاء مشتركون", en: "Shared friends" },
    family: { he: "משפחה", ar: "العائلة", en: "Family" },
    friendsJohnny: { he: "חברים - ג'וני", ar: "أصدقاء - جوني", en: "Friends - Johnny" },
    neighborsJohnny: { he: "שכנים + חברים - ג'וני", ar: "جيران وأصدقاء - جوني", en: "Neighbors & friends - Johnny" },
    sandraRoxan: { he: "סנדרה ורוקסן", ar: "ساندرا وروكسان", en: "Sandra & Roxanne" },
    nahasDabbagh: { he: "נחאס ודבאג'", ar: "نحاس ودباغ", en: "Nahas & Dabbagh" },
    turaan: { he: "טורעאן", ar: "طرعان", en: "Turaan" },
    afara: { he: "עפארה + חווא ואסחאק", ar: "عفارة + حوا واسحق", en: "Afara + Hawa & Ishak" },
    hourani: { he: "חוראני, אסחאק וחדאד", ar: "حوراني، اسحق وحداد", en: "Hourani, Ishak & Haddad" },
    karlaWork: { he: "קרלא - עבודה", ar: "كارلا - العمل", en: "Karla - work" },
    friendsRA: { he: "חברים - רוקסאן ואניס", ar: "أصدقاء - روكسان وأنيس", en: "Friends - Roxanne & Anis" }
  };

  var SIDES = {
    shared: { he: "משותף", ar: "مشترك", en: "Shared" },
    karla: { he: "קרלא", ar: "كارلا", en: "Karla" },
    charlie: { he: "צ'רלי", ar: "تشارلي", en: "Charlie" }
  };

  // id, side, labelKey (or null), sheetTotal, rows
  var RAW = [
    // ---------- Knight tables (24) - shared friends ----------
    [7, "shared", "shared", 23, [
      [1, "ROZEEN", "روزين", "רוזין"],
      [1, "POLIANA", "بوليانا", "פוליאנה"],
      [1, "JEZAL", "جيزال", "ג'יזאל"],
      [1, "CLAUDE", "كلود", "קלוד"],
      [1, "MIKHA", "ميخا", "מיכה"],
      [1, "AYA", "اية", "איה"],
      [1, "NABEEL", "نبيل", "נביל"],
      [2, "AHMAD", "احمد", "אחמד"],
      [1, "SHIREEN", "شيرين", "שירין"],
      [1, "KAREEN", "كارين", "קארין"],
      [1, "MOAD", "معاذ", "מועאד"],
      [2, "saher", "ساهر", "סאהר"],
      [2, "HANAN", "حنان", "חנאן"],
      [2, "MARIA", "ماريا", "מריה"],
      [1, "WADI", "وديع", "ודיע"],
      [2, "DEEMA", "ديما", "דימה"],
      [2, "ASAAD", "اسعد", "אסעד"]
    ]],
    [10, "shared", "shared", 23, [
      [2, "MAHMOUD", "محمود", "מחמוד"],
      [2, "NAMIR", "نمير", "נמיר"],
      [2, "ALI", "علي", "עלי"],
      [1, "AMIR", "امير", "אמיר"],
      [1, "YOHAN", "يوحان", "יוחאן"],
      [1, "FADI MARROUSHI", "فادي مروشي", "פאדי מרושי"],
      [1, "NOUR", "نور", "נור"],
      [1, "HAROUT", "هاروت", "הארות"],
      [1, "WAEL", "وائل", "ואאל"],
      [1, "MIKE", "مايك", "מייק"],
      [2, "Ziko", "زيكو", "זיקו"],
      [2, "Rani", "راني", "ראני"],
      [2, "Ahmad nashef", "احمد ناشف", "אחמד נאשף"],
      [2, "Bayan", "بيان", "ביאן"],
      [1, "aya harzan", "اية حرزان", "איה חרזאן"],
      [1, "johny marshi", "جوني مرشي", "ג'וני מרשי"]
    ]],

    // ---------- Knight tables (24) - Karla ----------
    [12, "karla", "sandraRoxan", 23, [
      [2, "ساندرا بركات", "סנדרה ברכאת", "Sandra Barakat"],
      [2, "روكسان بركات", "רוקסן ברכאת", "Roxanne Barakat"],
      [2, "וסים חורי", "وسيم خوري", "Wasim Khoury"],
      [2, "רמי כסאברי", "رامي كسابري", "Rami Kassabri"],
      [2, "כמאל ניקולה", "كمال نقولا", "Kamal Nicola"],
      [2, "חלים טנוס", "حليم طنوس", "Halim Tannous"],
      [2, "פואד טנוס", "فؤاد طنوس", "Fouad Tannous"],
      [4, "עבדו בדארנה", "عبدو بدارنة", "Abdo Badarneh"],
      [2, "גריס גומעא", "جريس جمعة", "Jeries Jomaa"],
      [3, "גסאן חקעובה", "غسان حقعوبة", "Ghassan Haqouba"]
    ]],
    [8, "karla", "nahasDabbagh", 25, [
      [2, "רנדה נחאס", "رندة نحاس", "Randa Nahas"],
      [3, "גברא נחאס", "جبرا نحاس", "Jabra Nahas"],
      [2, "טוני נחאס", "طوني نحاس", "Tony Nahas"],
      [3, "אמיר דבאג", "امير دباغ", "Amir Dabbagh"],
      [2, "נביל דבאג", "نبيل دباغ", "Nabil Dabbagh"],
      [3, "גורג דבאג", "جورج دباغ", "George Dabbagh"],
      [1, "טארק מור", "طارق مور", "Tarek Mor"],
      [1, "רינה נעמה", "رينا نعمة", "Rina Naameh"],
      [1, "טרז דבאג", "تريز دباغ", "Therese Dabbagh"],
      [1, "נואל דבאג", "نويل دباغ", "Noel Dabbagh"],
      [2, "תופיק גבריס", "توفيق جبريس", "Toufic Jabris"],
      [2, "מטאנס זקנון", "مطانس زكنون", "Mtanes Zaknoun"],
      [1, "טוני גוליאנוס", "طوني جوليانوس", "Tony Julianos"],
      [1, "וירה נחאס", "فيرا نحاس", "Vera Nahas"]
    ]],
    [6, "karla", "friendsJohnny", 25, [
      [2, "נסים סויד", "نسيم سويد", "Nasim Sweid"],
      [3, "מקאריוס עיסא", "مكاريوس عيسى", "Makarios Issa"],
      [2, "יוסף סעד", "يوسف سعد", "Yousef Saad"],
      [3, "עיסאם סעד", "عصام سعد", "Issam Saad"],
      [1, "פואד סעד - עיסאם", "فؤاد سعد - عصام", "Fouad Saad - Issam"],
      [2, "טוני ניגם", "طوني نجم", "Tony Najem"],
      [2, "פריד שולי", "فريد شولي", "Farid Shouli"],
      [2, "שמשום שמשם", "شمشوم شمشم", "Shamshoum Shamsham"],
      [4, "איליא עבליני", "ايليا عبليني", "Elia Abelini"],
      [2, "גוסלין חמאתי", "جوسلين حماتي", "Josline Hamati"],
      [2, "בשארה חמאתי", "بشارة حماتي", "Bishara Hamati"]
    ]],
    [5, "karla", "family", 22, [
      [2, "פיטר שחאדי", "بيتر شحادي", "Peter Shehadi"],
      [4, "יוסף אסקנדר", "يوسف اسكندر", "Yousef Iskandar"],
      [1, "נרדין ברכאת", "نردين بركات", "Nardin Barakat"],
      [2, "בולוס ברכקת", "بولس بركات", "Boulos Barakat", "בולוס ברכאת"],
      [2, "נאדר ברכאת", "نادر بركات", "Nader Barakat"],
      [2, "בשיר ברכאת", "بشير بركات", "Bashir Barakat"],
      [1, "ריני ברכאת", "ريني بركات", "Rini Barakat"],
      [2, "סאמר בנימין", "سامر بنيامين", "Samer Binyamin"],
      [1, "חסיב סמיר", "حسيب سمير", "Hasib Samir"],
      [2, "בשיר ונאדיה ברכאת", "بشير ونادية بركات", "Bashir & Nadia Barakat"],
      [2, "אליאס ברכאת", "الياس بركات", "Elias Barakat"],
      [1, "חנאן חורי", "حنان خوري", "Hanan Khoury"]
    ]],
    [1, "karla", "turaan", 26, [
      [1, "אוסאמה חורי", "اسامة خوري", "Osama Khoury"],
      [2, "פואד עביד", "فؤاد عبيد", "Fouad Obeid"],
      [2, "רוסתום עביד", "رستم عبيد", "Rostom Obeid"],
      [2, "האני עוביד", "هاني عبيد", "Hani Obeid"],
      [2, "נביל ימין", "نبيل يمين", "Nabil Yamin"],
      [2, "בסאם סלאמה", "بسام سلامة", "Bassam Salameh"],
      [2, "אדיב (אסעד עוביד)", "اديب (اسعد عبيد)", "Adib (Asaad Obeid)"],
      [2, "אדיב עוביד", "اديب عبيد", "Adib Obeid"],
      [2, "נאסר שקור", "ناصر شكور", "Nasser Shakour"],
      [2, "ד\"ר אסעד חורי", "د. اسعد خوري", "Dr. Asaad Khoury"],
      [2, "SALLY", "سالي", "סאלי"],
      [2, "MARWA", "مروة", "מרווה"],
      [1, "REEMA", "ريما", "רימה"],
      [1, "ALAA", "علاء", "עלאא"],
      [1, "aya", "اية", "איה"]
    ]],

    // ---------- Round tables (12) - Karla ----------
    [16, "karla", "friendsJohnny", 12, [
      [2, "רפיק סליבא", "رفيق صليبا", "Rafik Saliba"],
      [2, "כמאל גרגורה", "كمال جرجورة", "Kamal Jarjoura"],
      [2, "מרואן אבו חדרה", "مروان ابو حضرة", "Marwan Abu Hadra"],
      [2, "סמי נאסר", "سامي ناصر", "Sami Nasser"],
      [2, "חליל אבו חדרה", "خليل ابو حضرة", "Khalil Abu Hadra"],
      [2, "וליד נגאר", "وليد نجار", "Walid Najjar"]
    ]],
    [21, "karla", "neighborsJohnny", 12, [
      [2, "סאמר גבארין", "سامر جبارين", "Samer Jabareen"],
      [2, "בדר טבאגה", "بدر طباجة", "Badr Tabaja"],
      [2, "ויאאם חגיר", "وئام حجير", "Weam Hjeir"],
      [2, "עלאא סאמרי", "علاء سامري", "Alaa Samri"],
      [2, "עדנאן אבו כיאס", "عدنان ابو كياس", "Adnan Abu Kayyas"],
      [2, "סרור גרוס", "سرور جروس", "Srour Jarous"]
    ]],
    [18, "karla", "friendsJohnny", 12, [
      [2, "חסן אבו גאמע", "حسن ابو جامع", "Hasan Abu Jamea"],
      [2, "אדם חרבט", "ادم حربط", "Adam Harbat"],
      [2, "עלי חרבט", "علي حربط", "Ali Harbat"],
      [2, "גלאל חרבט", "جلال حربط", "Jalal Harbat"],
      [2, "aseel", "اسيل", "אסיל"],
      [2, "מיכה בירם", "ميخا بيرم", "Mikha Biram"]
    ]],
    [13, "karla", "afara", 12, [
      [1, "מרוות עפארה", "مروات عفارة", "Marwat Afara"],
      [1, "סוזאן עפארה", "سوزان عفارة", "Suzan Afara"],
      [2, "גבי עפארה", "جابي عفارة", "Gaby Afara"],
      [2, "אלכס נעמה", "اليكس نعمة", "Alex Naameh"],
      [3, "רמי חווא", "رامي حوا", "Rami Hawa"],
      [3, "עבדאללה אסחאק", "عبدالله اسحق", "Abdallah Ishak"]
    ]],
    [25, "karla", "hourani", 12, [
      [2, "ויליאם גהשאן", "وليم جهشان", "William Jahshan"],
      [2, "רביע בתריס", "ربيع بتريس", "Rabia Batris"],
      [2, "אדוארד חדאד", "ادوارد حداد", "Edward Haddad"],
      [2, "אדוארד אסחאק", "ادوارد اسحق", "Edward Ishak"],
      [2, "ויקטור חוראני", "فيكتور حوراني", "Victor Hourani"],
      [2, "דאוד חוראני", "داود حوراني", "Daoud Hourani"]
    ]],
    [23, "karla", "karlaWork", 13, [
      [1, "LIOR", "ليئور", "ליאור"],
      [1, "ESTI", "استي", "אסתי"],
      [1, "RASHA", "رشا", "רשא"],
      [1, "LAYAN", "ليان", "ליאן"],
      [1, "SHADEN", "شادن", "שאדן"],
      [1, "SONDOS", "سندس", "סונדוס"],
      [1, "WALEED", "وليد", "וליד"],
      [1, "gaby", "جابي", "גבי"],
      [1, "omri", "عمري", "עמרי"],
      [2, "Maisam", "ميسم", "מייסם"],
      [1, "Nedaa", "نداء", "נדאא"],
      [1, "basel", "باسل", "באסל"]
    ]],
    [27, "karla", "friendsRA", 12, [
      [1, "Fares", "فارس", "פארס"],
      [1, "Osama", "اسامة", "אוסאמה"],
      [2, "tamer kheiralla", "تامر خيرالله", "תאמר חיראללה"],
      [2, "maher kheiralla", "ماهر خيرالله", "מאהר חיראללה"],
      [2, "reem", "ريم", "רים"],
      [2, "ayoub", "ايوب", "איוב"],
      [2, "loai", "لؤي", "לואי"]
    ]],

    // ---------- Knight tables (24) - Charlie ----------
    [2, "charlie", "family", 24, [
      [2, "امير وهلانه سروع", "אמיר והלאנה סרוע", "Amir & Hlaneh Sarou"],
      [2, "جاني سروع", "ג'אני סרוע", "Jani Sarou"],
      [3, "شكرالله سروع", "שוכראללה סרוע", "Shukrallah Sarou"],
      [2, "نظير سروع", "נזיר סרוע", "Nazir Sarou"],
      [4, "جيمي وامل سروع", "ג'ימי ואמל סרוע", "Jimmy & Amal Sarou"],
      [2, "مجيد جورج سروع", "מג'יד ג'ורג' סרוע", "Majid George Sarou"],
      [2, "مارون جورج سروع", "מארון ג'ורג' סרוע", "Maroun George Sarou"],
      [2, "نور وميخا عيسى", "נור ומיכה עיסא", "Nour & Mikha Issa"],
      [1, "حنا حبيب عيسى", "חנא חביב עיסא", "Hanna Habib Issa"],
      [2, "شاكر ابو فارس", "שאכר אבו פארס", "Shaker Abu Fares"],
      [2, "الياس سروع", "אליאס סרוע", "Elias Sarou"]
    ]],
    [3, "charlie", "family", 24, [
      [2, "بطرس وفيرا فرحات", "בוטרוס ופירה פרחאת", "Boutros & Vera Farhat"],
      [1, "مارون يعقوب", "מארון יעקוב", "Maroun Yacoub"],
      [2, "بطرس سعيد عيسى", "בוטרוס סעיד עיסא", "Boutros Said Issa"],
      [2, "يامن يعقوب", "יאמן יעקוב", "Yamen Yacoub"],
      [1, "ابراهيم سالم", "אברהים סאלם", "Ibrahim Salem"],
      [1, "اليجرا يعقوب", "אליגרה יעקוב", "Allegra Yacoub"],
      [1, "اياد وعبير عيسى", "איאד ועביר עיסא", "Iyad & Abeer Issa"],
      [3, "مريم يعقوب", "מרים יעקוב", "Mariam Yacoub"],
      [2, "رامي يعقوب", "ראמי יעקוב", "Rami Yacoub"],
      [2, "جريس وهناء يعقوب", "ג'ריס והנאא יעקוב", "Jeries & Hanaa Yacoub"],
      [1, "داليا يعقوب", "דליה יעקוב", "Dalia Yacoub"],
      [2, "يوسف ورنده يعقوب", "יוסף ורנדה יעקוב", "Yousef & Randa Yacoub"],
      [2, "ماجد وليندا يعقوب", "מאג'ד ולינדה יעקוב", "Majed & Linda Yacoub"],
      [2, "رانيا ونسيم روحانا", "ראניה ונסים רוחאנא", "Rania & Nasim Rouhana", "روحانت"]
    ]],
    [11, "charlie", "family", 23, [
      [5, "الياس عزيز عيسى", "אליאס עזיז עיסא", "Elias Aziz Issa"],
      [5, "نعمه عزيز عيسى", "נעמה עזיז עיסא", "Neameh Aziz Issa"],
      [5, "جوسلين وشربل مطانس", "ג'וסלין ושרבל מטאנס", "Josline & Charbel Mtanes"],
      [2, "روزيت وفكري بطحيش", "רוזית ופכרי בטחיש", "Rosette & Fikri Batheesh"],
      [2, "ايليا بطحيش", "איליה בטחיש", "Elia Batheesh"],
      [2, "ميشيل ابراهيم", "מישל אברהים", "Michel Ibrahim"],
      [2, "لويزا ابراهيم", "לואיזה אברהים", "Louisa Ibrahim"]
    ]],
    [4, "charlie", "family", 22, [
      [5, "ريمون نعمه عيسى", "רימון נעמה עיסא", "Raymond Neameh Issa"],
      [4, "اورلي ووليام عيسى", "אורלי וויליאם עיסא", "Orly & William Issa"],
      [2, "اورنا وراني خلول", "אורנה וראני ח'לול", "Orna & Rani Khalloul"],
      [2, "ايلي زكنون", "אלי זכנון", "Eli Zaknoun"],
      [1, "اميلي زكنون", "אמילי זכנון", "Emily Zaknoun"],
      [1, "شربل زكنون", "שרבל זכנון", "Charbel Zaknoun"],
      [3, "جوني زكنون", "ג'וני זכנון", "Johnny Zaknoun"],
      [2, "حجله مارون", "חג'לה מארון", "Hajleh Maroun"],
      [1, "جريس مارون", "ג'ריס מארון", "Jeries Maroun"],
      [1, "سميره سروع", "סמירה סרוע", "Samira Sarou"]
    ]],
    [9, "charlie", "family", 24, [
      [3, "فيكتور عيسى", "ויקטור עיסא", "Victor Issa"],
      [2, "فادي فكتور عيسى", "פאדי ויקטור עיסא", "Fadi Victor Issa"],
      [2, "ماتيو عيسى", "מתיו עיסא", "Matteo Issa"],
      [2, "مارون وايناس عيسى", "מארון ואינאס עיסא", "Maroun & Inas Issa"],
      [3, "الياس هندومي عيسى", "אליאס הנדומי עיסא", "Elias Hindoumi Issa"],
      [2, "بول عيسى", "פול עיסא", "Paul Issa"],
      [5, "انيس عيسى", "אניס עיסא", "Anis Issa"],
      [2, "هند وربيع عليمي", "הינד ורביע עלימי", "Hind & Rabia Alimi"],
      [1, "منير سليمان", "מוניר סלימאן", "Munir Suleiman"],
      [2, "جريس ضو", "ג'ריס דאו", "Jeries Daw"]
    ]],

    // ---------- Round tables (12) - Charlie ----------
    [22, "charlie", null, 12, [
      [2, "ابراهيم مغزل", "אברהים מע'זל", "Ibrahim Maghzal"],
      [2, "امطانس مغزل", "אמטאנס מע'זל", "Mtanes Maghzal"],
      [2, "حنا المغزل", "חנא אלמע'זל", "Hanna Al-Maghzal"],
      [2, "حني وكمال مغزل", "חני וכמאל מע'זל", "Hani & Kamal Maghzal"],
      [2, "مشلين ورائد سليمان", "מישלין וראאד סלימאן", "Micheline & Raed Suleiman"],
      [1, "يوسف مغزل", "יוסף מע'זל", "Yousef Maghzal"],
      [1, "هيلين مغزل", "הלן מע'זל", "Helen Maghzal"]
    ]],
    [17, "charlie", null, 12, [
      [2, "نظيره ونانسي عيسى", "נזירה וננסי עיסא", "Nazira & Nancy Issa"],
      [2, "فارس وداليه عيسى", "פארס ודליה עיסא", "Fares & Dalia Issa"],
      [2, "ليزا وبشاره سوسان", "ליזה ובשארה סוסאן", "Liza & Bishara Sousan"],
      [2, "كمال كركبي", "כמאל כרכבי", "Kamal Karkabi"],
      [2, "ريمون الميشل عيسى", "רימון אלמישל עיסא", "Raymond Al-Michel Issa"],
      [2, "مارون عجينه", "מארון עג'ינה", "Maroun Ajineh"]
    ]],
    [24, "charlie", null, 12, [
      [2, "مارون ادوار عيسى", "מארון אדואר עיסא", "Maroun Edward Issa"],
      [2, "رونيت اندراوس", "רונית אנדראוס", "Ronit Andraos"],
      [2, "روني ادوار عيسى", "רוני אדואר עיסא", "Ronnie Edward Issa"],
      [2, "البير ادوار عيسى", "אלבר אדואר עיסא", "Albert Edward Issa"],
      [2, "حبيب خليل", "חביב ח'ליל", "Habib Khalil"],
      [1, "الاب عفيف مخول", "האב עפיף מח'ול", "Father Afif Makhoul"],
      [1, "نصيف حجله مخول", "נסיף חג'לה מח'ול", "Nassif Hajleh Makhoul"]
    ]],
    [28, "charlie", null, 11, [
      [2, "جان وجيهان خوري", "ג'אן וג'יהאן ח'ורי", "Jan & Jihan Khoury"],
      [2, "لبنى وبولص عيسى", "לובנא ובולוס עיסא", "Lubna & Boulos Issa"],
      [1, "مارون شبلي عيسى", "מארון שיבלי עיסא", "Maroun Shibli Issa"],
      [2, "بيير ورنين عيسى", "פייר ורנין עיסא", "Pierre & Ranin Issa"],
      [2, "لويس شبلي عيسى", "לואיס שיבלי עיסא", "Louis Shibli Issa"],
      [1, "نورمان عيسى", "נורמן עיסא", "Norman Issa"],
      [1, "سمير شنان", "סמיר שנאן", "Samir Shanan"]
    ]],
    [19, "charlie", null, 12, [
      [2, "ميشيل وجمانه عيسى", "מישל וג'ומאנה עיסא", "Michel & Jumana Issa"],
      [2, "ادوار ونجاه جريس", "אדואר ונג'אה ג'ריס", "Edward & Najah Jeries"],
      [3, "جريس وهناء عيسى", "ג'ריס והנאא עיסא", "Jeries & Hanaa Issa"],
      [2, "الياس سليمان", "אליאס סלימאן", "Elias Suleiman"],
      [2, "جريس جماليه", "ג'ריס ג'מאליה", "Jeries Jamalieh"],
      [1, "امين جماليه", "אמין ג'מאליה", "Amin Jamalieh"]
    ]],
    [26, "charlie", null, 12, [
      [2, "شادي مطانس", "שאדי מטאנס", "Shadi Mtanes"],
      [2, "اديب خليف", "אדיב ח'ליף", "Adib Khlief"],
      [2, "ديب وريما مارون", "דיב ורימה מארון", "Dib & Rima Maroun"],
      [2, "الياس فواد جريس", "אליאס פואד ג'ריס", "Elias Fouad Jeries"],
      [2, "شكري واميره يعقوب", "שוכרי ואמירה יעקוב", "Shukri & Amira Yacoub"],
      [2, "مجيد الجريس", "מג'יד אלג'ריס", "Majid Al-Jeries"]
    ]],
    [30, "charlie", null, 12, [
      [2, "اسامه شقور", "אוסאמה שקור", "Osama Shakour"],
      [2, "اسعد شقور", "אסעד שקור", "Asaad Shakour"],
      [1, "ايلي شقور", "אלי שקור", "Eli Shakour"],
      [2, "الياس خليل شقور", "אליאס ח'ליל שקור", "Elias Khalil Shakour"],
      [2, "الياس امطانس", "אליאס אמטאנס", "Elias Mtanes"],
      [3, "الاخويه (?)", "האחווה (?)", "Al-Akhawiya (?)"]
    ]],
    [29, "charlie", null, 9, [
      [1, "امين هلون", "אמין הלון", "Amin Hloun"],
      [1, "جابي زهر", "גאבי זהר", "Gaby Zahr"],
      [1, "جابي قط", "גאבי קט", "Gaby Qat"],
      [1, "حمودي ابو طرس", "חמודי אבו טרס", "Hamoudi Abu Tars"],
      [1, "داهود هلون", "דאהוד הלון", "Dahoud Hloun"],
      [1, "عنان الباش", "ענאן אלבאש", "Anan Al-Bash"],
      [1, "يوسف دلال", "יוסף דלאל", "Yousef Dalal"],
      [2, "رامي حوا", "ראמי חווא", "Rami Hawa"],
      [0, "دانييل", "דניאל", "Daniel"]
    ]],
    [14, "charlie", null, 12, [
      [1, "اديب عقل", "אדיב עקל", "Adib Akel"],
      [2, "امطانس عقل", "אמטאנס עקל", "Mtanes Akel"],
      [2, "بيتر وجوليانا كاردو", "פיטר וג'וליאנה קרדו", "Peter & Juliana Kardo"],
      [2, "فادي وروزانا عقل", "פאדי ורוזנה עקל", "Fadi & Rozana Akel"],
      [1, "شربل عبود", "שרבל עבוד", "Charbel Abboud"],
      [1, "اسمهان عبود", "אסמהאן עבוד", "Asmahan Abboud"],
      [1, "جوني جبران", "ג'וני ג'ובראן", "Johnny Jubran"],
      [2, "الفيرا ومارون عقل", "אלווירה ומארון עקל", "Elvira & Maroun Akel"]
    ]],
    [20, "charlie", null, 11, [
      [1, "אור דנון", "اور دنون", "Or Danon"],
      [1, "אורון רוזנבלט", "اورون روزنبلط", "Oron Rosenblat"],
      [1, "יאיר דיאמנט", "يائير ديامنت", "Yair Diamant"],
      [1, "יהודה גארתי", "يهودا جارتي", "Yehuda Garti"],
      [1, "סתיו קדוש", "ستاف كدوش", "Stav Kadosh"],
      [1, "עידן אראמי", "عيدان ارامي", "Idan Arami"],
      [1, "اشرف ابو اصبع", "אשרף אבו אצבע", "Ashraf Abu Isba"],
      [1, "تيريزا زهر", "תרזה זהר", "Theresa Zahr"],
      [1, "ديران طوتونجيان", "דיראן טוטונג'יאן", "Diran Toutounjian"],
      [1, "איליה רוסושק", "ايليا روسوشك", "Ilya Rusoshek"],
      [1, "شادي جبران", "שאדי ג'ובראן", "Shadi Jubran"]
    ]]
  ];

  var tables = [];
  var guests = [];
  var byId = {};
  for (var id = 1; id <= 31; id++) {
    var t = {
      id: id,
      shape: id <= 12 ? "rect" : "round",
      capacity: id <= 12 ? 24 : 12,
      side: null,
      label: null,
      sheetTotal: null,
      hasList: false
    };
    tables.push(t);
    byId[id] = t;
  }
  RAW.forEach(function (r) {
    var t = byId[r[0]];
    t.side = r[1];
    t.label = r[2] ? LABELS[r[2]] : null;
    t.sheetTotal = r[3];
    t.hasList = true;
    r[4].forEach(function (g) {
      guests.push({ table: t.id, count: g[0], names: g.slice(1) });
    });
  });

  return { tables: tables, guests: guests, sides: SIDES };
})();

if (typeof module !== "undefined") module.exports = SEATING;
