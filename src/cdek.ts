import { Mixin } from "../deps.ts";

import { EventEmitter } from "./core/eventemitter.ts";
import { RestClient } from "./core/restclient.ts";

import type { ApiRequest, ApiResponse, ApiWebhook } from "./types/api.ts";
import { InitOptions } from "./types/lib.ts";

export class Cdek extends Mixin(RestClient, EventEmitter<ApiWebhook.EventMap>) {
  constructor(options: InitOptions) {
    super();
    this.account = options.account;
    this.password = options.password;
    this.grant_type = options.grant_type ?? "client_credentials";
    this.url_base = options.url_base ?? "https://api.cdek.ru/v2";
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

  getRegions(params?: ApiRequest.GetRegions): Promise<ApiResponse.GetRegions[]> {
    return this.get<ApiResponse.GetRegions[]>({
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

  addCourier(params: ApiRequest.AddCourier): Promise<ApiResponse.AddCourier> {
    return this.post<ApiResponse.AddCourier>({
      url: `/intakes`,
      payload: params,
    });
  }

  getCourierDetails(uuid: string): Promise<ApiResponse.GetCourierDetails> {
    return this.get<ApiResponse.GetCourierDetails>({
      url: `/intakes/${uuid}`,
    });
  }

  deleteCourier(uuid: string): Promise<ApiResponse.DeleteCourier> {
    return this.delete<ApiResponse.DeleteCourier>({
      url: `/intakes/${uuid}`,
    });
  }

  createOrderReceipt(params: ApiRequest.CreateOrderReceipt): Promise<ApiResponse.CreateOrderReceipt> {
    return this.post<ApiResponse.CreateOrderReceipt>({
      url: `/print/orders`,
      payload: params,
    });
  }

  receiveOrderReceipt(uuid: string): Promise<ApiResponse.ReceiveOrderReceipt> {
    return this.get<ApiResponse.ReceiveOrderReceipt>({
      url: `/print/orders/${uuid}`,
    });
  }

  createBarcodeCP(params: ApiRequest.CreateBarcodeCP): Promise<ApiResponse.CreateBarcodeCP> {
    return this.post<ApiResponse.CreateBarcodeCP>({
      url: `/print/barcodes`,
      payload: params,
    });
  }

  receiveBarcodeCP(uuid: string): Promise<ApiResponse.ReceiveBarcodeCP> {
    return this.get<ApiResponse.ReceiveBarcodeCP>({
      url: `/print/barcodes/${uuid}`,
    });
  }

  addDeliveryAppointment(params: ApiRequest.AddDeliveryAppointment): Promise<ApiResponse.AddDeliveryAppointment> {
    return this.post<ApiResponse.AddDeliveryAppointment>({
      url: `/delivery`,
      payload: params,
    });
  }

  getDeliveryAppointment(uuid: string): Promise<ApiResponse.GetDeliveryAppointment> {
    return this.get<ApiResponse.GetDeliveryAppointment>({
      url: `/delivery/${uuid}`,
    });
  }

  addPrealert(params: ApiRequest.AddPrealert): Promise<ApiResponse.AddPrealert> {
    return this.post<ApiResponse.AddPrealert>({
      url: `/prealert`,
      payload: params,
    });
  }

  getPrealert(uuid: string): Promise<ApiResponse.GetPrealert> {
    return this.get<ApiResponse.GetPrealert>({
      url: `/delivery/${uuid}`,
    });
  }

  getPassportData(params: ApiRequest.GetPassportData): Promise<ApiResponse.GetPassportData> {
    return this.get<ApiResponse.GetPassportData>({
      url: "/passport",
      query: params,
    });
  }

  getCashboxCheck(params: ApiRequest.GetCashboxCheck): Promise<ApiResponse.GetCashboxCheck> {
    return this.get<ApiResponse.GetCashboxCheck>({
      url: "/check",
      query: params,
    });
  }

  getCashOnDeliveryRegistry(
    params: ApiRequest.GetCashOnDeliveryRegistry,
  ): Promise<ApiResponse.GetCashOnDeliveryRegistry> {
    return this.get<ApiResponse.GetCashOnDeliveryRegistry>({
      url: "/registries",
      query: params,
    });
  }

  getCashOnDeliveryTransfer(
    params: ApiRequest.GetCashOnDeliveryTransfer,
  ): Promise<ApiResponse.GetCashOnDeliveryTransfer> {
    return this.get<ApiResponse.GetCashOnDeliveryTransfer>({
      url: "/payment",
      query: params,
    });
  }

  getPickupPoints(params?: ApiRequest.GetPickupPoints): Promise<ApiResponse.GetPickupPoints[]> {
    return this.get<ApiResponse.GetPickupPoints[]>({
      url: "/deliverypoints",
      query: params,
    });
  }

  getCities(params?: ApiRequest.GetCities): Promise<ApiResponse.GetCities[]> {
    return this.get<ApiResponse.GetCities[]>({
      url: "/location/cities",
      query: params,
    });
  }

  calculatorByTariff(params: ApiRequest.CalculatorByTariff): Promise<ApiResponse.CalculatorByTariff> {
    return this.post<ApiResponse.CalculatorByTariff>({
      url: `/calculator/tariff`,
      payload: params,
    });
  }

  calculatorByAvaibleTariffs(
    params: ApiRequest.CalculatorByAvaibleTariffs,
  ): Promise<ApiResponse.CalculatorByAvaibleTariffs> {
    return this.post<ApiResponse.CalculatorByAvaibleTariffs>({
      url: `/calculator/tarifflist`,
      payload: params,
    });
  }

  calculatorCustoms(
    params: ApiRequest.CalculatorCustoms,
  ): Promise<ApiResponse.CalculatorCustoms> {
    return this.post<ApiResponse.CalculatorCustoms>({
      url: `/ddp`,
      payload: params,
    });
  }

  getFinishedOrders(params: ApiRequest.GetFinishedOrders): Promise<ApiResponse.GetFinishedOrders> {
    return this.post<ApiResponse.GetFinishedOrders>({
      url: `/photoDocument`,
      payload: params,
    });
  }

  createClientReturn(params: ApiRequest.CreateClientReturn): Promise<ApiResponse.CreateClientReturn> {
    return this.post<ApiResponse.CreateClientReturn>({
      url: `orders/${params.order_uuid}/clientReturn`,
      payload: { tariff_code: params.tariff_code },
    });
  }
}
