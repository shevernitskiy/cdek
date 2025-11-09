import { EventEmitter } from "./core/eventemitter.ts";
import { RestClient } from "./core/restclient.ts";
import type { ApiRequest, ApiResponse, ApiWebhook } from "./types/api.ts";
import type { InitOptions } from "./types/lib.ts";

export class Cdek extends EventEmitter<ApiWebhook.EventMap> {
  private rest: RestClient;

  constructor(options: InitOptions) {
    super();
    this.rest = new RestClient(options);
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
        case "PREALERT_CLOSED":
          this.emit("PREALERT_CLOSED", data as ApiWebhook.UpdatePrealertClosed);
          break;
        case "ACCOMPANYING_WAYBILL":
          this.emit("ACCOMPANYING_WAYBILL", data as ApiWebhook.UpdateAccompanyingWaybill);
          break;
        case "DELIV_AGREEMENT":
          this.emit("DELIV_AGREEMENT", data as ApiWebhook.UpdateDelivAgreement);
          break;
        case "DELIV_PROBLEM":
          this.emit("DELIV_PROBLEM", data as ApiWebhook.UpdateDelivProblem);
          break;
        case "OFFICE_AVAILABILITY":
          this.emit("OFFICE_AVAILABILITY", data as ApiWebhook.UpdateOfficeAvailability);
          break;
        case "ORDER_MODIFIED":
          this.emit("ORDER_MODIFIED", data as ApiWebhook.UpdateOrderModified);
          break;
      }

