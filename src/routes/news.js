import { Router } from 'express';
import { getNews } from '../controllers/news.controller.js';

const router = Router();
router.route('/').get(getNews);

export default router;
