/**
 * ============================================================
 * AGENT 20 — BACKEND ROUTER REGISTRY TEST
 * ============================================================
 * Verifies all tRPC routers are registered by analyzing
 * the router.ts source code directly.
 * ============================================================
 */

import * as fs from "fs";
import * as path from "path";

const routerPath = path.resolve(process.argv[1], "../../router.ts");
const routerCode = fs.readFileSync(routerPath, "utf-8");

/* Extract router registrations: routerName: routerVariable or inline queries */
const registrations: { key: string; variable: string }[] = [];
const regex = /(\w+):\s*(\w+Router)/g;
let match;
while ((match = regex.exec(routerCode)) !== null) {
  registrations.push({ key: match[1], variable: match[2] });
}
/* Also catch inline definitions like ping: publicQuery.query(...) */
const inlineRegex = /(\w+):\s*(publicQuery|authedQuery|adminQuery)/g;
while ((match = inlineRegex.exec(routerCode)) !== null) {
  if (!registrations.find((r) => r.key === match[1])) {
    registrations.push({ key: match[1], variable: "(inline)" });
  }
}

const EXPECTED = [
  "ping", "auth", "localAuth", "profile", "profession", "wri",
  "levavCode", "employer", "job", "quickwork", "impact", "volunteer",
  "notification", "ai", "wallet", "course", "search", "advisor",
  "badge", "application", "message", "whatsapp", "feed", "payment",
  "certificate", "analytics", "referral", "push", "interview",
  "champions", "creator",
];

const found = new Set(registrations.map((r) => r.key));
let errors = 0;

console.log("\n============================================================");
console.log("  LEVAV BACKEND — 20-AGENT SWARM REGISTRY TEST");
console.log("============================================================");
console.log(`  Source: api/router.ts`);
console.log(`  Registered Routers: ${registrations.length}`);
console.log("============================================================\n");

for (const r of registrations) {
  console.log(`  [OK]  ${r.key.padEnd(20)} -> ${r.variable}`);
}

console.log("\n============================================================");
console.log("  EXPECTED ROUTER CHECK");
console.log("============================================================");

for (const router of EXPECTED) {
  if (found.has(router)) {
    console.log(`  [PASS] ${router}`);
  } else {
    console.log(`  [FAIL] ${router} — NOT REGISTERED`);
    errors++;
  }
}

/* Also check for unexpected routers */
for (const reg of registrations) {
  if (!EXPECTED.includes(reg.key)) {
    console.log(`  [WARN] ${reg.key} — UNEXPECTED (not in expected list)`);
  }
}

/* Count endpoints per router by scanning router files */
let totalEndpoints = 0;
const routersDir = path.resolve(process.argv[1], "../../routers");
for (const reg of registrations) {
  // Find the router file
  const possibleFiles = [
    path.join(routersDir, `${reg.key}-router.ts`),
    path.join(routersDir, `${reg.key}s-router.ts`),
    path.join(path.dirname(routerPath), `${reg.key}-router.ts`),
    path.join(path.dirname(routerPath), `local-${reg.key}-router.ts`),
    path.join(path.dirname(routerPath), `${reg.key}Router.ts`),
  ];
  // Try matching by variable name
  const varPattern = reg.variable.replace("Router", "").replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
  possibleFiles.push(
    path.join(routersDir, `${varPattern}-router.ts`),
    path.join(routersDir, `${varPattern}s-router.ts`),
  );

  let foundFile = false;
  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      const code = fs.readFileSync(file, "utf-8");
      const queryCount = (code.match(/\.query\(/g) || []).length;
      const mutationCount = (code.match(/\.mutation\(/g) || []).length;
      totalEndpoints += queryCount + mutationCount;
      foundFile = true;
      break;
    }
  }
}

console.log("\n============================================================");
console.log(`  Total Endpoints (estimated): ${totalEndpoints}`);
console.log(`  Missing Routers: ${errors}`);
console.log("============================================================");
console.log(errors === 0 ? "  ALL ROUTERS REGISTERED — SWARM CLEAR\n" : `  ${errors} GAPS FOUND — SWARM INCOMPLETE\n`);

process.exit(errors > 0 ? 1 : 0);
