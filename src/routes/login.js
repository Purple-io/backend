import { Router } from 'express';
import { login } from '../controllers/auth.js';

const router = Router();
router.route('/').post(login);

export default router;
