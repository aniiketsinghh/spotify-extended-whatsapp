import express from 'express';

import { authCallback } from '../controller/auth.controller.js';

const router = express.Router();

router.get('/', authCallback)
export default router;  