import mongoose, { isValidObjectId } from "mongoose";
import { tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createTweet = AsyncHandler(async (req, res) => {
  try {
    //TODO: create tweet
    const { content } = req.body;
    if (!content.trim()) {
      throw new ApiError(200, "tweet content is required!!");
    }
    if (!isValidObjectId(req.user._id)) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const addTweet = await tweet.create({
      content,
      owner: req.user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { addTweet }, "tweet added successfully"));
  } catch (error) {
    throw new ApiError(200, error.message || "internal server error");
  }
});

const getUserTweets = AsyncHandler(async (req, res) => {
  try {
    // TODO: get user tweets
    const { userId } = req.params;
    i;
    if (!userId) {
      throw new ApiError(404, "User ID not found");
    }
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid User id");
    }

    const totalTweets = await tweet.find({ owner: userId });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { totalTweets }, "all Tweet fetched successfully")
      );
  } catch (error) {
    throw new ApiError(200, error.message || "internal server error");
  }
});

const updateTweet = AsyncHandler(async (req, res) => {
  try {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { newContent } = req.body;
    if (!tweetId) {
      throw new ApiError(404, "tweetId not found");
    }
    if (!newContent.trim()) {
      throw new ApiError(404, "please fill field of updated comment!!");
    }
    const updatedTweet = await tweet.findByIdAndUpdate(
      tweetId,
      { content: newContent.trim() },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, { updatedTweet }, "tweet updated successfully")
      );
  } catch (error) {
    throw new ApiError(200, error.message || "internal server error");
  }
});

const deleteTweet = AsyncHandler(async (req, res) => {
  try {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!tweetId) {
      throw new ApiError(404, "tweetId not found");
    }
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweet id");
    }

    const deletedTweet = await tweet.findByIdAndDelete(tweetId);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { deletedTweet }, "tweet deleted successfully")
      );
  } catch (error) {
    throw new ApiError(200, error.message || "internal server error");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
