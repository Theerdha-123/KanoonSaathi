// ─── State-Specific Data for India ──────────────────────────────────────────

export const STATE_DATA = {
  'Andhra Pradesh':    { rera: 'rera.ap.gov.in',         minWage: '₹13,000–16,000/month', consumerForum: 'AP State Consumer Forum', dlsa: 'AP SLSA', laborPortal: 'labour.ap.gov.in' },
  'Bihar':             { rera: 'rera.bihar.gov.in',       minWage: '₹11,000–14,000/month', consumerForum: 'Bihar Consumer Forum', dlsa: 'Bihar SLSA', laborPortal: 'labour.bihar.gov.in' },
  'Delhi':             { rera: 'rera.delhi.gov.in',       minWage: '₹17,234–18,066/month', consumerForum: 'Delhi State Consumer Forum', dlsa: 'DSLSA', laborPortal: 'labour.delhi.gov.in' },
  'Goa':               { rera: 'rera.goa.gov.in',         minWage: '₹13,000–15,500/month', consumerForum: 'Goa Consumer Forum', dlsa: 'Goa SLSA', laborPortal: 'labour.goa.gov.in' },
  'Gujarat':           { rera: 'gujrera.gujarat.gov.in',  minWage: '₹11,500–14,000/month', consumerForum: 'Gujarat Consumer Forum', dlsa: 'Gujarat SLSA', laborPortal: 'labour.gujarat.gov.in' },
  'Haryana':           { rera: 'haryanarera.gov.in',      minWage: '₹12,000–16,800/month', consumerForum: 'Haryana Consumer Forum', dlsa: 'Haryana SLSA', laborPortal: 'labour.haryana.gov.in' },
  'Karnataka':         { rera: 'rera.karnataka.gov.in',   minWage: '₹13,000–17,000/month', consumerForum: 'Karnataka Consumer Forum', dlsa: 'Karnataka SLSA', laborPortal: 'labour.karnataka.gov.in' },
  'Kerala':            { rera: 'rera.kerala.gov.in',      minWage: '₹14,000–18,000/month', consumerForum: 'Kerala Consumer Forum', dlsa: 'Kerala SLSA', laborPortal: 'labour.kerala.gov.in' },
  'Madhya Pradesh':    { rera: 'rera.mp.gov.in',          minWage: '₹10,000–13,500/month', consumerForum: 'MP Consumer Forum', dlsa: 'MP SLSA', laborPortal: 'labour.mp.gov.in' },
  'Maharashtra':       { rera: 'maharera.mahaonline.gov.in', minWage: '₹14,000–18,000/month', consumerForum: 'Maharashtra Consumer Forum', dlsa: 'Maharashtra SLSA', laborPortal: 'mahakamgar.maharashtra.gov.in' },
  'Punjab':            { rera: 'rera.punjab.gov.in',      minWage: '₹12,100–14,600/month', consumerForum: 'Punjab Consumer Forum', dlsa: 'Punjab SLSA', laborPortal: 'pblabour.gov.in' },
  'Rajasthan':         { rera: 'rera.rajasthan.gov.in',   minWage: '₹10,000–13,000/month', consumerForum: 'Rajasthan Consumer Forum', dlsa: 'Rajasthan SLSA', laborPortal: 'labour.rajasthan.gov.in' },
  'Tamil Nadu':        { rera: 'tnrera.in',               minWage: '₹13,500–17,000/month', consumerForum: 'TN Consumer Forum', dlsa: 'TN SLSA', laborPortal: 'labour.tn.gov.in' },
  'Telangana':         { rera: 'rera.telangana.gov.in',   minWage: '₹13,000–16,000/month', consumerForum: 'Telangana Consumer Forum', dlsa: 'Telangana SLSA', laborPortal: 'labour.telangana.gov.in' },
  'Uttar Pradesh':     { rera: 'up-rera.in',              minWage: '₹10,000–14,000/month', consumerForum: 'UP Consumer Forum', dlsa: 'UP SLSA', laborPortal: 'uplabour.gov.in' },
  'West Bengal':       { rera: 'wbhira.gov.in',           minWage: '₹10,500–13,000/month', consumerForum: 'WB Consumer Forum', dlsa: 'WB SLSA', laborPortal: 'wblc.gov.in' },
  'Jharkhand':         { rera: 'jharera.jharkhand.gov.in', minWage: '₹10,000–12,500/month', consumerForum: 'Jharkhand Consumer Forum', dlsa: 'Jharkhand SLSA', laborPortal: 'labour.jharkhand.gov.in' },
  'Chhattisgarh':      { rera: 'rera.cgstate.gov.in',     minWage: '₹10,000–12,000/month', consumerForum: 'CG Consumer Forum', dlsa: 'CG SLSA', laborPortal: 'cglabour.nic.in' },
  'Odisha':            { rera: 'rera.odisha.gov.in',      minWage: '₹10,000–12,000/month', consumerForum: 'Odisha Consumer Forum', dlsa: 'Odisha SLSA', laborPortal: 'labour.odisha.gov.in' },
  'Assam':             { rera: 'rera.assam.gov.in',       minWage: '₹9,500–12,000/month', consumerForum: 'Assam Consumer Forum', dlsa: 'Assam SLSA', laborPortal: 'labour.assam.gov.in' },
};

export function detectState() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`, {
            headers: { 'User-Agent': 'KanoonSaathi/1.0' }
          });
          const data = await res.json();
          const state = data?.address?.state || null;
          resolve(state);
        } catch { resolve(null); }
      },
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}
