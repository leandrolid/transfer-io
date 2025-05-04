import { signOutAction } from "@/app/(private)/actions";
import { auth } from "@/infra/auth";
import { UserDropdown } from "@/presentation/components/dashboard/user-dropdown";
import { Container, Flex, Heading } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default async function PrivateLayout({
  children,
  drawer,
}: Readonly<{
  children: React.ReactNode;
  drawer: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Flex
        asChild
        align="center"
        justify="between"
        gap="4"
        p="4"
        height="4rem"
        style={{
          background: "var(--gray-2)",
          borderBottom: "1px solid var(--gray-7)",
        }}
      >
        <header>
          <Flex align="center" gap="2" asChild>
            <Link href={"/"}>
              <Image
                src="/vercel.svg"
                alt="Vercel logomark"
                width={10}
                height={10}
              />
              <Heading as="h1" size="2" weight="bold">
                Transfer.io
              </Heading>
            </Link>
          </Flex>

          <UserDropdown action={signOutAction} />
        </header>
      </Flex>

      <Container size="4" p="4">
        {children}
        {drawer}
      </Container>
    </SessionProvider>
  );
}
