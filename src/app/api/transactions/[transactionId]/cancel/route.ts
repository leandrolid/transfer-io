import { cancelTransferenceController } from "@/infra/controllers/transactions/cancel-transference.controller";
import { headers } from "next/headers";

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ transactionId: string }> }
) {
  const headersList = await headers();
  const { transactionId } = await ctx.params;
  return cancelTransferenceController({
    userId: headersList.get("userId"),
    params: { transactionId },
  });
}
