import mongoose from "mongoose";
import { DB_NAME } from "../constans.js";
const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB CONNECTD !! HOST DB:${connectionInstance.connection.host}`
    ),
      { useNewUrlParser: true, useUnifiedTopoly: true };
  } catch (error) {
    console.log("MONGO DB CONNECTION Error:", error);
    process.exit(1);
  }
};

export default connectDb;
