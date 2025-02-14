import express from 'express';
import { StockController } from './stock.controller.js';
import { ENUM_USER_ROLE } from '../../../enums/user.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.post('/buy-sell', auth(ENUM_USER_ROLE.USER), StockController.stockBuySell);
router.get('/get-stock', auth(ENUM_USER_ROLE.USER),StockController.getStocks);
router.post('/close-stock/:stockId', auth(ENUM_USER_ROLE.USER),StockController.closeStock);
router.get('/get-close-stock', auth(ENUM_USER_ROLE.USER),StockController.getCloseStock);

export const StockRoutes = router;
