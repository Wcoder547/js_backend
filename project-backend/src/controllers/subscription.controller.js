import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { subScription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const toggleSubscription = AsyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
      throw new ApiError(404, "comment ID not found!!");
    }
    const channel = await subScription.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "channel not found!!");
    }
    const existinguser = await subScription.findOne({
      channel: channelId,
      subscriber: req.user._id,
    });
    if (existinguser) {
      await subScription.deleteOne({
        channel: channelId,
        subscriber: req.user._id,
      });
    } else {
      await subScription.create({
        channel: channelId,
        subscriber: req.user._id,
      });
    }
    const isSubscribed = existinguser ? false : true;
    const subscriber = await User.findById(req.user._id);
    const totalSubscriber = await subscriber.countDocuments({
      channel: channelId,
    });
    return res
      .status(200)
      .json(
        200,
        { isSubscribed, subscriber, totalSubscriber },
        "toggle subscriber functionality fetched successfully"
      );
  } catch (error) {
    return res
      .status(200)
      .json(new ApiError(200, error.message || "internal server error"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = AsyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    if (!isValidObjectId(channelId)) {
      throw new ApiError(404, "comment ID not found!!");
    }
    const channel = await subScription.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "channel not found!!");
    }
    const totalSubscriber = await subScription.find({ channel: channelId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalSubscriber },
          "total subscriber fetch successfully"
        )
      );
  } catch (error) {
    return res
      .status(200)
      .json(new ApiError(200, error.message || "internal server error"));
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = AsyncHandler(async (req, res) => {
  try {
    const { subscriberId } = req.params;
    if (!isValidObjectId(subscriberId)) {
      throw new ApiError(404, "subscriber ID not found!!");
    }
    const subscribed = await subScription.findById(subscriberId);
    if (!subscribed) {
      throw new ApiError(404, "subscribed user not found!!");
    }
    const totalSubscribedUser = await subScription.find({
      subscriber: subscriberId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalSubscribedUser },
          "total subscribed user fetch successfully"
        )
      );
  } catch (error) {
    return res
      .status(200)
      .json(new ApiError(200, error.message || "internal server error"));
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
