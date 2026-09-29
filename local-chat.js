import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let symptomsData = null;

export function loadSymptomsForChat() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, "public", "symptoms.json"), "utf8");
    symptomsData = JSON.parse(raw);
  } catch {
    symptomsData = { COMMON_SYMPTOMS: {}, CATEGORIES: {} };
  }
}

const SYMPTOM_TIPS = {
  fever: {
    en: "Keep the animal in shade, offer clean water, and note temperature if you can. See a vet if fever lasts over 48 hours, milk drops sharply, or the animal is very weak.",
    hi: "छाया में रखें, साफ पानी दें, ताप नोट करें। 48 घंटे से ज़्यादा बुखार, दूध कम या बहुत कमज़ोरी हो तो पशु चिकित्सक दिखाएँ।",
    mr: "सावलीत ठेवा, स्वच्छ पाणी द्या. 48 तासांपेक्षा जास्त ताप, दूध कमी किंवा खूप अशक्तपणा असल्यास पशुवैद्याकडे जा.",
  },
  not_eating: {
    en: "Check mouth for sores, hydration, and droppings. Young animals can worsen fast — contact a vet today if refusal continues.",
    hi: "मुँह में घाव, पानी और मल देखें। बच्चों में जल्दी बिगड़ सकता है — खाना न खाए तो आज डॉक्टर से बात करें।",
    mr: "तोंडात जखमा, पाणी आणि शेण तपासा. लहान प्राण्यांमध्ये लवकर बिघडते — खात नसेल तर आज पशुवैद्याशी बोला.",
  },
  diarrhea: {
    en: "Dehydration is the main risk — fresh water always. Urgent vet visit if blood in stool, collapse, or diarrhea over 24 hours.",
    hi: "पानी की कमी खतरनाक है — हमेशा साफ पानी। मल में खून, गिरना या 24+ घंटे दस्त = तुरंत डॉक्टर।",
    mr: "निर्जलीकरण धोकादायक — नेहमी स्वच्छ पाणी. शेणात रक्त, कोसळणे किंवा 24+ तास जुलाब = लगेच पशुवैद्य.",
  },
  bloating: {
    en: "Bloating can be an emergency in cattle and goats — stop grain, walk gently if safe, and call a vet immediately if belly is tight and painful.",
    hi: "पेट फूलना गाय-बकरी में आपात हो सकता है — दाना बंद, हल्का चलाएँ, पेट कड़ा/दर्द हो तो तुरंत वेट को कॉल करें।",
    mr: "पोट फुगणे गाय-शेळ्यांमध्ये आपत्कालीन — दाणे थांबवा, पोट कडक/दुखत असेल तर लगेच पशुवैद्याला कॉल करा.",
  },
  cough: {
    en: "Isolate from other animals, reduce dust, ensure ventilation. Fast breathing or nasal blood needs urgent veterinary care.",
    hi: "अलग रखें, धूल कम, हवा ठीक रखें। तेज साँस या नाक से खून = तुरंत डॉक्टर।",
    mr: "इतर प्राण्यांपासून वेगळे ठेवा. जलद श्वास किंवा नाकातून रक्त = तातडीने पशुवैद्य.",
  },
  weakness: {
    en: "Offer water with electrolytes if a vet advised before. Sudden collapse, unable to stand, or cold ears — emergency vet call.",
    hi: "डॉक्टर ने कहा हो तो इलेक्ट्रोलाइट पानी। अचानक गिरना, खड़ा न हो पाना — आपात कॉल।",
    mr: "पशुवैद्याने सांगितले तर इलेक्ट्रोलाइट पाणी. अचानक कोसळणे, उभे राहू शकत नाही — आपत्कालीन कॉल.",
  },
  reduced_milk: {
    en: "Check udder for heat, pain, or lumps (mastitis signs). Fever plus hard udder needs same-day veterinary visit.",
    hi: "थन गर्म/दर्द/गांठ — मास्टाइटिस संकेत। बुखार + सख्त थन = आज ही डॉक्टर।",
    mr: "कासे उबदार/वेदना/गाठ — मास्टायटिस चिन्ह. ताप + कडक कासे = आजच पशुवैद्य.",
  },
  limping: {
    en: "Rest the limb, check hoof for stones or swelling. Open wound or non-weight-bearing lameness — vet exam soon.",
    hi: "आराम, खुर में पत्थर/सूजन देखें। खुला घाव या पैर नहीं रख पा रहा — जल्दी डॉक्टर।",
    mr: "विश्रांती, खुरात दगड/सूज तपासा. जखम किंवा पाय टाकू शकत नाही — लवकर पशुवैद्य.",
  },
  skin_lesions: {
    en: "Photo helps the vet — use Diagnosis → upload skin image. Itchy spreading rash or raw wounds need professional care.",
    hi: "फोटो मददगार — निदान में त्वचा की फोटो अपलोड करें। फैलता दाने या खुला घाव = डॉक्टर।",
    mr: "फोटो उपयुक्त — निदानात त्वचेचा फोटो अपलोड करा. पसरणारे पुरळ किंवा जखम = पशुवैद्य.",
  },
};

