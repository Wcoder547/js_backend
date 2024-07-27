import mongoose from "mongoose";
import { comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { video } from "../models/video.models.js";

const getVideoComments = AsyncHandler(async (req, res) => {
  try {
    //TODO: get all comments for a video
    const { videoid } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      throw new ApiError(400, "invalid Page Or invalid Limit parameter");
    }
    const skip = (pageNumber - 1) * limitNumber;
    const foundedComments = await comment
      .find({ video: videoid })
      .limit(limitNumber)
      .skip(skip)
      .sort({ createdat: "-1" });
    const totalComment = await comment.countDocuments({ videoid: videoid });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          foundedComments,
          currentPgae: pageNumber,
          totalPage: Math.ceil(totalComment / limitNumber),
          totalComment,
        },
        "successfully fetch all comments"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error || "internal server Error"));
  }
});

const addComment = AsyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  try {
    const { videoid } = req.params;
    const { comment } = req.body;
    if (!videoid) {
      throw new ApiError(400, "videoid Not found");
    }
    if (!comment) {
      throw new ApiError(400, "comment Cannot Empty!!");
    }
    const foundVideo = await video.findById(videoid);
    if (!foundVideo) {
      throw new ApiError(401, "video Not found ");
    }
    const newComment = await comment.create({
      content: comment,
      video: videoid,
      owner: req.user._id,
    });
    if (!newComment) {
      throw new ApiError(500, "cannot add comment due to server error");
    }

    foundVideo.comments.push(newComment._id);
    await foundVideo.save();
    return res
      .status(200)
      .json(new ApiResponse(201, newComment, "successfully added comment"));
  } catch (error) {
    res.status(500).json(new ApiError(500, error || "something went wrong!!"));
  }
});

const updateComment = AsyncHandler(async (req, res) => {
  // TODO: update a comment
  try {
    const { commentid } = req.params;
    const { newComment } = req.body;
    if (!commentid) {
      throw new ApiError(400, "comment ID not found");
    }
    if (!newComment) {
      throw new ApiError(400, "new comment not found");
    }
    const updatedComment = await comment.findByIdAndUpdate(
      commentid,
      { content: newComment },
      {
        new: true,
      }
    );
    if (!updatedComment) {
      throw new ApiError(400, "an error cannot update the comment");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, updatedComment, "update comment successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error || "something went wrong"));
  }
});

const deleteComment = AsyncHandler(async (req, res) => {
  // TODO: delete a comment
  try {
    const { commentid } = req.params;
    if (!commentid) {
      throw new ApiError(404, "comment ID Not found");
    }

    const foundComment = await findByIdAndDelete(commentid);
    if (!foundComment) {
      throw new ApiError(404, "comment not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, foundComment, "comment deleted successfully"));
  } catch (error) {
    return res.status(500).json(500, error || "something went wrong");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
