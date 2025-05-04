import { depositAction } from "@/app/(private)/deposit/actions";
import { DepositForm } from "@/presentation/components/transactions/deposit-form";

export default function DepositPage() {
  return <DepositForm action={depositAction} />;
}
