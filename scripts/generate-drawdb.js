const fs = require("fs");
const path = require("path");

let nextId = 1;
const id = () => nextId++;

const COLORS = {
  auth: "#175e7a",
  master: "#2f6f4e",
  inventory: "#8a5a00",
  receipt: "#6b3fa0",
  issue: "#a03f3f",
  stocktake: "#3f6ba0",
  adjust: "#a06b3f",
  audit: "#5a5a5a",
};

function field(name, type, opts = {}) {
  let notNull = true;
  if (opts.nullable === true) notNull = false;
  if (opts.notNull === false) notNull = false;
  if (opts.notNull === true || opts.primary) notNull = true;

  return {
    id: id(),
    name,
    type,
    default: opts.default ?? "",
    check: opts.check ?? "",
    primary: !!opts.primary,
    unique: !!opts.unique,
    notNull,
    increment: !!opts.increment,
    comment: opts.comment ?? "",
    size: opts.size ?? "",
    values: opts.values ?? [],
  };
}

const tables = [];
const relationships = [];
const fieldIndex = {};
const tableIndex = {};

function addTable(
  name,
  x,
  y,
  color,
  comment,
  fields,
  indices = [],
  uniqueConstraints = []
) {
  const tableId = id();
  const built = fields.map((f) => {
    fieldIndex[`${name}.${f.name}`] = f.id;
    return f;
  });
  tables.push({
    id: tableId,
    name,
    x,
    y,
    fields: built,
    comment: comment || "",
    indices,
    uniqueConstraints,
    color,
  });
  tableIndex[name] = tableId;
  return tableId;
}

function rel(
  name,
  fromTable,
  fromField,
  toTable,
  toField,
  deleteConstraint = "Restrict",
  cardinality = "many_to_one"
) {
  const startFieldId = fieldIndex[`${fromTable}.${fromField}`];
  const endFieldId = fieldIndex[`${toTable}.${toField}`];
  if (!startFieldId || !endFieldId) {
    throw new Error(
      `Missing field for relationship ${name}: ${fromTable}.${fromField} -> ${toTable}.${toField}`
    );
  }
  relationships.push({
    id: id(),
    name,
    startTableId: tableIndex[fromTable],
    startFieldId,
    endTableId: tableIndex[toTable],
    endFieldId,
    cardinality,
    updateConstraint: "No action",
    deleteConstraint,
  });
}

const uuid = (name, opts = {}) => field(name, "UUID", opts);
const varchar = (name, opts = {}) => field(name, "VARCHAR", opts);
const text = (name, opts = {}) => field(name, "TEXT", opts);
const integer = (name, opts = {}) => field(name, "INTEGER", opts);
const decimal = (name, opts = {}) =>
  field(name, "DECIMAL", { size: "15,2", ...opts });
const timestamp = (name, opts = {}) => field(name, "TIMESTAMPTZ", opts);
const date = (name, opts = {}) => field(name, "DATE", opts);
const jsonb = (name, opts = {}) => field(name, "JSONB", opts);
const enumField = (name, enumName, opts = {}) =>
  field(name, enumName, opts);

// ===== AUTH =====
addTable("roles", 40, 40, COLORS.auth, "RBAC roles", [
  uuid("id", { primary: true }),
  varchar("name", { unique: true, notNull: true }),
  text("description", { nullable: true }),
  timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
  timestamp("updated_at", { notNull: true }),
]);

