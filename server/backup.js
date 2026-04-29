import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'kanoonsaathi.db');
const BACKUP_DIR = join(__dirname, '..', 'data', 'backups');
const MAX_BACKUPS = 7; // Keep last 7 backups

/**
 * Create a timestamped backup of the SQLite database.
 * Keeps the last MAX_BACKUPS files and deletes older ones.
 */
export function backupDatabase() {
  try {
    mkdirSync(BACKUP_DIR, { recursive: true });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupName = `kanoonsaathi_${timestamp}.db`;
    const backupPath = join(BACKUP_DIR, backupName);

    // Check if source database exists
    try {
      statSync(DB_PATH);
    } catch {
      console.error('❌ Database file not found at:', DB_PATH);
      return null;
    }

    // Copy the database file
    copyFileSync(DB_PATH, backupPath);

    // Also copy WAL file if it exists (important for data integrity)
    try {
      const walPath = DB_PATH + '-wal';
      statSync(walPath);
      copyFileSync(walPath, backupPath + '-wal');
    } catch { /* WAL may not exist */ }

    console.log(`✅ Backup created: ${backupName}`);

    // Cleanup old backups
    const backups = readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('kanoonsaathi_') && f.endsWith('.db'))
      .sort()
      .reverse();

    if (backups.length > MAX_BACKUPS) {
      const toDelete = backups.slice(MAX_BACKUPS);
      for (const old of toDelete) {
        try {
          unlinkSync(join(BACKUP_DIR, old));
          // Also delete WAL if exists
          try { unlinkSync(join(BACKUP_DIR, old + '-wal')); } catch {}
          console.log(`   🗑️  Deleted old backup: ${old}`);
        } catch (e) {
          console.error(`   ⚠️  Could not delete ${old}:`, e.message);
        }
      }
    }

    console.log(`   📊 Total backups: ${Math.min(backups.length, MAX_BACKUPS)}`);
    return backupPath;

  } catch (err) {
    console.error('❌ Backup failed:', err.message);
    return null;
  }
}

/**
 * List all existing backups with their sizes and dates.
 */
export function listBackups() {
  try {
    mkdirSync(BACKUP_DIR, { recursive: true });
    const backups = readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('kanoonsaathi_') && f.endsWith('.db'))
      .map(f => {
        const stats = statSync(join(BACKUP_DIR, f));
        return { name: f, size: stats.size, date: stats.mtime };
      })
      .sort((a, b) => b.date - a.date);

    return backups;
  } catch {
    return [];
  }
}

// ─── CLI: Run directly with `node server/backup.js` ──────────────────────────

const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('server/backup.js') ||
                    process.argv[1]?.replace(/\\/g, '/').endsWith('server\\backup.js');

if (isDirectRun) {
  console.log('\n🔄 KanoonSaathi Database Backup\n');

  if (process.argv[2] === '--list') {
    const backups = listBackups();
    if (backups.length === 0) {
      console.log('No backups found.');
    } else {
      console.log(`Found ${backups.length} backup(s):\n`);
      for (const b of backups) {
        console.log(`  📁 ${b.name}  (${(b.size / 1024).toFixed(1)} KB)  ${b.date.toLocaleString()}`);
      }
    }
  } else {
    const result = backupDatabase();
    if (result) {
      console.log(`\n✅ Backup saved to: ${result}`);
    } else {
      console.log('\n❌ Backup failed.');
      process.exit(1);
    }
  }

  console.log('');
}
