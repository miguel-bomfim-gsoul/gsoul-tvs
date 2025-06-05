import { Router } from 'express';
import { addMedia, getMediaByTv, updateMediaOrder } from '../controllers/mediaController.js'

const router = Router();

router.post('/', addMedia);
router.get('/:tv_id', getMediaByTv);
router.put('/update-order', updateMediaOrder);

export default router;
