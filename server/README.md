# Spotify Backend API

A full-stack Spotify clone backend with authentication, music management, and cloud storage integration.

## Features

- 🔐 **JWT Authentication** - Secure user and admin authentication
- 👥 **Role-Based Access Control** - Separate user and admin permissions
- 🎵 **Music Management** - Upload and manage songs and albums
- ☁️ **Cloudinary Integration** - Cloud storage for media files
- 🗄️ **MongoDB Database** - Persistent data storage
- 🚀 **RESTful API** - Clean and organized endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for media storage)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotify-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017
   # or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net

   # Cloudinary Configuration
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Server Configuration
   PORT=4000
   ```

4. **Start the server**
   ```bash
   npm run server
   ```

## Database Setup

### MongoDB Local Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Start MongoDB service
3. The database `spotify` will be created automatically

### Sample Accounts
The system automatically creates sample accounts on startup:

**Admin Account:**
- Email: `admin@spotify.com`
- Password: `admin123`

**User Accounts:**
- Email: `user1@spotify.com` / `user2@spotify.com`
- Password: `user123`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile/picture` - Update profile picture (protected)
- `GET /api/auth/sample-accounts` - Get sample accounts for testing

### Music Management
- `POST /api/song/add` - Add new song (admin only)
- `GET /api/song/get` - Get all songs
- `PUT /api/song/update/:id` - Update song (admin only)
- `DELETE /api/song/delete/:id` - Delete song (admin only)

- `POST /api/album/add` - Add new album (admin only)
- `GET /api/album/get` - Get all albums
- `PUT /api/album/update/:id` - Update album (admin only)
- `DELETE /api/album/delete/:id` - Delete album (admin only)

## Authentication Flow

1. **User Registration**
   ```json
   POST /api/auth/signup
   {
     "username": "john_doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "user"
   }
   ```

2. **User Login**
   ```json
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Protected Requests**
   Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Add them to your `.env` file

## Error Handling

The API includes comprehensive error handling:
- Database connection errors
- Authentication failures
- Validation errors
- File upload errors

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS enabled

## Development

### Running in Development Mode
```bash
npm run server
```

### Environment Variables
Make sure all required environment variables are set in your `.env` file before starting the server.

### Database Connection
The server will automatically connect to MongoDB and create the necessary collections.

### Sample Data
Sample accounts are automatically created on server startup for testing purposes.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your MONGODB_URI in the .env file
- For Atlas, make sure your IP is whitelisted

### Cloudinary Issues
- Verify your Cloudinary credentials
- Check your Cloudinary plan limits
- Ensure proper file formats are uploaded

### Authentication Issues
- Check JWT_SECRET is set
- Verify token expiration
- Ensure proper Authorization header format

## License

This project is licensed under the ISC License. 