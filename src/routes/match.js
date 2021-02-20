import { Router } from 'express';
import { findMatch } from '../controllers/match.controller.js';

const router = Router();
router.route('/find').post(findMatch);

export default router;
