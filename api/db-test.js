// /api/db-test.js
import { getDb } from "../lib/mongo";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    // ping via a no-op command
    const admin = db.admin();
    await admin.ping();
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
