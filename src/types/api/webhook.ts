/**
 * Тип события вебхука
 */
export type UpdateType =
  /** Событие по статусам заказа */
  | "ORDER_STATUS"
  /** Готовность печатной формы */
  | "PRINT_FORM"
  // | "DOWNLOAD_PHOTO"
  /** Получение информации о закрытии преалерта */
  | "PREALERT_CLOSED"
  /** Получение информации о транспорте для СНТ */
  | "ACCOMPANYING_WAYBILL"
  /** Получение информации об изменении доступности офиса */
  | "OFFICE_AVAILABILITY"
  /** Получение информации об изменении заказа */
  | "ORDER_MODIFIED"
  /** Получение информации об изменении договоренности о доставке */
  | "DELIV_AGREEMENT"
  /** Получение информации о проблемах доставки по заказу */
  | "DELIV_PROBLEM";

/**
 * Код статуса заказа (см. Приложение 1)
 */
export type OrderStatus =
  /** Создан */
  | "CREATED"
  /** Удален */
  | "REMOVED"
  /** Принят на склад отправителя */
  | "RECEIVED_AT_SHIPMENT_WAREHOUSE"
  /** Выдан на отправку в г. отправителе */
  | "READY_TO_SHIP_AT_SENDING_OFFICE"
  /** Возвращен на склад отправителя */
  | "RETURNED_TO_SENDER_WAREHOUSE"
  /** Сдан перевозчику в г. отправителе */
  | "PASSED_TO_CARRIER_AT_SENDING_OFFICE"
  /** Отправлен в г. транзит */
  | "SEND_TO_TRANSIT_OFFICE"
  /** Встречен в г. транзите */
  | "MET_AT_TRANSIT_OFFICE"
  /** Принят на склад транзита */
  | "ACCEPTED_TO_OFFICE_TRANSIT_WAREHOUSE"
  /** Возвращен на склад транзита */
  | "RETURNED_TO_TRANSIT_WAREHOUSE"
  /** Выдан на отправку в г. транзите */
  | "READY_TO_SHIP_IN_TRANSIT_OFFICE"
  /** Сдан перевозчику в г. транзите */
  | "PASSED_TO_CARRIER_AT_TRANSIT_OFFICE"
  /** Отправлен в г. отправитель */
  | "SEND_TO_SENDING_OFFICE"
  /** Отправлен в г. получатель */
  | "SEND_TO_RECIPIENT_OFFICE"
  /** Встречен в г. отправителе */
  | "MET_AT_SENDING_OFFICE"
  /** Встречен в г. получателе */
  | "MET_AT_RECIPIENT_OFFICE"
  /** Принят на склад доставки */
  | "ACCEPTED_AT_DELIVERY_WAREHOUSE"
  /** Принят на склад до востребования */
  | "ACCEPTED_AT_WAREHOUSE_ON_DEMAND"
  /** Выдан на доставку */
  | "ISSUED_FOR_DELIVERY"
  /** Возвращен на склад доставки */
  | "RETURNED_TO_DELIVERY_WAREHOUSE"
  /** Вручен (Конечный статус) */
  | "DELIVERED"
  /** Не вручен (Конечный статус) */
  | "NOT_DELIVERED"
  /** Поступил в г. транзита */
  | "ENTERED_TO_OFFICE_TRANSIT_WAREHOUSE"
  /** Поступил на склад доставки */
  | "ENTERED_TO_DELIVERY_WAREHOUSE"
  /** Поступил на склад до востребования */
  | "ENTERED_TO_WAREHOUSE_ON_DEMAND"
  /** Таможенное оформление в стране отправления */
  | "IN_CUSTOMS_INTERNATIONAL"
  /** Отправлено в страну назначения */
  | "SHIPPED_TO_DESTINATION"
  /** Передано транзитному перевозчику */
  | "PASSED_TO_TRANSIT_CARRIER"
  /** Таможенное оформление в стране назначения */
  | "IN_CUSTOMS_LOCAL"
  /** Таможенное оформление завершено */
  | "CUSTOMS_COMPLETE"
  /** Заложен в постамат */
  | "POSTOMAT_POSTED"
  /** Изъят из постамата курьером */
  | "POSTOMAT_SEIZED"
  /** Изъят из постамата клиентом */
  | "POSTOMAT_RECEIVED"
  /** Готов к отправке в городе отправителе */
  | "READY_FOR_SHIPMENT_IN_SENDER_CITY"
  /** Сдан перевозчику в городе отправителе */
  | "TAKEN_BY_TRANSPORTER_FROM_SENDER_CIT"
  /** Отправлен в город-транзит */
  | "SENT_TO_TRANSIT_CIT"
  /** Встречен в городе-транзите */
  | "ACCEPTED_IN_TRANSIT_CIT"
  /** Принят на склад транзита (Alternative spelling from docs) */
  | "ACCEPTED_AT_TRANSIT_WAREHOUS"
  /** Сдан перевозчику в городе-транзите */
  | "TAKEN_BY_TRANSPORTER_FROM_TRANSIT_CITY"
  /** Отправлен в город-получатель */
  | "SENT_TO_RECIPIENT_CITY"
  /** Встречен в городе-получателе */
  | "ACCEPTED_IN_RECIPIENT_CITY"
  /** Принят на склад до востребования (Alternative) */
  | "ACCEPTED_AT_PICK_UP_POINT"
  /** Выдан на доставку (Alternative) */
  | "TAKEN_BY_COURIER"
  /** Возвращен на склад доставки (Alternative) */
  | "RETURNED_TO_RECIPIENT_CITY_WAREHOUSE";

