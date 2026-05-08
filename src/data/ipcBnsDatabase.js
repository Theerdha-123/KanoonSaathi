/**
 * KanoonSaathi — Comprehensive IPC → BNS Transition Database
 * Top 30 most commonly referenced Indian Penal Code sections mapped to
 * their Bharatiya Nyaya Sanhita (BNS) 2023 equivalents.
 * Effective from 1 July 2024.
 */

export const IPC_TO_BNS = [
  {
    ipcSection: "302",
    bnsSection: "103(1)",
    crimeNameEnglish: "Murder",
    crimeNameHindi: "हत्या",
    simpleDescription: "Intentionally causing the death of a person. Punishment: Death or life imprisonment + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "304",
    bnsSection: "105",
    crimeNameEnglish: "Culpable Homicide not amounting to Murder",
    crimeNameHindi: "गैर-इरादतन हत्या",
    simpleDescription: "Causing death without the full intention to kill. Punishment: Life imprisonment, or up to 10 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "304A",
    bnsSection: "106(1)",
    crimeNameEnglish: "Death by Negligence",
    crimeNameHindi: "लापरवाही से मृत्यु",
    simpleDescription: "Causing death by rash or negligent act (e.g., reckless driving). Punishment: Up to 5 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "304B",
    bnsSection: "80",
    crimeNameEnglish: "Dowry Death",
    crimeNameHindi: "दहेज हत्या",
    simpleDescription: "Death of a woman within 7 years of marriage linked to dowry demands. Punishment: Minimum 7 years to life imprisonment.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "306",
    bnsSection: "108",
    crimeNameEnglish: "Abetment of Suicide",
    crimeNameHindi: "आत्महत्या के लिए उकसाना",
    simpleDescription: "Instigating or encouraging a person to commit suicide. Punishment: Up to 10 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "307",
    bnsSection: "109",
    crimeNameEnglish: "Attempt to Murder",
    crimeNameHindi: "हत्या का प्रयास",
    simpleDescription: "Doing any act with the intention to cause death. Punishment: Up to 10 years + fine; life imprisonment if hurt is caused.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "323",
    bnsSection: "115(2)",
    crimeNameEnglish: "Voluntarily Causing Hurt",
    crimeNameHindi: "जानबूझकर चोट पहुँचाना",
    simpleDescription: "Causing bodily pain or injury to another person. Punishment: Up to 1 year + fine up to ₹10,000.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "325",
    bnsSection: "117(2)",
    crimeNameEnglish: "Voluntarily Causing Grievous Hurt",
    crimeNameHindi: "गंभीर चोट पहुँचाना",
    simpleDescription: "Causing serious injuries like fractures, loss of sight, etc. Punishment: Up to 7 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "354",
    bnsSection: "74",
    crimeNameEnglish: "Assault on Woman (Outraging Modesty)",
    crimeNameHindi: "महिला की लज्जा भंग करना",
    simpleDescription: "Using criminal force on a woman to outrage her modesty. Punishment: 1–5 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "354A",
    bnsSection: "75",
    crimeNameEnglish: "Sexual Harassment",
    crimeNameHindi: "यौन उत्पीड़न",
    simpleDescription: "Unwelcome physical contact, sexual remarks, or showing pornography. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "376",
    bnsSection: "64",
    crimeNameEnglish: "Rape",
    crimeNameHindi: "बलात्कार",
    simpleDescription: "Sexual intercourse without consent. Punishment: Minimum 10 years to life imprisonment + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "378",
    bnsSection: "303(1)",
    crimeNameEnglish: "Theft",
    crimeNameHindi: "चोरी",
    simpleDescription: "Dishonestly taking movable property out of someone's possession without consent. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "379",
    bnsSection: "303(2)",
    crimeNameEnglish: "Punishment for Theft",
    crimeNameHindi: "चोरी की सज़ा",
    simpleDescription: "Imprisonment up to 3 years, or fine, or both for committing theft.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "384",
    bnsSection: "308",
    crimeNameEnglish: "Extortion",
    crimeNameHindi: "जबरन वसूली",
    simpleDescription: "Obtaining property or value by putting someone in fear of injury. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "392",
    bnsSection: "309(4)",
    crimeNameEnglish: "Robbery",
    crimeNameHindi: "डकैती / लूट",
    simpleDescription: "Theft or extortion combined with violence or threat of violence. Punishment: Up to 10 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "395",
    bnsSection: "310(2)",
    crimeNameEnglish: "Dacoity",
    crimeNameHindi: "डकैती (5+ लोग)",
    simpleDescription: "Robbery committed by 5 or more persons. Punishment: Up to life imprisonment + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "406",
    bnsSection: "316",
    crimeNameEnglish: "Criminal Breach of Trust",
    crimeNameHindi: "विश्वासघात",
    simpleDescription: "Dishonestly misappropriating property entrusted to you. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "420",
    bnsSection: "318(4)",
    crimeNameEnglish: "Cheating / Fraud",
    crimeNameHindi: "धोखाधड़ी / ठगी",
    simpleDescription: "Dishonestly deceiving someone to deliver property or alter something valuable. Punishment: Up to 7 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "498A",
    bnsSection: "85",
    crimeNameEnglish: "Cruelty by Husband / Relatives",
    crimeNameHindi: "पति या ससुराल वालों की क्रूरता",
    simpleDescription: "Mental or physical cruelty towards a married woman by husband or his relatives. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "499/500",
    bnsSection: "356",
    crimeNameEnglish: "Defamation",
    crimeNameHindi: "मानहानि",
    simpleDescription: "Making or publishing statements to harm someone's reputation. Punishment: Up to 2 years + fine.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "503/506",
    bnsSection: "351",
    crimeNameEnglish: "Criminal Intimidation",
    crimeNameHindi: "आपराधिक धमकी",
    simpleDescription: "Threatening someone with injury to their person, reputation, or property. Punishment: Up to 2 years + fine.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "509",
    bnsSection: "79",
    crimeNameEnglish: "Insulting Modesty of a Woman",
    crimeNameHindi: "महिला की शालीनता का अपमान",
    simpleDescription: "Word, gesture, or act intended to insult the modesty of a woman. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "363",
    bnsSection: "137(2)",
    crimeNameEnglish: "Kidnapping",
    crimeNameHindi: "अपहरण",
    simpleDescription: "Taking or enticing a minor or a person of unsound mind from lawful guardianship. Punishment: Up to 7 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "364A",
    bnsSection: "140(1)",
    crimeNameEnglish: "Kidnapping for Ransom",
    crimeNameHindi: "फिरौती के लिए अपहरण",
    simpleDescription: "Kidnapping a person and demanding ransom for release. Punishment: Death or life imprisonment.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "341",
    bnsSection: "126(2)",
    crimeNameEnglish: "Wrongful Restraint",
    crimeNameHindi: "ग़ैरक़ानूनी रोक",
    simpleDescription: "Preventing a person from going in a direction they have the right to go. Punishment: Up to 1 month + fine up to ₹500.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "342",
    bnsSection: "127(2)",
    crimeNameEnglish: "Wrongful Confinement",
    crimeNameHindi: "ग़ैरक़ानूनी क़ैद",
    simpleDescription: "Wrongfully keeping a person confined so they cannot move. Punishment: Up to 1 year + fine up to ₹1,000.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "279",
    bnsSection: "281",
    crimeNameEnglish: "Rash Driving / Riding",
    crimeNameHindi: "लापरवाही से गाड़ी चलाना",
    simpleDescription: "Driving on a public road in a rash or negligent manner endangering human life. Punishment: Up to 6 months + fine up to ₹1,000.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "447",
    bnsSection: "329(2)",
    crimeNameEnglish: "Criminal Trespass",
    crimeNameHindi: "अनधिकार प्रवेश",
    simpleDescription: "Entering someone's property to commit an offence or to intimidate them. Punishment: Up to 3 months + fine up to ₹500.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "379 + 411",
    bnsSection: "317",
    crimeNameEnglish: "Receiving Stolen Property",
    crimeNameHindi: "चोरी का माल रखना",
    simpleDescription: "Dishonestly receiving or retaining property knowing it to be stolen. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "34",
    bnsSection: "3(5)",
    crimeNameEnglish: "Common Intention",
    crimeNameHindi: "सामान्य आशय",
    simpleDescription: "When a crime is done by multiple persons in furtherance of common intention, each is liable as if done by them alone.",
    cognizable: true, bailable: false
  },
];

/**
 * SEO meta tags for the BNS Translator page
 */
export const BNS_SEO = {
  title: "IPC to BNS Converter — Free Section Translator | KanoonSaathi",
  description: "Free IPC to BNS converter tool. Instantly translate old Indian Penal Code sections to new Bharatiya Nyaya Sanhita (BNS) 2023 sections. Updated for 2024-2025.",
  keywords: "IPC to BNS converter, BNS section for theft, BNS section for murder, new criminal laws India 2024, Bharatiya Nyaya Sanhita, IPC 420 BNS equivalent, IPC 302 to BNS, BNS 2023 section list, IPC BNS mapping, new Indian penal code 2024",
  ogTitle: "IPC to BNS Section Converter — KanoonSaathi",
  ogDescription: "Instantly convert any old IPC section to its new BNS 2023 equivalent. Free legal tool for Indian citizens.",
};
