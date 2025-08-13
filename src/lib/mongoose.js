import mongoose from "mongoose";

let cached = global._mongooseConn || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  try {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      mongoose.set('strictQuery', true);
      cached.promise = mongoose.connect(uri, opts);
    }

    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;