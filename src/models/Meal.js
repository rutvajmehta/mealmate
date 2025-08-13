import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const MealSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    day: { type: String, enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], required: true },
    ingredients: { type: [String], default: [] }
  },
  { timestamps: true }
);
export default models.Meal || model("Meal", MealSchema);
