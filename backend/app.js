import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import 'dotenv/config.js';
import tvRoutes from './routes/tvRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import userRoutes from './routes/userRoutes.js';

const { json } = pkg;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.use('/tvs', tvRoutes);
app.use('/media', mediaRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});