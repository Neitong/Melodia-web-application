import express from 'express';
import { addPlaylist, listPlaylists, getPlaylistById, addSongToPlaylist } from '../controllers/playlistController.js';
import upload from '../middleware/multer.js';

const playlistRouter = express.Router();

// Create playlist (with image upload)
playlistRouter.post('/add', upload.fields([{ name: 'image', maxCount: 1 }]), addPlaylist);
// List all playlists
playlistRouter.get('/list', listPlaylists);
// Get playlist by ID
playlistRouter.get('/:id', getPlaylistById);
// Add song to playlist
playlistRouter.post('/add-song', addSongToPlaylist);

export default playlistRouter; 