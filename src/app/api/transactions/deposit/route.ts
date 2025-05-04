import { createDepositController } from "@/infra/controllers/transactions/create-deposit.controller";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const headersList = await headers();
  return createDepositController({
    userId: headersList.get("userId"),
    body: await request.json(),
  });
}
