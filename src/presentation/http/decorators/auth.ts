export function AuthDecorator(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = async function (...args: any[]) {
    const request = args[0];
    const { auth } = await import("@/infra/auth");
    const session = await auth();
    if (session && session.user) {
      Object.assign(request, {
        headers: Object.assign(request.headers || {}, {
          userId: session.user.id,
          userEmail: session.user.email,
        }),
      });
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}
