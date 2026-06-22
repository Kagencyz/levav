import { getDb } from "../api/queries/connection";
import { professions } from "./schema";
import { sql } from "drizzle-orm";

const db = getDb();

async function main() {
  // Count professions
  const profCount = await db.select({ count: sql<number>`count(*)` }).from(professions);
  console.log("Professions seeded:", profCount[0].count);

  // Show categories
  const cats = await db.selectDistinct({ category: professions.category }).from(professions);
  console.log("Categories:", cats.map((c) => c.category).sort().join(", "));

  // Show sample professions
  const sample = await db.select().from(professions).limit(5);
  console.log("\nSample professions:");
  sample.forEach((p) => console.log("  -", p.name, "(", p.category, ")"));
}

main().then(() => process.exit(0)).catch(console.error);
