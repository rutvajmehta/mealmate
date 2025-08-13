// src/server.js
// require("dotenv").config();
require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- Schema/Model: course "Model (version 1)" adapted for MealMate ---
const mongoose = require("mongoose");

const CS3744Schema = new mongoose.Schema({
  fileName: String,
  fileContent: {
    type: Object,
    properties: {
      title: String,
      data: {
        type: Array,
        items: { type: Object }
      }
    }
  }
});

// Collection name per slides: 'Datasets'
const Datasets = mongoose.model("CS3744Schema", CS3744Schema, "Datasets");

// Seed one dataset document if it doesn't exist
async function ensureSeed() {
  const fileName = "mealmate.json";
  let doc = await Datasets.findOne({ fileName });
  if (!doc) {
    doc = await Datasets.create({
      fileName,
      fileContent: { title: "MealMate", data: [] } // empty meal list
    });
  }
  return doc;
}

// Helper: load the single dataset doc
async function loadDoc() {
  await ensureSeed();
  return Datasets.findOne({ fileName: "mealmate.json" });
}

// ---------- Routes that your React app already uses ----------

// GET /meals  -> return the array stored in fileContent.data
app.get("/meals", async (_req, res) => {
  try {
    const doc = await loadDoc();
    res.json(doc.fileContent.data || []);
  } catch (e) {
    console.error("GET /meals failed:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /meals -> push a new meal entry into fileContent.data
app.post("/meals", async (req, res) => {
  try {
    const doc = await loadDoc();
    const next = { ...req.body };

    // Give each meal a stable id (since we’re storing in an array)
    if (!next._id) next._id = new mongoose.Types.ObjectId().toString();

    const data = Array.isArray(doc.fileContent.data) ? doc.fileContent.data : [];
    data.push(next);

    await Datasets.updateOne(
      { _id: doc._id },
      { $set: { "fileContent.data": data } }
    );

    res.status(201).json(next);
  } catch (e) {
    console.error("POST /meals failed:", e);
    res.status(400).json({ message: e.message || "Create failed" });
  }
});

// PUT /meals/:id -> replace a meal in the array by _id
app.put("/meals/:id", async (req, res) => {
  try {
    const doc = await loadDoc();
    const data = Array.isArray(doc.fileContent.data) ? doc.fileContent.data : [];
    const idx = data.findIndex((m) => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    const updated = { ...req.body, _id: req.params.id };
    data[idx] = updated;

    await Datasets.updateOne(
      { _id: doc._id },
      { $set: { "fileContent.data": data } }
    );
    res.json(updated);
  } catch (e) {
    console.error("PUT /meals failed:", e);
    res.status(400).json({ message: e.message || "Update failed" });
  }
});

// DELETE /meals/:id -> remove from the array by _id
app.delete("/meals/:id", async (req, res) => {
  try {
    const doc = await loadDoc();
    const data = Array.isArray(doc.fileContent.data) ? doc.fileContent.data : [];
    const next = data.filter((m) => m._id !== req.params.id);

    await Datasets.updateOne(
      { _id: doc._id },
      { $set: { "fileContent.data": next } }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error("DELETE /meals failed:", e);
    res.status(400).json({ message: e.message || "Delete failed" });
  }
});

// ---- Connect to Mongo, then start server ----
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API listening on ${port}`));
  } catch (err) {
    console.error("Mongo connect failed:", err.message);
    process.exit(1);
  }
})();