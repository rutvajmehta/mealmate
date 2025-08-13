import { dbConnect } from "../../lib/mongoose";
import Meal from "../../models/Meal";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const userId = req.query.userId;
    let rows;
    if (userId) {
      rows = await Meal.find({ userId });
    } else {
      rows = await Meal.find();
    }
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const body = req.body;
    if (!body || !body.userId || !body.name || !body.day) {
      return res.status(400).json({ error: "userId, name, day required" });
    }
    const created = await Meal.create({
      userId: body.userId,
      name: body.name,
      day: body.day,
      ingredients: body.ingredients || []
    });
    return res.status(201).json(created);
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "id required" });
    }
    const deleted = await Meal.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "not found" });
    }
    return res.status(204).end();
  }

  return res.status(405).end();
}
