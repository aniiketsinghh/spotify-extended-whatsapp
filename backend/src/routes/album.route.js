import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('album route');
});

export default router;  