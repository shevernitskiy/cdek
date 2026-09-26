import type { Contact, Location, Money, Package, Seller, Service, Threshold } from "./base.ts";
import type { UpdateType } from "./webhook.ts";

/**
 * Запрос на получение токена авторизации (OAuth)
 */
export type OAuth = {
  /** Тип разрешения (всегда client_credentials) */
  grant_type: "client_credentials";
  /** Идентификатор клиента (Account), выдается при интеграции */
  client_id: string;
  /** Секретный ключ (Secure password), выдается при интеграции */
  client_secret: string;
};

/**
 * Параметры для получения списка регионов
 */
export type GetRegions = {
  /** Массив кодов стран в формате ISO_3166-1_alpha-2 */
  country_codes?: string[];
  /** Код региона (справочник СДЭК) */
  region_code?: number;
  /** Код КЛАДР региона */
  kladr_region_code?: string;
  /** Уникальный идентификатор ФИАС региона */
  fias_region_guid?: string;
  /** Ограничение выборки результата (по умолчанию 1000) */
  size?: number;
  /** Номер страницы выборки результата (по умолчанию 0) */
  page?: number;
  /** Язык локализации (rus, eng, zho) */
  lang?: string;
};

/**
 * Запрос на добавление подписки на вебхуки
 */
export type AddWebhook = {
  /** URL, на который будут отправляться события */
  url: string;
  /** Тип события, на которое производится подписка */
  type: UpdateType;
};

/**
 * Запрос на регистрацию заказа
 */
export type AddOrder = {
  /** Тип заказа: 1 - "интернет-магазин", 2 - "доставка" */
  type?: number;
  /**
   * Дополнительные типы заказа:
   * 2 - LTL (сборный груз),
   * 4 - Forward,
   * 6 - Фулфилмент (Приход),
   * 7 - Фулфилмент (Отгрузка),
   * 10 - Шины (Экономичный экспресс),
   * 14 - CDEK.Shopping,
   * 15 - ТО для последней мили
   */
  additional_order_types?: (2 | 4 | 6 | 7 | 10 | 11 | 14 | 15)[];
  /** Номер заказа в ИС Клиента (только для ИМ) */
  number?: string;
  /** Номер сопроводительной накладной на товар (СНТ) */
  accompanying_number?: string;
  /** Код тарифа */
  tariff_code: number;
  /** Комментарий к заказу */
  comment?: string;
  /** Ключ разработчика (для модулей интеграции) */
  developer_key?: string;
  /** Код ПВЗ отправителя (не может использоваться с from_location) */
  shipment_point?: string;
  /** Код ПВЗ получателя (не может использоваться с to_location) */
  delivery_point?: string;
  /** Дата инвойса (для международных заказов) */
  date_invoice?: string;
  /** Грузоотправитель (для международных заказов) */
  shipper_name?: string;
  /** Адрес грузоотправителя (для международных заказов) */
  shipper_address?: string;
  /** Доп. сбор за доставку, который ИМ берет с получателя (value, vat_sum, vat_rate) */
  delivery_recipient_cost?: Money;
  /** Динамический доп. сбор за доставку (пороги стоимости) */
  delivery_recipient_cost_adv?: Threshold[];
  /** Отправитель */
  sender?: Contact;
  /** Реквизиты истинного продавца */
  seller?: Seller;
  /** Получатель */
  recipient: Contact;
  /** Адрес отправления (для тарифов "от двери") */
  from_location?: Location;
  /** Адрес получения (для тарифов "до двери") */
  to_location?: Location;
  /** Дополнительные услуги */
  services?: Service[];
  /** Список упаковок (мест) */
  packages: Package[];
  /** Необходимость формирования печатной формы при создании */
  print?: "WAYBILL" | "BARCODE";
  /** Список идентификаторов дополнительных типов доставки */
  delivery_types?: (string | number)[];
  /** Признак клиентского возврата (true/false) */
  is_client_return?: boolean;
  /** Признак необходимости создания реверсного заказа (новый механизм) */
  has_reverse_order?: boolean;
  /** Токен CMS (widget_token) */
  widget_token?: string;
};

/**
 * Запрос на изменение заказа
 */
