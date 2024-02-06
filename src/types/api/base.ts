export type Error = {
  code: string;
  message: string;
};

export type Warning = {
  code: string;
  message: string;
};

export type Money = {
  value?: number;
  vat_sum?: number;
  var_rate?: number;
};

export type Threshold = {
  threshold: number;
  sum: number;
  vat_sum?: number;
  vat_rate?: number;
};

export type Location = {
  code?: number;
  fias_guid?: string;
  postal_code?: string;
  longitude?: number;
  latitude?: number;
  country?: string;
  country_code?: string;
  region?: string;
  region_code?: number;
  sub_region?: string;
  city?: string;
  city_code?: number;
  kladr_code?: string;
  address?: string;
};

export type Contact = {
  company?: string;
  name: string;
  email?: string;
  phones?: Phone[];
  passport_series?: string;
  passport_number?: string;
  passport_date_of_issue?: string;
  passport_organization?: string;
  passport_date_of_birth?: string;
  tin?: string;
  passport_requirements_satisfied?: boolean;
};

export type Phone = {
  number: string;
  additional?: string;
};

export type Seller = {
  name?: string;
  inn?: string;
  phone?: string;
  ownership_form?: number;
  address?: string;
};

export type Service = {
  code: string;
  parameter?: string;
  sum?: number;
  total_sum?: number;
  discount_percent?: number;
  discount_sum?: number;
  vat_rate?: number;
  vat_sum?: number;
};

export type Package = {
  number: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  comment?: string;
  items?: Item[];
};

export type Item = {
  name: string;
  ware_key: string;
  payment: Money;
  cost: number;
  weight: number;
  weight_gross?: number;
  amount: number;
  delivery_amount?: number;
  marking?: string;
  name_i18n?: string;
  brand?: string;
  country_code?: string;
  material?: string;
  wifi_gsm?: true;
  url?: string;
  return_item_detail?: ReturnItemDetails;
  excise?: boolean;
};

export type ReturnItemDetails = {
  direct_order_number: string;
  direct_order_uuid: string;
  direct_package_number: string;
};

export type Status = {
  code: string;
  name: string;
  date_time: string;
  reason_code?: string;
  city?: string;
};

export type EntityOperation = {
  entity?: {
    uuid?: string;
  };
  requests: Request[];
};

export type PrintForm = {
  entity?: {
    uuid: string;
    orders: {
      order_uuid?: string;
      cdek_number?: number;
    }[];
    copy_count?: number;
    type?: string;
    format?: "A4" | "A5" | "A6";
    url?: string;
    statuses: Status[];
  };
  requests: Request[];
};

export type Request = {
  request_uuid?: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "GET";
  date_time: string;
  state: "ACCEPTED" | "WAITING" | "SUCCESSFUL" | "INVALID";
  errors?: Error[];
  warnings?: Warning[];
};
