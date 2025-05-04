"use server";

import { signOut } from "@/infra/auth";
import { HttpError } from "@/presentation/http/errors/http.error";
import { cancelTransaction } from "@/presentation/http/services/transactions/cancel-transaction";
import { revalidateTag } from "next/cache";

export async function signOutAction(_prevState: unknown, _form: FormData) {
  await signOut({ redirect: true, redirectTo: "/login" });
}

export async function cancelTransactionAction(
  _prevState: unknown,
  form: FormData
) {
  try {
    const transactionId = form.get("transactionId") as string;
    await cancelTransaction({ transactionId });
    revalidateTag("getBalance");
    revalidateTag("getTransactions");
    return { success: true, message: null, errors: null };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors };
    }
    return {
      success: false,
      message: "Por favor, tente novamente mais tarde.",
      errors: null,
    };
  }
}
