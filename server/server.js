import express from "express"
import cors from 'cors'
import connectCloudinary from "./src/config/cloudinary.js";
import 'dotenv/config'
import connectDB from "./src/config/mongodb.js";
import songRouter from "./src/routes/songRoute.js";
import albumRouter from "./src/routes/albumRoute.js";
import authRouter from "./src/routes/authRoute.js";
import playlistRouter from "./src/routes/playlistRoute.js";

// app config
const app = express()
const port = process.env.PORT || 4000

// Initialize connections
const initializeApp = async () => {
    try {
        // Connect to Cloudinary
        await connectCloudinary()
        
        // Connect to MongoDB
        await connectDB()
        
        console.log("🚀 Server initialization completed!");
    } catch (error) {
        console.error("❌ Failed to initialize server:", error);
        process.exit(1);
    }
}

// Initialize the app
initializeApp();

// middlewares
app.use(express.json())
app.use(cors())

// Initializing Routers
app.use("/api/auth", authRouter)
app.use("/api/song", songRouter )
app.use("/api/album", albumRouter )
app.use("/api/playlist", playlistRouter );

app.get("/", (req, res) => res.send("API Working"))

app.listen(port, () => console.log(`Server started on ${port}`))