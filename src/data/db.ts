import mongoose from "mongoose";
import { MONGO_URI } from "../common/privateKeys.js";

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("Please provide a valid MongoDB URI");
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