/**
 * Базовая структура уведомления
 */
export type UpdateBase = {
  /** Тип события */
  type: UpdateType;
  /** Дата и время события (ISO 8601) */
  date_time: string;
  /** Идентификатор сущности (заказа, ПФ и т.д.) */
  uuid: string;
};

/**
 * Уведомление об изменении статуса заказа
 */
export type UpdateOrderStatus = UpdateBase & {
  /** Атрибуты события статуса */
  attributes: {
    /** Признак возвратного заказа: true - возвратный, false - прямой */
    is_return: boolean;
    /** Номер заказа СДЭК */
    cdek_number: string;
    /** Номер заказа в ИС Клиента */
    number?: string;
    /** Код статуса (устаревшее поле) */
    status_code: string;
    /** Код дополнительного статуса (Приложение 2) */
    status_reason_code?: string;
    /** Дата и время установки статуса */
    status_date_time: string;
    /** Наименование города возникновения статуса */
    city_name?: string;
    /** Код города возникновения статуса */
    city_code?: string;
    /** Код статуса (Приложение 1) */
    code: OrderStatus;
    /** Признак реверсного заказа */
    is_reverse: boolean;
    /** Признак клиентского возврата */
    is_client_return: boolean;
    /** Связанные сущности */
    related_entities?: {
      /** Тип связанной сущности (direct_order - прямой заказ, client_direct_order - прямой заказ для клиентского возврата) */
      type: "direct_order" | "client_direct_order";
      /** Номер заказа СДЭК связанной сущности */
      cdek_number: string;
      /** Идентификатор связанной сущности */
      uuid: string;
    }[];
    /** Признак удаления статуса (применяется к ДД) */
    deleted?: boolean;
  };
};

/**
 * Уведомление о готовности печатной формы
 */
export type UpdatePrintForm = UpdateBase & {
  /** Атрибуты события печатной формы */
  attributes: {
    /** Тип печатной формы: WAYBILL (квитанция) или BARCODE (ШК места) */
    type: "WAYBILL" | "BARCODE";
    /** Ссылка на скачивание файла */
    url: string;
  };
};

/**
 * Уведомление о готовности фото документов (старое событие, может быть неактуально, но поддерживается типами)
 */
export type UpdateDownloadPhoto = UpdateBase & {
  /** Атрибуты события фото */
  attributes: {
    /** Номер заказа СДЭК */
    cdek_number: string;
    /** Ссылка на скачивание архива */
    link: string;
  };
};

/**
 * Уведомление о закрытии преалерта
 */
export type UpdatePrealertClosed = UpdateBase & {
  /** Атрибуты события закрытия преалерта */
  attributes: {
    /** Номер СДЭК закрытого преалерта */
    prealert_number: string;
    /** Дата закрытия */
    closed_date: string;
    /** Фактический ПВЗ, в который были переданы заказы */
    fact_shipment_point: string;
  };
};

/**
 * Уведомление о транспорте для СНТ (Сопроводительная накладная на товар)
 */
