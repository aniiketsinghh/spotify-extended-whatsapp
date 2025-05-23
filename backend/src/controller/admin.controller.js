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
        //just taking the file from req.files through user
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: 'Please upload all files.' });
        }
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;
        const { title, artist, albumId, duration} = req.body;

        //here we are uploading the files to cloudinary
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

export const deleteSong = async (req, res,next) => {
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

export const createAlbum = async (req, res,next) => {
    try {
        const { title, artist, releaseYear } = req.body;

        const { imageFile } = req.files;
        if (!imageFile) {
            return res.status(400).json({ message: 'Please upload an image file.' });
        }
        const imageUrl = await uploadToCloudinary(imageFile);
        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        });
        await album.save();
        res.status(201).json({ message: 'Album created successfully', album });
    } catch (error) {
        console.error('Error creating album:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteAlbum = async (req, res,next) => {
    try {
        const { id } = req.params;
        await Album.deleteMany({albumId: id});
        const album = await Album.findByIdAndDelete(id);
        res.status(200).json({ message: 'Album deleted successfully' });
    } catch (error) {
        console.error('Error deleting album:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const checkAdmin = async (req, res) => {
    try {
        res.status(200).json({admin:true});
    } catch (error) {
        console.error('Error checking admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}