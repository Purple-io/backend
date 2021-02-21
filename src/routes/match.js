import { Router } from 'express';
import { findMatch, generateScore } from '../controllers/match.controller.js';

const router = Router();
router.route('/find').post(findMatch);
router.route('/generateScore').post(generateScore);

export default router;
