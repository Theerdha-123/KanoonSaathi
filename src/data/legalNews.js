/**
 * KanoonSaathi — Legal News Feed Mock Data
 * 3 realistic (fictional) Supreme Court / High Court judgments
 * structured for quick-read bullet summaries.
 */

export const LEGAL_NEWS = [
  {
    id: 1,
    title: "Supreme Court Strengthens Bail Rights Under BNS 2023",
    court: "Supreme Court of India",
    bench: "Justice D.Y. Chandrachud, Justice J.B. Pardiwala",
    date: "2026-04-28",
    caseNo: "Criminal Appeal No. 1247/2026",
    category: "Criminal Law",
    summaryPoints: [
      "SC ruled that under the new BNSS 2023, first-time offenders accused of offences punishable up to 3 years MUST be granted bail within 24 hours if the investigation is not complete.",
      "The Court held that prolonged undertrial detention violates Article 21 (Right to Life & Liberty) and directed all Magistrates to actively monitor jail overcrowding in their jurisdiction.",
      "A new mandate was issued: police must now file a compliance report within 15 days of arrest, failing which the accused is entitled to default bail — no exceptions."
    ],
    impact: "High",
    tags: ["Bail", "BNSS 2023", "Article 21", "Undertrial Rights"],
  },
  {
    id: 2,
    title: "Delhi HC Orders E-Commerce Platforms to Display MRP Prominently",
    court: "Delhi High Court",
    bench: "Justice Prathiba M. Singh",
    date: "2026-05-02",
    caseNo: "W.P.(C) 4892/2026",
    category: "Consumer Law",
    summaryPoints: [
      "Delhi HC ruled that all e-commerce platforms (Amazon, Flipkart, Meesho) must display the MRP of every product in a font size at least as large as the selling price — hiding MRP in fine print is now illegal.",
      "The Court imposed a ₹10 lakh penalty on a major platform for systematically inflating 'original prices' to show fake discounts, calling it an 'unfair trade practice' under the Consumer Protection Act 2019.",
      "A 90-day compliance deadline was set: all platforms must implement an automated MRP verification system, and consumers can now file complaints directly on the National Consumer Helpline (1915) for MRP violations."
    ],
    impact: "Medium",
    tags: ["E-Commerce", "MRP", "Consumer Protection", "Fake Discounts"],
  },
  {
    id: 3,
    title: "SC Declares Right to Internet Access a Fundamental Right for Students",
    court: "Supreme Court of India",
    bench: "Justice Sanjiv Khanna, Justice B.R. Gavai",
    date: "2026-05-06",
    caseNo: "Writ Petition (Civil) No. 312/2025",
    category: "Fundamental Rights",
    summaryPoints: [
      "The Supreme Court declared that affordable internet access is now part of the Right to Education (Article 21A) for all students between ages 6-18, especially in rural and tribal areas.",
      "State governments were directed to ensure free Wi-Fi in all government schools and public libraries within 12 months, with a dedicated fund of ₹500 crore allocated from the Universal Service Obligation Fund.",
      "The Court struck down internet shutdowns in educational institutions during exams, holding that blanket internet bans disproportionately affect economically weaker students who rely on digital study materials."
    ],
    impact: "High",
    tags: ["Internet Rights", "Article 21A", "Education", "Digital India"],
  },
];
