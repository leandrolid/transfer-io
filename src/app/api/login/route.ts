import { loginController } from "@/infra/controllers/login/login.controller";

export async function POST(request: Request) {
  return loginController({
    body: await request.json(),
  });
}
