import mongoose from "mongoose";
const salesSchema = new mongoose.Schema({}, { timestamps: true });
export const sales = mongoose.model("sales", salesSchema);
