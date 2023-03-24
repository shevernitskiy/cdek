import type { Error } from "./base.ts";
import type { Warnings } from "./base.ts";

import type { addWebhooksRequests } from "./base.ts";

export type OAuth = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
};

export type Regions = {
  country_code: string;
  country: string;
  region: string;
  prefix?: string;
  region_code?: number;
  kladr_region_code?: string;
  fias_region_guid?: string;
  errors?: Error[];
};

export type addWebhooks = {
  entity?: string;
  uuid?: string;
  requests: addWebhooksRequests[];
  request_uuid?: string;
  type?: string;
  date_time?: string;
  state?: string;
  errors?: Error[];
  warnings?: Warnings[];
};
