import { dbConnect } from "../../lib/mongoose";
import Ingredient from "../../models/Ingredient";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { userId } = req.query;
      const rows = await Ingredient.find(userId ? { userId } : {});
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { userId, name, inPantry = false } = req.body || {};
      if (!userId || !name) return res.status(400).json({ error: "userId, name required" });
      const created = await Ingredient.create({ userId, name, inPantry });
      return res.status(201).json(created);
    }

    if (req.method === "PATCH") {
      const { id, inPantry } = req.body || {};
      if (!id) return res.status(400).json({ error: "id required" });
      const updated = await Ingredient.findByIdAndUpdate(id, { inPantry }, { new: true });
      if (!updated) return res.status(404).json({ error: "not found" });
      return res.status(200).json(updated);
    }

    res.setHeader("Allow", "GET,POST,PATCH");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("INGREDIENTS api error:", err);
    const message = err?.message || "Internal Server Error";
    return res.status(500).json({ error: message });
  }
}
