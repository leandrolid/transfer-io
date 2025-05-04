import { httpClient } from "@/presentation/http/clients";

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}) {
  return httpClient.request({
    url: "api/users",
    method: "POST",
    body: input,
  });
}
