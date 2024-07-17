import { config } from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
config();

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
//auth

//user


export default app;