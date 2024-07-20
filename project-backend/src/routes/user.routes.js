import { Router } from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken,
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
export default router;
