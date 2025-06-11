import express from 'express';
import path from 'path';
import cors from 'cors';
import pkg from 'body-parser';
import 'dotenv/config.js';
import tvRoutes from './routes/tvRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { fileURLToPath } from 'url';
import { startIsActiveJob } from './jobs/updateIsActiveJob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { json } = pkg;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
app.use('/tvs', tvRoutes);
app.use('/media', mediaRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

startIsActiveJob();