import { httpClient } from "@/presentation/http/clients";

export async function getBalance() {
  return httpClient.request<GetBalanceResponse>({
    url: "api/transactions/balance",
    method: "GET",
    tags: ["getBalance"],
  });
}

export type GetBalanceResponse = {
  data: {
    amount: number;
  };
};
