import prisma from "@/infra/database";
import { hash } from "bcrypt";
import { z } from "zod";

export async function createUserController({
  body,
}: {
  body: Record<string, string>;
}) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        message: "Dados inválidos",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }
  const { email, password, name } = result.data;
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return Response.json(
      {
        message: "Usuário já existe",
        errors: {
          email: ["Email já cadastrado"],
        },
      },
      { status: 409 }
    );
  }
  const user = await prisma.user.create({
    data: {
      email,
      password: await hash(password, 10),
      name,
      account: {
        create: {
          balance: 0,
        },
      },
    },
  });
  return Response.json({ data: { id: user.id, email, name } }, { status: 201 });
}

const schema = z
  .object({
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
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      message: "As senhas não coincidem",
      path: ["passwordConfirmation"],
    }
  );
