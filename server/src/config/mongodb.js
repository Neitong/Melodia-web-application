import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log("✅ MongoDB connection established successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("⚠️  MongoDB connection disconnected");
        });

        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        await mongoose.connect(`${mongoURI}/spotify`);
        
        console.log("🎵 Connected to Spotify database");
        
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        console.error("💡 Make sure MongoDB is running and MONGODB_URI is set correctly");
        process.exit(1);
    }
}

export default connectDB;