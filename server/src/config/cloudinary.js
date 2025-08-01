import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        const cloudName = process.env.CLOUDINARY_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

        if (!cloudName || !apiKey || !apiSecret) {
            console.warn("⚠️  Cloudinary credentials not found. Image uploads will not work.");
            console.warn("💡 Set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET_KEY in your .env file");
            return;
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // Test the connection
        const result = await cloudinary.api.ping();
        if (result.status === 'ok') {
            console.log("✅ Cloudinary connection established successfully");
        }
        
    } catch (error) {
        console.error("❌ Failed to connect to Cloudinary:", error.message);
        console.error("💡 Check your Cloudinary credentials in the .env file");
    }
}

export default connectCloudinary;