import mongoose, { isValidObjectId } from "mongoose";
import { like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { comment } from "../models/comment.models.js";
import { tweet } from "../models/tweet.models.js";
import { video } from "../models/video.models.js";

const toggleVideoLike = AsyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "video ID not found!!");
    }
    const videoFound = await video.findById(videoId);
    if (!videoFound) {
      throw new ApiError(404, "Video not found!!");
    }
    const exsistuser = await like.findOne({
      video: videoId,
      likedBy: req.user?._id,
    });
    if (exsistuser) {
      await like.deleteOne({ video: videoId, likedBy: req.user?._id });
    } else {
      await like.create({ video: videoId, likedBy: req.user?._id });
    }
    const hasLiked = exsistuser ? false : true;
    const totalLikes = await like.countDocuments({
      video: videoId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { hasLiked, totalLikes },
          "toggle videoLike is fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "internal server error"));
  }
});

const toggleCommentLike = AsyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
      throw new ApiError(404, "comment ID not found!!");
    }
    const commentFound = await comment.findById(commentId);
    if (!commentFound) {
      throw new ApiError(404, "comment not found!!");
    }
    const exsistuser = await like.findOne({
      comment: commentId,
      likedBy: req.user?._id,
    });
    if (exsistuser) {
      await like.deleteOne({ comment: commentId, likedBy: req.user?._id });
    } else {
      await like.updateOne({ comment: commentId, likedBy: req.user?._id });
    }
    const hasLiked = exsistuser ? false : true;
    const totalLikes = await like.countDocuments({
      comment: commentId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { hasLiked, totalLikes },
          "toggle commentLike is fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "internal server error"));
  }
});

const toggleTweetLike = AsyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(404, "tweet ID not found!!");
    }
    const tweetFound = await tweet.findById(tweetId);
    if (!tweetFound) {
      throw new ApiError(404, "tweet not found!!");
    }
    const exsistuser = await like.findOne({
      tweet: tweetId,
      likedBy: req.user?._id,
    });
    if (exsistuser) {
      await like.deleteOne({ tweet: tweetId, likedBy: req.user?._id });
    } else {
      await like.updateOne({ tweet: tweetId, likedBy: req.user?._id });
    }
    const hasLiked = exsistuser ? false : true;
    const totalLikes = await like.countDocuments({
      tweet: tweetId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { hasLiked, totalLikes },
          "tweet like is fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "internal server error"));
  }
});

const getLikedVideos = AsyncHandler(async (req, res) => {
  try {
    //TODO: get all liked videos
    const allLikedVideos = await like
      .find({
        likedBy: req.user?._id,
        video: { $exists: true },
      })
      .populate("video"); //it has the refrence the videos which existed..and populate will replace the videos with the orignal videos and show them
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { allLikedVideos },
          "AlllikedVideos is fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "internal server error"));
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
