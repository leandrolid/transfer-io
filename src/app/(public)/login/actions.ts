"use server";

import { signIn } from "@/infra/auth";
import type { HttpError } from "@/presentation/http/errors/http.error";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export const loginWithPasswordAction = async (
  prevState: unknown,
  data: FormData
) => {
  const form = schema.safeParse(Object.fromEntries(data));
  if (!form.success) {
    return {
      success: false,
      message: null,
      errors: form.error.flatten().fieldErrors,
    };
  }
  let redirectTo: string | null = null;
  try {
    redirectTo = await signIn("credentials", {
      ...form.data,
      redirect: false,
      redirectTo: "/",
    });
    return { success: true, message: null, errors: null };
  } catch (error) {
    if (error instanceof AuthError && error.cause) {
      const cause = error.cause as { err: HttpError };
      return {
        success: false,
        message: cause.err.message,
        errors: cause.err.errors,
      };
    }
    return {
      success: false,
      message: "Por favor, tente novamente mais tarde.",
      errors: null,
    };
  } finally {
    if (redirectTo) redirect(redirectTo);
  }
};

const schema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
});
