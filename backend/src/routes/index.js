import { Router } from 'express';
import healthRoutes from '../modules/health/health.route.js';
import authRoutes from '../modules/auth/auth.route.js';
import userRoutes from '../modules/user/user.route.js';
import roleRoutes from '../modules/role/role.route.js';
import warehouseRoutes from '../modules/warehouse/warehouse.route.js';
import productRoutes from '../modules/product/product.route.js';
import supplierRoutes from '../modules/supplier/supplier.route.js';
import customerRoutes from '../modules/customer/customer.route.js';
import goodsReceiptRoutes from '../modules/goods-receipt/goodsReceipt.route.js';
import goodsIssueRoutes from '../modules/goods-issue/goodsIssue.route.js';
import inventoryRoutes from '../modules/inventory/inventory.route.js';
import dashboardRoutes from '../modules/dashboard/dashboard.route.js';
import stockTakeRoutes from '../modules/stock-take/stockTake.route.js';
import stockAdjustmentRoutes from '../modules/stock-adjustment/stockAdjustment.route.js';
import auditLogRoutes from '../modules/audit-log/auditLog.route.js';
import reportRoutes from '../modules/report/report.route.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/customers', customerRoutes);
router.use('/goods-receipts', goodsReceiptRoutes);
router.use('/goods-issues', goodsIssueRoutes);
router.use('/inventories', inventoryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/stock-takes', stockTakeRoutes);
router.use('/stock-adjustments', stockAdjustmentRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/reports', reportRoutes);

export default router;
