import mongoose from "mongoose";

let connected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB not found");

  if (connected) return console.log("Mongoose is already connected");
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    connected = true;
    console.log("Mongoose is connected!");
  } catch (error) {
    console.log(error);
  }
};
