import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';
import cloudinary from '../lib/cloudinary.js';

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
        }
    );
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
    }
}
            
export const getAdmin = async (req, res,next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: 'Please upload all files.' });
        }
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;
        const { title, artist, albumId, duration} = req.body;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        
        const song=new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        });
        await song.save();
        if(albumId) {
            await Album.findByIdAndUpdate(albumId, 
                { $push: { songs: song._id } });
        }
        res.status(201).json({ message: 'Song uploaded successfully', song });
            

    } catch (error) {
        console.error('Error uploading song:', error);
        next(error);       
}}

export const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);

        //findByIdAndDelete is perfect but what if this songis in the album 
        //thats why firstly update album;
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            });
        }

        await findByIdAndDelete(id);

        res.status(200).json({ message: 'Song deleted successfully' });


    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

export const createAlbum = async (req, res) => {
    try {
        const { title, artist, songs } = req.body;
        const album = new Album({
            title,
            artist,
            songs,
        });
        await album.save();
        res.status(201).json({ message: 'Album created successfully', album });
    } catch (error) {
        console.error('Error creating album:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}