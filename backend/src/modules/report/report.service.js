import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { prisma } from '../../config/database.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';

const MAX_ROWS = 10000;

function toNumber(value) {
  return Number(value || 0);
}

function parseDateRange(query) {
  const whereDate = {};
  if (query.dateFrom) whereDate.gte = new Date(query.dateFrom);
  if (query.dateTo) {
    const end = new Date(query.dateTo);
    end.setHours(23, 59, 59, 999);
    whereDate.lte = end;
  }
  return Object.keys(whereDate).length ? whereDate : undefined;
}

async function getInventoryReport(query) {
  const where = {};
  if (query.warehouseId) where.warehouseId = query.warehouseId;

  const rows = await prisma.inventory.findMany({
    where,
    take: MAX_ROWS,
    include: {
      warehouse: { select: { code: true, name: true } },
      product: { select: { code: true, name: true, unit: true, costPrice: true, minStock: true } },
    },
    orderBy: [{ warehouse: { code: 'asc' } }, { product: { code: 'asc' } }],
  });

  return rows.map((row) => ({
    warehouseCode: row.warehouse.code,
    warehouseName: row.warehouse.name,
    productCode: row.product.code,
    productName: row.product.name,
    unit: row.product.unit,
    quantity: toNumber(row.quantity),
    minStock: row.product.minStock,
    stockValue: toNumber(row.quantity) * toNumber(row.product.costPrice),
  }));
}

async function getStockValueReport(query) {
  return getInventoryReport(query);
}

async function getGoodsReceiptsReport(query) {
  const dateFilter = parseDateRange(query);
  const where = { status: 'CONFIRMED' };
  if (query.warehouseId) where.warehouseId = query.warehouseId;
  if (dateFilter) where.receiptDate = dateFilter;

  const rows = await prisma.goodsReceiptItem.findMany({
    where: { goodsReceipt: where },
    take: MAX_ROWS,
    include: {
      product: { select: { code: true, name: true, unit: true } },
      goodsReceipt: {
        select: {
          code: true,
          receiptDate: true,
          warehouse: { select: { code: true, name: true } },
          supplier: { select: { code: true, name: true } },
        },
      },
    },
    orderBy: { goodsReceipt: { receiptDate: 'desc' } },
  });

  return rows.map((row) => ({
    code: row.goodsReceipt.code,
    date: row.goodsReceipt.receiptDate,
    warehouseCode: row.goodsReceipt.warehouse.code,
    supplierName: row.goodsReceipt.supplier?.name || '',
    productCode: row.product.code,
    productName: row.product.name,
    quantity: toNumber(row.quantity),
    unitCost: toNumber(row.unitCost),
  }));
}

async function getGoodsIssuesReport(query) {
  const dateFilter = parseDateRange(query);
  const where = { status: 'CONFIRMED' };
  if (query.warehouseId) where.warehouseId = query.warehouseId;
  if (dateFilter) where.issueDate = dateFilter;

  const rows = await prisma.goodsIssueItem.findMany({
    where: { goodsIssue: where },
    take: MAX_ROWS,
    include: {
      product: { select: { code: true, name: true, unit: true } },
      goodsIssue: {
        select: {
          code: true,
          issueDate: true,
          warehouse: { select: { code: true, name: true } },
          customer: { select: { code: true, name: true } },
        },
      },
    },
    orderBy: { goodsIssue: { issueDate: 'desc' } },
  });

  return rows.map((row) => ({
    code: row.goodsIssue.code,
    date: row.goodsIssue.issueDate,
    warehouseCode: row.goodsIssue.warehouse.code,
    customerName: row.goodsIssue.customer?.name || '',
    productCode: row.product.code,
    productName: row.product.name,
    quantity: toNumber(row.quantity),
    unitPrice: toNumber(row.unitPrice),
  }));
}

async function getStockTakesReport(query) {
  const dateFilter = parseDateRange(query);
  const where = { status: 'CONFIRMED' };
  if (query.warehouseId) where.warehouseId = query.warehouseId;
  if (dateFilter) where.takeDate = dateFilter;

  const rows = await prisma.stockTakeItem.findMany({
    where: { stockTake: where },
    take: MAX_ROWS,
    include: {
      product: { select: { code: true, name: true, unit: true } },
      stockTake: {
        select: {
          code: true,
          takeDate: true,
          warehouse: { select: { code: true, name: true } },
        },
      },
    },
    orderBy: { stockTake: { takeDate: 'desc' } },
  });

  return rows.map((row) => ({
    code: row.stockTake.code,
    date: row.stockTake.takeDate,
    warehouseCode: row.stockTake.warehouse.code,
    productCode: row.product.code,
    productName: row.product.name,
    systemQty: toNumber(row.systemQty),
    countedQty: toNumber(row.countedQty),
    variance: toNumber(row.countedQty) - toNumber(row.systemQty),
  }));
}

