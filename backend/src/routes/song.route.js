import express from 'express';
import { getAllSongs,getFeaturedSongs,getMadeForYouSongs,getTrendingSongs} from '../controller/song.controller.js';
import {protectRoute,requireAdmin} from '../middleware/auth.middleware.js';


const router = express.Router();


router.get('/', protectRoute,requireAdmin,getAllSongs);

router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trendeng", getTrendingSongs);

export default router;  