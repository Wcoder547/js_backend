import mongoose from "mongoose";
const subTodoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      requird: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
export const subtodo = mongoose.model("subtodo", subTodoSchema);
