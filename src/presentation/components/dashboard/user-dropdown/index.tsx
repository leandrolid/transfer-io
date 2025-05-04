"use client";

import { CaretDown, SignOut } from "@phosphor-icons/react/dist/ssr";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Inset,
  Popover,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { useActionState } from "react";

export function UserDropdown({
  action,
}: Readonly<{
  action: (prevState: unknown, data: FormData) => Promise<unknown>;
}>) {
  const { data, status } = useSession();
  const [, formAction, isPending] = useActionState(action, null);
  if (status === "loading") return null;
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Flex align="center" gap="1">
          <Avatar
            src={data?.user?.image || undefined}
            fallback={getInitials(data?.user?.name)}
            radius="full"
          />
          <CaretDown weight="bold" />
        </Flex>
      </Popover.Trigger>
      <Popover.Content minWidth="250px" side="bottom" align="end">
        <Inset side="all" p="0">
          <Box p="4">
            <Text as="p" weight="bold">
              {data?.user?.name}
            </Text>
            <Text as="p" weight="light">
              {data?.user?.email}
            </Text>
          </Box>
          <Separator orientation="horizontal" size="4" />
          <Flex direction="column" gap="2" p="2">
            <Flex align="center" gap="1" asChild>
              <form action={formAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="3"
                  autoFocus={false}
                  loading={isPending}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1,
                    margin: 0,
                  }}
                >
                  Sair <SignOut weight="regular" />
                </Button>
              </form>
            </Flex>
          </Flex>
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "N/A";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
}
