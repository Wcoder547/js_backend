import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "video",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "video",
      required: true,
    },
  },
  { timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);

export { comment };
