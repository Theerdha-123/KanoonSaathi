#!/usr/bin/env node
/**
 * makeAdmin.js — Instantly elevate a user to admin role in the KanoonSaathi database.
 *
 * Usage:
 *   node makeAdmin.js                          # Lists all users and prompts
 *   node makeAdmin.js user@example.com         # Elevates specific user to admin
 *   node makeAdmin.js user@example.com --revoke # Revokes admin from a user
 *   node makeAdmin.js --create email password   # Creates a new admin account
 */

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data', 'kanoonsaathi.db');

// ─── Helpers ────────────────────────────────────────────────────────────────────

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

function printBanner() {
  console.log(`\n${c('cyan', '⚖️  KanoonSaathi — Admin Manager')}`);
  console.log(c('dim', `   Database: ${DB_PATH}\n`));
}

function printUsage() {
  console.log(c('yellow', 'Usage:'));
  console.log(`  node makeAdmin.js                            ${c('dim', '# List all users')}`);
  console.log(`  node makeAdmin.js <email>                    ${c('dim', '# Elevate user to admin')}`);
  console.log(`  node makeAdmin.js <email> --revoke           ${c('dim', '# Revoke admin role')}`);
  console.log(`  node makeAdmin.js --create <email> <password> ${c('dim', '# Create new admin account')}`);
  console.log();
}

// ─── Database Operations ────────────────────────────────────────────────────────

function openDb() {
  if (!existsSync(DB_PATH)) {
    console.log(c('red', `✗ Database not found at ${DB_PATH}`));
    console.log(c('dim', '  Run the server first: npm run dev'));
    process.exit(1);
  }
  return new Database(DB_PATH);
}

function listUsers(db) {
  const users = db.prepare(`
    SELECT id, name, email, role, language, state, 
           datetime(created_at, 'localtime') as joined,
           datetime(last_login, 'localtime') as last_login
    FROM users ORDER BY created_at DESC
  `).all();

  if (users.length === 0) {
    console.log(c('yellow', '  No users found. Start the server and create accounts first.\n'));
    return;
  }

  console.log(c('bold', `  Found ${users.length} user(s):\n`));
  console.log(c('dim', '  ─────────────────────────────────────────────────────────────────'));

  users.forEach((u, i) => {
    const roleTag = u.role === 'admin'
      ? c('red', '🔐 ADMIN')
      : c('dim', '👤 user ');
    const state = u.state || '-';
    const lang = u.language || 'en';

    console.log(`  ${c('bold', `${i + 1}.`)} ${roleTag}  ${c('cyan', u.email)}`);
    console.log(`     ${c('dim', `Name: ${u.name} · Lang: ${lang} · State: ${state}`)}`);
    console.log(`     ${c('dim', `Joined: ${u.joined || 'unknown'} · Last login: ${u.last_login || 'never'}`)}`);
    console.log();
  });
}

function elevateUser(db, email) {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ?').get(email.toLowerCase());

  if (!user) {
    console.log(c('red', `  ✗ No user found with email: ${email}`));
    console.log(c('dim', `  Run "node makeAdmin.js" to see all users.\n`));
    return false;
  }

  if (user.role === 'admin') {
    console.log(c('yellow', `  ⚠ ${user.name} (${user.email}) is already an admin.\n`));
    return true;
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', user.id);
  console.log(c('green', `  ✅ ${user.name} (${user.email}) elevated to ADMIN!`));
  console.log(c('dim', `  They can now access the Admin Dashboard via the 🔐 Admin button.\n`));
  return true;
}

function revokeAdmin(db, email) {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ?').get(email.toLowerCase());

  if (!user) {
    console.log(c('red', `  ✗ No user found with email: ${email}\n`));
    return false;
  }

  if (user.role !== 'admin') {
    console.log(c('yellow', `  ⚠ ${user.name} (${user.email}) is not an admin.\n`));
    return true;
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run('user', user.id);
  console.log(c('green', `  ✅ Admin role revoked from ${user.name} (${user.email}).`));
  console.log(c('dim', `  They are now a regular user.\n`));
  return true;
}

function createAdmin(db, email, password) {
  if (!email || !password) {
    console.log(c('red', '  ✗ Email and password are required.'));
    console.log(c('dim', '  Usage: node makeAdmin.js --create admin@example.com mypassword\n'));
    return false;
  }

  if (password.length < 6) {
    console.log(c('red', '  ✗ Password must be at least 6 characters.\n'));
    return false;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    console.log(c('yellow', `  ⚠ User ${email} already exists. Elevating to admin instead...`));
    return elevateUser(db, email);
  }

  const hash = bcrypt.hashSync(password, 10);
  const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  db.prepare(`
    INSERT INTO users (name, email, phone, password_hash, role, state, language, created_at, last_login)
    VALUES (?, ?, ?, ?, 'admin', 'Delhi', 'en', datetime('now'), datetime('now'))
  `).run(name, email.toLowerCase(), '', hash);

  console.log(c('green', `  ✅ New admin account created!`));
  console.log(`     ${c('cyan', 'Email:')}    ${email}`);
  console.log(`     ${c('cyan', 'Password:')} ${password}`);
  console.log(`     ${c('cyan', 'Role:')}     🔐 Admin`);
  console.log(c('dim', `\n  Login at the app and look for the 🔐 Admin button in the navbar.\n`));
  return true;
}

// ─── Main ───────────────────────────────────────────────────────────────────────

printBanner();

const args = process.argv.slice(2);
const db = openDb();

if (args.length === 0) {
  // No args: list all users
  listUsers(db);
  printUsage();
} else if (args[0] === '--create' || args[0] === '-c') {
  // Create new admin
  createAdmin(db, args[1], args[2]);
} else if (args[0] === '--help' || args[0] === '-h') {
  printUsage();
} else if (args.includes('--revoke') || args.includes('-r')) {
  // Revoke admin from user
  const email = args.find(a => !a.startsWith('-'));
  revokeAdmin(db, email);
} else {
  // Elevate user by email
  elevateUser(db, args[0]);
}

db.close();
