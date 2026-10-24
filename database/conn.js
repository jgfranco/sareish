import mongoose from 'mongoose';

// reuse one connection across hot reloads and serverless invocations
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectMongo = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        mongoose.set('strictQuery', true);
        cached.promise = mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;
}

export default connectMongo;
