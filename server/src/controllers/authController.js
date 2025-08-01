import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Hardcoded sample accounts
const SAMPLE_ACCOUNTS = [
    {
        username: 'artist',
        email: 'admin@spotify.com',
        password: 'admin123',
        role: 'artist'
    },
    {
        username: 'user1',
        email: 'user1@spotify.com',
        password: 'user123',
        role: 'user'
    },
    {
        username: 'user2',
        email: 'user2@spotify.com',
        password: 'user123',
        role: 'user'
    }
];

// Initialize sample accounts
const initializeSampleAccounts = async () => {
    try {
        // Wait a bit for MongoDB connection to be established
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (const account of SAMPLE_ACCOUNTS) {
            const existingUser = await userModel.findOne({ email: account.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(account.password, 12);
                await userModel.create({
                    username: account.username,
                    email: account.email,
                    password: hashedPassword,
                    role: account.role
                });
                console.log(`✅ Sample ${account.role} account created: ${account.email}`);
            } else {
                console.log(`ℹ️  Sample ${account.role} account already exists: ${account.email}`);
            }
        }
        console.log('🎵 Sample accounts initialization completed!');
    } catch (error) {
        console.error('❌ Error initializing sample accounts:', error.message);
        if (error.name === 'MongoNetworkError') {
            console.error('💡 Make sure MongoDB is running and accessible');
        }
    }
};

// Call initialization after a delay to ensure DB connection
setTimeout(initializeSampleAccounts, 1000);

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

// Register new user
export const signup = async (req, res) => {
    try {
        const { username, email, password, role = 'user', profilePicture } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role,
            profilePicture: profilePicture || ''
        });

        // Generate token
        const token = generateToken(newUser._id, newUser.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    profilePicture: newUser.profilePicture
                },
                token
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update user profile picture
export const updateProfilePicture = async (req, res) => {
    try {
        const { userId } = req;
        const { profilePicture } = req.body;

        if (!profilePicture) {
            return res.status(400).json({
                success: false,
                message: 'Profile picture URL is required'
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profilePicture },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: { user: updatedUser }
        });

    } catch (error) {
        console.error('Update profile picture error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get sample accounts info (for testing)
export const getSampleAccounts = async (req, res) => {
    try {
        const sampleAccounts = SAMPLE_ACCOUNTS.map(account => ({
            username: account.username,
            email: account.email,
            password: account.password,
            role: account.role
        }));

        res.status(200).json({
            success: true,
            message: 'Sample accounts for testing',
            data: { sampleAccounts }
        });

    } catch (error) {
        console.error('Get sample accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 