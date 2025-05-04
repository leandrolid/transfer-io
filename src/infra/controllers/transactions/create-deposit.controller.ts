import prisma from "@/infra/database";
import { TransactionType } from "@/infra/database/prisma/generated";
import { z } from "zod";

export async function createDepositController({
  userId,
  body,
}: {
  userId: string | null;
  body: Record<string, string>;
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
  const { amount } = input.data;
  const account = await prisma.account.findUnique({
    where: { userId },
  });
  if (!account) {
    return Response.json({ message: "Conta não encontrada" }, { status: 404 });
  }
  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        type: TransactionType.CREDIT,
        amount,
        accountId: account.id,
      },
    }),
    prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: amount } },
    }),
  ]);
  return Response.json({ message: "Depósito realizado com sucesso" });
}

const schema = z.object({
  amount: z
    .number({ message: "Valor é obrigatório" })
    .int({ message: "Valor deve ser um número inteiro" })
    .positive({ message: "Valor deve ser maior que 0" })
    .min(1, { message: "Valor deve ser maior que R$ 0,01" })
    .max(Number.MAX_SAFE_INTEGER, { message: "Valor muito alto" }),
});
