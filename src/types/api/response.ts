import type { Entity, Error, Request } from "./base.ts";

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

export type AddWebhook = {
  entity?: Entity;
  requests: Request[];
};

export type AddOrder = {
  entity?: Entity;
  requests: Request[];
  related_entities?: {
    type: string;
    uuid: string;
  };
};
