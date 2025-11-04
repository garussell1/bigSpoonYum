// /api/recipes.js
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongo";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const col = db.collection("recipes");

    if (req.method === "GET") {
      // GET /api/recipes?id=<id> or list
      const { id } = req.query;
      if (id) {
        const doc = await col.findOne({ _id: new ObjectId(id) });
        return res.status(200).json(doc);
      }
      const docs = await col.find({}).sort({ _id: -1 }).limit(50).toArray();
      return res.status(200).json(docs);
    }

    if (req.method === "POST") {
      // POST body: { title, ingredients, instructions }
      const body = JSON.parse(req.body || "{}");
      const now = new Date();
      const result = await col.insertOne({
        title: body.title || "Untitled",
        ingredients: body.ingredients || [],
        instructions: body.instructions || "",
        createdAt: now,
        updatedAt: now,
      });
      return res.status(200).json({ insertedId: result.insertedId });
    }

    if (req.method === "PATCH") {
      // PATCH body: { id, ...fields }
      const body = JSON.parse(req.body || "{}");
      if (!body.id) return res.status(400).json({ error: "Missing id" });
      const { id, ...updates } = body;
      updates.updatedAt = new Date();
      await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      // DELETE body: { id }
      const body = JSON.parse(req.body || "{}");
      if (!body.id) return res.status(400).json({ error: "Missing id" });
      await col.deleteOne({ _id: new ObjectId(body.id) });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET,POST,PATCH,DELETE");
    return res.status(405).end("Method Not Allowed");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
