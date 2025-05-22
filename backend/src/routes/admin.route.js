import express from 'express';
import { getAdmin , deleteSong,createAlbum} from '../controller/admin.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/songs',protectRoute,requireAdmin,getAdmin);
router.delete('/songs/:id',protectRoute,requireAdmin,deleteSong);
router.post('/albums',protectRoute,requireAdmin,createAlbum);

export default router;  