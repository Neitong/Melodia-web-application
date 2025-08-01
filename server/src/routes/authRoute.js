import express from 'express';
import { login, signup, getProfile, getSampleAccounts, updateProfilePicture } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/sample-accounts', getSampleAccounts);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/picture', authenticateToken, updateProfilePicture);

export default router; 