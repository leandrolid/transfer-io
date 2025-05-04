"use server";

import { signIn } from "@/infra/auth";
import { HttpError } from "@/presentation/http/errors/http.error";
import { createUser } from "@/presentation/http/services/users/create-user";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export const registerAction = async (data: FormData) => {
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
    await createUser(form.data);
    redirectTo = await signIn("credentials", {
      ...form.data,
      redirect: false,
      redirectTo: "/",
    });
    return { success: true, message: null, errors: null };
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        success: false,
        message: error.message,
        errors: error.errors,
      };
    }
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
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  passwordConfirmation: z
    .string({ message: "Confirmação de senha é obrigatória" })
    .min(8, {
      message: "Confirmação de senha deve ter pelo menos 8 caracteres",
    }),
});
