import { httpClient } from "@/presentation/http/clients";

export async function createTransference(input: {
  amount: number;
  to: string;
}) {
  return httpClient.request({
    url: "api/transactions/transfer",
    method: "POST",
    body: input,
  });
}
