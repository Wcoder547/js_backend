import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller";

const router = Router();
router.use(verifyJwt);

router.use("/:videoid").get(getVideoComments).post(addComment);
router.use("/c/:commentId").delete(deleteComment).patch(updateComment);
