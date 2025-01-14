import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB at host:", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:\n", error);
    throw error;
  }
};

export { dbConnect };
