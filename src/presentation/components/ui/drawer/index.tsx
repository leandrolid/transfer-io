"use client";

import { X } from "@phosphor-icons/react/dist/ssr";
import { Flex, IconButton, Theme } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import styles from "./styles.module.css";

export function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <Dialog.Root defaultOpen onOpenChange={() => router.back()}>
      <Dialog.Portal>
        <Theme>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.content}>
            <Flex align="center" justify="between">
              <Dialog.Close asChild>
                <IconButton
                  size="1"
                  variant="ghost"
                  radius="full"
                  className={styles.close}
                >
                  <X />
                </IconButton>
              </Dialog.Close>
            </Flex>
            {children}
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Title({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Dialog.Title hidden aria-hidden>
      {children}
    </Dialog.Title>
  );
}

export function Description({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Dialog.Description hidden aria-hidden>
      {children}
    </Dialog.Description>
  );
}
