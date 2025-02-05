import { join } from "path";

export async function cleanQueriesTable(): Promise<void> {
  let sqlite3Module;
  try {
    sqlite3Module = await import("sqlite3");
  } catch (e) {
    console.warn("Warning: sqlite3 module not found; skipping queries table cleanup.");
    return;
  }
  const sqlite3 = sqlite3Module.default || sqlite3Module;
  // Compute DB path using process.cwd(). In our pipeline, process.cwd() is expected to be
  // /Users/runner/work/electron-app-tests/electron-app-tests so that going one level up reaches
  // /Users/runner/work/electron-app-tests, where my-electron-app is a sibling.
  const dbPath = join(process.cwd(), "..", "my-electron-app", "backend", "localStorage", "app.db");
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