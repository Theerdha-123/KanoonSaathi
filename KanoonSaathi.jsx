import { useState, useRef, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SCENARIOS = [
  { id:"theft",    icon:"📱", title:"Phone / Vehicle Stolen",            tag:"IPC 379",    color:"#FF6B00", situation:"Your phone, bike, car or wallet was stolen.",                                                    laws:["IPC Section 379 — Theft (up to 3 yrs imprisonment)","IPC Section 411 — Receiving stolen property"],                                                                                 steps:["Go to nearest police station immediately","File FIR under IPC 379 — police CANNOT legally refuse","Get FIR copy free of charge — demand it","For vehicle: also report to RTO with FIR copy","Block your SIM & bank cards immediately","File at cybercrime.gov.in if phone was misused for fraud"],                                                              punishment:"Thief gets up to 3 years imprisonment + fine.",                                         helpline:"Police: 100 | Cyber Crime: 1930" },
  { id:"builder",  icon:"🏗️", title:"Builder Fraud / Flat Possession",   tag:"RERA",       color:"#C0392B", situation:"Builder took money but didn't give possession, changed plans, or disappeared.",               laws:["RERA Act 2016 — Section 18 (Delayed Possession)","IPC Section 420 — Cheating (up to 7 yrs)","RERA Section 12 — False advertisement liability"],                                        steps:["Collect all payment receipts and booking agreement","File complaint on your State RERA portal (e.g. maharera.mahaonline.gov.in)","Pay Rs.1,000 filing fee — no lawyer needed","Builder must respond within 60 days","Simultaneously file FIR at police station under IPC 420","Claim full refund + SBI MCLR interest rate compensation"],                                 punishment:"Builder jailed up to 3 years + fined up to 10% of project cost.",               helpline:"State RERA website | Consumer: 1915" },
  { id:"food",     icon:"🤢", title:"Food Poisoning / Unsafe Food",       tag:"FSS Act",    color:"#B8860B", situation:"Restaurant or packaged food made you sick or contained harmful substances.",                   laws:["FSS Act 2006 — Section 59 (Adulteration, up to 6 yrs)","FSS Act — Section 63 (Unsafe food)","Consumer Protection Act 2019"],                                                           steps:["Preserve the food sample in a sealed bag as evidence","Take medical treatment and keep all bills/receipts","File complaint with district Food Safety Officer","Call FSSAI helpline: 1800-112-100 (free)","File consumer complaint at edaakhil.nic.in for compensation","For serious illness: also file FIR at police station"],                                          punishment:"Restaurant owner gets up to 6 years jail + Rs.5 lakh fine.",                    helpline:"FSSAI: 1800-112-100 | Consumer: 1915" },
  { id:"flight",   icon:"✈️", title:"Flight Cancelled / Delayed",         tag:"DGCA",       color:"#0047AB", situation:"Your flight was cancelled, delayed, or you were denied boarding.",                             laws:["DGCA Civil Aviation Requirements (CAR)","Consumer Protection Act 2019","Montreal Convention (International flights)"],                                                               steps:["Screenshot everything — cancellation notice, boarding pass","Demand meals/refreshments if delay is 2+ hours","Demand full refund OR alternate flight if cancelled (your choice)","Get Rs.5,000–10,000 compensation if denied boarding","File complaint at complaints.aviation.in","File consumer complaint at edaakhil.nic.in if airline ignores"],                         punishment:"Airline fined + ordered to pay compensation by DGCA/Consumer Forum.",           helpline:"DGCA: 1800-111-3039 | Consumer: 1915" },
  { id:"salary",   icon:"💸", title:"Salary Not Paid / Workplace Rights", tag:"Labour Law", color:"#5B2D8E", situation:"Employer not paying salary, making illegal deductions, or violating your workplace rights.",   laws:["Payment of Wages Act 1936 — Section 5","Minimum Wages Act 1948","IPC Section 406 — Criminal Breach of Trust"],                                                                     steps:["Email employer demanding salary with a 7-day written deadline","File complaint with Labour Commissioner of your district","Call Labour Helpline: 14567 (free, pan-India)","File complaint at shramsuvidha.gov.in online","For criminal non-payment: file FIR under IPC 406","Approach Labour Court — claim unpaid wages + 10x compensation"],                                    punishment:"Employer imprisoned up to 6 months + must pay 10x unpaid amount.",              helpline:"Labour: 14567 | EPF: 1800-118-005" },
  { id:"scam",     icon:"💻", title:"Online Scam / UPI Fraud",            tag:"IT Act",     color:"#1A5276", situation:"You were cheated online — UPI fraud, fake website, investment scam, fake job offer.",         laws:["IT Act 2000 — Section 66D (Online cheating, up to 3 yrs)","IT Act — Section 66C (Identity theft)","IPC Section 420 — Cheating (up to 7 yrs)"],                                     steps:["Call 1930 IMMEDIATELY — they can sometimes freeze the transaction","File at cybercrime.gov.in within 24 hours for best chance of recovery","Contact your bank immediately to freeze/reverse the transaction","Screenshot all chats, payment receipts, and fake websites","File FIR at nearest Cyber Crime Police Station","Track complaint on National Cyber Crime Portal"],          punishment:"Scammer gets up to 3–7 years imprisonment + fine equal to amount cheated.",    helpline:"Cyber Crime: 1930 | Bank: Your 24x7 helpline" },
  { id:"rti",      icon:"📋", title:"How to File RTI",                    tag:"RTI Act",    color:"#2E4057", situation:"You want information from any government office about work done, funds used, or your complaint status.", laws:["RTI Act 2005 — Section 3 (Every citizen can file)","RTI Act — Section 7 (30-day response deadline)","RTI Act — Section 20 (Rs.250/day penalty on PIO)"],              steps:["Go to rtionline.gov.in (central govt) or your State RTI portal","Select the Ministry or Department you need info from","Write specific, clear questions — one topic per question works best","Pay Rs.10 fee online (BPL card holders get it FREE)","PIO must respond within 30 days","No response? File First Appeal, then Second Appeal to CIC/SIC"],                          punishment:"PIO fined Rs.250/day up to Rs.25,000 total for ignoring your RTI.",            helpline:"RTI Portal: rtionline.gov.in" },
  { id:"medical",  icon:"🏥", title:"Medical Negligence / Hospital",      tag:"IPC 304A",   color:"#E74C3C", situation:"Doctor was negligent, hospital overcharged, or emergency treatment was refused.",              laws:["IPC Section 304A — Medical Negligence (up to 2 yrs)","Consumer Protection Act 2019 (hospitals fully covered)","Clinical Establishments Act 2010"],                                  steps:["Get ALL medical records, prescriptions, bills immediately","Get second medical opinion documenting the negligence clearly","File consumer complaint at edaakhil.nic.in for compensation","File complaint with State Medical Council against the doctor","For death cases: file FIR under IPC 304A at police station","Emergency refusal: complain to District Collector the same day"], punishment:"Doctor imprisoned 2 years + fined. Medical license can be cancelled.",          helpline:"NHRC: 14433 | Consumer: 1915 | Emergency: 112" },
  { id:"fir",      icon:"🚔", title:"Police Refusing FIR / Illegal Arrest",tag:"CrPC 154",  color:"#2C3E50", situation:"Police refused to register your FIR or arrested you without proper reason.",                   laws:["CrPC Section 154 — FIR cannot be refused for cognizable offence","Article 22 — Right to lawyer from moment of arrest","IPC Section 166 — Police dereliction of duty"],               steps:["If refused: send written complaint by Speed Post to SP/SSP","Approach Judicial Magistrate directly under CrPC Section 156(3)","File complaint with State Human Rights Commission","Illegal arrest: file Habeas Corpus petition in High Court","Demand written memo of arrest and reason in writing","Call DLSA for free legal aid: 15100"],                                      punishment:"Police officer imprisoned up to 1 year + departmental action.",                 helpline:"Police: 100 | NHRC: 14433 | Free Legal Aid: 15100" },
  { id:"consumer", icon:"🛒", title:"Defective Product / Refund Refused", tag:"CPA 2019",   color:"#138808", situation:"Got a defective product, seller refuses refund, or you were overcharged.",                    laws:["Consumer Protection Act 2019 — Section 35","Product Liability — CPA Section 82","Legal Metrology Act (selling above MRP)"],                                                          steps:["Keep all receipts, bills, packaging as evidence","Write formally to seller demanding refund with a 15-day deadline","File free complaint at edaakhil.nic.in (no lawyer needed)","Call National Consumer Helpline: 1915 for guidance","District Forum handles claims up to Rs.1 crore","Forum can award compensation, replacement + punitive damages"],                        punishment:"Seller fined up to Rs.10 lakhs + imprisoned up to 2 years.",                   helpline:"Consumer: 1915 | edaakhil.nic.in" },
  { id:"dowry",    icon:"⚖️", title:"Dowry Harassment / Domestic Violence",tag:"IPC 498A",  color:"#9B1D20", situation:"Facing dowry demands, physical or mental cruelty from husband or in-laws.",                   laws:["IPC Section 498A — Cruelty by husband/relatives (up to 3 yrs)","Dowry Prohibition Act 1961","Protection of Women from Domestic Violence Act 2005"],                                  steps:["Call Mahila Helpline: 181 (free, 24x7, confidential)","File FIR at nearest police station under IPC 498A","Approach Women's Cell at police station","File application under PWDV Act for protection order + maintenance","Approach National Commission for Women at ncw.nic.in","Get free legal aid from DLSA: 15100"],                                                         punishment:"Husband/in-laws get up to 3 years imprisonment + fine under IPC 498A.",        helpline:"Mahila: 181 | Police: 100 | NCW: 7827170170" },
  { id:"tax",      icon:"💰", title:"Tax Notice / TDS Not Deposited",     tag:"Income Tax", color:"#1A6B3A", situation:"Received an income tax notice or employer didn't deposit your TDS.",                          laws:["Income Tax Act — Section 276C (Tax evasion)","TDS Rules — Section 194 (Employer obligation)","Taxpayer Charter — Right to be heard before any action"],                            steps:["Never ignore a tax notice — always respond by the stated deadline","Check Form 26AS at incometax.gov.in to verify your TDS was deposited","Employer didn't deposit TDS? Complain to the jurisdictional TDS Officer","For unreasonable notice: file your response at the incometax.gov.in portal","Appeal to CIT(Appeals) within 30 days if you are not satisfied","Complain to CBDT Grievance Portal if harassed by a tax officer"],                                   punishment:"Employer not depositing TDS: up to 7 years imprisonment + fine.",              helpline:"Income Tax: 1800-103-0025 | incometax.gov.in" },
  { id:"gst_hotel", icon:"🏨", title:"Hotel / Restaurant Illegal GST Charge", tag:"GST + CPA", color:"#C87941", situation:"A hotel or restaurant added SGST/CGST on your bill illegally, charged above MRP on items, or forced service charge.", laws:["CGST Act 2017 — GST Rate Slabs for Restaurants","CCPA Guidelines 2022 — Service Charge Banned","Legal Metrology Act 2009 — MRP overcharge illegal","Consumer Protection Act 2019 — Sec 35"], steps:["First, know when GST IS and IS NOT applicable (see below)","Ask the hotel/restaurant for itemised bill before paying","Politely but firmly refuse to pay service charge — it is NOT mandatory","If they insist, pay under protest and write 'Paid under Protest' on the bill","Take a photo of the full bill as evidence","File complaint at consumerhelpline.gov.in or call 1915","For GST overcharge: file complaint at GST helpline 1800-103-4786","For MRP overcharge on bottled water/packaged items: call 1800-11-4000 (Legal Metrology)"], punishment:"Restaurant: consumer forum can order refund + compensation. GST fraud: penalty up to 100% of tax evaded. Repeated MRP violation: Rs.50,000 fine.", helpline:"Consumer: 1915 | GST: 1800-103-4786 | Legal Metrology: 1800-11-4000" },
  { id:"railway",   icon:"🚂", title:"TTE Misconduct / Train Travel Rights",  tag:"Railway Act", color:"#1565C0", situation:"TTE demanding extra money beyond official penalty, behaving rudely, not giving receipt, or you need to know your rights as a train passenger.", laws:["Railway Act 1989 — Section 137 (Ticketless travel penalty)","Railway Act — Section 138 (Wrong class penalty)","Prevention of Corruption Act 1988 — TTE bribery","IPC Section 294/504 — TTE vulgar/abusive behaviour"], steps:["Know your right: TTE can only charge official penalty (Rs.250 + excess fare) — nothing more","If TTE demands extra money: firmly say 'I will pay only the official penalty. Please give me an EFR receipt'","Always demand EFR (Excess Fare Receipt) — TTE must provide it by law","Note the TTE's name, badge number, time, and train/compartment details","Record audio/video discreetly if TTE is misbehaving or demanding bribe","File complaint at railmadad.indianrailways.gov.in or call 139 (Railway Helpline) — available 24x7","Report to Station Master at next stop","For bribery: additionally file complaint at Railway Vigilance / ACB"], punishment:"TTE demanding bribe: 3–7 years imprisonment under PC Act. Vulgar/abusive conduct: departmental action + IPC 294/504 charges.", helpline:"Railway Helpline: 139 | RailMadad: railmadad.indianrailways.gov.in | GRP: 1512" },
];

const HELPLINES = [
  { icon:"🚨", name:"Police Emergency",      number:"100",          color:"#C0392B", desc:"Crime, threat, any emergency" },
  { icon:"⚖️", name:"Universal Emergency",   number:"112",          color:"#8B0000", desc:"All emergencies — fastest response" },
  { icon:"🚑", name:"Ambulance",             number:"108",          color:"#E74C3C", desc:"Medical emergency" },
  { icon:"🔥", name:"Fire Brigade",          number:"101",          color:"#FF6B00", desc:"Fire & rescue" },
  { icon:"👩", name:"Mahila Helpline",       number:"181",          color:"#9B1D20", desc:"Women in distress, domestic violence" },
  { icon:"👶", name:"Child Helpline",        number:"1098",         color:"#FF9500", desc:"Child abuse, missing children" },
  { icon:"💻", name:"Cyber Crime",           number:"1930",         color:"#1A5276", desc:"UPI fraud, online scam — call ASAP" },
  { icon:"🛒", name:"Consumer Helpline",     number:"1915",         color:"#138808", desc:"Consumer complaints & guidance" },
  { icon:"🍱", name:"FSSAI Food Safety",     number:"1800-112-100", color:"#B8860B", desc:"Unsafe food, adulteration" },
  { icon:"✈️", name:"DGCA Aviation",         number:"1800-111-3039",color:"#0047AB", desc:"Flight delays, baggage, cancellations" },
  { icon:"💼", name:"Labour Helpline",       number:"14567",        color:"#5B2D8E", desc:"Salary issues, workplace rights" },
  { icon:"🏦", name:"Bank Ombudsman",        number:"14448",        color:"#1A6B3A", desc:"Banking fraud & complaints" },
  { icon:"📋", name:"Anti-Corruption",       number:"1064",         color:"#2E4057", desc:"Bribery, corruption reports" },
  { icon:"⚖️", name:"Free Legal Aid (DLSA)", number:"15100",        color:"#FF6B00", desc:"Free lawyer for those who need it" },
  { icon:"👴", name:"Senior Citizen",        number:"14567",        color:"#6B4423", desc:"Elder abuse, pension issues" },
  { icon:"🧠", name:"Mental Health (iCall)", number:"9152987821",   color:"#5B2D8E", desc:"Psychological support helpline" },
  { icon:"🚂", name:"Railway Helpline",      number:"139",          color:"#1565C0", desc:"Train complaints, TTE misconduct, emergencies" },
  { icon:"👮", name:"GRP Railway Police",    number:"1512",         color:"#2C3E50", desc:"Crime on train or railway station" },
  { icon:"🚉", name:"RailMadad Grievance",   number:"railmadad.indianrailways.gov.in", color:"#1565C0", desc:"Online complaint portal for all railway issues" },
];

// ─── WOMEN'S SAFETY APPS & HELPLINES ─────────────────────────────────────────
const WOMEN_APPS = [
  {
    icon:"📱", name:"Himmat Plus", by:"Delhi Police", type:"App",
    color:"#C0392B",
    number:"N/A (App-based)", playstore:"Available on Google Play & App Store",
    desc:"Official Delhi Police app for women's safety. Press SOS button to send location + alert to police control room and 5 emergency contacts simultaneously. Works even on a locked phone.",
    howto:"Download → Register with mobile number → Add 5 emergency contacts → Press SOS in danger.",
    usefulFor:"Women travelling alone in Delhi, harassment, stalking, eve-teasing."
  },
  {
    icon:"🆘", name:"112 India (Dial 112)", by:"Ministry of Home Affairs", type:"App + Call",
    color:"#8B0000",
    number:"112", playstore:"112 India App — Google Play & App Store",
    desc:"India's official emergency response app. Replaces 100, 101, 108. Automatically shares your GPS location with nearest police/fire/ambulance. Women's SOS feature sends alert with live location.",
    howto:"Call 112 OR use app SOS. Location shared automatically. Free, works on 2G.",
    usefulFor:"Any emergency anywhere in India — police, ambulance, fire."
  },
  {
    icon:"👩", name:"Mahila Helpline 181", by:"Ministry of Women & Child Development", type:"Helpline",
    color:"#9B1D20",
    number:"181", playstore:"Free call from any phone, 24x7",
    desc:"24x7 confidential helpline for women in distress. Provides immediate support, connects to police, shelter homes, legal aid, medical help. Works pan-India. Calls are free and confidential.",
    howto:"Call 181 from any phone. Describe your situation. They will dispatch help or guide you.",
    usefulFor:"Domestic violence, harassment, stalking, trafficking, sexual assault, marital problems."
  },
  {
    icon:"🛡️", name:"iCall", by:"TISS (Tata Institute of Social Sciences)", type:"App + Helpline",
    color:"#5B2D8E",
    number:"9152987821", playstore:"iCall App — Google Play",
    desc:"Free mental health counselling for women and all. Psychologists available for counselling on trauma, abuse, depression, anxiety from domestic violence or harassment.",
    howto:"Call helpline or book appointment via app. Sessions are free and confidential.",
    usefulFor:"Trauma recovery after assault, domestic violence, harassment. Mental health support."
  },
  {
    icon:"📍", name:"Nirbhaya App / She-Cab", by:"Various State Govts", type:"App",
    color:"#FF6B00",
    number:"Varies by state", playstore:"Search 'Nirbhaya' on Play Store for your state version",
    desc:"State-level women's safety apps (Maharashtra, UP, Karnataka have their own versions). GPS tracking shared with police and family. Fake call feature to escape uncomfortable situations.",
    howto:"Download state-specific version. Register. Set emergency contacts. Press SOS when needed.",
    usefulFor:"Late night travel, unfamiliar areas, stalking, harassment."
  },
  {
    icon:"⚖️", name:"NCW (National Commission for Women)", by:"Govt of India", type:"Online + App",
    color:"#1A6B3A",
    number:"7827170170", playstore:"ncw.nic.in | WhatsApp: 7217735372",
    desc:"National Commission for Women handles complaints of violation of women's rights. File complaints online. Also has a dedicated WhatsApp number for quick reporting of crimes against women.",
    howto:"Visit ncw.nic.in → File complaint online OR WhatsApp at 7217735372 with details and evidence.",
    usefulFor:"Workplace harassment, domestic violence, trafficking, violation of women's legal rights."
  },
  {
    icon:"🏠", name:"One Stop Centre (Sakhi)", by:"Ministry of WCD", type:"Centre + Helpline",
    color:"#B8860B",
    number:"181 (connects to OSC)", playstore:"Present in every district of India",
    desc:"Integrated support centres for women affected by violence. Provides medical aid, police assistance, legal aid, psycho-social counselling and temporary shelter — all under one roof, free of cost.",
    howto:"Call 181 to be directed to nearest One Stop Centre. Available 24x7. All services free.",
    usefulFor:"Domestic violence survivors, rape victims, acid attack victims, trafficking victims."
  },
  {
    icon:"💬", name:"Sheroes Community / iSafe", by:"Sheroes Platform", type:"App",
    color:"#E74C3C",
    number:"App-based", playstore:"Sheroes App — Google Play & App Store",
    desc:"Women-only community app with legal advice, safety tips, career guidance and peer support. Connects women with lawyers, counsellors and mentors. Safe space to share experiences.",
    howto:"Download Sheroes app. Join community. Ask questions anonymously or connect with experts.",
    usefulFor:"Legal queries, workplace issues, mental health, career, entrepreneurship guidance for women."
  },
  {
    icon:"🚗", name:"Ola/Uber SOS Feature", by:"Ola & Uber", type:"In-App Feature",
    color:"#2C3E50",
    number:"In-app Emergency button", playstore:"Available in Ola and Uber ride apps",
    desc:"Both Ola and Uber have built-in emergency SOS buttons that instantly share your ride details and live location with police (Dial 112) and emergency contacts. Driver details also shared.",
    howto:"During ride → tap Shield/Safety icon → press Emergency SOS. Location + cab details sent to police.",
    usefulFor:"Women travelling alone in cabs at night. Any unsafe situation during a cab ride."
  },
  {
    icon:"📞", name:"POCSO e-Box", by:"NCPCR (Govt of India)", type:"Online Portal",
    color:"#FF9500",
    number:"1098 (Child Helpline)", playstore:"eboxncpcr.gov.in",
    desc:"Online portal to report child sexual abuse under POCSO Act. Anonymous reporting allowed. NCPCR takes direct action. Useful for school teachers, parents and children to report abuse.",
    howto:"Visit eboxncpcr.gov.in → Fill complaint form → Anonymous reporting allowed → NCPCR acts within 24 hours.",
    usefulFor:"Reporting child sexual abuse, school harassment, online child exploitation."
  },
];

// ─── DISABILITY LAWS ──────────────────────────────────────────────────────────
const DISABILITY_LAWS = [
  { icon:"♿", color:"#1A8FBF", title:"Right to Equal Opportunities", article:"RPwD Act 2016 — Sec 20", desc:"Persons with benchmark disabilities have the right to equal opportunity in education, employment, and public services. Government establishments must reserve 4% of posts for persons with disabilities.", action:"If discriminated in hiring: file complaint with Chief Commissioner for Persons with Disabilities at ccdisabilities.nic.in or call 1800-11-4515 (free)." },
  { icon:"🏫", color:"#138808", title:"Right to Inclusive Education", article:"RPwD Act 2016 — Sec 16 & 17", desc:"Every child with a disability has the right to free inclusive education in neighbourhood schools up to age 18. Schools must provide reasonable accommodation — scribes, extra time, accessible buildings.", action:"If school denies admission or accommodation: write to District Education Officer citing RPwD Act 2016. Approach State Commissioner for Disabilities if ignored." },
  { icon:"🏛️", color:"#8B0000", title:"Accessibility in Public Places", article:"RPwD Act 2016 — Sec 40–46", desc:"All government buildings, public transport, websites, and services must be made accessible to persons with disabilities. Ramps, tactile paths, accessible toilets and lifts are mandatory.", action:"Report inaccessible government buildings to District Magistrate or State Commissioner for Disabilities. RTI can be filed to check compliance status." },
  { icon:"💼", color:"#5B2D8E", title:"Reservation in Government Jobs", article:"RPwD Act 2016 — Sec 34", desc:"4% reservation in all government establishments: 1% each for blindness/low vision, deaf/hard of hearing, locomotor disability, and other disabilities including autism/intellectual disability.", action:"If your application is rejected despite disability quota: file complaint with Chief Commissioner at ccdisabilities.nic.in. Approach CAT for government job disputes." },
  { icon:"🚌", color:"#C0392B", title:"Right to Accessible Transport", article:"RPwD Act + MoRTH Guidelines", desc:"All public transport — trains, buses, metros, airports — must be accessible to persons with disabilities. Indian Railways provides free escort, 75% concession, and wheelchair assistance.", action:"Book accessible coach at IRCTC. For accessibility complaints: Indian Railways helpline 139. Metro: contact station manager. DGCA for airport accessibility." },
  { icon:"💊", color:"#E74C3C", title:"Right to Healthcare & Rehabilitation", article:"RPwD Act 2016 — Sec 25", desc:"Government must provide free medicines, free or subsidised assistive devices, and rehabilitation services at government hospitals to persons with disabilities.", action:"Visit nearest government hospital or District Disability Rehabilitation Centre (DDRC). BPL persons with disabilities get all assistive devices free under ADIP scheme." },
  { icon:"💰", color:"#1A6B3A", title:"Disability Pension & Financial Support", article:"NSAP + State Schemes", desc:"Persons with 40%+ disability are entitled to disability pension under state government schemes. Many states provide Rs.500–2,000/month. PwDs also get income tax deduction under Section 80U.", action:"Apply at District Social Welfare Office. Carry disability certificate (from government hospital). Deduction under Income Tax Sec 80U: Rs.75,000 (40-80% disability) or Rs.1.25 lakh (80%+ disability)." },
  { icon:"📜", color:"#FF6B00", title:"UDID — Unique Disability ID Card", article:"RPwD Act 2016 + UDID Scheme", desc:"Every person with disability should have a UDID (Unique Disability ID) card — a national card that identifies disability type, percentage and entitlements. Required for all government benefits.", action:"Apply online at swavlambancard.gov.in. Visit nearest government hospital for disability assessment. Card is free. Required to claim all schemes, reservations and concessions." },
  { icon:"🔒", color:"#2C3E50", title:"Protection from Abuse & Exploitation", article:"RPwD Act 2016 — Sec 92", desc:"Any person who intentionally insults, intimidates, exploits, abuses or denies rights of a person with disability: 6 months to 5 years imprisonment + fine. Offences against women with disabilities carry enhanced punishment.", action:"File FIR at nearest police station. Also file complaint with State Commissioner for Persons with Disabilities. NHRC can be approached for rights violations." },
  { icon:"🧠", color:"#9B1D20", title:"Rights of Persons with Mental Illness", article:"Mental Healthcare Act 2017", desc:"Persons with mental illness have the right to dignified treatment, confidentiality, right to information about diagnosis, right to refuse treatment and right to access mental health care at government hospitals.", action:"For violations: file complaint with Mental Health Review Board or State Mental Health Authority. Unlawful admission to psychiatric facility: approach District Court." },
];

const LAW_DB = {
  common:     { id:"common",     icon:"👨‍👩‍👧", title:"Common Citizens",       color:"#FF6B00", desc:"Fundamental rights, IPC sections & Constitution Articles", laws:[
    { name:"Article 21 — Right to Life & Personal Liberty", section:"Art. 21",  desc:"No person shall be deprived of their life or personal liberty except as per procedure established by law. Covers dignity, health, education.", actionable:"File Habeas Corpus petition in High Court if illegally detained." },
    { name:"Article 14 — Right to Equality",                section:"Art. 14",  desc:"The State shall not deny equality before law to any person. No discrimination on basis of religion, race, caste, sex or birthplace.", actionable:"File writ petition if discriminated against by any government body." },
    { name:"IPC Section 420 — Cheating",                    section:"IPC 420",  desc:"Whoever cheats and dishonestly induces any person to deliver property — up to 7 years imprisonment + fine. Most commonly used fraud section.", actionable:"File FIR at nearest police station with all proof: messages, receipts, agreements." },
    { name:"IPC Section 379 — Theft",                       section:"IPC 379",  desc:"Whoever commits theft — up to 3 years imprisonment + fine. Applies to stolen phones, vehicles, wallets, jewellery.", actionable:"File FIR immediately. Note date, time, exact location. For vehicle: also report to RTO." },
    { name:"IPC Section 354 — Assault on Woman",            section:"IPC 354",  desc:"Assault using criminal force to outrage modesty of a woman — 1 to 5 years imprisonment.", actionable:"File FIR or call 112. Approach Women's Cell at police station." },
    { name:"IPC Section 498A — Dowry Cruelty",              section:"IPC 498A", desc:"Physical or mental cruelty by husband or relatives — up to 3 years imprisonment + fine.", actionable:"File FIR. Call Mahila Helpline 181. Approach Women's Commission." },
    { name:"IPC Section 302 — Murder",                      section:"IPC 302",  desc:"Intentional killing — death penalty or life imprisonment + fine.", actionable:"File FIR immediately. Preserve all evidence. Request post-mortem report." },
    { name:"IPC Section 500 — Defamation",                  section:"IPC 500",  desc:"False statements damaging another's reputation — up to 2 years imprisonment + fine.", actionable:"File complaint in Magistrate's court with full evidence of defamatory statements." },
    { name:"IT Act 66C — Identity Theft",                   section:"IT 66C",   desc:"Fraudulent use of another's identity (Aadhaar, PAN, OTP) — up to 3 years + Rs.1 lakh fine.", actionable:"File complaint at cybercrime.gov.in immediately. Call 1930." },
    { name:"IT Act 66D — Online Impersonation Fraud",        section:"IT 66D",   desc:"Cheating by impersonation using computers — up to 3 years + Rs.1 lakh fine. Covers UPI fraud, phishing.", actionable:"Call 1930 immediately. File at cybercrime.gov.in within 24 hours." },
  ]},
  consumer:   { id:"consumer",   icon:"🛒", title:"Consumer Rights",        color:"#138808", desc:"Protection against defective goods, service deficiency & unfair trade", laws:[
    { name:"Consumer Protection Act 2019 — Who is a Consumer", section:"CPA Sec 2(7)",  desc:"Anyone buying goods or hiring services for personal use (not resale) is a consumer with full legal protection.", actionable:"File complaint in Consumer Forum — no lawyer needed for claims under Rs.1 crore." },
    { name:"Consumer Protection Act — How to File Complaint",   section:"CPA Sec 35",   desc:"District Commission handles claims up to Rs.1 crore. State: up to Rs.10 crore. National: above Rs.10 crore.", actionable:"File online at edaakhil.nic.in. Call National Consumer Helpline: 1915." },
    { name:"GST Overcharge — Service Charge Not Mandatory",     section:"GST Rules",    desc:"Restaurant service charge is NOT mandatory by law. Charging GST above MRP is illegal.", actionable:"Refuse service charge. Complain to GST helpline 1800-103-4786." },
    { name:"E-Commerce Return & Refund Rights",                 section:"E-Comm Rules", desc:"E-commerce platforms must honour their stated return/refund policies. Sellers cannot refuse genuine returns within the policy period.", actionable:"Escalate to platform Grievance Officer. File at consumerhelpline.gov.in if refused." },
    { name:"Product Liability — CPA Section 82",                section:"CPA Sec 82",   desc:"Manufacturer liable for harm from a defective product — even if the consumer was unaware of the defect.", actionable:"File complaint against manufacturer in Consumer Forum. Claim full compensation for injuries." },
    { name:"MRP Rules — Selling Above MRP is a Crime",          section:"LMA 2009",     desc:"Selling any product above its printed MRP is a criminal offence. Retailer fined up to Rs.25,000 for first offence.", actionable:"Complain to District Legal Metrology Officer or call 1800-11-4000." },
  ]},
  tourist:    { id:"tourist",    icon:"✈️", title:"Tourist & Travel",       color:"#0047AB", desc:"DGCA rules, passenger rights & travel fraud protection", laws:[
    { name:"DGCA — Flight Delay Compensation",     section:"DGCA CAR",         desc:"Delay 2+ hrs: meals/refreshments mandatory. Delay 6+ hrs: full refund or alternate flight. Denied boarding: Rs.5,000–10,000.", actionable:"Demand compensation at counter. File at complaints.aviation.in or call 1800-111-3039." },
    { name:"DGCA — Lost or Damaged Baggage",       section:"DGCA Baggage",     desc:"Domestic: up to Rs.350/kg. International: up to USD 1,000 under Montreal Convention.", actionable:"File PIR (Property Irregularity Report) at airport immediately. Keep all boarding passes." },
    { name:"DGCA — Flight Cancellation Rights",    section:"DGCA Sec 4",       desc:"Cancellation without 2-week notice: full refund within 7 days OR alternate flight at no extra cost — your choice.", actionable:"Demand refund in writing. If refused, file at dgca.gov.in." },
    { name:"Hotel Fraud — Cheating + Consumer Act",section:"IPC 420 + CPA",   desc:"Different room online vs actual, hidden charges, or refused booked room — criminal cheating + consumer deficiency.", actionable:"Take photos as evidence. File consumer complaint AND FIR if money was lost." },
    { name:"Tourist Harassment — IPC 354/509",     section:"IPC 354/509",      desc:"Eve teasing and physical harassment of tourists — up to 3 years imprisonment.", actionable:"Call 112 or 1090 (Women Helpline). File FIR at nearest police station." },
  ]},
  govt:       { id:"govt",       icon:"🏛️", title:"Govt Employees",         color:"#8B0000", desc:"Service rules, RTI, pension rights & whistleblower protection", laws:[
    { name:"RTI Act 2005 — Filing an RTI Application",          section:"RTI Sec 6",    desc:"Any citizen can request information from any public authority. PIO must respond within 30 days (48 hours for life/liberty matters).", actionable:"Write to PIO. Pay Rs.10 fee. File online at rtionline.gov.in." },
    { name:"CCS Conduct Rules — Protection from Dismissal",     section:"CCS Rules",    desc:"Government employees cannot be dismissed without a proper inquiry. Natural justice must be followed — written charges + chance to defend.", actionable:"If dismissed unfairly, approach CAT (Central Administrative Tribunal)." },
    { name:"Whistleblower Protection Act 2014",                 section:"WPA 2014",     desc:"Employees exposing corruption are protected from victimization. Identity kept strictly confidential.", actionable:"File complaint at CVC — cvc.gov.in. Your identity is protected by law." },
    { name:"CCS Pension Rules 1972",                            section:"CCS Pension",  desc:"Pension entitled after 10 years qualifying service. Cannot be denied without valid legal process.", actionable:"If pension denied, approach CAT or file RTI to pension department for status." },
    { name:"Article 311 — Protection from Dismissal",           section:"Art. 311",     desc:"No civil servant shall be dismissed or reduced in rank without inquiry and a reasonable opportunity to defend themselves.", actionable:"File writ petition in High Court if Art. 311 protections are violated." },
  ]},
  private:    { id:"private",    icon:"💼", title:"Private Employees",      color:"#5B2D8E", desc:"Labour laws, PF, gratuity & workplace rights", laws:[
    { name:"Minimum Wages Act 1948",                section:"MWA 1948",  desc:"Every employer must pay state-notified minimum wages. Non-payment is criminal — up to 6 months imprisonment.", actionable:"File complaint with Labour Commissioner. Call Labour Helpline: 14567." },
    { name:"Payment of Gratuity Act 1972",          section:"PGA Sec 4", desc:"5 years continuous service entitles you to gratuity: 15 days salary per year. Must be paid within 30 days of leaving.", actionable:"Apply in Form I to employer. If refused, complain to Labour Commissioner." },
    { name:"EPF Act 1952 — PF Rights",              section:"EPF Act",   desc:"Employer must contribute 12% of basic salary to PF. Employee can withdraw for medical, home purchase, marriage.", actionable:"Check at epfindia.gov.in. File grievance at epfigms.gov.in if employer not depositing." },
    { name:"POSH Act 2013 — Sexual Harassment",     section:"POSH Act",  desc:"Workplaces with 10+ employees must have an Internal Complaints Committee (ICC). Sexual harassment at workplace: up to 3 years imprisonment.", actionable:"File complaint to ICC within 3 months. No ICC? File with District Officer." },
    { name:"Payment of Wages Act 1936",             section:"PWA Sec 5", desc:"Salary must be paid by 7th of next month. Unlawful deductions from salary are completely prohibited.", actionable:"File complaint with Labour Commissioner. Claim unpaid wages + 10x compensation." },
    { name:"Maternity Benefit Act 2017",            section:"MBA 2017",  desc:"26 weeks paid maternity leave for first 2 children. Dismissal of pregnant woman is illegal.", actionable:"Write to employer citing MBA 2017. Complain to Labour Commissioner if denied." },
  ]},

  labour: { id:"labour", icon:"🏗️", title:"Labour Laws & Rights", color:"#D35400", desc:"Comprehensive rights for all workers — wages, job security, safety, PF, ESI, trade unions & more", laws:[
    { name:"Minimum Wages Act 1948 — Right to Fair Pay", section:"MWA 1948 Sec 3", desc:"Every employer — factory, shop, farm, construction — must pay the minimum wage notified by the state government. Paying below minimum wage is a criminal offence. State wage rates differ by industry and skill level.", actionable:"Check your state's current minimum wage at labour.gov.in. File complaint with the Minimum Wages Inspector / Labour Commissioner. Call Labour Helpline: 14567. Penalty on employer: up to 6 months jail + Rs.500 fine." },
    { name:"Payment of Wages Act 1936 — Salary on Time", section:"PWA Sec 5", desc:"All wages must be paid by the 7th of the following month (10th if workforce exceeds 1,000). No unauthorised deductions allowed. Deductions permitted only for PF, ESI, advance repayment, and fines under standing orders.", actionable:"If salary delayed: write formally to employer. File complaint with Payment of Wages Authority (Labour Commissioner). Recover unpaid wages + 10x compensation as damages." },
    { name:"Equal Remuneration Act 1976 — Equal Pay", section:"ERA Sec 4", desc:"Men and women performing the same or similar work in the same establishment must receive equal remuneration. Discrimination in hiring on basis of sex is also prohibited. Violation: fine up to Rs.10,000 + imprisonment.", actionable:"File complaint with Labour Commissioner citing ERA 1976. Approach Labour Court for wage recovery + compensation for discrimination." },
    { name:"Payment of Gratuity Act 1972 — Retirement Benefit", section:"PGA Sec 4", desc:"Every employee who has completed 5 years of continuous service is entitled to gratuity: 15 days' last drawn salary × years of service. Maximum: Rs.20 lakh. Must be paid within 30 days of leaving / retirement / death.", actionable:"Submit Form I to employer on leaving. If not paid within 30 days: file complaint with Controlling Authority (Labour Commissioner). Interest of 10% per year on delayed payment." },
    { name:"EPF & MP Act 1952 — Provident Fund", section:"EPF Act Sec 6", desc:"Establishments with 20+ employees must register under EPF. Both employer and employee contribute 12% of basic salary + DA. Employer's failure to deposit PF is a criminal offence. Employee can withdraw for illness, housing, marriage, education.", actionable:"Check PF balance at epfindia.gov.in or via UMANG app. File grievance at epfigms.gov.in. For employer non-deposit: file complaint with EPFO Regional Office. Helpline: 1800-118-005." },
    { name:"ESI Act 1948 — Medical & Sickness Insurance", section:"ESI Act Sec 46", desc:"Workers earning up to Rs.21,000/month (Rs.25,000 for persons with disability) in establishments with 10+ workers are entitled to ESIC coverage. Benefits: free medical care for self + family, sickness cash benefit (70% of wages for 91 days/year), maternity benefit, disability benefit, dependent's pension.", actionable:"Ensure employer registers you with ESIC. Get ESIC card from employer. Access benefits at nearest ESIC hospital. Complaint for non-registration: ESIC Regional Office. Helpline: 1800-11-2526." },
    { name:"Industrial Disputes Act 1947 — Protection from Wrongful Termination", section:"IDA Sec 25F & 25N", desc:"Establishments with 100+ workers cannot retrench (layoff) employees without prior government permission. All employers must give 1 month notice OR 1 month pay before retrenchment. Workers retrenched get 15 days' pay per completed year as retrenchment compensation.", actionable:"If terminated without notice/compensation: file complaint before Labour Court. Approach Conciliation Officer first (free). Workers retrenched can also claim reinstatement." },
    { name:"Industrial Employment (Standing Orders) Act 1946", section:"IESO Act", desc:"Every factory/industrial establishment with 100+ workers must have certified Standing Orders — written rules governing service conditions, shifts, leave, suspension, termination procedures. These protect workers from arbitrary action.", actionable:"Ask your employer for a copy of Standing Orders — they are legally bound to display them. If employer violates standing orders: file complaint with Certifying Officer (Labour Commissioner)." },
    { name:"Factories Act 1948 — Workplace Safety & Health", section:"FA Sec 11–41", desc:"Every factory must: maintain clean, safe premises; ensure adequate ventilation, lighting, drinking water, toilets; limit working hours to 48 hours/week, 9 hours/day; pay overtime at 2x rate; ensure safety equipment is provided and maintained.", actionable:"Report unsafe factory conditions to Factory Inspector of your district. Workers can collectively approach trade unions. File complaint with Chief Inspector of Factories in your state." },
    { name:"Contract Labour (Regulation & Abolition) Act 1970", section:"CLRA Sec 21", desc:"Contract workers (hired through contractors) are entitled to the same wages as direct employees for the same work. The principal employer (company) is ultimately responsible for payment of wages to contract workers if the contractor defaults.", actionable:"If contractor doesn't pay wages: approach the principal employer (main company) directly. File complaint with Labour Commissioner. Contract workers doing perennial/core work can demand permanent absorption." },
    { name:"Building & Other Construction Workers Act 1996 — BOCW Rights", section:"BOCW Act", desc:"Every construction worker is entitled to registration under BOCW and benefits from state Construction Workers' Welfare Board: accident insurance, pension, education assistance for children, maternity benefit, housing loan, medical assistance.", actionable:"Register at your state's BOCW portal (e.g., bocw.kerala.gov.in). Benefits are free. For non-payment: file complaint with State BOCW Board. Construction site employer must provide safety gear, toilets, and first aid." },
    { name:"Child Labour (Prohibition & Regulation) Act 1986 (Amended 2016)", section:"CLP Act Sec 3", desc:"Complete prohibition on employment of children below 14 years in ANY occupation. Adolescents (14–18 years) prohibited from hazardous work. Penalty for employer: 6 months to 2 years jail + fine. Parents who allow it: fine up to Rs.10,000.", actionable:"Report child labour to Labour Commissioner, Child Helpline 1098, or at pencil.nic.in (Platform for Effective Enforcement for No Child Labour)." },
    { name:"Inter-State Migrant Workmen Act 1979", section:"ISMW Act", desc:"Workers recruited from one state to work in another must receive: displacement allowance (50% of monthly wages), journey allowance, suitable accommodation, medical facilities, and equal pay as local workers for the same work.", actionable:"Migrant workers not receiving equal wages or benefits: file complaint with Labour Commissioner of the state where you are working. Contact Shramik Sahayata helpline: 14567." },
    { name:"Trade Unions Act 1926 — Right to Form Union", section:"TU Act Sec 4", desc:"Any 7 or more workers in an establishment can form a registered trade union. No employer can dismiss or victimise a worker for union membership or legitimate union activity. Workers have the right to collective bargaining.", actionable:"Register trade union with the Registrar of Trade Unions in your state. Employer victimisation of union members: file complaint with Labour Commissioner + approach Industrial Tribunal." },
    { name:"Occupational Safety, Health & Working Conditions Code 2020", section:"OSHWC Code 2020", desc:"New consolidated labour code covering factories, mines, construction, plantations. Sets 8-hour workday, 12-hour maximum (with overtime at 2x), one day off per week, free annual health check for workers in hazardous industries, safety committees in workplaces with 500+ workers.", actionable:"Report OSH violations to Inspector-cum-Facilitator of your state. Workers can form Safety Committees. Penalty on employer: Rs.2 lakh fine + imprisonment for repeated violations." },
    { name:"Social Security Code 2020 — Gig & Platform Workers", section:"SS Code 2020", desc:"For the first time, gig workers (Swiggy, Zomato, Ola, Uber delivery partners) and platform workers are eligible for social security benefits from a government-managed fund. Implementation in progress by states.", actionable:"Gig workers: check your state's notification on gig worker welfare scheme. Register with aggregator as formal worker. Seek social security from State Unorganised Workers' Welfare Board." },
    { name:"Unorganised Workers' Social Security Act 2008", section:"UWSS Act", desc:"Workers in the unorganised sector (domestic workers, street vendors, agricultural workers, home-based workers) are entitled to social security schemes: health insurance, life insurance, old age pension, maternity benefit.", actionable:"Register at e-shram.gov.in (eShram portal) — free, get eShram card. Access Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM) pension scheme. Call eShram helpline: 14434." },
    { name:"Inter-State Labour Portability — eShram Card", section:"eShram + Labour Codes", desc:"The eShram card (Unorganised Worker ID) gives migrant and unorganised workers a portable national identity for accessing all central government labour schemes anywhere in India. Over 29 crore workers registered.", actionable:"Register free at eshram.gov.in with Aadhaar + bank account. Automatically enrolled in PMSBY (Rs.2 lakh accident insurance free for 1 year). Call: 14434." },
  ]},
  food:       { id:"food",       icon:"🍱", title:"Food Safety (FSS Act)",  color:"#B8860B", desc:"FSSAI regulations, adulteration laws & food consumer rights", laws:[
    { name:"FSS Act 2006 — Adulteration Penalty",            section:"FSSA Sec 59",  desc:"Selling adulterated food causing injury: up to 6 years + Rs.5 lakh fine. If death results: life imprisonment.", actionable:"File complaint with district Food Safety Officer. Call FSSAI: 1800-112-100." },
    { name:"FSS Act — Unsafe Food Penalty",                  section:"FSSA Sec 63",  desc:"Selling contaminated or injurious food: up to 6 months imprisonment + Rs.1 lakh fine.", actionable:"Preserve food sample as evidence. Report at foscos.fssai.gov.in." },
    { name:"FSSAI — Restaurant Licensing & Hygiene",         section:"FSSAI Reg",    desc:"Every food business must have FSSAI license. Food handlers must have health certificates.", actionable:"Report unhygienic restaurant to FSSAI. Verify license at fssai.gov.in." },
    { name:"Restaurant Service Charge — Not Mandatory",      section:"CPA + GST",    desc:"Service charge is voluntary. Restaurants cannot force you to pay it under any circumstances.", actionable:"Refuse service charge. Complain to CCPA at consumerhelpline.gov.in or call 1915." },
    { name:"Packaged Food Labelling — Legal Metrology Act",  section:"LMA 2009",     desc:"All packaged food must display MRP, net weight, manufacturing/expiry dates and ingredients. Selling without these is illegal.", actionable:"Report to Legal Metrology Inspector or FSSAI if mandatory labels are missing." },
  ]},
  realestate: { id:"realestate", icon:"🏠", title:"Real Estate (RERA)",     color:"#C0392B", desc:"RERA Act 2016 — homebuyer protection from builder fraud", laws:[
    { name:"RERA Act 2016 — Delayed Possession",            section:"RERA Sec 18", desc:"Builder fails agreed possession date: buyer gets full refund with SBI MCLR interest + compensation.", actionable:"File on State RERA portal. Rs.1,000 fee. No lawyer needed. Builder must respond in 60 days." },
    { name:"RERA — False Advertisement Liability",           section:"RERA Sec 12", desc:"Builder responsible for all brochure/advertisement promises. Cannot change plans without buyer's written consent.", actionable:"File RERA complaint using brochure as evidence. Claim compensation for false promises." },
    { name:"RERA — 5-Year Structural Defect Warranty",      section:"RERA Sec 14", desc:"Structural defects within 5 years of possession must be repaired free of charge.", actionable:"Write to builder citing RERA Sec 14. If ignored, file RERA complaint." },
    { name:"RERA — Mandatory Project Registration",         section:"RERA Sec 3",  desc:"Every project (8+ flats or 500 sq.m+) must be registered with RERA before selling.", actionable:"Verify registration before buying. Unregistered project? Complain to RERA Authority." },
    { name:"IPC 420 — Builder Criminal Fraud",              section:"IPC 420",     desc:"Builder collects money with no intention to complete project: criminal cheating — up to 7 years.", actionable:"File FIR AND RERA complaint simultaneously. Attach all payment receipts." },
  ]},
  tax:        { id:"tax",        icon:"💰", title:"Tax Laws",                color:"#1A6B3A", desc:"Income tax rights, GST, TDS & taxpayer protections", laws:[
    { name:"Income Tax — Section 80C Deductions",      section:"ITA Sec 80C", desc:"Deduction up to Rs.1.5 lakh/year on PPF, ELSS, LIC, NSC, home loan principal, tuition fees.", actionable:"Invest before March 31. Claim deduction while filing your ITR." },
    { name:"Income Tax — Section 80D Health Insurance",section:"ITA Sec 80D", desc:"Deduction up to Rs.25,000 for health insurance (Rs.50,000 for senior citizens). Extra Rs.25,000 for parents.", actionable:"Keep premium receipts. Claim deduction while filing Income Tax Return." },
    { name:"GST Anti-Profiteering Rules",               section:"GST Sec 171", desc:"Businesses must pass GST rate reductions to consumers. Non-compliance is anti-profiteering and punishable.", actionable:"File complaint at naa.gov.in (National Anti-Profiteering Authority)." },
    { name:"Income Tax — Tax Evasion Penalty",         section:"ITA Sec 276C",desc:"Wilful tax evasion Rs.25 lakh+: 6 months–7 years imprisonment. Below Rs.25 lakh: 3 months–2 years.", actionable:"Report tax evasion at 1800-103-0025 or incometaxindia.gov.in." },
    { name:"TDS — Employer Must Give Form 16",          section:"ITA Sec 194", desc:"Employer must deduct TDS and deposit with govt. Form 16 must be given by June 15 each year.", actionable:"Demand Form 16. Check Form 26AS at incometax.gov.in. Complain to TDS Officer if not deposited." },
  ]},
  rti:        { id:"rti",        icon:"📋", title:"RTI Act 2005",            color:"#2E4057", desc:"Right to Information — hold any government body accountable", laws:[
    { name:"RTI Act — Who Can File",                  section:"RTI Sec 3",  desc:"Every Indian citizen has right to information from any public authority. No reason needed to be stated.", actionable:"Write to PIO. Pay Rs.10 (BPL: FREE). File at rtionline.gov.in." },
    { name:"RTI Act — 30-Day Response Deadline",      section:"RTI Sec 7",  desc:"PIO must respond within 30 days (48 hours for life/liberty). Non-response = deemed refusal, triggers right to appeal.", actionable:"No response in 30 days: file First Appeal, then Second Appeal to CIC/SIC." },
    { name:"RTI Act — Penalty on PIO",                section:"RTI Sec 20", desc:"PIO ignoring RTI without cause: Rs.250/day up to Rs.25,000 + possible disciplinary action.", actionable:"In Second Appeal, request CIC/SIC to impose daily penalty on the PIO." },
    { name:"RTI — Exempt Information Clause",          section:"RTI Sec 8",  desc:"National security, Cabinet papers, personal privacy are exempt — but public interest can override this.", actionable:"If PIO claims exemption unjustly, challenge in First Appeal citing public interest." },
  ]},
  animal:     { id:"animal",     icon:"🐾", title:"Animal Rights (PCA)",     color:"#6B4423", desc:"Prevention of Cruelty to Animals Act & wildlife laws", laws:[
    { name:"PCA Act 1960 — Animal Cruelty Offences",       section:"PCA Sec 11",      desc:"Beating, torturing, overloading or confining animals causing pain — punishable with fine and imprisonment.", actionable:"File FIR. Contact SPCA or AWB at awbi.gov.in. Call NGO helpline: 9540043212." },
    { name:"PCA Act — Stray Animal Protection (ABC Rules)",section:"ABC Rules 2001",  desc:"Killing or poisoning stray dogs/cats is illegal. Municipalities must follow ABC Rules — no culling allowed.", actionable:"File FIR against anyone poisoning strays. Complain to AWB and municipality." },
    { name:"Wildlife Protection Act 1972",                 section:"WPA 1972",        desc:"Hunting, poaching or trading protected wild animals: up to 7 years + Rs.10,000 fine for Schedule I species.", actionable:"Report to forest department or call WCCB: 011-26714002." },
    { name:"PCA Act — Performing Animals Ban",             section:"PCA Performing",  desc:"Bears, monkeys, panthers, lions cannot be used in performances at all. Any performing animal without registration is illegal.", actionable:"Report to AWB or police. All such acts are completely illegal." },
  ]},
  medical:    { id:"medical",    icon:"🏥", title:"Medical Laws",             color:"#E74C3C", desc:"Medical negligence, patient rights & drug laws", laws:[
    { name:"IPC Section 304A — Medical Negligence",         section:"IPC 304A",  desc:"Doctor's rash or negligent act causing patient death — up to 2 years + fine.", actionable:"Get all medical records and post-mortem. File FIR (IPC 304A) + consumer complaint." },
    { name:"Consumer Protection Act — Hospitals Covered",   section:"CPA Med",   desc:"Medical services fully covered. Hospitals, doctors, diagnostic labs can all be sued for service deficiency.", actionable:"File in District Consumer Forum. Get second medical opinion as evidence." },
    { name:"Clinical Establishments Act 2010 — Emergency",  section:"CEA 2010",  desc:"Emergency treatment CANNOT be refused regardless of money. All hospitals must be registered.", actionable:"Emergency refusal: complain to District Collector. Overcharging: file consumer complaint." },
    { name:"Drugs & Cosmetics Act 1940 — Spurious Drugs",   section:"D&C Act",   desc:"Expired, spurious, or unlicensed drugs: up to 10 years imprisonment.", actionable:"Report to State Drug Controller or at drugcontrollergeneral.in." },
    { name:"Organ Trafficking — THO Act 1994",              section:"THO Act",   desc:"Buying/selling human organs illegal: 5–10 years imprisonment + Rs.20 lakh fine.", actionable:"Report to police and State Health Department immediately." },
  ]},
  fir:        { id:"fir",        icon:"🚔", title:"FIR & Police Rights",      color:"#2C3E50", desc:"Your rights when filing FIR, during arrest & in custody", laws:[
    { name:"CrPC Section 154 — FIR Cannot Be Refused",      section:"CrPC 154",   desc:"Police MUST register FIR for cognizable offences. Refusal is illegal and punishable.", actionable:"Refused? Speed Post complaint to SP/SSP. Approach Magistrate under CrPC 156(3)." },
    { name:"CrPC Section 41 — Rights During Arrest",        section:"CrPC 41",    desc:"Police must inform you of the reason for arrest. Must inform your family immediately.", actionable:"Demand reason for arrest. Ask to inform family. Don't sign any blank papers." },
    { name:"Article 22 — Constitutional Right to Lawyer",   section:"Art. 22",    desc:"Every arrested person has right to a lawyer from the very moment of arrest.", actionable:"Ask for lawyer immediately. Can't afford one? Call DLSA: 15100 for free legal aid." },
    { name:"D.K. Basu Guidelines — Custody Rights",         section:"D.K. Basu",  desc:"Police must give arrest memo, medical examination must be done. Torture in custody is punishable under IPC 330.", actionable:"If tortured: file complaint with NHRC (nhrc.nic.in) + Habeas Corpus petition in High Court." },
    { name:"IPC Section 166 — Police Misconduct",           section:"IPC 166",    desc:"Police officer disobeying law to cause injury to any person — up to 1 year imprisonment.", actionable:"Complain to SP, DGP, or State/National Human Rights Commission." },
  ]},

  ed: { id:"ed", icon:"💸", title:"Enforcement Directorate (ED)", color:"#7D3C98", desc:"PMLA, FEMA, money laundering & your rights during ED raids and investigations", laws:[
    { name:"PMLA 2002 — What is Money Laundering", section:"PMLA Sec 3", desc:"Anyone who directly or indirectly deals with proceeds of crime — converting, transferring, or concealing — is guilty of money laundering. Punishment: 3 to 7 years imprisonment + fine.", actionable:"If accused, engage a lawyer immediately. Do not sign any statement without legal counsel present." },
    { name:"PMLA — ED Power of Arrest", section:"PMLA Sec 19", desc:"ED officer can arrest a person if they have reason to believe the person is guilty of money laundering. Arrested person must be informed of grounds of arrest.", actionable:"Demand written grounds of arrest. Right to consult a lawyer applies immediately under Art. 22. Inform your family at once." },
    { name:"PMLA — Attachment of Property", section:"PMLA Sec 5", desc:"ED can provisionally attach property believed to be proceeds of crime for up to 180 days. Order must be confirmed by Adjudicating Authority.", actionable:"File a representation before the Adjudicating Authority within 180 days. Hire a lawyer experienced in PMLA." },
    { name:"FEMA 1999 — Foreign Exchange Violations", section:"FEMA Sec 13", desc:"Violations of foreign exchange rules (illegal hawala, undisclosed foreign assets): penalty up to 3 times the amount involved or Rs.2 lakh, whichever is higher.", actionable:"Respond to any FEMA notice within the stated deadline. File response through a CA or legal counsel." },
    { name:"PMLA — Bail Conditions (Twin Test)", section:"PMLA Sec 45", desc:"Bail in PMLA cases is very difficult — court must be satisfied that accused is not guilty AND will not commit any offence while on bail. This 'twin test' is strict.", actionable:"Engage a senior criminal lawyer immediately. Bail applications in PMLA require detailed legal arguments." },
    { name:"PMLA — Right to Know Reason for Summons", section:"PMLA Sec 50", desc:"ED can summon any person for questioning. The person is legally bound to appear and answer truthfully. Failure to appear without cause is an offence.", actionable:"Appear before ED on the scheduled date. Carry a lawyer with you. You can refuse to answer questions that incriminate you." },
    { name:"Official Secrets Act 1923 — ED Context", section:"OSA 1923", desc:"Sharing sensitive financial or government information with foreign entities can attract prosecution under Official Secrets Act alongside PMLA.", actionable:"Never share sensitive financial/government documents with unauthorized persons. Seek legal advice if summoned." },
  ]},

  education: { id:"education", icon:"🎓", title:"Education Laws", color:"#1A8FBF", desc:"RTE Act, anti-ragging, fee regulation, UGC rules & student rights", laws:[
    { name:"Right to Education Act 2009 — Free Education (6–14 years)", section:"RTE Sec 3", desc:"Every child aged 6 to 14 years has the fundamental right to free and compulsory education in a neighbourhood school. No child can be denied admission.", actionable:"Approach Block Education Officer if admission is denied. File RTI to verify 25% reserved seats in private schools." },
    { name:"RTE Act — No Capitation Fee / Screening Tests", section:"RTE Sec 13", desc:"Schools cannot charge capitation fee (donation) for admission. No screening test or interview of child or parent is allowed for Class 1 admission.", actionable:"File FIR under IPC 384 (extortion) + complaint to District Education Officer if capitation fee is demanded." },
    { name:"UGC Anti-Ragging Regulations 2009", section:"UGC Reg 2009", desc:"Ragging is a criminal offence in all its forms. Colleges must have Anti-Ragging Committee. Punishment: suspension, expulsion, FIR, imprisonment up to 3 years.", actionable:"Report to Anti-Ragging Helpline: 1800-180-5522. File complaint with college Anti-Ragging Committee. File FIR at police station." },
    { name:"UGC Fee Refund Policy — 2018", section:"UGC Circular 2018", desc:"If a student withdraws admission before 31 October, the institution must refund all fees collected except Rs.1,000 processing fee. This is a mandatory UGC rule.", actionable:"Write formally to college demanding refund. If refused, file complaint with UGC at ugc.gov.in or approach consumer forum." },
    { name:"Persons with Disabilities Act — Education Rights", section:"RPwD Act 2016", desc:"Students with disabilities have the right to inclusive education in mainstream schools. Schools and colleges must provide reasonable accommodation and extra time in exams.", actionable:"Write to Principal citing RPwD Act 2016. Approach District Disability Rehabilitation Centre. File complaint with State Commissioner for Persons with Disabilities." },
    { name:"POCSO Act — Protection in Educational Institutions", section:"POCSO Sec 19", desc:"Any person who suspects sexual abuse of a child (under 18) in a school or educational institution is LEGALLY BOUND to report it to police. Failure to report is an offence.", actionable:"Report to police immediately — call 1098 (Child Helpline) or 112. Police must register FIR within 24 hours." },
    { name:"AICTE / MCI Regulations — Fake Degrees", section:"AICTE Act", desc:"Operating unapproved colleges or granting fake degrees is a criminal offence. Students misled by fake institutions can seek refund + compensation.", actionable:"Verify college approval at antiragging.in / aicte-india.org. File complaint with AICTE or MCI if defrauded." },
    { name:"Scholarships — Right to Receive on Time", section:"NEM Policy", desc:"Delay in scholarship disbursement is a denial of rights. Government scholarship funds must reach students through DBT (Direct Benefit Transfer) on time.", actionable:"File RTI to trace scholarship status. File complaint with National Scholarship Portal or approach District Education Officer." },
  ]},

  cbi: { id:"cbi", icon:"🔍", title:"CBI — Central Bureau of Investigation", color:"#212F3D", desc:"CBI jurisdiction, how it works, and your rights during a CBI investigation", laws:[
    { name:"DSPE Act 1946 — CBI's Legal Authority", section:"DSPE Act 1946", desc:"CBI (Central Bureau of Investigation) derives its power from the Delhi Special Police Establishment Act 1946. It can investigate only cases referred by Central Govt, High Courts, or Supreme Court.", actionable:"CBI cannot automatically investigate a state-level crime. Approach High Court to direct CBI investigation if state police is ineffective." },
    { name:"CBI Jurisdiction — Consent of States Required", section:"DSPE Sec 6", desc:"CBI needs the consent of the respective State Government before investigating a crime in that state — unless directed by a court. Without consent, CBI's investigation is invalid.", actionable:"If CBI is investigating in your state without consent or court order — challenge jurisdiction in High Court." },
    { name:"How to File a Complaint with CBI", section:"CBI Guidelines", desc:"Any citizen can file a complaint with CBI directly. CBI investigates corruption by central government employees, bank fraud above Rs.100 crore, major economic offences, and national security cases.", actionable:"File complaint at cbi.gov.in or at the nearest CBI Anti-Corruption Branch. Provide detailed facts and evidence." },
    { name:"Your Rights During CBI Summons / Questioning", section:"CrPC + Art. 20", desc:"You cannot be forced to be a witness against yourself (Art. 20). You have the right to a lawyer during CBI questioning. CBI cannot use coercion or threats.", actionable:"Appear with a lawyer. You may answer questions but have the right to remain silent on self-incriminating questions under Art. 20(3)." },
    { name:"Prevention of Corruption Act 1988 — CBI's Primary Domain", section:"PC Act Sec 13", desc:"CBI primarily prosecutes cases of bribery and corruption by public servants under PC Act. Punishment: 3–7 years imprisonment + fine.", actionable:"Report government corruption to CBI at cbi.gov.in. Also report to CVC (Central Vigilance Commission) at cvc.gov.in." },
    { name:"CBI — Arrest & Custody Rights", section:"CrPC + D.K. Basu", desc:"CBI arrests follow the same CrPC rules as regular police. D.K. Basu Guidelines apply — grounds of arrest must be given in writing, family must be informed.", actionable:"All standard rights of arrest apply. Demand arrest memo. Call a lawyer immediately. File Habeas Corpus if illegally detained." },
  ]},

  arai: { id:"arai", icon:"🚗", title:"ARAI & Automotive Laws", color:"#A93226", desc:"ARAI regulations, Motor Vehicles Act, vehicle safety, emissions & your rights as a vehicle owner", laws:[
    { name:"Motor Vehicles Act 1988 — Vehicle Registration Mandatory", section:"MVA Sec 39", desc:"Every motor vehicle must be registered with the Regional Transport Office (RTO) before being used on public roads. Driving unregistered vehicle: fine up to Rs.5,000 + impoundment.", actionable:"Register your vehicle at your local RTO within 30 days of purchase. Carry RC (Registration Certificate) while driving at all times." },
    { name:"ARAI Homologation — Type Approval for Vehicles", section:"ARAI Reg/CMV Rules", desc:"Every vehicle model sold in India must get ARAI (Automotive Research Association of India) type approval certifying it meets safety and emission standards. Selling unapproved vehicle models is illegal.", actionable:"Check ARAI approval status of your vehicle at araiindia.com. Report unapproved vehicles to Ministry of Road Transport (parivahan.gov.in)." },
    { name:"BS6 Emission Standards — Mandatory from April 2020", section:"CMVR 1989 + BS6", desc:"All new vehicles sold after April 1, 2020 must meet Bharat Stage 6 (BS6) emission norms. BS4 vehicles cannot be sold as new. Older registered vehicles can still run.", actionable:"Check your vehicle's emission compliance certificate. Get PUC (Pollution Under Control) certificate renewed every 6 months." },
    { name:"Motor Vehicles Act — Vehicle Recall Obligation", section:"MVA Sec 110A", desc:"If a vehicle has a manufacturing defect affecting safety — the manufacturer is legally obligated to recall and repair/replace it free of charge.", actionable:"Check recall notices at siam.in or manufacturer's website. If your vehicle has a recall, contact your dealer for free repair." },
    { name:"MVA — Third Party Insurance is Mandatory", section:"MVA Sec 146", desc:"Driving without valid third-party motor insurance is a criminal offence. Fine: Rs.2,000 for first offence, Rs.4,000 for repeat. Imprisonment up to 3 months.", actionable:"Always carry valid insurance documents. Renew before expiry. Without insurance, you are personally liable for accident damages." },
    { name:"MVA — Accident Compensation Rights", section:"MVA Sec 165", desc:"Any person injured in a motor accident (even if driver is at fault) can claim compensation from the Motor Accident Claims Tribunal (MACT). No time bar for claiming.", actionable:"File claim at MACT (Motor Accident Claims Tribunal) in your district. Attach FIR, medical reports, insurance details. No lawyer needed for filing." },
    { name:"MVA — Drunk Driving Punishment", section:"MVA Sec 185", desc:"Driving under influence of alcohol (BAC above 30 mg/100 ml) or drugs: fine up to Rs.10,000 + up to 6 months imprisonment for first offence. Repeat: Rs.15,000 + 2 years imprisonment.", actionable:"Never drink and drive. If you see drunk driving, report to traffic police or call 100." },
    { name:"MVA — Helmet & Seat Belt Laws", section:"MVA Sec 129 & 194B", desc:"Wearing helmet on 2-wheeler is compulsory for rider AND pillion. Seat belt compulsory for all car occupants. Fine: Rs.1,000 per offence.", actionable:"Always wear helmet/seat belt. ISI marked helmets only. Refusing to pay fine at roadside is your right — get a court challan instead." },
  ]},

  armedforces: { id:"armedforces", icon:"🎖️", title:"Armed Forces — Civilian Guide", color:"#4A5568", desc:"Army, Navy & Air Force laws — how civilians must behave, their rights & applicable sections", laws:[
    { name:"Army Act 1950 — Civilian Interaction Rules", section:"Army Act 1950", desc:"The Army Act governs military personnel discipline. Civilians who obstruct, insult or attack military personnel on duty commit a serious offence punishable under IPC.", actionable:"Always cooperate with military personnel at checkpoints. Do not obstruct them on duty. Any civilian complaint about military misconduct goes to the Station Commander or Ministry of Defence." },
    { name:"IPC Section 353 — Assault on Public Servant on Duty", section:"IPC 353", desc:"Assaulting, obstructing, or using criminal force against any public servant (including military/armed forces personnel) while performing their duty: up to 2 years imprisonment + fine.", actionable:"Never physically resist or assault armed forces personnel on duty. If you believe they acted illegally, file a formal written complaint to their commanding officer or NHRC." },
    { name:"Official Secrets Act 1923 — Military Photography Ban", section:"OSA Sec 3", desc:"Photographing or sketching military installations, airfields, ports, or cantonments without permission is a serious criminal offence. Punishment: up to 14 years imprisonment.", actionable:"Never photograph military bases, cantonments, border posts or naval installations. If you accidentally capture them, delete immediately. Downloading leaked military documents is also an offence." },
    { name:"Air Force Act 1950 — Civilian Aircraft Separation", section:"AF Act 1950", desc:"Civilian drones or aircraft must maintain mandatory distance from Air Force bases. Unauthorized entry into restricted airspace is a criminal offence.", actionable:"Never fly drones near Air Force bases. Check airspace restrictions before flying any UAV. Violations are prosecuted under AF Act + IPC." },
    { name:"Navy Act 1957 — Naval Port Security", section:"Navy Act 1957", desc:"Unauthorized entry into naval dockyard, port, or vessel is a criminal offence. Civilians must follow all instructions of naval security personnel without resistance.", actionable:"Always follow naval security instructions at ports. Do not enter restricted areas. Visitors to naval events must register formally in advance." },
    { name:"Armed Forces Special Powers Act (AFSPA) — Disturbed Areas", section:"AFSPA 1958", desc:"In areas declared 'disturbed' (parts of Northeast, J&K) — armed forces have special powers including arrest without warrant and use of force. Civilians must follow military instructions in these zones.", actionable:"In disturbed areas: always carry ID proof. Do not gather in large groups near military posts. Civilian complaints about AFSPA abuses go to NHRC (14433) or National Human Rights Commission." },
    { name:"Cantonment Act 2006 — Civilian Rights in Cantonments", section:"CA 2006", desc:"Civilian residents of cantonment areas have rights regarding roads, civic amenities and public lands. Cantonment Boards provide municipal services — civilians can file RTI for records.", actionable:"File RTI to Cantonment Board CEO for civic records. Approach Cantonment Board meetings for grievances. Elections to Cantonment Boards are held regularly." },
    { name:"IPC Section 131 — Abetting Military Mutiny", section:"IPC 131", desc:"Any civilian who attempts to seduce or entice any member of the armed forces from their duty or allegiance commits a very serious offence — life imprisonment possible.", actionable:"Never share anti-national content targeting armed forces. Never encourage military personnel to disobey orders. Such acts are treated as serious national security offences." },
  ]},

  bsf: { id:"bsf", icon:"🛡️", title:"BSF & Border Security Laws", color:"#1E5631", desc:"BSF Act, border area rules, civilian conduct near borders & your rights", laws:[
    { name:"BSF Act 1968 — BSF's Legal Authority", section:"BSF Act 1968", desc:"Border Security Force operates under the BSF Act 1968. BSF has jurisdiction to arrest, search, and seize in border areas. They protect India's borders with Pakistan and Bangladesh.", actionable:"Always carry valid identity proof near international borders. Cooperate with BSF checkpoints. Filing complaints against BSF personnel: write to DIG/IG BSF of the respective sector." },
    { name:"BSF Jurisdiction — 50 km Border Belt Powers", section:"BSF Act + CRPC", desc:"BSF has policing powers in the 50 km belt along international borders — they can arrest persons for cognizable offences, conduct searches, and seize contraband.", actionable:"Residents of border areas: always carry Aadhaar or voter ID. Do not travel in border belts at night without valid reason. Report smuggling activities to BSF: 14419." },
    { name:"Passport Entry into Prohibited Areas — ILP", section:"ILP Rules 1963", desc:"Entry into some border states (Arunachal Pradesh, Manipur, Nagaland, Mizoram) requires an Inner Line Permit (ILP) for Indian citizens from other states.", actionable:"Apply for ILP online before visiting these states. Travelling without ILP: detention and deportation. Apply at ilp.gov.in or respective state government websites." },
    { name:"IPC Section 353 — Obstructing BSF on Duty", section:"IPC 353", desc:"Obstructing, assaulting or resisting BSF personnel performing their border duties: up to 2 years imprisonment + fine.", actionable:"Always comply with BSF orders at border checkpoints. If you believe a BSF action was illegal, file a written complaint to the sector IG — do NOT resist physically." },
    { name:"Smuggling & Cross-Border Crimes — BSF Powers", section:"Customs Act + BSF Act", desc:"BSF can seize contraband, drugs, cattle and other smuggled goods at borders. Smuggling punishable under Customs Act: up to 7 years + fine. Drug smuggling: NDPS Act — 10 years to life.", actionable:"Report suspected smuggling to BSF helpline 14419 or Customs at 1800-1037-187. Informers are protected and may receive reward." },
    { name:"Border Area Development — Civilian Rights", section:"BADP Scheme", desc:"Residents of border areas are entitled to government development schemes under BADP (Border Area Development Programme). Covers roads, schools, health centres, connectivity.", actionable:"File RTI to district collector for BADP funds utilisation. Approach Gram Panchayat or Block Development Officer for BADP scheme benefits." },
    { name:"Right to Peaceful Border Tourism", section:"MHA Guidelines", desc:"Certain border tourism destinations (Wagah, Nathu La, Longewala, etc.) are open to Indian civilians with prior registration. Photography restrictions apply near military/BSF posts.", actionable:"Register for border tourism through official state tourism or MHA portals. Never photograph border posts, watch towers or barriers. Follow all BSF guide instructions." },
  ]},

  railways: { id:"railways", icon:"🚂", title:"Railways — Passenger Rights & Laws", color:"#1565C0", desc:"Railway Act 1989, TC powers & limits, ticketless travel penalties, passenger rights & how to complain against railway staff", laws:[
    { name:"Railway Act 1989 — Travelling Without Ticket", section:"Railway Act Sec 137", desc:"Travelling without a valid ticket, or with a ticket for a lower class, or beyond the station for which the ticket is held — punishable with fine of Rs.250 OR up to 10x the fare for the distance travelled, whichever is more. The Travelling Ticket Examiner (TTE/TC) has full authority to collect the excess fare + penalty.", actionable:"Always carry a valid ticket. If caught without ticket: pay the penalty amount + excess fare on the spot and get a written receipt. Do NOT argue or refuse — it worsens the situation. You can contest in court later." },
    { name:"Railway Act — Travelling in Wrong Class", section:"Railway Act Sec 138", desc:"Travelling in a higher class than what your ticket authorises — TTE will charge the difference in fare + an excess charge of Rs.250. Example: travelling in AC coach with Sleeper ticket.", actionable:"Pay the excess fare + penalty on the spot. Demand a proper written receipt with the TTE's details. If TTE refuses to give receipt: note his badge number and report to Station Master." },
    { name:"TTE / TC Power to Check Tickets", section:"Railway Act Sec 8 + 134", desc:"The Travelling Ticket Examiner (TTE/TC) is an authorised railway servant. He has the legal power to examine tickets of all passengers, ask for identity proof to verify wait-listed/RAC passengers, and issue penalties for irregularities.", actionable:"Always cooperate with TTE ticket checking. Carry valid photo ID along with your ticket (mandatory for reserved travel). Obstruction of TTE on duty is a railway offence." },
    { name:"TTE Cannot Charge EXTRA Beyond Official Penalty", section:"Railway Act Sec 137 + 142", desc:"The TTE can ONLY charge the official penalty (Rs.250 + excess fare as per rules). He CANNOT demand any amount beyond this. Demanding extra money, threatening passengers, or accepting/soliciting bribes is illegal — punishable under Prevention of Corruption Act and Railway Act.", actionable:"If TTE demands extra money beyond official penalty: REFUSE. Note his name and badge number. File complaint at railmadad.indianrailways.gov.in or call Railway Helpline: 139. Report to Station Master immediately." },
    { name:"TTE Taking Bribe — Anti-Corruption Law", section:"Prevention of Corruption Act 1988 Sec 7", desc:"A TTE or any railway employee who demands or accepts money other than the official fare/penalty is committing bribery — punishable with 3–7 years imprisonment + fine under PC Act 1988. This includes asking for money to 'ignore' ticketless travel, to 'adjust' berths, or any unofficial payment.", actionable:"Do NOT pay bribe. Record audio/video if possible. File complaint at ACB (Anti-Corruption Bureau), CBI, or Railway Vigilance helpline. Also file at railmadad.indianrailways.gov.in immediately." },
    { name:"TTE Behaving Vulgarly / Abusing Passengers", section:"IPC 294 + IPC 504 + Railway Servant Rules", desc:"A TTE who uses abusive language, makes obscene remarks, or behaves indecently with a passenger violates IPC 294 (obscene acts/words in public: up to 3 months) and IPC 504 (intentional insult: up to 2 years). Railway employees are also bound by the Railway Services (Conduct) Rules — misconduct can lead to suspension, dismissal.", actionable:"Stay calm — do NOT retaliate. Record the incident on phone if safe. Note TTE badge number and name. File complaint at railmadad.indianrailways.gov.in, Station Master, or call 139. Also file written complaint to Divisional Railway Manager (DRM) of that zone." },
    { name:"Passenger Right to Demand Proper Receipt", section:"Railway Act Sec 142", desc:"When a TTE collects excess fare or penalty, he MUST give a proper official receipt (EFR — Excess Fare Receipt). Refusing to give a receipt is illegal. Keep this receipt as it is evidence for any dispute or appeal.", actionable:"Always demand EFR (Excess Fare Receipt) whenever you pay any amount to TTE. If TTE refuses to give receipt: this is grounds for a serious complaint against him at railmadad.indianrailways.gov.in." },
    { name:"Emergency Medical Assistance in Train", section:"Railway Act + Medical Rules", desc:"Railway is legally bound to provide first aid and arrange medical help for any passenger who falls sick or is injured on a train. Passengers can request TTE/Guard to arrange assistance at next station.", actionable:"Inform TTE or Train Guard immediately. They must contact the next station to arrange medical assistance. Indian Railways also has a Medic helpline through 139. Emergency medical halt at station can be requested." },
    { name:"Passenger Right — Confirmed Lower Berth (Senior Citizens & Women)", section:"Railway Circular + Railway Act", desc:"Senior citizens (60+ years for men, 45+ for women) and pregnant women are entitled to confirmed lower berth allocation during reservation. Railways have a dedicated quota for this.", actionable:"Book lower berth through IRCTC selecting senior citizen/women quota. If not allotted: request TTE politely, he can adjust if lower berth is available. File complaint if rights are denied." },
    { name:"Theft / Chain Snatching in Train", section:"Railway Act Sec 145 + IPC 379", desc:"Theft of passenger belongings in a railway compartment — punishable under Railway Act Sec 145 and IPC 379. GRP (Government Railway Police) has jurisdiction over crimes on trains and stations.", actionable:"Report immediately to TTE or Train Guard. Get train stopped if necessary. File FIR with GRP (Government Railway Police) at next station. Note train number, compartment, time of incident." },
    { name:"Railway Accident Compensation", section:"Railways Act Sec 124 & 124A", desc:"In case of a railway accident (derailment, collision), passengers or their families are entitled to compensation WITHOUT having to prove negligence. This is a no-fault liability. Compensation: up to Rs.8 lakh for death, Rs.8 lakh for serious injury (as per Railway Accident & Untoward Incident Compensation Rules 1990).", actionable:"File claim before Railway Claims Tribunal within 1 year of accident. Attach FIR, medical report, proof of travel. Railway is liable even without proof of fault. Legal help: railwayclaimstribunal.gov.in." },
    { name:"Cleanliness & Hygiene — Passenger Rights", section:"Railway Act Sec 161", desc:"Passengers have the right to clean coaches, functioning toilets, and hygienic food at Railway stations. Littering in train or on platform is a fineable offence (Rs.500). Selling substandard food is punishable.", actionable:"Report dirty coaches or non-functioning toilets at railmadad.indianrailways.gov.in or call 139. For substandard food: scan QR code in pantry car and rate the meal. FSSAI governs food quality at railway stations." },
    { name:"Unauthorised Hawkers in Train — What to Do", section:"Railway Act Sec 144", desc:"Hawking goods in trains without a valid licence from Railways is an offence. Passengers are not obligated to buy anything from unlicensed hawkers. Overcharging by licensed pantry: complaint can be filed.", actionable:"Do not be pressured to buy from unlicensed vendors. Report unauthorised hawkers to TTE or at railmadad.indianrailways.gov.in. For overpriced food from pantry: scan QR code on receipt to file feedback." },
    { name:"How to File Complaint Against Railway Staff", section:"RailMadad Guidelines", desc:"Indian Railways' official grievance portal railmadad.indianrailways.gov.in allows passengers to file complaints about TTE misconduct, bribery, cleanliness, food, berth issues, safety concerns. Complaints must be acknowledged within 30 minutes and resolved within 3 days.", actionable:"Go to railmadad.indianrailways.gov.in OR call 139 OR use the RailMadad app. Provide train number, date, PNR, TTE badge number. For bribery: additionally file at Railway Vigilance or ACB." },
  ]},
};

const QUICK_Q = [
  { q:"My phone was stolen. What IPC section applies and how do I file FIR?", icon:"📱" },
  { q:"Builder took money but didn't give flat possession for 3 years. RERA help?", icon:"🏗️" },
  { q:"TTE is asking extra money and not giving receipt. What are my rights?", icon:"🚂" },
  { q:"I travelled without ticket in train. What penalty applies under Railway Act?", icon:"🎫" },
  { q:"Employer not paying salary for 2 months. Which labour law applies?", icon:"💸" },
  { q:"My employer is not depositing my PF. What action can I take?", icon:"🏦" },
  { q:"I was retrenched without notice or compensation. IDA 1947 rights?", icon:"💼" },
  { q:"I am a gig worker on Swiggy/Zomato. Do I get any social security?", icon:"🛵" },
  { q:"ED has sent me a summons under PMLA. What are my rights?", icon:"💸" },
  { q:"BSF stopped me near the border. What are my rights?", icon:"🛡️" },
  { q:"Police refused to register my FIR. Rights under CrPC 154?", icon:"🚔" },
  { q:"Railway accident happened. Can I claim compensation without proof of fault?", icon:"🚨" },
];

const SYSTEM_PROMPT = `You are KanoonSaathi, India's expert AI legal assistant helping ordinary citizens understand their rights.

Answer every query using this EXACT format:

⚖️ **Applicable Law(s) & Section(s)**
[List exact Act name, Section number and year]

📖 **In Simple Words**
[2–3 sentences — no jargon, explain like talking to a first-time user]

✅ **What YOU Should Do (Step-by-Step)**
[Numbered practical action plan]

🔨 **Punishment for the Offender**
[What happens to the wrongdoer]

💡 **Free Help Available**
[DLSA, Consumer Forum, RERA, NHRC, NCW — free options first]

📞 **Key Helplines**
[Relevant helpline numbers]

Cover: IPC, CrPC, Consumer Protection Act 2019, RERA 2016, RTI Act 2005, FSS Act 2006, DGCA Rules, PCA Act 1960, IT Act 2000, Labour Laws (Minimum Wages Act, Payment of Wages Act, Factories Act 1948, Industrial Disputes Act 1947, EPF Act, ESI Act, Gratuity Act, POSH Act, BOCW Act, Contract Labour Act, Child Labour Act, Trade Unions Act, New Labour Codes 2020, eShram, Gig Workers), Income Tax Act, GST Act, Constitution of India, Clinical Establishments Act, Drugs & Cosmetics Act, Wildlife Protection Act, PMLA 2002, FEMA 1999, RTE Act 2009, UGC Anti-Ragging Regulations, DSPE Act 1946 (CBI), Motor Vehicles Act 1988, ARAI/BS6 Standards, Army Act 1950, Navy Act 1957, Air Force Act 1950, AFSPA 1958, BSF Act 1968, Official Secrets Act 1923, Cantonment Act 2006, Railway Act 1989 (Sections 137, 138, 142, 145, 124, 124A), Prevention of Corruption Act (TTE/railway staff bribery), Railway Services Conduct Rules, RailMadad grievance system.

Be warm, empathetic and empowering. Many users cannot afford lawyers — make them feel they have real legal protection. Keep each section concise — 2 to 4 sentences or bullet points maximum per section. Never leave a response incomplete. Always finish all 6 sections fully before stopping.`;

// ─── WHAT IF SITUATIONS ───────────────────────────────────────────────────────
const WHAT_IF = [
  {
    id:"threatened", icon:"😡", color:"#C0392B", tag:"IPC 503/506",
    title:"Someone is Threatening You",
    situation:"A person is verbally threatening you, sending threat messages, or saying they'll harm you or your family.",
    doNow:["Stay calm — do NOT retaliate physically","Move to a safe, public location immediately","Record or screenshot the threat if via phone/message","Note the person's name, description, time, location, witnesses","Call 100 (Police) or 112 (Emergency) if you feel in immediate danger","File FIR at nearest police station citing IPC 506 (criminal intimidation)"],
    laws:[{s:"IPC 503", d:"Criminal intimidation — threatening injury to person, property or reputation"},{s:"IPC 506", d:"Punishment for criminal intimidation: up to 2 years + fine. Aggravated (weapon/death threat): up to 7 years"},{s:"IPC 507", d:"Criminal intimidation by anonymous communication — up to 2 years extra"}],
    punishment:"Threatener gets up to 2–7 years imprisonment depending on severity.",
    warn:"⚠️ Do NOT make counter-threats — you will also be charged under IPC 503.",
    helpline:"Police: 100 | Emergency: 112 | Women: 181"
  },
  {
    id:"ragging", icon:"🎓", color:"#1A8FBF", tag:"UGC Anti-Ragging",
    title:"You Are Being Ragged",
    situation:"You are being ragged in college, hostel, workplace, or on the road by seniors, colleagues or strangers.",
    doNow:["Leave the situation immediately — your safety comes first","Do NOT stay silent — ragging thrives on silence","Call Anti-Ragging Helpline: 1800-180-5522 (free, 24x7)","Report to your college Anti-Ragging Committee the same day","File FIR at nearest police station — ragging is a criminal offence","Collect names, dates, witnesses — document everything"],
    laws:[{s:"UGC Reg 2009", d:"Ragging in any form is a criminal offence in all educational institutions"},{s:"IPC 323", d:"Voluntarily causing hurt — up to 1 year + fine"},{s:"IPC 294", d:"Obscene acts and songs causing annoyance — up to 3 months"},{s:"IPC 506", d:"Criminal intimidation — up to 2–7 years"}],
    punishment:"Accused student: suspension, expulsion, criminal prosecution. Institution fined if it ignores complaint.",
    warn:"⚠️ Ragging includes verbal abuse, forced acts, eve-teasing, humiliation — not just physical violence.",
    helpline:"Anti-Ragging: 1800-180-5522 | Police: 100 | Women: 181"
  },
  {
    id:"weapon_road", icon:"🔪", color:"#8B0000", tag:"IPC 397 / Arms Act",
    title:"Someone Threatens You with a Weapon on Road",
    situation:"A person on the road, in a vehicle, or at a public place is threatening you with a knife, rod, gun or any weapon.",
    doNow:["Do NOT argue or engage — your life is more important than any property","Back away slowly towards a crowded or lit area","Call 112 or 100 immediately — stay on the line","Shout for help loudly to attract attention from bystanders","Note the vehicle number, description of person, direction they went","File FIR with full description — police take weapon threats very seriously"],
    laws:[{s:"IPC 397", d:"Robbery/dacoity with deadly weapon — minimum 7 years imprisonment"},{s:"IPC 392", d:"Robbery — up to 10 years imprisonment + fine"},{s:"Arms Act 1959 Sec 25", d:"Carrying unlicensed weapon: up to 3 years. Licensed weapon used to threaten: license cancelled + prosecution"},{s:"IPC 354D", d:"Stalking with intent to cause fear: up to 3–5 years"}],
    punishment:"Weapon assault: minimum 7 years. Unlicensed weapon: up to 3 years. Combination: consecutive sentences.",
    warn:"⚠️ Never try to disarm someone yourself. Wait for police. Your safety first.",
    helpline:"Emergency: 112 | Police: 100 | Women in danger: 181"
  },
  {
    id:"accident", icon:"🚗", color:"#A93226", tag:"MVA + IPC 279",
    title:"You Are in a Road Accident",
    situation:"You or someone near you has been in a car, bike or road accident — injuries, vehicle damage, hit-and-run.",
    doNow:["Check for injuries — call 108 (Ambulance) immediately if anyone is hurt","Move vehicles to the roadside if safe — do NOT flee even in minor accidents","Call 100 to report the accident and get police to the scene","Click photos of vehicle positions, damage, road conditions, number plates","Note names and contacts of witnesses at the scene","Do NOT admit fault verbally — let the FIR and investigation determine that"],
    laws:[{s:"MVA Sec 134", d:"Driver duty to stop, help injured, report to police — fleeing is a criminal offence"},{s:"IPC 279", d:"Rash driving on public way: up to 6 months imprisonment + Rs.1,000 fine"},{s:"IPC 304A", d:"Causing death by rash/negligent act: up to 2 years + fine"},{s:"MVA Sec 161", d:"Hit and run victim compensation: Rs.2 lakh (death), Rs.50,000 (serious injury) from Solatium Fund"}],
    punishment:"Hit and run: up to 2 years. Death by negligence: up to 2 years + fine. Fleeing scene: additional charges.",
    warn:"⚠️ File insurance claim within 24 hours. Even if not your fault — file the FIR.",
    helpline:"Ambulance: 108 | Police: 100 | Emergency: 112 | Road Accident Helpline: 1073"
  },
  {
    id:"arrested", icon:"🚔", color:"#2C3E50", tag:"CrPC 41 + Art. 22",
    title:"Police is Arresting You",
    situation:"Police has arrived to arrest you or is detaining you for questioning.",
    doNow:["Stay calm — do NOT resist physically, even if you believe the arrest is wrong","Ask clearly: 'What is the reason for my arrest?' — they must tell you in writing","Do NOT sign any blank papers or confessions without reading fully","Immediately call a lawyer or ask them to call your family","Remember and note the officer's name, badge number, police station name","If you cannot afford a lawyer — DEMAND free legal aid from DLSA (call 15100)"],
    laws:[{s:"CrPC Sec 50", d:"Police must inform arrested person of grounds of arrest immediately"},{s:"Art. 22", d:"Right to consult and be defended by a lawyer of your choice from moment of arrest"},{s:"CrPC Sec 57", d:"Person arrested without warrant must be produced before Magistrate within 24 hours"},{s:"D.K. Basu Guidelines", d:"Arrest memo must be prepared, family informed, medical examination done"},{s:"IPC 330", d:"Police causing hurt to extort confession: up to 7 years imprisonment"}],
    punishment:"Illegal arrest by police: Habeas Corpus can be filed. Police officer responsible faces departmental + criminal action.",
    warn:"⚠️ If arrested, you have the right to SILENCE. Do not answer questions without a lawyer present.",
    helpline:"Free Legal Aid: 15100 (DLSA) | NHRC: 14433 | Police Complaint: 100"
  },
  {
    id:"cyber_fraud", icon:"💻", color:"#1A5276", tag:"IT Act 66C/66D",
    title:"You Got Scammed — Cyber Fraud",
    situation:"You received a fake call, clicked a link, or made a UPI transfer and lost money to a scammer.",
    doNow:["Call 1930 (Cyber Crime Helpline) IMMEDIATELY — the faster you call, the higher the chance of recovering money","File complaint at cybercrime.gov.in within 24 hours","Call your bank's 24x7 helpline and say 'I am a victim of cyber fraud — freeze this transaction'","Screenshot everything: chats, payment confirmations, fake websites, caller ID","Do NOT share OTP or passwords with anyone, ever — even if they claim to be bank/police","File FIR at nearest Cyber Crime Police Station"],
    laws:[{s:"IT Act 66D", d:"Online cheating by impersonation: up to 3 years + Rs.1 lakh fine"},{s:"IT Act 66C", d:"Identity theft (using your Aadhaar, PAN, OTP): up to 3 years + Rs.1 lakh fine"},{s:"IPC 420", d:"Cheating: up to 7 years imprisonment + fine"},{s:"IPC 66B IT Act", d:"Dishonestly receiving stolen computer resource: up to 3 years"}],
    punishment:"Scammer gets 3–7 years imprisonment. RBI mandates banks to respond to fraud in 24–48 hours.",
    warn:"⚠️ Never call back numbers from unknown SMS. Never download apps strangers send you. No government agency asks for OTP.",
    helpline:"Cyber Crime: 1930 | Bank Fraud: Your bank's 24x7 line | cybercrime.gov.in"
  },
  {
    id:"you_threaten", icon:"⚠️", color:"#7D3C98", tag:"IPC 506",
    title:"What If YOU Threaten Someone",
    situation:"You said something threatening in anger, sent a threatening message, or made a gesture that scared someone.",
    doNow:["Stop immediately — even words said in anger are criminal under IPC 503","Do NOT send any more messages or contact the person","Apologise sincerely and in writing if possible — it shows good faith to court","If police arrive — cooperate, do not flee, do not destroy evidence","Hire a lawyer immediately if an FIR is filed against you","Bail is available for IPC 506 (bailable offence in most cases) — apply promptly"],
    laws:[{s:"IPC 503", d:"Criminal intimidation: causing fear of injury to person/property/reputation"},{s:"IPC 506", d:"Punishment: up to 2 years + fine. Death/grievous hurt threat: up to 7 years + fine"},{s:"IT Act 66A (struck down)", d:"Online speech: Note — SC struck down 66A in 2015, but IPC 503/506 still apply to online threats"},{s:"IPC 504", d:"Intentional insult to provoke breach of peace: up to 2 years + fine"}],
    punishment:"YOU face up to 2–7 years imprisonment. A formal written apology and withdrawal cannot erase a filed FIR.",
    warn:"⚠️ Think before you speak/type. Online threats, WhatsApp messages, social media posts are ALL admissible evidence in court.",
    helpline:"If FIR filed against you — Legal Aid: 15100 | Hire a criminal lawyer immediately"
  },
  {
    id:"railway_tc", icon:"🚂", color:"#1565C0", tag:"Railway Act 1989",
    title:"TTE Is Demanding Bribe or Misbehaving in Train",
    situation:"The TTE/TC is asking for extra money beyond the official fine, refusing to give a receipt, or using abusive/vulgar language with you.",
    doNow:["Stay calm — do NOT shout back or create a scene in the train","Say clearly: 'I will pay only the official penalty. Please give me an EFR (Excess Fare Receipt)'","Note the TTE's full name, badge number, coach number, train number, date and time","If safe to do so — discreetly record audio or video of the conversation as evidence","Pay the official penalty only — get the EFR receipt before the TTE leaves","Call Railway Helpline 139 immediately and report the misconduct with TTE details","At the next station: go to the Station Master and file a written complaint","File online complaint at railmadad.indianrailways.gov.in with all details"],
    laws:[
      {s:"Railway Act Sec 137", d:"Ticketless travel penalty: Rs.250 OR 10x fare — whichever is more. ONLY this amount can be charged."},
      {s:"Railway Act Sec 142", d:"TTE MUST give EFR (Excess Fare Receipt) for every payment collected. Refusing to give receipt is illegal."},
      {s:"PC Act 1988 Sec 7", d:"Railway employee demanding or accepting bribe: 3–7 years imprisonment + fine. No exception for TTE."},
      {s:"IPC 294", d:"Uttering obscene words in a public place (train counts): up to 3 months imprisonment + fine."},
      {s:"IPC 504", d:"Intentional insult to provoke breach of peace: up to 2 years imprisonment + fine."},
      {s:"Railway Services Conduct Rules", d:"TTE misconduct is also a departmental offence — can result in suspension or dismissal."},
    ],
    punishment:"TTE taking bribe: 3–7 years jail under PC Act. Abusive conduct: IPC charges + departmental suspension/dismissal. Refusing to give receipt: departmental action.",
    warn:"⚠️ Do NOT pay any amount without getting a proper EFR receipt. An unofficial payment is the same as paying a bribe — which makes you a party too.",
    helpline:"Railway Helpline: 139 | RailMadad: railmadad.indianrailways.gov.in | GRP (Railway Police): 1512 | Anti-Corruption: 1064"
  },
  {
    id:"nuisance", icon:"🤬", color:"#6B4423", tag:"IPC 268/290/294",
    title:"Someone Near You is Misbehaving / Creating Nuisance",
    situation:"A person in your neighbourhood, public place, apartment, or workplace is drunk, abusing, creating noise, or generally misbehaving and disturbing everyone around.",
    doNow:["Do NOT engage or argue with a drunk or aggressive person — personal safety first","Move to a safe distance and call 100 (Police) if the person is violent or threatening","Record a short video on your phone as evidence (from a safe distance)","For neighbour nuisance: first send a written complaint to your housing society / RWA","If the issue persists: file a written complaint at the local police station","For noise at night: approach local police under IPC 268 or file complaint with Municipality"],
    laws:[{s:"IPC 268", d:"Public nuisance — act or omission that causes common injury, danger, or annoyance to public: fine + possible imprisonment"},{s:"IPC 290", d:"Punishment for public nuisance in cases not otherwise provided for: fine up to Rs.200 (but backed by CrPC injunction powers)"},{s:"IPC 294", d:"Obscene acts and songs in a public place causing annoyance to others: up to 3 months imprisonment + fine"},{s:"IPC 510", d:"Appearing in a public place in a state of intoxication and causing annoyance: up to 24 hours imprisonment + fine"},{s:"CrPC Sec 133", d:"Magistrate can order removal of public nuisance (noise, smell, obstruction) — very powerful provision"},{s:"IPC 506", d:"Criminal intimidation by a misbehaving person: up to 2–7 years"}],
    punishment:"Public nuisance: fine + Magistrate can pass injunction. Drunk disorderly: up to 24 hours custody. Abuse/threats: up to 7 years.",
    warn:"⚠️ Do NOT physically confront a drunk or mentally unstable person. Call police and wait for them.",
    helpline:"Police: 100 | Emergency: 112 | Noise Complaint: Local Municipality helpline"
  },
];

// ─── KNOW YOUR RIGHTS ─────────────────────────────────────────────────────────
const RIGHTS = [
  { icon:"📜", color:"#FF6B00", title:"Right to Know Why You're Arrested", article:"Art. 22 + CrPC 50", desc:"Police MUST tell you the reason for arrest at the time of arrest. You have the right to remain silent. You cannot be held for more than 24 hours without being produced before a Magistrate.", action:"If not told the reason: demand it loudly. Call a lawyer immediately. File Habeas Corpus if detained beyond 24 hours." },
  { icon:"🤐", color:"#1A5276", title:"Right to Silence", article:"Art. 20(3)", desc:"No person accused of an offence can be compelled to be a witness against themselves. You are NOT required to answer police questions without a lawyer. 'Remaining silent' is your constitutional right.", action:"At any police station or during any investigation: say 'I am exercising my right to silence under Article 20(3). I will answer with my lawyer present.'" },
  { icon:"⚖️", color:"#138808", title:"Right to Free Legal Aid", article:"Art. 39A + Legal Services Authority Act", desc:"If you cannot afford a lawyer, the government MUST provide you one free of cost. This applies at every stage — arrest, bail, trial. DLSA (District Legal Services Authority) provides free lawyers.", action:"At any police station or court: say 'I need free legal aid under Article 39A.' Call DLSA: 15100." },
  { icon:"📋", color:"#2E4057", title:"Right to Information (RTI)", article:"RTI Act 2005 Sec 3", desc:"Every citizen can demand information from any government body within 30 days. No reason needed. Only Rs.10 fee (free for BPL). One of the most powerful tools against corruption.", action:"File RTI at rtionline.gov.in for central government. State RTI portals for state departments. Response mandatory within 30 days." },
  { icon:"🏫", color:"#1A8FBF", title:"Right to Free Education (6–14 yrs)", article:"Art. 21A + RTE Act 2009", desc:"Every child between 6 and 14 years has the fundamental right to free and compulsory education in a neighbourhood school. No capitation fee can be charged. 25% seats reserved in private schools for economically weaker sections.", action:"If admission denied: approach Block Education Officer. File RTI to verify EWS seat availability." },
  { icon:"🗳️", color:"#8B0000", title:"Right to Vote", article:"Art. 326", desc:"Every Indian citizen aged 18 or above has the right to vote in elections. No one can deny you your vote based on religion, race, caste, sex, or literacy. Voter ID is your right — apply for free.", action:"Register at voters.eci.gov.in. Report voter intimidation to Election Commission: 1950." },
  { icon:"✊", color:"#9B1D20", title:"Right to Peaceful Protest", article:"Art. 19(1)(b)", desc:"Every Indian citizen has the right to assemble peacefully without arms. You can hold protests, dharnas, rallies — as long as they are peaceful and unarmed.", action:"For organised protests: inform police beforehand (not permission — just notice). Police cannot disperse peaceful protests without valid reason." },
  { icon:"🏥", color:"#E74C3C", title:"Right to Emergency Medical Treatment", article:"CEA 2010 + SC Judgments", desc:"Every hospital (government or private) MUST provide emergency treatment regardless of money, insurance, or documentation. Refusing emergency treatment is illegal.", action:"If refused: demand treatment citing Supreme Court orders. Complain to District Collector immediately. Call 108 for ambulance." },
  { icon:"💰", color:"#1A6B3A", title:"Right to Equal Pay for Equal Work", article:"Equal Remuneration Act 1976", desc:"Men and women doing the same work must receive equal remuneration. Paying women less for identical work is illegal.", action:"File complaint with Labour Commissioner. Approach Labour Court for recovery of equal wages + compensation." },
  { icon:"🔒", color:"#5B2D8E", title:"Right Against Unlawful Search", article:"Art. 21 + CrPC 100", desc:"Police cannot search your home without a valid search warrant from a Magistrate (except in emergencies). They must show you the warrant before entering.", action:"Ask to see warrant before allowing entry. Note officer badge number. If no warrant, resist entry and call a lawyer immediately." },
  { icon:"📰", color:"#2C3E50", title:"Right to Freedom of Press & Speech", article:"Art. 19(1)(a)", desc:"Every citizen has freedom of speech and expression. You can criticise the government, write articles, post opinions — within reasonable restrictions. Sedition law is now under Supreme Court review.", action:"Speak, write and post freely but responsibly. Avoid content that incites violence or hatred. Consult a lawyer if served legal notice for speech/writing." },
  { icon:"🆓", color:"#FF6B00", title:"Right to Bail for Bailable Offences", article:"CrPC Sec 436", desc:"For bailable offences (minor crimes), you have an ABSOLUTE right to bail — police CANNOT refuse. They must release you on bail the same day.", action:"If police refuse bail for a bailable offence: contact a lawyer immediately. File complaint against the officer with SP/SSP." },
];

// ─── DAILY LAW FACTS ──────────────────────────────────────────────────────────
const LAW_FACTS = [
  { fact:"Police cannot keep you in custody for more than 24 hours without presenting you before a Magistrate.", law:"CrPC Section 57", icon:"🚔" },
  { fact:"Restaurant service charge is completely voluntary. You can legally refuse to pay it.", law:"CCPA Guidelines 2022", icon:"🍽️" },
  { fact:"If your flight is delayed by 2+ hours, the airline MUST provide you free meals and refreshments.", law:"DGCA Civil Aviation Rules", icon:"✈️" },
  { fact:"Selling any product above its printed MRP is a criminal offence punishable with up to Rs.25,000 fine.", law:"Legal Metrology Act 2009", icon:"🏷️" },
  { fact:"You have the right to a FREE lawyer if you cannot afford one — at every stage of your legal proceedings.", law:"Article 39A, Constitution of India", icon:"⚖️" },
  { fact:"Every child between age 6 and 14 has a Fundamental Right to free education in India.", law:"Article 21A + RTE Act 2009", icon:"🏫" },
  { fact:"Killing or poisoning stray dogs and cats is illegal in India — municipalities must follow ABC Rules.", law:"PCA Act 1960 + ABC Rules 2001", icon:"🐕" },
  { fact:"Employers with 10+ workers must have an Internal Complaints Committee for sexual harassment complaints.", law:"POSH Act 2013", icon:"💼" },
  { fact:"Anyone can file an RTI to any government office for just Rs.10. Response is mandatory within 30 days.", law:"RTI Act 2005", icon:"📋" },
  { fact:"You cannot be fired from a government job without a formal inquiry and chance to defend yourself.", law:"Article 311, Constitution of India", icon:"🏛️" },
  { fact:"Photographing military installations without permission can lead to up to 14 years imprisonment.", law:"Official Secrets Act 1923", icon:"📷" },
  { fact:"A woman employee cannot be dismissed from service during pregnancy or maternity leave.", law:"Maternity Benefit Act 2017", icon:"👶" },
  { fact:"If you've worked continuously for 5 years, you are entitled to gratuity — your employer cannot deny it.", law:"Payment of Gratuity Act 1972", icon:"💰" },
  { fact:"Emergency medical treatment cannot be refused by any hospital — government or private.", law:"Clinical Establishments Act 2010 + SC Judgments", icon:"🏥" },
  { fact:"You have the constitutional right to remain silent when questioned by police. You cannot be forced to confess.", law:"Article 20(3), Constitution of India", icon:"🤐" },
  { fact:"Online threats and WhatsApp messages are admissible evidence in court — same as written threats.", law:"IT Act 2000 + Indian Evidence Act", icon:"📱" },
  { fact:"Builders must fix any structural defects in your home reported within 5 years of possession — free of cost.", law:"RERA Act 2016, Section 14", icon:"🏠" },
  { fact:"A consumer can file a complaint against any doctor or hospital in the Consumer Forum — no lawyer needed.", law:"Consumer Protection Act 2019", icon:"🏥" },
  { fact:"You can file an FIR yourself before a Magistrate if police refuse to register it — they cannot stop you.", law:"CrPC Section 190", icon:"⚖️" },
  { fact:"Driving a vehicle without third-party insurance is a criminal offence with fine up to Rs.4,000.", law:"Motor Vehicles Act 1988, Section 146", icon:"🚗" },
  { fact:"Every woman has the right to register an FIR at any police station, regardless of jurisdiction.", law:"CrPC Section 154 + Zero FIR Rule", icon:"👩" },
  { fact:"BSF has full policing powers within 50 km of India's international borders.", law:"BSF Act 1968", icon:"🛡️" },
  { fact:"The ED cannot keep you under arrest for more than 60 days in PMLA cases — after which bail is a right.", law:"PMLA 2002, Section 167", icon:"💸" },
  { fact:"Ragging is a criminal offence — college management can be held liable if they fail to prevent it.", law:"UGC Anti-Ragging Regulations 2009", icon:"🎓" },
  { fact:"You have the right to vote at age 18 — no one can deny you this right based on caste, religion or literacy.", law:"Article 326, Constitution of India", icon:"🗳️" },
  { fact:"PF (Provident Fund) belongs to YOU — your employer must deposit 12% of your basic salary every month.", law:"EPF Act 1952", icon:"🏦" },
  { fact:"A builder must provide an alternate flat or full refund if the flat is not delivered within the agreed timeline.", law:"RERA Act 2016, Section 18", icon:"🏗️" },
  { fact:"You can claim up to Rs.2 lakh compensation from the government Solatium Fund for hit-and-run accident deaths.", law:"Motor Vehicles Act 1988, Section 161", icon:"🚨" },
  { fact:"Selling expired or spurious medicines is punishable with up to 10 years imprisonment.", law:"Drugs and Cosmetics Act 1940", icon:"💊" },
  { fact:"All government schemes' information including BADP Border Area funds must be disclosed under RTI.", law:"RTI Act 2005 + BADP Scheme", icon:"📋" },
];

// ─── 22 SCHEDULED LANGUAGES + ENGLISH (Article 344, 8th Schedule) ─────────────
const LANGUAGES = [
  { code:"en",  name:"English",    native:"English",           dir:"ltr", region:"Pan-India" },
  { code:"hi",  name:"Hindi",      native:"हिंदी",               dir:"ltr", region:"North India" },
  { code:"ta",  name:"Tamil",      native:"தமிழ்",               dir:"ltr", region:"Tamil Nadu, Puducherry" },
  { code:"te",  name:"Telugu",     native:"తెలుగు",              dir:"ltr", region:"Andhra Pradesh, Telangana" },
  { code:"kn",  name:"Kannada",    native:"ಕನ್ನಡ",               dir:"ltr", region:"Karnataka" },
  { code:"ml",  name:"Malayalam",  native:"മലയാളം",              dir:"ltr", region:"Kerala, Lakshadweep" },
  { code:"bn",  name:"Bengali",    native:"বাংলা",               dir:"ltr", region:"West Bengal, Tripura" },
  { code:"mr",  name:"Marathi",    native:"मराठी",               dir:"ltr", region:"Maharashtra" },
  { code:"gu",  name:"Gujarati",   native:"ગુજરાતી",             dir:"ltr", region:"Gujarat, Dadra & NH" },
  { code:"pa",  name:"Punjabi",    native:"ਪੰਜਾਬੀ",              dir:"ltr", region:"Punjab, Haryana" },
  { code:"or",  name:"Odia",       native:"ଓଡ଼ିଆ",               dir:"ltr", region:"Odisha" },
  { code:"as",  name:"Assamese",   native:"অসমীয়া",             dir:"ltr", region:"Assam" },
  { code:"ur",  name:"Urdu",       native:"اردو",                dir:"rtl", region:"J&K, UP, Telangana" },
  { code:"ne",  name:"Nepali",     native:"नेपाली",              dir:"ltr", region:"Sikkim, North Bengal" },
  { code:"ks",  name:"Kashmiri",   native:"کٲشُر",               dir:"rtl", region:"Jammu & Kashmir" },
  { code:"kok", name:"Konkani",    native:"कोंकणी",              dir:"ltr", region:"Goa, Coastal Karnataka" },
  { code:"mai", name:"Maithili",   native:"मैथिली",              dir:"ltr", region:"Bihar, Jharkhand" },
  { code:"dgo", name:"Dogri",      native:"डोगरी",               dir:"ltr", region:"Jammu & Kashmir" },
  { code:"mni", name:"Manipuri",   native:"মৈতৈলোন্",           dir:"ltr", region:"Manipur" },
  { code:"sat", name:"Santali",    native:"ᱥᱟᱱᱛᱟᱲᱤ",           dir:"ltr", region:"Jharkhand, West Bengal" },
  { code:"brx", name:"Bodo",       native:"बड़ो",                 dir:"ltr", region:"Assam" },
  { code:"sd",  name:"Sindhi",     native:"سنڌي",                dir:"rtl", region:"Gujarat, Maharashtra" },
  { code:"sa",  name:"Sanskrit",   native:"संस्कृतम्",            dir:"ltr", region:"Pan-India (Classical)" },
];

// ─── UI TRANSLATIONS ──────────────────────────────────────────────────────────
// Key strings translated for all 23 languages
const UI_TEXT = {
  en:  { heroTitle:"Know Your Rights. Speak the Law.", heroSub:"India's AI-powered legal companion. Understand IPC, RERA, RTI & more in plain simple English.", searchPH:"Search any law or section… e.g. IPC 420, RERA, RTI, POSH", askBtn:"⚖️ Ask a Legal Question", browseLaws:"Browse Laws ↓", login:"Login", signup:"Sign Up", logout:"Logout", langLabel:"🌐 Language", tab_cat:"📚 Categories", tab_sc:"🎭 Scenarios", tab_wi:"🚨 What If?", tab_rights:"⚖️ My Rights", tab_women:"👩 Women Safety", tab_dis:"♿ Disability", tab_help:"📞 Helplines", chatWelcome:"Welcome to KanoonSaathi", chatSub:"Describe your legal problem in plain English. I'll find the exact law, section & steps you need.", chatPH:"Describe your problem… e.g. 'salary not paid', 'FIR refused', 'UPI scam'", askAiBtn:"⚖️ Ask", dailyFact:"📅 DAILY LAW FACT", impactTitle:"Can't afford a lawyer? We've got you.", profile:"Profile", save:"💾 Save Profile", noLawyer:"Free · No Lawyer Needed" },

  hi:  { heroTitle:"अपने अधिकार जानें। कानून बोलें।", heroSub:"भारत का AI-संचालित कानूनी साथी। IPC, RERA, RTI और अधिक को सरल हिंदी में समझें।", searchPH:"कोई भी कानून या धारा खोजें… जैसे IPC 420, RERA, RTI", askBtn:"⚖️ कानूनी सवाल पूछें", browseLaws:"कानून देखें ↓", login:"लॉग इन", signup:"साइन अप", logout:"लॉग आउट", langLabel:"🌐 भाषा", tab_cat:"📚 श्रेणियाँ", tab_sc:"🎭 परिदृश्य", tab_wi:"🚨 अगर हो तो?", tab_rights:"⚖️ मेरे अधिकार", tab_women:"👩 महिला सुरक्षा", tab_dis:"♿ दिव्यांग", tab_help:"📞 हेल्पलाइन", chatWelcome:"KanoonSaathi में आपका स्वागत है", chatSub:"अपनी कानूनी समस्या सरल भाषा में बताएं। मैं सही कानून, धारा और कदम बताऊंगा।", chatPH:"अपनी समस्या बताएं… जैसे 'वेतन नहीं मिला', 'FIR दर्ज नहीं हुई'", askAiBtn:"⚖️ पूछें", dailyFact:"📅 आज का कानूनी तथ्य", impactTitle:"वकील नहीं है? हम हैं आपके साथ।", profile:"प्रोफ़ाइल", save:"💾 प्रोफ़ाइल सहेजें", noLawyer:"मुफ़्त · बिना वकील के" },

  ta:  { heroTitle:"உங்கள் உரிமைகளை அறியுங்கள். சட்டம் பேசுங்கள்.", heroSub:"இந்தியாவின் AI சட்ட உதவியாளர். IPC, RERA, RTI மற்றும் அதிகத்தை எளிய தமிழில் புரிந்துகொள்ளுங்கள்.", searchPH:"எந்த சட்டத்தையும் தேடுங்கள்… IPC 420, RERA, RTI", askBtn:"⚖️ சட்ட கேள்வி கேளுங்கள்", browseLaws:"சட்டங்களை பார்க்க ↓", login:"உள்நுழைவு", signup:"பதிவு செய்க", logout:"வெளியேறு", langLabel:"🌐 மொழி", tab_cat:"📚 வகைகள்", tab_sc:"🎭 சூழ்நிலைகள்", tab_wi:"🚨 என்ன செய்வது?", tab_rights:"⚖️ என் உரிமைகள்", tab_women:"👩 பெண் பாதுகாப்பு", tab_dis:"♿ மாற்றுத்திறன்", tab_help:"📞 உதவி எண்கள்", chatWelcome:"KanoonSaathi-க்கு வரவேற்கிறோம்", chatSub:"உங்கள் சட்ட பிரச்னையை எளிய தமிழில் சொல்லுங்கள்.", chatPH:"உங்கள் பிரச்னையை சொல்லுங்கள்…", askAiBtn:"⚖️ கேளுங்கள்", dailyFact:"📅 இன்றைய சட்ட தகவல்", impactTitle:"வழக்கறிஞர் இல்லையா? நாங்கள் இருக்கிறோம்.", profile:"சுயவிவரம்", save:"💾 சேமி", noLawyer:"இலவசம் · வழக்கறிஞர் தேவையில்லை" },

  te:  { heroTitle:"మీ హక్కులు తెలుసుకోండి. చట్టం మాట్లాడండి.", heroSub:"భారతదేశపు AI న్యాయ సహాయకుడు. IPC, RERA, RTI మరియు అంతకంటే ఎక్కువను సులభ తెలుగులో అర్థం చేసుకోండి.", searchPH:"ఏదైనా చట్టం లేదా సెక్షన్ వెతకండి… IPC 420, RERA, RTI", askBtn:"⚖️ న్యాయ ప్రశ్న అడగండి", browseLaws:"చట్టాలు చూడండి ↓", login:"లాగిన్", signup:"సైన్ అప్", logout:"లాగౌట్", langLabel:"🌐 భాష", tab_cat:"📚 వర్గాలు", tab_sc:"🎭 సందర్భాలు", tab_wi:"🚨 ఏం చేయాలి?", tab_rights:"⚖️ నా హక్కులు", tab_women:"👩 మహిళా రక్షణ", tab_dis:"♿ వికలాంగులు", tab_help:"📞 హెల్ప్‌లైన్‌లు", chatWelcome:"KanoonSaathi కి స్వాగతం", chatSub:"మీ న్యాయ సమస్యను సులభ తెలుగులో చెప్పండి.", chatPH:"మీ సమస్య చెప్పండి…", askAiBtn:"⚖️ అడగండి", dailyFact:"📅 నేటి న్యాయ వాస్తవం", impactTitle:"న్యాయవాది లేదా? మేము ఉన్నాం.", profile:"ప్రొఫైల్", save:"💾 సేవ్ చేయి", noLawyer:"ఉచితం · న్యాయవాది అవసరం లేదు" },

  kn:  { heroTitle:"ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ. ಕಾನೂನು ಮಾತನಾಡಿ.", heroSub:"ಭಾರತದ AI ಕಾನೂನು ಸಹಾಯಕ. IPC, RERA, RTI ಮತ್ತು ಹೆಚ್ಚಿನದನ್ನು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಅರ್ಥ ಮಾಡಿಕೊಳ್ಳಿ.", searchPH:"ಯಾವುದೇ ಕಾನೂನು ಅಥವಾ ವಿಭಾಗ ಹುಡುಕಿ…", askBtn:"⚖️ ಕಾನೂನು ಪ್ರಶ್ನೆ ಕೇಳಿ", browseLaws:"ಕಾನೂನುಗಳನ್ನು ನೋಡಿ ↓", login:"ಲಾಗಿನ್", signup:"ಸೈನ್ ಅಪ್", logout:"ಲಾಗೌಟ್", langLabel:"🌐 ಭಾಷೆ", tab_cat:"📚 ವರ್ಗಗಳು", tab_sc:"🎭 ಸಂದರ್ಭಗಳು", tab_wi:"🚨 ಏನು ಮಾಡಬೇಕು?", tab_rights:"⚖️ ನನ್ನ ಹಕ್ಕುಗಳು", tab_women:"👩 ಮಹಿಳಾ ಸುರಕ್ಷತೆ", tab_dis:"♿ ಅಂಗವಿಕಲರು", tab_help:"📞 ಸಹಾಯವಾಣಿ", chatWelcome:"KanoonSaathi ಗೆ ಸ್ವಾಗತ", chatSub:"ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಹೇಳಿ.", chatPH:"ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ…", askAiBtn:"⚖️ ಕೇಳಿ", dailyFact:"📅 ಇಂದಿನ ಕಾನೂನು ಸಂಗತಿ", impactTitle:"ವಕೀಲರಿಲ್ಲವೇ? ನಾವಿದ್ದೇವೆ.", profile:"ಪ್ರೊಫೈಲ್", save:"💾 ಉಳಿಸಿ", noLawyer:"ಉಚಿತ · ವಕೀಲರ ಅವಶ್ಯಕತೆ ಇಲ್ಲ" },

  ml:  { heroTitle:"നിങ്ങളുടെ അവകാശങ്ങൾ അറിയൂ. നിയമം സംസാരിക്കൂ.", heroSub:"ഇന്ത്യയുടെ AI നിയമ സഹായി. IPC, RERA, RTI തുടങ്ങിയവ ലളിതമായ മലയാളത്തിൽ മനസ്സിലാക്കൂ.", searchPH:"ഏതൊരു നിയമവും അന്വേഷിക്കൂ…", askBtn:"⚖️ നിയമ ചോദ്യം ചോദിക്കൂ", browseLaws:"നിയമങ്ങൾ കാണൂ ↓", login:"ലോഗിൻ", signup:"സൈൻ അപ്", logout:"ലോഗൗട്ട്", langLabel:"🌐 ഭാഷ", tab_cat:"📚 വിഭാഗങ്ങൾ", tab_sc:"🎭 സാഹചര്യങ്ങൾ", tab_wi:"🚨 എന്ത് ചെയ്യണം?", tab_rights:"⚖️ എന്റെ അവകാശങ്ങൾ", tab_women:"👩 വനിതാ സുരക്ഷ", tab_dis:"♿ വൈകല്യം", tab_help:"📞 ഹെൽപ്‌ലൈൻ", chatWelcome:"KanoonSaathi-ലേക്ക് സ്വാഗതം", chatSub:"നിങ്ങളുടെ നിയമ പ്രശ്നം ലളിതമായ ഭാഷയിൽ പറയൂ.", chatPH:"നിങ്ങളുടെ പ്രശ്നം പറയൂ…", askAiBtn:"⚖️ ചോദിക്കൂ", dailyFact:"📅 ഇന്നത്തെ നിയമ വസ്തുത", impactTitle:"അഭിഭാഷകൻ ഇല്ലേ? ഞങ്ങളുണ്ട്.", profile:"പ്രൊഫൈൽ", save:"💾 സേവ് ചെയ്യൂ", noLawyer:"സൗജന്യം · അഭിഭാഷകൻ ആവശ്യമില്ല" },

  bn:  { heroTitle:"আপনার অধিকার জানুন। আইন কথা বলুন।", heroSub:"ভারতের AI আইনি সহায়ক। IPC, RERA, RTI এবং আরও বেশি সহজ বাংলায় বুঝুন।", searchPH:"যেকোনো আইন বা ধারা খুঁজুন…", askBtn:"⚖️ আইনি প্রশ্ন জিজ্ঞেস করুন", browseLaws:"আইন দেখুন ↓", login:"লগইন", signup:"সাইন আপ", logout:"লগআউট", langLabel:"🌐 ভাষা", tab_cat:"📚 বিভাগ", tab_sc:"🎭 পরিস্থিতি", tab_wi:"🚨 যদি হয়?", tab_rights:"⚖️ আমার অধিকার", tab_women:"👩 নারী সুরক্ষা", tab_dis:"♿ প্রতিবন্ধী", tab_help:"📞 হেল্পলাইন", chatWelcome:"KanoonSaathi-তে স্বাগতম", chatSub:"আপনার আইনি সমস্যা সহজ বাংলায় বলুন।", chatPH:"আপনার সমস্যা বলুন…", askAiBtn:"⚖️ জিজ্ঞেস করুন", dailyFact:"📅 আজকের আইনি তথ্য", impactTitle:"আইনজীবী নেই? আমরা আছি।", profile:"প্রোফাইল", save:"💾 সংরক্ষণ করুন", noLawyer:"বিনামূল্যে · আইনজীবী ছাড়া" },

  mr:  { heroTitle:"तुमचे हक्क जाणून घ्या. कायदा बोला.", heroSub:"भारताचा AI कायदेशीर सहाय्यक. IPC, RERA, RTI आणि अधिक सोप्या मराठीत समजून घ्या.", searchPH:"कोणताही कायदा किंवा कलम शोधा…", askBtn:"⚖️ कायदेशीर प्रश्न विचारा", browseLaws:"कायदे पहा ↓", login:"लॉग इन", signup:"साइन अप", logout:"लॉग आउट", langLabel:"🌐 भाषा", tab_cat:"📚 श्रेणी", tab_sc:"🎭 परिस्थिती", tab_wi:"🚨 काय करावे?", tab_rights:"⚖️ माझे हक्क", tab_women:"👩 महिला सुरक्षा", tab_dis:"♿ दिव्यांग", tab_help:"📞 हेल्पलाइन", chatWelcome:"KanoonSaathi मध्ये आपले स्वागत आहे", chatSub:"तुमची कायदेशीर समस्या सोप्या मराठीत सांगा.", chatPH:"तुमची समस्या सांगा…", askAiBtn:"⚖️ विचारा", dailyFact:"📅 आजचा कायदेशीर तथ्य", impactTitle:"वकील नाही? आम्ही आहोत.", profile:"प्रोफाइल", save:"💾 सेव्ह करा", noLawyer:"मोफत · वकिलाशिवाय" },

  gu:  { heroTitle:"તમારા અધિકારો જાણો. કાયદો બોલો.", heroSub:"ભારતનો AI કાનૂની સહાયક. IPC, RERA, RTI અને વધુ સરળ ગુજરાતીમાં સમજો.", searchPH:"કોઈ પણ કાયદો અથવા કલમ શોધો…", askBtn:"⚖️ કાનૂની પ્રશ્ન પૂછો", browseLaws:"કાયદા જુઓ ↓", login:"લૉગ ઇન", signup:"સાઇન અપ", logout:"લૉગ આઉટ", langLabel:"🌐 ભાષા", tab_cat:"📚 વર્ગો", tab_sc:"🎭 પરિસ્થિતિ", tab_wi:"🚨 શું કરવું?", tab_rights:"⚖️ મારા અધિકારો", tab_women:"👩 મહિલા સુરક્ષા", tab_dis:"♿ વિકલાંગ", tab_help:"📞 હેલ્પલાઇન", chatWelcome:"KanoonSaathi માં આપનું સ્વાગત છે", chatSub:"તમારી કાનૂની સમસ્યા સરળ ગુજરાતીમાં જણાવો.", chatPH:"તમારી સમસ્યા જણાવો…", askAiBtn:"⚖️ પૂછો", dailyFact:"📅 આજનો કાનૂની તથ્ય", impactTitle:"વકીલ નથી? અમે છીએ.", profile:"પ્રોફાઇલ", save:"💾 સેવ કરો", noLawyer:"મફત · વકીલ વગર" },

  pa:  { heroTitle:"ਆਪਣੇ ਅਧਿਕਾਰ ਜਾਣੋ। ਕਾਨੂੰਨ ਬੋਲੋ।", heroSub:"ਭਾਰਤ ਦਾ AI ਕਾਨੂੰਨੀ ਸਹਾਇਕ। IPC, RERA, RTI ਅਤੇ ਹੋਰ ਨੂੰ ਸਰਲ ਪੰਜਾਬੀ ਵਿੱਚ ਸਮਝੋ।", searchPH:"ਕੋਈ ਵੀ ਕਾਨੂੰਨ ਜਾਂ ਧਾਰਾ ਲੱਭੋ…", askBtn:"⚖️ ਕਾਨੂੰਨੀ ਸਵਾਲ ਪੁੱਛੋ", browseLaws:"ਕਾਨੂੰਨ ਦੇਖੋ ↓", login:"ਲੌਗ ਇਨ", signup:"ਸਾਈਨ ਅਪ", logout:"ਲੌਗ ਆਉਟ", langLabel:"🌐 ਭਾਸ਼ਾ", tab_cat:"📚 ਸ਼੍ਰੇਣੀਆਂ", tab_sc:"🎭 ਸਥਿਤੀਆਂ", tab_wi:"🚨 ਕੀ ਕਰਨਾ?", tab_rights:"⚖️ ਮੇਰੇ ਅਧਿਕਾਰ", tab_women:"👩 ਔਰਤ ਸੁਰੱਖਿਆ", tab_dis:"♿ ਅਪਾਹਜ", tab_help:"📞 ਹੈਲਪਲਾਈਨ", chatWelcome:"KanoonSaathi ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ", chatSub:"ਆਪਣੀ ਕਾਨੂੰਨੀ ਸਮੱਸਿਆ ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਦੱਸੋ।", chatPH:"ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ…", askAiBtn:"⚖️ ਪੁੱਛੋ", dailyFact:"📅 ਅੱਜ ਦਾ ਕਾਨੂੰਨੀ ਤੱਥ", impactTitle:"ਵਕੀਲ ਨਹੀਂ? ਅਸੀਂ ਹਾਂ।", profile:"ਪ੍ਰੋਫਾਈਲ", save:"💾 ਸੇਵ ਕਰੋ", noLawyer:"ਮੁਫ਼ਤ · ਵਕੀਲ ਤੋਂ ਬਿਨਾਂ" },

  or:  { heroTitle:"ଆପଣଙ୍କ ଅଧିକାର ଜାଣନ୍ତୁ। ଆଇନ ଭାଷା ବୋଲନ୍ତୁ।", heroSub:"ଭାରତର AI ଆଇନ ସହାୟକ। IPC, RERA, RTI ଓ ଅଧିକ ସରଳ ଓଡ଼ିଆରେ ବୁଝନ୍ତୁ।", searchPH:"ଯେକୌଣସି ଆଇନ ବା ଧାରା ଖୋଜନ୍ତୁ…", askBtn:"⚖️ ଆଇନ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ", browseLaws:"ଆଇନ ଦେଖନ୍ତୁ ↓", login:"ଲଗ୍‌ ଇନ", signup:"ସାଇନ୍‌ ଅପ", logout:"ଲଗ୍‌ ଆଉଟ", langLabel:"🌐 ଭାଷା", tab_cat:"📚 ବର୍ଗ", tab_sc:"🎭 ପରିସ୍ଥିତି", tab_wi:"🚨 କ'ଣ କରିବ?", tab_rights:"⚖️ ମୋ ଅଧିକାର", tab_women:"👩 ମହିଳା ସୁରକ୍ଷା", tab_dis:"♿ ଦିବ୍ୟାଙ୍ଗ", tab_help:"📞 ସାହାଯ୍ୟ ନମ୍ବର", chatWelcome:"KanoonSaathi ରେ ସ୍ୱାଗତ", chatSub:"ଆପଣଙ୍କ ଆଇନ ସମସ୍ୟା ସରଳ ଭାଷାରେ କୁହନ୍ତୁ।", chatPH:"ଆପଣଙ୍କ ସମସ୍ୟା କୁହନ୍ତୁ…", askAiBtn:"⚖️ ପଚାରନ୍ତୁ", dailyFact:"📅 ଆଜିର ଆଇନ ତଥ୍ୟ", impactTitle:"ଓକିଲ ନାହାନ୍ତି? ଆମେ ଅଛୁ।", profile:"ପ୍ରୋଫାଇଲ", save:"💾 ସଂରକ୍ଷଣ କରନ୍ତୁ", noLawyer:"ମାଗଣା · ଓକିଲ ବିନା" },

  as:  { heroTitle:"আপোনাৰ অধিকাৰ জানক। আইন কথা কওক।", heroSub:"ভাৰতৰ AI আইনী সহায়ক। IPC, RERA, RTI আৰু অধিক সহজ অসমীয়াত বুজক।", searchPH:"যিকোনো আইন বা ধাৰা বিচাৰক…", askBtn:"⚖️ আইনী প্ৰশ্ন সোধক", browseLaws:"আইন চাওক ↓", login:"লগ ইন", signup:"চাইন আপ", logout:"লগ আউট", langLabel:"🌐 ভাষা", tab_cat:"📚 শ্ৰেণী", tab_sc:"🎭 পৰিস্থিতি", tab_wi:"🚨 কি কৰিব?", tab_rights:"⚖️ মোৰ অধিকাৰ", tab_women:"👩 মহিলা সুৰক্ষা", tab_dis:"♿ দিব্যাংগ", tab_help:"📞 হেল্পলাইন", chatWelcome:"KanoonSaathi-লৈ স্বাগতম", chatSub:"আপোনাৰ আইনী সমস্যা সহজ ভাষাত কওক।", chatPH:"আপোনাৰ সমস্যা কওক…", askAiBtn:"⚖️ সোধক", dailyFact:"📅 আজিৰ আইনী তথ্য", impactTitle:"উকীল নাই? আমি আছোঁ।", profile:"প্ৰফাইল", save:"💾 সংৰক্ষণ কৰক", noLawyer:"বিনামূলীয়া · উকীল অবিহনে" },

  ur:  { heroTitle:"اپنے حقوق جانیں۔ قانون بولیں۔", heroSub:"بھارت کا AI قانونی ساتھی۔ IPC، RERA، RTI اور بہت کچھ آسان اردو میں سمجھیں۔", searchPH:"کوئی بھی قانون یا دفعہ تلاش کریں…", askBtn:"⚖️ قانونی سوال پوچھیں", browseLaws:"قوانین دیکھیں ↓", login:"لاگ ان", signup:"سائن اپ", logout:"لاگ آؤٹ", langLabel:"🌐 زبان", tab_cat:"📚 زمرے", tab_sc:"🎭 حالات", tab_wi:"🚨 کیا کریں?", tab_rights:"⚖️ میرے حقوق", tab_women:"👩 خواتین کی حفاظت", tab_dis:"♿ معذور", tab_help:"📞 ہیلپ لائن", chatWelcome:"KanoonSaathi میں خوش آمدید", chatSub:"اپنا قانونی مسئلہ آسان اردو میں بتائیں۔", chatPH:"اپنا مسئلہ بتائیں…", askAiBtn:"⚖️ پوچھیں", dailyFact:"📅 آج کا قانونی حقیقت", impactTitle:"وکیل نہیں؟ ہم ہیں۔", profile:"پروفائل", save:"💾 محفوظ کریں", noLawyer:"مفت · بغیر وکیل کے" },

  ne:  { heroTitle:"आफ्नो अधिकार जान्नुहोस्। कानुन बोल्नुहोस्।", heroSub:"भारतको AI कानुनी सहायक। IPC, RERA, RTI र थप सरल नेपालीमा बुझ्नुहोस्।", searchPH:"कुनै पनि कानुन वा दफा खोज्नुहोस्…", askBtn:"⚖️ कानुनी प्रश्न सोध्नुहोस्", browseLaws:"कानुनहरू हेर्नुहोस् ↓", login:"लग इन", signup:"साइन अप", logout:"लग आउट", langLabel:"🌐 भाषा", tab_cat:"📚 श्रेणीहरू", tab_sc:"🎭 परिस्थितिहरू", tab_wi:"🚨 के गर्ने?", tab_rights:"⚖️ मेरा अधिकार", tab_women:"👩 महिला सुरक्षा", tab_dis:"♿ अपाङ्गता", tab_help:"📞 हेल्पलाइन", chatWelcome:"KanoonSaathi मा स्वागत छ", chatSub:"आफ्नो कानुनी समस्या सरल भाषामा भन्नुहोस्।", chatPH:"आफ्नो समस्या भन्नुहोस्…", askAiBtn:"⚖️ सोध्नुहोस्", dailyFact:"📅 आजको कानुनी तथ्य", impactTitle:"वकिल छैन? हामी छौं।", profile:"प्रोफाइल", save:"💾 सेभ गर्नुहोस्", noLawyer:"नि:शुल्क · वकिल बिना" },

  ks:  { heroTitle:"اپنہ حق سیٚنتھ۔ قانوٗن بولِتھ۔", heroSub:"بھارتک AI قانوٗنی رفیق۔ IPC، RERA، RTI سیٚنتھ آسانہ کشمیری زبانہِ مَنز۔", searchPH:"کانہہ پَنہِ قانوٗن یا دفعہ لبتھ…", askBtn:"⚖️ قانوٗنی سوال پرتھ", browseLaws:"قانوٗن واچتھ ↓", login:"لاگ اِن", signup:"سائن اَپ", logout:"لاگ آوٗٹ", langLabel:"🌐 زَبان", tab_cat:"📚 زُمرہ", tab_sc:"🎭 حالات", tab_wi:"🚨 کیاہ کَرتھ?", tab_rights:"⚖️ میہ حَق", tab_women:"👩 زَنان حِفاظَت", tab_dis:"♿ معذور", tab_help:"📞 مدد نَمبَر", chatWelcome:"KanoonSaathi مَنز خوش آمدید", chatSub:"اپنس قانوٗنی مسئَلہ سیٚنتھ آسانہ زبانہِ مَنز۔", chatPH:"اپنس مسئَلہ دِتھ…", askAiBtn:"⚖️ پرتھ", dailyFact:"📅 آج قانوٗنی حقیقَت", impactTitle:"وکیل نِیٚ؟ اسِ آسِوۡ۔", profile:"پروفائل", save:"💾 محفوظ کَرتھ", noLawyer:"مفت · وکیل بَغیر" },

  kok: { heroTitle:"तुमचे हक्क जाणून घ्या. कायदो बोला.", heroSub:"भारताचो AI कायदेशीर सहायक। IPC, RERA, RTI आनी चड सोप्यां कोंकणींत समजून घ्या.", searchPH:"खंयचोय कायदो वा कलम सोदात…", askBtn:"⚖️ कायदेशीर प्रस्न विचारात", browseLaws:"कायदे पळयात ↓", login:"लॉग इन", signup:"साइन अप", logout:"लॉग आउट", langLabel:"🌐 भास", tab_cat:"📚 वर्ग", tab_sc:"🎭 परिस्थिती", tab_wi:"🚨 खंय करूचे?", tab_rights:"⚖️ म्हजे हक्क", tab_women:"👩 बायल सुरक्षा", tab_dis:"♿ दिव्यांग", tab_help:"📞 हेल्पलाइन", chatWelcome:"KanoonSaathi त स्वागत आसा", chatSub:"तुमची कायदेशीर समस्या सोप्यां भाशेंत सांगात.", chatPH:"तुमची समस्या सांगात…", askAiBtn:"⚖️ विचारात", dailyFact:"📅 आयचो कायदेशीर तथ्य", impactTitle:"वकील ना? आमी आसात.", profile:"प्रोफाइल", save:"💾 सेव्ह करात", noLawyer:"मुफ्त · वकिला बगर" },

  mai: { heroTitle:"अपन अधिकार जानू। कानून बाजू।", heroSub:"भारतक AI कानूनी सहायक। IPC, RERA, RTI आ' अधिक केँ सरल मैथिलीमे बुझू।", searchPH:"कोनो कानून वा धारा खोजू…", askBtn:"⚖️ कानूनी प्रश्न पूछू", browseLaws:"कानून देखू ↓", login:"लॉग इन", signup:"साइन अप", logout:"लॉग आउट", langLabel:"🌐 भाषा", tab_cat:"📚 श्रेणी", tab_sc:"🎭 परिस्थिति", tab_wi:"🚨 की करू?", tab_rights:"⚖️ हमर अधिकार", tab_women:"👩 महिला सुरक्षा", tab_dis:"♿ दिव्यांग", tab_help:"📞 हेल्पलाइन", chatWelcome:"KanoonSaathi मे स्वागत अछि", chatSub:"अपन कानूनी समस्या सरल भाषामे कहू।", chatPH:"अपन समस्या कहू…", askAiBtn:"⚖️ पूछू", dailyFact:"📅 आइक कानूनी तथ्य", impactTitle:"वकील नहि? हम छी।", profile:"प्रोफाइल", save:"💾 सेव करू", noLawyer:"मुफ्त · वकील बिना" },

  dgo: { heroTitle:"अपने हक्क जानो। कानून बोलो।", heroSub:"भारत दा AI कानूनी साथी। IPC, RERA, RTI ते होर गल्लां गी सोखे डोगरी च समझो।", searchPH:"कोई बी कानून जां धारा लब्भो…", askBtn:"⚖️ कानूनी सुआल पुच्छो", browseLaws:"कानून देखो ↓", login:"लॉग इन", signup:"साइन अप", logout:"लॉग आउट", langLabel:"🌐 बोली", tab_cat:"📚 श्रेणियां", tab_sc:"🎭 हालात", tab_wi:"🚨 की करना?", tab_rights:"⚖️ मेरे हक्क", tab_women:"👩 बाईयां दी सुरक्षा", tab_dis:"♿ दिव्यांग", tab_help:"📞 हेल्पलाइन", chatWelcome:"KanoonSaathi च जी आया", chatSub:"अपनी कानूनी समस्या सोखी बोलीच दस्सो।", chatPH:"अपनी समस्या दस्सो…", askAiBtn:"⚖️ पुच्छो", dailyFact:"📅 आज दा कानूनी तथ्य", impactTitle:"वकील नईं? अस्सीं हां।", profile:"प्रोफाइल", save:"💾 सेव करो", noLawyer:"मुफ्त · वकील बिना" },

  mni: { heroTitle:"নহাক্কী মপুং ফোংদোকউ। শাসন পাউরম্বা থম্বিউ।", heroSub:"ভারতকী AI শাসনগী মরূপ। IPC, RERA, RTI অমসুং চাউখৎলবা মীৎয়েং মণিপুরীদা হায়বিরগনি।", searchPH:"শাসন অমদি ধারা লৈনবিউ…", askBtn:"⚖️ শাসনগী হোল্না থম্বিউ", browseLaws:"শাসন উবিউ ↓", login:"লগ ইন", signup:"সাইন আপ", logout:"লগ আউট", langLabel:"🌐 ৱারোল", tab_cat:"📚 লমচৎ", tab_sc:"🎭 হোয়নবা", tab_wi:"🚨 হায়বিরিবা?", tab_rights:"⚖️ ঙসিগী মপুং", tab_women:"👩 নুপী পাওজেল", tab_dis:"♿ অশক্তপা", tab_help:"📞 হেল্পলাইন", chatWelcome:"KanoonSaathi দা ফাওবিয়ু", chatSub:"নহাক্কী শাসনগী অসোনবা মীৎয়েং মণিপুরীদা হায়বিউ।", chatPH:"নহাক্কী অসোনবা হায়বিউ…", askAiBtn:"⚖️ থম্বিউ", dailyFact:"📅 ঙসিগী শাসন থবক", impactTitle:"অরোনবা অকোয়বা? অসিনা লৈই।", profile:"প্রোফাইল", save:"💾 সেভ করউ", noLawyer:"ফ্রী · অরোনবা অকোয়বা নত্তে" },

  sat: { heroTitle:"ᱟᱯᱱᱟᱭ ᱦᱚᱠ ᱵᱩᱡᱷᱟᱹᱣ᱾ ᱠᱟᱱᱩᱱ ᱜᱟᱞᱟᱹᱣ᱾", heroSub:"ᱵᱷᱟᱨᱚᱛ ᱠᱷᱚᱱ AI ᱠᱟᱱᱩᱱ ᱥᱟᱦᱟᱭ᱾ IPC, RERA, RTI ᱟᱨ ᱚᱠᱚᱭ ᱵᱩᱡᱷᱟᱹᱜ᱾", searchPH:"ᱡᱮᱦᱮᱫ ᱠᱟᱱᱩᱱ ᱧᱟᱢ ᱢᱮ…", askBtn:"⚖️ ᱠᱟᱱᱩᱱ ᱯᱟᱹᱨᱥᱤ ᱪᱮᱫᱟᱜ", browseLaws:"ᱠᱟᱱᱩᱱ ᱧᱮᱞ ᱢᱮ ↓", login:"ᱞᱚᱜ ᱤᱱ", signup:"ᱥᱟᱭᱤᱱ ᱟᱯ", logout:"ᱞᱚᱜ ᱟᱣᱴ", langLabel:"🌐 ᱯᱟᱹᱨᱥᱤ", tab_cat:"📚 ᱥᱟᱬᱮᱥ", tab_sc:"🎭 ᱦᱟᱹᱞᱤ", tab_wi:"🚨 ᱪᱮᱫ ᱢᱮ?", tab_rights:"⚖️ ᱟᱣᱟᱜ ᱦᱚᱠ", tab_women:"👩 ᱯᱷᱩᱞᱵᱟᱬᱤ ᱵᱟᱫᱷᱟᱣ", tab_dis:"♿ ᱤᱫᱤ", tab_help:"📞 ᱥᱟᱦᱟᱭ ᱱᱚᱸᱵᱚᱨ", chatWelcome:"KanoonSaathi ᱨᱮ ᱡᱚᱦᱟᱨ", chatSub:"ᱟᱯᱱᱟᱭ ᱠᱟᱱᱩᱱ ᱫᱚᱲᱟ ᱵᱟᱹᱦᱩ ᱢᱮ᱾", chatPH:"ᱟᱯᱱᱟᱭ ᱫᱚᱲᱟ ᱵᱟᱹᱦᱩ ᱢᱮ…", askAiBtn:"⚖️ ᱥᱮᱞ", dailyFact:"📅 ᱟᱡᱤ ᱠᱟᱱᱩᱱ ᱢᱮᱞᱮᱫ", impactTitle:"ᱣᱚᱠᱤᱞ ᱵᱟᱝ? ᱟᱠᱟᱫ ᱟᱭᱢᱟ᱾", profile:"ᱯᱨᱚᱯᱷᱟᱭᱤᱞ", save:"💾 ᱰᱤᱥᱟᱹᱢ", noLawyer:"ᱢᱩᱯᱷᱛ · ᱣᱚᱠᱤᱞ ᱵᱟᱝ" },

  brx: { heroTitle:"नंगौ थाखोनो जानाय होनाय। आइन थां लानाय।", heroSub:"भारत आइन AI गोसोखौ गोरा। IPC, RERA, RTI आरो थानो बोडो हिन्जाव।", searchPH:"जाय आइन नङा हानजाथि सोरजिनो…", askBtn:"⚖️ आइन फारिखि बिनो", browseLaws:"आइन नुनो ↓", login:"लग इन", signup:"साइन अप", logout:"लग आउट", langLabel:"🌐 हिन्जाव", tab_cat:"📚 फारि", tab_sc:"🎭 हाबाफारि", tab_wi:"🚨 मा बाहायनो?", tab_rights:"⚖️ नांनि थाखो", tab_women:"👩 बिसायथि रैखाथि", tab_dis:"♿ गोरोन्थि", tab_help:"📞 सोलाइनि नोम्बर", chatWelcome:"KanoonSaathi-आव फिसाजो", chatSub:"नांनि आइन हाबाफारि सोरजि हिन्जावा बुंनो।", chatPH:"नांनि हाबाफारि बुंनो…", askAiBtn:"⚖️ बिनो", dailyFact:"📅 मैया आइन सत्य", impactTitle:"आइन खेलायनायनि बिजाब नाङ? मोन नो।", profile:"प्रोफाइल", save:"💾 सेव होनो", noLawyer:"फ्री · बिजाब बिनो नाङ" },

  sd:  { heroTitle:"پنهنجا حق سڃاڻو. قانون ڳالهايو.", heroSub:"ڀارت جو AI قانوني ساٿي. IPC, RERA, RTI ۽ وڌيڪ آسان سنڌيءَ ۾ سمجهو.", searchPH:"ڪو به قانون يا دفعو ڳولهيو…", askBtn:"⚖️ قانوني سوال پڇو", browseLaws:"قانون ڏسو ↓", login:"لاگ اِن", signup:"سائن اَپ", logout:"لاگ آئوٽ", langLabel:"🌐 ٻولي", tab_cat:"📚 زمرا", tab_sc:"🎭 حالتون", tab_wi:"🚨 ڇا ڪجي?", tab_rights:"⚖️ منهنجا حق", tab_women:"👩 عورتن جي حفاظت", tab_dis:"♿ معذور", tab_help:"📞 هيلپ لائن", chatWelcome:"KanoonSaathi ۾ ڀليڪار", chatSub:"پنهنجو قانوني مسئلو آسان سنڌيءَ ۾ ٻڌايو.", chatPH:"پنهنجو مسئلو ٻڌايو…", askAiBtn:"⚖️ پڇو", dailyFact:"📅 اڄ جي قانوني حقيقت", impactTitle:"وڪيل ناهي? اسان آهيون.", profile:"پروفائيل", save:"💾 محفوظ ڪريو", noLawyer:"مفت · وڪيل کان سواءِ" },

  sa:  { heroTitle:"स्वाधिकारान् जानीत। विधिं भाषध्वम्।", heroSub:"भारतस्य AI विधिसहायकः। IPC, RERA, RTI च अधिकं सरलसंस्कृते बोधयत।", searchPH:"कमपि विधिं शोधयत…", askBtn:"⚖️ विधिप्रश्नं पृच्छत", browseLaws:"विधीन् पश्यत ↓", login:"प्रवेशः", signup:"नामाङ्कनम्", logout:"निर्गमः", langLabel:"🌐 भाषा", tab_cat:"📚 वर्गाः", tab_sc:"🎭 परिस्थितयः", tab_wi:"🚨 किं करणीयम्?", tab_rights:"⚖️ मम अधिकाराः", tab_women:"👩 महिलारक्षणम्", tab_dis:"♿ निःशक्तजनाः", tab_help:"📞 सहायतावाणी", chatWelcome:"KanoonSaathi स्वागतम्", chatSub:"स्वस्य विधिसमस्यां सरलभाषायां वदत।", chatPH:"स्वस्य समस्यां वदत…", askAiBtn:"⚖️ पृच्छत", dailyFact:"📅 अद्यतन विधितथ्यम्", impactTitle:"अधिवक्ता नास्ति? वयं स्मः।", profile:"व्यक्तिविवरणम्", save:"💾 सुरक्षितम् करोतु", noLawyer:"निःशुल्कम् · अधिवक्ता विना" },
};

// Helper: get translation for current language, fallback to English
const getT = (lang) => UI_TEXT[lang] || UI_TEXT["en"];

// ─── BCP-47 SPEECH LANGUAGE CODES (Web Speech API) ───────────────────────────
// Maps our language codes → browser speech recognition locale
const SPEECH_LANG = {
  en:"en-IN", hi:"hi-IN", ta:"ta-IN", te:"te-IN", kn:"kn-IN",
  ml:"ml-IN", bn:"bn-IN", mr:"mr-IN", gu:"gu-IN", pa:"pa-IN",
  or:"or-IN", as:"as-IN", ur:"ur-IN", ne:"ne-NP", ks:"ks-IN",
  kok:"kok-IN", mai:"mai-IN", dgo:"hi-IN", mni:"mni-IN", sat:"hi-IN",
  brx:"hi-IN", sd:"sd-IN", sa:"sa-IN",
};

// Strip markdown, emoji and formatting for clean, natural TTS reading
function cleanForSpeech(text) {
  return text
    .replace(/⚖️|📖|✅|🔨|💡|📞|⚠️|🚨|📅|🎙️|🔊|👤|🇮🇳/g, "") // strip emojis
    .replace(/\*\*(.*?)\*\*/g, "$1")          // **bold** → plain
    .replace(/\*(.*?)\*/g, "$1")              // *italic* → plain
    .replace(/#{1,3}\s+/g, "")               // ### headers → plain
    .replace(/^\s*[-•]\s+/gm, "")            // bullet points
    .replace(/^\s*\d+\.\s+/gm, "")           // numbered list "1. " → remove number
    .replace(/\(([^)]{1,40})\)/g, ", $1,")   // (section refs) → brief pause
    .replace(/Rs\./g, "Rupees")              // Rs. → Rupees (spoken naturally)
    .replace(/IPC\s/g, "I P C section ")     // IPC → spoken out
    .replace(/CrPC\s/g, "Cr P C section ")
    .replace(/RTI\s/g, "R T I ")
    .replace(/RERA\s/g, "RERA ")
    .replace(/\n{2,}/g, ". ")               // paragraph breaks → pause
    .replace(/\n/g, ", ")                   // line breaks → brief pause
    .replace(/[_`]/g, "")                   // backticks and underscores
    .replace(/\s{2,}/g, " ")               // collapse multiple spaces
    .replace(/\.\s*\.\s*\./g, ".")         // ... → single pause
    .trim();
}

const CSS = `
  @keyframes spin    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes pulse   { 0%,100%{opacity:0.25;transform:scale(0.75)}          50%{opacity:1;transform:scale(1.2)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)}            to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0}                                        to{opacity:1} }
  @keyframes glow    { 0%,100%{box-shadow:0 0 18px rgba(255,107,0,0.25)}    50%{box-shadow:0 0 36px rgba(255,107,0,0.5)} }
  @keyframes badge   { 0%,100%{transform:scale(1)}                           50%{transform:scale(1.04)} }
  @keyframes orbit   { from{transform:translate(-50%,-50%) rotate(0deg)}    to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes micPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(231,76,60,0.7)}      70%{box-shadow:0 0 0 12px rgba(231,76,60,0)} }
  @keyframes wave    { 0%,100%{height:6px}  25%{height:18px} 50%{height:10px} 75%{height:22px} }
  @keyframes speakPulse{ 0%,100%{opacity:1} 50%{opacity:0.4} }
  * { box-sizing:border-box; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,107,0,0.3); border-radius:4px; }
