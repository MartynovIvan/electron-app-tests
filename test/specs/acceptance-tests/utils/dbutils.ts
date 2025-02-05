import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function cleanQueriesTable(): Promise<void> {
  let sqlite3Module;
  try {
    sqlite3Module = await import("sqlite3");
  } catch (e) {
    console.warn("Warning: sqlite3 module not found; skipping queries table cleanup.");
    return;
  }
  const sqlite3 = sqlite3Module.default || sqlite3Module;
  // Go up five levels then into my-electron-app/backend/localStorage/app.db
  const dbPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "my-electron-app",
    "backend",
    "localStorage",
    "app.db"
  );
  console.log(`Debug: using SQLite DB path: ${dbPath}`);
  const verbose = sqlite3.verbose();
  const Database = verbose.Database;
  await new Promise((resolve, reject) => {
    const db = new Database(dbPath, sqlite3.OPEN_READWRITE, (err: Error | null) => {
      if (err) {
        console.error(`Error opening DB at ${dbPath}:`, err);
        return reject(err);
      }
      db.run("DELETE FROM queries", (error: Error | null) => {
        if (error) {
          db.close();
          console.error(`Error cleaning queries table at ${dbPath}:`, error);
          return reject(error);
        }
        db.close();
        resolve(true);
      });
    });
  });
}