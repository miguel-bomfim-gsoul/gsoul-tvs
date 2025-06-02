import { Router } from 'express';
import { getUserEmails } from '../controllers/userController.js'

const router = Router();

router.get('/', getUserEmails);

export default router;
