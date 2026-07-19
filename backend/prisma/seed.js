import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, ROLE_DEFINITIONS } from '../src/constants/permissions.js';

const prisma = new PrismaClient();

async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        name: permission.name,
        module: permission.module,
      },
      create: permission,
    });
  }
}

async function seedRoles() {
  const roles = {};

  for (const [key, roleDef] of Object.entries(ROLE_DEFINITIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {
        description: roleDef.description,
      },
      create: {
        name: roleDef.name,
        description: roleDef.description,
      },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

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

async function seedAdminUser(adminRole) {
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@wms.com' },
    update: {
      fullName: 'System Admin',
      passwordHash,
      status: 'ACTIVE',
      roleId: adminRole.id,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    create: {
      email: 'admin@wms.com',
      fullName: 'System Admin',
      passwordHash,
      status: 'ACTIVE',
      roleId: adminRole.id,
    },
  });
}

async function seedMasterData() {
  const warehouses = [
    { code: 'WH-001', name: 'Kho chính Hà Nội', address: '123 Đường ABC, Hà Nội', phone: '0241234567' },
    { code: 'WH-002', name: 'Kho phụ TP.HCM', address: '456 Đường XYZ, TP.HCM', phone: '0287654321' },
  ];

  for (const warehouse of warehouses) {
    await prisma.warehouse.upsert({
      where: { code: warehouse.code },
      update: warehouse,
      create: warehouse,
    });
  }

  const products = [
    { code: 'PRD-001', name: 'Laptop Dell Inspiron 15', category: 'Điện tử', unit: 'pcs', price: 15000000, costPrice: 12000000, minStock: 5 },
    { code: 'PRD-002', name: 'Chuột không dây Logitech', category: 'Phụ kiện', unit: 'pcs', price: 350000, costPrice: 250000, minStock: 20 },
    { code: 'PRD-003', name: 'Giấy A4 Double A', category: 'Văn phòng phẩm', unit: 'ream', price: 65000, costPrice: 50000, minStock: 50 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: product,
      create: product,
    });
  }

  const suppliers = [
    { code: 'SUP-001', name: 'Công ty TNHH ABC Supply', contactPerson: 'Nguyễn Văn A', phone: '0901234567', email: 'contact@abc.com' },
    { code: 'SUP-002', name: 'Công ty CP XYZ Trading', contactPerson: 'Trần Thị B', phone: '0912345678', email: 'info@xyz.com' },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { code: supplier.code },
      update: supplier,
      create: supplier,
    });
  }

  const customers = [
    { code: 'CUS-001', name: 'Công ty CP Alpha', contactPerson: 'Lê Văn C', phone: '0923456789', email: 'sales@alpha.com' },
    { code: 'CUS-002', name: 'Công ty TNHH Beta', contactPerson: 'Phạm Thị D', phone: '0934567890', email: 'order@beta.com' },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { code: customer.code },
      update: customer,
      create: customer,
    });
  }
}

async function main() {
  console.log('Seeding permissions...');
  await seedPermissions();

  console.log('Seeding roles...');
  const roles = await seedRoles();

  console.log('Seeding admin user...');
  await seedAdminUser(roles.ADMIN);

  console.log('Seeding master data...');
  await seedMasterData();

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
