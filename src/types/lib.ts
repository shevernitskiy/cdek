// deno-lint-ignore-file
export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestInit = {
  method: RequestMethod;
  url: string;
  query?: Record<string, any>;
  payload?: any;
};
