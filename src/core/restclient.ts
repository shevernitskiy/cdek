import { ApiError } from "../errors/api.ts";
import { AuthError } from "../errors/auth.ts";
import { HttpError } from "../errors/http.ts";
import type { ApiResponse } from "../types/api.ts";
import type { RequestInit, RequestMethod } from "../types/lib.ts";

export abstract class RestClient {
  protected _token?: ApiResponse.OAuth;
  protected _token_expire?: number;
  protected abstract account: string;
  protected abstract password: string;
  protected abstract grant_type: string;
  protected abstract url_base: string;

  get token() {
    return this._token;
  }

  get token_expire() {
    return this._token_expire;
  }

  private async auth(): Promise<void> {
    try {
      const res = await fetch(this.url_base + "/oauth/token?parameters", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "grant_type": this.grant_type,
          "client_id": this.account,
          "client_secret": this.password,
        }),
      });

      if (res.ok === false) {
        throw new AuthError(await res.text(), { cause: `${res.status} ${res.statusText}` });
      }

      this._token = await res.json();
      this._token_expire = Date.now() + (this.token?.expires_in ?? 3600) * 1000;
    } catch (err) {
      throw err;
    }
  }

  protected async request<T>(init: RequestInit & { method: RequestMethod }): Promise<T> {
    try {
      if (this.token_expire === undefined || Date.now() > this.token_expire) {
        await this.auth();
      }

      const target = `${this.url_base}${init.url}${init.query ? "?" + this.params(init.query) : ""}`;

      const res = await fetch(target, {
        method: init.method,
        headers: {
          "Authorization": `Bearer ${this.token?.access_token}`,
          "Content-Type": "application/json",
        },
        body: init.payload ? JSON.stringify(init.payload) : undefined,
      });

      if (res.ok === false) {
        if (res.headers.get("Content-Type") === "application/json") {
          throw new ApiError(await res.json(), `${res.status} ${res.statusText}, ${res.url}`);
        } else {
          throw new HttpError("HttpError\n" + await res.text());
        }
      }

      return (await res.json()) as T;
    } catch (err) {
      throw err;
    }
  }

  protected get<T>(init: RequestInit): Promise<T> {
    return this.request<T>({ ...init, method: "GET" });
  }

  protected post<T>(init: RequestInit): Promise<T> {
    return this.request<T>({ ...init, method: "POST" });
  }

  protected put<T>(init: RequestInit): Promise<T> {
    return this.request<T>({ ...init, method: "PUT" });
  }

  protected patch<T>(init: RequestInit): Promise<T> {
    return this.request<T>({ ...init, method: "PATCH" });
  }

  protected delete<T>(init: RequestInit): Promise<T> {
    return this.request<T>({ ...init, method: "DELETE" });
  }

  // deno-lint-ignore no-explicit-any
  private params(query: Record<string, any>): URLSearchParams {
    return new URLSearchParams(Object.entries(query).map<string[]>((item) => [item[0], item[1].toString()]));
  }
}
