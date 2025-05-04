import { CancelTransactionButton } from "@/presentation/components/transactions/cancel-transaction";
import { Pagination } from "@/presentation/components/ui/pagination";
import type { FormState } from "@/presentation/hooks/use-form-state";
import { getTransactions } from "@/presentation/http/services/transactions/get-transactions";
import { ScrollArea, Table } from "@radix-ui/themes";

export async function TransactionsTable({
  page,
  cancelTransactionAction,
}: {
  page: number;
  cancelTransactionAction: (
    prevState: unknown,
    data: FormData
  ) => Promise<FormState>;
}) {
  const { data, meta } = await boundary({
    input: { page },
    request: getTransactions,
    onError: () => ({
      data: [],
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
    }),
  });
  return (
    <div>
      <ScrollArea
        type="auto"
        scrollbars="vertical"
        style={{ maxHeight: "500px" }}
      >
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">
                Valor
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">
                Data
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center" width="5rem">
                Reverter
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell>
                  {getName(transaction.type, transaction.referenceId)}
                </Table.Cell>
                <Table.Cell justify="center">
                  {brlFormatter.format(transaction.amount)}
                </Table.Cell>
                <Table.Cell justify="center">
                  {dateFormatter.format(new Date(transaction.createdAt))}
                </Table.Cell>
                <Table.Cell justify="center">
                  {transaction.isRefundable ? (
                    <CancelTransactionButton
                      transactionId={transaction.id}
                      action={cancelTransactionAction}
                    />
                  ) : (
                    "-"
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </ScrollArea>
      <Pagination
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
      />
    </div>
  );
}

async function boundary<Input, Output>({
  input,
  request,
  onError,
}: {
  input: Input;
  request: (inp: Input) => Promise<Output>;
  onError: (error: unknown) => Output;
}) {
  try {
    return await request(input);
  } catch (error) {
    console.error(error);
    return onError?.(error);
  }
}

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

function getName(type: string, referenceId: string | null) {
  if (referenceId) return "Transferência";
  if (type === "CREDIT") return "Crédito";
  if (type === "DEBIT") return "Débito";
  return "Desconhecido";
}
