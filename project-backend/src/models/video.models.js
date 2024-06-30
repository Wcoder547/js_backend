import mongoose, { Aggregate, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videofile: {
      type: String,
      required: true,
    },
    thumbnail: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { tyep: Boolean, default: true },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate);
export const video = mongoose.model("video", videoSchema);