const ANIMAL_PATTERNS = [
  { k: "cow", re: /cow|gaay|गाय|गायी/i },
  { k: "buffalo", re: /buffalo|bhains|भैंस|म्हैस/i },
  { k: "goat", re: /goat|bakri|बकरी|शेळी/i },
  { k: "dog", re: /dog|kutta|कुत्ता|कुत्रा|puppy/i },
  { k: "cat", re: /cat|billi|बिल्ली|मांजर|kitten/i },
  { k: "chicken", re: /chicken|murgi|मुर्गी|कोंबडी/i },
];

function L(lang, en, hi, mr) {
  if (lang === "hi") return hi;
  if (lang === "mr") return mr;
  return en;
}

function detectAnimal(text) {
  for (const a of ANIMAL_PATTERNS) {
    if (a.re.test(text)) return a.k;
  }
  return null;
}

function matchSymptoms(text) {
  const found = [];
  if (!symptomsData?.COMMON_SYMPTOMS) return found;
  for (const [animal, list] of Object.entries(symptomsData.COMMON_SYMPTOMS)) {
    for (const s of list) {
      const names = [s.k, s.n?.en, s.n?.hi, s.n?.mr].filter(Boolean).join(" ").toLowerCase();
      const parts = names.split(/\s+/);
      const hit = parts.some((p) => p.length > 2 && text.includes(p)) || text.includes(s.k.replace(/_/g, " "));
      if (hit) found.push({ animal, key: s.k, label: s.n });
    }
  }
  return found;
}

function appHint(lang) {
  return L(
    lang,
    "\n\nTip: Tap Start Diagnosis on home, or Find doctors for a vet visit.",
    "\n\nटिप: होम पर निदान शुरू करें या डॉक्टर खोजें।",
    "\n\nटिप: होमवर निदान सुरू करा किंवा डॉक्टर शोधा."
  );
}

function greet(lang) {
  const picks = [
    L(lang, "Hey there! 👋", "नमस्ते! 👋", "नमस्कार! 👋"),
    L(lang, "Good to see you! 😊", "आपका स्वागत है! 😊", "भेटून आनंद झाला! 😊"),
  ];
  return picks[Math.floor(Math.random() * picks.length)];
}

function stripMd(text) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
}

