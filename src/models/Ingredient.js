import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const IngredientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    inPantry: { type: Boolean, default: false }
  },
  { timestamps: true }
);
export default models.Ingredient || model("Ingredient", IngredientSchema);
