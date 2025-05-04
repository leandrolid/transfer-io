import { createUserController } from "@/infra/controllers/users/create-user.controller";

export async function POST(request: Request) {
  return createUserController({
    body: await request.json(),
  });
}
