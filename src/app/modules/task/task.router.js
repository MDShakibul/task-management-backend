import express from 'express';
import { TasksController } from './task.controller.js';
import { ENUM_USER_ROLE } from '../../../enums/user.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.USER), TasksController.tasks);
router.get('/:id', auth(ENUM_USER_ROLE.USER), TasksController.taskById);
router.post('/', auth(ENUM_USER_ROLE.USER), TasksController.createTask);
router.put('/:id', auth(ENUM_USER_ROLE.USER), TasksController.updateTask);
router.delete('/:id', auth(ENUM_USER_ROLE.USER),TasksController.deleteTask);

export const TasksRoutes = router;
