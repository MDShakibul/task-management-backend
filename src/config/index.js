import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_host: process.env.DATABASE_HOST,
	database_user: process.env.DATABASE_USER,
	database_password: process.env.DATABASE_PASSWORD,
	database_name: process.env.DATABASE_NAME,
	bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	email_user: process.env.EMAIL_USER,
	email_password: process.env.EMAIL_PASS,
	client_url: process.env.CLIENT_URL,
	jwt: {
		secret: process.env.JWT_SECRET,
		expires_in: process.env.JWT_EXPIRES_IN,
		refresh_secret: process.env.JWT_REFRESH_SECRET,
		refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
	},
};
