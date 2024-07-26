import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file
//return subscriber list of a channel
router
  .route("/c/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

//   return channel list to which user has subscribed
router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router;