export type UpdateOrder = {
  /** Идентификатор заказа в ИС СДЭК (обязателен, если не передан cdek_number) */
  uuid?: string;
  /** Номер заказа СДЭК (обязателен, если не передан uuid) */
  cdek_number?: number;
  /** Новый код тарифа */
  tariff_code?: number;
  /** Новый комментарий */
  comment?: string;
  /** Новый ПВЗ отправителя */
  shipment_point?: string;
  /** Новый ПВЗ получателя */
  delivery_point?: string;
  /** Новый доп. сбор за доставку */
  delivery_recipient_cost?: Money;
  /** Новые пороги доп. сбора */
  delivery_recipient_cost_adv?: Threshold[];
  /** Измененные данные отправителя */
  sender?: Contact;
  /** Измененные данные продавца */
  seller?: Seller;
  /** Измененные данные получателя */
  recipient?: Contact;
  /** Новый адрес доставки */
  to_location?: Location;
  /** Новый адрес забора */
  from_location?: Location;
  /** Измененный список услуг */
  services?: Service[];
  /** Измененный список упаковок */
  packages?: Package[];
  /** Номер сопроводительной накладной на товар (СНТ) */
  accompanying_number?: string;
  /** Признак наличия реверсного заказа */
  has_reverse_order?: boolean;
};

/**
 * Запрос на регистрацию заявки на вызов курьера
 */
export type AddCourier = {
  /** Номер заказа СДЭК (если заявка создается к конкретному заказу) */
  cdek_number?: number;
  /** UUID заказа (альтернатива cdek_number) */
  order_uuid?: string;
  /** Дата ожидания курьера (yyyy-MM-dd) */
  intake_date: string;
  /** Время начала ожидания курьера (HH:mm) */
  intake_time_from: string;
  /** Время окончания ожидания курьера (HH:mm) */
  intake_time_to: string;
  /** Время начала обеда (HH:mm) */
  lunch_time_from?: string;
  /** Время окончания обеда (HH:mm) */
  lunch_time_to?: string;
  /** Описание груза (если не передан заказ) */
  name?: string;
  /** Общий вес в граммах (если не передан заказ) */
  weight?: number;
  /** Длина в см (если не передан заказ) */
  length?: number;
  /** Ширина в см (если не передан заказ) */
  width?: number;
  /** Высота в см (если не передан заказ) */
  height?: number;
  /** Комментарий к заявке для курьера */
  comment?: string;
  /** Отправитель (если отличается от указанного в заказе или заказ не передан) */
  sender?: Contact;
  /** Адрес отправителя (если отличается от указанного в заказе или заказ не передан) */
  from_location?: Location;
  /** Необходим прозвон отправителя (по умолчанию false) */
  need_call?: boolean;
  /** Курьеру необходима доверенность (по умолчанию false) */
  courier_power_of_attorney?: boolean;
  /** Курьеру необходим документ удостоверяющий личность (по умолчанию false) */
  courier_identity_card?: boolean;
};

/**
 * Запрос доступных дат вызова курьера для населенных пунктов
 */
export type GetIntakeAvailableDays = {
  /** Адрес отправления */
  from_location: Location;
  /** Дата, на которую запрашиваются доступные даты (yyyy-MM-dd) */
  date?: string;
};

/**
 * Запрос на изменение статуса заявки на вызов курьера
 */
export type ChangeCourierStatus = {
  /** UUID заявки */
  uuid: string;
  /** Новый статус заявки */
  status: {
    /** Код статуса (например: PROCESSING_REQUIRED - требуется обработка заявки) */
    code: string;
    /** Дополнительный код статуса (например: CALL_REQUIRED - требуется звонок, DOC_REQUIRED - требуются документы) */
    add_status: string;
  };
};

/**
 * Запрос на формирование квитанции к заказу
 */
export type CreateOrderReceipt = {
  /** Список заказов */
  orders: {
    /** UUID заказа */
    order_uuid?: string;
    /** Номер заказа СДЭК */
    cdek_number?: number;
  }[];
  /** Число копий (по умолчанию 2) */
  copy_count?: number;
  /** Тип квитанции (например: tpl_china, tpl_russia) */
  type?: string;
};

/**
 * Запрос на формирование ШК места
 */
export type CreateBarcodeCP = {
  /** Список заказов */
  orders: {
    /** UUID заказа */
    order_uuid?: string;
    /** Номер заказа СДЭК */
    cdek_number?: number;
  }[];
  /** Число копий (по умолчанию 1) */
  copy_count?: number;
  /** Формат печати */
  format?: "A4" | "A5" | "A6" | "A7";
  /** Язык печатной формы (RUS, ENG) */
  lang?: "RUS" | "ENG";
};

/**
 * Запрос на регистрацию договоренности о доставке
 */
