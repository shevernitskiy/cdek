import type {
  Contact,
  EntityOperation,
  Error,
  Location,
  Money,
  Package,
  Phone,
  PrintForm,
  Request,
  Seller,
  Service,
  Status,
  Threshold,
  Warning,
} from "./base.ts";
import type { UpdateType } from "./webhook.ts";

/**
 * Ответ при получении токена авторизации
 */
export type OAuth = {
  /** Маркер доступа, который необходимо передавать в заголовке Authorization */
  access_token: string;
  /** Тип маркера (всегда Bearer) */
  token_type: string;
  /** Время жизни маркера в секундах (обычно 3600) */
  expires_in: number;
  /** Область действия маркера */
  scope: string;
  /** Идентификатор маркера */
  jti: string;
};

/**
 * Информация о регионе
 */
export type GetRegions = {
  /** Код страны (ISO_3166-1_alpha-2) */
  country_code: string;
  /** Название страны */
  country: string;
  /** Название региона */
  region: string;
  /** Префикс (область, край, республика и т.д.) */
  prefix?: string;
  /** Код региона в ИС СДЭК */
  region_code?: number;
  /** Код КЛАДР региона */
  kladr_region_code?: string;
  /** Уникальный идентификатор ФИАС региона */
  fias_region_guid?: string;
  /** Ошибки, возникшие при поиске */
  errors?: Error[];
};

/**
 * Полная информация о заказе
 */
export type GetOrder = {
  /** Основная сущность заказа */
  entity?: {
    /** Уникальный идентификатор заказа в ИС СДЭК */
    uuid: string;
    /** Признак возвратного заказа (true - возвратный, false - прямой) */
    is_return: boolean;
    /** Признак реверсного заказа (true - реверс, false - нет) */
    is_reverse: boolean;
    /** Признак клиентского возврата */
    is_client_return: boolean;
    /** Признак наличия созданного реверсного заказа к текущему */
    has_reverse_order?: boolean;
    /** Тип заказа (1 - ИМ, 2 - доставка) */
    type: number;
    /** Дополнительные типы заказа (код) */
    additional_order_types?: number;
    /** Номер заказа в ИС СДЭК */
    cdek_number?: string;
    /** Номер заказа в ИС Клиента */
    number?: string;
    /** Режим доставки (например, door-door, door-warehouse) */
    delivery_mode?: string;
    /** Код тарифа */
    tariff_code: number;
    /** Валюта объявленной стоимости */
    items_cost_currency?: string;
    /** Валюта получателя (для наложенного платежа) */
    recipient_currency?: string;
    /** Комментарий к заказу */
    comment?: string;
    /** Ключ разработчика */
    developer_key?: string;
    /** Код ПВЗ отправителя */
    shipment_point?: string;
    /** Код ПВЗ получателя */
    delivery_point?: string;
    /** Дата инвойса (для международных заказов) */
    date_invoice?: string;
    /** Грузоотправитель (для международных заказов) */
    shipper_name?: string;
    /** Адрес грузоотправителя (для международных заказов) */
    shipper_address?: string;
    /** Доп. сбор за доставку, взимаемый с получателя */
    delivery_recipient_cost?: Money;
    /** Динамический доп. сбор (пороги стоимости) */
    delivery_recipient_cost_adv?: Threshold[];
    /** Данные отправителя */
    sender: Contact;
    /** Данные истинного продавца */
    seller?: Seller;
    /** Данные получателя */
    recipient: Contact;
    /** Адрес отправления */
    from_location?: Location;
    /** Адрес получения */
    to_location?: Location;
    /** Список дополнительных услуг */
    services?: Service[];
    /** Список упаковок (грузовых мест) */
    packages: (Package & {
      /** Уникальный идентификатор упаковки */
      package_id?: string;
      /** Объемный вес (расчетный по габаритам) */
      weight_volume?: number;
      /** Расчетный вес (максимальный из физического и объемного) */
      weight_calc?: number;
    })[];
    /** Проблемы, возникшие при доставке */
    delivery_problem?: {
      /** Код проблемы */
      code?: string;
      /** Дата возникновения проблемы */
      create_date?: string;
    }[];
    /** Причины задержки доставки */
    delay_reasons?: {
      /** Дата возникновения причины */
      create_date: string;
      /** Описание причины задержки */
      description: string;
    }[];
    /** Дата доставки (фактическая) */
    delivery_date?: string;
    /** Детализация доставки и оплаты */
    delivery_detail?: {
      /** Дата доставки */
      date?: string;
      /** ФИО получателя */
      recipient_name?: string;
      /** Сумма наложенного платежа, которую взяли с получателя */
      payment_sum?: number;
      /** Информация о способе оплаты */
      payment_info?: {
        /** Тип оплаты (CARD - карта, CASH - наличные) */
        type: "CARD" | "CASH";
        /** Сумма оплаты данным способом */
        sum: number;
      }[];
      /** Стоимость услуги доставки */
      delivery_sum: number;
      /** Итоговая сумма (доставка + наложенный платеж) */
      total_sum: number;
      /** Ставка НДС за доставку */
      delivery_vat_rate?: number;
      /** Сумма НДС за доставку */
      delivery_vat_sum?: number;
      /** Процент скидки на доставку */
      delivery_discount_percent?: number;
      /** Сумма скидки на доставку */
      delivery_discount_sum?: number;
    };
    /** Признак того, что наложенный платеж переведен (транзакция прошла) */
    transacted_payment?: boolean;
    /** История статусов заказа */
    statuses: Status[];
    /** История звонков получателю */
    calls?: {
      /** Неудачные попытки дозвона */
      failed_calls?: {
        /** Дата и время звонка */
        date_time: string;
        /** Код причины недозвона */
        reason_code: number;
      }[];
      /** Переносы прозвона */
      rescheduled_calls?: {
        /** Дата и время звонка */
        date_time: string;
        /** Дата следующего звонка */
        date_next: string;
        /** Время следующего звонка */
        time_next: string;
        /** Комментарий оператора */
        comment?: string;
      }[];
    };
    /** Плановая дата доставки */
    planned_delivery_date: string;
    /** Срок бесплатного хранения до */
    keep_free_until?: string;
    /** Номер сопроводительной накладной (СНТ) */
    accompanying_number?: string;
  };
  /** История запросов на изменение/создание этого заказа */
  requests?: Request[];
  /** Связанные сущности (квитанции, возвраты и т.д.) */
  related_entities?: {
    /** Тип связанной сущности */
    type: "return_order" | "direct_order" | "barcode" | "waybill" | "reverse_order" | "delivery";
    /** UUID связанной сущности */
    uuid: string;
    /** Ссылка на скачивание (для печатных форм) */
    url?: string;
    /** Номер заказа СДЭК (для заказов) */
    cdek_number?: string;
    /** Дата (для договоренностей о доставке) */
    date?: string;
    /** Время с (для договоренностей) */
    time_from?: string;
    /** Время по (для договоренностей) */
    time_to?: string;
    /** Время создания файла (для печатных форм) */
    create_time?: string;
  }[];
};

