import { dbConnect } from "../../lib/mongoose";
import Meal from "../../models/Meal";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { userId } = req.query;
      const rows = await Meal.find(userId ? { userId } : {});
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { userId, name, day, ingredients = [] } = req.body || {};
      if (!userId || !name || !day) return res.status(400).json({ error: "userId, name, day required" });
      const created = await Meal.create({ userId, name, day, ingredients });
      return res.status(201).json(created);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "id required" });
      const deleted = await Meal.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET,POST,DELETE");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("MEALS api error:", err);
    const message = err?.message || "Internal Server Error";
    return res.status(500).json({ error: message });
  }
}
