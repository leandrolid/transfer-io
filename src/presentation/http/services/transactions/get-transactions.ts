import type {
  TransactionStatus,
  TransactionType,
} from "@/infra/database/prisma/generated";
import { httpClient } from "@/presentation/http/clients";

export async function getTransactions({
  page,
  pageSize = 10,
}: {
  page: number;
  pageSize?: number;
}) {
  return httpClient.request<GetTransactionsResponse>({
    url: "api/transactions",
    method: "GET",
    query: { page, pageSize },
    tags: ["getTransactions"],
  });
}

export type GetTransactionsResponse = {
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  data: {
    id: string;
    status: TransactionStatus;
    type: TransactionType;
    amount: number;
    createdAt: string;
    updatedAt: string;
    accountId: string;
    referenceId: string | null;
    isRefundable: boolean;
  }[];
};