/**
 * Информация о заявке на вызов курьера
 */
export type GetCourierDetails = {
  /** Сущность заявки */
  entity?: {
    /** Уникальный идентификатор заявки */
    uuid: string;
    /** Номер заявки в ИС СДЭК */
    intake_number?: number;
    /** Номер связанного заказа СДЭК */
    cdek_number?: number;
    /** UUID связанного заказа */
    order_uuid?: string;
    /** Дата приезда курьера */
    intake_date: string;
    /** Время начала ожидания */
    intake_time_from: string;
    /** Время окончания ожидания */
    intake_time_to: string;
    /** Время начала обеда */
    lunch_time_from?: string;
    /** Время окончания обеда */
    lunch_time_to?: string;
    /** Описание груза */
    name?: string;
    /** Общий вес */
    weight?: number;
    /** Длина */
    length?: number;
    /** Ширина */
    width?: number;
    /** Высота */
    height?: number;
    /** Комментарий для курьера */
    comment?: string;
    /** Отправитель */
    sender?: Contact;
    /** Адрес забора груза */
    from_location: Location;
    /** Признак необходимости прозвона */
    need_call?: boolean;
    /** История статусов заявки */
    statuses: Status[];
    /** Необходимость доверенности */
    courier_power_of_attorney?: boolean;
    /** Необходимость паспорта */
    courier_identity_card?: boolean;
  };
  /** История запросов к заявке */
  requests: Request[];
};

/**
 * Информация о договоренности о доставке
 */
