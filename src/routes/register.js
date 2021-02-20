import { Router } from 'express';
import { register } from '../controllers/auth.js';
import { check } from 'express-validator';

const router = Router();
router.post(
  '/',
  [
    check('email', 'Invalid email address').isEmail(),
    check('first_name', 'first name cannot be empty').isLength({ min: 1 }),
    check('last_name', 'last name cannot be empty').isLength({ min: 1 }),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must contain at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase character')
      .matches(/[a-z]/)
      .withMessage('Password must contain a lowercase character')
      .matches(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/)
      .withMessage('Password must contain one special character'),
  ],
  register
);

export default router;
