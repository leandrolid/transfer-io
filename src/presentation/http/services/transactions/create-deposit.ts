import { httpClient } from "@/presentation/http/clients";

export async function createDeposit(input: { amount: number }) {
  return httpClient.request({
    url: "api/transactions/deposit",
    method: "POST",
    body: input,
  });
}
