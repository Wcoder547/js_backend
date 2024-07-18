import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  const avatarLocalPath = req.files?.avatar[0]?.path;
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

export default userRegister;
