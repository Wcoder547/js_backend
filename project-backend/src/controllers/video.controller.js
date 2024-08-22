import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const getAllVideos = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Check if user exists (if needed)
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Initialize pipeline
  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ];

  // Handle query for title and description search
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
        isPublished: false,
      },
    });
  }

  // Handle sorting
  const sortCriteria = {};
  if (sortBy && sortType) {
    sortCriteria[sortBy] = sortType === "asc" ? 1 : -1;
  } else {
    sortCriteria["createdAt"] = -1; // Default sorting by `createdAt`
  }
  pipeline.push({ $sort: sortCriteria });

  // Pagination
  pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

  // Execute aggregation pipeline
  const allVideos = await Video.aggregate(pipeline);
  if (!allVideos || allVideos.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No videos found"));
  }

  // Return response with videos
  return res
    .status(200)
    .json(new ApiResponse(200, allVideos, `Total Videos: ${allVideos.length}`));
});

const publishAVideo = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!(title && description)) {
    throw new ApiError(400, "Title and Description required!!");
  }

  const videoUrl = req.file?.video[0]?.path;
  const thumbnailUrl = req.file?.thumbnail[0].path;

  if (!videoUrl) {
    throw new ApiError(400, "Video path is required!!");
  }

  if (!thumbnailUrl) {
    throw new ApiError(400, "Video path is required!!");
  }

  const video = await uploadOnCloudinary(videoUrl);
  const thumbnail = await uploadOnCloudinary(thumbnailUrl);

  const videoData = await Video.create({
    videofile: video?.url,
    thumbnail: thumbnail?.url,
    owner: req.user?._id,
    title: title,
    description: description,
    duration: video.duration,
    views: 0,
    isPublished: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(201, videoData, "Video uploaded successfully"));
});

const getVideoById = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  const userVideo = await Video.findById(videoId);
  console.log(userVideo?.owner.toString());
  console.log(req.user?._id.toString());
  if (
    !userVideo ||
    (!userVideo.isPublished && !userVideo.owner === req.user._id)
  ) {
    throw new ApiError(400, "Video does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userVideo, "Video fetched successfully"));
});

const updateVideo = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video || video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      400,
      "Cannot find the video or you're not authorized to update it"
    );
  }

  const { title, description } = req.body;
  const thumbnailPath = req.file?.path;
  if (!(title && description)) {
    throw new ApiError(400, "Title and description are required for updating");
  }
  let updatedThumbnailUrl = video.thumbnail;
  if (thumbnailPath) {
    updatedThumbnailUrl = await uploadOnCloudinary(thumbnailPath);
    await deleteOnCloudinary(video.thumbnail);
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: updatedThumbnailUrl?.url,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(404, "Video ID not found!!");
  }
  const deletdVideo = await Video.findById(videoId);
  if (
    !deletdVideo ||
    (!deletdVideo.isPublished && !deletdVideo.owner === req.user._id)
  ) {
    throw new ApiError(400, "Video does not exist");
  }
  consolele.log(deletdVideo.videofile);
  await deleteOnCloudinary(deletdVideo.videofile);
  await Video.findByIdAndDelete(videoId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = AsyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(404, "Video ID not found!!");
  }
  const videoExisted = await Video.findById(videoId);
  if (!videoExisted) {
    throw new ApiError(404, "Video does not existed !!");
  }
  if (!videoExisted.owner === req.user._id) {
    throw new ApiError(403, "You are not allowed to toggle");
  }
  // console.log(vedioExisted.isPublished );
  videoExisted.isPublished = !Video.isPublished;
  await videoExisted.save({ validateBeforeSave: false });
  // console.log( vedioExisted.isPublished);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videoExisted.isPublished,
        "togglePublishStatus successfully"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
