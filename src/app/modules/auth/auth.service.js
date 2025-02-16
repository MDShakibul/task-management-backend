/* eslint-disable no-unused-vars */
/* import { JwtPayload, Secret } from 'jsonwebtoken'; */
import bcrypt from 'bcrypt';
import config from '../../../config/index.js';
import ApiError from '../../../errors/ApiError.js';
import { getConnection } from '../../../helpers/db.js';
import { jwtHelpers } from '../../../helpers/jwtHelpers.js';
import { utils } from '../../../helpers/utils.js';

const createUser = async (payload) => {
	const conn = await getConnection();
	try {
		const { name, phone_number, password } = payload;

		if (!phone_number) {
			throw new ApiError(400, 'Mobile Number cannot be empty');
		}
		if (!password) {
			throw new ApiError(400, 'Password cannot be empty');
		}

		// Generate OTP based on environment
		const expairedOtpTime = 3600;
		const otp =
			config.env === 'development' ? 12345 : utils.generateRandom5DigitNumber();
		const otpMessage = `Your verification code is ${otp}`;

		// Check if the user already exists
		const [userTableExists] = await conn.query(
			'SELECT COUNT(*) AS user_exists FROM users WHERE phone = ? OR email = ?',
			[phone_number, phone_number]
		);

		const userExists = userTableExists[0]?.user_exists > 0; // Boolean check
		if (userExists) {
			throw new ApiError(
				400,
				'User already exists with this phone number or email'
			);
		}

		/* Check user exist in users otp table */
		const [userOtpTableExists] = await conn.query(
			'SELECT COUNT(*) AS user_exists, verify_yn FROM users_otp WHERE user_phone = ?',
			[phone_number]
		);

		const userOtpExists =
			userOtpTableExists[0]?.user_exists > 0 &&
			userOtpTableExists[0]?.verify_yn == 1; // Boolean check
		if (userOtpExists) {
			throw new ApiError(
				400,
				'User already exists with this phone number or email'
			);
		}

		/* TODO: Send otp here via email or sms */

		if (
			userOtpTableExists[0]?.user_exists > 0 &&
			userOtpTableExists[0]?.verify_yn == 0
		) {
			const [updateUserOtpTable] = await conn.query(
				'UPDATE users_otp SET otp_code = ? WHERE user_phone = ?',
				[otp, phone_number]
			);
		} else {
			const [insertUserOtpTable] = await conn.query(
				'INSERT INTO users_otp (name, user_phone, otp_code) VALUES (?, ?, ?)',
				[name, phone_number, otp]
			);
		}

		// If the user does not exist, return the OTP message
		return {
			phone_number,
			password,
			name,
			otp_expaired_time: expairedOtpTime,
		};
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};

const signUpVerifyOtp = async (payload) => {
	const conn = await getConnection();
	try {
		const { phone_number, password, name, otp } = payload;

		if (!otp) {
			throw new ApiError(400, 'Please Enter OTP');
		}

		const [getSavedOtp] = await conn.query(
			'select * from users_otp where user_phone = ?',
			[phone_number]
		);

		// OTP validation
		const userSaveInfo = getSavedOtp[0];
		const storedTimestamp = userSaveInfo.otp_send_time;
		if (userSaveInfo.otp_code !== parseInt(otp)) {
			throw new ApiError(400, 'Invalid OTP');
		}
		const currentTimestamp = new Date().getTime();
		const timeDifference = currentTimestamp - storedTimestamp?.getTime();
		if (timeDifference > 300000)
			throw new ApiError(400, 'Your OTP has Expired');

		// password encryption
		const hash_password = await bcrypt.hash(
			password,
			Number(config.bycrypt_salt_rounds)
		);

		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phone_number);

		let query, params;
		const role = 2;
		if (isEmail) {
			query =
				'INSERT INTO users (name, email, password, verify_yn, role) VALUES (?, ?, ?, ?, ?)';
			params = [name, phone_number, hash_password, 1, role];
		} else {
			// Check if input is a phone number
			query =
				'INSERT INTO users (name, phone, password, verify_yn, role) VALUES (?, ?, ?, ?, ?)';
			params = [name, phone_number, hash_password, 1, role];
		}

		const [insertUserAndGetId] = await conn.query(query, params);

		const userId = insertUserAndGetId?.insertId;

		const accessToken = jwtHelpers.createToken(
			{
				userId,
				phone_number,
				role,
			},
			config.jwt.secret,
			config.jwt.expires_in
		);
		const refreshToken = jwtHelpers.createToken(
			{
				userId,
				phone_number,
				role,
			},
			config.jwt.refresh_secret,
			config.jwt.refresh_expires_in
		);

		const [updateUserTable] = await conn.query(
			'UPDATE users SET access_token = ?, refresh_token = ? WHERE id = ?',
			[accessToken, refreshToken, userId]
		);

		const [updateUserOtpTable] = await conn.query(
			'UPDATE users_otp SET verify_yn = ?, verify_time = CURRENT_TIMESTAMP, last_upd_time = CURRENT_TIMESTAMP WHERE user_phone = ?',
			[1, phone_number]
		);

		// return response with token
		return {
			user_id: userId,
			phone_number,
			access_token: accessToken,
			refreshToken,
		};
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};

const loginUser = async (payload) => {
	const conn = await getConnection();
	try {
		const { phone_number, password } = payload;
		// Check if the user already exists
		const [userTableExists] = await conn.query(
			'SELECT * FROM users WHERE phone = ? OR email = ?',
			[phone_number, phone_number]
		);

		if (userTableExists.length > 0) {
			if (userTableExists[0]?.allow_status === 0) {
				throw new ApiError(
					400,
					'Your Account has been blocked. Please contact our Authority'
				);
			}

			const isValidUser = await bcrypt.compare(
				password,
				userTableExists[0]?.password
			);

			if (!isValidUser) {
				throw new ApiError(400, 'Your Password or Mobile/Email is incorrect');
			}

			const accessToken = jwtHelpers.createToken(
				{
					userId: userTableExists[0]?.id,
					phone_number,
					role: userTableExists[0]?.role,
				},
				config?.jwt?.secret,
				config?.jwt?.expires_in
			);

			const refreshToken = jwtHelpers.createToken(
				{
					userId: userTableExists[0]?.id,
					phone_number,
					role: userTableExists[0]?.role,
				},
				config?.jwt?.refresh_secret,
				config?.jwt?.refresh_expires_in
			);

			const [updateUserTable] = await conn.query(
				'UPDATE users SET access_token = ?, refresh_token = ? WHERE id = ?',
				[accessToken, refreshToken, userTableExists[0]?.id]
			);

			return {
				user_id: userTableExists[0]?.id,
				phone_number,
				access_token: accessToken,
				refreshToken,
			};
		} else {
			throw new ApiError(400, 'No user found. Please registration first');
		}
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};

const userProfile = async (userId) => {
	const conn = await getConnection();
	try {
		const [getUserDetails] = await conn.query(
			'Select name, phone, email from users where id = ? ',
			[userId]
		);

		return getUserDetails[0];
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};

const userUpadteProfile = async (userId, userInfo) => {
	const conn = await getConnection();
	try {
		const { name, email } = userInfo;
		// Check if the user already exists
		const [userTableExists] = await conn.query(
			'SELECT COUNT(*) AS user_exists, id FROM users WHERE email = ?',
			[ email]
		);

		const userExists = userTableExists[0]?.user_exists > 0; // Boolean check
		if (userExists && userTableExists[0]?.id !== userId) {
			throw new ApiError(
				400,
				'User already exists with this phone number or email'
			);
		}

		const [getUserDetails] = await conn.query(
			'UPDATE users SET name = ?, email = ? WHERE id = ?',
			[name, email, userId]
		);

		return getUserDetails;
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};


const forgotPassword = async (phone_number) => {
	const conn = await getConnection();
	try {
		// Check if the user already exists
		const [userTableExists] = await conn.query(
			'SELECT COUNT(*) AS user_exists, id FROM users WHERE email = ?',
			[phone_number]
		);

		const userExists = userTableExists[0]?.user_exists <= 0; // Boolean check
		if (userExists ) {
			throw new ApiError(
				400,
				'User not found'
			);
		}

		const resetToken = utils?.generateResetToken();
		const tokenExpiration = new Date(Date.now() + 3600000) 
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");
	  
	  const [updateUserTable] = await conn.query(
		"UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
		[resetToken, tokenExpiration, phone_number]
	  );
	  
		// Send email with reset link
		const resetLink = `http://localhost:3000/users/reset-password/${resetToken}`;
		const mailOptions = {
		  to: phone_number,
		  subject: "Password Reset Request",
		  html: `<p>Click <a href="${resetLink}">${resetLink}</a> to reset your password.</p>`,
		};
	
		await utils?.transporter.sendMail(mailOptions);

		return 0;

	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

const resetPassword = async (token, new_password) => {
	const conn = await getConnection();
	try {
	  const [users] = await conn.query(
		"SELECT id, email FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
		[token, Date.now()]
	  );
	  
  
	  if (users.length === 0) {
		throw new ApiError(400, "Invalid or expired token");
	  }
  
	  const userId = users[0].id;
	  const hashedPassword = await bcrypt.hash(
		new_password,
		Number(config.bycrypt_salt_rounds)
	);
  
	  // Update password and clear reset token
	  await conn.query(
		"UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
		[hashedPassword, userId]
	  );
  
	  return { message: "Password reset successfully" };
	} catch (error) {
	  throw new ApiError(400, error.message || "An error occurred");
	} finally {
	  if (conn) {
		conn.release();
	  }
	}
  };

export const AuthService = {
	createUser,
	signUpVerifyOtp,
	loginUser,
	userProfile,
	userUpadteProfile,
	forgotPassword,
	resetPassword
};
