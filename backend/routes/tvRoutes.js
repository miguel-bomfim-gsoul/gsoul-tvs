import { Router } from 'express';
import { addTv, getTvById, getallTVs } from '../controllers/tvController.js'

const router = Router();

router.post('/', addTv);
router.get('/', getallTVs);
router.get('/:id', getTvById);

export default router;
