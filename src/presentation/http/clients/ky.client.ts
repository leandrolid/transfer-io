import { AuthDecorator } from "@/presentation/http/decorators/auth";
import { HttpError } from "@/presentation/http/errors/http.error";
import ky, { type KyInstance, HTTPError } from "ky";

export type HttpClient = {
  request: <Output>(params: HttpRequest) => Promise<Output>;
};

export type HttpRequest = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
  signal?: AbortSignal;
  tags?: string[];
};

export class KyHttpClient implements HttpClient {
  private readonly client: KyInstance;
  constructor(baseURL?: string) {
    this.client = ky.create({
      prefixUrl: baseURL,
    });
  }

  @AuthDecorator
  async request<Output>(request: HttpRequest): Promise<Output> {
    try {
      const method = this.client[
        request.method.toLowerCase() as keyof KyInstance
      ] as KyInstance["post"];
      const response = await method(request.url, {
        headers: request.headers,
        searchParams: request.query,
        json: request.body,
        signal: request.signal,
        next: {
          tags: request.tags,
        },
      }).json<Output>();
      return response;
    } catch (error) {
      console.error("Error in request", error);
      if (error instanceof HTTPError && error.response) {
        const body = await error.response.json();
        throw new HttpError(error.response.status, body.message, body.errors);
      }
      throw new HttpError(500, (error as Error)?.message ?? "Erro interno");
    }
  }
}
