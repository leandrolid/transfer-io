import prisma from "@/infra/database";
import { compare } from "bcrypt";
import { z } from "zod";

export async function loginController({
  body,
}: {
  body: Record<string, string>;
}) {
  const input = schema.safeParse(body);
  if (!input.success) {
    return Response.json(
      { message: "Dados inválidos", errors: input.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const { email, password } = input.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return Response.json(
      { message: "Email ou senha inválidos", errors: null },
      { status: 401 }
    );
  }
  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) {
    return Response.json(
      { message: "Email ou senha inválidos", errors: null },
      { status: 401 }
    );
  }
  return Response.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

const schema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
});
