"use client";

import { registerAction } from "@/app/(public)/register/actions";
import { useFormState } from "@/presentation/hooks/use-form-state";
import { Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import Link from "next/link";

export function RegisterForm() {
  const [state, formAction, isPending] = useFormState(registerAction);
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "1rem",
        width: "100%",
        maxWidth: "20rem",
      }}
      asChild
    >
      <form onSubmit={formAction}>
        <Flex direction="column" gap="1">
          <Text as="label" htmlFor="name" size="2" weight="bold">
            Nome
          </Text>
          <TextField.Root
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome"
            size="2"
          />
          <Text size="1" color="red">
            {state.errors?.name && state.errors.name[0]}
          </Text>
        </Flex>
        <Flex direction="column" gap="1">
          <Text as="label" htmlFor="email" size="2" weight="bold">
            E-mail
          </Text>
          <TextField.Root
            id="email"
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            size="2"
            inputMode="email"
          />
          <Text size="1" color="red">
            {state.errors?.email && state.errors.email[0]}
          </Text>
        </Flex>
        <Flex direction="column" gap="1">
          <Text as="label" htmlFor="password" size="2" weight="bold">
            Senha
          </Text>
          <TextField.Root
            id="password"
            name="password"
            type="password"
            placeholder="********"
            size="2"
          />
          <Text size="1" color="red">
            {state.errors?.password && state.errors.password[0]}
          </Text>
        </Flex>

        <Flex direction="column" gap="1">
          <Text
            as="label"
            htmlFor="passwordConfirmation"
            size="2"
            weight="bold"
          >
            Confirme sua senha
          </Text>
          <TextField.Root
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            placeholder="********"
            size="2"
          />
          <Text size="1" color="red">
            {state.errors?.passwordConfirmation &&
              state.errors.passwordConfirmation[0]}
          </Text>
        </Flex>

        <Button type="submit" size="2" loading={isPending} disabled={isPending}>
          Criar conta
        </Button>
        <Button size="1" variant="ghost" loading={isPending} asChild>
          <Link href="/login">Já tenho uma conta</Link>
        </Button>
      </form>
    </Card>
  );
}
