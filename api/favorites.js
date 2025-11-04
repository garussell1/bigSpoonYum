// /api/favorites.js
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongo.js";

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function getQueryParam(req, key) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get(key);
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const coll = getQueryParam(req, "col") || "favtables"; // your collection
    const col = db.collection(coll);

    if (req.method === "GET") {
      // Expect docs like: { user_id: <auth0 id>, recipe_id: <mongo _id string> }
      const docs = await col.find({}).limit(500).toArray();
      return res.status(200).json(docs);
    }

    if (req.method === "POST") {
      const { user_id, recipe_id } = await readJson(req);
      if (!user_id || !recipe_id) {
        return res.status(400).json({ error: "user_id and recipe_id required" });
      }
      await col.updateOne(
        { user_id, recipe_id },
        { $setOnInsert: { user_id, recipe_id, createdAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { user_id, recipe_id } = await readJson(req);
      if (!user_id || !recipe_id) {
        return res.status(400).json({ error: "user_id and recipe_id required" });
      }
      await col.deleteOne({ user_id, recipe_id });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET,POST,DELETE");
    return res.status(405).end("Method Not Allowed");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
