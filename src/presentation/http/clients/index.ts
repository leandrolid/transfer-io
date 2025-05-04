import { KyHttpClient } from "@/presentation/http/clients/ky.client";

export const httpClient = new KyHttpClient(process.env.NEXT_PUBLIC_API_URL);
