import express from 'express';
import { AuthController } from './auth.controller.js';
import auth from '../../middlewares/auth.js';
import { ENUM_USER_ROLE } from '../../../enums/user.js';

const router = express.Router();

router.post('/signup', AuthController.createUser);
router.post('/signup-verify-otp', AuthController.signUpVerifyOtp);
router.post('/login', AuthController.loginUser);
router.get('/profile', auth(ENUM_USER_ROLE.USER), AuthController.userProfile);
router.put('/profile', auth(ENUM_USER_ROLE.USER), AuthController.userUpadteProfile);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);

export const AuthRoutes = router;
