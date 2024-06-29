import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: string,
    },
  },
  { timestamps: true }
);
export const category = mongoose.model("category", categorySchema);
