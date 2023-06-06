import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected To Mongodb Database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting Mongodb : ${error}`);
  }
};

export default connectDB;
