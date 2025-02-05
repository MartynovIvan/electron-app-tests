import { join } from "path";

export async function cleanQueriesTable(): Promise<void> {
  const sqlite3Module = await import("sqlite3");
  const sqlite3 = sqlite3Module.default || sqlite3Module;
  const dbPath = join(__dirname, "..", "..", "..", "..", "my-electron-app", "backend", "localStorage", "app.db");
  await new Promise((resolve, reject) => {
    const db = new sqlite3.verbose().Database(dbPath, sqlite3.OPEN_READWRITE, (err: Error) => {
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