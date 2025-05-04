"use server";

import { HttpError } from "@/presentation/http/errors/http.error";
import { createDeposit } from "@/presentation/http/services/transactions/create-deposit";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function depositAction(data: FormData) {
  const form = schema.safeParse(Object.fromEntries(data));
  if (!form.success) {
    return {
      success: false,
      message: null,
      errors: form.error.flatten().fieldErrors,
    };
  }
  try {
    await createDeposit({ amount: form.data.amount });
    revalidateTag("getBalance");
    revalidateTag("getTransactions");
    return { success: true, message: null, errors: null };
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        success: false,
        message: error.message,
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: "Por favor, tente novamente mais tarde.",
      errors: null,
    };
  }
}

const schema = z.object({
  amount: z
    .string({ message: "Valor é obrigatório" })
    .regex(/^R\$\s((\d*?)(\.)?)*?\,\d{2}$/, {
      message: "Valor inválido",
    })
    .transform((value) => parseInt(value.replace(/\D/g, "") || "0", 10))
    .refine((value) => value > 0, { message: "Valor deve ser maior que 0" })
    .refine((value) => value <= Number.MAX_SAFE_INTEGER, {
      message: "Valor muito alto",
    }),
});
