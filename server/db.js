/**
 * KanoonSaathi — SQLite Database Module
 * 
 * Production-hardened SQLite with WAL mode, busy timeout,
 * optimized cache, and automated backup scheduling.
 */

import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mkdirSync, statSync } from 'fs';
import { backupDatabase } from './backup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'kanoonsaathi.db');

// Ensure data directory exists
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const db = new Database(DB_PATH);

// ─── Production SQLite Pragmas ───────────────────────────────────────────────
db.pragma('journal_mode = WAL');     // Better concurrent read/write
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');    // Wait up to 5s on database locks
db.pragma('cache_size = -20000');    // 20MB page cache
db.pragma('synchronous = NORMAL');   // Good balance of safety + speed
db.pragma('temp_store = MEMORY');    // Store temp tables in memory
db.pragma('mmap_size = 268435456');  // 256MB memory-mapped I/O

const JWT_SECRET = process.env.JWT_SECRET || 'kanoonsaathi-dev-secret-change-in-prod';

// ─── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user','admin')),
    state TEXT,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    query_text TEXT NOT NULL,
    response_text TEXT,
    language TEXT DEFAULT 'en',
    provider TEXT,
    feature TEXT DEFAULT 'chat',
    state TEXT,
    response_time_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    user_id INTEGER,
    language TEXT DEFAULT 'en',
    state TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS law_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    search_term TEXT NOT NULL,
    category TEXT,
    law_section TEXT,
    user_id INTEGER,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS draft_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_type TEXT NOT NULL,
    user_id INTEGER,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Indexes for analytics performance
  CREATE INDEX IF NOT EXISTS idx_queries_created ON queries(created_at);
  CREATE INDEX IF NOT EXISTS idx_queries_language ON queries(language);
  CREATE INDEX IF NOT EXISTS idx_queries_feature ON queries(feature);
  CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
  CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
  CREATE INDEX IF NOT EXISTS idx_law_searches_term ON law_searches(search_term);
`);

// ─── User Management ─────────────────────────────────────────────────────────

const userStmts = {
  create: db.prepare(`INSERT INTO users (name, email, phone, password_hash, role, state, language) VALUES (?, ?, ?, ?, ?, ?, ?)`),
  findByEmail: db.prepare(`SELECT * FROM users WHERE email = ?`),
  findById: db.prepare(`SELECT id, name, email, phone, role, state, language, created_at, last_login FROM users WHERE id = ?`),
  updateLogin: db.prepare(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`),
  updateProfile: db.prepare(`UPDATE users SET name = ?, phone = ?, state = ?, language = ? WHERE id = ?`),
  updatePassword: db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`),
  count: db.prepare(`SELECT COUNT(*) as count FROM users`),
  listAll: db.prepare(`SELECT id, name, email, phone, role, state, language, created_at, last_login FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`),
};

export function createUser({ name, email, phone, password, role = 'user', state = null, language = 'en' }) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const result = userStmts.create.run(name, email.toLowerCase(), phone, hash, role, state, language);
    return { id: result.lastInsertRowid, name, email: email.toLowerCase() };
  } catch (e) {
    if (e.message.includes('UNIQUE')) throw new Error('Account already exists');
    throw e;
  }
}

export function loginUser(email, password) {
  const user = userStmts.findByEmail.get(email.toLowerCase());
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  userStmts.updateLogin.run(user.id);
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, state: user.state, language: user.language },
  };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch { return null; }
}

export function getUserById(id) {
  return userStmts.findById.get(id);
}

export function updateUserProfile(id, { name, phone, state, language }) {
  userStmts.updateProfile.run(name, phone, state, language, id);
  return userStmts.findById.get(id);
}

export function resetUserPassword(email, newPassword) {
  const user = userStmts.findByEmail.get(email.toLowerCase());
  if (!user) return false;
  const hash = bcrypt.hashSync(newPassword, 10);
  userStmts.updatePassword.run(hash, user.id);
  return true;
}

// ─── Analytics Logging ───────────────────────────────────────────────────────

const logStmts = {
  query: db.prepare(`INSERT INTO queries (user_id, query_text, response_text, language, provider, feature, state, response_time_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`),
  pageView: db.prepare(`INSERT INTO page_views (page, user_id, language, state, user_agent) VALUES (?, ?, ?, ?, ?)`),
  lawSearch: db.prepare(`INSERT INTO law_searches (search_term, category, law_section, user_id, language) VALUES (?, ?, ?, ?, ?)`),
  draftUsage: db.prepare(`INSERT INTO draft_usage (template_type, user_id, language) VALUES (?, ?, ?)`),
};

export function logQuery({ userId, query, response, language, provider, feature = 'chat', state, responseTime }) {
  logStmts.query.run(userId || null, query, response?.slice(0, 2000), language || 'en', provider, feature, state, responseTime);
}

export function logPageView({ page, userId, language, state, userAgent }) {
  logStmts.pageView.run(page, userId || null, language || 'en', state, userAgent);
}

export function logLawSearch({ term, category, section, userId, language }) {
  logStmts.lawSearch.run(term, category, section, userId || null, language || 'en');
}

export function logDraftUsage({ templateType, userId, language }) {
  logStmts.draftUsage.run(templateType, userId || null, language || 'en');
}

// ─── Analytics Queries (Admin Dashboard) ─────────────────────────────────────

export function getOverviewStats() {
  return {
    totalUsers: db.prepare(`SELECT COUNT(*) as v FROM users`).get().v,
    totalQueries: db.prepare(`SELECT COUNT(*) as v FROM queries`).get().v,
    totalPageViews: db.prepare(`SELECT COUNT(*) as v FROM page_views`).get().v,
    totalDrafts: db.prepare(`SELECT COUNT(*) as v FROM draft_usage`).get().v,
    todayQueries: db.prepare(`SELECT COUNT(*) as v FROM queries WHERE date(created_at) = date('now')`).get().v,
    todayUsers: db.prepare(`SELECT COUNT(DISTINCT user_id) as v FROM queries WHERE date(created_at) = date('now') AND user_id IS NOT NULL`).get().v,
    weekQueries: db.prepare(`SELECT COUNT(*) as v FROM queries WHERE created_at >= datetime('now', '-7 days')`).get().v,
  };
}

export function getTopQueries(limit = 20) {
  return db.prepare(`
    SELECT query_text, COUNT(*) as count, MAX(created_at) as last_asked
    FROM queries
    GROUP BY LOWER(TRIM(query_text))
    ORDER BY count DESC
    LIMIT ?
  `).all(limit);
}

export function getTopLawSearches(limit = 20) {
  return db.prepare(`
    SELECT search_term, category, COUNT(*) as count
    FROM law_searches
    GROUP BY LOWER(TRIM(search_term))
    ORDER BY count DESC
    LIMIT ?
  `).all(limit);
}

export function getUsageByLanguage() {
  return db.prepare(`
    SELECT language, COUNT(*) as query_count
    FROM queries
    GROUP BY language
    ORDER BY query_count DESC
  `).all();
}

export function getUsageByState() {
  return db.prepare(`
    SELECT COALESCE(state, 'Unknown') as state, COUNT(*) as query_count
    FROM queries
    WHERE state IS NOT NULL AND state != ''
    GROUP BY state
    ORDER BY query_count DESC
  `).all();
}

export function getUsageByFeature() {
  return db.prepare(`
    SELECT feature, COUNT(*) as count
    FROM queries
    GROUP BY feature
    ORDER BY count DESC
  `).all();
}

export function getDraftUsageStats() {
  return db.prepare(`
    SELECT template_type, COUNT(*) as count
    FROM draft_usage
    GROUP BY template_type
    ORDER BY count DESC
  `).all();
}

export function getPageViewStats() {
  return db.prepare(`
    SELECT page, COUNT(*) as views
    FROM page_views
    GROUP BY page
    ORDER BY views DESC
  `).all();
}

export function getQueryTimeline(days = 30) {
  return db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as count
    FROM queries
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY date(created_at)
    ORDER BY day ASC
  `).all(days);
}