/** Built-in assistant — no Gemini API required. */
export function localChatAssistant(thread, lang = "en", userName = "") {
  const l = String(lang || "en").slice(0, 2).toLowerCase();
  const last = String(thread[thread.length - 1]?.text || "").trim();
  const text = last.toLowerCase();

  const nameBit = userName
    ? L(l, ` ${userName},`, ` ${userName},`, ` ${userName},`)
    : "";
  if (!last) {
    return stripMd(
      greet(l) +
        nameBit +
        " " +
        L(
          l,
          "I'm your VetNova assistant — tell me about your animal and I'll help with safe first steps!",
          "मैं VetNova सहायक हूँ — पशु और लक्षण बताएँ, मैं सुरक्षित सलाह दूँगा!",
          "मी VetNova सहाय्यक — प्राणी आणि लक्षणे सांगा, सुरक्षित सल्ला देईन!"
        ) +
        appHint(l)
    );
  }

  if (/^(hi|hello|hey|namaste|नमस्ते|नमस्कार|help|madad|मदद)/i.test(text)) {
    return (
      greet(l) +
      " " +
      L(
        l,
        "I'm here for you! 🙌 Share the animal (cow 🐄, dog 🐕, goat 🐐…), symptoms, and how many days it's been going on.",
        "मैं यहाँ हूँ! 🙌 पशु (गाय 🐄, कुत्ता 🐕…), लक्षण और कितने दिन से — बताएँ।",
        "मी इथे आहे! 🙌 प्राणी (गाय 🐄, कुत्रा 🐕…), लक्षणे आणि किती दिवस — सांगा."
      ) +
      appHint(l)
    );
  }

  if (/appointment|अपॉइंट|भेट|book|slot/.test(text)) {
    return L(
      l,
      "📅 Open Appointments on the home screen to book a vet visit. When the doctor confirms or changes the time, you'll see a notification here! 🔔",
      "📅 होम से अपॉइंटमेंट खोलें। डॉक्टर पुष्टि या समय बदले तो आपको सूचना मिलेगी! 🔔",
      "📅 होमवरून अपॉइंटमेंट उघडा. डॉक्टर निश्चित किंवा वेळ बदलल्यावर सूचना मिळेल! 🔔"
    );
  }

  if (/video|वीडियो|व्हिडिओ|youtube|learn|सीख/.test(text)) {
    return L(
      l,
      "🎬 Check Videos on the dashboard — short lessons on cattle, poultry, pets & vaccination (all related to animal health).",
      "🎬 डैशबोर्ड पर वीडियो देखें — गाय, मुर्गी, पालतू और टीके पर उपयोगी वीडियो।",
      "🎬 डॅशबोर्डवर व्हिडिओ — गाय, पोल्ट्री, पाळीव प्राणी आणि लसीकरणाविषयी शिक्षण."
    );
  }

  if (/diagnos|निदान|निदान|check|symptom|लक्षण/.test(text)) {
    return (
      L(
        l,
        "Use Start Diagnosis on the dashboard: pick animal type → symptoms → severity. You'll get a report and can call a doctor from there.",
        "डैशबोर्ड पर निदान शुरू करें: पशु → लक्षण → गंभीरता। रिपोर्ट मिलेगी, वहीं से डॉक्टर कॉल कर सकते हैं।",
        "डॅशबोर्डवर निदान सुरू करा: प्राणी → लक्षणे → तीव्रता. अहवाल मिळेल, तिथून डॉक्टर कॉल करा."
      ) + appHint(l)
    );
  }

  if (/doctor|vet|डॉक्टर|पशु चिकित्सक|पशुवैद्य|call/.test(text)) {
    return L(
      l,
      "Open Find doctors in the bottom menu to see available vets and start a video call when they're online.",
      "नीचे डॉक्टर खोजें खोलें — उपलब्ध वेट देखें और ऑनलाइन होने पर वीडियो कॉल शुरू करें।",
      "खाली डॉक्टर शोधा उघडा — उपलब्ध पशुवैद्य पहा आणि ऑनलाइन असल्यास व्हिडिओ कॉल करा."
    );
  }

  if (/medicine|dawai|दवा|औषध|photo|image|फोटो|picture/.test(text)) {
    return L(
      l,
      "In Diagnosis you can upload a medicine label or skin/rash photo for AI reading (when enabled). Always confirm with your vet before giving any drug.",
      "निदान में दवा की फोटो या त्वचा/दाने की फोटो अपलोड कर सकते हैं। कोई भी दवा वेट की सलाह के बिना न दें।",
      "निदानात औषध फोटो किंवा त्वचा फोटो अपलोड करा. पशुवैद्याच्या सल्ल्याशिवाय औषध देऊ नका."
    ) + appHint(l);
  }

  const animal = detectAnimal(text);
  const symptoms = matchSymptoms(text);

  if (symptoms.length > 0) {
    const seen = new Set();
    const unique = [];
    for (const s of symptoms) {
      if (seen.has(s.key)) continue;
      seen.add(s.key);
      unique.push(s);
    }
    const lines = unique.slice(0, 3).map((s) => {
      const tip = SYMPTOM_TIPS[s.key];
      const label = s.label?.[l] || s.label?.en || s.key;
      const advice = tip ? tip[l] || tip.en : L(l, "Monitor closely and contact a vet if worsening.", "बिगड़े तो डॉक्टर को बुलाएँ।", "वाढल्यास पशुवैद्याला बोला.");
      return `• ${label}: ${advice}`;
    });
    const animalNote = animal
      ? L(l, `\n(For ${animal} — adjust care for species/size.)`, `\n(${animal} के लिए — प्रजाति के अनुसार देखभाल।)`, `\n(${animal} साठी — प्रजातीनुसार काळजी.)`)
      : "";
    return stripMd(
      L(l, "Got it! Here's what I'd suggest:\n\n", "समझ गया! मेरी सलाह:\n\n", "समजले! माझा सल्ला:\n\n") +
        lines.join("\n\n") +
        animalNote +
        appHint(l)
    );
  }

  if (/emergency|urgent|turant|तुरंत|आपात|खतर|dying|mar/.test(text)) {
    return L(
      l,
      "🚨 This sounds urgent — call a veterinarian now! Keep the animal calm 😌, in shade, with water if conscious. Use Find doctors 🎥 if a vet is online.",
      "यह आपात लगता है — अभी पशु चिकित्सक को कॉल करें। शांत, छाया, होश में हो तो पानी। डॉक्टर खोजें से वीडियो मदद लें।",
      "हे आपत्कालीन वाटते — आत्ताच पशुवैद्याला कॉल करा. शांत, सावली, शुद्ध वाटल्यास पाणी. डॉक्टर शोधा."
    );
  }

  return offlineChatReplySimple(thread, l);
}

