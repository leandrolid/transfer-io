import { auth } from "@/infra/auth";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await auth();
  if (isAuthenticated) {
    return redirect("/");
  }
  return <>{children}</>;
}
