"use client";

import type { FormState } from "@/presentation/hooks/use-form-state";
import { Swap } from "@phosphor-icons/react/dist/ssr";
import { IconButton } from "@radix-ui/themes";
import { useActionState } from "react";

export function CancelTransactionButton({
  transactionId,
  action,
}: Readonly<{
  transactionId: string;
  action: (prevState: unknown, data: FormData) => Promise<FormState>;
}>) {
  const [, formAction, isPending] = useActionState(action, {
    success: false,
    message: null,
    errors: null,
  });
  const data = new FormData();
  data.append("transactionId", transactionId);
  return (
    <form action={formAction.bind(null, data)}>
      <IconButton
        size="1"
        radius="full"
        color="red"
        loading={isPending}
        disabled={isPending}
      >
        <Swap weight="bold" />
      </IconButton>
    </form>
  );
}
