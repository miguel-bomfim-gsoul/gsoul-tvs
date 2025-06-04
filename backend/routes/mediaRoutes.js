import { Router } from 'express';
import { addMedia, getMediaByTv } from '../controllers/mediaController.js'

const router = Router();

router.post('/', addMedia);
router.get('/:tv_id', getMediaByTv);

export default router;
