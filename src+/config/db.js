import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Database Error: ${error.message}`);
    // We REMOVED process.exit(1) so the server stays alive!
  }
};

export default connectDB;