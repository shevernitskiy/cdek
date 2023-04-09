// deno-lint-ignore-file
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
};
