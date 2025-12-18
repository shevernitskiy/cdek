/**
 * Данные об ошибке обработки запроса
 */
export type Error = {
  /** Код ошибки */
  code: string;
  /** Описание ошибки */
  message: string;
};

/**
 * Предупреждение, возникшее при обработке запроса
 */
export type Warning = {
  /** Код предупреждения */
  code: string;
  /** Текст предупреждения */
  message: string;
};

/**
 * Денежная величина (стоимость, налог)
 */
export type Money = {
  /** Сумма в валюте */
  value?: number;
  /** Сумма НДС */
  vat_sum?: number;
  /** Ставка НДС (значение - 0, 5, 7, 10, 16, 20, 22, null - нет НДС) */
  vat_rate?: number;
};

/**
 * Порог стоимости для расчета дополнительного сбора за доставку
 */
export type Threshold = {
  /** Порог стоимости товара (действует по условию меньше или равно) в целых единицах валюты */
  threshold: number;
  /** Доп. сбор за доставку товаров, общая стоимость которых попадает в интервал */
  sum: number;
  /** Сумма НДС, включённая в доп. сбор за доставку */
  vat_sum?: number;
  /** Ставка НДС */
  vat_rate?: number;
};

/**
 * Адрес местоположения (Отправителя, Получателя, ПВЗ)
 */
export type Location = {
  /** Код населенного пункта СДЭК */
  code?: number;
  /** Уникальный идентификатор ФИАС */
  fias_guid?: string;
  /** Почтовый индекс */
  postal_code?: string;
  /** Долгота */
  longitude?: number;
  /** Широта */
  latitude?: number;
  /** Страна */
  country?: string;
  /** Код страны в формате ISO_3166-1_alpha-2 */
  country_code?: string;
  /** Название региона */
  region?: string;
  /** Код региона СДЭК */
  region_code?: number;
  /** Название района региона */
  sub_region?: string;
  /** Название города */
  city?: string;
  /** Код города СДЭК */
  city_code?: number;
  /** Код КЛАДР */
  kladr_code?: string;
  /** Строка адреса */
  address?: string;
};

/**
 * Контактное лицо (Отправитель/Получатель)
 */
export type Contact = {
  /** Наименование компании */
  company?: string;
  /** Ф.И.О контактного лица */
  name: string;
  /** Эл. адрес */
  email?: string;
  /** Список телефонов */
  phones?: Phone[];
  /** Серия паспорта */
  passport_series?: string;
  /** Номер паспорта */
  passport_number?: string;
  /** Дата выдачи паспорта (yyyy-MM-dd) */
  passport_date_of_issue?: string;
  /** Орган выдачи паспорта */
  passport_organization?: string;
  /** Дата рождения (yyyy-MM-dd) */
  passport_date_of_birth?: string;
  /** ИНН */
  tin?: string;
  /** Требования по паспортным данным удовлетворены (актуально для международных заказов) */
  passport_requirements_satisfied?: boolean;
  /** Тип контрагента (LEGAL_ENTITY - ЮЛ, INDIVIDUAL - ФЛ) */
  contragent_type?: string;
};

/**
 * Номер телефона
 */
export type Phone = {
  /** Номер телефона в международном формате */
  number: string;
  /** Добавочный номер */
  additional?: string;
};

/**
 * Данные истинного продавца (используется для товаров и маркировки)
 */
export type Seller = {
  /** Наименование истинного продавца */
  name?: string;
  /** ИНН истинного продавца */
  inn?: string;
  /** Телефон истинного продавца */
  phone?: string;
  /** Код формы собственности (см. Приложение 5 в доке) */
  ownership_form?: number;
  /** Адрес истинного продавца */
  address?: string;
  /** Идентификатор подразделения компании продавца в ЛК ГИИС ДМДК (для ювелирных изделий) */
  giis_subdivision_id?: string;
};

/**
 * Дополнительная услуга
 */
export type Service = {
  /** Код дополнительной услуги (см. Приложение 6) */
  code: string;
  /** Параметр дополнительной услуги (например, объявленная стоимость, кол-во этажей) */
  parameter?: string;
  /** Сумма услуги */
  sum?: number;
  /** Итоговая сумма */
  total_sum?: number;
  /** Процент скидки */
  discount_percent?: number;
  /** Сумма скидки */
  discount_sum?: number;
  /** Ставка НДС */
  vat_rate?: number;
  /** Сумма НДС */
  vat_sum?: number;
};

/**
 * Упаковка (место) в заказе
 */
