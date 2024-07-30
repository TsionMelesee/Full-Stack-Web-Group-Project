import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  const hashedPassword = await hashPassword('123abc');
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'admin',
      email: 'admin@example.com',
      userrole: UserRole.ADMIN,
      hash: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
