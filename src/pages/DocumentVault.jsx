/**
 * KanoonSaathi — Secure Document Vault
 * 
 * SECURITY ARCHITECTURE FOR IMPLEMENTATION (Asymmetric + Symmetric Encryption):
 * To ensure zero-knowledge, end-to-end encryption (E2EE) for sensitive legal documents:
 * 
 * 1. Key Generation: On the client-side (browser), generate an RSA-OAEP key pair (Asymmetric).
 *    The public key is stored on the server. The private key is encrypted using the user's password 
 *    (via PBKDF2 or Argon2) and stored on the server, ensuring only the user can decrypt their private key.
 * 2. Document Upload (Envelope Encryption):
 *    - Generate a random symmetric key (AES-GCM 256-bit).
 *    - Encrypt the actual document file using this AES key.
 *    - Encrypt the AES key itself using the user's RSA Public Key.
 *    - Send both the AES-encrypted document and the RSA-encrypted AES key to the server.
 * 3. Document Download:
 *    - The user downloads the encrypted payload.
 *    - The user decrypts their private RSA key locally using their password.
 *    - The user uses their private RSA key to decrypt the AES key.
 *    - The AES key decrypts the document.
 * 
 * This ensures that even if the database or S3 bucket is compromised, the server NEVER sees the 
 * unencrypted document or the unencrypted private key.
 */

import { useState } from 'react';
import NavBar from '../components/NavBar';

const MOCK_DOCS = [
  { id: 1, name: 'Aadhar_Card_Copy.pdf', size: '1.2 MB', date: '2026-05-01', type: 'Identity', encrypted: true },
  { id: 2, name: 'Delhi_Rental_Agreement_2025.pdf', size: '4.5 MB', date: '2026-04-15', type: 'Contract', encrypted: true },
  { id: 3, name: 'FIR_Copy_Cyber_Fraud.jpg', size: '2.1 MB', date: '2026-03-22', type: 'Legal', encrypted: true },
];

export default function DocumentVault(props) {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // In real app: Handle e.dataTransfer.files
    alert('File dropped. In a real app, this would encrypt and upload.');
  };

  const commonProps = { ...props, back: props.onHome, backLabel: '← Home' };

  return (
    <div style={{ minHeight: '100vh', background: '#050A14', color: '#F0EDE8', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <NavBar {...commonProps} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 32, animation: 'fadeUp 0.3s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 16 }}>
            <span style={{ fontSize: 32, filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.4))' }}>🛡️</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Secure Document Vault</h1>
          <p style={{ fontSize: 14, color: 'rgba(240,237,232,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Your legal documents are protected with zero-knowledge, end-to-end asymmetric encryption. Only you hold the key.
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '6px 14px', background: 'rgba(34,197,94,0.08)', borderRadius: 20, border: '1px solid rgba(34,197,94,0.2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.5px', textTransform: 'uppercase' }}>End-to-End Encrypted</span>
          </div>
        </div>

        {/* Upload Zone */}
        <div 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          style={{
            padding: '48px 24px', textAlign: 'center', borderRadius: 24, transition: 'all 0.3s ease',
            background: dragActive ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
            border: dragActive ? '2px dashed #22C55E' : '2px dashed rgba(255,255,255,0.1)',
            marginBottom: 40, cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0', color: dragActive ? '#22C55E' : '#F0EDE8' }}>
            {dragActive ? 'Drop files to securely encrypt' : 'Drag & drop sensitive documents here'}
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', margin: '0 0 20px 0' }}>Supports PDF, JPG, PNG up to 10MB.</p>
          <button style={{
            background: 'linear-gradient(135deg, #22C55E, #16A34A)', border: 'none', padding: '10px 24px',
            borderRadius: 12, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(34,197,94,0.25)', transition: 'transform 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Browse Files
          </button>
        </div>

        {/* Document Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🔒</span> My Vault
            </h2>
            <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)' }}>{docs.length} Documents</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {docs.map((doc, i) => (
              <div key={doc.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
                padding: 16, animation: `fadeUp 0.3s ${i * 0.1}s ease both`, display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                  }}>
                    {doc.name.endsWith('.pdf') ? '📄' : '🖼️'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                      {doc.name}
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'rgba(240,237,232,0.4)' }}>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '8px 0', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: '#F0EDE8', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    👁️ View
                  </button>
                  <button style={{ flex: 1, padding: '8px 0', background: 'rgba(34,197,94,0.1)', border: 'none', borderRadius: 8, color: '#22C55E', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}>
                    ⬇️ Download
                  </button>
                  <button style={{ width: 36, padding: 0, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, color: '#EF4444', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
