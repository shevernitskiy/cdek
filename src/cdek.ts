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

  /**
   * Обработчик входящих вебхуков.
   * Парсит запрос, определяет тип события и вызывает соответствующий event listener.
   */
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

  // --- LOCATION ---

  /** Получение списка регионов */
  getRegions(params?: ApiRequest.GetRegions): Promise<ApiResponse.GetRegions[]> {
    return this.rest.get<ApiResponse.GetRegions[]>({
      url: "/location/regions",
      query: params,
    });
  }

  /** Получение списка населенных пунктов */
  getCities(params?: ApiRequest.GetCities): Promise<ApiResponse.GetCities[]> {
    return this.rest.get<ApiResponse.GetCities[]>({
      url: "/location/cities",
      query: params,
    });
  }

  /** Получение локации по координатам */
  getCityByCoordinates(latitude: number, longitude: number): Promise<ApiResponse.GetCities> {
    return this.rest.get<ApiResponse.GetCities>({
      url: "/location/coordinates",
      query: { latitude, longitude },
    });
  }

  // --- WEBHOOKS ---

  /** Добавление подписки на вебхуки */
  addWebhook(params?: ApiRequest.AddWebhook): Promise<ApiResponse.AddWebhook> {
    return this.rest.post<ApiResponse.AddWebhook>({
      url: "/webhooks",
      payload: params,
    });
  }

  /** Получение информации о подписке по UUID */
  getWebhookByUUID(uuid: string): Promise<ApiResponse.GetWebhook> {
    return this.rest.get<ApiResponse.GetWebhook>({
      url: `/webhooks/${uuid}`,
    });
  }

  /** Получение списка всех подписок */
  getWebhooks(): Promise<ApiResponse.GetWebhooks> {
    return this.rest.get<ApiResponse.GetWebhooks>({
      url: "/webhooks",
    });
  }

  /** Удаление подписки на вебхуки */
  deleteWebhookByUUID(uuid: string): Promise<ApiResponse.DeleteWebhook> {
    return this.rest.delete<ApiResponse.DeleteWebhook>({
      url: `/webhooks/${uuid}`,
    });
  }

  // --- ORDERS ---

  /** Регистрация заказа */
  addOrder(params: ApiRequest.AddOrder): Promise<ApiResponse.AddOrder> {
    return this.rest.post<ApiResponse.AddOrder>({
      url: "/orders",
      payload: params,
    });
  }

  /** Получение информации о заказе по UUID */
  getOrderByUUID(uuid: string): Promise<ApiResponse.GetOrder> {
    return this.rest.get<ApiResponse.GetOrder>({
      url: `/orders/${uuid}`,
    });
  }

  /** Получение информации о заказе по номеру СДЭК */
  getOrderByCdekNumber(cdek_number: number): Promise<ApiResponse.GetOrder> {
    return this.rest.get<ApiResponse.GetOrder>({
      url: "/orders",
      query: { cdek_number: cdek_number },
    });
  }

  /** Получение информации о заказе по номеру ИМ */
  getOrderByImNumber(im_number: number): Promise<ApiResponse.GetOrder> {
    return this.rest.get<ApiResponse.GetOrder>({
      url: "/orders",
      query: { im_number: im_number },
    });
  }

  /** Изменение заказа */
  updateOrder(params: ApiRequest.UpdateOrder): Promise<ApiResponse.UpdateOrder> {
    return this.rest.patch<ApiResponse.UpdateOrder>({
      url: "/orders",
      payload: params,
    });
  }

  /** Удаление заказа */
  deleteOrderByUUID(uuid: string): Promise<ApiResponse.DeleteOrder> {
    return this.rest.delete<ApiResponse.DeleteOrder>({
      url: `/orders/${uuid}`,
    });
  }

  /** Регистрация отказа */
  addRefusal(order_uuid: string): Promise<ApiResponse.AddRefusal> {
    return this.rest.post<ApiResponse.AddRefusal>({
      url: `/orders/${order_uuid}/refusal`,
    });
  }

  /** Регистрация клиентского возврата */
  createClientReturn(params: ApiRequest.CreateClientReturn): Promise<ApiResponse.CreateClientReturn> {
    return this.rest.post<ApiResponse.CreateClientReturn>({
      url: `orders/${params.order_uuid}/clientReturn`,
      payload: { tariff_code: params.tariff_code },
    });
  }

  // --- INTAKES (Couriers) ---

  /** Регистрация заявки на вызов курьера */
  addCourier(params: ApiRequest.AddCourier): Promise<ApiResponse.AddCourier> {
    return this.rest.post<ApiResponse.AddCourier>({
      url: "/intakes",
      payload: params,
    });
  }

  /** Получение информации о заявке на вызов курьера */
  getCourierDetails(uuid: string): Promise<ApiResponse.GetCourierDetails> {
    return this.rest.get<ApiResponse.GetCourierDetails>({
      url: `/intakes/${uuid}`,
    });
  }

  /** Удаление заявки на вызов курьера */
  deleteCourier(uuid: string): Promise<ApiResponse.DeleteCourier> {
    return this.rest.delete<ApiResponse.DeleteCourier>({
      url: `/intakes/${uuid}`,
    });
  }

  /** Получение всех заявок по заказу */
  getIntakes(orderUuid: string): Promise<ApiResponse.GetCourierDetails[]> {
    return this.rest.get<ApiResponse.GetCourierDetails[]>({
      url: `/orders/${orderUuid}/intakes`,
    });
  }

  // --- PRINT ---

  /** Формирование квитанции к заказу */
  createOrderReceipt(params: ApiRequest.CreateOrderReceipt): Promise<ApiResponse.CreateOrderReceipt> {
    return this.rest.post<ApiResponse.CreateOrderReceipt>({
      url: "/print/orders",
      payload: params,
    });
  }

  /** Получение квитанции к заказу */
  getOrderReceipt(uuid: string): Promise<ApiResponse.GetOrderReceipt> {
    return this.rest.get<ApiResponse.GetOrderReceipt>({
      url: `/print/orders/${uuid}`,
    });
  }

  /** Скачивание квитанции по UUID */
  downloadOrderReceiptByUUID(uuid: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(`/print/orders/${uuid}.pdf`);
  }

  /** Скачивание квитанции по URL */
  downloadOrderReceiptByURL(url: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(url, false);
  }

  /** Формирование ШК места */
  createBarcodeCP(params: ApiRequest.CreateBarcodeCP): Promise<ApiResponse.CreateBarcodeCP> {
    return this.rest.post<ApiResponse.CreateBarcodeCP>({
      url: "/print/barcodes",
      payload: params,
    });
  }

  /** Получение ШК места */
  getBarcodeCP(uuid: string): Promise<ApiResponse.GetBarcodeCP> {
    return this.rest.get<ApiResponse.GetBarcodeCP>({
      url: `/print/barcodes/${uuid}`,
    });
  }

  /** Скачивание ШК места по UUID */
  downloadBarcodeCPByUUID(uuid: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(`/print/barcodes/${uuid}.pdf`);
  }

  /** Скачивание ШК места по URL */
  downloadBarcodeCPByURL(url: string): Promise<ReadableStream<Uint8Array>> {
    return this.rest.download(url, false);
  }

  // --- DELIVERY (Appointment) ---

  /** Регистрация договоренности о доставке */
  addDeliveryAppointment(params: ApiRequest.AddDeliveryAppointment): Promise<ApiResponse.AddDeliveryAppointment> {
    return this.rest.post<ApiResponse.AddDeliveryAppointment>({
      url: "/delivery",
      payload: params,
    });
  }

  /** Получение информации о договоренности о доставке */
  getDeliveryAppointment(uuid: string): Promise<ApiResponse.GetDeliveryAppointment> {
    return this.rest.get<ApiResponse.GetDeliveryAppointment>({
      url: `/delivery/${uuid}`,
    });
  }

  /** Получение интервалов доставки (для существующего заказа) */
  getDeliveryIntervals(params: ApiRequest.GetDeliveryIntervals): Promise<ApiResponse.GetDeliveryIntervals> {
    return this.rest.get<ApiResponse.GetDeliveryIntervals>({
      url: "/delivery/intervals",
      query: params,
    });
  }

  // --- PREALERT ---

  /** Регистрация преалерта */
  addPrealert(params: ApiRequest.AddPrealert): Promise<ApiResponse.AddPrealert> {
    return this.rest.post<ApiResponse.AddPrealert>({
      url: "/prealert",
      payload: params,
    });
  }

  /** Получение информации о преалерте */
  getPrealert(uuid: string): Promise<ApiResponse.GetPrealert> {
    return this.rest.get<ApiResponse.GetPrealert>({
      url: `/prealert/${uuid}`,
    });
  }

  // --- INFO (Passport, Check, Registry) ---

  /** Получение паспортных данных */
  getPassportData(params: ApiRequest.GetPassportData): Promise<ApiResponse.GetPassportData> {
    return this.rest.get<ApiResponse.GetPassportData>({
      url: "/passport",
      query: params,
    });
  }

  /** Получение информации о чеке */
  getCashboxCheck(params: ApiRequest.GetCashboxCheck): Promise<ApiResponse.GetCashboxCheck> {
    return this.rest.get<ApiResponse.GetCashboxCheck>({
      url: "/check",
      query: params,
    });
  }

  /** Получение реестра наложенных платежей */
  getCashOnDeliveryRegistry(
    params: ApiRequest.GetCashOnDeliveryRegistry,
  ): Promise<ApiResponse.GetCashOnDeliveryRegistry> {
    return this.rest.get<ApiResponse.GetCashOnDeliveryRegistry>({
      url: "/registries",
      query: params,
    });
  }

  /** Получение информации о переводе наложенного платежа */
  getCashOnDeliveryTransfer(
    params: ApiRequest.GetCashOnDeliveryTransfer,
  ): Promise<ApiResponse.GetCashOnDeliveryTransfer> {
    return this.rest.get<ApiResponse.GetCashOnDeliveryTransfer>({
      url: "/payment",
      query: params,
    });
  }

  /** Получение списка ПВЗ */
  getPickupPoints(params?: ApiRequest.GetPickupPoints): Promise<ApiResponse.GetPickupPoints[]> {
    return this.rest.get<ApiResponse.GetPickupPoints[]>({
      url: "/deliverypoints",
      query: params,
    });
  }

  // --- CALCULATOR ---

  /** Расчет по коду тарифа */
  calculatorByTariff(params: ApiRequest.CalculatorByTariff): Promise<ApiResponse.CalculatorByTariff> {
    return this.rest.post<ApiResponse.CalculatorByTariff>({
      url: "/calculator/tariff",
      payload: params,
    });
  }

  /** Расчет по доступным тарифам */
  calculatorByAvaibleTariffs(
    params: ApiRequest.CalculatorByAvaibleTariffs,
  ): Promise<ApiResponse.CalculatorByAvaibleTariffs> {
    return this.rest.post<ApiResponse.CalculatorByAvaibleTariffs>({
      url: "/calculator/tarifflist",
      payload: params,
    });
  }

  /** Получение списка всех доступных тарифов по договору */
  availableTariffs(lang?: string): Promise<ApiResponse.CalculatorByAvaibleTariffs> {
    return this.rest.get<ApiResponse.CalculatorByAvaibleTariffs>({
      url: "/calculator/alltariffs",
      query: lang ? { lang } : undefined,
    });
  }

  /** Таможенный калькулятор (расчет пошлин) */
  calculatorCustoms(
    params: ApiRequest.CalculatorCustoms,
  ): Promise<ApiResponse.CalculatorCustoms> {
    return this.rest.post<ApiResponse.CalculatorCustoms>({
      url: "/calculator/customs",
      payload: params,
    });
  }

  // --- REVERSE ---

  /** Проверка доступности реверса */
  checkReverseAvailability(params: ApiRequest.CheckReverseAvailability): Promise<void> {
    return this.rest.post<void>({
      url: "/reverse/availability",
      payload: params,
    });
  }

  // --- OTHER ---

  /** Получение заказов с готовыми фото */
  getFinishedOrders(params: ApiRequest.GetFinishedOrders): Promise<ApiResponse.GetFinishedOrders> {
    return this.rest.post<ApiResponse.GetFinishedOrders>({
      url: "/photoDocument",
      payload: params,
    });
  }

  /** Принудительное обновление токена */
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
