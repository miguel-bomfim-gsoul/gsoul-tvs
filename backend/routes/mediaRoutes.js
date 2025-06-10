import { Router } from 'express';
import multer from 'multer';
import {
  addMedia,
  getAllMedias,
  getMediaByTv,
  updateMediaOrder,
  uploadMedia,
  relateMediaTv,
  addSingleMedia,
  deleteMedia
} from '../controllers/mediaController.js'

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

router.get('/medias', getAllMedias);
router.post('/upload', upload.single('file'), uploadMedia);
router.post('/', addMedia);
router.post('/add', addSingleMedia);
router.post('/relate', relateMediaTv);
router.get('/:tv_id', getMediaByTv);
router.put('/update-order', updateMediaOrder);
router.delete('/delete/:media_id', deleteMedia);

export default router;

