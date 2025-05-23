import {Song} from "../models/song.model.js"
import {User} from "../models/user.model.js"
import {Album} from "../models/album.model.js"
export const getStats = async () => {
     async (req, res,next) => {
        try {
    
    
            //this is correct but it do one by one not together
            // const totalSongs=await Song.countDocuments();
            // const totalUsers=await User.countDocuments();
            // const totalAlbums=await Album.countDocuments();
            
            //optimize version
            const [totalSongs,totalUsers,totalAlbums,uniqueArtists]=await Promise.all([
                Song.countDocuments(),
                User.countDocuments(),
                Album.countDocuments(),
    
                Song.aggregate([
                    {
                        $unionWith:{
                            coll:"albums",
                            pipeline:[],
                        },
                    },
                    {
                        $group:{
                            _id:"$artist"
                        
                        },
                    },
                    {
                        $count:"count",
                    
                    },
    
                ]),
            
            ])
            
            res.count(200).json({
                totalAlbums,
                totalSongs,
                totalUsers,
                uniqueArtists: uniqueArtists[0]?.count || 0
            });
    
        } catch (error) {
            console.log("error in state route song :",error);
            
        }
    };
    
}