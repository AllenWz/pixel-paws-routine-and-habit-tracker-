import * as SQLite from 'expo-sqlite';

// Open (or create) the local SQLite database file
const db = SQLite.openDatabaseSync('habit_renewal_tracker.db');

export const initDatabase = () => {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;

      -- 1. Renewal Tasks Table
      CREATE TABLE IF NOT EXISTS renewal_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        frequency_days INTEGER NOT NULL,
        last_executed_at TEXT,
        next_due_at TEXT NOT NULL,
        reminder_time TEXT
      );

      -- 2. Habits Table
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        is_active INTEGER DEFAULT 1
      );

      -- 3. Habit Checklist Items Table
      CREATE TABLE IF NOT EXISTS habit_checklist_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        step_name TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );

      -- 4. Habit Logs Table (tracks daily completion status)
      CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL, -- Format: YYYY-MM-DD
        status TEXT DEFAULT 'pending', -- 'pending' or 'completed'
        finished_at TEXT,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default db;