async function getStockAdjustmentsReport(query) {
  const dateFilter = parseDateRange(query);
  const where = { status: 'CONFIRMED' };
  if (query.warehouseId) where.warehouseId = query.warehouseId;
  if (dateFilter) where.adjustDate = dateFilter;

  const rows = await prisma.stockAdjustmentItem.findMany({
    where: { stockAdjustment: where },
    take: MAX_ROWS,
    include: {
      product: { select: { code: true, name: true, unit: true } },
      stockAdjustment: {
        select: {
          code: true,
          adjustDate: true,
          reason: true,
          warehouse: { select: { code: true, name: true } },
        },
      },
    },
    orderBy: { stockAdjustment: { adjustDate: 'desc' } },
  });

  return rows.map((row) => ({
    code: row.stockAdjustment.code,
    date: row.stockAdjustment.adjustDate,
    warehouseCode: row.stockAdjustment.warehouse.code,
    reason: row.stockAdjustment.reason,
    productCode: row.product.code,
    productName: row.product.name,
    type: row.type,
    quantity: toNumber(row.quantity),
  }));
}

const REPORT_HANDLERS = {
  inventory: getInventoryReport,
  'stock-value': getStockValueReport,
  'goods-receipts': getGoodsReceiptsReport,
  'goods-issues': getGoodsIssuesReport,
  'stock-takes': getStockTakesReport,
  'stock-adjustments': getStockAdjustmentsReport,
};

const REPORT_TITLES = {
  inventory: 'Báo cáo tồn kho',
  'stock-value': 'Báo cáo giá trị hàng tồn',
  'goods-receipts': 'Báo cáo nhập kho',
  'goods-issues': 'Báo cáo xuất kho',
  'stock-takes': 'Báo cáo kiểm kê',
  'stock-adjustments': 'Báo cáo điều chỉnh tồn kho',
};

async function buildExcel(title, rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report');
  sheet.addRow([title]);
  sheet.addRow([]);

  if (rows.length === 0) {
    sheet.addRow(['Không có dữ liệu']);
  } else {
    const headers = Object.keys(rows[0]);
    sheet.addRow(headers);
    rows.forEach((row) => sheet.addRow(headers.map((h) => row[h])));
  }

  return workbook.xlsx.writeBuffer();
}

async function buildPdf(title, rows) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(14).text(title, { underline: true });
    doc.moveDown();

    if (rows.length === 0) {
      doc.fontSize(10).text('Không có dữ liệu');
    } else {
      const headers = Object.keys(rows[0]);
      doc.fontSize(8).text(headers.join(' | '));
      doc.moveDown(0.5);
      rows.slice(0, 200).forEach((row) => {
        doc.text(headers.map((h) => String(row[h] ?? '')).join(' | '));
      });
      if (rows.length > 200) {
        doc.moveDown().text(`... và ${rows.length - 200} dòng nữa`);
      }
    }

    doc.end();
  });
}

export const reportService = {
  async getReport(type, query) {
    const handler = REPORT_HANDLERS[type];
    if (!handler) throw new ApiError(HttpStatus.NOT_FOUND, 'Loại báo cáo không hỗ trợ');
    const rows = await handler(query);
    return {
      type,
      title: REPORT_TITLES[type],
      total: rows.length,
      rows,
    };
  },

  async exportReport(type, query, format) {
    const report = await this.getReport(type, query);
    if (format === 'excel') {
      const buffer = await buildExcel(report.title, report.rows);
      return {
        buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `${type}-${Date.now()}.xlsx`,
      };
    }
    if (format === 'pdf') {
      const buffer = await buildPdf(report.title, report.rows);
      return {
        buffer,
        contentType: 'application/pdf',
        filename: `${type}-${Date.now()}.pdf`,
      };
    }
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Định dạng export không hợp lệ');
  },
};