export type AddDeliveryAppointment = {
  /** Номер заказа СДЭК */
  cdek_number?: string;
  /** UUID заказа */
  order_uuid?: string;
  /** Дата доставки, согласованная с получателем (yyyy-MM-dd) */
  date: string;
  /** Время доставки "С" (HH:mm) */
  time_from?: string;
  /** Время доставки "По" (HH:mm) */
  time_to?: string;
  /** Комментарий к договоренности */
  comment?: string;
  /** Код ПВЗ (если меняется режим доставки на "до склада") */
  delivery_point?: string;
  /** Адрес доставки (если меняется режим доставки на "до двери") */
  to_location?: Location;
};

/**
 * Запрос на регистрацию преалерта
 */
export type AddPrealert = {
  /** Планируемая дата передачи заказов в СДЭК */
  planned_date: string;
  /** Код ПВЗ, в который планируется передать заказы */
  shipment_point: string;
  /** Список заказов */
  orders: {
    /** UUID заказа */
    order_uuid?: string;
    /** Номер заказа СДЭК */
    cdek_number?: number;
    /** Номер заказа в ИС Клиента */
    im_number?: string;
  }[];
};

/**
 * Запрос на получение паспортных данных
 */
export type GetPassportData = {
  /** Список UUID заказов */
  order_uuid?: string[];
  /** Список номеров заказов СДЭК */
  cdek_number?: number[];
  /** Клиент, по которому нужна информация (SENDER, RECEIVER, ALL) */
  client?: string;
};

/**
 * Запрос информации о чеке
 */
export type GetCashboxCheck = {
  /** UUID заказа */
  order_uuid?: string;
  /** Номер заказа СДЭК */
  cdek_number?: number;
  /** Дата создания чека (yyyy-MM-dd) */
  date?: string;
};

/**
 * Запрос реестра наложенных платежей
 */
export type GetCashOnDeliveryRegistry = {
  /** Дата, за которую необходимо вернуть реестры (yyyy-MM-dd) */
  date: string;
};

/**
 * Запрос списка ПВЗ (Пунктов выдачи заказов)
 */
export type GetPickupPoints = {
  /** Код ПВЗ */
  code?: string;
  /** Почтовый индекс города */
  postal_code?: number;
  /** Код города СДЭК */
  city_code?: number;
  /** Тип офиса: "PVZ" (склад), "POSTAMAT" (постамат), "ALL" (все) */
  type?: string;
  /** Код страны (ISO_3166-1_alpha-2) */
  country_code?: string;
  /** Код региона СДЭК */
  region_code?: number;
  /** Наличие терминала оплаты (true/false) */
  have_cashless?: boolean;
  /** Прием наличных (true/false) */
  have_cash?: boolean;
  /** Разрешен наложенный платеж (true/false) */
  allowed_cod?: boolean;
  /** Наличие примерочной (true/false) */
  is_dressing_room?: boolean;
  /** Максимальный вес, который может принять офис */
  weight_max?: number;
  /** Минимальный вес, который принимает офис */
  weight_min?: number;
  /** Длина габаритов упаковки (см), для подбора офисов по параметрам упаковки */
  length?: number;
  /** Ширина габаритов упаковки (см), для подбора офисов по параметрам упаковки */
  width?: number;
  /** Высота габаритов упаковки (см), для подбора офисов по параметрам упаковки */
  height?: number;
  /** Локализация (rus/eng) */
  lang?: string;
  /** Является ли офис только пунктом выдачи (только выдают посылки) */
  take_only?: boolean;
  /** Является пунктом выдачи */
  is_handout?: boolean;
  /** Есть ли в офисе приём заказов */
  is_reception?: boolean;
  /** Работает ли офис с маркетплейсами */
  is_marketplace?: boolean;
  /** ФИАС GUID */
  fias_guid?: string;
  /** Работает ли офис с LTL (сборным грузом) */
  is_ltl?: boolean;
  /** Принимает ли офис сборные грузы от партнеров */
  ltl_acceptance_partners?: boolean;
  /** Выдает ли офис сборные грузы партнерам */
  ltl_issuance_partners?: boolean;
  /** Наличие зоны фулфилмента */
  fulfillment?: boolean;
  /** Ограничение выборки (размер страницы) */
  size?: number;
  /** Номер страницы выборки */
  page?: number;
};

/**
 * Запрос списка ПВЗ внутри прямоугольника координат
 */
