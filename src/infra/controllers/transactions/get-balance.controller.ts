import prisma from "@/infra/database";

export async function getBalanceController({
  userId,
}: {
  userId: string | null;
}) {
  if (!userId) {
    return Response.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
  }
  const account = await prisma.account.findUnique({
    where: { userId },
  });
  if (!account) {
    return Response.json({ message: "Conta não encontrada" }, { status: 404 });
  }
  return Response.json({
    data: {
      amount: account.balance / 100,
    },
  });
}
