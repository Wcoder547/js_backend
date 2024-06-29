import mongoose from "mongoose";

const addressSchema = mongoose.model(
  {
    city: {
      type: String,
    },
    countery: {
      type: string,
    },
    phone: {
      type: string,
    },
    postalcode: {
      type: string,
    },
  },
  { timestamps: true }
);
const UserSchema = new mongoose.Schema(
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
      required: true,
    },
    address: [addressSchema],
  },
  { timestamps: true }
);
export const user = mongoose.Model("user", UserSchema);
