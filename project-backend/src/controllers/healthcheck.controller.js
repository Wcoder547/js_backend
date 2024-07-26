import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const healthcheck = AsyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  try {
    return res.status(200).json(new ApiResponse(200, {}, "Everything is ok"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, {}, error.msg || "internal server Errror"));
  }
});

export { healthcheck };