addTable(
  "permissions",
  40,
  320,
  COLORS.auth,
  "Permission catalog",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    varchar("name", { notNull: true }),
    varchar("module", { notNull: true, comment: "INDEX" }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [{ name: "permissions_module_idx", unique: false, fields: ["module"] }]
);

addTable("role_permissions", 320, 180, COLORS.auth, "M:N role ↔ permission", [
  uuid("role_id", { primary: true }),
  uuid("permission_id", { primary: true }),
]);

addTable(
  "users",
  600,
  40,
  COLORS.auth,
  "System users",
  [
    uuid("id", { primary: true }),
    varchar("email", { unique: true, notNull: true }),
    varchar("password_hash", { notNull: true }),
    varchar("full_name", { notNull: true }),
    varchar("avatar_url", { nullable: true }),
    enumField("status", "UserStatus", {
      notNull: true,
      default: "ACTIVE",
    }),
    uuid("role_id", { notNull: true }),
    integer("failed_login_attempts", { notNull: true, default: "0" }),
    timestamp("locked_until", { nullable: true }),
    timestamp("last_login_at", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    { name: "users_status_idx", unique: false, fields: ["status"] },
    { name: "users_role_id_idx", unique: false, fields: ["role_id"] },
  ]
);

addTable(
  "refresh_tokens",
  920,
  40,
  COLORS.auth,
  "JWT refresh tokens",
  [
    uuid("id", { primary: true }),
    uuid("user_id", { notNull: true }),
    varchar("token_hash", { unique: true, notNull: true }),
    timestamp("expires_at", { notNull: true }),
    timestamp("revoked_at", { nullable: true }),
    varchar("ip_address", { nullable: true }),
    text("user_agent", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
  ],
  [
    { name: "refresh_tokens_user_id_idx", unique: false, fields: ["user_id"] },
    {
      name: "refresh_tokens_expires_at_idx",
      unique: false,
      fields: ["expires_at"],
    },
  ]
);

// ===== MASTER =====
addTable(
  "warehouses",
  40,
  620,
  COLORS.master,
  "Warehouses",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    varchar("name", { notNull: true }),
    text("address", { nullable: true }),
    varchar("phone", { nullable: true }),
    varchar("email", { nullable: true }),
    text("description", { nullable: true }),
    enumField("status", "EntityStatus", {
      notNull: true,
      default: "ACTIVE",
    }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [{ name: "warehouses_status_idx", unique: false, fields: ["status"] }]
);

addTable(
  "products",
  320,
  620,
  COLORS.master,
  "Products",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    varchar("name", { notNull: true }),
    text("description", { nullable: true }),
    varchar("category", { nullable: true }),
    varchar("unit", { notNull: true, default: "pcs" }),
    decimal("price", { notNull: true, default: "0", size: "15,2" }),
    decimal("cost_price", { notNull: true, default: "0", size: "15,2" }),
    integer("min_stock", { notNull: true, default: "0" }),
    varchar("image_url", { nullable: true }),
    enumField("status", "EntityStatus", {
      notNull: true,
      default: "ACTIVE",
    }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    { name: "products_status_idx", unique: false, fields: ["status"] },
    { name: "products_category_idx", unique: false, fields: ["category"] },
  ]
);

addTable(
  "suppliers",
  640,
  620,
  COLORS.master,
  "Suppliers",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    varchar("name", { notNull: true }),
    varchar("contact_person", { nullable: true }),
    varchar("phone", { nullable: true }),
    varchar("email", { nullable: true }),
    text("address", { nullable: true }),
    text("notes", { nullable: true }),
    enumField("status", "EntityStatus", {
      notNull: true,
      default: "ACTIVE",
    }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [{ name: "suppliers_status_idx", unique: false, fields: ["status"] }]
);

addTable(
  "customers",
  920,
  620,
  COLORS.master,
  "Customers",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    varchar("name", { notNull: true }),
    varchar("contact_person", { nullable: true }),
    varchar("phone", { nullable: true }),
    varchar("email", { nullable: true }),
    text("address", { nullable: true }),
    text("notes", { nullable: true }),
    enumField("status", "EntityStatus", {
      notNull: true,
      default: "ACTIVE",
    }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [{ name: "customers_status_idx", unique: false, fields: ["status"] }]
);

// ===== INVENTORY =====
addTable(
  "inventories",
  320,
  1100,
  COLORS.inventory,
  "Stock qty per warehouse+product",
  [
    uuid("id", { primary: true }),
    uuid("warehouse_id", { notNull: true }),
    uuid("product_id", { notNull: true }),
    decimal("quantity", { notNull: true, default: "0", size: "15,3" }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    {
      name: "inventories_warehouse_id_idx",
      unique: false,
      fields: ["warehouse_id"],
    },
    { name: "inventories_product_id_idx", unique: false, fields: ["product_id"] },
  ],
  [
    {
      name: "inventories_warehouse_id_product_id_key",
      fields: ["warehouse_id", "product_id"],
    },
  ]
);

// ===== GOODS RECEIPT =====
addTable(
  "goods_receipts",
  40,
  1450,
  COLORS.receipt,
  "Inbound documents",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    uuid("warehouse_id", { notNull: true }),
    uuid("supplier_id", { nullable: true }),
    enumField("status", "DocumentStatus", {
      notNull: true,
      default: "DRAFT",
    }),
    date("receipt_date", { notNull: true }),
    text("note", { nullable: true }),
    uuid("created_by_id", { notNull: true }),
    uuid("confirmed_by_id", { nullable: true }),
    timestamp("confirmed_at", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    { name: "goods_receipts_status_idx", unique: false, fields: ["status"] },
    {
      name: "goods_receipts_warehouse_id_idx",
      unique: false,
      fields: ["warehouse_id"],
    },
    {
      name: "goods_receipts_supplier_id_idx",
      unique: false,
      fields: ["supplier_id"],
    },
    {
      name: "goods_receipts_receipt_date_idx",
      unique: false,
      fields: ["receipt_date"],
    },
    {
      name: "goods_receipts_created_by_id_idx",
      unique: false,
      fields: ["created_by_id"],
    },
  ]
);

addTable(
  "goods_receipt_items",
  360,
  1450,
  COLORS.receipt,
  "Inbound line items",
  [
    uuid("id", { primary: true }),
    uuid("goods_receipt_id", { notNull: true }),
    uuid("product_id", { notNull: true }),
    decimal("quantity", { notNull: true, size: "15,3" }),
    decimal("unit_cost", { notNull: true, default: "0", size: "15,2" }),
    text("note", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    {
      name: "goods_receipt_items_goods_receipt_id_idx",
      unique: false,
      fields: ["goods_receipt_id"],
    },
    {
      name: "goods_receipt_items_product_id_idx",
      unique: false,
      fields: ["product_id"],
    },
  ]
);

// ===== GOODS ISSUE =====
addTable(
  "goods_issues",
  680,
  1450,
  COLORS.issue,
  "Outbound documents",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    uuid("warehouse_id", { notNull: true }),
    uuid("customer_id", { nullable: true }),
    enumField("status", "DocumentStatus", {
      notNull: true,
      default: "DRAFT",
    }),
    date("issue_date", { notNull: true }),
    text("note", { nullable: true }),
    uuid("created_by_id", { notNull: true }),
    uuid("confirmed_by_id", { nullable: true }),
    timestamp("confirmed_at", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    { name: "goods_issues_status_idx", unique: false, fields: ["status"] },
    {
      name: "goods_issues_warehouse_id_idx",
      unique: false,
      fields: ["warehouse_id"],
    },
    {
      name: "goods_issues_customer_id_idx",
      unique: false,
      fields: ["customer_id"],
    },
    { name: "goods_issues_issue_date_idx", unique: false, fields: ["issue_date"] },
    {
      name: "goods_issues_created_by_id_idx",
      unique: false,
      fields: ["created_by_id"],
    },
  ]
);

addTable(
  "goods_issue_items",
  1000,
  1450,
  COLORS.issue,
  "Outbound line items",
  [
    uuid("id", { primary: true }),
    uuid("goods_issue_id", { notNull: true }),
    uuid("product_id", { notNull: true }),
    decimal("quantity", { notNull: true, size: "15,3" }),
    decimal("unit_price", { notNull: true, default: "0", size: "15,2" }),
    text("note", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    {
      name: "goods_issue_items_goods_issue_id_idx",
      unique: false,
      fields: ["goods_issue_id"],
    },
    {
      name: "goods_issue_items_product_id_idx",
      unique: false,
      fields: ["product_id"],
    },
  ]
);

// ===== STOCK TAKE =====
addTable(
  "stock_takes",
  40,
  2050,
  COLORS.stocktake,
  "Stock take documents",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    uuid("warehouse_id", { notNull: true }),
    enumField("status", "DocumentStatus", {
      notNull: true,
      default: "DRAFT",
    }),
    date("take_date", { notNull: true }),
    text("note", { nullable: true }),
    uuid("created_by_id", { notNull: true }),
    uuid("confirmed_by_id", { nullable: true }),
    timestamp("confirmed_at", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    { name: "stock_takes_status_idx", unique: false, fields: ["status"] },
    {
      name: "stock_takes_warehouse_id_idx",
      unique: false,
      fields: ["warehouse_id"],
    },
    { name: "stock_takes_take_date_idx", unique: false, fields: ["take_date"] },
    {
      name: "stock_takes_created_by_id_idx",
      unique: false,
      fields: ["created_by_id"],
    },
  ]
);

addTable(
  "stock_take_items",
  360,
  2050,
  COLORS.stocktake,
  "Counted vs system qty",
  [
    uuid("id", { primary: true }),
    uuid("stock_take_id", { notNull: true }),
    uuid("product_id", { notNull: true }),
    decimal("system_qty", { notNull: true, size: "15,3" }),
    decimal("counted_qty", { notNull: true, size: "15,3" }),
    text("note", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    {
      name: "stock_take_items_stock_take_id_idx",
      unique: false,
      fields: ["stock_take_id"],
    },
    {
      name: "stock_take_items_product_id_idx",
      unique: false,
      fields: ["product_id"],
    },
  ],
  [
    {
      name: "stock_take_items_stock_take_id_product_id_key",
      fields: ["stock_take_id", "product_id"],
    },
  ]
);

// ===== STOCK ADJUSTMENT =====
addTable(
  "stock_adjustments",
  680,
  2050,
  COLORS.adjust,
  "Manual stock adjustments",
  [
    uuid("id", { primary: true }),
    varchar("code", { unique: true, notNull: true }),
    uuid("warehouse_id", { notNull: true }),
    enumField("status", "DocumentStatus", {
      notNull: true,
      default: "DRAFT",
    }),
    date("adjust_date", { notNull: true }),
    text("reason", { notNull: true }),
    text("note", { nullable: true }),
    uuid("created_by_id", { notNull: true }),
    uuid("confirmed_by_id", { nullable: true }),
    timestamp("confirmed_at", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    { name: "stock_adjustments_status_idx", unique: false, fields: ["status"] },
    {
      name: "stock_adjustments_warehouse_id_idx",
      unique: false,
      fields: ["warehouse_id"],
    },
    {
      name: "stock_adjustments_adjust_date_idx",
      unique: false,
      fields: ["adjust_date"],
    },
    {
      name: "stock_adjustments_created_by_id_idx",
      unique: false,
      fields: ["created_by_id"],
    },
  ]
);

addTable(
  "stock_adjustment_items",
  1000,
  2050,
  COLORS.adjust,
  "Increase/Decrease lines",
  [
    uuid("id", { primary: true }),
    uuid("stock_adjustment_id", { notNull: true }),
    uuid("product_id", { notNull: true }),
    enumField("type", "AdjustmentType", { notNull: true }),
    decimal("quantity", { notNull: true, size: "15,3" }),
    text("note", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
    timestamp("updated_at", { notNull: true }),
  ],
  [
    {
      name: "stock_adjustment_items_stock_adjustment_id_idx",
      unique: false,
      fields: ["stock_adjustment_id"],
    },
    {
      name: "stock_adjustment_items_product_id_idx",
      unique: false,
      fields: ["product_id"],
    },
  ],
  [
    {
      name: "stock_adjustment_items_stock_adjustment_id_product_id_key",
      fields: ["stock_adjustment_id", "product_id"],
    },
  ]
);

// ===== AUDIT =====
addTable(
  "audit_logs",
  1280,
  40,
  COLORS.audit,
  "Audit trail",
  [
    uuid("id", { primary: true }),
    uuid("user_id", { nullable: true }),
    varchar("action", { notNull: true }),
    varchar("module", { notNull: true }),
    varchar("entity_type", { nullable: true }),
    varchar("entity_id", { nullable: true }),
    text("description", { nullable: true }),
    jsonb("old_data", { nullable: true }),
    jsonb("new_data", { nullable: true }),
    varchar("ip_address", { nullable: true }),
    text("user_agent", { nullable: true }),
    timestamp("created_at", { notNull: true, default: "CURRENT_TIMESTAMP" }),
  ],
  [
    { name: "audit_logs_action_idx", unique: false, fields: ["action"] },
    { name: "audit_logs_module_idx", unique: false, fields: ["module"] },
    { name: "audit_logs_entity_id_idx", unique: false, fields: ["entity_id"] },
    { name: "audit_logs_user_id_idx", unique: false, fields: ["user_id"] },
    { name: "audit_logs_created_at_idx", unique: false, fields: ["created_at"] },
  ]
);

// Relationships
rel("fk_role_permissions_role", "role_permissions", "role_id", "roles", "id", "Cascade");
rel(
  "fk_role_permissions_permission",
  "role_permissions",
  "permission_id",
  "permissions",
  "id",
  "Cascade"
);
rel("fk_users_role", "users", "role_id", "roles", "id", "Restrict");
rel("fk_refresh_tokens_user", "refresh_tokens", "user_id", "users", "id", "Cascade");

rel("fk_inventories_warehouse", "inventories", "warehouse_id", "warehouses", "id");
rel("fk_inventories_product", "inventories", "product_id", "products", "id");

rel("fk_goods_receipts_warehouse", "goods_receipts", "warehouse_id", "warehouses", "id");
rel("fk_goods_receipts_supplier", "goods_receipts", "supplier_id", "suppliers", "id");
rel("fk_goods_receipts_created_by", "goods_receipts", "created_by_id", "users", "id");
rel("fk_goods_receipts_confirmed_by", "goods_receipts", "confirmed_by_id", "users", "id");
rel(
  "fk_goods_receipt_items_receipt",
  "goods_receipt_items",
  "goods_receipt_id",
  "goods_receipts",
  "id",
  "Cascade"
);
rel("fk_goods_receipt_items_product", "goods_receipt_items", "product_id", "products", "id");

rel("fk_goods_issues_warehouse", "goods_issues", "warehouse_id", "warehouses", "id");
rel("fk_goods_issues_customer", "goods_issues", "customer_id", "customers", "id");
rel("fk_goods_issues_created_by", "goods_issues", "created_by_id", "users", "id");
rel("fk_goods_issues_confirmed_by", "goods_issues", "confirmed_by_id", "users", "id");
rel(
  "fk_goods_issue_items_issue",
  "goods_issue_items",
  "goods_issue_id",
  "goods_issues",
  "id",
  "Cascade"
);
rel("fk_goods_issue_items_product", "goods_issue_items", "product_id", "products", "id");

rel("fk_stock_takes_warehouse", "stock_takes", "warehouse_id", "warehouses", "id");
rel("fk_stock_takes_created_by", "stock_takes", "created_by_id", "users", "id");
rel("fk_stock_takes_confirmed_by", "stock_takes", "confirmed_by_id", "users", "id");
rel(
  "fk_stock_take_items_take",
  "stock_take_items",
  "stock_take_id",
  "stock_takes",
  "id",
  "Cascade"
);
rel("fk_stock_take_items_product", "stock_take_items", "product_id", "products", "id");

rel(
  "fk_stock_adjustments_warehouse",
  "stock_adjustments",
  "warehouse_id",
  "warehouses",
  "id"
);
rel("fk_stock_adjustments_created_by", "stock_adjustments", "created_by_id", "users", "id");
rel(
  "fk_stock_adjustments_confirmed_by",
  "stock_adjustments",
  "confirmed_by_id",
  "users",
  "id"
);
rel(
  "fk_stock_adjustment_items_adj",
  "stock_adjustment_items",
  "stock_adjustment_id",
  "stock_adjustments",
  "id",
  "Cascade"
);
rel(
  "fk_stock_adjustment_items_product",
  "stock_adjustment_items",
  "product_id",
  "products",
  "id"
);

rel("fk_audit_logs_user", "audit_logs", "user_id", "users", "id", "Set null");

const diagram = {
  title: "WMS_Cur Database",
  database: "postgresql",
  tables,
  relationships,
  notes: [
    {
      id: id(),
      x: 1280,
      y: 520,
      title: "Overview",
      content:
        "19 tables · PostgreSQL · Prisma\n\nAuth → Master → Inventory\nDocuments: GR / GI / StockTake / StockAdjustment\nAudit logs track user actions\n\nSource: backend/prisma/schema.prisma",
      color: "#fcf7ac",
      height: 180,
      width: 260,
    },
  ],
  subjectAreas: [
    {
      id: id(),
      name: "Auth / RBAC",
      x: 20,
      y: 20,
      width: 1180,
      height: 560,
      color: "#175e7a",
    },
    {
      id: id(),
      name: "Master Data",
      x: 20,
      y: 600,
      width: 1180,
      height: 460,
      color: "#2f6f4e",
    },
    {
      id: id(),
      name: "Inventory",
      x: 280,
      y: 1080,
      width: 360,
      height: 320,
      color: "#8a5a00",
    },
    {
      id: id(),
      name: "Goods Receipt",
      x: 20,
      y: 1430,
      width: 620,
      height: 560,
      color: "#6b3fa0",
    },
    {
      id: id(),
      name: "Goods Issue",
      x: 660,
      y: 1430,
      width: 620,
      height: 560,
      color: "#a03f3f",
    },
    {
      id: id(),
      name: "Stock Take",
      x: 20,
      y: 2030,
      width: 620,
      height: 560,
      color: "#3f6ba0",
    },
    {
      id: id(),
      name: "Stock Adjustment",
      x: 660,
      y: 2030,
      width: 620,
      height: 560,
      color: "#a06b3f",
    },
    {
      id: id(),
      name: "Audit",
      x: 1260,
      y: 20,
      width: 320,
      height: 480,
      color: "#5a5a5a",
    },
  ],
  enums: [
    { name: "UserStatus", values: ["ACTIVE", "INACTIVE", "LOCKED"] },
    { name: "EntityStatus", values: ["ACTIVE", "INACTIVE"] },
    { name: "DocumentStatus", values: ["DRAFT", "CONFIRMED", "CANCELLED"] },
    { name: "AdjustmentType", values: ["INCREASE", "DECREASE"] },
  ],
};

const outDir = path.join(__dirname, "..", "docs");
const outJson = path.join(outDir, "wms-database.drawdb.json");
const outDdb = path.join(outDir, "wms-database.ddb");

fs.writeFileSync(outJson, JSON.stringify(diagram, null, 2));
fs.writeFileSync(
  outDdb,
  JSON.stringify(
    {
      author: "WMS_Cur",
      project: "WMS_Cur",
      title: diagram.title,
      date: new Date().toISOString(),
      ...diagram,
    },
    null,
    2
  )
);

console.log(`tables: ${tables.length}`);
console.log(`relationships: ${relationships.length}`);
console.log(`enums: ${diagram.enums.length}`);
console.log(`written: ${outJson}`);
console.log(`written: ${outDdb}`);
