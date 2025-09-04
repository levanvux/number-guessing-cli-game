import sqlite3 from "sqlite3";

const db = new sqlite3.Database(
  "./record.sqlite",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
    db.run(
      `
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        difficulty TEXT NOT NULL,
        attempts INTEGER NOT NULL,
        time_taken INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
    );
  }
);

export function saveResult(difficulty, attempts, time_taken) {
  db.run(
    `
        INSERT INTO results (difficulty, attempts, time_taken)
        VALUES (?, ?, ?)`,
    [difficulty, attempts, time_taken]
  );
}

export function getBestRecordByDifficulty(difficulty) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT * FROM results 
        WHERE difficulty = ?
        ORDER BY attempts ASC, time_taken ASC
        LIMIT 1`,
      [difficulty],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

export function closeDatabase() {
  db.close((err) => {
    if (err) return console.error(err.message);
    // console.log("Database connection closed");
  });
}