export type GetPickupPointsByPolygons = {
  /** Широта правого верхнего угла прямоугольника ([-90, 90]) */
  latitude_right_top: number;
  /** Долгота правого верхнего угла прямоугольника ([-180, 180]) */
  longitude_right_top: number;
  /** Широта левого нижнего угла прямоугольника ([-90, 90]) */
  latitude_left_bottom: number;
  /** Долгота левого нижнего угла прямоугольника ([-180, 180]) */
  longitude_left_bottom: number;
  /** Тип офиса: "PVZ" (склад), "POSTAMAT" (постамат), "ALL" (все) */
  type?: string;
  /** Уникальный идентификатор города */
  city_uuid?: string;
  /** Наличие терминала оплаты (true/false) */
  have_cashless?: boolean;
  /** Прием наличных (true/false) */
  have_cash?: boolean;
  /** Разрешен наложенный платеж (true/false) */
  allowed_cod?: boolean;
  /** Наличие примерочной (true/false) */
  is_dressing_room?: boolean;
  /** Максимальный вес, который может принять офис */
  weight_max?: number;
  /** Минимальный вес, который принимает офис */
  weight_min?: number;
  /** Локализация (rus/eng) */
  lang?: string;
};

/**
 * Запрос списка населенных пунктов
 */
export type GetCities = {
  /** Массив кодов стран */
  country_codes?: string[];
  /** Код региона СДЭК */
  region_code?: number;
  /** Код КЛАДР региона */
  kladr_region_code?: string;
  /** ФИАС GUID региона */
  fias_region_guid?: string;
  /** Код КЛАДР населенного пункта */
  kladr_code?: string;
  /** ФИАС GUID населенного пункта */
  fias_guid?: string;
  /** Почтовый индекс */
  postal_code?: string;
  /** Код населенного пункта СДЭК */
  code?: number;
  /** Название населенного пункта */
  city?: string;
  /** Ограничение выборки (размер страницы) */
  size?: number;
  /** Номер страницы выборки */
  page?: number;
  /** Язык локализации */
  lang?: string;
  /** Ограничение на сумму наложенного платежа */
  payment_limit?: number;
};

/**
 * Запрос на подбор локации по названию города
 */
export type GetSuggestCities = {
  /** Название населенного пункта */
  name: string;
  /** Код страны (ISO_3166-1_alpha-2) */
  country_code?: string;
};

/**
 * Запрос на получение списка почтовых индексов города
 */
export type GetPostalCodes = {
  /** Код города СДЭК */
  code: number;
};

/**
 * Калькулятор: расчет по коду тарифа
 */
export type CalculatorByTariff = {
  /** Дата и время планируемой передачи заказа (yyyy-MM-dd'T'HH:mm:ssZ) */
  date?: string;
  /** Тип заказа: 1 - ИМ, 2 - доставка */
  type?: number;
  /** Дополнительные типы заказа */
  additional_order_types?: number[];
  /** Валюта расчета */
  currency?: number;
  /** Язык вывода информации (rus, eng, zho) */
  lang?: "rus" | "eng" | "zho";
  /** Код тарифа */
  tariff_code: number;
  /** Город-отправитель */
  from_location: Location;
  /** Город-получатель */
  to_location: Location;
  /** ПВЗ отправителя (для более точного расчета сроков) */
  shipment_point?: string;
  /** ПВЗ получателя (для более точного расчета сроков) */
  delivery_point?: string;
  /** Дополнительные услуги */
  services?: Service[];
  /** Список мест (упаковок) */
  packages: {
    /** Вес (в граммах) */
    weight: number;
    /** Длина (см) */
    length?: number;
    /** Ширина (см) */
    width?: number;
    /** Высота (см) */
    height?: number;
  }[];
};

/**
 * Калькулятор: расчет по доступным тарифам
 */
export type CalculatorByAvaibleTariffs = {
  /** Дата и время планируемой передачи заказа */
  date?: string;
  /** Тип заказа: 1 - ИМ, 2 - доставка */
  type?: number;
  /** Дополнительные типы заказа */
  additional_order_types?: number[];
  /** Валюта расчета */
  currency?: number;
  /** Язык вывода информации (rus, eng, zho) */
  lang?: "rus" | "eng" | "zho";
  /** Город-отправитель */
  from_location: Location;
  /** Город-получатель */
  to_location: Location;
  /** ПВЗ отправителя (для более точного расчета сроков) */
  shipment_point?: string;
  /** ПВЗ получателя (для более точного расчета сроков) */
  delivery_point?: string;
  /** Дополнительные услуги */
  services?: Service[];
  /** Список мест (упаковок) */
  packages: {
    /** Вес (в граммах) */
    weight: number;
    /** Длина (см) */
    length?: number;
    /** Ширина (см) */
    width?: number;
    /** Высота (см) */
    height?: number;
  }[];
};

