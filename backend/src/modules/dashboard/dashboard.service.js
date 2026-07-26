import { prisma } from '../../config/database.js';

function toNumber(value) {
  return Number(value || 0);
}

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function monthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function buildLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: monthKey(d),
      label: `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
    });
  }
  return months;
}

async function getSummary() {
  const [totalProducts, totalWarehouses, inventories, receiptsToday, issuesToday] =
    await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.warehouse.count({ where: { status: 'ACTIVE' } }),
      prisma.inventory.findMany({
        select: {
          quantity: true,
          product: { select: { costPrice: true } },
        },
      }),
      prisma.goodsReceipt.count({
        where: {
          status: 'CONFIRMED',
          receiptDate: {
            gte: startOfDay(),
            lte: endOfDay(),
          },
        },
      }),
      prisma.goodsIssue.count({
        where: {
          status: 'CONFIRMED',
          issueDate: {
            gte: startOfDay(),
            lte: endOfDay(),
          },
        },
      }),
    ]);

  let totalStockQty = 0;
  let totalStockValue = 0;

  for (const item of inventories) {
    const qty = toNumber(item.quantity);
    const cost = toNumber(item.product?.costPrice);
    totalStockQty += qty;
    totalStockValue += qty * cost;
  }

  return {
    totalProducts,
    totalWarehouses,
    totalStockQty,
    totalStockValue,
    receiptsToday,
    issuesToday,
  };
}

async function getLowStock(limit = 10) {
  const inventories = await prisma.inventory.findMany({
    include: {
      warehouse: { select: { id: true, code: true, name: true } },
      product: {
        select: {
          id: true,
          code: true,
          name: true,
          unit: true,
          minStock: true,
        },
      },
    },
  });

  return inventories
    .map((item) => ({
      id: item.id,
      warehouse: item.warehouse,
      product: item.product,
      quantity: toNumber(item.quantity),
      minStock: item.product.minStock,
    }))
    .filter((item) => item.quantity <= item.minStock)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, limit);
}

async function getTopProducts(type, limit = 5) {
  const isReceipt = type === 'receipt';
  const table = isReceipt ? 'goods_receipt_items' : 'goods_issue_items';
  const parent = isReceipt ? 'goods_receipts' : 'goods_issues';
  const fk = isReceipt ? 'goods_receipt_id' : 'goods_issue_id';

  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);

  const rows = await prisma.$queryRawUnsafe(`
    SELECT
      p.id,
      p.code,
      p.name,
      p.unit,
      SUM(i.quantity)::float AS total_quantity
    FROM ${table} i
    INNER JOIN ${parent} d ON d.id = i.${fk}
    INNER JOIN products p ON p.id = i.product_id
    WHERE d.status = 'CONFIRMED'
    GROUP BY p.id, p.code, p.name, p.unit
    ORDER BY total_quantity DESC
    LIMIT ${safeLimit}
  `);

  return rows.map((row) => ({
    productId: row.id,
    code: row.code,
    name: row.name,
    unit: row.unit,
    totalQuantity: toNumber(row.total_quantity),
  }));
}

async function getMonthlyChart() {
  const months = buildLast12Months();
  const from = new Date();
  from.setMonth(from.getMonth() - 11);
  from.setDate(1);
  from.setHours(0, 0, 0, 0);

  const [receipts, issues] = await Promise.all([
    prisma.goodsReceipt.findMany({
      where: {
        status: 'CONFIRMED',
        receiptDate: { gte: from },
      },
      select: { receiptDate: true },
    }),
    prisma.goodsIssue.findMany({
      where: {
        status: 'CONFIRMED',
        issueDate: { gte: from },
      },
      select: { issueDate: true },
    }),
  ]);

  const receiptMap = Object.fromEntries(months.map((m) => [m.key, 0]));
  const issueMap = Object.fromEntries(months.map((m) => [m.key, 0]));

  for (const row of receipts) {
    const key = monthKey(new Date(row.receiptDate));
    if (key in receiptMap) receiptMap[key] += 1;
  }

  for (const row of issues) {
    const key = monthKey(new Date(row.issueDate));
    if (key in issueMap) issueMap[key] += 1;
  }

  return months.map((m) => ({
    month: m.label,
    receipts: receiptMap[m.key],
    issues: issueMap[m.key],
  }));
}

export const dashboardService = {
  async getOverview() {
    const [summary, lowStock, topReceived, topIssued, monthlyChart] = await Promise.all([
      getSummary(),
      getLowStock(10),
      getTopProducts('receipt', 5),
      getTopProducts('issue', 5),
      getMonthlyChart(),
    ]);

    return {
      summary,
      lowStock,
      topReceived,
      topIssued,
      monthlyChart,
    };
  },
};
