import { getBalanceController } from "@/infra/controllers/transactions/get-balance.controller";
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  return getBalanceController({
    userId: headersList.get("userId"),
  });
}
