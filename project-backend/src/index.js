import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import express from "express";
const app = express();

import connectDb from "./db/index.js";
connectDb();

// import { DB_NAME } from "./constans";
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.get("error", (err) => {
//       console.log("Error:", err);
//       throw err;

//       app.listen(process.env.PORT, () => {
//         console.log(`APP is listening on port :${process.env.PORT}`);
//       });
//     });
//   } catch (error) {
//     console.error("ERROR:", error);
//   }
// })();
