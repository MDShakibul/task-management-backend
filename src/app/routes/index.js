import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { StockRoutes } from '../modules/stock/stock.route.js';
import { TasksRoutes } from '../modules/task/task.router.js';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/stocks',
    route: StockRoutes,
  },
  {
    path: '/tasks',
    route: TasksRoutes,
  }
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route));


export default router;
