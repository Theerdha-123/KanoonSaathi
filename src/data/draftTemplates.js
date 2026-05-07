/**
 * KanoonSaathi — Legal Draft Templates (2025 BNS/BNSS Era)
 * 8 production-quality templates with field definitions and AI system prompts
 */

export const TEMPLATES = [
  {
    id: 'fir', icon: '🚔', title: 'FIR (Police Complaint)',
    desc: 'File a criminal complaint at the police station under BNS 2023',
    category: 'Criminal',
    steps: [
      { title: 'Your Details', fields: ['complainantName', 'fatherName', 'address', 'phone', 'idProof'] },
      { title: 'Incident Details', fields: ['incidentDate', 'incidentTime', 'incidentPlace', 'incidentDetails'] },
      { title: 'Accused & Evidence', fields: ['accusedName', 'accusedDesc', 'witnessNames', 'propertyLost'] },
    ],
  },
  {
    id: 'legalnotice', icon: '📜', title: 'Legal Notice',
    desc: 'Formal pre-litigation demand letter under Indian law',
    category: 'Civil',
    steps: [
      { title: 'Parties', fields: ['senderName', 'senderAddress', 'recipientName', 'recipientAddress'] },
      { title: 'Notice Details', fields: ['subject', 'facts', 'legalBasis'] },
      { title: 'Demand', fields: ['demand', 'deadline'] },
    ],
  },
  {
    id: 'rti', icon: '📋', title: 'RTI Application',
    desc: 'Right to Information request under RTI Act 2005, Section 6(1)',
    category: 'Government',
    steps: [
      { title: 'Applicant', fields: ['applicantName', 'applicantAddress', 'applicantPhone'] },
      { title: 'Authority', fields: ['department', 'pioDesignation', 'pioAddress'] },
      { title: 'Questions', fields: ['questions', 'feeMode'] },
    ],
  },
  {
    id: 'consumer', icon: '🛒', title: 'Consumer Complaint',
    desc: 'Complaint under Consumer Protection Act 2019',
    category: 'Consumer',
    steps: [
      { title: 'Your Details', fields: ['complainantName', 'complainantAddress', 'complainantPhone'] },
      { title: 'Opposite Party', fields: ['oppositePartyName', 'oppositePartyAddress'] },
      { title: 'Complaint', fields: ['productService', 'purchaseDate', 'amount', 'deficiency', 'reliefSought'] },
    ],
  },
  {
    id: 'harassment', icon: '👩', title: 'POSH Complaint',
    desc: 'Workplace harassment complaint under POSH Act 2013',
    category: 'Workplace',
    steps: [
      { title: 'Your Details', fields: ['complainantName', 'designation', 'companyDept'] },
      { title: 'Respondent', fields: ['respondentName', 'respondentDesignation'] },
      { title: 'Incident', fields: ['incidentDate', 'incidentPlace', 'incidentDetails', 'witnesses'] },
    ],
  },
  {
    id: 'rent', icon: '🏠', title: 'Rent Agreement',
    desc: '11-month residential lease agreement',
    category: 'Property',
    steps: [
      { title: 'Landlord', fields: ['landlordName', 'landlordAddress', 'landlordAadhaar'] },
      { title: 'Tenant', fields: ['tenantName', 'tenantAddress', 'tenantAadhaar'] },
      { title: 'Property & Terms', fields: ['propertyAddress', 'monthlyRent', 'securityDeposit', 'leaseStart', 'maintenanceBy', 'lockInMonths'] },
    ],
  },
  {
    id: 'cybercrime', icon: '💻', title: 'Cyber Crime Complaint',
    desc: 'Online fraud, identity theft — IT Act 2000 & BNS 2023',
    category: 'Criminal',
    steps: [
      { title: 'Your Details', fields: ['complainantName', 'address', 'phone', 'email'] },
      { title: 'Incident', fields: ['incidentDate', 'incidentTime', 'crimeType', 'platform', 'incidentDetails'] },
      { title: 'Evidence', fields: ['suspectDetails', 'financialLoss', 'evidenceList'] },
    ],
  },
  {
    id: 'affidavit', icon: '📃', title: 'General Affidavit',
    desc: 'Sworn statement for courts and administrative purposes',
    category: 'Legal',
    steps: [
      { title: 'Deponent', fields: ['deponentName', 'fatherName', 'deponentAge', 'deponentAddress'] },
      { title: 'Statement', fields: ['affidavitPurpose', 'affidavitStatements'] },
      { title: 'Verification', fields: ['verificationPlace'] },
    ],
  },
];

