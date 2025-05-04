"use client";

import { depositAction } from "@/app/(private)/deposit/actions";
import { DepositForm } from "@/presentation/components/transactions/deposit-form";
import * as Drawer from "@/presentation/components/ui/drawer";

export default function DepositPage() {
  return (
    <Drawer.Root>
      <Drawer.Title>Realizar Depósito</Drawer.Title>
      <Drawer.Description>Realize um depósito na sua conta.</Drawer.Description>
      <DepositForm action={depositAction} />
    </Drawer.Root>
  );
}
