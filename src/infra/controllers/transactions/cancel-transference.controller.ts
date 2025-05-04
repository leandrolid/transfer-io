import prisma from "@/infra/database";
import {
  TransactionStatus,
  TransactionType,
} from "@/infra/database/prisma/generated";
import { z } from "zod";

export async function cancelTransferenceController({
  userId,
  params,
}: {
  userId: string | null;
  params: Record<string, unknown>;
}) {
  if (!userId) {
    return Response.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
  }
  const input = schema.safeParse(params);
  if (!input.success) {
    return Response.json(
      { message: "Dados inválidos", errors: input.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { transactionId } = input.data;
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId, account: { userId } },
  });
  if (!transaction) {
    return Response.json(
      { message: "Transação não encontrada" },
      { status: 404 }
    );
  }
  if (transaction.status === TransactionStatus.CANCELLED) {
    return Response.json(
      { message: "Transação já reembolsada" },
      { status: 400 }
    );
  }
  if (!transaction.referenceId) {
    return Response.json(
      { message: "Apenas transferências podem ser reembolsadas" },
      { status: 400 }
    );
  }
  const refTransaction = await prisma.transaction.findUnique({
    where: { id: transaction.referenceId },
  });
  if (!refTransaction) {
    return Response.json(
      { message: "Transação não encontrada" },
      { status: 404 }
    );
  }
  await prisma.$transaction([
    prisma.transaction.createMany({
      data: [
        {
          type: getNewTransactionType(transaction.type),
          amount: transaction.amount,
          accountId: transaction.accountId,
        },
        {
          type: getNewTransactionType(refTransaction.type),
          amount: transaction.amount,
          accountId: refTransaction.accountId,
        },
      ],
    }),
    prisma.transaction.updateMany({
      where: { id: { in: [transaction.id, refTransaction.id] } },
      data: { status: TransactionStatus.CANCELLED },
    }),
    prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: getBalanceOperation(
          getNewTransactionType(transaction.type),
          transaction.amount
        ),
      },
    }),
    prisma.account.update({
      where: { id: refTransaction.accountId },
      data: {
        balance: getBalanceOperation(
          getNewTransactionType(refTransaction.type),
          transaction.amount
        ),
      },
    }),
  ]);
  return Response.json({ message: "Reembolso realizado com sucesso" });
}

const schema = z.object({
  transactionId: z
    .string({ message: "ID da transação é obrigatório" })
    .uuid({ message: "ID da transação inválido" }),
});

function getNewTransactionType(transactionType: TransactionType) {
  return transactionType === TransactionType.CREDIT
    ? TransactionType.DEBIT
    : TransactionType.CREDIT;
}

function getBalanceOperation(transactionType: TransactionType, amount: number) {
  return transactionType === TransactionType.CREDIT
    ? { increment: amount }
    : { decrement: amount };
}
