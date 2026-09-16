import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  skipUntil: number;
};

const globalWithMongo = globalThis as typeof globalThis & {
  mongooseCache?: Cached;
};

const cached: Cached = globalWithMongo.mongooseCache ?? {
  conn: null,
  promise: null,
  skipUntil: 0,
};

globalWithMongo.mongooseCache = cached;

export async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cached.conn) return cached.conn;
  if (Date.now() < cached.skipUntil) {
    throw new Error("MongoDB is temporarily unavailable");
  }

  cached.promise ??= mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
  });

  try {
    cached.conn = await cached.promise;
    cached.skipUntil = 0;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    cached.skipUntil = Date.now() + 60_000;
    throw error;
  }
}
