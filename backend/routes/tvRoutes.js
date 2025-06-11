import { Router } from 'express';
import { addTv, getTvById, getallTVs, deleteTv, getRelatedTvs, updateTvName } from '../controllers/tvController.js'

const router = Router();

router.post('/', addTv);
router.get('/', getallTVs);
router.get('/related/:id', getRelatedTvs);
router.get('/:id', getTvById);
router.put('/name', updateTvName);
router.delete('/:id', deleteTv);

export default router;
