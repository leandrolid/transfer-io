import { Flex } from "@radix-ui/themes";

export default async function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="2"
      p="4"
      height="100vh"
    >
      {children}
    </Flex>
  );
}