export function getRecentQueries(limit = 50) {
  return db.prepare(`
    SELECT q.id, q.query_text, q.language, q.feature, q.provider, q.state, q.response_time_ms, q.created_at,
           u.name as user_name, u.email as user_email
    FROM queries q
    LEFT JOIN users u ON q.user_id = u.id
    ORDER BY q.created_at DESC
    LIMIT ?
  `).all(limit);
}

export function getAllUsers(limit = 100, offset = 0) {
  return {
    users: userStmts.listAll.all(limit, offset),
    total: userStmts.count.get().count,
  };
}

// ─── Database Status ─────────────────────────────────────────────────────────

export function getDbStatus() {
  let sizeBytes = 0;
  try { sizeBytes = statSync(DB_PATH).size; } catch {}
  return {
    connected: true,
    provider: 'sqlite',
    path: DB_PATH,
    sizeBytes,
  };
}

export function disconnectDb() {
  try { db.close(); } catch {}
}

// ─── Automated Backup Schedule ───────────────────────────────────────────────

const BACKUP_INTERVAL_HOURS = parseInt(process.env.BACKUP_INTERVAL_HOURS || '24', 10);

if (process.env.NODE_ENV === 'production' || process.env.ENABLE_BACKUPS === 'true') {
  // Run initial backup after 5 minutes, then every BACKUP_INTERVAL_HOURS
  setTimeout(() => {
    backupDatabase();
    setInterval(() => backupDatabase(), BACKUP_INTERVAL_HOURS * 60 * 60 * 1000);
  }, 5 * 60 * 1000);
  console.log(`   💾 Auto-backup enabled (every ${BACKUP_INTERVAL_HOURS}h)`);
}

// ─── Seed admin account ──────────────────────────────────────────────────────
const adminEmail = process.env.ADMIN_EMAIL || 'admin@kanoonsaathi.in';
const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
try {
  const existing = userStmts.findByEmail.get(adminEmail);
  if (!existing) {
    createUser({ name: 'Admin', email: adminEmail, phone: '0000000000', password: adminPass, role: 'admin' });
    console.log(`   👤 Admin account created: ${adminEmail} / ${adminPass}`);
  }
} catch {}

export default db;
