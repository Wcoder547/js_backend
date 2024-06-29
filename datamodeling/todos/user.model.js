import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      min: [8, "password contain minimum 8 letter"],
      max: 16,
      required: true,
    },
  },
  { timestamps: true }
);
export const user = mongoose.model("user", userSchema);