export type Package = {
  /** Номер упаковки (можно использовать порядковый номер или номер заказа), уникален в пределах заказа */
  number: string;
  /** Общий вес (в граммах) */
  weight: number;
  /** Длина (в сантиметрах) */
  length?: number;
  /** Ширина (в сантиметрах) */
  width?: number;
  /** Высота (в сантиметрах) */
  height?: number;
  /** Комментарий к упаковке */
  comment?: string;
  /** Позиции товаров в упаковке */
  items?: Item[];
};

/**
 * Товар (вложение)
 */
export type Item = {
  /** Наименование товара (может содержать описание: размер, цвет) */
  name: string;
  /** Идентификатор/артикул товара */
  ware_key: string;
  /** Оплата за товар при получении (наложенный платеж). В случае предоплаты = 0 */
  payment: Money;
  /** Объявленная стоимость товара (за единицу). С неё рассчитывается страховка */
  cost: number;
  /** Вес (за единицу товара, в граммах) */
  weight: number;
  /** Вес брутто (за единицу товара, в граммах) */
  weight_gross?: number;
  /** Количество единиц товара (в штуках) */
  amount: number;
  /** Стоимость доставки за единицу товара */
  delivery_amount?: number;
  /** Маркировка товара (код Data Matrix и др.) */
  marking?: string;
  /** Наименование на иностранном языке */
  name_i18n?: string;
  /** Бренд на иностранном языке */
  brand?: string;
  /** Код страны происхождения (ISO_3166-1_alpha-2) */
  country_code?: string;
  /** Код материала (см. Приложение 7) */
  material?: string;
  /** Содержит wifi/gsm */
  wifi_gsm?: true;
  /** Ссылка на сайт интернет-магазина с описанием товара */
  url?: string;
  /** Детали возврата (для обратных заказов) */
  return_item_detail?: ReturnItemDetails;
  /** Признак подакцизного товара */
  excise?: boolean;
  /** Реквизиты истинного продавца для данного товара */
  seller?: Seller;
  /** УИН ювелирного изделия */
  jewel_uin?: string;
};

/**
 * Детали возврата товара (для связки с прямым заказом)
 */
export type ReturnItemDetails = {
  /** Номер прямого заказа СДЭК/ИМ */
  direct_order_number: string;
  /** UUID прямого заказа */
  direct_order_uuid: string;
  /** Номер упаковки прямого заказа */
  direct_package_number: string;
};

/**
 * Статус сущности (заказа, заявки)
 */
export type Status = {
  /** Код статуса */
  code: string;
  /** Название статуса */
  name: string;
  /** Дата и время установки статуса (ISO 8601) */
  date_time: string;
  /** Дополнительный код статуса (см. Приложение 2) */
  reason_code?: string;
  /** Наименование места возникновения статуса */
  city?: string;
};

/**
 * Базовый ответ на операцию с сущностью (создание, изменение, удаление)
 */
export type EntityOperation = {
  /** Созданная/измененная сущность */
  entity?: {
    /** Уникальный идентификатор сущности (UUID) */
    uuid?: string;
  };
  /** Информация о запросе */
  requests: Request[];
};

/**
 * Печатная форма (Квитанция или ШК)
 */
export type PrintForm = {
  /** Данные печатной формы */
  entity?: {
    /** UUID печатной формы */
    uuid: string;
    /** Список заказов, включенных в ПФ */
    orders: {
      /** UUID заказа */
      order_uuid?: string;
      /** Номер заказа СДЭК */
      cdek_number?: number;
    }[];
    /** Количество копий на странице */
    copy_count?: number;
    /** Тип формы (шаблон) */
    type?: string;
    /** Формат печати (A4-A6) */
    format?: "A4" | "A5" | "A6";
    /** Ссылка на скачивание файла (действует 1 час) */
    url?: string;
    /** Статусы готовности ПФ */
    statuses: Status[];
  };
  /** Информация о запросах на создание ПФ */
  requests: Request[];
};

/**
 * Информация о жизненном цикле запроса
 */
export type Request = {
  /** UUID запроса */
  request_uuid?: string;
  /** Тип запроса (CREATE, UPDATE и т.д.) */
  type: "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "GET";
  /** Дата и время регистрации запроса */
  date_time: string;
  /** Состояние запроса */
  state: "ACCEPTED" | "WAITING" | "SUCCESSFUL" | "INVALID";
  /** Список ошибок (если state = INVALID) */
  errors?: Error[];
  /** Список предупреждений */
  warnings?: Warning[];
};
