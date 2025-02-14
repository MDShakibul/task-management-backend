/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import config from '../../../config/index.js';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { AuthService } from './auth.service.js';

const createUser = catchAsync(async (req, res) => {
	const { ...userInfo } = req.body;

	const result = await AuthService.createUser(userInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'OTP Sent',
		data: result,
	});
});

const signUpVerifyOtp = catchAsync(async (req, res) => {
	const { ...userInfo } = req.body;
	const result = await AuthService.signUpVerifyOtp(userInfo);

	const { refreshToken, ...others } = result;
	const cookieOptions = {
		secure: config.env === 'production',
		httpOnly: true,
	};

	res.cookie('refreshToken', refreshToken, cookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'user created successfully!',
		data: others,
	});
});

const loginUser = catchAsync(async (req, res) => {
	const { ...loginData } = req.body;

	const result = await AuthService.loginUser(loginData);
	const { refreshToken, ...others } = result;

	// set refresh token into cookie
	const cookieOptions = {
		secure: config.env === 'production',
		httpOnly: true,
	};

	res.cookie('refreshToken', refreshToken, cookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User logged in successfully !',
		data: others,
	});
});

const userProfile = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;

	const result = await AuthService.userProfile(userid);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Retrive user profile successfully !',
		data: result,
	});
});

const userUpadteProfile = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;
	const { ...userInfo } = req.body;

	const result = await AuthService.userUpadteProfile(userid, userInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Update user profile successfully !',
		data: 0,
	});
});

const forgotPassword = catchAsync(async (req, res) => {
	const { email } = req.body;

	const result = await AuthService.forgotPassword(email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reset link sent successfully',
		data: 0,
	});
});
const resetPassword = catchAsync(async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;
	const result = await AuthService.resetPassword(token, newPassword);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reset password successfully',
		data: 0,
	});
});

export const AuthController = {
	createUser,
	signUpVerifyOtp,
	loginUser,
	userProfile,
	userUpadteProfile,
	forgotPassword,
	resetPassword,
};
