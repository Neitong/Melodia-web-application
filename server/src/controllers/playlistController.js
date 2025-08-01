import { v2 as cloudinary } from 'cloudinary';
import playlistModel from '../models/playlistModel.js';
import songModel from '../models/songModel.js';

// Create a new playlist
export const addPlaylist = async (req, res) => {
    try {
        const { name, desc, user } = req.body;
        const imageFile = req.files.image[0];
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const playlistData = {
            name,
            desc,
            image: imageUpload.secure_url,
            user,
            songs: []
        };
        const playlist = new playlistModel(playlistData);
        await playlist.save();
        res.json({ success: true, message: "Playlist Created", playlist });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List all playlists
export const listPlaylists = async (req, res) => {
    try {
        const playlists = await playlistModel.find({}).populate('user', 'username').populate('songs');
        res.json({ success: true, playlists });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get a playlist by ID
export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await playlistModel.findById(req.params.id).populate('user', 'username').populate('songs');
        if (!playlist) return res.json({ success: false, message: 'Playlist not found' });
        res.json({ success: true, playlist });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add a song to a playlist
export const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        const playlist = await playlistModel.findById(playlistId);
        if (!playlist) return res.json({ success: false, message: 'Playlist not found' });
        const song = await songModel.findById(songId);
        if (!song) return res.json({ success: false, message: 'Song not found' });
        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            await playlist.save();
        }
        res.json({ success: true, playlist });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}; 