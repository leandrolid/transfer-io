import prisma from "@/infra/database";
import {
  TransactionStatus,
  TransactionType,
} from "@/infra/database/prisma/generated";
import { z } from "zod";

export async function getTransactionsController({
  userId,
  query,
}: {
  userId: string | null;
  query: Record<string, string>;
}) {
  if (!userId) {
    return Response.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
  }
  const input = schema.safeParse(query);
  if (!input.success) {
    return Response.json(
      { message: "Dados inválidos", errors: input.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { page, pageSize } = input.data;
  const account = await prisma.account.findUnique({
    where: { userId },
  });
  if (!account) {
    return Response.json({ message: "Conta não encontrada" }, { status: 404 });
  }
  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.transaction.count({
      where: { accountId: account.id },
    }),
  ]);
  return Response.json({
    data: transactions.map((transaction) => {
      const amount = transaction.amount / 100;
      return {
        ...transaction,
        amount: transaction.type === TransactionType.DEBIT ? -amount : amount,
        isRefundable:
          !!transaction.referenceId &&
          transaction.status !== TransactionStatus.CANCELLED,
      };
    }),
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

const schema = z.object({
  page: z.coerce
    .number({ message: "Página é obrigatória" })
    .int({ message: "Página deve ser um número inteiro" })
    .positive({ message: "Página deve ser maior que 0" })
    .min(1, { message: "Página deve ser maior que 0" }),
  pageSize: z.coerce
    .number({ message: "Tamanho da página é obrigatório" })
    .int({ message: "Tamanho da página deve ser um número inteiro" })
    .positive({ message: "Tamanho da página deve ser maior que 0" })
    .min(1, { message: "Tamanho da página deve ser maior que 0" }),
});
