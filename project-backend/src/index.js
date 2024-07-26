import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.js";

import connectDb from "./db/index.js";
connectDb()
  .then(() => {
    app.on("Erorr", (err) => {
      console.err("Error:", err);
      throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !! ", err);
  });

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