      return new Response("OK");
    };
  }

  getRegions(params?: ApiRequest.GetRegions): Promise<ApiResponse.GetRegions[]> {
    return this.rest.get<ApiResponse.GetRegions[]>({
      url: "/location/regions",
      query: params,
    });
  }

  addWebhook(params?: ApiRequest.AddWebhook): Promise<ApiResponse.AddWebhook> {
    return this.rest.post<ApiResponse.AddWebhook>({
      url: "/webhooks",
      payload: params,
    });
  }

  getWebhookByUUID(uuid: string): Promise<ApiResponse.GetWebhook> {
    return this.rest.get<ApiResponse.GetWebhook>({
      url: `/webhooks/${uuid}`,
    });
  }

  getWebhooks(): Promise<ApiResponse.GetWebhooks> {
    return this.rest.get<ApiResponse.GetWebhooks>({
      url: "/webhooks",
    });
  }

  deleteWebhookByUUID(uuid: string): Promise<ApiResponse.DeleteWebhook> {
    return this.rest.delete<ApiResponse.DeleteWebhook>({
      url: `/webhooks/${uuid}`,
    });
  }

  addOrder(params: ApiRequest.AddOrder): Promise<ApiResponse.AddOrder> {
    return this.rest.post<ApiResponse.AddOrder>({
      url: "/orders",
      payload: params,
    });
  }

  getOrderByUUID(uuid: string): Promise<ApiResponse.GetOrder> {
    return this.rest.get<ApiResponse.GetOrder>({
      url: `/orders/${uuid}`,
    });
  }

  getOrderByCdekNumber(cdek_number: number): Promise<ApiResponse.GetOrder> {
    return this.rest.get<ApiResponse.GetOrder>({
      url: "/orders",
      query: { cdek_number: cdek_number },
    });
  }

  getOrderByImNumber(im_number: number): Promise<ApiResponse.GetOrder> {
    return this.rest.get<ApiResponse.GetOrder>({
      url: "/orders",
      query: { im_number: im_number },
    });
  }

  updateOrder(params: ApiRequest.UpdateOrder): Promise<ApiResponse.UpdateOrder> {
    return this.rest.patch<ApiResponse.UpdateOrder>({
      url: "/orders",
      payload: params,
    });
  }

  deleteOrderByUUID(uuid: string): Promise<ApiResponse.DeleteOrder> {
    return this.rest.delete<ApiResponse.DeleteOrder>({
      url: `/orders/${uuid}`,
    });
  }

  addRefusal(order_uuid: string): Promise<ApiResponse.AddRefusal> {
    return this.rest.post<ApiResponse.AddOrder>({
      url: `/orders/${order_uuid}/refusal`,
    });
  }

  addCourier(params: ApiRequest.AddCourier): Promise<ApiResponse.AddCourier> {
    return this.rest.post<ApiResponse.AddCourier>({
      url: "/intakes",
      payload: params,
    });
  }

  getCourierDetails(uuid: string): Promise<ApiResponse.GetCourierDetails> {
    return this.rest.get<ApiResponse.GetCourierDetails>({
      url: `/intakes/${uuid}`,
    });
  }

  deleteCourier(uuid: string): Promise<ApiResponse.DeleteCourier> {
    return this.rest.delete<ApiResponse.DeleteCourier>({
      url: `/intakes/${uuid}`,
    });
  }

  createOrderReceipt(params: ApiRequest.CreateOrderReceipt): Promise<ApiResponse.CreateOrderReceipt> {
    return this.rest.post<ApiResponse.CreateOrderReceipt>({
      url: "/print/orders",
      payload: params,
    });
  }

  getOrderReceipt(uuid: string): Promise<ApiResponse.GetOrderReceipt> {
    return this.rest.get<ApiResponse.GetOrderReceipt>({
      url: `/print/orders/${uuid}`,
    });
  }

  downloadOrderReceiptByUUID(uuid: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(`/print/orders/${uuid}.pdf`);
  }

  downloadOrderReceiptByURL(url: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(url, false);
  }

  createBarcodeCP(params: ApiRequest.CreateBarcodeCP): Promise<ApiResponse.CreateBarcodeCP> {
    return this.rest.post<ApiResponse.CreateBarcodeCP>({
      url: "/print/barcodes",
      payload: params,
    });
  }

  getBarcodeCP(uuid: string): Promise<ApiResponse.GetBarcodeCP> {
    return this.rest.get<ApiResponse.GetBarcodeCP>({
      url: `/print/barcodes/${uuid}`,
    });
  }

  downloadBarcodeCPByUUID(uuid: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(`/print/barcodes/${uuid}.pdf`);
  }

  downloadBarcodeCPByURL(url: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(url, false);
  }

  addDeliveryAppointment(params: ApiRequest.AddDeliveryAppointment): Promise<ApiResponse.AddDeliveryAppointment> {
    return this.rest.post<ApiResponse.AddDeliveryAppointment>({
      url: "/delivery",
      payload: params,
    });
  }

  getDeliveryAppointment(uuid: string): Promise<ApiResponse.GetDeliveryAppointment> {
    return this.rest.get<ApiResponse.GetDeliveryAppointment>({
      url: `/delivery/${uuid}`,
    });
  }

  addPrealert(params: ApiRequest.AddPrealert): Promise<ApiResponse.AddPrealert> {
    return this.rest.post<ApiResponse.AddPrealert>({
      url: "/prealert",
      payload: params,
    });
  }

  getPrealert(uuid: string): Promise<ApiResponse.GetPrealert> {
    return this.rest.get<ApiResponse.GetPrealert>({
      url: `/delivery/${uuid}`,
    });
  }

  getPassportData(params: ApiRequest.GetPassportData): Promise<ApiResponse.GetPassportData> {
    return this.rest.get<ApiResponse.GetPassportData>({
      url: "/passport",
      query: params,
    });
  }

  getCashboxCheck(params: ApiRequest.GetCashboxCheck): Promise<ApiResponse.GetCashboxCheck> {
    return this.rest.get<ApiResponse.GetCashboxCheck>({
      url: "/check",
      query: params,
    });
  }

  getCashOnDeliveryRegistry(
    params: ApiRequest.GetCashOnDeliveryRegistry,
  ): Promise<ApiResponse.GetCashOnDeliveryRegistry> {
    return this.rest.get<ApiResponse.GetCashOnDeliveryRegistry>({
      url: "/registries",
      query: params,
    });
  }

  getCashOnDeliveryTransfer(
    params: ApiRequest.GetCashOnDeliveryTransfer,
  ): Promise<ApiResponse.GetCashOnDeliveryTransfer> {
    return this.rest.get<ApiResponse.GetCashOnDeliveryTransfer>({
      url: "/payment",
      query: params,
    });
  }

  getPickupPoints(params?: ApiRequest.GetPickupPoints): Promise<ApiResponse.GetPickupPoints[]> {
    return this.rest.get<ApiResponse.GetPickupPoints[]>({
      url: "/deliverypoints",
      query: params,
    });
  }

  getCities(params?: ApiRequest.GetCities): Promise<ApiResponse.GetCities[]> {
    return this.rest.get<ApiResponse.GetCities[]>({
      url: "/location/cities",
      query: params,
    });
  }

  calculatorByTariff(params: ApiRequest.CalculatorByTariff): Promise<ApiResponse.CalculatorByTariff> {
    return this.rest.post<ApiResponse.CalculatorByTariff>({
      url: "/calculator/tariff",
      payload: params,
    });
  }

  calculatorByAvaibleTariffs(
    params: ApiRequest.CalculatorByAvaibleTariffs,
  ): Promise<ApiResponse.CalculatorByAvaibleTariffs> {
    return this.rest.post<ApiResponse.CalculatorByAvaibleTariffs>({
      url: "/calculator/tarifflist",
      payload: params,
    });
  }

  /** @deprecated The method seems removed by CDEK without any changelog */
  calculatorCustoms(
    params: ApiRequest.CalculatorCustoms,
  ): Promise<ApiResponse.CalculatorCustoms> {
    return this.rest.post<ApiResponse.CalculatorCustoms>({
      url: "/ddp",
      payload: params,
    });
  }

  getFinishedOrders(params: ApiRequest.GetFinishedOrders): Promise<ApiResponse.GetFinishedOrders> {
    return this.rest.post<ApiResponse.GetFinishedOrders>({
      url: "/photoDocument",
      payload: params,
    });
  }

  createClientReturn(params: ApiRequest.CreateClientReturn): Promise<ApiResponse.CreateClientReturn> {
    return this.rest.post<ApiResponse.CreateClientReturn>({
      url: `orders/${params.order_uuid}/clientReturn`,
      payload: { tariff_code: params.tariff_code },
    });
  }

  // force to refresh token
  refreshToken(): Promise<void> {
    return this.rest.auth();
  }

  get token(): string | undefined {
    return this.rest.token?.access_token;
  }

  get tokenExpire(): number | undefined {
    return this.rest.token_expire;
  }
}
