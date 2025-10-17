import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// GET /api/auth/me
router.get('/me', authController.getCurrentUser);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;