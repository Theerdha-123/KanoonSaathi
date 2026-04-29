// ─── 23 Languages — 22 Scheduled Languages + English ────────────────────────

export const LANGUAGES = [
  { code:"en", name:"English",    native:"English",    region:"Pan India (Lingua Franca)", dir:"ltr" },
  { code:"hi", name:"Hindi",      native:"हिन्दी",       region:"UP, MP, Bihar, Rajasthan, Delhi, Jharkhand, CG", dir:"ltr" },
  { code:"bn", name:"Bengali",    native:"বাংলা",       region:"West Bengal, Tripura, Assam", dir:"ltr" },
  { code:"te", name:"Telugu",     native:"తెలుగు",      region:"Andhra Pradesh, Telangana", dir:"ltr" },
  { code:"mr", name:"Marathi",    native:"मराठी",       region:"Maharashtra", dir:"ltr" },
  { code:"ta", name:"Tamil",      native:"தமிழ்",       region:"Tamil Nadu, Puducherry", dir:"ltr" },
  { code:"ur", name:"Urdu",       native:"اُردُو",        region:"J&K, UP, Telangana, Bihar", dir:"rtl" },
  { code:"gu", name:"Gujarati",   native:"ગુજરાતી",     region:"Gujarat, Dadra & Nagar Haveli", dir:"ltr" },
  { code:"kn", name:"Kannada",    native:"ಕನ್ನಡ",       region:"Karnataka", dir:"ltr" },
  { code:"or", name:"Odia",       native:"ଓଡ଼ିଆ",       region:"Odisha", dir:"ltr" },
  { code:"ml", name:"Malayalam",  native:"മലയാളം",    region:"Kerala, Lakshadweep", dir:"ltr" },
  { code:"pa", name:"Punjabi",    native:"ਪੰਜਾਬੀ",      region:"Punjab, Chandigarh", dir:"ltr" },
  { code:"as", name:"Assamese",   native:"অসমীয়া",     region:"Assam", dir:"ltr" },
  { code:"mai",name:"Maithili",   native:"मैथिली",      region:"Bihar (Mithila region)", dir:"ltr" },
  { code:"sa", name:"Sanskrit",   native:"संस्कृतम्",     region:"Classical language of India", dir:"ltr" },
  { code:"ne", name:"Nepali",     native:"नेपाली",      region:"Sikkim, Darjeeling, NE India", dir:"ltr" },
  { code:"sd", name:"Sindhi",     native:"سنڌي",       region:"Gujarat, Maharashtra, Rajasthan", dir:"rtl" },
  { code:"ks", name:"Kashmiri",   native:"कॉशुर",      region:"Jammu & Kashmir", dir:"ltr" },
  { code:"doi",name:"Dogri",      native:"डोगरी",       region:"Jammu & Kashmir, HP", dir:"ltr" },
  { code:"kok",name:"Konkani",    native:"कोंकणी",      region:"Goa, Karnataka, Maharashtra", dir:"ltr" },
  { code:"mni",name:"Manipuri",   native:"মৈতৈলোন্",    region:"Manipur, NE India", dir:"ltr" },
  { code:"bo", name:"Bodo",       native:"बड़ो",        region:"Assam (Bodoland)", dir:"ltr" },
  { code:"sat",name:"Santhali",   native:"ᱥᱟᱱᱛᱟᱲᱤ",    region:"Jharkhand, WB, Odisha", dir:"ltr" },
  { code:"bho",name:"Bhojpuri",   native:"भोजपुरी",      region:"Bihar, UP, Jharkhand", dir:"ltr" },
  { code:"bgc",name:"Haryanvi",   native:"हरियाणवी",    region:"Haryana, Delhi, Rajasthan", dir:"ltr" },
  { code:"auto",name:"Auto Detect",native:"स्वचालित",  region:"Detect Context", dir:"ltr" },
];

export const SPEECH_LANG = {
  en:"en-IN", hi:"hi-IN", bn:"bn-IN", te:"te-IN", mr:"mr-IN", ta:"ta-IN",
  ur:"ur-IN", gu:"gu-IN", kn:"kn-IN", or:"or-IN", ml:"ml-IN", pa:"pa-IN",
  as:"as-IN", mai:"hi-IN", sa:"hi-IN", ne:"ne-NP", sd:"sd-IN", ks:"hi-IN",
  doi:"hi-IN", kok:"hi-IN", mni:"bn-IN", bo:"hi-IN", sat:"hi-IN",
  bho:"hi-IN", bgc:"hi-IN", auto:"en-IN",
};

export const UI_TEXT = {
  en: { heroTitle:"Know Your Rights.\nSpeak the Law.", heroSub:"Ask any legal question in plain English — get step-by-step guidance with exact law sections, action plans, and free helplines. No lawyer needed.", searchPH:"Search any law, IPC section, act, or right…", askBtn:"⚖️ Ask AI Legal Query", browseLaws:"Browse Laws ↓", noLawyer:"NO LAWYER NEEDED", login:"Login", signup:"Sign Up", logout:"Logout", chatWelcome:"Welcome to KanoonSaathi", chatSub:"Describe your legal problem in plain language. I'll identify the exact laws, your rights, step-by-step action plan, and free resources.", chatPH:"Describe your legal problem…", askAiBtn:"Ask ⚖️", dailyFact:"📚 LAW FACT OF THE DAY", impactTitle:"Why KanoonSaathi Matters", tab_cat:"📚 Categories", tab_sc:"🎭 Scenarios", tab_wi:"🚨 What If", tab_rights:"✊ Your Rights", tab_women:"👩 Women Safety", tab_dis:"♿ Disability", tab_help:"📞 Helplines" },
  hi: { heroTitle:"अपने अधिकार जानें।\nकानून बोलें।", heroSub:"कोई भी कानूनी सवाल सरल हिंदी में पूछें — सटीक कानून, कदम-दर-कदम मार्गदर्शन और मुफ्त हेल्पलाइन पाएं। वकील की जरूरत नहीं।", searchPH:"कोई भी कानून, IPC धारा या अधिकार खोजें…", askBtn:"⚖️ AI से कानूनी सवाल पूछें", browseLaws:"कानून देखें ↓", noLawyer:"वकील की जरूरत नहीं", login:"लॉगिन", signup:"साइन अप", logout:"लॉग आउट", chatWelcome:"कानूनसाथी में स्वागत है", chatSub:"अपनी कानूनी समस्या सरल भाषा में बताएं। मैं सटीक कानून, आपके अधिकार और मुफ्त संसाधन बताऊंगा।", chatPH:"अपनी कानूनी समस्या बताएं…", askAiBtn:"पूछें ⚖️", dailyFact:"📚 आज का कानूनी तथ्य", impactTitle:"कानूनसाथी क्यों जरूरी है", tab_cat:"📚 श्रेणियाँ", tab_sc:"🎭 परिदृश्य", tab_wi:"🚨 क्या अगर", tab_rights:"✊ आपके अधिकार", tab_women:"👩 महिला सुरक्षा", tab_dis:"♿ दिव्यांग अधिकार", tab_help:"📞 हेल्पलाइन" },
};

export function getT(lang) {
  if (lang === 'bho' || lang === 'bgc') return UI_TEXT.hi;
  return UI_TEXT[lang] || UI_TEXT.en;
}
