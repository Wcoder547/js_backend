import mongoose, { isValidObjectId } from "mongoose";
import { playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    //TODO: create playlist
    if ([name, description].some((field) => field.trim() === "")) {
      throw new ApiError(
        400,
        "All fields is required i.e name and description"
      );
    }
    const addPlaylist = await playlist.create({
      name,
      description,
      owner: req.user._id,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { addPlaylist },
          "playlist is  created successfully!!"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

const getUserPlaylists = AsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "user ID not found");
    }
    const playlistFound = await playlist.find({ owner: userId });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { playlistFound }, "playlist fetched successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

const getPlaylistById = AsyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
    }

    const playlistBId = await playlist.findById(playlistId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { playlistBId },
          "Playlist is fetched successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

const addVideoToPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    if (!videoId) {
      throw new ApiError(400, "Invalid video ID");
    }
    const addInPlaylist = await playlist.findByIdAndUpdate(
      playlistId,
      { $push: { video: videoId } },
      { new: true }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { addInPlaylist },
          "video is added in playlist successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

const removeVideoFromPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    if (!videoId) {
      throw new ApiError(400, "Invalid video ID");
    }
    const removeInPlaylist = await playlist.findByIdAndDelete(
      playlistId,
      { $pull: { video: videoId } },
      { new: true }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { removeInPlaylist },
          "video is removed in playlist successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

const deletePlaylist = AsyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "playlist not found!!");
    }
    const removedPlaylist = await playlist.findByIdAndDelete(playlist);
    if (!removedPlaylist) {
      throw new ApiError(400, "playlsit not deleted!!");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { removedPlaylist },
          "playlist is removed successfully!!"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

const updatePlaylist = AsyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
    }
    if ([name, description].some((field) => field.trim() === "")) {
      throw new ApiError(
        400,
        "All fields is required i.e name and description"
      );
    }
    const updatedPlaylistawait = await playlist.findByIdAndUpdate(
      playlist,
      { $set: { name, description } },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedPlaylistawait },
          "playlist is updated successfully!!"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"));
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