function offlineChatReplySimple(thread, lang) {
  const last = String(thread[thread.length - 1]?.text || "").toLowerCase();
  if (/fever|bukhar|ताप|बुखार/.test(last)) {
    return (SYMPTOM_TIPS.fever[lang] || SYMPTOM_TIPS.fever.en) + appHint(lang);
  }
  if (/not eating|appetite|khana|खाना|भूख|जेवण/.test(last)) {
    return (SYMPTOM_TIPS.not_eating[lang] || SYMPTOM_TIPS.not_eating.en) + appHint(lang);
  }
  if (/diarrhea|loose|dast|दस्त|जुलाब/.test(last)) {
    return (SYMPTOM_TIPS.diarrhea[lang] || SYMPTOM_TIPS.diarrhea.en) + appHint(lang);
  }
  if (/bloat|फूल|फुग/.test(last)) {
    return (SYMPTOM_TIPS.bloating[lang] || SYMPTOM_TIPS.bloating.en) + appHint(lang);
  }
  return (
    L(
      lang,
      "Tell me more 🐾 — which animal, main symptoms, age, and how many days? I'll walk you through safe first steps. For a full check tap Start Diagnosis 🩺 on home.",
      "बताएँ: कौन सा पशु, मुख्य लक्षण, उम्र, कितने दिन। सुरक्षित पहले कदम बताऊँगा। पूरा चेक के लिए होम पर निदान शुरू करें।",
      "सांगा: कोणता प्राणी, लक्षणे, वय, किती दिवस. सुरक्षित पहिले पाऊल सांगेन. पूर्ण तपासणीसाठी निदान सुरू करा."
    ) + appHint(lang)
  );
}
