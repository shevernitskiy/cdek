import { EventEmitter } from "../deps.ts";

import { ApiError } from "./errors/api.ts";
import { AuthError } from "./errors/auth.ts";
import { ApiRequest, ApiResponse, ApiWebhook } from "./types/api.ts";
import { RequestInit } from "./types/lib.ts";

const URL_BASE = "https://api.edu.cdek.ru/v2" as const;

export class Cdek extends EventEmitter<ApiWebhook.EventMap> {
  public token?: ApiResponse.OAuth;
  public token_expire?: number;

  constructor(
    private readonly account: string,
    private readonly password: string,
    private readonly grant_type = "client_credentials",
  ) {
    super();
  }

  private async auth(): Promise<void> {
    try {
      const res = await fetch(URL_BASE + "/oauth/token?parameters", {
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

      this.token = await res.json();
      this.token_expire = Date.now() + (this.token?.expires_in ?? 3600) * 1000;
    } catch (err) {
      throw err;
    }
  }

  private async request<T>(init: RequestInit): Promise<T> {
    try {
      if (this.token_expire === undefined || Date.now() > this.token_expire) {
        await this.auth();
      }

      const target = `${URL_BASE}${init.url}${init.query ? "?" + this.params(init.query) : ""}`;

      const res = await fetch(target, {
        method: init.method,
        headers: {
          "Authorization": `Bearer ${this.token?.access_token}`,
          "Content-Type": "application/json",
        },
        body: init.payload ? JSON.stringify(init.payload) : undefined,
      });

      if (res.ok === false) {
        throw new ApiError(await res.text(), { cause: `${res.status} ${res.statusText}` });
      }

      const data = await res.json();

      return data as T;
    } catch (err) {
      throw err;
    }
  }

  // deno-lint-ignore no-explicit-any
  private params(query: Record<string, any>): URLSearchParams {
    return new URLSearchParams(Object.entries(query).map<string[]>((item) => [item[0], item[1].toString()]));
  }

  public webhookHandler(): (request: Request) => Promise<Response> {
    return async (request: Request) => {
      const data = await request.json() as ApiWebhook.UpdateBase;

      switch (data.type) {
        case "ORDER_STATUS":
          this.emit("ORDER_STATUS", data as ApiWebhook.UpdateOrderStatus);
          break;
        case "PRINT_FORM":
          this.emit("PRINT_FORM", data as ApiWebhook.UpdatePrintForm);
          break;
        case "DOWNLOAD_PHOTO":
          this.emit("DOWNLOAD_PHOTO", data as ApiWebhook.UpdateDownloadPhoto);
          break;
        case "PREALERT_CLOSED":
          this.emit("PREALERT_CLOSED", data as ApiWebhook.UpdatePrealertClosed);
          break;
      }

      return new Response("OK");
    };
  }

  public getRegions(params?: ApiRequest.Regions): Promise<ApiResponse.Regions[]> {
    return this.request<ApiResponse.Regions[]>({
      method: "GET",
      url: "/location/regions",
      query: params,
    });
  }
}
