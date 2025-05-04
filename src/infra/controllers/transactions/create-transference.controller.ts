import prisma from "@/infra/database";
import { TransactionType } from "@/infra/database/prisma/generated";
import { v7 as uuid } from "uuid";
import { z } from "zod";

export async function createTransferenceController({
  userId,
  body,
}: {
  userId: string | null;
  body: { amount: number; to: string };
}) {
  if (!userId) {
    return Response.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
  }
  const input = schema.safeParse(body);
  if (!input.success) {
    return Response.json(
      { message: "Dados inválidos", errors: input.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { amount, to } = input.data;
  const targetAccount = await prisma.account.findFirst({
    where: { user: { email: to } },
  });
  if (!targetAccount) {
    return Response.json(
      { message: "Destinatário não encontrado" },
      { status: 404 }
    );
  }
  if (targetAccount.userId === userId) {
    return Response.json(
      { message: "Não é possível transferir para você mesmo" },
      { status: 400 }
    );
  }
  const originAccount = await prisma.account.findUnique({
    where: { userId },
  });
  if (!originAccount) {
    return Response.json(
      { message: "Usuário não encontrado" },
      { status: 404 }
    );
  }
  if (originAccount.balance < amount) {
    return Response.json({ message: "Saldo insuficiente" }, { status: 400 });
  }
  const originId = uuid();
  const targetId = uuid();
  await prisma.$transaction([
    prisma.account.update({
      where: { id: originAccount.id },
      data: { balance: { decrement: amount } },
    }),
    prisma.account.update({
      where: { id: targetAccount.id },
      data: { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        id: originId,
        type: TransactionType.DEBIT,
        amount,
        accountId: originAccount.id,
        referenceId: targetId,
      },
    }),
    prisma.transaction.create({
      data: {
        id: targetId,
        type: TransactionType.CREDIT,
        amount,
        accountId: targetAccount.id,
        referenceId: originId,
      },
    }),
  ]);
  return Response.json({ message: "Transferência realizada com sucesso" });
}

const schema = z.object({
  amount: z
    .number({ message: "Valor é obrigatório" })
    .int({ message: "Valor deve ser um número inteiro" })
    .positive({ message: "Valor deve ser maior que 0" })
    .min(1, { message: "Valor deve ser maior que R$ 0,01" })
    .max(Number.MAX_SAFE_INTEGER, { message: "Valor muito alto" }),
  to: z
    .string({ message: "Destinatário é obrigatório" })
    .email({ message: "Destinatário inválido" }),
});
