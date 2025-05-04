import { createTransferenceAction } from "@/app/(private)/transfer/actions";
import { TransferForm } from "@/presentation/components/transactions/transfer-form";
import * as Drawer from "@/presentation/components/ui/drawer";

export default function TransferPage() {
  return (
    <Drawer.Root>
      <Drawer.Title>Realizar Transferência</Drawer.Title>
      <Drawer.Description>
        Realize uma transferência para outra conta
      </Drawer.Description>
      <TransferForm action={createTransferenceAction} />
    </Drawer.Root>
  );
}
