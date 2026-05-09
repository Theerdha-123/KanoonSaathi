/**
 * KanoonSaathi — Comprehensive IPC → BNS Transition Database
 * An expanded mapping database handling 1:1, Many:1, Omitted, and New BNS sections.
 * Effective from 1 July 2024.
 */

export const IPC_TO_BNS = [
  // ─── 1:1 DIRECT MAPPINGS (Critical Offenses) ───
  {
    ipcSection: "302",
    bnsSection: "103(1)",
    mappingType: "1:1",
    crimeNameEnglish: "Murder",
    crimeNameHindi: "हत्या",
    simpleDescription: "Intentionally causing the death of a person. Punishment: Death or life imprisonment + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "304",
    bnsSection: "105",
    mappingType: "1:1",
    crimeNameEnglish: "Culpable Homicide not amounting to Murder",
    crimeNameHindi: "गैर-इरादतन हत्या",
    simpleDescription: "Causing death without the full intention to kill. Punishment: Life imprisonment, or up to 10 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "304A",
    bnsSection: "106(1)",
    mappingType: "1:1",
    crimeNameEnglish: "Death by Negligence",
    crimeNameHindi: "लापरवाही से मृत्यु",
    simpleDescription: "Causing death by rash or negligent act (e.g., reckless driving). Punishment: Up to 5 years + fine.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "307",
    bnsSection: "109",
    mappingType: "1:1",
    crimeNameEnglish: "Attempt to Murder",
    crimeNameHindi: "हत्या का प्रयास",
    simpleDescription: "Doing an act with such intention that if it caused death, the person would be guilty of murder. Punishment: Up to 10 years + fine (Life if hurt caused).",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "375, 376",
    bnsSection: "63, 64",
    mappingType: "1:1",
    crimeNameEnglish: "Rape",
    crimeNameHindi: "बलात्कार",
    simpleDescription: "Sexual intercourse without consent or against will. Strict minimum punishments (10 years to Life) apply.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "354",
    bnsSection: "74",
    mappingType: "1:1",
    crimeNameEnglish: "Outraging Modesty of a Woman",
    crimeNameHindi: "महिला की गरिमा को ठेस पहुंचाना",
    simpleDescription: "Assault or criminal force to woman with intent to outrage her modesty. Punishment: 1 to 5 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "498A",
    bnsSection: "85",
    mappingType: "1:1",
    crimeNameEnglish: "Cruelty by Husband or Relatives",
    crimeNameHindi: "पति या रिश्तेदारों द्वारा क्रूरता",
    simpleDescription: "Subjecting a woman to cruelty, physical or mental harassment. Punishment: Up to 3 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "363",
    bnsSection: "137",
    mappingType: "1:1",
    crimeNameEnglish: "Kidnapping",
    crimeNameHindi: "अपहरण",
    simpleDescription: "Taking away a minor or person of unsound mind without consent of guardian. Punishment: Up to 7 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "323",
    bnsSection: "115(2)",
    mappingType: "1:1",
    crimeNameEnglish: "Voluntarily Causing Hurt",
    crimeNameHindi: "स्वेच्छा से चोट पहुंचाना",
    simpleDescription: "Causing bodily pain, disease, or infirmity. Punishment: Up to 1 year, or fine up to ₹10,000, or both.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "324",
    bnsSection: "118(1)",
    mappingType: "1:1",
    crimeNameEnglish: "Hurt by Dangerous Weapons",
    crimeNameHindi: "खतरनाक हथियारों से चोट पहुंचाना",
    simpleDescription: "Causing hurt using instruments for shooting, stabbing, or cutting. Punishment: Up to 3 years, or fine, or both.",
    cognizable: true, bailable: true
  },
  {
    ipcSection: "326",
    bnsSection: "118(2)",
    mappingType: "1:1",
    crimeNameEnglish: "Grievous Hurt by Dangerous Weapons",
    crimeNameHindi: "खतरनाक हथियारों से गंभीर चोट",
    simpleDescription: "Causing severe, permanent, or life-threatening injuries with weapons. Punishment: Life or up to 10 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "420",
    bnsSection: "318",
    mappingType: "1:1",
    crimeNameEnglish: "Cheating and Dishonestly Inducing Delivery of Property",
    crimeNameHindi: "धोखाधड़ी",
    simpleDescription: "Deceiving someone to deliver property or alter a valuable security. Punishment: Up to 7 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "406",
    bnsSection: "316(2)",
    mappingType: "1:1",
    crimeNameEnglish: "Criminal Breach of Trust",
    crimeNameHindi: "आपराधिक विश्वासघात",
    simpleDescription: "Misappropriating property entrusted to one's care. Punishment: Up to 5 years, or fine, or both.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "468",
    bnsSection: "336(3)",
    mappingType: "1:1",
    crimeNameEnglish: "Forgery for Purpose of Cheating",
    crimeNameHindi: "धोखाधड़ी के उद्देश्य से जालसाजी",
    simpleDescription: "Forging a document intending it to be used for cheating. Punishment: Up to 7 years + fine.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "504",
    bnsSection: "352",
    mappingType: "1:1",
    crimeNameEnglish: "Intentional Insult to Provoke Breach of Peace",
    crimeNameHindi: "शांति भंग करने के इरादे से अपमान",
    simpleDescription: "Insulting someone intending to provoke them to commit an offense. Punishment: Up to 2 years, or fine, or both.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "506",
    bnsSection: "351(2)",
    mappingType: "1:1",
    crimeNameEnglish: "Criminal Intimidation",
    crimeNameHindi: "आपराधिक धमकी",
    simpleDescription: "Threatening injury to person, reputation, or property. Punishment: Up to 2 years (up to 7 if threat of death/grievous hurt).",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "120B",
    bnsSection: "61(2)",
    mappingType: "1:1",
    crimeNameEnglish: "Criminal Conspiracy",
    crimeNameHindi: "आपराधिक साजिश",
    simpleDescription: "Two or more persons agreeing to commit an illegal act. Punishment varies based on the underlying offense planned.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "34",
    bnsSection: "3(5)",
    mappingType: "1:1",
    crimeNameEnglish: "Common Intention",
    crimeNameHindi: "सामान्य आशय",
    simpleDescription: "When a crime is done by multiple persons in furtherance of common intention, each is liable as if done by them alone.",
    cognizable: true, bailable: false
  },

  // ─── MANY-TO-ONE CONSOLIDATIONS ───
  {
    ipcSection: "378, 379, 380, 381, 382",
    bnsSection: "303",
    mappingType: "Many:1",
    crimeNameEnglish: "Theft (Consolidated)",
    crimeNameHindi: "चोरी",
    simpleDescription: "Consolidates all forms of theft (in dwelling, by clerk, with preparation for hurt) into one unified section. Punishment: Up to 3 years (higher for specific aggravations).",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "383, 384, 385, 386",
    bnsSection: "308",
    mappingType: "Many:1",
    crimeNameEnglish: "Extortion (Consolidated)",
    crimeNameHindi: "जबरन वसूली",
    simpleDescription: "Intentionally putting a person in fear of injury to extort property. Consolidates various extortion sections.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "390, 391, 392, 393, 395",
    bnsSection: "309, 310",
    mappingType: "Many:1",
    crimeNameEnglish: "Robbery and Dacoity (Consolidated)",
    crimeNameHindi: "लूट और डकैती",
    simpleDescription: "Theft combined with violence/threat (Robbery), committed by 5 or more persons (Dacoity).",
    cognizable: true, bailable: false
  },

  // ─── MODIFIED / REDEFINED ───
  {
    ipcSection: "124A",
    bnsSection: "152",
    mappingType: "Modified",
    crimeNameEnglish: "Acts Endangering Sovereignty (formerly Sedition)",
    crimeNameHindi: "संप्रभुता को खतरे में डालने वाले कार्य",
    simpleDescription: "The word 'Sedition' was removed. BNS 152 penalizes acts, spoken/written words, or electronic communication that endanger sovereignty, unity, and integrity of India.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "279",
    bnsSection: "281",
    mappingType: "Modified",
    crimeNameEnglish: "Rash Driving",
    crimeNameHindi: "तेज़ और लापरवाही से गाड़ी चलाना",
    simpleDescription: "Driving any vehicle on a public way in a manner so rash or negligent as to endanger human life. Fines have been increased.",
    cognizable: true, bailable: true
  },

  // ─── OMITTED (DECRIMINALIZED) ───
  {
    ipcSection: "377",
    bnsSection: "Omitted",
    mappingType: "Omitted",
    crimeNameEnglish: "Unnatural Offenses (Consensual)",
    crimeNameHindi: "अप्राकृतिक अपराध",
    simpleDescription: "Consensual same-sex relations have been fully decriminalized following the Supreme Court's Navtej Singh Johar judgment. The BNS has completely dropped this section.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "497",
    bnsSection: "Omitted",
    mappingType: "Omitted",
    crimeNameEnglish: "Adultery",
    crimeNameHindi: "व्यभिचार",
    simpleDescription: "Adultery is no longer a criminal offense following the Supreme Court's Joseph Shine judgment. It remains a ground for divorce, but not a crime.",
    cognizable: false, bailable: true
  },
  {
    ipcSection: "309",
    bnsSection: "Omitted",
    mappingType: "Omitted",
    crimeNameEnglish: "Attempt to Commit Suicide",
    crimeNameHindi: "आत्महत्या का प्रयास",
    simpleDescription: "Decriminalized in the BNS to align with modern mental health perspectives. The Mental Healthcare Act provides care rather than punishment.",
    cognizable: false, bailable: true
  },

  // ─── ENTIRELY NEW SECTIONS ───
  {
    ipcSection: "None",
    bnsSection: "111",
    mappingType: "New",
    crimeNameEnglish: "Organized Crime",
    crimeNameHindi: "संगठित अपराध",
    simpleDescription: "New provision targeting syndicates involved in kidnapping, extortion, land grabbing, and cyber-crimes. Punishment: Life to Death if it results in death.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "None",
    bnsSection: "112",
    mappingType: "New",
    crimeNameEnglish: "Petty Organized Crime",
    crimeNameHindi: "छोटे संगठित अपराध",
    simpleDescription: "New provision targeting mobile snatching, pickpocketing, ticket scalping, and petty gambling by groups. Punishment: 1 to 7 years.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "None",
    bnsSection: "103(2)",
    mappingType: "New",
    crimeNameEnglish: "Mob Lynching",
    crimeNameHindi: "भीड़ द्वारा हत्या",
    simpleDescription: "Specific provision for murder committed by a group of 5 or more persons on grounds of race, caste, sex, or language. Punishment: Life or Death.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "None",
    bnsSection: "113",
    mappingType: "New",
    crimeNameEnglish: "Terrorist Act",
    crimeNameHindi: "आतंकवादी कृत्य",
    simpleDescription: "Brings terrorism offenses into the general penal code (previously only under UAPA). Punishment: Death or Life Imprisonment.",
    cognizable: true, bailable: false
  },
  {
    ipcSection: "None",
    bnsSection: "69",
    mappingType: "New",
    crimeNameEnglish: "Sexual Intercourse by False Promise",
    crimeNameHindi: "झूठे वादे से यौन संबंध",
    simpleDescription: "Explicitly criminalizes sexual intercourse secured through a deceitful promise of marriage, employment, or promotion. Distinct from rape. Punishment: Up to 10 years.",
    cognizable: true, bailable: false
  }
];

/**
 * SEO meta tags for the BNS Translator page
 */
export const BNS_SEO = {
  title: "Complete IPC to BNS Converter — All Sections | KanoonSaathi",
  description: "Free, comprehensive IPC to BNS converter. Instantly translate old Indian Penal Code sections to new Bharatiya Nyaya Sanhita (BNS) 2023 sections, including omissions and new crimes.",
  keywords: "IPC to BNS converter, BNS section for theft, BNS section for murder, new criminal laws India 2024, Bharatiya Nyaya Sanhita, IPC 420 BNS equivalent, IPC 302 to BNS, BNS 2023 section list, IPC BNS mapping, omitted IPC sections",
  ogTitle: "Complete IPC to BNS Section Converter — KanoonSaathi",
  ogDescription: "Instantly convert any old IPC section to its new BNS 2023 equivalent. Handles many-to-one mappings, new additions, and omitted sections.",
};
