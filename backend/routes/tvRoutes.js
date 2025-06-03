import { Router } from 'express';
import { addTv, getTvById, getallTVs, deleteTv } from '../controllers/tvController.js'

const router = Router();

router.post('/', addTv);
router.get('/', getallTVs);
router.get('/:id', getTvById);
router.delete('/:id', deleteTv);

export default router;