export type GetDeliveryAppointment = {
  /** Сущность договоренности */
  entity?: {
    /** UUID договоренности */
    uuid: string;
    /** Номер заказа СДЭК */
    cdek_number?: string;
    /** UUID заказа */
    order_uuid: string;
    /** Согласованная дата доставки */
    date: string;
    /** Время доставки с */
    time_from?: string;
    /** Время доставки по */
    time_to?: string;
    /** Комментарий */
    comment?: string;
    /** Код ПВЗ (если доставка на склад) */
    delivery_point?: string;
    /** Адрес доставки (если доставка до двери) */
    to_location?: Location;
    /** История статусов договоренности */
    statuses: Status[];
  };
  /** История запросов */
  requests: Request[];
};

/**
 * Информация о преалерте
 */
export type GetPrealert = {
  /** Сущность преалерта */
  entity?: {
    /** UUID преалерта */
    uuid: string;
    /** Номер преалерта */
    prealert_number?: string;
    /** Планируемая дата передачи */
    planned_date: string;
    /** ПВЗ передачи */
    shipment_point: string;
    /** Дата закрытия преалерта */
    closed_date?: string;
    /** Фактический ПВЗ, куда сдали груз */
    fact_shipment_point?: string;
    /** Список заказов в преалерте */
    orders: {
      /** UUID заказа */
      order_uuid: string;
      /** Номер заказа СДЭК */
      cdek_number: number;
      /** Номер заказа ИМ */
      im_number: string;
      /** Статусы упаковок в преалерте (добавлено для детализации) */
      packages?: {
        package_id: string;
        number: string;
        status: string;
      }[];
    }[];
  };
  /** История запросов */
  requests: Request[];
};

/**
 * Информация о паспортных данных
 */
export type GetPassportData = {
  /** Список заказов */
  orders?: {
    /** UUID заказа */
    order_uuid: string;
    /** Номер заказа СДЭК */
    cdek_number: number;
    /** Данные по паспорту */
    passport: {
      /** Тип клиента (SENDER/RECEIVER) */
      client: string;
      /** Статус: true - данные заполнены/не требуются, false - требуются и не заполнены */
      passport_requirements_satisfied: boolean;
    }[];
  }[];
  /** Ошибки */
  errors?: Error[];
  /** Предупреждения */
  warnings?: Warning[];
};

/**
 * Информация о кассовом чеке
 */
export type GetCashboxCheck = {
  /** Информация о чеке */
  check_info?: {
    /** UUID заказа */
    order_uuid: string;
    /** Номер заказа СДЭК */
    cdek_number: number;
    /** Дата чека */
    date: string;
    /** Номер фискального накопителя */
    fiscal_storage_number: string;
    /** Номер фискального документа */
    document_number: string;
    /** Фискальный признак (ФПД) */
    fiscal_sign: number;
    /** Тип чека (Приход/Возврат прихода) */
    type: string;
    /** Номер смены */
    shift_no?: number;
    /** Детализация оплаты */
    payment_info: {
      /** Сумма */
      sum: number;
      /** Тип оплаты (CASH/CARD) */
      type: string;
    }[];
  }[];
  /** Ошибки */
  errors?: Error[];
};

/**
 * Реестр наложенных платежей
 */
export type GetCashOnDeliveryRegistry = {
  /** Список реестров */
  registries?: {
    /** Номер реестра */
    registry_number: number;
    /** Дата платежа */
    payment_date?: string;
    /** Сумма реестра */
    sum: number;
    /** Номер платежного поручения */
    payment_order_number?: string;
    /** Список заказов в реестре */
    orders: {
      /** Номер заказа СДЭК */
      cdek_number: string;
      /** Сумма к перечислению */
      transfer_sum: number;
      /** Сумма, принятая от получателя */
      payment_sum: number;
      /** Общая сумма без учета агентского вознаграждения */
      total_sum_without_agent: number;
      /** Сумма агентского вознаграждения */
      agent_commission_sum: number;
    }[];
  }[];
  /** Ошибки */
  errors?: Error[];
};

/**
 * Информация о переводе наложенного платежа
 */
export type GetCashOnDeliveryTransfer = {
  /** Список заказов */
  orders?: {
    /** UUID заказа */
    order_uuid: string;
    /** Номер заказа СДЭК */
    cdek_number: number;
    /** Номер платежного поручения */
    number: string;
  }[];
  /** Ошибки */
  errors?: Error[];
};