export const FIELD_META = {
  // Common
  complainantName: { label: 'Your Full Name', placeholder: 'e.g. Rahul Kumar', type: 'text', autoFill: 'name' },
  fatherName: { label: "Father's / Spouse's Name", placeholder: 'e.g. Shri Rajesh Kumar', type: 'text' },
  address: { label: 'Full Address', placeholder: 'House No, Street, City, State — PIN', type: 'textarea', autoFill: 'address' },
  phone: { label: 'Mobile Number', placeholder: '10-digit mobile number', type: 'tel', autoFill: 'phone' },
  email: { label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
  idProof: { label: 'ID Proof (Aadhaar/PAN)', placeholder: 'Aadhaar: XXXX-XXXX-XXXX', type: 'text' },
  incidentDate: { label: 'Date of Incident', type: 'date' },
  incidentTime: { label: 'Approximate Time', placeholder: 'e.g. Around 9:30 PM', type: 'text' },
  incidentPlace: { label: 'Place of Incident', placeholder: 'Full address where it happened', type: 'text' },
  incidentDetails: { label: 'Describe What Happened', placeholder: 'Write in detail — what happened, in what sequence, how you were affected.', type: 'textarea', rows: 5 },
  accusedName: { label: 'Accused Person (if known)', placeholder: 'Name or write "Unknown"', type: 'text' },
  accusedDesc: { label: 'Description of Accused', placeholder: 'Physical appearance, clothing, vehicle number etc.', type: 'textarea' },
  witnessNames: { label: 'Witnesses (if any)', placeholder: 'Names and contact details', type: 'textarea' },
  witnesses: { label: 'Witnesses', placeholder: 'Names of people who witnessed the incident', type: 'textarea' },
  propertyLost: { label: 'Property Lost/Stolen (if any)', placeholder: 'List items with approximate value', type: 'textarea' },
  // Legal Notice
  senderName: { label: 'Your Name (Sender)', placeholder: 'Your full legal name', type: 'text', autoFill: 'name' },
  senderAddress: { label: 'Your Address', placeholder: 'Complete postal address', type: 'textarea' },
  recipientName: { label: 'Recipient Name', placeholder: 'Person/Company receiving notice', type: 'text' },
  recipientAddress: { label: 'Recipient Address', placeholder: 'Complete postal address of recipient', type: 'textarea' },
  subject: { label: 'Subject of Notice', placeholder: 'e.g. Legal Notice for Non-Payment of Salary', type: 'text' },
  facts: { label: 'Statement of Facts', placeholder: 'Explain facts chronologically — dates, events, amounts', type: 'textarea', rows: 5 },
  legalBasis: { label: 'Legal Basis (optional)', placeholder: 'Laws/sections applicable (leave blank — AI will add)', type: 'textarea' },
  demand: { label: 'Your Demand', placeholder: 'What do you want? (e.g. Pay Rs.X, vacate property)', type: 'textarea' },
  deadline: { label: 'Compliance Deadline', placeholder: 'e.g. 15 days from receipt of this notice', type: 'text' },
  // RTI
  applicantName: { label: 'Your Name', placeholder: 'Full name', type: 'text', autoFill: 'name' },
  applicantAddress: { label: 'Your Address', placeholder: 'Full postal address', type: 'textarea' },
  applicantPhone: { label: 'Mobile Number', placeholder: '10-digit number', type: 'tel', autoFill: 'phone' },
  department: { label: 'Department / Ministry', placeholder: 'e.g. Ministry of Housing, Municipal Corporation', type: 'text' },
  pioDesignation: { label: 'PIO Designation', placeholder: 'e.g. Public Information Officer', type: 'text' },
  pioAddress: { label: 'PIO Office Address', placeholder: 'Address of the department', type: 'textarea' },
  questions: { label: 'Your RTI Questions', placeholder: '1. How much was spent on...\n2. Current status of...\n3. Please provide copies of...', type: 'textarea', rows: 6 },
  feeMode: { label: 'Fee Payment Mode', placeholder: 'e.g. IPO/DD of ₹10 payable to [Department]', type: 'text' },
  // Consumer
  complainantAddress: { label: 'Your Address', placeholder: 'Complete address', type: 'textarea' },
  complainantPhone: { label: 'Your Phone', placeholder: '10-digit number', type: 'tel', autoFill: 'phone' },
  oppositePartyName: { label: 'Company / Seller Name', placeholder: 'Business or individual name', type: 'text' },
  oppositePartyAddress: { label: 'Company / Seller Address', placeholder: 'Complete address', type: 'textarea' },
  productService: { label: 'Product / Service', placeholder: 'e.g. Samsung Galaxy S24, AC repair service', type: 'text' },
  purchaseDate: { label: 'Date of Purchase', type: 'date' },
  amount: { label: 'Amount Paid (₹)', placeholder: 'e.g. 15000', type: 'number' },
  deficiency: { label: 'Defect / Deficiency', placeholder: 'Describe the problem — what was promised vs what you got', type: 'textarea', rows: 4 },
  reliefSought: { label: 'Relief Sought', placeholder: 'e.g. Full refund + Rs.5,000 compensation', type: 'textarea' },
  // POSH
  designation: { label: 'Your Designation', placeholder: 'e.g. Software Engineer', type: 'text' },
  companyDept: { label: 'Your Department', placeholder: 'e.g. Engineering, Finance', type: 'text' },
  respondentName: { label: 'Respondent Name', placeholder: 'Person who harassed', type: 'text' },
  respondentDesignation: { label: 'Respondent Designation', placeholder: 'Their position', type: 'text' },
  // Rent
  landlordName: { label: 'Landlord Full Name', placeholder: 'Full legal name', type: 'text' },
  landlordAddress: { label: 'Landlord Address', placeholder: 'Permanent address', type: 'textarea' },
  landlordAadhaar: { label: 'Landlord Aadhaar (last 4 digits)', placeholder: 'XXXX', type: 'text' },
  tenantName: { label: 'Tenant Full Name', placeholder: 'Full legal name', type: 'text', autoFill: 'name' },
  tenantAddress: { label: 'Tenant Permanent Address', placeholder: 'Permanent address', type: 'textarea' },
  tenantAadhaar: { label: 'Tenant Aadhaar (last 4 digits)', placeholder: 'XXXX', type: 'text' },
  propertyAddress: { label: 'Rental Property Address', placeholder: 'Full property address with flat/house number', type: 'textarea' },
  monthlyRent: { label: 'Monthly Rent (₹)', placeholder: 'e.g. 15000', type: 'number' },
  securityDeposit: { label: 'Security Deposit (₹)', placeholder: 'e.g. 30000', type: 'number' },
  leaseStart: { label: 'Lease Start Date', type: 'date' },
  maintenanceBy: { label: 'Maintenance Paid By', placeholder: 'Landlord / Tenant / Shared', type: 'text' },
  lockInMonths: { label: 'Lock-in Period (months)', placeholder: 'e.g. 6', type: 'number' },
  // Cyber Crime
  crimeType: { label: 'Type of Cyber Crime', placeholder: 'e.g. Online fraud, Identity theft, Phishing', type: 'text' },
  platform: { label: 'Platform / Website', placeholder: 'e.g. WhatsApp, Instagram, Bank App', type: 'text' },
  suspectDetails: { label: 'Suspect Details', placeholder: 'Phone numbers, email, social media handles, UPI IDs', type: 'textarea' },
  financialLoss: { label: 'Financial Loss (₹)', placeholder: 'Total amount lost, if any', type: 'number' },
  evidenceList: { label: 'Evidence Available', placeholder: 'Screenshots, transaction receipts, chat logs, URLs', type: 'textarea' },
  // Affidavit
  deponentName: { label: 'Deponent Name', placeholder: 'Your full legal name', type: 'text', autoFill: 'name' },
  deponentAge: { label: 'Age', placeholder: 'Your age', type: 'number' },
  deponentAddress: { label: 'Residential Address', placeholder: 'Full address', type: 'textarea' },
  affidavitPurpose: { label: 'Purpose of Affidavit', placeholder: 'e.g. Name change, Address proof, Court proceedings', type: 'text' },
  affidavitStatements: { label: 'Statements to Declare', placeholder: 'Write each fact on a new line:\n1. I solemnly declare that...\n2. The documents attached are...', type: 'textarea', rows: 6 },
  verificationPlace: { label: 'Place of Verification', placeholder: 'e.g. New Delhi', type: 'text' },
};

export const DRAFT_PROMPTS = {
  fir: `You are an expert Indian legal document drafter. Generate a formal FIR (First Information Report) complaint letter addressed to the Station House Officer (SHO).

FORMAT REQUIREMENTS:
- Start with "To, The Station House Officer (SHO), [Police Station]"
- Include "Subject: Request to register FIR under Bharatiya Nyaya Sanhita (BNS) 2023"
- Use "Respected Sir/Madam" salutation
- Structure: Informant Details → Incident Details → Accused Details → Witnesses → Prayer
- Reference BNS 2023 sections (NOT old IPC sections)
- End with "I request you to kindly register this FIR, investigate the matter, and take appropriate legal action" prayer clause
- Include signature block: Name, Date, Place
- Mark any missing information as [TO BE FILLED]
- Use formal, clear, factual language — no emotional language`,

  legalnotice: `You are an expert Indian legal notice drafter. Generate a formal Legal Notice.

FORMAT REQUIREMENTS:
- Header: "LEGAL NOTICE" centered, bold
- Start with "WITHOUT PREJUDICE" header
- Include: "Under instructions from and on behalf of my client, [Name]..."
- Structure: Introduction → Facts → Legal Basis → Demand → Consequences → Timeline
- Reference relevant Indian laws (BNS 2023 for criminal, CPC for civil matters)
- Include: "Failing which, my client shall be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, at your risk, cost, and consequences"
- End with proper signature block
- Tone: Firm, professional, non-threatening but authoritative`,

  rti: `You are an expert RTI application drafter for India. Generate a formal RTI application under RTI Act 2005, Section 6(1).

FORMAT REQUIREMENTS:
- "To, The Public Information Officer (PIO), [Department]"
- "Subject: Application for information under Section 6(1) of the Right to Information Act, 2005"
- Include numbered, specific questions
- Mention: "I am an Indian citizen making this request under the RTI Act, 2005"
- Fee clause: "Application fee of Rs. 10/- is enclosed by way of [IPO/DD/Court Fee Stamp]"
- BPL exemption note if applicable
- Include: "If the information sought is not available in your department, kindly transfer this application to the concerned department under Section 6(3)"
- Signature block with date and place`,

  consumer: `You are an expert consumer law drafter for India. Generate a formal Consumer Complaint for filing before the District Consumer Disputes Redressal Commission.

FORMAT REQUIREMENTS:
- Court heading: "BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION AT [District]"
- Case title: "[Complainant Name] ... COMPLAINANT versus [Opposite Party] ... OPPOSITE PARTY"
- Structure: Parties → Jurisdiction → Facts → Deficiency → Legal Provisions → Reliefs → Prayer
- Reference Consumer Protection Act 2019 (NOT old 1986 Act)
- Include proper verification: "I hereby verify that the contents of paragraphs 1 to [X] are true and correct to the best of my knowledge"
- Include affidavit clause
- List of annexed documents
- Prayer with specific reliefs (refund, compensation, litigation costs)`,

  harassment: `You are an expert POSH Act complaint drafter. Generate a formal sexual harassment complaint for the Internal Complaints Committee (ICC).

FORMAT REQUIREMENTS:
- "To, The Chairperson, Internal Complaints Committee (ICC), [Company Name]"
- "Subject: Complaint under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013"
- Structure: Complainant Details → Respondent Details → Chronological Facts → Impact Statement → Evidence → Relief Sought → Declaration
- Reference POSH Act 2013 specifically
- Include timeline of events
- Include declaration: "I solemnly declare that the above statements are true and correct"
- Maintain dignity and factual tone throughout`,

  rent: `You are an expert Indian property law drafter. Generate a formal 11-month Rent/Lease Agreement.

FORMAT REQUIREMENTS:
- Title: "RESIDENTIAL RENT AGREEMENT"
- "This Rent Agreement is made and executed on [Date] at [City]"
- BETWEEN clause with landlord and tenant details
- WHEREAS recitals
- Standard numbered clauses: Term, Rent, Security Deposit, Maintenance, Lock-in, Notice Period, Use of Premises, Subletting, Repairs, Termination, Inspection, Governing Law
- Duration: 11 months (avoid registration requirement)
- Notice period: 1–2 months
- Mention stamp paper requirement
- Witness section with two witness signature blocks
- Schedule: Property description
- Both party signature blocks`,

  cybercrime: `You are an expert Indian cyber law drafter. Generate a formal Cyber Crime Complaint.

FORMAT REQUIREMENTS:
- "To, The Station House Officer / Head of Cyber Crime Cell, [Police Station/Cyber Cell], [City]"
- "Subject: Complaint regarding [type of cyber crime] under IT Act 2000 and BNS 2023"
- Structure: Complainant Details → Crime Description → Suspect Details → Evidence → Financial Loss → Prayer
- Reference IT Act 2000 sections AND BNS 2023 (NOT old IPC)
- Include: "I request you to register this complaint, investigate the matter, and take action under the relevant sections of the Information Technology Act, 2000 and the Bharatiya Nyaya Sanhita, 2023"
- Mention cybercrime.gov.in portal reference
- National helpline 1930 reference for financial fraud
- Evidence preservation note
- Signature block`,

  affidavit: `You are an expert Indian legal drafter. Generate a formal General Affidavit (Sworn Statement).

FORMAT REQUIREMENTS:
- Title: "AFFIDAVIT" centered
- "I, [Name], Son/Daughter/Wife of [Father/Spouse Name], aged about [Age] years, residing at [Address], do hereby solemnly affirm and state on oath as follows:"
- Numbered paragraphs (para 1, 2, 3...)
- Each statement starts with "That..."
- VERIFICATION clause: "I, the above-named deponent, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and no part of it is false and nothing material has been concealed therefrom."
- "Verified at [Place] on this [Day] day of [Month], [Year]."
- "DEPONENT" signature line
- "Before me, Notary Public / Oath Commissioner" attestation block
- Mention: Must be executed on appropriate stamp paper`,
};
