import { Router } from 'express';
import { findMatch } from '../controllers/match.controller.js';

const router = Router();
router.route('/find').get(findMatch);

export default router;
