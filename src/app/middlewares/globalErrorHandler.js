/* eslint-disable no-unused-vars */
import config from '../../config/index.js';
import ApiError from '../../errors/ApiError.js';
import handelValidationError from '../../errors/handelValidationError.js';
import handleCastError from '../../errors/handleCastError.js';

const globalErrorHandler = (error, req, res, next) => {
	/* config.env === 'development'
    ? console.log('globalErrorHandler ', error)
    : console.log('globalErrorHandler ', error); */
	const endpoint = req.originalUrl; // Capture the API endpoint
	const user_id = req?.user?.userId; // Capture the API endpoint
	const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	config.env === 'development'
		? console.error(
				`globalErrorHandler Api End Point:${endpoint} IP:${clientIp} ${user_id ? `User ID:${user_id}` : ''} ${error}`
			)
		: console.log(
				`globalErrorHandler Api End Point:${endpoint} IP:${clientIp} ${user_id ? `User ID:${user_id}` : ''} ${error}`
			);

	let statusCode = 500;
	let message = 'Something went wrong!';
	let errorMessages = [];

	if (error?.name === 'ValidationError') {
		const simplifiedError = handelValidationError(error);
		statusCode = simplifiedError?.statusCode;
		message = simplifiedError?.message;
		errorMessages = simplifiedError?.errorMessages;
	} else if (error.name === 'CastError') {
		const simplifiedError = handleCastError(error);
		statusCode = simplifiedError?.statusCode;
		message = simplifiedError?.message;
		errorMessages = simplifiedError?.errorMessages;
	} else if (error instanceof ApiError) {
		statusCode = error?.statusCode;
		message = error?.message;
		errorMessages = error?.message
			? [
					{
						path: '',
						message: error?.message,
					},
				]
			: [];
	} else if (error instanceof Error) {
		message = error?.message;
		errorMessages = error?.message
			? [
					{
						path: '',
						message: error?.message,
					},
				]
			: [];
	}

	res.status(statusCode).json({
		success: false,
		message,
		errorMessages,
		stack: config.env !== 'production' ? error?.stack : undefined,
	});
};

export default globalErrorHandler;
