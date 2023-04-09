import { Mixin } from "../deps.ts";

import { EventEmitter } from "./core/eventemitter.ts";
import { REST } from "./core/rest.ts";

import type { ApiRequest, ApiResponse, ApiWebhook } from "./types/api.ts";

export class Cdek extends Mixin(REST, EventEmitter<ApiWebhook.EventMap>) {
  constructor(
    protected account: string,
    protected password: string,
    protected grant_type = "client_credentials",
  ) {
    super();
  }

  webhookHandler(): (request: Request) => Promise<Response> {
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

  getRegions(params?: ApiRequest.Regions): Promise<ApiResponse.Regions[]> {
    return this.get<ApiResponse.Regions[]>({
      url: "/location/regions",
      query: params,
    });
  }

  addWebhook(params?: ApiRequest.AddWebhook): Promise<ApiResponse.AddWebhook> {
    return this.post<ApiResponse.AddWebhook>({
      url: "/webhooks",
      payload: params,
    });
  }

  addOrder(params: ApiRequest.AddOrder): Promise<ApiResponse.AddOrder> {
    return this.post<ApiResponse.AddOrder>({
      url: "/orders",
      payload: params,
    });
  }

  getOrderByUUID(uuid: string): Promise<ApiResponse.GetOrder> {
    return this.get<ApiResponse.GetOrder>({
      url: `/orders/${uuid}`,
    });
  }

  getOrderByCdekNumber(cdek_number: number): Promise<ApiResponse.GetOrder> {
    return this.get<ApiResponse.GetOrder>({
      url: `/orders`,
      query: { cdek_number: cdek_number },
    });
  }

  getOrderByImNumber(im_number: number): Promise<ApiResponse.GetOrder> {
    return this.get<ApiResponse.GetOrder>({
      url: `/orders`,
      query: { im_number: im_number },
    });
  }

  updateOrder(params: ApiRequest.UpdateOrder): Promise<ApiResponse.UpdateOrder> {
    return this.patch<ApiResponse.UpdateOrder>({
      url: "/orders",
      payload: params,
    });
  }

  deleteOrderByUUID(uuid: string): Promise<ApiResponse.DeleteOrder> {
    return this.delete<ApiResponse.DeleteOrder>({
      url: `/orders/${uuid}`,
    });
  }

  addRefusal(order_uuid: string): Promise<ApiResponse.AddRefusal> {
    return this.post<ApiResponse.AddOrder>({
      url: `/orders/${order_uuid}/refusal`,
    });
  }
}
