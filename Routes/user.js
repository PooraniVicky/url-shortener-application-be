import express from 'express';
import { signup, login, forgotPassword, resetPassword, activateUser } from '../Controllers/usercontrollers.js';

const router = express.Router();

// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/activate/:token', activateUser);

export default router;
