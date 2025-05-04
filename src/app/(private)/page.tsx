import { cancelTransactionAction } from "@/app/(private)/actions";
import { TransactionsTable } from "@/presentation/components/transactions/transactions-table";
import { getBalance } from "@/presentation/http/services/transactions/get-balance";
import { HandCoins, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  Flex,
  Grid,
  Heading,
  IconButton,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { Suspense } from "react";

export default async function PrivatePage(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const { data: balance } = await getBalance();
  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Flex align="center" justify="between">
          <Heading as="h2" size="3" weight="bold">
            Extrato
          </Heading>
          <Flex align="center" justify="center" gap="4">
            <IconButton size="2" asChild>
              <Link href={"/deposit"}>
                <PlusCircle />
              </Link>
            </IconButton>

            <IconButton size="2" variant="outline" asChild>
              <Link href={"/transfer"}>
                <HandCoins />
              </Link>
            </IconButton>
          </Flex>
        </Flex>

        <Grid columns="2" gap="4">
          <Card>
            <Flex direction="column" gap="2">
              <Text as="p" weight="bold">
                Saldo
              </Text>
              <Text as="p" weight="light">
                {brlFormatter.format(balance.amount)}
              </Text>
            </Flex>
          </Card>
          <Card />
        </Grid>
      </Flex>

      <Suspense key={page} fallback={<Skeleton height="500px" loading />}>
        <TransactionsTable
          page={page}
          cancelTransactionAction={cancelTransactionAction}
        />
      </Suspense>
    </Flex>
  );
}

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
