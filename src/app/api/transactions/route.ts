import { getTransactionsController } from "@/infra/controllers/transactions/get-transactions.controller";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const headersList = await headers();
  return getTransactionsController({
    userId: headersList.get("userId"),
    query: Object.fromEntries(new URL(request.url).searchParams),
  });
}
