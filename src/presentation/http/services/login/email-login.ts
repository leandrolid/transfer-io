import { httpClient } from "@/presentation/http/clients";

export function emailLogin(input: { email: string; password: string }) {
  return httpClient.request<EmailLoginResponse>({
    url: "api/login",
    method: "POST",
    body: input,
  });
}

type EmailLoginResponse = {
  data: {
    id: string;
    name: string;
    email: string;
  };
};
