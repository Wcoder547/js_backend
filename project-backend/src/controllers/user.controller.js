import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userRegister = AsyncHandler(async (req, res) => {
  //   res.status(200).json({
  //     message: "ok",
  //   });
  //Methods we are going to follow in userRegister controller
  //first-we take the input from the user
  //second- validation
  //check if the user is already exsists -if user exsists then send to the Login page
  //check the images - check for avatar
  //upload them into cloudinary
  //create user object -- save into db
  //remove password and refresh token from the response
  // check for user creation
  //return response

  const { fullname, username, email, password } = req.body;
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const exsistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (exsistedUser) {
    throw new ApiError(409, "User Already Exsisted.Please Login");
  }
  //   console.log(req.files);
  let avatarLocalPath = null;
  if (req.files && req.files.avatar && req.files.avatar[0]) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  //   const coverLocalPath = req.files?.coverimage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!!");
  }
  let coverLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverLocalPath = req.files.coverimage[0].path;
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverimage = await uploadOnCloudinary(coverLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!!");
  }
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverimage: coverimage?.url || " ",
  });
  const createdUser = User.findById(user._id).select("-password -refreshtoken");
  if (!createdUser) {
    throw new ApiError(500, "Internal Server Error");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const geneareAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, `${error} cannot produce access and refreshtoken`);
  }
};
const userLogin = AsyncHandler(async (req, res) => {
  //todos
  //req->body = data
  // username& email
  //check the user in database
  // check the password
  // access and refresh token
  // send in cookies

  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "you dont have account.please signup");
  }
  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, "Please provide corrected password");
  }
  const { accessToken, refreshToken } = await geneareAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Successfully Loggedin"
      )
    );
});

const userLogout = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Successfully Loggout"));
});

const refreshAccessToken = AsyncHandler(async (req, res) => {
  try {
    const incomingrefreshToken =
      req.cookie.refreshToken || req.body.refreshToken;
    if (!incomingrefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(
      incomingrefreshToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "invalid refreshToken ");
    }
    if (incomingrefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } = await geneareAccessAndRefreshToken(
      user._id
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const chnageCurrentPassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPass } = req.body;
  if (!(newPassword === confirmPass)) {
    throw new ApiError(400, "please match the old and new password");
  }
  const user = User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized access");
  }
  const ispassMatched = await user.isPasswordCorrect(oldPassword);
  if (!ispassMatched) {
    throw new ApiError(
      400,
      "please input correct passwords. invalid old password"
    );
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(201)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current use fetch successfully"));
});

const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!(email || fullname)) {
    throw new ApiError(401, "all input is required");
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(201)
    .json(
      new ApiResponse(200, updatedUser, "successfully update user details")
    );
});

const updateuserCovwer = AsyncHandler(async (req, res) => {
  const coverLocalPath = req.files?.path;
  if (!coverLocalPath) {
    throw new ApiError(400, "Cover file is missing");
  }
  const cover = await uploadOnCloudinary(coverLocalPath);
  if (!cover.url) {
    throw new ApiError(400, "Error while uploading ...");
  }
  const updatedCover = await User.findById(
    req.user?._id,
    {
      $set: {
        coverimage: cover.url,
      },
    },
    { new: true }
  ).select("-password ");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCover, "CoverImage successfully updated")
    );
});
const updateuserAvatar = AsyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading ...");
  }
  const updatedAvatar = await User.findById(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password ");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAvatar, "avatar successfully updated"));
});

const getuserChannelProfile = AsyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "cannot get username ");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subScriptions", //schema name
        localField: "_id", //subscriber_id
        foreignField: "channel", //channel
        as: "totalSubscriber", //result
      },
    },
    {
      $lookup: {
        from: "subScriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        //addfields use for adding a fields on basis some operations
        subscriberCount: {
          $size: "$totalSubscriber",
        },
        subscribedtoCount: {
          $size: "$subscribedTo",
        },
        isSubscriber: {
          $cond: {
            if: { $in: [req.user?._id, "$totalSubscriber.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverimage: 1,
        subscriberCount: 1,
        subscribedtoCount: 1,
        isSubscriber: 1,
      },
    },
  ]);

  console.log(channel);
  if (!channel?.length) {
    throw new ApiError(400, "user channel does not exisist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel, "user channel data fetch successfully")
    );
});

const getWatchHistory = AsyncHandler(async (req, res) => {
  //req.user?._id //it return us a string not a id...behind the seen string is coverted to moongodb id
  const user = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user?._id), //aggregation pipeline send the data as it is wrriten
      },
    },
    {
      $lookup: {
        from: " videos", // destination ,
        localField: "watchhistory",
        foreignField: "_id",
        as: "watchhistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchhistory,
        "user watchhistory successfully fetched"
      )
    );
});

export {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken,
  chnageCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateuserAvatar,
  updateuserCovwer,
  getuserChannelProfile,
  getWatchHistory,
};
