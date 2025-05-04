import {
  PrismaClient,
  TransactionType,
} from "@/infra/database/prisma/generated";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  const password = await hash("12345678", 2);
  const createAccount = {
    create: {
      balance: 1000_00,
      transactions: {
        createMany: {
          data: [{ type: TransactionType.CREDIT, amount: 1000_00 }],
        },
      },
    },
  };
  await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Leandro Augusto",
        email: "leandro.augusto@email.com",
        password,
        account: createAccount,
      },
    }),
    prisma.user.create({
      data: {
        name: "Fulano de Tal",
        email: "fulano.tal@email.com",
        password,
        account: createAccount,
      },
    }),
    prisma.user.create({
      data: {
        name: "Ciclano de Tal",
        email: "ciclano.tal@email.com",
        password,
        account: createAccount,
      },
    }),
  ]);
}

seed();