export type UpdateAccompanyingWaybill = UpdateBase & {
  /** Атрибуты события СНТ */
  attributes: {
    /** Номер заказа СДЭК */
    cdek_number: string;
    /** Наименование юр.лица клиента, создающего СНТ */
    client_name: string;
    /** Номер авиарейса */
    flight_number?: string;
    /** Накладные перевозчика для авиарейса */
    air_waybill_numbers?: string[];
    /** Номера транспортных средств */
    vehicle_numbers?: string[];
    /** Водитель транспортного средства */
    vehicle_driver?: string;
    /** Плановая дата и время отправления (YYYY-MM-DDThh:mm:ss±hhmm) */
    planned_departure_date_time: string;
  };
};

/**
 * Уведомление об изменении доступности офиса
 */
export type UpdateOfficeAvailability = UpdateBase & {
  /** Атрибуты события доступности офиса */
  attributes: {
    /** Тип офиса по доступности: AVAILABLE_OFFICE / UNAVAILABLE_OFFICE */
    type: "AVAILABLE_OFFICE" | "UNAVAILABLE_OFFICE";
    /** Код офиса */
    code: string;
  };
};

/**
 * Уведомление об изменении заказа
 */
export type UpdateOrderModified = UpdateBase & {
  /** Атрибуты события изменения заказа */
  attributes: {
    /** Тип изменения заказа */
    modification_type:
      | "PLANED_DELIVERY_DATE_CHANGED"
      | "DELIVERY_SUM_CHANGED"
      | "DELIVERY_MODE_CHANGED";
    /** Новое значение */
    new_value: {
      /** Тип нового значения (DATE, FLOAT, INTEGER) */
      type: "DATE" | "FLOAT" | "INTEGER";
      /** Само значение в строковом виде */
      value: string;
    };
  };
};

/**
 * Уведомление об изменении договоренности о доставке
 */
export type UpdateDelivAgreement = UpdateBase & {
  /** Атрибуты события договоренности */
  attributes: {
    /** UUID новой договоренности */
    delivery_uuid: string;
    /** Дата создания договоренности */
    date_time: string;
    /** Номер заказа, по которому зарегистрирована новая договоренность */
    cdek_number: string;
    /** Дата доставки, согласованная с получателем */
    date?: string;
    /** Время начала ожидания курьера */
    time_from?: string;
    /** Время окончания ожидания курьера */
    time_to?: string;
    /** Комментарий */
    comment?: string;
    /**
     * Источник создания договоренности
     */
    source:
      | "DAILY_CALL_TASK"
      | "COURIER_SUPPORT"
      | "EK5_INTEGRATION"
      | "WEB_SITE"
      | "MOBILE_APPLICATION"
      | "SELF_CARE"
      | "CABINET"
      | "MIA_BOT"
      | "WEB_SITE_BOT"
      | "MESSENGER_BOT";
    /** Тип договоренности: DOOR (до двери), WAREHOUSE (до ПВЗ), POSTAMAT (до постамата) */
    type: "DOOR" | "WAREHOUSE" | "POSTAMAT";
    /** Код офиса СДЭК (ПВЗ/постамата) */
    delivery_point?: string;
  };
};

/**
 * Уведомление о проблемах доставки по заказу
 */
export type UpdateDelivProblem = UpdateBase & {
  /** Атрибуты события проблемы доставки */
  attributes: {
    /** Номер заказа СДЭК */
    cdek_number: string;
    /** Номер заказа в системе интернет-магазина */
    number?: string;
    /** Код проблемы (см. Приложение 3) */
    code: string;
    /** Дата возникновения проблемы */
    create_date: string;
  };
};

/**
 * Карта событий для использования в типизированных обработчиках
 */
export type EventMap = {
  ORDER_STATUS: [UpdateOrderStatus];
  PRINT_FORM: [UpdatePrintForm];
  DOWNLOAD_PHOTO: [UpdateDownloadPhoto];
  PREALERT_CLOSED: [UpdatePrealertClosed];
  ACCOMPANYING_WAYBILL: [UpdateAccompanyingWaybill];
  OFFICE_AVAILABILITY: [UpdateOfficeAvailability];
  ORDER_MODIFIED: [UpdateOrderModified];
  DELIV_AGREEMENT: [UpdateDelivAgreement];
  DELIV_PROBLEM: [UpdateDelivProblem];
};
