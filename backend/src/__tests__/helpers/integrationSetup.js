import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { PERMISSIONS, ROLE_DEFINITIONS } from '../../constants/permissions.js';

export async function resetDatabase() {
  await prisma.auditLog.deleteMany();
  await prisma.stockAdjustmentItem.deleteMany();
  await prisma.stockAdjustment.deleteMany();
  await prisma.stockTakeItem.deleteMany();
  await prisma.stockTake.deleteMany();
  await prisma.goodsIssueItem.deleteMany();
  await prisma.goodsIssue.deleteMany();
  await prisma.goodsReceiptItem.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();
}

async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.create({ data: permission });
  }
}

async function seedRoles() {
  const roles = {};

  for (const [key, roleDef] of Object.entries(ROLE_DEFINITIONS)) {
    const role = await prisma.role.create({
      data: {
        name: roleDef.name,
        description: roleDef.description,
      },
    });

    const permissions = await prisma.permission.findMany({
      where: { code: { in: roleDef.permissions } },
    });

    if (permissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId: role.id,
          permissionId: permission.id,
        })),
      });
    }

    roles[key] = role;
  }

  return roles;
}

async function createUser(email, fullName, password, roleId) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      status: 'ACTIVE',
      roleId,
    },
  });
}

async function seedMasterData() {
  const warehouse = await prisma.warehouse.create({
    data: {
      code: 'WH-TEST',
      name: 'Kho test integration',
      address: 'Test address',
      status: 'ACTIVE',
    },
  });

  const product = await prisma.product.create({
    data: {
      code: 'PRD-TEST',
      name: 'Sản phẩm test',
      unit: 'pcs',
      price: 100000,
      costPrice: 80000,
      minStock: 0,
      status: 'ACTIVE',
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      code: 'SUP-TEST',
      name: 'NCC test',
      status: 'ACTIVE',
    },
  });

  const customer = await prisma.customer.create({
    data: {
      code: 'CUS-TEST',
      name: 'KH test',
      status: 'ACTIVE',
    },
  });

  return { warehouse, product, supplier, customer };
}

export async function seedIntegrationFixtures() {
  await resetDatabase();
  await seedPermissions();
  const roles = await seedRoles();

  const admin = await createUser('admin@wms.com', 'System Admin', 'Admin@123', roles.ADMIN.id);
  const manager = await createUser('manager@wms.com', 'Test Manager', 'Manager@123', roles.MANAGER.id);
  const staff = await createUser('staff@wms.com', 'Test Staff', 'Staff@123', roles.STAFF.id);

  const master = await seedMasterData();

  return {
    users: {
      admin: { ...admin, password: 'Admin@123' },
      manager: { ...manager, password: 'Manager@123' },
      staff: { ...staff, password: 'Staff@123' },
    },
    roles,
    ...master,
  };
}

export async function prepareIntegrationEnvironment() {
  try {
    await prisma.$connect();
    const fixtures = await seedIntegrationFixtures();
    return { ready: true, fixtures, prisma };
  } catch (error) {
    console.warn('[integration] Database unavailable, skipping integration tests:', error.message);
    return { ready: false, fixtures: null, prisma };
  }
}

let sharedContext = null;
let initPromise = null;

export async function getIntegrationContext() {
  if (sharedContext) return sharedContext;
  if (!initPromise) {
    initPromise = prepareIntegrationEnvironment();
  }
  sharedContext = await initPromise;
  return sharedContext;
}

let tornDown = false;

export async function teardownIntegrationOnce() {
  if (tornDown) return;
  tornDown = true;
  try {
    await prisma.$disconnect();
  } catch {
    // ignore
  }
}
