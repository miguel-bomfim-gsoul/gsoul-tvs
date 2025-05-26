import { Router } from 'express';
import { addMedia, getMediaByTv } from '../controllers/mediaController.js'

const router = Router();

router.post('/', addMedia);
router.get('/:tv_slug', getMediaByTv);

export default router;