/**
 * Калькулятор: расчет по доступным тарифам и дополнительным услугам
 */
export type CalculatorByTariffAndServices = {
  /** Дата и время планируемой передачи заказа (yyyy-MM-dd'T'HH:mm:ssZ) */
  date?: string;
  /** Тип заказа: 1 - ИМ, 2 - доставка */
  type?: number;
  /** Дополнительные типы заказа */
  additional_order_types?: number[];
  /** Валюта расчета */
  currency?: number;
  /** Язык вывода информации (rus, eng, zho) */
  lang?: "rus" | "eng" | "zho";
  /** Город-отправитель */
  from_location: Location;
  /** Город-получатель */
  to_location: Location;
  /** ПВЗ отправителя (для более точного расчета сроков) */
  shipment_point?: string;
  /** ПВЗ получателя (для более точного расчета сроков) */
  delivery_point?: string;
  /** Дополнительные услуги */
  services?: Service[];
  /** Список мест (упаковок) */
  packages: {
    /** Вес (в граммах) */
    weight: number;
    /** Длина (см) */
    length?: number;
    /** Ширина (см) */
    width?: number;
    /** Высота (см) */
    height?: number;
  }[];
};

/**
 * Таможенный калькулятор
 */
export type CalculatorCustoms = {
  /** Общий вес товаров (гр) */
  weight: number;
  /** Общая стоимость товаров */
  cost: number;
};

/**
 * Получение заказов с готовыми фото документов
 */
export type GetFinishedOrders = {
  /** Начало периода поиска (yyyy-MM-dd'T'HH:mm:ssZ) */
  period_begin?: string;
  /** Конец периода поиска (yyyy-MM-dd'T'HH:mm:ssZ) */
  period_end?: string;
  /** Список заказов для поиска */
  orders?: {
    /** UUID заказа */
    order_uuid?: string;
    /** Номер заказа СДЭК */
    cdek_number?: number;
  }[];
};

/**
 * Регистрация клиентского возврата
 */
export type CreateClientReturn = {
  /** UUID прямого заказа */
  order_uuid: string;
  /** Код тарифа для возврата */
  tariff_code: number;
};

/**
 * Проверка доступности реверса
 */
export type CheckReverseAvailability = {
  /** Адрес отправления */
  from_location: Location;
  /** Адрес получения */
  to_location: Location;
  /** Код тарифа */
  tariff_code: number;
  /** ПВЗ отправления */
  shipment_point?: string;
  /** ПВЗ получения */
  delivery_point?: string;
  /** Отправитель */
  sender?: Contact;
  /** Получатель */
  recipient?: Contact;
};

/**
 * Запрос на получение доступных интервалов доставки
 */
export type GetDeliveryIntervals = {
  /** Номер заказа СДЭК (обязателен, если не передан order_uuid) */
  cdek_number?: string;
  /** Идентификатор заказа (обязателен, если не передан cdek_number) */
  order_uuid?: string;
};

/**
 * Запрос на получение интервалов доставки до создания заказа
 */
export type GetEstimatedDeliveryIntervals = {
  /** Дата и время планируемой передачи заказа (yyyy-MM-dd'T'HH:mm:ssZ) */
  date_time: string;
  /** Адрес отправления */
  from_location?: Location;
  /** ПВЗ отправления */
  shipment_point?: string;
  /** Адрес получения */
  to_location: Location;
  /** Код тарифа */
  tariff_code: number;
  /** Дополнительные типы заказа */
  additional_order_types?: number[];
};

/**
 * Запрос на получение ограничений по международным заказам
 */
export type CheckInternationalRestrictions = {
  /** Код тарифа */
  tariff_code?: number;
  /** Адрес отправления */
  from_location?: Location;
  /** Адрес получения */
  to_location?: Location;
  /** Список мест (упаковок) с описанием товаров */
  packages?: {
    /** Вес (в граммах) */
    weight?: number;
    /** Длина (см) */
    length?: number;
    /** Ширина (см) */
    width?: number;
    /** Высота (см) */
    height?: number;
    /** Список товаров в упаковке */
    items?: {
      /** Наименование товара */
      name?: string;
      /** Количество */
      amount?: number;
      /** Идентификатор товара в ИС Клиента */
      item_id?: string;
      /** Код ТН ВЭД товара */
      feacn_code?: string;
    }[];
    /** Идентификатор упаковки */
    package_id?: string;
  }[];
};
