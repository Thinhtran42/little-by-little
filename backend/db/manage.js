import { connectDatabase, migrate } from "./index.js";
import { seed } from "./seed.js";
const db = await connectDatabase();
try {
  await migrate(db);
  if (process.argv[2] === "seed") await seed(db);
  if (process.argv[2] === "admin") {
    const email = process.argv[3]?.trim().toLowerCase();
    if (!email)
      throw new Error(
        "Usage: node --env-file-if-exists=.env backend/db/manage.js admin you@example.com",
      );
    const r = await db.query(
      "UPDATE users SET role='admin' WHERE email=$1 RETURNING id",
      [email],
    );
    if (!r.rows.length) throw new Error("Register this account first.");
    console.log("Admin role updated.");
  }
  console.log(`Database command complete (${db.kind}).`);
} finally {
  await db.close();
}
