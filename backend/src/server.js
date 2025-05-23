import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import fileupload from 'express-fileupload';
import path from 'path';

import userRoutes from './routes/user.route.js';    
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import authRoutes from './routes/auth.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import { connectDB } from './lib/db.js';

const app = express();
dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(clerkMiddleware())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}));



app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

app.use((err,req,res,next) => {
    res.status(500).json({message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message});
});


 connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
 });