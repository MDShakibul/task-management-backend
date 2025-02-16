/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { TasksService } from './task.service.js';
import pick from '../../../shared/pick.js';
import { paginationFields } from '../../../constant/pagination.js';
import { taskFilterableFields } from './task.constant.js';

const tasks = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;


    const filters = pick(req.query, taskFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
	const result = await TasksService.tasks(userid, filters, paginationOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'All data retrieved successfully',
		data: result,
	});
});

const taskById = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;
    const taskId = req.params.id;

	const result = await TasksService.taskById(userid, taskId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Data retrieved successfully',
		data: result,
	});
});

const createTask = catchAsync(async (req, res) => {
	const userid = req?.user?.userId;
    const { ...taskInfo } = req.body;


	const result = await TasksService.createTask(userid, taskInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Data retrieved successfully',
		data: result,
	});
});

const updateTask = catchAsync(async (req, res) => {
	const userId = req?.user?.userId;
	const taskId = req.params.id;
	const { ...taskInfo } = req.body;


	const result = await TasksService.updateTask(userId, taskId, taskInfo?.data);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task updated successfully",
		data: result,
	});
});

const deleteTask = catchAsync(async (req, res) => {
	const userId = req.user.userId;
	const taskId = req.params.id;


	const result = await TasksService.deleteTask(userId, taskId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Task deleted successfully",
        data: result,
	});
});


export const TasksController = {
	tasks,
    taskById,
    createTask,
    updateTask,
    deleteTask
};
