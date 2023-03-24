import { AddWebhookResponceState, AddWebhookResponceType } from "./webhook.ts";

export type Error = {
  code: string;
  message: string;
};

export type Warning = {
  code: string;
  message: string;
};

export type Money = {
  value: number;
  vat_sum: number;
  var_rate: number;
};

export type Threshold = {
  threshold: number;
  sum: number;
  vat_sum: number;
  vat_rate: number;
};

export type Location = {
  code?: number;
  fias_guid?: string;
  postal_code?: string;
  longitude?: number;
  latitude?: number;
  country_code?: string;
  region?: string;
  sub_region?: string;
  city?: string;
  kladr_code?: string;
  address: string;
};

export type Request = {
  request_uuid?: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "GET";
  date_time: string;
  state: "ACCEPTED" | "WAITING" | "SUCCESSFUL" | "INVALID";
  errors?: Error[];
  warnings?: Warning[];
};