/**
 * Информация о Пункте Выдачи Заказов (ПВЗ)
 */
export type GetPickupPoints = {
  /** Код ПВЗ */
  code: string;
  /** Название ПВЗ */
  name: string;
  /** Локация и адрес */
  location: Location & {
    /** Полный адрес */
    address_full: string;
  };
  /** Комментарий к адресу (как найти) */
  address_comment?: string;
  /** Ближайшая станция/остановка */
  nearest_station: string;
  /** Ближайшая станция метро */
  nearest_metro_station?: string;
  /** График работы (строкой) */
  work_time: string;
  /** Телефоны */
  phones: Phone[];
  /** Email */
  email: string;
  /** Примечание */
  note: string;
  /** Тип офиса (PVZ - склад, POSTAMAT - постамат) */
  type: "PVZ" | "POSTAMAT";
  /** Код владельца офиса (CDEK, InPost и т.д.) */
  owner_code: string;
  /** Признак: только выдача (приема нет) */
  take_only: boolean;
  /** Является пунктом выдачи */
  is_handout: boolean;
  /** Является пунктом приема */
  is_reception: boolean;
  /** Есть примерочная */
  is_dressing_room: boolean;
  /** Есть безналичный расчет */
  have_cashless: boolean;
  /** Есть прием наличных */
  have_cash: boolean;
  /** Разрешен наложенный платеж */
  allowed_cod: boolean;
  /** Ссылка на сайт */
  site?: string;
  /** Список фото офиса */
  office_image_list?: {
    /** Ссылка на фото */
    url: string;
    /** Номер фото */
    number: number;
  }[];
  /** График работы по дням */
  work_time_list: {
    /** День недели (1-7) */
    day: number;
    /** Время работы (HH:mm/HH:mm) */
    time: string;
  }[];
  /** Исключения в графике работы */
  work_time_exceptions?: {
    /** Дата исключения */
    date: string;
    /** Время работы в этот день */
    time?: string;
    /** Работает ли в этот день */
    is_working: boolean;
  }[];
  /** Минимальный вес (кг) */
  weight_min: number;
  /** Максимальный вес (кг) */
  weight_max?: number;
  /** Признак наличия фулфилмента */
  fulfillment: boolean;
  /** Габариты ячеек (для постаматов) */
  dimensions?: {
    /** Ширина (см) */
    width: number;
    /** Высота (см) */
    height: number;
    /** Глубина (см) */
    depth: number;
  }[];
  /** Ошибки */
  errors?: Error[];
};

/**
 * Информация о городе
 */
export type GetCities = {
  /** Код города СДЭК */
  code: number;
  /** Название города */
  city: string;
  /** ФИАС GUID */
  fias_guid?: string;
  /** КЛАДР код */
  kladr_code?: string;
  /** Код страны */
  country_code: string;
  /** Название страны */
  country: string;
  /** Название региона */
  region: string;
  /** Код региона СДЭК */
  region_code?: number;
  /** ФИАС региона */
  fias_region_guid?: string;
  /** КЛАДР региона */
  kladr_region_code?: string;
  /** Название района (субрегиона) */
  sub_region?: string;
  /** Долгота */
  longitude?: number;
  /** Широта */
  latitude?: number;
  /** Часовой пояс */
  time_zone?: string;
  /** Лимит наложенного платежа (-1 - нет лимита, 0 - нельзя НП) */
  payment_limit: number;
  /** Ошибки */
  errors?: Error[];
};

/**
 * Результат расчета по коду тарифа
 */
export type CalculatorByTariff = {
  /** Стоимость доставки */
  delivery_sum: number;
  /** Минимальный срок доставки (раб. дни) */
  period_min: number;
  /** Максимальный срок доставки (раб. дни) */
  period_max: number;
  /** Расчетный вес (кг) */
  weight_calc: number;
  /** Минимальный срок доставки (календарные дни) */
  calendar_min?: number;
  /** Максимальный срок доставки (календарные дни) */
  calendar_max?: number;
  /** Детализация стоимости услуг */
  services?: Service[];
  /** Итоговая стоимость */
  total_sum: number;
  /** Валюта расчета */
  currency?: string;
  /** Прогнозируемый диапазон дат доставки */
  delivery_date_range?: {
    /** Минимальная дата доставки (yyyy-MM-dd) */
    min: string;
    /** Максимальная дата доставки (yyyy-MM-dd) */
    max: string;
  };
  /** Ошибки расчета */
  errors?: Error[];
};

