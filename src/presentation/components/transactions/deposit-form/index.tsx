"use client";

import {
  useFormState,
  type FormState,
} from "@/presentation/hooks/use-form-state";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

export function DepositForm({
  action,
}: Readonly<{
  action: (data: FormData) => Promise<FormState>;
}>) {
  const router = useRouter();
  const [state, formAction, isPending] = useFormState(action, () => {
    router.back();
  });
  const [amount, setAmount] = useState("");
  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = parseInt(rawValue || "0", 10);
    const value = numericValue / 100;
    setAmount(brlFormatter.format(value));
  }
  return (
    <Flex direction="column" gap="2" width="100%" maxWidth="20rem" mx="auto">
      <Heading as="h2" size="3" weight="bold">
        Realizar Depósito
      </Heading>
      <Text weight="light">Realize um depósito na sua conta</Text>

      <Flex asChild direction="column" gap="4" mt="4">
        <form onSubmit={formAction}>
          <Flex direction="column" gap="2">
            <Text as="label" htmlFor="email" size="2" weight="bold">
              Valor
            </Text>
            <TextField.Root
              id="amount"
              name="amount"
              type="text"
              placeholder="R$ 0,00"
              size="2"
              inputMode="decimal"
              autoComplete="off"
              value={amount}
              onChange={handleAmountChange}
            />
            <Text size="1" color="red">
              {state.errors?.amount && state.errors.amount[0]}
            </Text>
          </Flex>
          <Button type="submit" loading={isPending} disabled={isPending}>
            Confirmar
          </Button>
        </form>
      </Flex>
    </Flex>
  );
}

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
