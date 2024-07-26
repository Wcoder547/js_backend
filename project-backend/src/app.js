import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

// import all routes
import userRouter from "./routes/user.routes.js";
import healthRouter from "./routes/healthcheck.routes.js";
import commentRouter from "./routes/comment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subScriptionRouter from "./routes/subscription.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(bodyParser.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
//dashboard routes
app.use("/api/v1/dashboard", dashboardRouter);
//healthcheck routes
app.use("/api/v1/healthCheck", healthRouter);
//user routes
app.use("/api/v1/users", userRouter);
//comment  route
app.use("/api/v1/comment", commentRouter);
//like router
app.use("/api/v1/like", likeRouter);
//playlist router
app.use("/api/v1/playlist", playlistRouter);
// subScription router
app.use("/api/v1/subScription", subScriptionRouter);
// tweet router
app.use("/api/v1/tweet", tweetRouter);
//video router
app.use("/api/v1/video", videoRouter);

export { app };
