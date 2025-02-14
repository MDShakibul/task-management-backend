/* eslint-disable no-unused-vars */
/* import { JwtPayload, Secret } from 'jsonwebtoken'; */
import ApiError from '../../../errors/ApiError.js';
import { getConnection } from '../../../helpers/db.js';

const stockBuySell = async (payload, userId) => {
	const conn = await getConnection();
	try {
		const { stock_id, stock_name, trans_type, invest_amount, stock_current_price } = payload;

		const [insertUserStocks] = await conn.query(
			'INSERT INTO user_stocks (user_id, stock_id, stock_name, trans_type, invest_amount, stock_current_price) VALUES (?, ?, ?, ?, ?, ?)',
			[userId, stock_id, stock_name, trans_type, invest_amount, stock_current_price]
		);

		return 0;
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};
const getStocks = async (userId) => {
	const conn = await getConnection();
	try {

		const [getStocksByUser] = await conn.query(
			'Select * from user_stocks where user_id = ? AND is_closed = 0',
			[userId]
		);

		return getStocksByUser;
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};

const closeStock = async (payload, userId, stockId) => {
	const conn = await getConnection();
	try {
		const { close_amount } = payload;

		//TODO: check if stock exists in user account
		
		const [stockExists] = await conn.query(
			'SELECT COUNT(*) AS stock_exists FROM user_stocks WHERE user_id = ? and stock_id = ?',
			[userId, stockId]
		); 

		console.log(stockExists[0])


		if (stockExists[0]?.stock_exists === 0) {
			throw new ApiError(
				400,
				'This stocks not exists in your account'
			);
		}
		

		const [stockClose] = await conn.query(
			'UPDATE user_stocks SET is_closed = ?, close_amount = ? WHERE user_id = ? and stock_id = ?',
			[1, close_amount, userId, stockId]
		);
		


		return stockClose;
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};


const getCloseStock = async (userId) => {
	const conn = await getConnection();
	try {

		const [getStocksByUser] = await conn.query(
			'Select * from user_stocks where user_id = ? AND is_closed = 1',
			[userId]
		);

		return getStocksByUser;
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		// Properly release the connection back to the pool
		if (conn) {
			conn.release();
		}
	}
};

export const StockService = {
	stockBuySell,
	getStocks,
	closeStock,
	getCloseStock
};
