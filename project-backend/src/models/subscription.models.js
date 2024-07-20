import mongoose, { Schema } from "mongoose";

const subScriptionScehma = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const subScription = mongoose.model("subScription", subScriptionScehma);

export { subScription };
