import { httpClient } from "@/presentation/http/clients";

export async function cancelTransaction(input: { transactionId: string }) {
  return httpClient.request({
    url: `api/transactions/${input.transactionId}/cancel`,
    method: "POST",
  });
}
