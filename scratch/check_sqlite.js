import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function checkSqlite() {
  try {
    const dbPath = path.join(process.cwd(), 'backend', 'placement.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table';");
    console.log('SQLite Tables:', tables.map(t => t.name));

    for (const t of tables) {
      const rows = await db.all(`SELECT * FROM ${t.name} LIMIT 20`);
      console.log(`\n--- SQLite Table ${t.name} (${rows.length} rows) ---`);
      console.log(rows);
    }
  } catch (err) {
    console.error('SQLite check error:', err.message);
  }
}

checkSqlite();
