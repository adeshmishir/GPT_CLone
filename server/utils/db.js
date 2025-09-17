import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ensure env vars are loaded when this module runs

const MONGOURI = process.env.MONGOURI;

let isConnected = false;

export async function connectDB() {
  console.log("MONGOURI from .env:", MONGOURI); // debug - remove later

  if (!MONGOURI) {
    throw new Error("MONGOURI is not defined. Check your .env file.");
  }

  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
