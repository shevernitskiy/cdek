// deno-lint-ignore-file
import { ApiError } from "../errors/api.ts";
import { AuthError } from "../errors/auth.ts";
import { HttpError } from "../errors/http.ts";
import { Request } from "./api/base.ts";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestInit = {
  url: string;
  query?: Record<string, any>;
  payload?: any;
};

export type InitOptions = {
  account: string;
  password: string;
  grant_type?: string;
  url_base?: "https://api.edu.cdek.ru/v2" | "https://api.cdek.ru/v2";
  on_error?: (error: Error | ApiError | AuthError | HttpError) => void | Promise<void>;
};

export type InvalidRequest = {
  requests: Request[];
};
