import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';
import { PermissionRoute } from '@/routes/PermissionRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import ChangePasswordPage from '@/features/auth/pages/ChangePasswordPage';
import UsersPage from '@/features/users/pages/UsersPage';
import RolesPage from '@/features/roles/pages/RolesPage';
import WarehousesPage from '@/features/warehouses/pages/WarehousesPage';
import ProductsPage from '@/features/products/pages/ProductsPage';
import SuppliersPage from '@/features/suppliers/pages/SuppliersPage';
import CustomersPage from '@/features/customers/pages/CustomersPage';
import GoodsReceiptsPage from '@/features/goods-receipts/pages/GoodsReceiptsPage';
import GoodsIssuesPage from '@/features/goods-issues/pages/GoodsIssuesPage';
import InventoryPage from '@/features/inventory/pages/InventoryPage';
import StockTakesPage from '@/features/stock-takes/pages/StockTakesPage';
import StockAdjustmentsPage from '@/features/stock-adjustments/pages/StockAdjustmentsPage';
import AuditLogsPage from '@/features/audit-logs/pages/AuditLogsPage';
import ReportsPage from '@/features/reports/pages/ReportsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'change-password', element: <ChangePasswordPage /> },
          {
            element: <PermissionRoute permission="user:read" />,
            children: [{ path: 'users', element: <UsersPage /> }],
          },
          {
            element: <PermissionRoute permission="role:read" />,
            children: [{ path: 'roles', element: <RolesPage /> }],
          },
          {
            element: <PermissionRoute permission="warehouse:read" />,
            children: [{ path: 'warehouses', element: <WarehousesPage /> }],
          },
          {
            element: <PermissionRoute permission="product:read" />,
            children: [{ path: 'products', element: <ProductsPage /> }],
          },
          {
            element: <PermissionRoute permission="supplier:read" />,
            children: [{ path: 'suppliers', element: <SuppliersPage /> }],
          },
          {
            element: <PermissionRoute permission="customer:read" />,
            children: [{ path: 'customers', element: <CustomersPage /> }],
          },
          {
            element: <PermissionRoute permission="goods-receipt:read" />,
            children: [{ path: 'goods-receipts', element: <GoodsReceiptsPage /> }],
          },
          {
            element: <PermissionRoute permission="goods-issue:read" />,
            children: [{ path: 'goods-issues', element: <GoodsIssuesPage /> }],
          },
          {
            element: <PermissionRoute permission="inventory:read" />,
            children: [{ path: 'inventories', element: <InventoryPage /> }],
          },
          {
            element: <PermissionRoute permission="stock-take:read" />,
            children: [{ path: 'stock-takes', element: <StockTakesPage /> }],
          },
          {
            element: <PermissionRoute permission="stock-adjustment:read" />,
            children: [{ path: 'stock-adjustments', element: <StockAdjustmentsPage /> }],
          },
          {
            element: <PermissionRoute permission="report:read" />,
            children: [{ path: 'reports', element: <ReportsPage /> }],
          },
          {
            element: <PermissionRoute permission="audit-log:read" />,
            children: [{ path: 'audit-logs', element: <AuditLogsPage /> }],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
