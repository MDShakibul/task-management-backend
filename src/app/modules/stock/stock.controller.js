/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { StockService } from './stock.service.js';

const stockBuySell = catchAsync(async (req, res) => {
	const { ...stockInfo } = req.body;
	const userid = req?.user?.userId;

	const result = await StockService.stockBuySell(stockInfo, userid);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Transection Successfull',
		data: result,
	});
});
const getStocks = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;

	const result = await StockService.getStocks(userid);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Transection Successfull',
		data: result,
	});
});

const closeStock = catchAsync(async (req, res) => {
	const { ...stockInfo } = req.body;
	const userid = req?.user?.userId;
	const stockId = req.params.stockId;

	const result = await StockService.closeStock(stockInfo, userid, stockId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Transection Successfull',
		data: 0,
	});
});


const getCloseStock = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;

	const result = await StockService.getCloseStock(userid);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Transection Successfull',
		data: result,
	});
});

export const StockController = {
	stockBuySell,
	getStocks,
	closeStock,
	getCloseStock,
};
