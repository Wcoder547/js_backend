import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { like } from "../models/like.models.js";
import { video } from "../models/video.models.js";
import { subScription } from "../models/subscription.models.js";

const getChannelStats = AsyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = AsyncHandler(async (req, res) => {
  try {
    // TODO: Get all the videos uploaded by the channel
    // const { channelId } = req.parms;
    // if (!channelId) {
    //   throw new ApiError(400, "channel not found!!");
    // }
    const allVideo = await video.find();
    if (!allVideo) {
      throw new ApiError(400, "videos not found!!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allVideo, "fetched all video successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error?.message || "internal server errror"));
  }
});

export { getChannelStats, getChannelVideos };
