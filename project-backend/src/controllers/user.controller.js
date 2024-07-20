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
    throw new ApiError(500, "Error !! cannot produce access and refreshtoken");
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
  if (!username || !email) {
    throw new ApiError(400, "Username or Email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "you dont have account.please signup");
  }
  const isPasswordMatched = await User.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, "Please provide corrected password");
  }
  const { accessToken, refreshToken } = geneareAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookies("accessToken", accessToken, options)
    .cookies("refreshToken", refreshToken, options)
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

  return res(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Successfully Loggout"));
});
export { userRegister, userLogin, userLogout };
