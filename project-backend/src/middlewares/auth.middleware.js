import jwt from "json-web-token";
import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { AsyncHandler } from "../utils/AsyncHandler";

export const verifyJwt = AsyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", " ");

    if (!token) {
      throw new ApiError(401, "UnAuthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password,-refreshToken"
    );

    if (!user) {
      //TODOS discuss about front-end
      throw new ApiError(500, "invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid accessToken ");
  }
});
