/* eslint-disable no-unused-vars */
/* import { JwtPayload, Secret } from 'jsonwebtoken'; */
import ApiError from '../../../errors/ApiError.js';
import { getConnection } from '../../../helpers/db.js';
import { paginationHelpers } from '../../../helpers/paginationHelper.js';

const tasks = async (userId, filters = {}, paginationOptions = {}) => {
    const conn = await getConnection();
    try {
        const { page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);
        
        let query = "SELECT * FROM tasks WHERE user_id = ?";
        const queryParams = [userId];

        // Apply filters 
        if (Object.keys(filters).length) {
            const filterConditions = Object.entries(filters).map(([field, value]) => {
                queryParams.push(value);
                return `${field} = ?`;
            });

            query += ` AND ${filterConditions.join(" AND ")}`;
        }

        // Sorting
        if (sortBy && sortOrder) {
            query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        }

        // Pagination
        const offset = (page - 1) * limit;
        query += " LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);

        
        const [result] = await conn.query(query, queryParams);

        // Get total count for pagination
        const [countResult] = await conn.query("SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?", [userId]);
        const total = countResult[0].total;
        const pageCount = Math.ceil(total / limit);

        return {
            meta: {
                page,
                limit,
                total,
                pageCount,
            },
            data: result,
        };
    } catch (error) {
        throw new ApiError(400, error.message || "An error occurred");
    } finally {
        if (conn) {
            conn.release();
        }
    }
};

const taskById = async (userId, taskId) => {
	const conn = await getConnection();
	try {

		const [getTaskById] = await conn.query(
			'Select * from tasks where user_id = ? AND id = ?',
			[userId, taskId]
		);

		return getTaskById;
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		if (conn) {
			conn.release();
		}
	}
};


const createTask = async (userId, payload ) => {
	const conn = await getConnection();
	try {
		const { title, description, due_date } = payload;


		const formattedDueDate = new Date(due_date).toISOString().slice(0, 19).replace("T", " ");

		const [insertTask] = await conn.query(
			'INSERT INTO tasks (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)',
			[userId, title, description, formattedDueDate, 1]
		);

		return insertTask.insertId; // Return the inserted task ID
	} catch (error) {
		throw new ApiError(400, error.message || 'An error occurred');
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

const updateTask = async (userId, taskId, payload) => {
	const conn = await getConnection();
	try {
		const { title, description, due_date, status } = payload;

		const formattedDueDate = new Date(due_date).toISOString().slice(0, 19).replace("T", " ");

		const [updateTask] = await conn.query(
			"UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?",
			[title, description, formattedDueDate, status, taskId, userId]
		);

		if (updateTask.affectedRows === 0) {
			throw new ApiError(404, "Task not found or not updated.");
		}

		return 0;
	} catch (error) {
		throw new ApiError(400, error.message || "An error occurred");
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

const deleteTask = async (userId, taskId) => {
	const conn = await getConnection();
	try {

		const [deleteResult] = await conn.query(
			"DELETE FROM tasks WHERE id = ? AND user_id = ?",
			[taskId, userId]
		);

		if (deleteResult.affectedRows === 0) {
			throw new Error("Task not found or unauthorized");
		}

		return 0;
	} catch (error) {
		throw new ApiError(400, error.message || "An error occurred");
	} finally {
		if (conn) {
			conn.release();
		}
	}
};






export const TasksService = {
	tasks,
    taskById,
    createTask,
    updateTask,
    deleteTask
};
