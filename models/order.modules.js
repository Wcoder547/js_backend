import mongoose from "mongoose";
const productItem = mongoose.model(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orderItme: [productItem],

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: string,
      enum: ["PENDING", "CANCELED", "DELIVERED"],
      default: "PENDING",
    },
    // status: {
    //   type: String,
    //   Enum
    // },
  },
  { timestamps: true }
);
export const order = mongoose.model("order", orderSchema);
