import { Router } from 'express';
import { register } from '../controllers/auth.js';

const router = Router();
router.route('/').post(register);

export default router;
