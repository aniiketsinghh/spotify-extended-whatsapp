import express from 'express';

import { getStats } from '../controller/stat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';



const router = express.Router();

router.get('/',protectRoute,getStats)

export default router;  