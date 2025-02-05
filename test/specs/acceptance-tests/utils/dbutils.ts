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
  const dbPath = join(__dirname, "..", "..", "..", "..", "my-electron-app", "backend", "localStorage", "app.db");
  await new Promise((resolve, reject) => {
    const db = new sqlite3.verbose().Database(dbPath, sqlite3.OPEN_READWRITE, (err: Error | null) => {
      if (err) {
        return reject(err);
      }
      db.run("DELETE FROM queries", (error: any) => {
        if (error) {
          db.close();
          return reject(error);
        }
        db.close();
        resolve(true);
      });
    });
  });
}