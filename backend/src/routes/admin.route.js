import express from 'express';
import { getAdmin , deleteSong,createAlbum,deleteAlbum,checkAdmin} from '../controller/admin.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute, requireAdmin);

router.get('/check',checkAdmin);

router.post('/songs',getAdmin);
router.delete('/songs/:id',deleteSong);

router.post('/albums',createAlbum);
router.delete('/albums/:id',deleteAlbum);
export default router;  