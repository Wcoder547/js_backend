import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { like } from "../models/like.models.js";
import { video } from "../models/video.models.js";
import { subScription } from "../models/subscription.models.js";

const getChannelStats = AsyncHandler(async (req, res) => {
  try {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.parms;
    if (!mongoose.isValidObjectId(channelId)) {
      throw new ApiError(400, "channel ID not found!!");
    }
    const totalVideos = await video.countDocuments({ owner: channelId });
    const totalSubscribers = await subScription.countDocuments({
      channel: channelId,
    });
    const totlaViews = await video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      {
        $match: {
          views: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$views",
          totalView: {
            $sum: "$views",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalView: 1,
        },
      },
    ]);
    const totalVideoView = totlaViews[0];
    const totalLikes = await like.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "allVideo",
        },
      },
      {
        $unwind: "$allvideo",
      },
      {
        $match: {
          "allvideo.owner": new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $group: {
          _id: null,
          allLikes: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: null,
          allLikes: 1,
        },
      },
    ]);
    const totalVideoLikes = totalLikes[0];
    return res.status(200).json(
      new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totlaViews,
        totalVideoView,
        totalLikes,
        totalVideoLikes,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "internal server errror"));
  }
});
const getChannelVideos = AsyncHandler(async (req, res) => {
  try {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.parms;
    const { page = 1, limit = 10 } = req.query;
    if (!mongoose.isValidObjectId(channelId)) {
      throw new ApiError(400, "channel not found!!");
    }
    const allVideo = await video.aggregatePaginate(
      { channel: channelId },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: createdAt("desc"),
        customLabels: {
          docs: allVideo,
        },
      }
    );
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
