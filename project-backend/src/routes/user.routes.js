import { Router } from "express";
import userRegister from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverimage", maxCount: 1 },
]); //this will upload only one avatar and one coverimage

router.route("/register").post(cpUpload, userRegister);
export default router;
