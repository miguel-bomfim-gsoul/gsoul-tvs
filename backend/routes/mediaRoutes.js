import { Router } from 'express';
import multer from 'multer';
import { addMedia, getMediaByTv, updateMediaOrder, uploadMedia } from '../controllers/mediaController.js'

// Configure Multer (File Upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
});

const router = Router();

router.post('/upload', upload.single('file'), uploadMedia);
router.post('/', addMedia);
router.get('/:tv_id', getMediaByTv);
router.put('/update-order', updateMediaOrder);

export default router;
