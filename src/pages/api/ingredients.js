import { dbConnect } from "../../lib/mongoose";
import Ingredient from "../../models/Ingredient";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const userId = req.query.userId;
    let rows;
    if (userId) {
      rows = await Ingredient.find({ userId });
    } else {
      rows = await Ingredient.find();
    }
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const body = req.body;
    if (!body || !body.userId || !body.name) {
      return res.status(400).json({ error: "userId and name required" });
    }
    const created = await Ingredient.create({
      userId: body.userId,
      name: body.name,
      inPantry: Boolean(body.inPantry),
    });
    return res.status(201).json(created);
  }

  if (req.method === "PATCH") {
    const body = req.body;
    if (!body || !body.id) {
      return res.status(400).json({ error: "id required" });
    }
    const updated = await Ingredient.findByIdAndUpdate(
      body.id,
      { inPantry: body.inPantry },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "not found" });
    }
    return res.status(200).json(updated);
  }

  return res.status(405).end();
}
