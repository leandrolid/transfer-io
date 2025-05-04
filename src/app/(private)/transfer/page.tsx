import { createTransferenceAction } from "@/app/(private)/transfer/actions";
import { TransferForm } from "@/presentation/components/transactions/transfer-form";

export default function TransferPage() {
  return <TransferForm action={createTransferenceAction} />;
}
