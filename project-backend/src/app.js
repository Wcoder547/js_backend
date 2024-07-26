import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

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

export { app };