/**
 * Результат расчета по доступным тарифам
 */
export type CalculatorByAvaibleTariffs = {
  /** Список доступных тарифов */
  tariff_codes?: {
    /** Код тарифа */
    tariff_code: number;
    /** Название тарифа */
    tariff_name: string;
    /** Описание тарифа */
    tariff_description: string;
    /** Режим доставки (1 - дверь-дверь, и т.д.) */
    delivery_mode: number;
    /** Стоимость доставки */
    delivery_sum: number;
    /** Минимальный срок (раб. дни) */
    period_min: number;
    /** Максимальный срок (раб. дни) */
    period_max: number;
    /** Минимальный срок (календарные дни) */
    calendar_min?: number;
    /** Максимальный срок (календарные дни) */
    calendar_max?: number;
    /** Прогнозируемый диапазон дат доставки */
    delivery_date_range?: {
      /** Минимальная дата (yyyy-MM-dd) */
      min: string;
      /** Максимальная дата (yyyy-MM-dd) */
      max: string;
    };
  }[];
  /** Ошибки */
  errors?: Error[];
};

/**
 * Результат расчета таможенных пошлин
 */
export type CalculatorCustoms = {
  /** Стоимость товара */
  cost: number;
  /** Вес товара */
  weight: number;
  /** Таможенная пошлина */
  customs_duty: number;
  /** Таможенный сбор */
  customs_tariff: number;
  /** Комиссия за таможенное оформление */
  commission: number;
  /** Итоговая сумма */
  total_amount: number;
  /** Ошибки */
  errors?: Error[];
};

/**
 * Информация о готовых фото документов
 */
export type GetFinishedOrders = {
  /** Список заказов с фото */
  orders: {
    /** UUID заказа */
    order_uuid: string;
    /** Номер заказа СДЭК */
    cdek_number: string;
    /** Ссылка на скачивание архива с фото */
    link: string;
  }[];
  /** Ошибки */
  errors?: Error[];
  /** Предупреждения */
  warnings?: Warning[];
};

/** Печатная форма квитанции */
export type GetOrderReceipt = PrintForm;
/** Печатная форма штрих-кода места */
export type GetBarcodeCP = PrintForm;

/**
 * Ответ на создание вебхука
 */
export type AddWebhook = EntityOperation & {
  /** Связанные сущности (созданный вебхук) */
  related_entities: {
    /** Тип сущности */
    type: string;
    /** UUID сущности */
    uuid: string;
  }[];
};

/**
 * Ответ на получение вебхука
 */
export type GetWebhook = EntityOperation & {
  /** Данные вебхука */
  entity?: {
    /** URL отправки */
    url: string;
    /** Тип события */
    type: UpdateType;
  };
};

/**
 * Список всех вебхуков
 */
export type GetWebhooks = {
  /** Тип события */
  type: UpdateType;
  /** UUID подписки */
  uuid: string;
  /** URL отправки */
  url: string;
}[];

/**
 * Доступные интервалы доставки
 */
export type GetDeliveryIntervals = {
  /** Список доступных дат */
  date_intervals: {
    /** Дата (yyyy-MM-dd) */
    date: string;
    /** Список временных интервалов для этой даты */
    time_intervals: {
      /** Время начала интервала (HH:mm) */
      start_time: string;
      /** Время окончания интервала (HH:mm) */
      end_time: string;
    }[];
  }[];
  /** Ошибки */
  errors?: Error[];
};

// Ответы на операции (используют общий тип EntityOperation)
export type DeleteWebhook = EntityOperation;
export type AddOrder = EntityOperation;
export type UpdateOrder = EntityOperation;
export type DeleteOrder = EntityOperation;
export type AddRefusal = EntityOperation;
export type AddCourier = EntityOperation;
export type DeleteCourier = EntityOperation;
export type CreateOrderReceipt = EntityOperation;
export type CreateBarcodeCP = EntityOperation;
export type AddDeliveryAppointment = EntityOperation;
export type AddPrealert = EntityOperation;
export type CreateClientReturn = EntityOperation;
