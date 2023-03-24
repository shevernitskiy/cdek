import type { UpdateType } from "./webhook.ts";

export type OAuth = {
  grant_type: "client_credentials";
  client_id: string;
  client_secret: string;
};

export type Regions = {
  country_codes?: string[];
  region_code?: number;
  kladr_region_code?: string;
  fias_region_guid?: string;
  size?: number;
  page?: number;
  lang?: string;
};

export type addWebhook = {
  url: string;
  type: UpdateType;
};
