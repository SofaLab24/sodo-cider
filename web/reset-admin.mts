// reset-admin.mts (run with: npx tsx reset-admin.mts)
import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config.js";

const email = process.argv[2] ?? "you@example.com";
const password = process.argv[3];
if (!password) {
  console.error("Usage: npx tsx reset-admin.mts <email> <new-password>");
  process.exit(1);
}

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
});
if (!docs.length) {
  console.error("No user with that email.");
  process.exit(1);
}
await payload.update({
  collection: "users",
  id: docs[0].id,
  data: { password },
  overrideAccess: true,
});
console.log("Password updated for", email);
process.exit(0);