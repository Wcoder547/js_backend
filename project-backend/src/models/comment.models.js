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
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "video",
    },
  },
  { timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);

export { comment };
