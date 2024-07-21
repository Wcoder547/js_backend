import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverimage", maxCount: 1 },
]); //this will upload only one avatar and one coverimage

router.route("/register").post(cpUpload, userRegister);
router.route("/login").post(userLogin);

//Secured Routes
router.route("/logout").post(verifyJwt, userLogout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, chnageCurrentPassword);
router.route("/cuurent-user").get(verifyJwt, getCurrentUser);
router.route("/update-account-details").patch(verifyJwt, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateuserAvatar);
router
  .route("/update-coverImage")
  .patch(verifyJwt, upload.single("coverimage"), updateuserCovwer);
router
  .route("/channel-profile/:username")
  .get(verifyJwt, getuserChannelProfile);
router.route("/watch-history").get(verifyJwt, getWatchHistory);

export default router;
