import { createTransferenceController } from "@/infra/controllers/transactions/create-transference.controller";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const headersList = await headers();
  return createTransferenceController({
    userId: headersList.get("userId"),
    body: await request.json(),
  });
}