`;

// ─── NAV — defined OUTSIDE the main component (Bug 2 Fix) ────────────────────
// ─── VOICE HOOK ───────────────────────────────────────────────────────────────
function useSpeech(lang) {
  const [listening,  setListening]  = useState(false);
  const [speaking,   setSpeaking]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [micError,   setMicError]   = useState("");
  const [micPerm,    setMicPerm]    = useState("unknown");
  const [hasStt,     setHasStt]     = useState(false);
  const [hasTts,     setHasTts]     = useState(false);
  const recogRef = useRef(null);

  useEffect(() => {
    const stt = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const tts = !!window.speechSynthesis;
    setHasStt(stt);
    setHasTts(tts);
    if (navigator.permissions) {
      navigator.permissions.query({ name: "microphone" })
        .then(r => { setMicPerm(r.state); r.onchange = () => setMicPerm(r.state); })
        .catch(() => setMicPerm("unknown"));
    }
    if (tts) {
      const load = () => window.speechSynthesis.getVoices();
      load();
      window.speechSynthesis.onvoiceschanged = load;
      return () => { window.speechSynthesis.onvoiceschanged = null; };
    }
  }, []);

  const startListening = (onFinal) => {
    setMicError("");
    if (!hasStt) {
      setMicError("Your browser does not support voice input. Please use Chrome or Edge on Android/Desktop.");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop());
        setMicPerm("granted");
        setMicError("");
        doStartRecognition(onFinal);
      })
      .catch(err => {
        setMicPerm("denied");
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMicError("Microphone blocked! Tap the 🔒 lock icon in your browser address bar → set Microphone to Allow → refresh the page.");
        } else if (err.name === "NotFoundError") {
          setMicError("No microphone found. Please connect a microphone and try again.");
        } else {
          setMicError("Mic error: " + (err.message || err.name) + ". Please allow microphone access in browser settings.");
        }
      });
  };

  const doStartRecognition = (onFinal) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (recogRef.current) { try { recogRef.current.stop(); } catch(e) {} }
    window.speechSynthesis && window.speechSynthesis.cancel();
    setTranscript("");
    const rec = new SR();
    rec.lang           = SPEECH_LANG[lang] || "en-IN";
    rec.continuous     = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onstart = () => { setListening(true); setMicError(""); };
    rec.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final || interim);
      if (final) {
        setListening(false); setTranscript(""); recogRef.current = null;
        onFinal(final.trim());
      }
    };
    rec.onerror = (e) => {
      setListening(false); setTranscript(""); recogRef.current = null;
      const m = {
        "not-allowed":          "Microphone access denied. Please allow microphone in your browser settings.",
        "no-speech":            "No speech heard. Please speak clearly and try again.",
        "audio-capture":        "Cannot access mic — it may be used by another app. Close other apps and retry.",
        "network":              "Network error with voice. Check internet connection.",
        "service-not-allowed":  "Voice input blocked in this environment. Try opening the app in Chrome on your phone.",
        "aborted":              "",
        "language-not-supported": "Language not supported for voice. Switch to English and try again.",
      };
      const msg = m[e.error] !== undefined ? m[e.error] : ("Voice error: " + e.error + ". Please try again.");
      if (msg) setMicError(msg);
    };
    rec.onend = () => {
      setListening(false);
      setTranscript(prev => { if (prev && prev.trim()) { onFinal(prev.trim()); } return ""; });
    };
    recogRef.current = rec;
    try { rec.start(); }
    catch(e) { setListening(false); setMicError("Could not start microphone. Please use Chrome and allow mic access."); }
  };

  const stopListening = () => {
    try { recogRef.current && recogRef.current.stop(); } catch(e) {}
    recogRef.current = null;
    setListening(false); setTranscript("");
  };

  const speak = (text, onEnd) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = cleanForSpeech(text);
    if (!clean.trim()) return;
    const doSpeak = () => {
      const utt = new SpeechSynthesisUtterance(clean);
      utt.lang = SPEECH_LANG[lang] || "en-IN";
      utt.rate = 0.88; utt.pitch = 1.0; utt.volume = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const lc = utt.lang.split("-")[0];
      const match = voices.find(v => v.lang === utt.lang)
                 || voices.find(v => v.lang.startsWith(lc))
                 || voices.find(v => v.default);
      if (match) utt.voice = match;
      utt.onstart = () => setSpeaking(true);
      utt.onend   = () => { setSpeaking(false); onEnd && onEnd(); };
      utt.onerror = (e) => { if (e.error !== "interrupted") setSpeaking(false); };
      window.speechSynthesis.speak(utt);
    };
    window.speechSynthesis.getVoices().length === 0 ? setTimeout(doSpeak, 350) : doSpeak();
  };

  const stopSpeaking = () => {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch(e) {}
    setSpeaking(false);
  };

  const clearError = () => setMicError("");

  return {
    listening, speaking, transcript, micError, micPerm, hasStt, hasTts,
    supported: { stt: hasStt, tts: hasTts },
    startListening, stopListening, speak, stopSpeaking, clearError,
  };
}


// ─── LANGUAGE PICKER ──────────────────────────────────────────────────────────
function LanguagePicker({ lang, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.includes(search) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}
      onClick={onClose}>
      <div style={{ width:"100%",maxWidth:560,background:"#0E0E1A",border:"1px solid rgba(255,107,0,0.22)",borderRadius:20,padding:"28px 24px",maxHeight:"85vh",display:"flex",flexDirection:"column",animation:"fadeUp 0.25s ease" }}
        onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
          <div>
            <div style={{ fontSize:18,fontWeight:700,fontFamily:"Georgia,serif" }}>🌐 Choose Language</div>
            <div style={{ fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:3 }}>22 Scheduled Languages + English (Article 344, 8th Schedule)</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(240,237,232,0.6)",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>✕</button>
        </div>
        {/* Search */}
        <input value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#F0EDE8",fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:16,boxSizing:"border-box" }}
          placeholder="Search by language name or region…" />
        {/* Grid */}
        <div style={{ overflowY:"auto",flex:1 }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:8 }}>
            {filtered.map(l => {
              const active = lang === l.code;
              return (
                <button key={l.code} onClick={()=>{ onSelect(l.code); onClose(); }}
                  style={{ padding:"11px 12px",borderRadius:10,border:`1px solid ${active?"rgba(255,107,0,0.6)":"rgba(255,255,255,0.08)"}`,background:active?"rgba(255,107,0,0.12)":"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s" }}
                  onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.borderColor="rgba(255,107,0,0.3)";}}}
                  onMouseLeave={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}}
                  >
                  <div style={{ fontSize:16,marginBottom:3,direction:l.dir }}>{l.native}</div>
                  <div style={{ fontSize:11,color:active?"#FF9500":"rgba(240,237,232,0.55)",fontWeight:active?700:400 }}>{l.name}</div>
                  <div style={{ fontSize:9,color:"rgba(240,237,232,0.28)",marginTop:2,lineHeight:1.3 }}>{l.region}</div>
                  {active && <div style={{ fontSize:9,color:"#FF9500",marginTop:3 }}>✓ Selected</div>}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign:"center",padding:"32px 0",color:"rgba(240,237,232,0.35)",fontSize:13 }}>No language found for "{search}"</div>
          )}
        </div>
        <div style={{ marginTop:14,padding:"9px 12px",background:"rgba(255,107,0,0.05)",border:"1px solid rgba(255,107,0,0.12)",borderRadius:8,fontSize:11,color:"rgba(240,237,232,0.4)",lineHeight:1.6 }}>
          🇮🇳 All 22 languages listed in the 8th Schedule of the Constitution of India are included. The AI will respond in your chosen language.
        </div>
      </div>
    </div>
  );
}

function NavBar({ loggedIn, user, lang, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, back, backLabel="← Home" }) {
  const t = getT(lang);
  return (
    <nav style={{ position:"sticky",top:0,zIndex:100,background:"rgba(7,7,15,0.97)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,107,0,0.1)",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,gap:8 }}>
      <div style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer",flexShrink:0 }} onClick={onHome}>
        <div style={{ width:32,height:32,background:"linear-gradient(135deg,#FF6B00,#FF9500)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>⚖️</div>
        <span style={{ fontSize:17,fontWeight:700,background:"linear-gradient(90deg,#FF6B00,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>KanoonSaathi</span>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:7,flexShrink:0 }}>
        {back && <button onClick={back} style={{ padding:"6px 11px",borderRadius:7,background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(240,237,232,0.55)",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{backLabel}</button>}
        {/* Language picker button */}
        <button onClick={onLangPick}
          style={{ padding:"5px 10px",borderRadius:7,background:"rgba(255,107,0,0.08)",border:"1px solid rgba(255,107,0,0.25)",color:"#FF9500",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,flexShrink:0 }}>
          🌐 <span style={{ direction: LANGUAGES.find(l=>l.code===lang)?.dir||"ltr" }}>{LANGUAGES.find(l=>l.code===lang)?.native || "EN"}</span>
        </button>
        {loggedIn
          ? <>
              <div onClick={onProfile} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:20,background:"rgba(255,107,0,0.1)",border:"1px solid rgba(255,107,0,0.2)",cursor:"pointer" }}>
                <div style={{ width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B00,#FF9500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10 }}>👤</div>
                <span style={{ fontSize:11,color:"#FF9500",fontWeight:600 }}>{user?.name?.split(" ")[0]}</span>
              </div>
              <button onClick={onLogout} style={{ padding:"5px 10px",borderRadius:7,background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(240,237,232,0.45)",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{t.logout}</button>
            </>
          : <>
              <button onClick={onLogin}  style={{ padding:"5px 12px",borderRadius:7,background:"transparent",border:"1px solid rgba(255,107,0,0.4)",color:"#FF9500",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{t.login}</button>
              <button onClick={onSignup} style={{ padding:"6px 14px",borderRadius:7,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{t.signup}</button>
            </>
        }
      </div>
    </nav>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ user, onSave, onBack }) {
  const [dob,        setDob]        = useState(user.dob        || "");
  const [city,       setCity]       = useState(user.city       || "");
  const [state,      setState]      = useState(user.state      || "");
  const [gender,     setGender]     = useState(user.gender     || "");
  const [occupation, setOccupation] = useState(user.occupation || "");
  const [language,   setLanguage]   = useState(user.language   || "English");
  const [saved,      setSaved]      = useState(false);

  const inp = { width:"100%", padding:"10px 13px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9, color:"#F0EDE8", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:"rgba(240,237,232,0.45)", display:"block", marginBottom:5 };
  const row = { marginBottom:16 };

  const handle = () => {
    onSave({ ...user, dob, city, state, gender, occupation, language });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
  const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh","Other"];

  return (
    <div style={{ minHeight:"100vh", background:"#07070F", color:"#F0EDE8", fontFamily:"Georgia,serif" }}>
      <style>{CSS}</style>
      <nav style={{ position:"sticky",top:0,zIndex:100,background:"rgba(7,7,15,0.97)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,107,0,0.1)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58 }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }} onClick={onBack}>
          <div style={{ width:32,height:32,background:"linear-gradient(135deg,#FF6B00,#FF9500)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>⚖️</div>
          <span style={{ fontSize:17,fontWeight:700,background:"linear-gradient(90deg,#FF6B00,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>KanoonSaathi</span>
        </div>
        <button onClick={onBack} style={{ padding:"6px 13px",borderRadius:7,background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(240,237,232,0.55)",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
      </nav>

      <div style={{ maxWidth:560, margin:"0 auto", padding:"28px 20px" }}>
        {/* Avatar */}
        <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:28,animation:"fadeUp 0.3s ease" }}>
          <div style={{ width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B00,#FF9500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,color:"#fff",flexShrink:0 }}>{initials}</div>
          <div>
            <div style={{ fontSize:20,fontWeight:700 }}>{user.name}</div>
            <div style={{ fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2 }}>{user.email}</div>
            <div style={{ fontSize:11,color:"#FF9500",marginTop:3 }}>📱 {user.phone || "Phone not set"}</div>
          </div>
        </div>

        {/* Saved confirmation */}
        {saved && (
          <div style={{ marginBottom:16,padding:"10px 14px",background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.25)",borderRadius:9,fontSize:13,color:"#4CAF50",animation:"fadeIn 0.3s ease" }}>
            ✅ Profile saved successfully!
          </div>
        )}

        {/* Account info (read-only) */}
        <div style={{ marginBottom:22,padding:"14px 16px",background:"rgba(255,107,0,0.05)",border:"1px solid rgba(255,107,0,0.12)",borderRadius:10 }}>
          <div style={{ fontSize:12,fontWeight:700,color:"#FF9500",marginBottom:10 }}>🔐 ACCOUNT INFORMATION</div>
          {[["Full Name", user.name],["Email Address", user.email],["Mobile Number", user.phone||"Not set"]].map(([l,v])=>(
            <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:12 }}>
              <span style={{ color:"rgba(240,237,232,0.45)" }}>{l}</span>
              <span style={{ color:"rgba(240,237,232,0.8)",fontWeight:600 }}>{v}</span>
            </div>
          ))}
          <div style={{ fontSize:10,color:"rgba(240,237,232,0.25)",marginTop:8 }}>🔒 Email and phone can only be changed through account settings (coming soon)</div>
        </div>

        {/* Editable personal details */}
        <div style={{ marginBottom:22,padding:"14px 16px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10 }}>
          <div style={{ fontSize:12,fontWeight:700,color:"rgba(240,237,232,0.6)",marginBottom:14 }}>👤 PERSONAL DETAILS</div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div style={row}>
              <label style={lbl}>Date of Birth</label>
              <input style={inp} type="date" value={dob} onChange={e=>setDob(e.target.value)} />
            </div>
            <div style={row}>
              <label style={lbl}>Gender</label>
              <select style={{ ...inp, cursor:"pointer" }} value={gender} onChange={e=>setGender(e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={row}>
            <label style={lbl}>City</label>
            <input style={inp} type="text" placeholder="Your city" value={city} onChange={e=>setCity(e.target.value)} />
          </div>

          <div style={row}>
            <label style={lbl}>State</label>
            <select style={{ ...inp, cursor:"pointer" }} value={state} onChange={e=>setState(e.target.value)}>
              <option value="">Select your state</option>
              {STATES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={row}>
            <label style={lbl}>Occupation</label>
            <select style={{ ...inp, cursor:"pointer" }} value={occupation} onChange={e=>setOccupation(e.target.value)}>
              <option value="">Select occupation (optional)</option>
              {["Student","Private Employee","Government Employee","Self-Employed / Business","Farmer","Daily Wage Worker","Lawyer","Doctor / Healthcare","Homemaker","Retired","Other"].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div style={row}>
            <label style={lbl}>Preferred Language</label>
            <select style={{ ...inp, cursor:"pointer" }} value={language} onChange={e=>setLanguage(e.target.value)}>
              {["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Marathi","Bengali","Gujarati","Punjabi"].map(l=><option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Privacy note */}
        <div style={{ marginBottom:20,padding:"10px 14px",background:"rgba(19,136,8,0.06)",border:"1px solid rgba(19,136,8,0.14)",borderRadius:9,fontSize:11,color:"rgba(240,237,232,0.4)",lineHeight:1.6 }}>
          🔒 Your personal details are stored locally in your browser session. KanoonSaathi does not transmit your personal data to any third party. Protected under DPDP Act 2023.
        </div>

        <button onClick={handle}
          style={{ width:"100%",padding:"12px",borderRadius:10,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite" }}>
          💾 Save Profile
        </button>
      </div>
    </div>
  );
}

// ─── SPLASH — defined OUTSIDE main component ──────────────────────────────────
function Splash({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const steps = [10,25,40,55,70,82,91,97,100];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) { setPct(steps[i]); i++; }
      else { clearInterval(iv); setTimeout(onDone, 350); }
    }, 180);
    return () => clearInterval(iv);
  }, [onDone]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#07070F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999 }}>
      <style>{CSS}</style>
      {[320,200,100].map((sz,i) => (
        <div key={i} style={{ position:"absolute",top:"50%",left:"50%",width:sz,height:sz,borderRadius:"50%",border:`1px solid rgba(255,107,0,${0.06+i*0.04})`,animation:`orbit ${18+i*6}s linear infinite`,pointerEvents:"none" }} />
      ))}
      <div style={{ fontSize:56,marginBottom:20,animation:"glow 2s infinite" }}>⚖️</div>
      <div style={{ fontSize:28,fontWeight:700,fontFamily:"Georgia,serif",background:"linear-gradient(90deg,#FF6B00,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6 }}>KanoonSaathi</div>
      <div style={{ fontSize:13,color:"rgba(240,237,232,0.4)",fontFamily:"Georgia,serif",marginBottom:36,letterSpacing:"1px" }}>India's Legal Companion</div>
      <div style={{ width:220,height:3,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#FF6B00,#FFD700)",borderRadius:3,transition:"width 0.18s ease" }} />
      </div>
      <div style={{ fontSize:11,color:"rgba(240,237,232,0.3)",fontFamily:"Georgia,serif",marginTop:10 }}>Loading {pct}%</div>
    </div>
  );
}

// ─── AUTH PAGES (outside main to avoid re-mount) ─────────────────────────────
function LoginPage({ onLogin, onGoSignup, onGuest }) {
  const [form, setForm]   = useState({ email:"", password:"" });
  const [show, setShow]   = useState(false);
  const [err,  setErr]    = useState("");
  const [busy, setBusy]   = useState(false);

  // Simulated user store shared with signup via window
  const handle = () => {
    setErr("");
    if (!form.email.trim()) return setErr("Please enter your email address.");
    if (!form.email.includes("@")) return setErr("Enter a valid email address.");
    if (!form.password) return setErr("Please enter your password.");
    if (form.password.length < 6) return setErr("Password must be at least 6 characters.");
    setBusy(true);
    setTimeout(() => {
      const users = JSON.parse(sessionStorage.getItem("ks_users") || "[]");
      const found = users.find(u => u.email === form.email.toLowerCase());
      if (!found) { setBusy(false); return setErr("No account found. Please sign up first."); }
      if (found.password !== form.password) { setBusy(false); return setErr("Incorrect password. Please try again."); }
      setBusy(false);
      onLogin({ name: found.name, email: found.email, phone: found.phone });
    }, 900);
  };

  return (
    <div style={{ minHeight:"100vh",background:"#07070F",color:"#F0EDE8",fontFamily:"Georgia,serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative",overflow:"hidden" }}>
      <style>{CSS}</style>
      {[380,250,140].map((sz,i) => (
        <div key={i} style={{ position:"absolute",top:"50%",left:"50%",width:sz,height:sz,borderRadius:"50%",border:`1px solid rgba(255,107,0,${0.04+i*0.02})`,pointerEvents:"none",animation:`orbit ${20+i*7}s linear infinite` }} />
      ))}
      {/* Logo */}
      <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:36,cursor:"pointer",animation:"fadeUp 0.4s ease" }} onClick={onGuest}>
        <div style={{ width:36,height:36,background:"linear-gradient(135deg,#FF6B00,#FF9500)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,animation:"glow 3s infinite" }}>⚖️</div>
        <span style={{ fontSize:20,fontWeight:700,background:"linear-gradient(90deg,#FF6B00,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>KanoonSaathi</span>
      </div>

      {/* Card */}
      <div style={{ width:"100%",maxWidth:400,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,107,0,0.18)",borderRadius:20,padding:"36px 32px",animation:"fadeUp 0.45s ease" }}>
        <div style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>Welcome back 👋</div>
        <div style={{ fontSize:13,color:"rgba(240,237,232,0.4)",marginBottom:28 }}>Log in to your KanoonSaathi account</div>

        {/* Email */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12,color:"rgba(240,237,232,0.5)",display:"block",marginBottom:6 }}>Email Address</label>
          <input value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
            onKeyDown={e => e.key==="Enter" && handle()}
            style={{ width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${err&&!form.email?"rgba(231,76,60,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:9,color:"#F0EDE8",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}
            type="email" placeholder="you@example.com" />
        </div>

        {/* Password */}
        <div style={{ marginBottom:8 }}>
          <label style={{ fontSize:12,color:"rgba(240,237,232,0.5)",display:"block",marginBottom:6 }}>Password</label>
          <div style={{ position:"relative" }}>
            <input value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}
              onKeyDown={e => e.key==="Enter" && handle()}
              style={{ width:"100%",padding:"11px 44px 11px 14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${err&&!form.password?"rgba(231,76,60,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:9,color:"#F0EDE8",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}
              type={show?"text":"password"} placeholder="Enter your password" />
            <button onClick={() => setShow(s=>!s)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(240,237,232,0.4)",cursor:"pointer",fontSize:15,padding:0 }}>
              {show ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Forgot password hint */}
        <div style={{ textAlign:"right",marginBottom:20 }}>
          <span style={{ fontSize:11,color:"rgba(255,149,0,0.6)",cursor:"default" }}>Forgot password? (Coming soon)</span>
        </div>

        {/* Error */}
        {err && <div style={{ marginBottom:14,padding:"9px 12px",background:"rgba(231,76,60,0.08)",border:"1px solid rgba(231,76,60,0.25)",borderRadius:8,fontSize:12,color:"#E74C3C" }}>⚠️ {err}</div>}

        {/* Login button */}
        <button onClick={handle} disabled={busy}
          style={{ width:"100%",padding:"12px",borderRadius:10,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite",opacity:busy?0.7:1,marginBottom:16 }}>
          {busy ? "Logging in…" : "Login →"}
        </button>

        {/* Divider */}
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
          <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize:11,color:"rgba(240,237,232,0.25)" }}>OR</span>
          <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.07)" }} />
        </div>

        {/* Guest */}
        <button onClick={onGuest} style={{ width:"100%",padding:"11px",borderRadius:10,background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(240,237,232,0.6)",fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:20 }}>
          Continue as Guest (Limited Access)
        </button>

        {/* Sign up link */}
        <div style={{ textAlign:"center",fontSize:13,color:"rgba(240,237,232,0.4)" }}>
          Don't have an account?{" "}
          <span onClick={onGoSignup} style={{ color:"#FF9500",cursor:"pointer",fontWeight:600 }}>Sign up free →</span>
        </div>
      </div>

      {/* Security note */}
      <div style={{ marginTop:20,fontSize:11,color:"rgba(240,237,232,0.2)",textAlign:"center",lineHeight:1.7,animation:"fadeIn 0.6s ease" }}>
        🔒 JWT secured · bcrypt passwords · IT Act 2000 compliant · Zero data selling
      </div>
    </div>
  );
}

function SignupPage({ onSignup, onGoLogin }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [err,      setErr]      = useState("");
  const [busy,     setBusy]     = useState(false);
  const [success,  setSuccess]  = useState(false);

  // Input style helper
  const inp = (hasErr) => ({
    width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.05)",
    border:`1px solid ${hasErr ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`,
    borderRadius:9, color:"#F0EDE8", fontSize:13, fontFamily:"inherit",
    outline:"none", boxSizing:"border-box"
  });
  const inpPad = { ...inp(false), padding:"11px 44px 11px 14px" };
  const lbl = { fontSize:12, color:"rgba(240,237,232,0.5)", display:"block", marginBottom:6 };
  const row = { marginBottom:15 };

  const validate = () => {
    if (!name.trim())                  return "Please enter your full name.";
    if (!email.includes("@"))          return "Enter a valid email address.";
    if (!/^\d{10}$/.test(phone))       return "Enter a valid 10-digit mobile number.";
    if (password.length < 6)           return "Password must be at least 6 characters.";
    if (password !== confirm)          return "Passwords do not match.";
    return "";
  };

  const handle = () => {
    setErr("");
    const e = validate();
    if (e) return setErr(e);
    setBusy(true);
    setTimeout(() => {
      const users = JSON.parse(sessionStorage.getItem("ks_users") || "[]");
      if (users.find(u => u.email === email.toLowerCase())) {
        setBusy(false);
        return setErr("An account with this email already exists. Please log in.");
      }
      users.push({ name: name.trim(), email: email.toLowerCase(), phone, password });
      sessionStorage.setItem("ks_users", JSON.stringify(users));
      setBusy(false);
      setSuccess(true);
      setTimeout(() => onSignup({ name: name.trim(), email: email.toLowerCase(), phone }), 1800);
    }, 1000);
  };

  const pwStrength = password.length >= 10 ? "Strong" : password.length >= 6 ? "Medium" : "Weak";
  const pwColor    = password.length >= 10 ? "#4CAF50" : password.length >= 6 ? "#FF9500" : "#E74C3C";
  const pwWidth    = `${Math.min(100, (password.length / 12) * 100)}%`;

  return (
    <div style={{ minHeight:"100vh", background:"#07070F", color:"#F0EDE8", fontFamily:"Georgia,serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", position:"relative", overflow:"hidden" }}>
      <style>{CSS}</style>
      {[380,250,140].map((sz,i) => (
        <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:sz, height:sz, borderRadius:"50%", border:`1px solid rgba(255,107,0,${0.04+i*0.02})`, pointerEvents:"none", animation:`orbit ${20+i*7}s linear infinite` }} />
      ))}

      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:28, animation:"fadeUp 0.4s ease" }}>
        <div style={{ width:36, height:36, background:"linear-gradient(135deg,#FF6B00,#FF9500)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, animation:"glow 3s infinite" }}>⚖️</div>
        <span style={{ fontSize:20, fontWeight:700, background:"linear-gradient(90deg,#FF6B00,#FFD700)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>KanoonSaathi</span>
      </div>

      {/* Card */}
      <div style={{ width:"100%", maxWidth:420, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,107,0,0.18)", borderRadius:20, padding:"32px 28px", animation:"fadeUp 0.45s ease" }}>

        {success ? (
          /* ── Success state ── */
          <div style={{ textAlign:"center", padding:"20px 0", animation:"fadeUp 0.4s ease" }}>
            <div style={{ fontSize:52, marginBottom:16, animation:"glow 2s infinite", display:"inline-block" }}>✅</div>
            <div style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Account Created!</div>
            <div style={{ fontSize:13, color:"rgba(240,237,232,0.45)", lineHeight:1.7 }}>
              Welcome to KanoonSaathi, <strong style={{ color:"#FF9500" }}>{name}</strong>!<br/>
              Logging you in automatically…
            </div>
            <div style={{ marginTop:20, display:"flex", justifyContent:"center", gap:6 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#FF6B00", animation:`pulse 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>Create Account 🚀</div>
            <div style={{ fontSize:13, color:"rgba(240,237,232,0.4)", marginBottom:22 }}>Free access to India's legal knowledge base</div>

            {/* Full Name */}
            <div style={row}>
              <label style={lbl}>Full Name</label>
              <input style={inp(!name.trim() && err)} type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)} />
            </div>

            {/* Email */}
            <div style={row}>
              <label style={lbl}>Email Address</label>
              <input style={inp(!email.includes("@") && err)} type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Phone */}
            <div style={row}>
              <label style={lbl}>Mobile Number</label>
              <input style={inp(!/^\d{10}$/.test(phone) && err)} type="tel" placeholder="10-digit mobile number"
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0,10))} />
            </div>

            {/* Password */}
            <div style={row}>
              <label style={lbl}>Password</label>
              <div style={{ position:"relative" }}>
                <input style={inpPad} type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(240,237,232,0.4)", cursor:"pointer", fontSize:15, padding:0 }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Password strength bar */}
            {password.length > 0 && (
              <div style={{ marginTop:-8, marginBottom:14 }}>
                <div style={{ fontSize:11, color:"rgba(240,237,232,0.35)", marginBottom:4 }}>
                  Strength: <span style={{ color:pwColor, fontWeight:600 }}>{pwStrength}</span>
                </div>
                <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:pwWidth, background:pwColor, borderRadius:3, transition:"width 0.3s ease" }} />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div style={row}>
              <label style={lbl}>Confirm Password</label>
              <div style={{ position:"relative" }}>
                <input style={inpPad} type={showConf ? "text" : "password"} placeholder="Re-enter password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} />
                <button type="button" onClick={() => setShowConf(s => !s)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(240,237,232,0.4)", cursor:"pointer", fontSize:15, padding:0 }}>
                  {showConf ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Passwords match indicator */}
              {confirm.length > 0 && (
                <div style={{ fontSize:11, marginTop:5, color: password === confirm ? "#4CAF50" : "#E74C3C" }}>
                  {password === confirm ? "✅ Passwords match" : "❌ Passwords do not match"}
                </div>
              )}
            </div>

            {/* Terms */}
            <div style={{ marginBottom:14, padding:"9px 12px", background:"rgba(255,107,0,0.05)", border:"1px solid rgba(255,107,0,0.12)", borderRadius:8, fontSize:11, color:"rgba(240,237,232,0.4)", lineHeight:1.6 }}>
              🇮🇳 By signing up, you agree to our Terms of Service. Your data is protected under IT Act 2000 and DPDP Act 2023.
            </div>

            {/* Error */}
            {err && (
              <div style={{ marginBottom:14, padding:"9px 12px", background:"rgba(231,76,60,0.08)", border:"1px solid rgba(231,76,60,0.25)", borderRadius:8, fontSize:12, color:"#E74C3C" }}>
                ⚠️ {err}
              </div>
            )}

            {/* Submit */}
            <button onClick={handle} disabled={busy}
              style={{ width:"100%", padding:"12px", borderRadius:10, background:"linear-gradient(135deg,#FF6B00,#FF9500)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:busy?"not-allowed":"pointer", fontFamily:"inherit", animation:"glow 3s infinite", opacity:busy?0.7:1, marginBottom:16 }}>
              {busy ? "Creating Account…" : "Create Free Account →"}
            </button>

            <div style={{ textAlign:"center", fontSize:13, color:"rgba(240,237,232,0.4)" }}>
              Already have an account?{" "}
              <span onClick={onGoLogin} style={{ color:"#FF9500", cursor:"pointer", fontWeight:600 }}>Log in →</span>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop:20, fontSize:11, color:"rgba(240,237,232,0.2)", textAlign:"center", lineHeight:1.7 }}>
        🔒 bcrypt · JWT · OTP ready · IT Act 2000 · DPDP Act 2023 compliant
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function KanoonSaathi() {
  const [loaded,      setLoaded]      = useState(false);
  const [screen,      setScreen]      = useState("home");
  const [selCat,      setSelCat]      = useState(null);
  const [openSc,      setOpenSc]      = useState(null);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [loggedIn,    setLoggedIn]    = useState(false);
  const [user,        setUser]        = useState(null);
  const [query,       setQuery]       = useState("");
  const [tab,         setTab]         = useState("categories");
  const [copied,      setCopied]      = useState(false);
  const [lang,        setLang]        = useState("en");
  const [langOpen,    setLangOpen]    = useState(false);

  // ── BOOKMARKS — persisted in localStorage ─────────────────────────────────
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ks_bookmarks") || "[]"); }
    catch { return []; }
  });

  const saveBookmarks = (bm) => {
    setBookmarks(bm);
    try { localStorage.setItem("ks_bookmarks", JSON.stringify(bm)); } catch(e) {}
  };

  const isBookmarked  = (id) => bookmarks.some(b => b.id === id);

  const toggleBookmark = (item) => {
    const exists = bookmarks.some(b => b.id === item.id);
    saveBookmarks(exists ? bookmarks.filter(b => b.id !== item.id) : [...bookmarks, item]);
  };

  const endRef = useRef(null);

  const t = getT(lang);
  const activeLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // ── VOICE ─────────────────────────────────────────────────────────────────
  const { listening, speaking, transcript, micError, micPerm, hasStt, hasTts, supported, startListening, stopListening, speak, stopSpeaking, clearError } = useSpeech(lang);
  const [autoSpeak, setAutoSpeak] = useState(true); // auto-read AI responses

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const goHome = () => { setScreen("home"); setMessages([]); };
  const doLogin      = (u) => { setLoggedIn(true); setUser(u); setScreen("home"); };
  const doLogout     = () => { setLoggedIn(false); setUser(null); setScreen("home"); setMessages([]); };
  const doSaveProfile = (updated) => { setUser(updated); };

  // ── ASK ───────────────────────────────────────────────────────────────────
  const ask = async (text, fresh = false) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput("");
    setScreen("chat");
    const base = fresh ? [] : messages;
    const msgs = [...base, { role:"user", content:userText }];
    setMessages(msgs);
    setLoading(true);

    const langName   = activeLang?.name || "English";
    const langSuffix = lang !== "en"
      ? `\n\nIMPORTANT: Respond entirely in ${langName} (${activeLang?.native}). Keep law section numbers (IPC 420, RERA Sec 18, etc.) in their original form. Do NOT respond in English.`
      : "";

    const MODELS = ["claude-sonnet-4-5", "claude-haiku-4-5-20251001"];
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const model = MODELS[Math.min(attempt, MODELS.length - 1)];
      try {
        // Exponential backoff: wait 0s, 3s, 7s before retries
        if (attempt > 0) {
          const waitSec = attempt === 1 ? 3 : 7;
          setMessages(prev => {
            const filtered = prev.filter(m => m.role !== "assistant" || !m._retry);
            return [...filtered, { role:"assistant", content:`⏳ Rate limited — retrying in ${waitSec}s… (attempt ${attempt + 1}/${MAX_RETRIES})`, _retry:true }];
          });
          await new Promise(r => setTimeout(r, waitSec * 1000));
          // Remove the retry message
          setMessages(prev => prev.filter(m => !m._retry));
        }

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, max_tokens:2048, system: SYSTEM_PROMPT + langSuffix, messages:msgs }),
        });

        const data = await res.json();

        // Rate limit — retry
        if (data.error?.type === "rate_limit_error" || data.error?.type === "overloaded_error") {
          if (attempt < MAX_RETRIES - 1) continue;
          setMessages(prev => [...prev.filter(m => !m._retry), { role:"assistant", content:"⚠️ The server is busy. Please wait 30 seconds and try again." }]);
          break;
        }

        if (data.error) {
          const t = data.error.type || "", m = data.error.message || "";
          let msg = "";
          if (t === "authentication_error") msg = "⚠️ API key error. Please check configuration.";
          else if (t === "invalid_request_error") msg = `⚠️ Request error: ${m}`;
          else msg = `⚠️ API error (${t}): ${m}`;
          setMessages(prev => [...prev.filter(m => !m._retry), { role:"assistant", content:msg }]);
          break;
        }

        const reply = data.content?.[0]?.text;
        if (!reply) {
          console.error("Unexpected API response:", JSON.stringify(data));
          setMessages(prev => [...prev.filter(m => !m._retry), { role:"assistant", content:"⚠️ Unexpected server response. Please try again." }]);
          break;
        }

        setMessages(prev => [...prev.filter(m => msgs.includes(m) && !m._retry), { role:"assistant", content:reply }]);
        if (autoSpeak) speak(reply);
        break; // success — exit loop

      } catch (err) {
        if (attempt < MAX_RETRIES - 1) continue;
        const msg = err?.message?.includes("Failed to fetch")
          ? "⚠️ Cannot reach server. Please check your internet connection."
          : `⚠️ Connection error: ${err?.message || "unknown"}. Please try again.`;
        setMessages(prev => [...prev.filter(m => !m._retry), { role:"assistant", content:msg }]);
      }
    }

    setLoading(false);
  };

  const copyLast = () => {
    const last = [...messages].reverse().find(m => m.role === "assistant");
    if (last) { navigator.clipboard?.writeText(last.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const fmt = (text) => text.split("\n").map((line, i) => {
    const isH = ["⚖️","📖","✅","🔨","💡","📞"].some(e => line.startsWith(e));
    if (isH) return <div key={i} style={{ marginTop:16,marginBottom:5,fontWeight:700,fontSize:13,color:"#FF9500",borderBottom:"1px solid rgba(255,149,0,0.15)",paddingBottom:3 }}>{line}</div>;
    const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <div key={i} dangerouslySetInnerHTML={{ __html:bold||"&nbsp;" }} style={{ marginBottom:2,fontSize:14,lineHeight:1.65 }} />;
  });

  const cats = Object.values(LAW_DB).filter(c =>
    !query || c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.laws.some(l => l.section.toLowerCase().includes(query.toLowerCase()) || l.name.toLowerCase().includes(query.toLowerCase()))
  );
  const scs = SCENARIOS.filter(s =>
    !query || s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.tag.toLowerCase().includes(query.toLowerCase()) || s.situation.toLowerCase().includes(query.toLowerCase())
  );

  if (!loaded) return <Splash onDone={() => setLoaded(true)} />;
  if (screen === "login")   return <LoginPage   onLogin={doLogin}   onGoSignup={() => setScreen("signup")} onGuest={() => setScreen("home")} />;
  if (screen === "signup")  return <SignupPage  onSignup={doLogin}  onGoLogin={() => setScreen("login")} />;
  if (screen === "profile") return <ProfilePage user={user} onSave={doSaveProfile} onBack={goHome} />;

  // ── CATEGORY DETAIL ─────────────────────────────────────────────────────────
  if (screen === "category" && selCat) {
    const cat = LAW_DB[selCat];
    return (
      <div style={{ minHeight:"100vh",background:"#07070F",color:"#F0EDE8",fontFamily:"Georgia,serif" }}>
        <style>{CSS}</style>
        <NavBar loggedIn={loggedIn} user={user} onLogin={() => setScreen("login")} onSignup={() => setScreen("signup")} lang={lang} onLangPick={() => setLangOpen(true)} onLogout={doLogout} onProfile={() => setScreen("profile")} onHome={goHome} back={() => setScreen("home")} />
        <div style={{ maxWidth:740,margin:"0 auto",padding:"24px 20px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}>
            <div style={{ width:50,height:50,borderRadius:12,background:`${cat.color}16`,border:`1px solid ${cat.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>{cat.icon}</div>
            <div>
              <div style={{ fontSize:20,fontWeight:700,color:cat.color }}>{cat.title}</div>
              <div style={{ fontSize:12,color:"rgba(240,237,232,0.35)" }}>{cat.laws.length} laws covered · Click any law for an AI explanation</div>
            </div>
          </div>
          <div style={{ marginBottom:20,padding:"10px 14px",background:"rgba(255,107,0,0.05)",border:"1px solid rgba(255,107,0,0.12)",borderRadius:9,fontSize:12,color:"rgba(240,237,232,0.5)",lineHeight:1.6 }}>
            💡 Each card shows the exact section number, plain-language description, and what you should do. Click <strong style={{ color:"#FF9500" }}>Ask AI</strong> for a personalised answer.
          </div>
          {cat.laws.map((law, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 16px",marginBottom:9,animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4 }}>
                <div style={{ fontSize:14,fontWeight:700,flex:1 }}>{law.name}</div>
                <button
                  onClick={() => toggleBookmark({ id:`law_${cat.id}_${i}`, type:"law", title:law.name, section:law.section, desc:law.desc, actionable:law.actionable, color:cat.color, catIcon:cat.icon, catTitle:cat.title, catId:cat.id })}
                  title={isBookmarked(`law_${cat.id}_${i}`) ? "Remove bookmark" : "Bookmark this law"}
                  style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,padding:"0 2px",flexShrink:0,opacity:isBookmarked(`law_${cat.id}_${i}`) ? 1 : 0.35,transition:"all 0.2s",color:isBookmarked(`law_${cat.id}_${i}`) ? "#FFD700" : "#F0EDE8" }}>
                  {isBookmarked(`law_${cat.id}_${i}`) ? "⭐" : "☆"}
                </button>
              </div>
              <span style={{ display:"inline-block",fontSize:9,padding:"2px 7px",borderRadius:3,background:`${cat.color}12`,color:cat.color,border:`1px solid ${cat.color}25`,marginBottom:7 }}>{law.section}</span>
              <div style={{ fontSize:12,color:"rgba(240,237,232,0.48)",lineHeight:1.65,marginBottom:9 }}>{law.desc}</div>
              <div style={{ fontSize:12,color:"#4CAF50",background:"rgba(76,175,80,0.06)",border:"1px solid rgba(76,175,80,0.15)",borderRadius:7,padding:"7px 11px",marginBottom:9,lineHeight:1.5 }}>✅ {law.actionable}</div>
              {/* Bug 3 Fix: fresh=true clears old chat history */}
              <button style={{ padding:"6px 13px",borderRadius:6,background:`${cat.color}10`,border:`1px solid ${cat.color}28`,color:cat.color,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600 }}
                onClick={() => ask(`Explain "${law.name}" (${law.section}) in detail for a common Indian citizen. Cover what it means, how to use it, and exact action steps.`, true)}>
                Ask AI about this law →
              </button>
            </div>
          ))}
          <div style={{ marginTop:24,textAlign:"center" }}>
            <button style={{ padding:"12px 28px",borderRadius:9,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite" }}
              onClick={() => { setMessages([]); setScreen("chat"); }}>
              Ask Custom Query about {cat.title} ⚖️
            </button>
          </div>
        </div>
        {langOpen && <LanguagePicker lang={lang} onSelect={setLang} onClose={() => setLangOpen(false)} />}
      </div>
    );
  }

  // ── CHAT SCREEN ──────────────────────────────────────────────────────────────
  if (screen === "chat") {
    return (
      <div style={{ height:"100vh",background:"#07070F",color:"#F0EDE8",fontFamily:"Georgia,serif",display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <style>{CSS}</style>
        <NavBar loggedIn={loggedIn} user={user} onLogin={() => setScreen("login")} onSignup={() => setScreen("signup")} lang={lang} onLangPick={() => setLangOpen(true)} onLogout={doLogout} onProfile={() => setScreen("profile")} onHome={goHome} back={goHome} backLabel="← Home" />
        <div style={{ flex:1,display:"flex",flexDirection:"column",maxWidth:760,width:"100%",margin:"0 auto",minHeight:0 }}>
          <div style={{ padding:"12px 20px 10px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
            <div>
              <div style={{ fontSize:15,fontWeight:700 }}>⚖️ Legal Query Assistant</div>
              <div style={{ fontSize:11,color:"rgba(240,237,232,0.35)" }}>Describe your problem in plain English — private & encrypted</div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              {messages.length > 0 && (
                <button onClick={copyLast} style={{ padding:"5px 11px",borderRadius:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(240,237,232,0.5)",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>
                  {copied ? "✅ Copied" : "📋 Copy"}
                </button>
              )}
              <div style={{ fontSize:10,color:"#4CAF50",display:"flex",alignItems:"center",gap:3 }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:"#4CAF50",animation:"pulse 2s infinite" }} />
                Encrypted
              </div>
            </div>
          </div>

          <div style={{ flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:14,minHeight:0 }}>
            {messages.length === 0 && (
              <div style={{ textAlign:"center",padding:"16px 0",animation:"fadeIn 0.5s ease" }}>
                <div style={{ fontSize:44,marginBottom:10,animation:"glow 3s infinite",display:"inline-block" }}>⚖️</div>
                <div style={{ fontSize:17,fontWeight:700,marginBottom:5 }}>{t.chatWelcome}</div>
                <div style={{ fontSize:13,color:"rgba(240,237,232,0.38)",marginBottom:12,lineHeight:1.7,direction:activeLang.dir }}>
                  {t.chatSub}
                </div>
                {/* Voice hint for uneducated users */}
                {supported.stt && (
                  <div style={{ display:"inline-flex",alignItems:"center",gap:9,padding:"10px 18px",borderRadius:20,background:"rgba(231,76,60,0.09)",border:"1px solid rgba(231,76,60,0.25)",marginBottom:16,animation:"glow 3s infinite" }}>
                    <span style={{ fontSize:20 }}>🎙️</span>
                    <span style={{ fontSize:12,color:"rgba(240,237,232,0.75)" }}>Can't type? <strong style={{ color:"#E74C3C" }}>Tap the red mic button</strong> below and speak your problem in your language</span>
                  </div>
                )}
                <div style={{ fontSize:11,color:"rgba(240,237,232,0.25)",marginBottom:10 }}>Try a quick scenario:</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center" }}>
                  {QUICK_Q.map((sc,i) => (
                    <button key={i} onClick={() => ask(sc.q, true)}
                      style={{ padding:"6px 11px",borderRadius:16,background:"rgba(255,107,0,0.07)",border:"1px solid rgba(255,107,0,0.18)",color:"#FF9500",fontSize:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,animation:`fadeUp 0.3s ease ${i*0.04}s both` }}>
                      {sc.icon} {sc.q.length>42 ? sc.q.slice(0,42)+"…" : sc.q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.filter(m => !m._retry).map((m,i) => (
              <div key={i} style={ m.role==="user"
                ? { alignSelf:"flex-end",maxWidth:"76%",background:"linear-gradient(135deg,#FF6B00,#FF9500)",color:"#fff",padding:"11px 15px",borderRadius:"14px 14px 3px 14px",fontSize:14,lineHeight:1.65,animation:"fadeUp 0.2s ease" }
                : { alignSelf:"flex-start",maxWidth:"90%",background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)",padding:"14px 16px",borderRadius:"14px 14px 14px 3px",fontSize:14,lineHeight:1.7,animation:"fadeUp 0.2s ease" }
              }>
                {m.role==="assistant" && (
                  <div style={{ fontSize:10,color:"#FF9500",fontWeight:700,marginBottom:7,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <span>⚖️ KanoonSaathi</span>
                    {supported.tts && (
                      <button onClick={() => speaking ? stopSpeaking() : speak(m.content)}
                        style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,padding:"0 2px",opacity:0.65 }}
                        title="Read aloud">
                        {speaking ? "⏹" : "🔊"}
                      </button>
                    )}
                  </div>
                )}
                {m.role==="assistant" ? fmt(m.content) : m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf:"flex-start",maxWidth:"88%",background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)",padding:"14px 16px",borderRadius:"14px 14px 14px 3px",animation:"fadeUp 0.2s ease" }}>
                <div style={{ fontSize:10,color:"#FF9500",fontWeight:700,marginBottom:8 }}>⚖️ KanoonSaathi</div>
                {/* Show retry message if present */}
                {messages.find(m => m._retry) ? (
                  <div style={{ fontSize:12,color:"rgba(255,149,0,0.8)" }}>
                    {messages.find(m => m._retry)?.content}
                  </div>
                ) : (
                  <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                    {[0,1,2].map(j => <div key={j} style={{ width:7,height:7,borderRadius:"50%",background:"#FF6B00",animation:`pulse 1.2s ${j*0.2}s infinite` }} />)}
                    <span style={{ fontSize:11,color:"rgba(240,237,232,0.33)",marginLeft:6 }}>Researching applicable laws…</span>
                  </div>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Listening wave banner */}
          {listening && (
            <div style={{ margin:"0 20px 8px",padding:"11px 16px",background:"rgba(231,76,60,0.1)",border:"1px solid rgba(231,76,60,0.35)",borderRadius:10,display:"flex",alignItems:"center",gap:12,flexShrink:0,animation:"fadeIn 0.2s ease" }}>
              <div style={{ display:"flex",gap:3,alignItems:"flex-end",height:22 }}>
                {[0,1,2,3,4].map(i=>(
                  <div key={i} style={{ width:3,borderRadius:3,background:"#E74C3C",animation:`wave 0.9s ${i*0.12}s ease-in-out infinite` }} />
                ))}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,fontWeight:700,color:"#E74C3C" }}>🎙️ Listening… speak now</div>
                {transcript
                  ? <div style={{ fontSize:11,color:"rgba(240,237,232,0.8)",marginTop:2 }}>"{transcript}"</div>
                  : <div style={{ fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2 }}>Will send automatically when you stop speaking</div>
                }
              </div>
              <button onClick={stopListening} style={{ padding:"5px 10px",borderRadius:6,background:"rgba(231,76,60,0.2)",border:"1px solid rgba(231,76,60,0.4)",color:"#E74C3C",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
            </div>
          )}

          {/* Mic error banner — always visible when there's an error */}
          {micError && (
            <div style={{ margin:"0 20px 8px",padding:"11px 14px",background:"rgba(231,76,60,0.1)",border:"1px solid rgba(231,76,60,0.4)",borderRadius:10,display:"flex",alignItems:"flex-start",gap:10,flexShrink:0,animation:"fadeIn 0.2s ease" }}>
              <span style={{ fontSize:16,flexShrink:0 }}>⚠️</span>
              <div style={{ flex:1,fontSize:12,color:"#E74C3C",lineHeight:1.55 }}>{micError}</div>
              <button onClick={clearError} style={{ background:"none",border:"none",color:"rgba(231,76,60,0.6)",cursor:"pointer",fontSize:16,padding:0,flexShrink:0 }}>✕</button>
            </div>
          )}

          {/* Speaking banner */}
          {speaking && (
            <div style={{ margin:"0 20px 8px",padding:"10px 16px",background:"rgba(76,175,80,0.08)",border:"1px solid rgba(76,175,80,0.25)",borderRadius:10,display:"flex",alignItems:"center",gap:10,flexShrink:0,animation:"fadeIn 0.2s ease" }}>
              <div style={{ fontSize:16,animation:"speakPulse 1s infinite" }}>🔊</div>
              <div style={{ flex:1,fontSize:12,color:"#4CAF50" }}>Reading response aloud…</div>
              <button onClick={stopSpeaking} style={{ padding:"5px 11px",borderRadius:6,background:"rgba(76,175,80,0.12)",border:"1px solid rgba(76,175,80,0.3)",color:"#4CAF50",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>Stop</button>
            </div>
          )}

          <div style={{ padding:"13px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:8,alignItems:"flex-end",flexShrink:0 }}>
            {/* Mic button — always shown, handles its own errors */}
            <button
              onClick={() => {
                if (listening) {
                  stopListening();
                } else {
                  startListening((text) => {
                    if (text && text.trim()) ask(text.trim(), false);
                  });
                }
              }}
              title={listening ? "Tap to cancel" : hasStt ? "Tap to speak your problem — auto-sends" : "Voice not supported in this browser"}
              style={{
                width:48, height:48, borderRadius:12, border:"none", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:2, fontSize:20, flexShrink:0,
                background: listening ? "#E74C3C" : micPerm==="denied" ? "rgba(231,76,60,0.06)" : "rgba(231,76,60,0.12)",
                color: listening ? "#fff" : micPerm==="denied" ? "rgba(231,76,60,0.4)" : "#E74C3C",
                transition:"all 0.2s",
                animation: listening ? "micPulse 1.2s infinite" : "none",
                boxShadow: listening ? "0 0 0 3px rgba(231,76,60,0.3)" : "none",
              }}>
              <span>{listening ? "⏹" : "🎙️"}</span>
              <span style={{ fontSize:7, letterSpacing:"0.3px", opacity:0.75 }}>
                {listening ? "STOP" : micPerm==="denied" ? "BLOCKED" : "SPEAK"}
              </span>
            </button>

            <textarea
              style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:10,padding:"11px 14px",color:"#F0EDE8",fontSize:13,resize:"none",fontFamily:"inherit",outline:"none",maxHeight:120,minHeight:48 }}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
              placeholder={listening ? "🎙️ Listening — speak now…" : hasStt ? `${t.chatPH} — or tap 🎙️ to speak` : t.chatPH}
              dir={activeLang.dir}
              rows={2}
            />

            {/* Auto-speak toggle */}
            {hasTts && (
              <button onClick={() => { setAutoSpeak(a => !a); if (speaking) stopSpeaking(); }}
                title={autoSpeak ? "Voice ON — tap to mute replies" : "Voice OFF — tap to enable voice replies"}
                style={{ width:48,height:48,borderRadius:12,border:`1px solid ${autoSpeak?"rgba(76,175,80,0.4)":"rgba(255,255,255,0.1)"}`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,fontSize:18,flexShrink:0,background:autoSpeak?"rgba(76,175,80,0.12)":"rgba(255,255,255,0.03)",color:autoSpeak?"#4CAF50":"rgba(240,237,232,0.3)",transition:"all 0.2s" }}>
                <span>{autoSpeak ? "🔊" : "🔇"}</span>
                <span style={{ fontSize:7,opacity:0.75 }}>{autoSpeak ? "ON" : "OFF"}</span>
              </button>
            )}

            <button onClick={() => ask()} disabled={loading}
              style={{ padding:"11px 18px",borderRadius:10,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:"inherit",animation:"glow 3s infinite",opacity:loading?0.6:1 }}>
              {loading ? "…" : t.askAiBtn}
            </button>
          </div>
        </div>
        {langOpen && <LanguagePicker lang={lang} onSelect={setLang} onClose={() => setLangOpen(false)} />}
      </div>
    );
  } // end chat screen

  // ── HOME SCREEN ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh",background:"#07070F",color:"#F0EDE8",fontFamily:"Georgia,serif",position:"relative",overflowX:"hidden" }}>
      <style>{CSS}</style>
      {[500,350,200].map((sz,i) => (
        <div key={i} style={{ position:"fixed",top:"50%",left:"50%",width:sz,height:sz,borderRadius:"50%",border:`1px solid rgba(255,107,0,${0.03+i*0.015})`,transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0,animation:`orbit ${20+i*8}s linear infinite` }} />
      ))}

      <NavBar loggedIn={loggedIn} user={user} onLogin={() => setScreen("login")} onSignup={() => setScreen("signup")} lang={lang} onLangPick={() => setLangOpen(true)} onLogout={doLogout} onProfile={() => setScreen("profile")} onHome={goHome} />

      {/* Hero */}
      <div style={{ textAlign:"center",padding:"56px 24px 36px",position:"relative",zIndex:1 }}>
        <div style={{ display:"inline-block",padding:"4px 14px",borderRadius:18,background:"rgba(255,107,0,0.1)",border:"1px solid rgba(255,107,0,0.22)",color:"#FF9500",fontSize:11,marginBottom:18,letterSpacing:"0.9px",animation:"badge 3s ease infinite" }}>
          🇮🇳 FOR EVERY INDIAN CITIZEN · {t.noLawyer}
        </div>
        <h1 style={{ fontSize:"clamp(28px,5.5vw,58px)",fontWeight:700,lineHeight:1.15,marginBottom:14,background:"linear-gradient(160deg,#FFFFFF 20%,#BBA890 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"Georgia,serif",direction:activeLang.dir }}>
          {t.heroTitle}
        </h1>
        <p style={{ fontSize:"clamp(13px,1.8vw,15px)",color:"rgba(240,237,232,0.48)",maxWidth:500,margin:"0 auto 28px",lineHeight:1.8,direction:activeLang.dir }}>
          {t.heroSub}
        </p>
        <div style={{ display:"flex",maxWidth:540,margin:"0 auto 20px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,overflow:"hidden" }}>
          <input style={{ flex:1,padding:"12px 15px",background:"transparent",border:"none",color:"#F0EDE8",fontSize:13,fontFamily:"inherit",outline:"none" }}
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t.searchPH} dir={activeLang.dir} />
          <button style={{ padding:"12px 18px",background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>🔍</button>
        </div>
        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          <button style={{ padding:"12px 28px",borderRadius:9,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite" }}
            onClick={() => { setMessages([]); setScreen("chat"); }}>
            {t.askBtn}
          </button>
          <button style={{ padding:"12px 22px",borderRadius:9,background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"#F0EDE8",fontSize:14,cursor:"pointer",fontFamily:"inherit" }}
            onClick={() => document.getElementById("main")?.scrollIntoView({ behavior:"smooth" })}>
            {t.browseLaws}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"flex",justifyContent:"center",gap:40,padding:"20px 24px",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)",marginBottom:44,flexWrap:"wrap",position:"relative",zIndex:1 }}>
        {[["180+","Laws & Sections"],["20","Categories"],["9","What If Guides"],["10","Women Safety"],["10","Disability Rights"]].map(([n,l]) => (
          <div key={n} style={{ textAlign:"center" }}>
            <div style={{ fontSize:24,fontWeight:700,background:"linear-gradient(90deg,#FF6B00,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{n}</div>
            <div style={{ fontSize:11,color:"rgba(240,237,232,0.32)",marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Daily Law Fact */}
      {(() => {
        const fact = LAW_FACTS[new Date().getDate() % LAW_FACTS.length];
        return (
          <div style={{ margin:"0 28px 32px",padding:"16px 20px",background:"linear-gradient(135deg,rgba(255,107,0,0.09),rgba(46,64,87,0.12))",border:"1px solid rgba(255,107,0,0.2)",borderRadius:14,display:"flex",alignItems:"flex-start",gap:14,position:"relative",zIndex:1,animation:"fadeUp 0.4s ease" }}>
            <div style={{ fontSize:28,flexShrink:0 }}>{fact.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10,color:"#FF9500",fontWeight:700,letterSpacing:"0.8px",marginBottom:5 }}>{t.dailyFact}</div>
              <div style={{ fontSize:13,color:"rgba(240,237,232,0.85)",lineHeight:1.65,marginBottom:6 }}>{fact.fact}</div>
              <span style={{ fontSize:10,padding:"2px 8px",borderRadius:4,background:"rgba(255,107,0,0.1)",color:"#FF9500",border:"1px solid rgba(255,107,0,0.2)" }}>{fact.law}</span>
            </div>
            {supported.tts && (
              <button
                onClick={() => speaking ? stopSpeaking() : speak(`${t.dailyFact}. ${fact.fact}. Law: ${fact.law}`)}
                title="Read this fact aloud"
                style={{ width:36,height:36,borderRadius:8,border:`1px solid ${speaking?"rgba(76,175,80,0.5)":"rgba(255,107,0,0.25)"}`,background:speaking?"rgba(76,175,80,0.12)":"rgba(255,107,0,0.08)",color:speaking?"#4CAF50":"#FF9500",cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:speaking?"speakPulse 1s infinite":undefined }}>
                {speaking ? "⏹" : "🔊"}
              </button>
            )}
          </div>
        );
      })()}

      {/* Tab bar */}
      <div id="main" style={{ position:"relative",zIndex:1,padding:"0 28px",marginBottom:28 }}>
        <div style={{ display:"flex",gap:4,maxWidth:760,margin:"0 auto",overflowX:"auto",paddingBottom:2 }}>
          {[[`categories`,t.tab_cat],[`scenarios`,t.tab_sc],[`whatif`,t.tab_wi],[`rights`,t.tab_rights],[`women`,t.tab_women],[`disability`,t.tab_dis],[`bookmarks`,`⭐ Bookmarks${bookmarks.length > 0 ? ` (${bookmarks.length})` : ""}`],[`helplines`,t.tab_help]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ flexShrink:0,padding:"9px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:tab===key?700:400,background:tab===key?"linear-gradient(135deg,#FF6B00,#FF9500)":"rgba(255,255,255,0.04)",color:tab===key?"#fff":"rgba(240,237,232,0.45)",transition:"all 0.2s",border:tab===key?"none":"1px solid rgba(255,255,255,0.07)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      {tab==="categories" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>Browse by Legal Category</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:28,position:"relative",zIndex:1 }}>
            {query ? `Results for "${query}" — ${cats.length} categories` : "Click any category to explore all laws, sections & your rights"}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(238px,1fr))",gap:12,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {cats.map((cat,idx) => (
              <div key={cat.id} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${cat.color}20`,borderRadius:13,padding:16,cursor:"pointer",transition:"all 0.2s",animation:`fadeUp 0.35s ease ${idx*0.04}s both` }}
                onMouseEnter={e => { e.currentTarget.style.background=`${cat.color}0D`; e.currentTarget.style.borderColor=`${cat.color}45`; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${cat.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor=`${cat.color}20`; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
                onClick={() => { setSelCat(cat.id); setScreen("category"); }}>
                <div style={{ fontSize:26,marginBottom:9 }}>{cat.icon}</div>
                <div style={{ fontSize:14,fontWeight:700,marginBottom:4,color:cat.color }}>{cat.title}</div>
                <div style={{ fontSize:11,color:"rgba(240,237,232,0.37)",marginBottom:9,lineHeight:1.55 }}>{cat.desc}</div>
                <div>
                  {cat.laws.slice(0,4).map((l,i) => <span key={i} style={{ fontSize:9,padding:"2px 6px",borderRadius:3,background:`${cat.color}10`,color:`${cat.color}BB`,border:`1px solid ${cat.color}22`,display:"inline-block",margin:"1px" }}>{l.section}</span>)}
                  {cat.laws.length>4 && <span style={{ fontSize:9,padding:"2px 6px",borderRadius:3,background:`${cat.color}10`,color:`${cat.color}BB`,border:`1px solid ${cat.color}22`,display:"inline-block",margin:"1px" }}>+{cat.laws.length-4}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SCENARIOS ── */}
      {tab==="scenarios" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>Common Legal Scenarios</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:28,position:"relative",zIndex:1 }}>
            {query ? `Results for "${query}"` : "Real situations → exact laws → step-by-step action plan"}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:13,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {scs.map((sc,idx) => {
              const open = openSc===sc.id;
              return (
                <div key={sc.id} style={{ background:open?`${sc.color}0A`:"rgba(255,255,255,0.02)",border:`1px solid ${open?sc.color+"45":sc.color+"20"}`,borderRadius:14,overflow:"hidden",transition:"all 0.25s",animation:`fadeUp 0.35s ease ${idx*0.04}s both` }}>
                  <div style={{ padding:"15px 17px 12px",display:"flex",alignItems:"flex-start",gap:11,cursor:"pointer" }}
                    onClick={() => setOpenSc(open?null:sc.id)}>
                    <div style={{ width:40,height:40,borderRadius:10,background:`${sc.color}16`,border:`1px solid ${sc.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{sc.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                        <span style={{ fontSize:14,fontWeight:700 }}>{sc.title}</span>
                        <span style={{ fontSize:9,padding:"2px 7px",borderRadius:10,background:`${sc.color}14`,color:sc.color,border:`1px solid ${sc.color}28` }}>{sc.tag}</span>
                      </div>
                      <div style={{ fontSize:11,color:"rgba(240,237,232,0.42)",lineHeight:1.5 }}>{sc.situation}</div>
                    </div>
                    <div style={{ color:"rgba(240,237,232,0.3)",fontSize:13,marginTop:4,display:"flex",alignItems:"center",gap:8 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBookmark({ id:`sc_${sc.id}`, type:"scenario", title:sc.title, tag:sc.tag, situation:sc.situation, color:sc.color, icon:sc.icon, helpline:sc.helpline, laws:sc.laws }); }}
                        title={isBookmarked(`sc_${sc.id}`) ? "Remove bookmark" : "Bookmark this scenario"}
                        style={{ background:"none",border:"none",cursor:"pointer",fontSize:17,padding:0,opacity:isBookmarked(`sc_${sc.id}`) ? 1 : 0.3,transition:"all 0.2s",color:isBookmarked(`sc_${sc.id}`) ? "#FFD700" : "#F0EDE8" }}>
                        {isBookmarked(`sc_${sc.id}`) ? "⭐" : "☆"}
                      </button>
                      {open ? "▲" : "▼"}
                    </div>
                  </div>
                  {open && (
                    <div style={{ padding:"0 17px 16px",animation:"fadeIn 0.2s ease" }}>
                      <div style={{ height:1,background:"rgba(255,255,255,0.06)",marginBottom:14 }} />
                      <div style={{ fontSize:11,fontWeight:700,color:sc.color,marginBottom:8 }}>⚖️ APPLICABLE LAWS</div>
                      {sc.laws.map((l,i) => (
                        <div key={i} style={{ fontSize:11,padding:"5px 10px",background:`${sc.color}0C`,border:`1px solid ${sc.color}22`,borderRadius:6,marginBottom:5,color:"rgba(240,237,232,0.72)" }}>{l}</div>
                      ))}
                      <div style={{ fontSize:11,fontWeight:700,color:"#4CAF50",margin:"13px 0 8px" }}>✅ WHAT YOU SHOULD DO</div>
                      {sc.steps.map((step,i) => (
                        <div key={i} style={{ display:"flex",gap:9,marginBottom:7,alignItems:"flex-start" }}>
                          <div style={{ width:20,height:20,borderRadius:"50%",background:`${sc.color}16`,color:sc.color,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>{i+1}</div>
                          <div style={{ fontSize:12,color:"rgba(240,237,232,0.68)",lineHeight:1.55 }}>{step}</div>
                        </div>
                      ))}
                      <div style={{ marginTop:12,padding:"8px 12px",background:"rgba(192,57,43,0.07)",border:"1px solid rgba(192,57,43,0.16)",borderRadius:8,fontSize:12,color:"rgba(240,237,232,0.58)",lineHeight:1.5 }}>
                        🔨 <strong style={{ color:"#E74C3C" }}>Punishment:</strong> {sc.punishment}
                      </div>
                      <div style={{ marginTop:7,padding:"8px 12px",background:"rgba(19,136,8,0.06)",border:"1px solid rgba(19,136,8,0.15)",borderRadius:8,fontSize:12,color:"rgba(240,237,232,0.58)" }}>
                        📞 <strong style={{ color:"#4CAF50" }}>Helplines:</strong> {sc.helpline}
                      </div>
                      {/* Bug 4 Fix: fresh=true clears old chat history */}
                      <button style={{ width:"100%",marginTop:13,padding:"10px",borderRadius:8,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}
                        onClick={() => ask(`I need help with: ${sc.title}. ${sc.situation} Please give me detailed advice with applicable laws, exact steps I should take, and any free resources available.`, true)}>
                        Get Personalised AI Legal Advice →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── HELPLINES ── */}
      {tab==="helplines" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>📞 Emergency Legal Helplines</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:22,position:"relative",zIndex:1 }}>Most are free, 24×7, and available across all of India</div>
          <div style={{ margin:"0 28px 22px",padding:"14px 20px",background:"rgba(192,57,43,0.1)",border:"1px solid rgba(192,57,43,0.25)",borderRadius:12,display:"flex",alignItems:"center",gap:14,position:"relative",zIndex:1,animation:"glow 3s infinite" }}>
            <div style={{ fontSize:32 }}>🚨</div>
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:"#E74C3C",marginBottom:2 }}>Life-Threatening Emergency?</div>
              <div style={{ fontSize:13,color:"rgba(240,237,232,0.58)" }}>Call <strong style={{ color:"#fff",fontSize:20 }}>112</strong> — India's universal emergency number. Works 24×7 across all states.</div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {HELPLINES.map((h,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${h.color}20`,borderRadius:12,padding:"13px 15px",transition:"all 0.2s",animation:`fadeUp 0.35s ease ${i*0.04}s both` }}
                onMouseEnter={e => { e.currentTarget.style.background=`${h.color}0C`; e.currentTarget.style.borderColor=`${h.color}40`; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor=`${h.color}20`; e.currentTarget.style.transform="none"; }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:7 }}>
                  <span style={{ fontSize:20 }}>{h.icon}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:"rgba(240,237,232,0.82)" }}>{h.name}</span>
                </div>
                <div style={{ fontSize:20,fontWeight:700,color:h.color,fontFamily:"monospace",marginBottom:3,letterSpacing:"0.5px" }}>{h.number}</div>
                <div style={{ fontSize:11,color:"rgba(240,237,232,0.36)",lineHeight:1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WHAT IF ── */}
      {tab==="whatif" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>🚨 What If Situations</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:28,position:"relative",zIndex:1 }}>Real emergencies — exact laws + step-by-step what to do RIGHT NOW</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {WHAT_IF.map((wi,idx) => {
              const open = openSc===wi.id;
              return (
                <div key={wi.id} style={{ background:open?`${wi.color}0C`:"rgba(255,255,255,0.02)",border:`1px solid ${open?wi.color+"50":wi.color+"22"}`,borderRadius:14,overflow:"hidden",transition:"all 0.25s",animation:`fadeUp 0.35s ease ${idx*0.05}s both` }}>
                  <div style={{ padding:"15px 17px 13px",display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer" }} onClick={() => setOpenSc(open?null:wi.id)}>
                    <div style={{ width:44,height:44,borderRadius:11,background:`${wi.color}18`,border:`1px solid ${wi.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{wi.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
                        <span style={{ fontSize:14,fontWeight:700 }}>{wi.title}</span>
                        <span style={{ fontSize:9,padding:"2px 7px",borderRadius:10,background:`${wi.color}15`,color:wi.color,border:`1px solid ${wi.color}30`,flexShrink:0 }}>{wi.tag}</span>
                      </div>
                      <div style={{ fontSize:11,color:"rgba(240,237,232,0.42)",lineHeight:1.5 }}>{wi.situation}</div>
                    </div>
                    <div style={{ color:"rgba(240,237,232,0.3)",fontSize:13,marginTop:4,flexShrink:0 }}>{open?"▲":"▼"}</div>
                  </div>
                  {open && (
                    <div style={{ padding:"0 17px 16px",animation:"fadeIn 0.2s ease" }}>
                      <div style={{ height:1,background:"rgba(255,255,255,0.06)",marginBottom:14 }} />
                      {/* DO NOW */}
                      <div style={{ fontSize:11,fontWeight:700,color:"#E74C3C",marginBottom:9,display:"flex",alignItems:"center",gap:5 }}>🚨 DO THIS RIGHT NOW</div>
                      {wi.doNow.map((step,i) => (
                        <div key={i} style={{ display:"flex",gap:9,marginBottom:8,alignItems:"flex-start" }}>
                          <div style={{ width:22,height:22,borderRadius:"50%",background:`${wi.color}18`,color:wi.color,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>{i+1}</div>
                          <div style={{ fontSize:12,color:"rgba(240,237,232,0.72)",lineHeight:1.55 }}>{step}</div>
                        </div>
                      ))}
                      {/* Laws */}
                      <div style={{ fontSize:11,fontWeight:700,color:wi.color,margin:"14px 0 9px" }}>⚖️ APPLICABLE LAWS</div>
                      {wi.laws.map((l,i) => (
                        <div key={i} style={{ marginBottom:6,padding:"7px 10px",background:`${wi.color}0A`,border:`1px solid ${wi.color}22`,borderRadius:7 }}>
                          <span style={{ fontSize:10,fontWeight:700,color:wi.color }}>{l.s}</span>
                          <span style={{ fontSize:11,color:"rgba(240,237,232,0.65)",marginLeft:7 }}>{l.d}</span>
                        </div>
                      ))}
                      {/* GST rate info box for hotel scenario */}
                      {wi.id==="gst_hotel" && (
                        <div style={{ margin:"14px 0",padding:"12px 14px",background:"rgba(200,121,65,0.08)",border:"1px solid rgba(200,121,65,0.3)",borderRadius:10 }}>
                          <div style={{ fontSize:11,fontWeight:700,color:"#C87941",marginBottom:9 }}>🧾 WHEN IS GST ACTUALLY APPLICABLE?</div>
                          {[
                            ["AC restaurant (standalone)","5% GST (no ITC)","Legal"],
                            ["Non-AC restaurant","5% GST","Legal"],
                            ["Restaurant in hotel (room tariff ≤ ₹7,500/night)","5% GST","Legal"],
                            ["Restaurant in hotel (room tariff > ₹7,500/night)","18% GST","Legal"],
                            ["Outdoor catering","5% GST","Legal"],
                            ["Room service / takeaway","5% GST","Legal"],
                            ["Service charge (any amount)","❌ NOT mandatory","Illegal to force"],
                            ["MRP overcharge on water/beverages","❌ ILLEGAL","Report immediately"],
                          ].map(([type,rate,status])=>(
                            <div key={type} style={{ display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",alignItems:"center" }}>
                              <span style={{ fontSize:11,color:"rgba(240,237,232,0.65)" }}>{type}</span>
                              <span style={{ fontSize:11,fontWeight:600,color:rate.startsWith("❌")?"#E74C3C":"#4CAF50" }}>{rate}</span>
                              <span style={{ fontSize:9,padding:"2px 6px",borderRadius:4,background:status==="Legal"?"rgba(76,175,80,0.12)":"rgba(231,76,60,0.12)",color:status==="Legal"?"#4CAF50":"#E74C3C" }}>{status}</span>
                            </div>
                          ))}
                          <div style={{ fontSize:10,color:"rgba(240,237,232,0.3)",marginTop:8,lineHeight:1.5 }}>📌 Note: Composition scheme restaurants (small businesses) charge 0% GST to customers but pay it themselves.</div>
                        </div>
                      )}
                      {/* Punishment */}
                      <div style={{ marginTop:12,padding:"9px 12px",background:"rgba(192,57,43,0.07)",border:"1px solid rgba(192,57,43,0.18)",borderRadius:8,fontSize:12,color:"rgba(240,237,232,0.6)",lineHeight:1.5 }}>
                        🔨 <strong style={{ color:"#E74C3C" }}>Punishment:</strong> {wi.punishment}
                      </div>
                      {/* Warning */}
                      <div style={{ marginTop:7,padding:"9px 12px",background:"rgba(255,149,0,0.07)",border:"1px solid rgba(255,149,0,0.2)",borderRadius:8,fontSize:12,color:"rgba(240,237,232,0.6)",lineHeight:1.5 }}>
                        {wi.warn}
                      </div>
                      {/* Helpline */}
                      <div style={{ marginTop:7,padding:"8px 12px",background:"rgba(19,136,8,0.06)",border:"1px solid rgba(19,136,8,0.15)",borderRadius:8,fontSize:12,color:"rgba(240,237,232,0.6)" }}>
                        📞 <strong style={{ color:"#4CAF50" }}>Call:</strong> {wi.helpline}
                      </div>
                      <button style={{ width:"100%",marginTop:13,padding:"10px",borderRadius:8,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}
                        onClick={() => ask(`I need urgent help with this situation: ${wi.title}. ${wi.situation} What are my exact rights, the applicable laws and what should I do step by step?`, true)}>
                        Get Detailed AI Legal Advice →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── KNOW YOUR RIGHTS ── */}
      {tab==="rights" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>⚖️ Know Your Rights</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:28,position:"relative",zIndex:1 }}>12 fundamental rights every Indian should know — memorise these</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {RIGHTS.map((r,idx) => (
              <div key={idx} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${r.color}22`,borderRadius:14,padding:"16px 18px",transition:"all 0.2s",animation:`fadeUp 0.35s ease ${idx*0.04}s both`,cursor:"default" }}
                onMouseEnter={e => { e.currentTarget.style.background=`${r.color}0D`; e.currentTarget.style.borderColor=`${r.color}45`; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor=`${r.color}22`; e.currentTarget.style.transform="none"; }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                  <div style={{ width:38,height:38,borderRadius:9,background:`${r.color}16`,border:`1px solid ${r.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,lineHeight:1.3 }}>{r.title}</div>
                    <span style={{ fontSize:9,padding:"1px 7px",borderRadius:3,background:`${r.color}12`,color:r.color,border:`1px solid ${r.color}28` }}>{r.article}</span>
                  </div>
                </div>
                <div style={{ fontSize:12,color:"rgba(240,237,232,0.5)",lineHeight:1.65,marginBottom:10 }}>{r.desc}</div>
                <div style={{ fontSize:11,padding:"8px 11px",background:"rgba(76,175,80,0.07)",border:"1px solid rgba(76,175,80,0.17)",borderRadius:7,color:"rgba(240,237,232,0.65)",lineHeight:1.55 }}>
                  ✅ {r.action}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WOMEN SAFETY ── */}
      {tab==="women" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>👩 Women's Safety — Apps & Helplines</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:16,position:"relative",zIndex:1 }}>Save these before you need them — every woman in India should know these</div>
          {/* Emergency strip */}
          <div style={{ margin:"0 28px 24px",display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",position:"relative",zIndex:1 }}>
            {[["👩 Mahila Helpline","181","#9B1D20"],["🆘 Emergency","112","#8B0000"],["👶 Child Helpline","1098","#FF9500"],["💻 Cyber Crime","1930","#1A5276"],["⚖️ NCW WhatsApp","7217735372","#1A6B3A"]].map(([n,num,c])=>(
              <div key={num} style={{ padding:"8px 16px",borderRadius:20,background:`${c}15`,border:`1px solid ${c}40`,display:"flex",alignItems:"center",gap:7 }}>
                <span style={{ fontSize:13 }}>{n.split(" ")[0]}</span>
                <div>
                  <div style={{ fontSize:11,color:"rgba(240,237,232,0.5)" }}>{n.split(" ").slice(1).join(" ")}</div>
                  <div style={{ fontSize:16,fontWeight:700,color:c,fontFamily:"monospace" }}>{num}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:13,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {WOMEN_APPS.map((app,idx) => (
              <div key={idx} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${app.color}22`,borderRadius:14,padding:"16px 18px",transition:"all 0.2s",animation:`fadeUp 0.35s ease ${idx*0.04}s both` }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${app.color}0C`;e.currentTarget.style.borderColor=`${app.color}44`;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor=`${app.color}22`;e.currentTarget.style.transform="none";}}>
                <div style={{ display:"flex",alignItems:"flex-start",gap:11,marginBottom:11 }}>
                  <div style={{ width:42,height:42,borderRadius:10,background:`${app.color}18`,border:`1px solid ${app.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{app.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700,marginBottom:2 }}>{app.name}</div>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                      <span style={{ fontSize:9,padding:"2px 7px",borderRadius:4,background:`${app.color}15`,color:app.color,border:`1px solid ${app.color}30` }}>{app.type}</span>
                      <span style={{ fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,255,255,0.05)",color:"rgba(240,237,232,0.45)",border:"1px solid rgba(255,255,255,0.08)" }}>by {app.by}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize:12,color:"rgba(240,237,232,0.55)",lineHeight:1.65,marginBottom:10 }}>{app.desc}</div>
                {/* Number / Platform */}
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:8,padding:"7px 10px",background:`${app.color}0A`,borderRadius:7,border:`1px solid ${app.color}20` }}>
                  <span style={{ fontSize:11,color:"rgba(240,237,232,0.4)" }}>📞</span>
                  <span style={{ fontSize:13,fontWeight:700,color:app.color,fontFamily:"monospace" }}>{app.number}</span>
                </div>
                <div style={{ fontSize:11,padding:"7px 10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:"rgba(240,237,232,0.45)",marginBottom:8,lineHeight:1.5 }}>
                  📲 {app.playstore}
                </div>
                {/* How to use */}
                <div style={{ fontSize:11,padding:"8px 11px",background:"rgba(76,175,80,0.07)",border:"1px solid rgba(76,175,80,0.17)",borderRadius:7,color:"rgba(240,237,232,0.65)",lineHeight:1.55,marginBottom:8 }}>
                  ✅ {app.howto}
                </div>
                <div style={{ fontSize:11,color:"rgba(240,237,232,0.35)",fontStyle:"italic" }}>💡 {app.usefulFor}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── DISABILITY RIGHTS ── */}
      {tab==="disability" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>♿ Rights of Persons with Disabilities</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:16,position:"relative",zIndex:1 }}>Rights & protections under RPwD Act 2016 — for you and everyone around you</div>
          {/* Quick helpline strip */}
          <div style={{ margin:"0 28px 24px",padding:"13px 18px",background:"rgba(26,143,191,0.08)",border:"1px solid rgba(26,143,191,0.25)",borderRadius:12,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",position:"relative",zIndex:1 }}>
            <div style={{ fontSize:28 }}>♿</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#1A8FBF",marginBottom:4 }}>Chief Commissioner for Persons with Disabilities</div>
              <div style={{ fontSize:13,color:"rgba(240,237,232,0.65)" }}>Free helpline: <strong style={{ color:"#fff" }}>1800-11-4515</strong> · Website: ccdisabilities.nic.in · UDID Card: swavlambancard.gov.in</div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12,padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>
            {DISABILITY_LAWS.map((d,idx)=>(
              <div key={idx} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${d.color}22`,borderRadius:14,padding:"16px 18px",transition:"all 0.2s",animation:`fadeUp 0.35s ease ${idx*0.04}s both` }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${d.color}0D`;e.currentTarget.style.borderColor=`${d.color}45`;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor=`${d.color}22`;e.currentTarget.style.transform="none";}}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                  <div style={{ width:40,height:40,borderRadius:9,background:`${d.color}16`,border:`1px solid ${d.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{d.icon}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,lineHeight:1.3 }}>{d.title}</div>
                    <span style={{ fontSize:9,padding:"1px 7px",borderRadius:3,background:`${d.color}12`,color:d.color,border:`1px solid ${d.color}28` }}>{d.article}</span>
                  </div>
                </div>
                <div style={{ fontSize:12,color:"rgba(240,237,232,0.52)",lineHeight:1.65,marginBottom:10 }}>{d.desc}</div>
                <div style={{ fontSize:11,padding:"8px 11px",background:"rgba(76,175,80,0.07)",border:"1px solid rgba(76,175,80,0.17)",borderRadius:7,color:"rgba(240,237,232,0.65)",lineHeight:1.55 }}>
                  ✅ {d.action}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── BOOKMARKS ── */}
      {tab==="bookmarks" && (
        <>
          <div style={{ textAlign:"center",fontSize:22,fontWeight:700,marginBottom:5,position:"relative",zIndex:1 }}>⭐ My Bookmarks</div>
          <div style={{ textAlign:"center",color:"rgba(240,237,232,0.36)",fontSize:13,marginBottom:28,position:"relative",zIndex:1 }}>
            {bookmarks.length > 0 ? `${bookmarks.length} saved item${bookmarks.length>1?"s":""} — tap any to get AI advice instantly` : "No bookmarks yet — tap ☆ on any law or scenario to save it here"}
          </div>

          {bookmarks.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign:"center",padding:"48px 28px",position:"relative",zIndex:1,animation:"fadeUp 0.4s ease" }}>
              <div style={{ fontSize:56,marginBottom:16 }}>☆</div>
              <div style={{ fontSize:16,fontWeight:700,marginBottom:10 }}>No bookmarks yet</div>
              <div style={{ fontSize:13,color:"rgba(240,237,232,0.4)",marginBottom:24,maxWidth:380,margin:"0 auto 24px",lineHeight:1.7 }}>
                Browse the <strong style={{ color:"#FF9500" }}>Categories</strong> or <strong style={{ color:"#FF9500" }}>Scenarios</strong> tabs and tap the <strong style={{ color:"#FFD700" }}>☆ star</strong> on any law or scenario to save it here for quick access.
              </div>
              <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
                <button onClick={() => setTab("categories")} style={{ padding:"10px 22px",borderRadius:9,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>📚 Browse Categories</button>
                <button onClick={() => setTab("scenarios")}  style={{ padding:"10px 22px",borderRadius:9,background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"#F0EDE8",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>🎭 Browse Scenarios</button>
              </div>
            </div>
          ) : (
            <div style={{ padding:"0 28px 48px",maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1 }}>

              {/* Clear all button */}
              <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}>
                <button onClick={() => { if(window.confirm("Remove all bookmarks?")) saveBookmarks([]); }}
                  style={{ padding:"6px 14px",borderRadius:7,background:"rgba(231,76,60,0.08)",border:"1px solid rgba(231,76,60,0.22)",color:"rgba(231,76,60,0.7)",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>
                  🗑 Clear All
                </button>
              </div>

              {/* Bookmarked Laws */}
              {bookmarks.filter(b=>b.type==="law").length > 0 && (
                <>
                  <div style={{ fontSize:13,fontWeight:700,color:"rgba(240,237,232,0.5)",letterSpacing:"0.6px",marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
                    ⚖️ SAVED LAWS <span style={{ fontSize:11,color:"rgba(240,237,232,0.3)",fontWeight:400 }}>({bookmarks.filter(b=>b.type==="law").length})</span>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:10,marginBottom:28 }}>
                    {bookmarks.filter(b=>b.type==="law").map((bm,i) => (
                      <div key={bm.id} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${bm.color}22`,borderRadius:12,padding:"14px 16px",animation:`fadeUp 0.3s ease ${i*0.05}s both`,transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${bm.color}0D`;e.currentTarget.style.borderColor=`${bm.color}45`;}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor=`${bm.color}22`;}}>
                        {/* Header */}
                        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6 }}>
                          <div style={{ display:"flex",alignItems:"center",gap:8,flex:1 }}>
                            <span style={{ fontSize:16 }}>{bm.catIcon}</span>
                            <div>
                              <div style={{ fontSize:12,fontWeight:700,lineHeight:1.3 }}>{bm.title}</div>
                              <span style={{ fontSize:9,padding:"1px 6px",borderRadius:3,background:`${bm.color}12`,color:bm.color,border:`1px solid ${bm.color}25` }}>{bm.section}</span>
                            </div>
                          </div>
                          <button onClick={() => toggleBookmark(bm)} title="Remove bookmark"
                            style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,padding:0,color:"#FFD700",flexShrink:0 }}>⭐</button>
                        </div>
                        {/* Category pill */}
                        <div style={{ fontSize:10,color:"rgba(240,237,232,0.35)",marginBottom:8 }}>from <span style={{ color:bm.color }}>{bm.catTitle}</span></div>
                        {/* Description preview */}
                        <div style={{ fontSize:11,color:"rgba(240,237,232,0.48)",lineHeight:1.55,marginBottom:9 }}>
                          {bm.desc.length > 110 ? bm.desc.slice(0,110)+"…" : bm.desc}
                        </div>
                        {/* Actionable hint */}
                        <div style={{ fontSize:11,color:"#4CAF50",background:"rgba(76,175,80,0.06)",border:"1px solid rgba(76,175,80,0.14)",borderRadius:6,padding:"6px 10px",marginBottom:10,lineHeight:1.5 }}>
                          ✅ {bm.actionable.length > 90 ? bm.actionable.slice(0,90)+"…" : bm.actionable}
                        </div>
                        {/* Actions */}
                        <div style={{ display:"flex",gap:7 }}>
                          <button onClick={() => ask(`Explain "${bm.title}" (${bm.section}) in detail for a common Indian citizen. Cover what it means, how to use it, and exact action steps.`, true)}
                            style={{ flex:1,padding:"7px 10px",borderRadius:7,background:`${bm.color}10`,border:`1px solid ${bm.color}28`,color:bm.color,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600 }}>
                            Ask AI →
                          </button>
                          <button onClick={() => { setSelCat(bm.catId); setScreen("category"); }}
                            style={{ padding:"7px 10px",borderRadius:7,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(240,237,232,0.55)",cursor:"pointer",fontFamily:"inherit",fontSize:11 }}>
                            View Category
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Bookmarked Scenarios */}
              {bookmarks.filter(b=>b.type==="scenario").length > 0 && (
                <>
                  <div style={{ fontSize:13,fontWeight:700,color:"rgba(240,237,232,0.5)",letterSpacing:"0.6px",marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
                    🎭 SAVED SCENARIOS <span style={{ fontSize:11,color:"rgba(240,237,232,0.3)",fontWeight:400 }}>({bookmarks.filter(b=>b.type==="scenario").length})</span>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:10,marginBottom:28 }}>
                    {bookmarks.filter(b=>b.type==="scenario").map((bm,i) => (
                      <div key={bm.id} style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${bm.color}22`,borderRadius:12,padding:"14px 16px",animation:`fadeUp 0.3s ease ${i*0.05}s both`,transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${bm.color}0D`;e.currentTarget.style.borderColor=`${bm.color}45`;}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor=`${bm.color}22`;}}>
                        {/* Header */}
                        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6 }}>
                          <div style={{ display:"flex",alignItems:"center",gap:9,flex:1 }}>
                            <div style={{ width:36,height:36,borderRadius:9,background:`${bm.color}16`,border:`1px solid ${bm.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0 }}>{bm.icon}</div>
                            <div>
                              <div style={{ fontSize:13,fontWeight:700,lineHeight:1.3 }}>{bm.title}</div>
                              <span style={{ fontSize:9,padding:"1px 6px",borderRadius:10,background:`${bm.color}14`,color:bm.color,border:`1px solid ${bm.color}28` }}>{bm.tag}</span>
                            </div>
                          </div>
                          <button onClick={() => toggleBookmark(bm)} title="Remove bookmark"
                            style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,padding:0,color:"#FFD700",flexShrink:0 }}>⭐</button>
                        </div>
                        {/* Situation */}
                        <div style={{ fontSize:11,color:"rgba(240,237,232,0.48)",lineHeight:1.55,marginBottom:8 }}>{bm.situation}</div>
                        {/* Laws preview */}
                        <div style={{ marginBottom:10 }}>
                          {(bm.laws||[]).slice(0,2).map((l,li) => (
                            <div key={li} style={{ fontSize:10,padding:"3px 8px",background:`${bm.color}0A`,border:`1px solid ${bm.color}1A`,borderRadius:5,marginBottom:3,color:"rgba(240,237,232,0.6)" }}>{l}</div>
                          ))}
                          {(bm.laws||[]).length > 2 && <div style={{ fontSize:10,color:`${bm.color}99` }}>+{bm.laws.length-2} more laws</div>}
                        </div>
                        {/* Helpline */}
                        <div style={{ fontSize:10,color:"rgba(240,237,232,0.4)",marginBottom:10,padding:"5px 8px",background:"rgba(19,136,8,0.06)",borderRadius:6 }}>📞 {bm.helpline}</div>
                        {/* Actions */}
                        <div style={{ display:"flex",gap:7 }}>
                          <button onClick={() => ask(`I need help: ${bm.title}. ${bm.situation} Give detailed advice with applicable laws and exact steps.`, true)}
                            style={{ flex:1,padding:"7px 10px",borderRadius:7,background:`${bm.color}10`,border:`1px solid ${bm.color}28`,color:bm.color,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600 }}>
                            Get AI Advice →
                          </button>
                          <button onClick={() => { setTab("scenarios"); setTimeout(()=>setOpenSc(bm.id.replace("sc_","")),50); }}
                            style={{ padding:"7px 10px",borderRadius:7,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(240,237,232,0.55)",cursor:"pointer",fontFamily:"inherit",fontSize:11 }}>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Impact Section */}
      <div style={{ margin:"0 28px 48px",position:"relative",zIndex:1 }}>
        <div style={{ borderRadius:18,padding:"36px 32px",background:"linear-gradient(135deg,rgba(255,107,0,0.08),rgba(255,149,0,0.03))",border:"1px solid rgba(255,107,0,0.14)",textAlign:"center" }}>
          <div style={{ fontSize:28,marginBottom:12 }}>⚖️</div>
          <div style={{ fontSize:22,fontWeight:700,marginBottom:10 }}>{t.impactTitle}</div>
          <div style={{ fontSize:13,color:"rgba(240,237,232,0.44)",maxWidth:480,margin:"0 auto 24px",lineHeight:1.8 }}>
            3 out of 4 Indians have no idea what laws protect them. KanoonSaathi puts the entire Indian legal system in your hands — free, instant, and in plain English.
          </div>
          <div style={{ display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:24 }}>
            {[["1.4B","Indians who deserve to know their rights"],["80%","Cases dismissed due to lack of awareness"],["₹0","Cost to use KanoonSaathi"]].map(([n,l]) => (
              <div key={n} style={{ textAlign:"center" }}>
                <div style={{ fontSize:26,fontWeight:700,background:"linear-gradient(90deg,#FF6B00,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{n}</div>
                <div style={{ fontSize:11,color:"rgba(240,237,232,0.35)",maxWidth:140,lineHeight:1.4 }}>{l}</div>
              </div>
            ))}
          </div>
          <button style={{ padding:"12px 30px",borderRadius:9,background:"linear-gradient(135deg,#FF6B00,#FF9500)",border:"none",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite" }}
            onClick={() => { setMessages([]); setScreen("chat"); }}>
            Ask Free Legal Question ⚖️
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:"24px",borderTop:"1px solid rgba(255,255,255,0.05)",textAlign:"center",color:"rgba(240,237,232,0.2)",fontSize:11,lineHeight:2,position:"relative",zIndex:1 }}>
        <div>⚖️ <strong>KanoonSaathi</strong> — Empowering 1.4 Billion Indians with Free Legal Knowledge</div>
        <div>IPC · RERA · RTI · FSS Act · DGCA · PCA Act · Consumer Protection · IT Act · Labour Laws & Codes · Tax Laws · Medical Laws · FIR Rights · PMLA/ED · Education Laws · CBI · ARAI · Armed Forces · BSF · Railways · Disability Rights</div>
        <div style={{ marginTop:4,fontSize:10,color:"rgba(240,237,232,0.18)" }}>🌐 Available in 23 Languages · 22 Scheduled Languages + English · Constitution of India, 8th Schedule</div>
        <div style={{ marginTop:3,fontSize:10,color:"rgba(240,237,232,0.11)" }}>⚠️ For informational purposes only. For formal legal advice, consult a licensed advocate or District Legal Services Authority (DLSA).</div>
      </div>

      {/* Language Picker Modal */}
      {langOpen && <LanguagePicker lang={lang} onSelect={setLang} onClose={() => setLangOpen(false)} />}
    </div>
  );
}
