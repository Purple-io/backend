import { Router } from 'express';
import { register } from '../controllers/auth.js';
import { check } from 'express-validator';

const router = Router();
router.route('/').post(register);

export default router;
